import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import Layout from "@/components/Layout";
import LikeButton from "@/components/LikeButton";
import AuthorBox from "@/components/AuthorBox";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getNewsletterIssue, type ContentItem } from "@/lib/api";

export default function NewsletterPage() {
  const { slug } = useParams<{ slug: string }>();
  const [issue, setIssue] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getNewsletterIssue(slug).then((item) => {
      if (!item) setNotFound(true);
      else setIssue(item);
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

  if (notFound || !issue) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Issue not found.</p>
          <Link to="/newsletter" className="text-sm underline underline-offset-2">
            ← Back to Newsletter
          </Link>
        </div>
      </Layout>
    );
  }

  const htmlBody = marked.parse(issue.body) as string;

  return (
    <Layout>
      <div className="mb-2">
        <Link
          to="/newsletter"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Newsletter
        </Link>
      </div>

      <div className="mb-3 pt-2">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
          Newsletter
        </span>
      </div>

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight leading-snug mb-3">
          {issue.title}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          {issue.date && (
            <time className="text-sm text-muted-foreground">
              {new Date(issue.date).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {issue.tags.map((tag) => (
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
        <LikeButton contentType="newsletter" slug={issue.slug} />
      </div>

      <AuthorBox />

      <div className="mt-10">
        <NewsletterSignup compact />
      </div>
    </Layout>
  );
}
