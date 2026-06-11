# Running the Ledger harvester (to scale past the curated set)

The Ledger ships with a curated, hand-coded set of ~50 MAS enforcement actions. The full MAS register is larger. This guide shows how to pull the complete notice list and code the remainder.

**Why this is a local step.** The MAS enforcement page is JavaScript-rendered, so it can't be scraped with a plain `fetch`. OpenSanctions parses that page daily and publishes a static export. `scripts/harvest_ledger.mjs` pulls that export and turns each MAS notice into a *stub* row. Stubs are not finished data: they fill only what the source exposes reliably (date, title, source URL, respondent names/types). Penalty amounts, violation categories, and statutes still have to be read off each MAS notice and hand-coded. That hand-coding is the dataset's value, so the script never invents it.

## Prerequisites

- Node 18+ (for built-in `fetch`).
- Run from the project root (`margin-of-error/`), with network access.

## Steps

1. **Harvest the full notice list into stubs.**
   ```bash
   node scripts/harvest_ledger.mjs
   ```
   This writes `content/ledger/_harvested_stubs.json`. It skips any notice whose `source_url` already exists in `ledger_actions.json`, so only genuinely new actions appear. Every stub has `coding_confidence: 0` and `action_type`/`violation_category` set to `"TODO"`.

2. **Code the stubs.** Open `_harvested_stubs.json` and, for each stub, open its `source_url` (the MAS notice) and fill in:
   - `action_type` and `violation_category` (use the enums in `codebook.md`)
   - `penalty_amount_sgd`, `prohibition_years`, `statutes`
   - `fi_subtype`, `conduct_start` / `conduct_end` where stated
   - `repeat_offender`, `joint_action_with`, `group` if relevant
   - bump `coding_confidence` to reflect how well-sourced it is (see the scale in `codebook.md`)

   Delete any stub that isn't actually an enforcement action (the OpenSanctions feed occasionally includes non-enforcement notices).

3. **Merge the coded stubs into the dataset.** Move the finished objects from `_harvested_stubs.json` into `ledger_actions.json` (append to the array). Keep `action_id` values unique and contiguous. Then delete `_harvested_stubs.json`.

4. **Recompute and re-validate.**
   ```bash
   node scripts/compute_ledger.mjs
   ```
   This fills `enforcement_lag_days`, regenerates `enforcement_actions.csv`, prints the new totals, and fails loudly on duplicate IDs or malformed dates. Sanity-check the printed penalty totals against MAS's biennial Enforcement Reports.

5. **Commit and push.** The Cloudflare build runs `scripts/bake-content.mjs` automatically, so the new rows go live on deploy. No other wiring is needed.

## Notes

- **Validation discipline.** Before raising any row above confidence 7, confirm the figure against the MAS notice itself, not just secondary reporting.
- **Dates.** Use the MAS publication date. Where only a month is known, set the first of the month and keep `coding_confidence` at 6 or below, noting "(date approximate)" in the summary.
- **Licensing.** OpenSanctions is CC BY-NC 4.0 and is used here only to *enumerate* notices. The coded facts come from MAS (public records). Keep MAS cited as the primary source. This is fine for a non-commercial research project.
- **Re-running.** The script is idempotent against `ledger_actions.json` by `source_url`, so you can run it again later to pick up newly published actions.
