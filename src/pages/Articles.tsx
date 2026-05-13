import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getArticles, type ContentMeta } from "@/lib/api";

export default function Articles() {
  const [articles, setArticles] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then((items) => {
      setArticles(items);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Articles</h1>
        <p className="text-sm text-muted-foreground">Essays and analysis.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
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
