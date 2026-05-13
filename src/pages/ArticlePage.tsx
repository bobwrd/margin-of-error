import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import Layout from "@/components/Layout";
import LikeButton from "@/components/LikeButton";
import AuthorBox from "@/components/AuthorBox";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getArticle, type ContentItem } from "@/lib/api";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getArticle(slug).then((item) => {
      if (!item) setNotFound(true);
      else setArticle(item);
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

  if (notFound || !article) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Article not found.</p>
          <Link to="/articles" className="text-sm underline underline-offset-2">
            ← Back to Articles
          </Link>
        </div>
      </Layout>
    );
  }

  const htmlBody = marked.parse(article.body) as string;

  return (
    <Layout>
      <div className="mb-2">
        <Link
          to="/articles"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Articles
        </Link>
      </div>

      <header className="mb-8 pt-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight leading-snug mb-3">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          {article.date && (
            <time className="text-sm text-muted-foreground">
              {new Date(article.date).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {article.tags.map((tag) => (
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
        <LikeButton contentType="article" slug={article.slug} />
      </div>

      <AuthorBox />

      <div className="mt-10">
        <NewsletterSignup compact />
      </div>
    </Layout>
  );
}
