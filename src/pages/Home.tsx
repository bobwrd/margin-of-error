import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllContent, type ContentMeta } from "@/lib/api";
import { siteConfig } from "@/config/site";

type Filter = "all" | "article" | "newsletter";

export default function Home() {
  const [feed, setFeed] = useState<ContentMeta[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllContent().then((items) => {
      // Sort by date desc so the home page and /articles page order match.
      setFeed(
        [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      );
      setLoading(false);
    });
  }, []);

  const filtered: ContentMeta[] =
    filter === "all"
      ? feed
      : feed.filter((item) => item.form === filter);

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

      <div className="flex items-center gap-2 mb-8">
        {(["all", "article", "newsletter"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors duration-150 capitalize ${
              filter === f
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "article" ? "Long-form" : "Short-form"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Nothing here yet.</div>
      ) : (
        <div>
          {filtered.map((item) => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </Layout>
  );
}
