import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import ViewToggle, { readStoredView, type ViewMode } from "@/components/ViewToggle";
import { getAllContent, type ContentMeta, type ContentCategory } from "@/lib/api";

const VIEW_STORAGE_KEY = "moe-view-mode";

interface CategoryPageProps {
  category: ContentCategory;
  title: string;
  subtitle: string;
  headingExtra?: React.ReactNode;
}

export default function CategoryPage({ category, title, subtitle, headingExtra }: CategoryPageProps) {
  const [items, setItems] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>(() => readStoredView(VIEW_STORAGE_KEY, "list"));

  useEffect(() => {
    getAllContent().then((all) => {
      setItems(
        all
          .filter((i) => i.category === category)
          .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      );
      setLoading(false);
    });
  }, [category]);

  // Render verdict items always in list style; others follow the toggle.
  const renderItem = (item: ContentMeta) => (
    <ContentCard
      key={item.slug}
      item={item}
      variant={item.verdictId ? "list" : view}
    />
  );

  return (
    <Layout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {headingExtra}
      </div>

      {category === "short" && (
        <div className="mb-8">
          <NewsletterSignup />
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Nothing published yet.
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-end">
            <ViewToggle value={view} onChange={setView} storageKey={VIEW_STORAGE_KEY} />
          </div>
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : ""}>
            {items.map(renderItem)}
          </div>
        </>
      )}

      {category !== "short" && (
        <div className="mt-12">
          <NewsletterSignup compact />
        </div>
      )}
    </Layout>
  );
}
