import { Link } from "react-router-dom";
import type { ContentMeta } from "@/lib/api";

interface ContentCardProps {
  item: ContentMeta;
}

export default function ContentCard({ item }: ContentCardProps) {
  const href = `/${item.form === "article" ? "articles" : "newsletter"}/${item.slug}`;

  return (
    <article className="py-6 border-b border-border last:border-0">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            item.form === "newsletter"
              ? "bg-primary/10 text-primary"
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
        <span className="text-xs text-muted-foreground">
          {item.wordCount.toLocaleString()} words
        </span>
      </div>
      <Link to={href} className="group">
        <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
          {item.title}
        </h2>
      </Link>
      {item.summary && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {item.summary}
        </p>
      )}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}