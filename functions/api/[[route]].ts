// Cloudflare Pages Function — the entire /api/* surface.
//
// This is the port of the original Bun + Hono `server.ts`. It keeps every
// route identical so the React frontend needs no changes. Two things differ
// from the Bun version:
//
//   1. Content (articles, profile, verdict cases) is read from a build-time
//      baked JSON module (functions/generated/content.json) instead of the
//      filesystem — Workers have no fs at runtime.
//   2. The dynamic tables (likes, contact submissions, newsletter signups,
//      verdict drafts) live in Cloudflare D1 instead of a local SQLite file.
//
// D1 binding name: DB. Secret: VERDICT_PASSWORD.

import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import baked from "../generated/content.json";

type Bindings = {
  DB: D1Database;
  VERDICT_PASSWORD?: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

// ---------------------------------------------------------------------------
// Baked content
// ---------------------------------------------------------------------------
type Baked = {
  articles: Record<string, string>;
  profile: string;
  verdictCases: Record<string, unknown>[];
};
const CONTENT = baked as Baked;

// ---------------------------------------------------------------------------
// Frontmatter parser (ported verbatim from server.ts)
// ---------------------------------------------------------------------------
interface ContentMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  form: "article" | "newsletter";
  category: "short" | "weekly" | "personal" | "other";
  wordCount: number;
  pdf?: string;
  verdictId?: number;
  verdictTier?: string;
  verdictJurisdiction?: string;
  verdictDecision?: string;
  verdictEdi?: number;
  verdictDp?: number;
  verdictDr?: number;
  verdictUncertainty?: number;
}
interface ContentItem extends ContentMeta {
  body: string;
}

function parseFrontmatter(raw: string, fallbackSlug: string): ContentItem {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      slug: fallbackSlug,
      title: fallbackSlug,
      date: "",
      tags: [],
      summary: "",
      form: "article",
      category: "weekly",
      wordCount: raw.split(/\s+/).filter(Boolean).length,
      body: raw,
    };
  }
  const frontmatter = match[1];
  const body = match[2];
  const data: Record<string, string> = {};
  for (const line of frontmatter.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  const tags = data.tags
    ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const form: ContentMeta["form"] =
    data.form === "newsletter"
      ? "newsletter"
      : data.form === "article"
        ? "article"
        : wordCount >= 500
          ? "article"
          : "newsletter";

  const category: ContentMeta["category"] =
    data.category === "personal" ||
    data.category === "weekly" ||
    data.category === "short" ||
    data.category === "other"
      ? (data.category as ContentMeta["category"])
      : form === "article"
        ? "weekly"
        : "short";

  return {
    slug: data.slug || fallbackSlug,
    title: data.title || fallbackSlug,
    date: data.date || "",
    tags,
    summary: data.summary || "",
    form,
    category,
    wordCount,
    body,
    pdf: data.pdf || undefined,
    verdictId: data.verdictId ? parseInt(String(data.verdictId), 10) : undefined,
  };
}

