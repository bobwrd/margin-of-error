This file provides guidance when working with code in this repository. The README.md should ALWAYS serve as an accurate, comprehensive piece of documentation for this project. It should describe the broader goals and purpose of this repository along with the technical implementation details. If any aspect of the project changes, the README.md should be updated to reflect that.

# Project Notes

**Margin of Error** — a personal writing hub for articles, newsletter issues, a public profile, and **The Verdict** (AI policy intelligence database). Built as a Zo Site (Bun + Hono backend, React + Vite frontend).

## The Verdict

A structured database of AI-related legal and regulatory events at `/verdict`. Has its own visual identity (deep navy + cyan accent, independent dark/light toggle stored in `localStorage["verdict-theme"]`).

### Content
- Cases: `content/verdict/verdict_cases.json` — array of VerdictCase objects
- Setup notes: `content/verdict/setup_notes.txt`
- Weekly radar: `content/verdict/weekly_radar/verdict_radar_YYYY-MM-DD.md` (written by automation)

### Score computation
Run after adding/publishing a case:
```bash
bun scripts/compute_verdict_scores.ts
```
Recomputes all published cases. Drafts are excluded from normalisation.

### Newsletter export
```bash
bash scripts/export_verdict_newsletter.sh
```
Outputs `content/verdict/newsletter_draft.txt` — last 30 days of published cases.

### Submit page password
Set `VERDICT_PASSWORD` in `zosite.json` → `env` (dev) and `publish.env` (production). Currently set to `CHANGE_ME` — replace with your actual password. The submit form at `/verdict/submit` sends this in the `x-verdict-password` header.

### API routes (add to server.ts, before static routing)
- `GET /api/verdict/cases` — all published cases
- `GET /api/verdict/cases/:id` — single case
- `POST /api/verdict/submit` — submit draft (requires `x-verdict-password` header)

### Pages
- `/verdict` — index with timeline, filters, case cards
- `/verdict/:id` — case detail with radar chart, DP/DR dimensions, uncertainty band
- `/verdict/charts` — scatter (DP vs DR) and bar (ranked EDI) charts
- `/verdict/about` — full methodology
- `/verdict/submit` — password-protected submission form

### Weekly automation
Every Monday 8:00 AM SGT — searches for AI governance events, saves to `content/verdict/weekly_radar/`, emails to arinjain.mail@gmail.com. Automation ID: `f6c26062-f40e-4f9a-b7aa-ad1743e63344`.

### Visual identity
- Background: `#0a0e1a` (dark) / `#f8fafc` (light)
- Accent: `#22d3ee` (cyan)
- Tier colours: Seismic=red, Major=orange, Moderate=yellow, Marginal=slate
- Verdict section CSS is scoped under `.verdict-section` and `.verdict-section.verdict-light` in `src/styles.css`

---

## Content Tasks

All written content lives in `content/articles/` — both long-form and short-form pieces.

### Add a new piece

1. Create `content/articles/<slug>.md`
2. Add frontmatter:
   ```
   ---
   slug: my-slug
   title: My Title
   date: 2026-05-13
   tags: economics, law
   summary: One sentence summary.
   ---

   Body content in Markdown here.
   ```
3. The piece is live immediately — no restart needed.

### Long-form vs short-form

Form is determined automatically by word count:
- **Short-form**: fewer than 500 words → `form: newsletter`
- **Long-form**: 500+ words → `form: article`

To override (flag a shorter piece as long-form, or vice versa), add `form: article` or `form: newsletter` to the frontmatter:
```
form: article   # always treated as long-form, regardless of word count
form: newsletter # always treated as short-form, regardless of word count
```

### Add or edit a new static page (e.g. a "Tools" page)

1. Create `src/pages/MyPage.tsx` as a React component wrapped in `<Layout>`.
2. Add a route in `src/App.tsx`:
   ```tsx
   import MyPage from "./pages/MyPage";
   <Route path="/tools" element={<MyPage />} />
   ```
3. Add to the nav by editing `src/config/site.ts` — just append to `navItems`:
   ```ts
   { label: "Tools", href: "/tools" },
   ```

### Add a new section with its own route and nav entry

Same as above — one entry in `navItems`, one `<Route>` in App.tsx, one page file.

### Edit the profile

Edit `content/profile.md` directly. It's plain Markdown — no TypeScript needed. Changes are live immediately.

### Add a new API route

Add it in `server.ts` before the `configureProduction` / `configureDevelopment` calls. Follow the existing Hono pattern.

---

# Documentation

This is a **Zo Site** - a web application running on a user's Zo computer that combines:
- **Backend**: Bun + Hono server with API routes
- **Frontend**: React + Vite with client-side routing, shadcn/ui components, and Tailwind CSS 4
- **Single Process**: Vite runs in middleware mode (no separate dev server)

## Architecture

### File Structure

