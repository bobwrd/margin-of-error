import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ContentCard from "@/components/ContentCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getAllContent, type ContentMeta, type ContentCategory } from "@/lib/api";

interface CategoryPageProps {
  category: ContentCategory;
  title: string;
  subtitle: string;
  headingExtra?: React.ReactNode;
}

export default function CategoryPage({ category, title, subtitle, headingExtra }: CategoryPageProps) {
  const [items, setItems] = useState<ContentMeta[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div>
          {items.map((item) => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}

      {category !== "short" && (
        <div className="mt-12">
          <NewsletterSignup compact />
        </div>
      )}
    </Layout>
  );
}
