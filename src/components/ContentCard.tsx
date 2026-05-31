import { Link } from "react-router-dom";
import type { ContentMeta } from "@/lib/api";

interface ContentCardProps {
  item: ContentMeta;
}

function readTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

const TIER_COLORS: Record<string, string> = {
  seismic: "bg-red-500/20 text-red-400 border border-red-500/30",
  major: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  moderate: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  marginal: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
};

function TierBadge({ tier }: { tier: string }) {
  const key = tier.toLowerCase();
  const cls = TIER_COLORS[key] ?? TIER_COLORS.marginal;
  return (
    <span className={`text-[0.6rem] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded ${cls}`}>
      {tier}
    </span>
  );
}

export default function ContentCard({ item }: ContentCardProps) {
  const href = `/${item.form === "article" ? "articles" : "newsletter"}/${item.slug}`;
  const isVerdict = Boolean(item.verdictId);

  if (isVerdict) {
    return (
      <article className="group py-7 border-b border-border last:border-0 transition-all duration-200">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[0.65rem] font-mono font-bold tracking-widest uppercase text-cyan-400">
            The Verdict
          </span>
          <TierBadge tier={item.verdictTier ?? ""} />
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

        <Link to={href} className="block">
          <h2 className="text-lg font-semibold text-foreground group-hover:text-cyan-400 transition-colors duration-150 leading-snug mb-2">
            {item.title}
          </h2>
        </Link>

        {item.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-prose">
            {item.summary}
          </p>
        )}

        {item.verdictEdi !== undefined && (
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground/60">
            <span>
              EDI <span className="text-foreground font-medium">{item.verdictEdi.toFixed(1)}</span>
            </span>
            {item.verdictDp !== undefined && (
              <span>
                DP <span className="text-foreground font-medium">{item.verdictDp.toFixed(1)}</span>
              </span>
            )}
            {item.verdictDr !== undefined && (
              <span>
                DR <span className="text-foreground font-medium">{item.verdictDr.toFixed(1)}</span>
              </span>
            )}
            {item.verdictUncertainty !== undefined && item.verdictUncertainty > 0 && (
              <span>
                ±{item.verdictUncertainty.toFixed(1)}
              </span>
            )}
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
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
      </article>
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