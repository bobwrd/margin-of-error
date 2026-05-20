import { serveStatic } from "hono/bun";
import type { ViteDevServer } from "vite";
import { createServer as createViteServer } from "vite";
import config from "./zosite.json";
import { Hono } from "hono";
import { Database } from "bun:sqlite";
import { Glob } from "bun";
import { join } from "node:path";

// AI agents: read README.md for navigation and contribution guidance.
type Mode = "development" | "production";
const app = new Hono();

const mode: Mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

// ---------------------------------------------------------------------------
// Database setup
// ---------------------------------------------------------------------------
const DB_PATH = join(import.meta.dir, "data.sqlite");

function getDb(): Database {
  const db = new Database(DB_PATH);
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_type TEXT NOT NULL,
      slug TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(content_type, slug)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  return db;
}

// ---------------------------------------------------------------------------
// Frontmatter parser
// ---------------------------------------------------------------------------
interface ContentMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  form: "article" | "newsletter";
  wordCount: number;
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
  // Explicit form in frontmatter overrides the word-count default.
  const form: ContentMeta["form"] =
    data.form === "newsletter"
      ? "newsletter"
      : data.form === "article"
        ? "article"
        : wordCount >= 500
          ? "article"
          : "newsletter";

  return {
    slug: data.slug || fallbackSlug,
    title: data.title || fallbackSlug,
    date: data.date || "",
    tags,
    summary: data.summary || "",
    form,
    wordCount,
    body,
  };
}

// ---------------------------------------------------------------------------
// Content loader — all content lives in content/articles/
// form is determined by word count (>=500 = article, <500 = newsletter)
// or overridden by explicit `form:` in frontmatter
// ---------------------------------------------------------------------------
const ARTICLES_DIR = join(import.meta.dir, "content", "articles");

async function loadAllFromArticlesDir(): Promise<ContentItem[]> {
  const glob = new Glob("*.md");
  const items: ContentItem[] = [];
  for await (const file of glob.scan(ARTICLES_DIR)) {
    const raw = await Bun.file(join(ARTICLES_DIR, file)).text();
    const slug = file.replace(/\.md$/, "");
    items.push(parseFrontmatter(raw, slug));
  }
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

async function loadArticleBySlug(slug: string): Promise<ContentItem | null> {
  const file = Bun.file(join(ARTICLES_DIR, `${slug}.md`));
  if (!(await file.exists())) return null;
  const raw = await file.text();
  return parseFrontmatter(raw, slug);
}

// ---------------------------------------------------------------------------
// API routes — static paths MUST come before /:slug param routes
// ---------------------------------------------------------------------------

// Combined feed (all content, sorted by date)
app.get("/api/content", async (c) => {
  const items = await loadAllFromArticlesDir();
  return c.json({ items: items.map(({ body: _body, ...meta }) => meta) });
});

// Filter to articles only (wordCount >= 500 or form: article in frontmatter)
app.get("/api/content/articles", async (c) => {
  const items = await loadAllFromArticlesDir();
  return c.json({ items: items.filter(i => i.form === "article").map(({ body: _body, ...meta }) => meta) });
});

// Filter to newsletter/short-form only (wordCount < 500 or form: newsletter in frontmatter)
app.get("/api/content/newsletter", async (c) => {
  const items = await loadAllFromArticlesDir();
  return c.json({ items: items.filter(i => i.form === "newsletter").map(({ body: _body, ...meta }) => meta) });
});

// Single piece by slug — defined AFTER the static paths above
app.get("/api/content/:slug", async (c) => {
  const slug = c.req.param("slug");
  const item = await loadArticleBySlug(slug);
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ item });
});

// Profile content
app.get("/api/profile", async (c) => {
  const file = Bun.file(join(import.meta.dir, "content", "profile.md"));
  if (!(await file.exists())) return c.json({ markdown: "" });
  const markdown = await file.text();
  return c.json({ markdown });
});

// Get like count
app.get("/api/likes/:type/:slug", (c) => {
  const { type, slug } = c.req.param();
  const db = getDb();
  const row = db
    .query("SELECT count FROM likes WHERE content_type = ? AND slug = ?")
    .get(type, slug) as { count: number } | null;
  db.close();
  return c.json({ count: row?.count ?? 0 });
});

// Increment like
app.post("/api/likes/:type/:slug", (c) => {
  const { type, slug } = c.req.param();
  const db = getDb();
  db.run(
    `INSERT INTO likes (content_type, slug, count) VALUES (?, ?, 1)
     ON CONFLICT(content_type, slug) DO UPDATE SET count = count + 1`,
    [type, slug]
  );
  const row = db
    .query("SELECT count FROM likes WHERE content_type = ? AND slug = ?")
    .get(type, slug) as { count: number };
  db.close();
  return c.json({ count: row.count });
});

