import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllContent, type ContentMeta } from "@/lib/api";
import { siteConfig } from "@/config/site";
import { CaseCard } from "./verdict/VerdictIndex";
import type { VerdictCase } from "./verdict/types";
import { fetchCases } from "./verdict/types";
import type { CSSProperties } from "react";

// Same dark-theme variable set that .verdict-section defines in src/styles.css.
// Inlined here so the Verdict case cards render with the canonical Verdict
// look even when they live outside the Verdict section's theme provider.
const VERDICT_DARK_VARS: CSSProperties = {
  "--verdict-bg": "#0a0e1a",
  "--verdict-surface": "#111827",
  "--verdict-surface-2": "#1a2235",
  "--verdict-border": "rgba(34, 211, 238, 0.12)",
  "--verdict-border-hover": "rgba(34, 211, 238, 0.35)",
  "--verdict-accent": "#22d3ee",
  "--verdict-accent-dim": "rgba(34, 211, 238, 0.08)",
  "--verdict-text": "#e2e8f0",
  "--verdict-muted": "#94a3b8",
  "--verdict-seismic": "#f87171",
  "--verdict-major": "#fb923c",
  "--verdict-moderate": "#facc15",
  "--verdict-marginal": "#94a3b8",
};

export default function Home() {
  const [content, setContent] = useState<ContentMeta[]>([]);
  const [verdictCases, setVerdictCases] = useState<VerdictCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllContent(), fetchCases()]).then(([items, cases]) => {
      setContent(items);
      setVerdictCases(cases);
      setLoading(false);
    });
  }, []);

  // Articles: every content item (article or newsletter), newest first.
  const articles = [...content].sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );

  // Verdict: cases sorted by date desc, only published ones (already filtered
  // by the API).
  const verdicts = [...verdictCases].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <Layout>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          {siteConfig.title}
        </h1>
        <p className="text-muted-foreground text-base">{siteConfig.tagline}</p>
      </div>

      <div className="mb-10">
        <NewsletterSignup />
      </div>

      {/* ── The Verdict — rendered with the canonical Verdict section look.
            Same CaseCard component that the /verdict index page uses. ── */}
      {!loading && verdicts.length > 0 && (
        <section
          className="rounded-lg border p-6 mb-14"
          style={{
            ...VERDICT_DARK_VARS,
            backgroundColor: "var(--verdict-bg)",
            borderColor: "var(--verdict-border)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--verdict-text)" }}
            >
              The Verdict
            </h2>
            <Link
              to="/verdict"
              className="text-xs font-mono tracking-wider hover:opacity-80 transition-opacity"
              style={{ color: "var(--verdict-accent)" }}
            >
              See all cases →
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {verdicts.map((c) => (
              <CaseCard key={c.case_id} c={c} />
            ))}
          </div>
        </section>
      )}

      {/* ── Long-form — same listing as /articles ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
          Long-form
        </h1>
        <p className="text-sm text-muted-foreground">
          Essays and analysis — 1,000+ words.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Nothing published yet.
        </div>
      ) : (
        <div>
          {articles.map((item) => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}

      <div className="mt-12">
        <NewsletterSignup compact />
      </div>
    </Layout>
  );
}
