// Bakes all filesystem content into a single JSON module that the
// Cloudflare Pages Function imports at build time. Workers have no
// filesystem at runtime, so content is bundled instead of read on request.
//
// Output: functions/generated/content.json
//   {
//     articles: { "<slug>": "<raw markdown>", ... },
//     profile:  "<raw markdown>",
//     verdictCases: [ ... ]   // parsed array from verdict_cases.json
//   }
//
// Run before `vite build` (see package.json "build" script).

import { readdir, readFile, mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ARTICLES_DIR = join(ROOT, "content", "articles");
const PROFILE_PATH = join(ROOT, "content", "profile.md");
const VERDICT_CASES_PATH = join(ROOT, "content", "verdict", "verdict_cases.json");
const OUT_DIR = join(ROOT, "functions", "generated");
const OUT_PATH = join(OUT_DIR, "content.json");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function bake() {
  const out = { articles: {}, profile: "", verdictCases: [] };

  // Articles
  if (await exists(ARTICLES_DIR)) {
    const files = (await readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const raw = await readFile(join(ARTICLES_DIR, file), "utf8");
      out.articles[file.replace(/\.md$/, "")] = raw;
    }
  }

  // Profile
  if (await exists(PROFILE_PATH)) {
    out.profile = await readFile(PROFILE_PATH, "utf8");
  }

  // Verdict cases
  if (await exists(VERDICT_CASES_PATH)) {
    try {
      out.verdictCases = JSON.parse(await readFile(VERDICT_CASES_PATH, "utf8"));
    } catch (e) {
      console.warn("[bake] verdict_cases.json is not valid JSON, skipping:", e.message);
    }
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(out));

  const count = Object.keys(out.articles).length;
  console.log(
    `[bake] wrote ${OUT_PATH} — ${count} articles, profile ${
      out.profile ? "yes" : "no"
    }, ${out.verdictCases.length} verdict cases`
  );
}

bake().catch((e) => {
  console.error("[bake] failed:", e);
  process.exit(1);
});
