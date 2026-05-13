import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getNewsletterIssues, type ContentMeta } from "@/lib/api";

export default function Newsletter() {
  const [issues, setIssues] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsletterIssues().then((items) => {
      setIssues(items);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Short-form</h1>
        <p className="text-sm text-muted-foreground">
          Quick takes and observations — under 500 words.
        </p>
      </div>

      <div className="mb-8">
        <NewsletterSignup />
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
      ) : issues.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Nothing published yet.
        </div>
      ) : (
        <div>
          {issues.map((item) => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </Layout>
  );
}