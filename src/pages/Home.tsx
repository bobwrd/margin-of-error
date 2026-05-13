import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getFeed, type ContentMeta } from "@/lib/api";
import { siteConfig } from "@/config/site";

type Filter = "all" | "article" | "newsletter";

export default function Home() {
  const [feed, setFeed] = useState<ContentMeta[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeed().then((items) => {
      setFeed(items);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "all" ? feed : feed.filter((i) => i.type === filter);

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          {siteConfig.title}
        </h1>
        <p className="text-muted-foreground text-base">{siteConfig.tagline}</p>
      </div>

      <div className="mb-8">
        <NewsletterSignup />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {(["all", "article", "newsletter"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors capitalize ${
              filter === f
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "article" ? "Articles" : "Newsletter"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </div>
      ) : (
        <div>
          {filtered.map((item) => (
            <ContentCard key={`${item.type}:${item.slug}`} item={item} />
          ))}
        </div>
      )}
    </Layout>
  );
}
