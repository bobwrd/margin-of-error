import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllContent, type ContentMeta } from "@/lib/api";
import { siteConfig } from "@/config/site";
import type { VerdictCase } from "./verdict/types";

type Filter = "all" | "article" | "newsletter";

interface VerdictCardProps {
  item: VerdictCase;
}

const TIER_COLORS: Record<string, string> = {
  Seismic: "#f87171",
  Major: "#fb923c",
  Moderate: "#facc15",
  Marginal: "#94a3b8",
};

function VerdictCard({ item }: VerdictCardProps) {
  const tier = item.computed.tier;
  const accentColor = TIER_COLORS[tier] ?? "#94a3b8";
  const band = item.computed.uncertainty_band;

  return (
    <article
      className="py-7 border-b border-border last:border-0"
      style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: "1rem", marginLeft: "-1rem" }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="text-[0.6rem] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded"
          style={{ color: accentColor, backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}40` }}
        >
          The Verdict
        </span>
        <span
          className="text-[0.6rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
          style={{ color: accentColor, backgroundColor: `${accentColor}12`, border: `1px solid ${accentColor}30` }}
        >
          {tier}
        </span>
        {item.date && (
          <time className="text-xs text-muted-foreground">
            {new Date(item.date).toLocaleDateString("en-SG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </div>

      <Link to={`/verdict/${item.case_id}`} className="group">
        <h2 className="text-lg font-semibold text-foreground leading-snug mb-2 group-hover:opacity-80 transition-opacity">
          {item.title}
        </h2>
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-muted-foreground font-mono">
          EDI{" "}
          <span className="font-bold" style={{ color: accentColor }}>
            {item.computed.EDI.toFixed(1)}
          </span>
          <span className="opacity-60"> ±[{band[0].toFixed(1)}, {band[1].toFixed(1)}]</span>
        </span>
        <span className="text-xs text-muted-foreground">{item.jurisdiction}</span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {item.summary}
      </p>
    </article>
  );
}

type FeedItem =
  | { kind: "content"; item: ContentMeta }
  | { kind: "verdict"; item: VerdictCase };

export default function Home() {
  const [feed, setFeed] = useState<ContentMeta[]>([]);
  const [verdictCases, setVerdictCases] = useState<VerdictCase[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllContent(),
      fetch("/api/verdict/cases", { headers: { Accept: "application/json" } })
        .then((r) => r.json())
        .then((d) => (d.cases ?? []) as VerdictCase[])
        .catch(() => [] as VerdictCase[]),
    ]).then(([content, cases]) => {
      setFeed(content);
      setVerdictCases(cases.filter((c) => c.computed.tier === "Seismic" || c.computed.tier === "Major"));
      setLoading(false);
    });
  }, []);

  // Merge and sort by date
  const mergedFeed: FeedItem[] = [
    ...feed.map((item): FeedItem => ({ kind: "content", item })),
    ...verdictCases.map((item): FeedItem => ({ kind: "verdict", item })),
  ].sort((a, b) => {
    const dateA = a.kind === "content" ? a.item.date : a.item.date;
    const dateB = b.kind === "content" ? b.item.date : b.item.date;
    return dateB.localeCompare(dateA);
  });

  const filtered: FeedItem[] =
    filter === "all"
      ? mergedFeed
      : mergedFeed.filter((f) => f.kind === "content" && f.item.form === filter);

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

      <div className="flex items-center gap-2 mb-8">
        {(["all", "article", "newsletter"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors duration-150 capitalize ${
              filter === f
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "article" ? "Long-form" : "Short-form"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Nothing here yet.</div>
      ) : (
        <div>
          {filtered.map((entry) =>
            entry.kind === "verdict" ? (
              <VerdictCard key={`verdict:${entry.item.case_id}`} item={entry.item} />
            ) : (
              <ContentCard key={`content:${entry.item.slug}`} item={entry.item} />
            )
          )}
        </div>
      )}
    </Layout>
  );
}
