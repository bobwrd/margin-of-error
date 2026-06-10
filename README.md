This file provides guidance when working with code in this repository. The README.md should ALWAYS serve as an accurate, comprehensive piece of documentation for this project. It should describe the broader goals and purpose of this repository along with the technical implementation details. If any aspect of the project changes, the README.md should be updated to reflect that.

# Project Notes

**Margin of Error** — a personal writing hub for articles, newsletter issues, a public profile, and **The Verdict** (AI policy intelligence database). Built as a Zo Site (Bun + Hono backend, React + Vite frontend).

## The Verdict

A structured database of AI-related legal and regulatory events at `/verdict`. Has its own visual identity (deep navy + cyan accent, independent dark/light toggle stored in `localStorage["verdict-theme"]`).

**The Verdict is not in the top nav.** It is reached via a cyan pill button (`src/components/VerdictButton.tsx`) that sits parallel to the main heading of each main page (Home, Weekly Briefing, Personal Pieces, Profile, Contact). The top nav only exposes the writing/profile/contact sections.

### Removed pages

- `Tools` — the curated tools directory at `/tools` was removed; component deleted, route removed from `App.tsx`, nav entry removed. The Verdict button is the replacement entry point for non-writing content.
- `Short-form` — the dedicated `/short-form` page and its legacy `/newsletter` alias were removed. Existing short-form pieces were re-categorized to `category: other` so they surface on the `/others` page; the `/api/content/short` endpoint is now a legacy alias that returns empty.

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
- `/verdict` — index with interactive rotating globe (globe.gl), timeline, filters, case cards
- `/verdict/:id` — case detail with radar chart, DP/DR dimensions, uncertainty band
- `/verdict/charts` — scatter (DP vs DR) and bar (ranked EDI) charts
- `/verdict/about` — full methodology
- `/verdict/submit` — password-protected submission form

### Weekly automation
Every Monday 8:00 AM SGT — searches for AI governance events, saves to `content/verdict/weekly_radar/`, emails to arinjain.mail@gmail.com, and creates a cross-post article in `content/articles/`. Automation ID: `f6c26062-f40e-4f9a-b7aa-ad1743e63344`.

### Visual identity
- Background: `#0a0e1a` (dark) / `#f8fafc` (light)
- Accent: `#22d3ee` (cyan)
- Tier colours: Seismic=red, Major=orange, Moderate=yellow, Marginal=slate
- Verdict section CSS is scoped under `.verdict-section` and `.verdict-section.verdict-light` in `src/styles.css`

### List/Grid view toggle

The Home page and category pages (`/weekly`, `/personal`, `/others`) expose a list/grid toggle in the top-right of the feed. The selected mode is persisted in `localStorage["moe-view-mode"]` and shared across pages. Verdict items (`verdictId` set) always render in the original list style regardless of the toggle — they keep the left tier-stripe and the dense metadata row used on the Verdict index. Implementation: `src/components/ViewToggle.tsx` plus the `variant` prop on `ContentCard`.

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

### Content categories

Every piece in `content/articles/` belongs to one of three active categories. Set it explicitly in frontmatter — this is the only field the site uses to route content:

- `category: other` — anything that doesn't fit weekly or personal: Verdict AI-policy takes, newsletter-style observations, ad-hoc essays (e.g. `issue-001-welcome`, the EU AI Act briefs, `us-economy-cheap-imports-china`)
- `category: weekly` — the auto-generated weekly digest produced by the Monday automation (Monday 8 AM SGT)
- `category: personal` — long-form pieces the author writes by hand; the `pdf:` field embeds the PDF above the body, and the bibliography sits below

Example frontmatter:
```
---
slug: my-piece
title: My Piece
date: 2026-05-13
tags: economics, law
summary: One sentence summary.
pdf: /pdfs/my-piece.pdf        # optional — personal pieces only
category: personal              # required
---
```

If `category` is missing, the system falls back to the legacy word-count rule (`form: article` for ≥500 words, `form: newsletter` otherwise). Long-form pieces without an explicit category default to `weekly`, so a new personal piece **must** be tagged `category: personal` to route correctly. The fallback is only there to keep older content working.

### Personal pieces (PDF + bibliography)

Personal pieces are written by the author and distributed as a PDF. To add one:

1. Place the PDF at `public/pdfs/<slug>.pdf` (served at `/pdfs/<slug>.pdf`)
2. In the markdown frontmatter, set `pdf: /pdfs/<slug>.pdf` and `category: personal`
3. The body of the markdown can include the bibliography below the body text — the `## Bibliography` heading and following entries are rendered normally. PDF sits above the body, bibliography sits below — no other wiring needed.

The body itself can also include a short summary, author notes, or be left empty. The three existing examples are `us-economy-cheap-imports-china`, `remote-work-redefined-productivity`, and `singapore-ai-driven-economic-future`.

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
    │   ├── ContentCard.tsx # Card for articles/newsletter — list (default) and grid variants. Verdict items always render in list style.
    │   ├── ViewToggle.tsx  # List/grid toggle for Home + category pages; persists in localStorage["moe-view-mode"]
    │   ├── LikeButton.tsx  # Heart button with persisted count (localStorage + SQLite)
    │   ├── NewsletterSignup.tsx  # Signup form (compact and full variants)
    │   ├── AuthorBox.tsx   # "About the author" box for article/newsletter pages
    │   └── theme-provider.tsx
    └── pages/
        ├── Home.tsx        # Combined feed (no filters — just lists all content, newest first)
        ├── ShortForm.tsx   # Wraps CategoryPage with category="short"
        ├── WeeklyBriefing.tsx  # Wraps CategoryPage with category="weekly"
        ├── PersonalPieces.tsx  # Wraps CategoryPage with category="personal"
        ├── CategoryPage.tsx    # Shared list-page component for all 3 categories
        ├── ArticlePage.tsx # Single piece — handles /short-form/:slug, /weekly/:slug, /personal/:slug
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
| GET | `/api/content` | Combined feed (all categories), sorted by date |
| GET | `/api/content/short` | Legacy alias for `category: short` (now empty — short-form pieces were re-categorized to `other`) |
| GET | `/api/content/weekly` | Weekly briefings (`category: weekly`) |
| GET | `/api/content/personal` | Personal pieces (`category: personal`) |
| GET | `/api/content/other` | Other pieces (`category: other`) |
| GET | `/api/content/articles` | Legacy alias for `weekly` + `personal` (combined) |
| GET | `/api/content/newsletter` | Legacy alias for `short` |
| GET | `/api/content/:slug` | Single piece by slug (any category) |
| GET | `/api/profile` | Profile markdown |
| GET | `/api/likes/:type/:slug` | Like count |
| POST | `/api/likes/:type/:slug` | Increment like |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter/signup` | Newsletter signup (no-op) |

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

The site is hosted on **Cloudflare Pages** (frontend) + **Pages Functions** (the `/api/*` backend in `functions/api/[[route]].ts`) + **Cloudflare D1** (database). Content is synced from Google Drive by a scheduled GitHub Action (`.github/workflows/sync-drive.yml`), which commits to `main` and triggers a Cloudflare rebuild.

Build: `npm run build` runs `scripts/bake-content.mjs` (bakes `content/` into `functions/generated/content.json`, since Workers have no filesystem) then `vite build` → `dist/`.

Full one-time setup steps (D1, Cloudflare, Google service account, GitHub secrets) are in **`SETUP.md`**.

The legacy Bun server (`server.ts`, `zosite.json`) is retained for reference and local dev only; it is not used by the Cloudflare deployment.
