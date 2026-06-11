import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import VerdictButton from "@/components/VerdictButton";
import LedgerButton from "@/components/LedgerButton";
import ViewToggle, { readStoredView, type ViewMode } from "@/components/ViewToggle";
import { getAllContent, type ContentMeta } from "@/lib/api";
import { siteConfig } from "@/config/site";

const VIEW_STORAGE_KEY = "moe-view-mode";

export default function Home() {
  const [feed, setFeed] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>(() => readStoredView(VIEW_STORAGE_KEY, "list"));

  useEffect(() => {
    getAllContent().then((items) => {
      // Sort by date desc so the home page and category pages order match.
      setFeed(
        [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      );
      setLoading(false);
    });
  }, []);

  const renderItem = (item: ContentMeta) => (
    <ContentCard
      key={item.slug}
      item={item}
      variant={item.verdictId ? "list" : view}
    />
  );

  return (
    <Layout>
      <div className="mb-12 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            {siteConfig.title}
          </h1>
          <p className="text-muted-foreground text-base">{siteConfig.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <VerdictButton />
          <LedgerButton />
        </div>
      </div>

      <div className="mb-10">
        <NewsletterSignup />
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
      ) : feed.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Nothing here yet.</div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-end">
            <ViewToggle value={view} onChange={setView} storageKey={VIEW_STORAGE_KEY} />
          </div>
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : ""}>
            {feed.map(renderItem)}
          </div>
        </>
      )}
    </Layout>
  );
}
