import { useState, useEffect } from "react";
import { marked } from "marked";
import Layout from "@/components/Layout";
import VerdictButton from "@/components/VerdictButton";
import { getProfile } from "@/lib/api";
import { Linkedin, Youtube, FileText } from "lucide-react";

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
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Profile</h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <a
              href="https://linkedin.com/in/arin-jain-69a954270"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/watch?v=GucwscPHSGs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200"
            >
              <Youtube className="size-4" />
              TEDx Talk
            </a>
            <a
              href="https://drive.google.com/file/d/17Zxrc2eKob4WHcAnGsNgLUb-xrgRgJQ_/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200"
            >
              <FileText className="size-4" />
              Download CV
            </a>
          </div>
        </div>
        <VerdictButton />
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