function loadAllArticles(): ContentItem[] {
  const items: ContentItem[] = [];
  for (const [slug, raw] of Object.entries(CONTENT.articles)) {
    items.push(parseFrontmatter(raw, slug));
  }
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

function loadArticleBySlug(slug: string): ContentItem | null {
  const raw = CONTENT.articles[slug];
  if (raw === undefined) return null;
  return parseFrontmatter(raw, slug);
}

function loadVerdictCases(): Record<string, unknown>[] {
  return CONTENT.verdictCases || [];
}

function stripBody({ body: _body, ...meta }: ContentItem) {
  return meta;
}

// ---------------------------------------------------------------------------
// D1 setup — tables created lazily on first call
// ---------------------------------------------------------------------------
async function ensureSchema(db: D1Database) {
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content_type TEXT NOT NULL,
        slug TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        UNIQUE(content_type, slug)
      )`
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS newsletter_signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        name TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS verdict_drafts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    ),
  ]);
}

// ---------------------------------------------------------------------------
// Content routes — static paths MUST come before /:slug param routes
// ---------------------------------------------------------------------------
app.get("/content", (c) => {
  const items = loadAllArticles();
  const verdictMap: Record<number, Record<string, unknown>> = {};
  for (const vc of loadVerdictCases()) {
    verdictMap[vc.case_id as number] = vc;
  }
  const enriched = items.map((item) => {
    const m = stripBody(item) as ContentMeta;
    if (m.verdictId) {
      const vc = verdictMap[m.verdictId];
      const comp = vc?.computed as Record<string, unknown> | undefined;
      return {
        ...m,
        verdictTier: comp?.tier as string | undefined,
        verdictJurisdiction: vc?.jurisdiction as string | undefined,
        verdictDecision: vc?.decision_type as string | undefined,
        verdictEdi: comp?.EDI as number | undefined,
        verdictDp: comp?.DP as number | undefined,
        verdictDr: comp?.DR as number | undefined,
        verdictUncertainty: comp?.uncertainty_band
          ? (comp.uncertainty_band as number[])[0]
          : undefined,
      };
    }
    return m;
  });
  return c.json({ items: enriched });
});

app.get("/content/weekly", (c) =>
  c.json({
    items: loadAllArticles()
      .filter((i) => i.category === "weekly")
      .map(stripBody),
  })
);
app.get("/content/personal", (c) =>
  c.json({
    items: loadAllArticles()
      .filter((i) => i.category === "personal")
      .map(stripBody),
  })
);
app.get("/content/other", (c) =>
  c.json({
    items: loadAllArticles()
      .filter((i) => i.category === "other")
      .map(stripBody),
  })
);
app.get("/content/short", (c) =>
  c.json({
    items: loadAllArticles()
      .filter((i) => i.category === "short")
      .map(stripBody),
  })
);
// Legacy aliases
app.get("/content/articles", (c) =>
  c.json({
    items: loadAllArticles()
      .filter((i) => i.category === "weekly" || i.category === "personal")
      .map(stripBody),
  })
);
app.get("/content/newsletter", (c) =>
  c.json({
    items: loadAllArticles()
      .filter((i) => i.category === "short")
      .map(stripBody),
  })
);

// Single piece by slug — AFTER static paths
app.get("/content/:slug", (c) => {
  const item = loadArticleBySlug(c.req.param("slug"));
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ item });
});

// Profile
app.get("/profile", (c) => c.json({ markdown: CONTENT.profile || "" }));

// ---------------------------------------------------------------------------
// Likes (D1)
// ---------------------------------------------------------------------------
app.get("/likes/:type/:slug", async (c) => {
  const { type, slug } = c.req.param();
  await ensureSchema(c.env.DB);
  const row = await c.env.DB.prepare(
    "SELECT count FROM likes WHERE content_type = ? AND slug = ?"
  )
    .bind(type, slug)
    .first<{ count: number }>();
  return c.json({ count: row?.count ?? 0 });
});

app.post("/likes/:type/:slug", async (c) => {
  const { type, slug } = c.req.param();
  await ensureSchema(c.env.DB);
  await c.env.DB.prepare(
    `INSERT INTO likes (content_type, slug, count) VALUES (?, ?, 1)
     ON CONFLICT(content_type, slug) DO UPDATE SET count = count + 1`
  )
    .bind(type, slug)
    .run();
  const row = await c.env.DB.prepare(
    "SELECT count FROM likes WHERE content_type = ? AND slug = ?"
  )
    .bind(type, slug)
    .first<{ count: number }>();
  return c.json({ count: row?.count ?? 0 });
});

// ---------------------------------------------------------------------------
// Contact form (D1)
// ---------------------------------------------------------------------------
app.post("/contact", async (c) => {
  const body = await c.req.json<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>();
  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message) {
    return c.json({ error: "All fields are required." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "Invalid email address." }, 400);
  }
  await ensureSchema(c.env.DB);
  await c.env.DB.prepare(
    "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)"
  )
    .bind(name.trim(), email.trim(), subject.trim(), message.trim())
    .run();
  return c.json({ success: true });
});

// Newsletter signup — stored in D1 (was a no-op in the Bun version)
app.post("/newsletter/signup", async (c) => {
  try {
    const body = await c.req.json<{ email?: string; name?: string }>();
    if (body?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      await ensureSchema(c.env.DB);
      await c.env.DB.prepare(
        "INSERT INTO newsletter_signups (email, name) VALUES (?, ?)"
      )
        .bind(body.email.trim(), body.name?.trim() ?? null)
        .run();
      return c.json({ success: true, contactCreated: true });
    }
  } catch {
    /* fall through */
  }
  return c.json({ success: true, contactCreated: false });
});

// ---------------------------------------------------------------------------
// Verdict routes
// ---------------------------------------------------------------------------
app.get("/verdict/cases", (c) =>
  c.json({
    cases: loadVerdictCases().filter((v) => v.status === "published"),
  })
);

app.get("/verdict/cases/:id", (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const item = loadVerdictCases().find((v) => v.case_id === id);
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ case: item });
});

// Submit a draft case. The published verdict database is fed from Google
// Drive, so drafts can't be written back to the bundled file. Instead we
// store the submission in D1 for the author to review and publish via Drive.
app.post("/verdict/submit", async (c) => {
  const expected = c.env.VERDICT_PASSWORD;
  const authHeader = c.req.header("x-verdict-password");
  if (!expected || authHeader !== expected) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const body = await c.req.json<Record<string, unknown>>();
  await ensureSchema(c.env.DB);
  const res = await c.env.DB.prepare(
    "INSERT INTO verdict_drafts (payload) VALUES (?)"
  )
    .bind(JSON.stringify(body))
    .run();
  return c.json({
    success: true,
    draft_id: res.meta.last_row_id,
    note: "Draft stored. Review it in D1 and publish via the Google Drive verdict_cases.json.",
  });
});

export const onRequest = handle(app);
