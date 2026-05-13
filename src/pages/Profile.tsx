import { useState, useEffect } from "react";
import { marked } from "marked";
import Layout from "@/components/Layout";
import { getProfile } from "@/lib/api";

export default function Profile() {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then((markdown) => {
      setHtml(marked.parse(markdown) as string);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Profile</h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-base prose-p:leading-7 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-lg prose-a:text-foreground prose-a:underline-offset-2 prose-li:text-base"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </Layout>
  );
}
