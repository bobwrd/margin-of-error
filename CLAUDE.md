# Margin of Error — Claude context

Everything you need to know before touching this project.

---

## What this is

Personal writing + research site for Arin Jain (IB Year 1). Three surfaces:

- **Main site** — essays, weekly digest, personal pieces, profile.
- **The Verdict** (`/verdict`) — scored database of AI legal/regulatory events (EDI methodology). Own dark navy theme, own `localStorage["verdict-theme"]` toggle.
- **The Ledger** (`/ledger`) — coded database of MAS enforcement actions. Own amber theme, own toggle.

---

## Hosting (critical — not Zo anymore)

| Thing | Value |
|---|---|
| Live URL | `https://margin-of-error.arinjain-mail.workers.dev` |
| GitHub repo | `https://github.com/bobwrd/margin-of-error` (public) |
| Platform | Cloudflare Workers + Static Assets + D1 |
| Database | D1 `margin-of-error-db` (`b1771055-8bc9-4a97-bfab-e454ad524a01`) |
| Cloudflare account_id | `b6bbf563bb333c202cb99dca976a0cbe` |

**`server.ts` and `zosite.json` are legacy** — the Zo-era Bun server. Not used in production. Don't tell the user to run `bun run dev/prod`.

---

## How deploys work

- **Every `git push` to `main`** → `.github/workflows/deploy.yml` runs `npm run build && wrangler deploy`. No manual step needed.
- **Manual deploy** (immediate): `npm run deploy` from inside `margin-of-error/`.
- **Content sync**: `.github/workflows/sync-drive.yml` pulls Google Drive → commits to `content/` → redeploys. Runs on a schedule after each Zo automation (Daily Brief, Weekly Digest, Verdict Radar).

So: **to ship any change, just `git push`.** The Action handles everything.

```bash
cd "/Users/piyushjain/Desktop/Margin of Error/margin-of-error"
git add -A
git commit -m "your message"
git push
```

---

## Architecture

```
worker.ts          ← Hono app, all /api/* routes (Cloudflare Worker, not Bun)
wrangler.toml      ← Worker config + D1 binding + static-assets path
functions/generated/content.json  ← baked at build time (Workers have no filesystem)
content/           ← articles, profile.md, verdict_cases.json (synced from Drive)
src/               ← React + Vite frontend (unchanged from Zo era)
```

**Content is baked at build time** by `scripts/bake-content.mjs` → `functions/generated/content.json`. Adding a new article or updating `verdict_cases.json` requires a redeploy (the Drive sync handles this automatically; manually just `git push`).

**Dynamic data** (likes, contact submissions, Verdict drafts) → D1, not SQLite. The `data.sqlite` file is legacy.

---

## Content model

All writing is in `content/articles/` as Markdown with YAML frontmatter:

```yaml
slug: my-slug
title: My Title
date: 2026-05-13
category: weekly | personal | other
summary: One sentence.
pdf: /pdfs/my-piece.pdf   # personal pieces only
verdictId: 42             # links to a Verdict case
```

`category` must be set explicitly — it defaults to `weekly` for ≥500-word pieces.

`content/daily_findings/` — archive of Daily Brief files from Zo automation. **Not shown on the site.** Source material for the weekly digest only.

---

## Secrets

| Secret/Var | Where | Purpose |
|---|---|---|
| `VERDICT_PASSWORD` | Cloudflare Worker secrets | Password-gates `/api/verdict/submit` |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secret | Lets `deploy.yml` call `wrangler deploy` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | GitHub Actions secret | Lets `sync-drive.yml` read Drive |
| `DRIVE_ROOT_FOLDER_ID` | GitHub Actions variable | ID of the "Margin of Error" Drive folder |

To update `VERDICT_PASSWORD`: `npx wrangler secret put VERDICT_PASSWORD`

---

## Key files to edit

| Task | File |
|---|---|
| Add/change a nav item | `src/config/site.ts` → `navItems` |
| Add a route | `src/App.tsx` + create `src/pages/MyPage.tsx` |
| Edit the API | `worker.ts` (not `server.ts`) — static paths before param routes |
| Edit the profile page | `content/profile.md` (no rebuild needed, but deploy to go live) |
| Add a personal piece | Drop `.md` in `content/articles/` + PDF in `public/pdfs/` → `git push` |
| Publish a new Verdict case | Edit `content/verdict/verdict_cases.json` + add cross-post article → `git push` |

---

## What's currently on the homepage

The homepage (`src/pages/Home.tsx`) no longer shows the full article feed. It has:

1. **Header** — site title + "Arin Jain · IB Year 1" subtitle + tagline + Verdict/Ledger buttons.
2. **Newsletter signup** widget.
3. **Start here** — 5 hand-curated highlight pieces (hardcoded in `Home.tsx`).
4. **What this is** — short description of MOE, The Verdict, The Ledger + link to `/about`.

The full feed lives on `/weekly`, `/personal`, `/others`.

---

## Known issues / parked work

- **Verdict globe** (`VerdictGlobe.tsx`) fails to render (Earth texture pulled from third-party CDN gets blocked). Wrapped in an `ErrorBoundary` so the page stays healthy — shows "couldn't load" fallback and a manual load button. Fix: self-host the texture or move globe to its own page.
- **Auto-build from Cloudflare dashboard** was disconnected — it was serving "Hello World" instead of the real code. Deployments now come only from the GitHub Action and `npm run deploy`.
