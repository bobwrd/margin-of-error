import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import Layout from "@/components/Layout";
import LikeButton from "@/components/LikeButton";
import AuthorBox from "@/components/AuthorBox";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getContentBySlug, type ContentItem } from "@/lib/api";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getContentBySlug(slug).then((result) => {
      if (!result) setNotFound(true);
      else setItem(result);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (notFound || !item) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Not found.</p>
          <Link to="/" className="text-sm underline underline-offset-2">
            ← Home
          </Link>
        </div>
      </Layout>
    );
  }

  const htmlBody = marked.parse(item.body) as string;
  const backLabel = item.form === "article" ? "Long-form" : "Short-form";
  const backHref = item.form === "article" ? "/articles" : "/newsletter";

  return (
    <Layout>
      <div className="mb-2">
        <Link
          to={backHref}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {backLabel}
        </Link>
      </div>

      <div className="mb-3 pt-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            item.form === "newsletter"
              ? "bg-primary/10 text-primary"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {item.form === "newsletter" ? "Short-form" : "Long-form"}
        </span>
        <span className="text-xs text-muted-foreground ml-2">
          {item.wordCount.toLocaleString()} words
        </span>
      </div>

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight leading-snug mb-3">
          {item.title}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          {item.date && (
            <time className="text-sm text-muted-foreground">
              {new Date(item.date).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-base prose-p:leading-7 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-2"
        dangerouslySetInnerHTML={{ __html: htmlBody }}
      />

      <div className="mt-8 flex items-center gap-4">
        <LikeButton contentType={item.form} slug={item.slug} />
      </div>

      <AuthorBox />

      <div className="mt-10">
        <NewsletterSignup compact />
      </div>
    </Layout>
  );
}