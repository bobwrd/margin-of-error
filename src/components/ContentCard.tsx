import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { ContentMeta } from "@/lib/api";

interface ContentCardProps {
  item: ContentMeta;
}

function readTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

// Verdict tier accent color for the left stripe + tier badge text.
// Colors match the Verdict section identity (cyan accent + tier-coded tints).
const TIER_ACCENT: Record<string, string> = {
  Seismic: "#f87171",   // red
  Major: "#fb923c",     // orange
  Moderate: "#facc15",  // yellow
  Marginal: "#94a3b8",  // slate
};

function tierAccent(tier: string): string {
  return TIER_ACCENT[tier] ?? TIER_ACCENT.Marginal;
}

function VerdictTierBadge({ tier }: { tier: string }) {
  const accent = tierAccent(tier);
  return (
    <span
      className="text-[0.6rem] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded uppercase"
      style={{ color: accent, border: `1px solid ${accent}` }}
    >
      {tier}
    </span>
  );
}

export default function ContentCard({ item }: ContentCardProps) {
  const articleHref = `/${item.form === "article" ? "articles" : "newsletter"}/${item.slug}`;
  const isVerdict = Boolean(item.verdictId);

  if (isVerdict) {
    const tier = item.verdictTier ?? "Marginal";
    const accent = tierAccent(tier);
    return (
      <Link
        to={`/verdict/${item.verdictId}`}
        className="group relative block py-7 border-b border-border last:border-0 transition-all duration-200"
        style={{ paddingLeft: "1.25rem" } as CSSProperties}
      >
        {/* Left vertical accent stripe — tier-coded */}
        <span
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded"
          style={{ backgroundColor: accent }}
        />

        {/* Verdict metadata row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[0.65rem] font-mono font-bold tracking-widest uppercase"
            style={{ color: "var(--verdict-accent, #0891b2)" } as CSSProperties}
          >
            The Verdict
          </span>
          <VerdictTierBadge tier={tier} />
          {item.verdictDecision && (
            <span className="text-[0.6rem] font-mono tracking-wider uppercase text-muted-foreground/70">
              {item.verdictDecision}
            </span>
          )}
          {item.verdictJurisdiction && (
            <span className="text-[0.6rem] font-mono tracking-wider uppercase text-muted-foreground/60">
              {item.verdictJurisdiction}
            </span>
          )}
          {item.verdictEdi !== undefined && (
            <span className="text-[0.6rem] font-mono tracking-wider text-muted-foreground/70">
              EDI <span className="font-semibold text-foreground">{item.verdictEdi.toFixed(1)}</span>
            </span>
          )}
          {item.date && (
            <time className="text-xs text-muted-foreground ml-auto">
              {new Date(item.date).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          )}
        </div>

        <h2 className="text-lg font-semibold text-foreground group-hover:text-warm-accent transition-colors duration-150 leading-snug mb-2">
          {item.title}
        </h2>

        {item.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-prose">
            {item.summary}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground/80 bg-secondary px-2.5 py-0.5 rounded-full transition-colors duration-150"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    );
  }

  return (
    <article className="group py-7 border-b border-border last:border-0 transition-all duration-200">
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium tracking-wide ${
            item.form === "newsletter"
              ? "bg-warm-accent-muted text-warm-accent"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {item.form === "newsletter" ? "Short-form" : "Long-form"}
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
        <span className="text-xs text-muted-foreground/70">
          {readTime(item.wordCount)}
        </span>
      </div>

      <Link to={articleHref} className="block">
        <h2 className="text-lg font-semibold text-foreground group-hover:text-warm-accent transition-colors duration-150 leading-snug mb-2">
          {item.title}
        </h2>
      </Link>

      {item.summary && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-prose">
          {item.summary}
        </p>
      )}

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground/80 bg-secondary px-2.5 py-0.5 rounded-full transition-colors duration-150 hover:bg-secondary/80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}