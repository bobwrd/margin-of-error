# Margin of Error — GitHub + Cloudflare + Drive setup

This site now runs on **Cloudflare Pages** (frontend), **Cloudflare Pages
Functions** (the `/api/*` backend, ported from Bun to Hono-on-Workers), and
**Cloudflare D1** (the database for likes, contact submissions, newsletter
signups, and verdict drafts). Content is pulled from your **Google Drive**
"Margin of Error" folder by a scheduled **GitHub Action**.

Flow: Drive → GitHub Action commits to `main` → Cloudflare rebuilds → live.

You only need to do the steps below **once**. After that, everything updates
itself.

---

## What's already in the repo

- `functions/api/[[route]].ts` — the whole API (same routes as before).
- `scripts/bake-content.mjs` — bakes `content/` into a bundle at build time.
- `scripts/sync-drive.mjs` + `.github/workflows/sync-drive.yml` — Drive sync.
- `schema.sql` — D1 tables (also auto-created on first request).
- `wrangler.toml` — Cloudflare config (you'll paste your D1 id here).

Build command is `npm run build` (runs the bake step, then Vite). Output dir is
`dist`.

---

## Step 1 — Push the code to GitHub

From inside `margin-of-error/`:

```bash
git add -A
git commit -m "Port to Cloudflare Pages + D1 + Drive sync"
git branch -M main
git remote add origin https://github.com/<you>/<your-repo>.git
git push -u origin main
```

(The repo is public, so GitHub Actions minutes are free.)

---

## Step 2 — Create the D1 database

1. Install Wrangler and log in (one time):
   ```bash
   npm install
   npx wrangler login
   ```
2. Create the database:
   ```bash
   npx wrangler d1 create margin-of-error-db
   ```
3. Copy the `database_id` it prints into **`wrangler.toml`** (replace
   `REPLACE_WITH_YOUR_D1_DATABASE_ID`), then commit and push.
4. (Optional) create the tables now — they also auto-create on first use:
   ```bash
   npx wrangler d1 execute margin-of-error-db --remote --file=./schema.sql
   ```

---

## Step 3 — Connect the repo to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick your repo.
2. Build settings:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. **Save and Deploy.** The first build will succeed and give you a
   `*.pages.dev` URL.
4. After the first deploy, add the bindings (Pages project → **Settings**):
   - **Functions → D1 database bindings:** add binding **`DB`** → select
     `margin-of-error-db`. (The binding name must be exactly `DB`.)
   - **Environment variables (Production):** add **`VERDICT_PASSWORD`** = your
     real password (this replaces the old `CHANGE_ME`).
5. Re-deploy once (**Deployments → Retry/redeploy**) so the new bindings take
   effect.

That's the website live. Likes, the contact form, and Verdict submit all work
against D1.

---

## Step 4 — Google service account (for the Drive sync)

1. Go to <https://console.cloud.google.com/> → create or pick a project.
2. **APIs & Services → Library →** enable **Google Drive API**.
3. **APIs & Services → Credentials → Create credentials → Service account.**
   Name it anything (e.g. `moe-drive-sync`). Skip the optional roles.
4. Open the new service account → **Keys → Add key → Create new key → JSON.**
   A `.json` file downloads. Keep it safe.
5. Open the JSON, copy the **`client_email`** value (looks like
   `moe-drive-sync@<project>.iam.gserviceaccount.com`).
6. In Google Drive, open the **"Margin of Error"** folder → **Share** → paste
   that `client_email` → give it **Viewer** → Send. (Sharing the top folder
   covers all four sub-folders.)

---

## Step 5 — Add the GitHub secret and run the sync

1. GitHub repo → **Settings → Secrets and variables → Actions → New repository
   secret.**
   - **Name:** `GOOGLE_SERVICE_ACCOUNT_KEY`
   - **Value:** paste the **entire contents** of the JSON key file.
2. (Optional) If you ever move the Drive folder, add a repository **Variable**
   `DRIVE_ROOT_FOLDER_ID` with the new folder id. Otherwise the default id is
   already baked in.
3. Run it once now: **Actions → "Sync content from Google Drive" → Run
   workflow.** It will pull the folders, commit any changes, and that commit
   triggers a Cloudflare redeploy.

After this, the sync runs automatically on the schedule in the workflow (after
your Daily Brief, Weekly Digest, and Verdict Radar automations land in Drive).

---

## How content maps from Drive to the site

| Drive sub-folder  | Goes to                          | Shows on            |
|-------------------|----------------------------------|---------------------|
| Weekly Article    | `content/articles/`              | `/weekly`           |
| Personal Pieces   | `content/articles/`              | `/personal`, `/others` |
| Verdict Radar     | `content/verdict/` + `content/articles/` (cross-posts) | `/verdict`, `/others` |
| Daily Brief       | `content/daily_findings/`        | *(archived only — not shown on the site yet)* |

> **Daily Brief note:** these files are synced into the repo but the site has
> no page for them today. If you want a "Daily" section on the site, say so and
> it's a small add (one page + one nav entry + include them in the bake step).

The category each article lands in is still driven by its `category:`
frontmatter, exactly as before — the sync just places the files; the site
parses them.

---

## Local development

```bash
npm install
npm run build          # bakes content + builds the frontend
npx wrangler pages dev dist   # serves the static site + Functions + a local D1
```

Or for fast frontend-only iteration, the old Vite dev path still exists via the
legacy Bun server (`server.ts`), but the canonical runtime is now Cloudflare.

---

## What changed vs. the Zo version (for reference)

- `server.ts` (Bun) → `functions/api/[[route]].ts` (Hono on Cloudflare). Same
  routes, same JSON shapes, so the React app is unchanged.
- `bun:sqlite` local file → **D1**. Tables are identical, plus a
  `verdict_drafts` table (drafts are stored in D1 since the published database
  now comes from Drive and can't be written back into the bundle).
- Content is read from a **build-time bundle** instead of the filesystem
  (Workers have no fs). Re-baked on every deploy.
- `POST /api/verdict/submit` now stores the draft in D1 instead of appending to
  `verdict_cases.json`. To publish, add the case via Drive as usual.
- `zosite.json` is no longer used for hosting (kept for history only).