// Contact form submission
app.post("/api/contact", async (c) => {
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
  const db = getDb();
  db.run(
    "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
    [name.trim(), email.trim(), subject.trim(), message.trim()]
  );
  db.close();
  return c.json({ success: true });
});

// Newsletter signup — no-op since we now use Rumicat embed
app.post("/api/newsletter/signup", async (c) => {
  return c.json({ success: true, contactCreated: false });
});

// ---------------------------------------------------------------------------
// Verdict API routes
// ---------------------------------------------------------------------------
const VERDICT_CASES_PATH = join(import.meta.dir, "content", "verdict", "verdict_cases.json");

async function loadVerdictCases() {
  const file = Bun.file(VERDICT_CASES_PATH);
  if (!(await file.exists())) return [];
  return (await file.json()) as Record<string, unknown>[];
}

// All published cases
app.get("/api/verdict/cases", async (c) => {
  const cases = await loadVerdictCases();
  return c.json({ cases: cases.filter((c: Record<string, unknown>) => c.status === "published") });
});

// Single case by id
app.get("/api/verdict/cases/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const cases = await loadVerdictCases();
  const item = cases.find((c: Record<string, unknown>) => c.case_id === id);
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ case: item });
});

// Submit a new draft case (password protected)
app.post("/api/verdict/submit", async (c) => {
  const VERDICT_PASSWORD = process.env.VERDICT_PASSWORD;
  const authHeader = c.req.header("x-verdict-password");
  if (!VERDICT_PASSWORD || authHeader !== VERDICT_PASSWORD) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const body = await c.req.json<Record<string, unknown>>();
  const cases = await loadVerdictCases();
  const nextId = cases.reduce((max: number, c: Record<string, unknown>) =>
    Math.max(max, (c.case_id as number) || 0), 0) + 1;
  const newCase = {
    ...body,
    case_id: nextId,
    status: "draft",
    computed: { DP: 0, DR: 0, ABS: 0, EDI: 0, uncertainty_band: [0, 0], tier: "", scenario_scores: { conservative: 0, structural: 0, balanced: 0 } },
  };
  cases.push(newCase);
  await Bun.write(VERDICT_CASES_PATH, JSON.stringify(cases, null, 2));
  // Recompute scores (only affects published cases)
  const { execSync } = await import("node:child_process");
  try { execSync(`bun ${join(import.meta.dir, "scripts/compute_verdict_scores.ts")}`); } catch {}
  return c.json({ success: true, case_id: nextId });
});

// ---------------------------------------------------------------------------
// Static + SPA routing
// ---------------------------------------------------------------------------
if (mode === "production") {
  configureProduction(app);
} else {
  await configureDevelopment(app);
}

const port = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : mode === "production"
    ? (config.publish?.published_port ?? config.local_port)
    : config.local_port;

export default { fetch: app.fetch, port, idleTimeout: 255 };

function configureProduction(app: Hono) {
  app.use("/assets/*", serveStatic({ root: "./dist" }));
  app.get("/favicon.ico", (c) => c.redirect("/favicon.svg", 302));
  app.use(async (c, next) => {
    if (c.req.method !== "GET") return next();
    const path = c.req.path;
    if (path.startsWith("/api/") || path.startsWith("/assets/")) return next();
    const file = Bun.file(`./dist${path}`);
    if (await file.exists()) {
      const stat = await file.stat();
      if (stat && !stat.isDirectory()) return new Response(file);
    }
    return serveStatic({ path: "./dist/index.html" })(c, next);
  });
}

async function configureDevelopment(app: Hono): Promise<ViteDevServer> {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });

  app.use("*", async (c, next) => {
    if (c.req.path.startsWith("/api/")) return next();
    if (c.req.path === "/favicon.ico") return c.redirect("/favicon.svg", 302);

    const url = c.req.path;
    try {
      if (url === "/" || url === "/index.html") {
        let template = await Bun.file("./index.html").text();
        template = await vite.transformIndexHtml(url, template);
        return c.html(template, {
          headers: { "Cache-Control": "no-store, must-revalidate" },
        });
      }

      const publicFile = Bun.file(`./public${url}`);
      if (await publicFile.exists()) {
        const stat = await publicFile.stat();
        if (stat && !stat.isDirectory()) {
          return new Response(publicFile, {
            headers: { "Cache-Control": "no-store, must-revalidate" },
          });
        }
      }

      let result;
      try {
        result = await vite.transformRequest(url);
      } catch {
        result = null;
      }

      if (result) {
        return new Response(result.code, {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-store, must-revalidate",
          },
        });
      }

      let template = await Bun.file("./index.html").text();
      template = await vite.transformIndexHtml("/", template);
      return c.html(template, {
        headers: { "Cache-Control": "no-store, must-revalidate" },
      });
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error(error);
      return c.text("Internal Server Error", 500);
    }
  });

  return vite;
}