```
.
├── server.ts              # Main server (Hono + Vite middleware + all API routes)
├── index.html             # HTML entry point for React
├── vite.config.ts         # Vite configuration (@/ alias → src/)
├── package.json
├── zosite.json            # Zo deployment config
├── data.sqlite            # SQLite DB (auto-created; likes, contacts, signups)
├── content/               # All written content — edit by hand
│   └── articles/          # One .md file per article
├── public/                # Static assets
└── src/
    ├── main.tsx
    ├── App.tsx            # React router — add new routes here
    ├── styles.css
    ├── config/
    │   └── site.ts        # Nav items, site metadata — single source of truth
    ├── lib/
    │   └── api.ts         # Client-side fetch helpers for all API endpoints
    ├── components/
    │   ├── Layout.tsx     # Page shell with Nav and footer
    │   ├── Nav.tsx        # Top nav bar (reads from site.ts)
    │   ├── ContentCard.tsx # Card for articles/newsletter in list views
    │   ├── LikeButton.tsx  # Heart button with persisted count (localStorage + SQLite)
    │   ├── NewsletterSignup.tsx  # Signup form (compact and full variants)
    │   ├── AuthorBox.tsx   # "About the author" box for article/newsletter pages
    │   └── theme-provider.tsx
    └── pages/
        ├── Home.tsx        # Combined feed with All/Articles/Newsletter filter
        ├── Articles.tsx    # Articles list
        ├── ArticlePage.tsx # Single article (/articles/:slug)
        ├── Newsletter.tsx  # Newsletter list
        ├── NewsletterPage.tsx  # Single issue (/newsletter/:slug)
        ├── Profile.tsx     # Renders content/profile.md
        └── Contact.tsx     # Contact form → SQLite
```

### Content format

Markdown files with YAML frontmatter:

```
---
slug: my-slug
title: My Title
date: 2026-05-13
tags: tag1, tag2
summary: One sentence summary.
---

Markdown body here.
```

Titles with special characters should be quoted: `title: "My Title: Subtitle"`.

### Database (data.sqlite)

Three tables, auto-created on first run:
- `likes` — per-content like counts (`content_type`, `slug`, `count`)
- `contact_submissions` — contact form entries
- `newsletter_signups` — email + optional name

### API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/feed` | Combined articles + newsletter, sorted by date |
| GET | `/api/content/articles` | All articles (metadata only) |
| GET | `/api/content/articles/:slug` | Single article with body |
| GET | `/api/content/newsletter` | All newsletter issues (metadata only) |
| GET | `/api/content/newsletter/:slug` | Single issue with body |
| GET | `/api/profile` | Profile markdown |
| GET | `/api/likes/:type/:slug` | Like count |
| POST | `/api/likes/:type/:slug` | Increment like |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter/signup` | Newsletter signup |

### Site config

`src/config/site.ts` holds the nav items, site title, tagline, and author. To add a new nav item, append to `navItems` — the Nav component reads this array directly.

### Development vs Production

**Development Mode** (`bun run dev`):
- Single Bun process running `server.ts`
- Vite in middleware mode transforms files on-the-fly
- API routes: `/api/*` handled by Hono
- React app: served via Vite transforms
- Client-side routing: any non-API, non-file route falls back to `index.html`

**Production Mode** (`bun run prod`):
- Builds React app to `dist/` using Vite
- Bun serves static files from `dist/` via `hono/bun` serveStatic
- API routes still handled by Hono

NEVER use the scripts `bun run dev` or `bun run prod`. The Zo system handles running the site.

## Viewing, Verification, and Debugging (agent-browser)

```bash
agent-browser open http://localhost:57493
agent-browser screenshot --full-page
```

## Key Technologies

### ⚠️ IMPORTANT: This is BUN + HONO (NOT Node.js + Express)

- **Bun** as the runtime
- **Hono** as the web framework

### Bun File System Operations

| Operation | API |
|-----------|-----|
| Read file | `Bun.file()` |
| Write file | `Bun.write()` |
| File exists | `Bun.file().exists()` |
| Read directory | `import { readdir } from "node:fs/promises"` |
| Create directory | `import { mkdir } from "node:fs/promises"` |
| Glob files | `new Glob("**/*.md").scan(".")` from `bun` |

### React + Vite
- Tailwind CSS 4 with `@tailwindcss/vite`
- shadcn/ui components in `src/components/ui/`
- Path alias: `@/` → `src/`

## Common Tasks

### Adding API Routes

Add routes in `server.ts` before the `configureProduction` / `configureDevelopment` calls.

### Adding React Components

Create in `src/components/`. Add pages in `src/pages/` and register in `src/App.tsx`.

### Database

```ts
import { Database } from "bun:sqlite";
const db = new Database("data.sqlite");
```

## Important Notes

- `zosite.json` system fields (`local_port`, `published_port`, `entrypoint`) are auto-generated — do not edit.
- `data.sqlite` is auto-created in the project root on first API call.
- Profile content lives in `content/profile.md` — plain Markdown, no TypeScript.
- Nav order and items are controlled entirely by `src/config/site.ts`.

## Deployment

The site exports `{ fetch, port }` from `server.ts`. Same code in dev and production; mode controlled by `NODE_ENV`.
