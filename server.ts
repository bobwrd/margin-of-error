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
  db.run(`
    CREATE TABLE IF NOT EXISTS newsletter_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
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
  type: "article" | "newsletter";
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
      type: "article",
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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  const tags = data.tags
    ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  return {
    slug: data.slug || fallbackSlug,
    title: data.title || fallbackSlug,
    date: data.date || "",
    tags,
    summary: data.summary || "",
    type: (data.type as ContentMeta["type"]) || "article",
    body,
  };
}

// ---------------------------------------------------------------------------
// Content loader
// ---------------------------------------------------------------------------
const CONTENT_DIR = join(import.meta.dir, "content");

async function loadAllContent(type: "articles" | "newsletter"): Promise<ContentItem[]> {
  const dir = join(CONTENT_DIR, type);
  const glob = new Glob("*.md");
  const items: ContentItem[] = [];
  for await (const file of glob.scan(dir)) {
    const raw = await Bun.file(join(dir, file)).text();
    const slug = file.replace(/\.md$/, "");
    const item = parseFrontmatter(raw, slug);
    item.type = type === "articles" ? "article" : "newsletter";
    items.push(item);
  }
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

async function loadContentItem(
  type: "articles" | "newsletter",
  slug: string
): Promise<ContentItem | null> {
  const filePath = join(CONTENT_DIR, type, `${slug}.md`);
  const file = Bun.file(filePath);
  if (!(await file.exists())) return null;
  const raw = await file.text();
  const item = parseFrontmatter(raw, slug);
  item.type = type === "articles" ? "article" : "newsletter";
  return item;
}

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

// Combined feed
app.get("/api/feed", async (c) => {
  const [articles, newsletter] = await Promise.all([
    loadAllContent("articles"),
    loadAllContent("newsletter"),
  ]);
  const feed = [...articles, ...newsletter]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ body: _body, ...meta }) => meta);
  return c.json({ items: feed });
});

// Articles list
app.get("/api/content/articles", async (c) => {
  const items = await loadAllContent("articles");
  return c.json({ items: items.map(({ body: _body, ...meta }) => meta) });
});

// Single article
app.get("/api/content/articles/:slug", async (c) => {
  const slug = c.req.param("slug");
  const item = await loadContentItem("articles", slug);
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ item });
});

// Newsletter list
app.get("/api/content/newsletter", async (c) => {
  const items = await loadAllContent("newsletter");
  return c.json({ items: items.map(({ body: _body, ...meta }) => meta) });
});

// Single newsletter issue
app.get("/api/content/newsletter/:slug", async (c) => {
  const slug = c.req.param("slug");
  const item = await loadContentItem("newsletter", slug);
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ item });
});

// Profile content
app.get("/api/profile", async (c) => {
  const file = Bun.file(join(CONTENT_DIR, "profile.md"));
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

// Newsletter signup
app.post("/api/newsletter/signup", async (c) => {
  const body = await c.req.json<{ email: string; name?: string }>();
  const { email, name } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "A valid email is required." }, 400);
  }
  const db = getDb();
  try {
    db.run("INSERT INTO newsletter_signups (email, name) VALUES (?, ?)", [
      email.trim(),
      name?.trim() ?? null,
    ]);
    db.close();
    return c.json({ success: true });
  } catch {
    db.close();
    return c.json({ error: "Already subscribed." }, 409);
  }
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
