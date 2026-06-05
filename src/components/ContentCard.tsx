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

// Verdict tier colors — match the canonical Verdict identity (deep navy + cyan).
// Sourced from .verdict-section CSS variables in src/styles.css.
const VERDICT_TIER_FG: Record<string, string> = {
  Seismic: "var(--verdict-seismic)",
  Major: "var(--verdict-major)",
  Moderate: "var(--verdict-moderate)",
  Marginal: "var(--verdict-marginal)",
};
const VERDICT_TIER_BG: Record<string, string> = {
  Seismic: "rgba(248,113,113,0.12)",
  Major: "rgba(251,146,60,0.12)",
  Moderate: "rgba(250,204,21,0.12)",
  Marginal: "rgba(148,163,184,0.10)",
};

function VerdictTierBadge({ tier }: { tier: string }) {
  const fg = VERDICT_TIER_FG[tier] ?? "var(--verdict-muted)";
  const bg = VERDICT_TIER_BG[tier] ?? "transparent";
  return (
    <span
      className="text-[0.65rem] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase"
      style={{ color: fg, backgroundColor: bg, border: `1px solid ${fg}` }}
    >
      {tier}
    </span>
  );
}

export default function ContentCard({ item }: ContentCardProps) {
  const href = `/${item.form === "article" ? "articles" : "newsletter"}/${item.slug}`;
  const isVerdict = Boolean(item.verdictId);

  if (isVerdict) {
    const tier = item.verdictTier ?? "Marginal";
    return (
      <Link
        to={href}
        className="block rounded-lg border p-5 mb-4 transition-all duration-200 hover:opacity-95"
        style={{
          // Self-contained: scope the verdict CSS variables on this card
          // so it renders correctly outside the Verdict section.
          backgroundColor: "var(--verdict-surface)",
          borderColor: "var(--verdict-border)",
          color: "var(--verdict-text)",
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
        } as React.CSSProperties}
      >
        <div className="flex items-start justify-between gap-6 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span
                className="text-[0.65rem] font-mono font-bold tracking-widest uppercase"
                style={{ color: "var(--verdict-accent)" }}
              >
                The Verdict
              </span>
              <VerdictTierBadge tier={tier} />
              {item.verdictDecision && (
                <span
                  className="text-[0.6rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
                  style={{
                    color: "var(--verdict-muted)",
                    backgroundColor: "var(--verdict-surface-2)",
                  }}
                >
                  {item.verdictDecision}
                </span>
              )}
              {item.verdictJurisdiction && (
                <span
                  className="text-[0.6rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
                  style={{
                    color: "var(--verdict-muted)",
                    backgroundColor: "var(--verdict-surface-2)",
                  }}
                >
                  {item.verdictJurisdiction}
                </span>
              )}
            </div>

            <h2
              className="text-lg font-semibold leading-snug mb-2"
              style={{ color: "var(--verdict-text)" }}
            >
              {item.title}
            </h2>

            {item.summary && (
              <p
                className="text-sm leading-relaxed max-w-prose line-clamp-2"
                style={{ color: "var(--verdict-muted)" }}
              >
                {item.summary}
              </p>
            )}
          </div>

          {item.verdictEdi !== undefined && (
            <div className="text-right shrink-0">
              <div
                className="text-[0.6rem] font-mono tracking-widest mb-1"
                style={{ color: "var(--verdict-muted)" }}
              >
                EDI
              </div>
              <div
                className="text-3xl font-mono font-bold leading-none"
                style={{ color: "var(--verdict-accent)" }}
              >
                {item.verdictEdi.toFixed(1)}
              </div>
              {item.verdictUncertainty !== undefined && item.verdictUncertainty > 0 && (
                <div
                  className="text-[0.55rem] font-mono mt-1"
                  style={{ color: "var(--verdict-muted)" }}
                >
                  ±{item.verdictUncertainty.toFixed(1)}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="flex items-center gap-4 text-[0.6rem] font-mono pt-3 mt-1"
          style={{ borderTop: "1px solid var(--verdict-border)", color: "var(--verdict-muted)" }}
        >
          {item.date && (
            <time>
              {new Date(item.date).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          )}
          {item.verdictDp !== undefined && (
            <span>
              DP <span style={{ color: "var(--verdict-text)" }}>{item.verdictDp.toFixed(2)}</span>
            </span>
          )}
          {item.verdictDr !== undefined && (
            <span>
              DR <span style={{ color: "var(--verdict-text)" }}>{item.verdictDr.toFixed(2)}</span>
            </span>
          )}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 ml-auto">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.55rem] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    color: "var(--verdict-muted)",
                    backgroundColor: "var(--verdict-surface-2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
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

      <Link to={href} className="block">
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