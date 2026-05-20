import { Link } from "react-router-dom";
import type { ContentMeta } from "@/lib/api";

interface ContentCardProps {
  item: ContentMeta;
}

function readTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

export default function ContentCard({ item }: ContentCardProps) {
  const href = `/${item.form === "article" ? "articles" : "newsletter"}/${item.slug}`;

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
