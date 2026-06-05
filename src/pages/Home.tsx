import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllContent, type ContentMeta } from "@/lib/api";
import { siteConfig } from "@/config/site";

export default function Home() {
  const [feed, setFeed] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllContent().then((items) => {
      // Sort by date desc so the home page and category pages order match.
      setFeed(
        [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      );
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          {siteConfig.title}
        </h1>
        <p className="text-muted-foreground text-base">{siteConfig.tagline}</p>
      </div>

      <div className="mb-10">
        <NewsletterSignup />
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
      ) : feed.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Nothing here yet.</div>
      ) : (
        <div>
          {feed.map((item) => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </Layout>
  );
}
