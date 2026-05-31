import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { marked } from "marked";
import Layout from "@/components/Layout";
import LikeButton from "@/components/LikeButton";
import AuthorBox from "@/components/AuthorBox";
import NewsletterSignup from "@/components/NewsletterSignup";
import ReadingPreferences from "@/components/ReadingPreferences";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { getContentBySlug, type ContentItem } from "@/lib/api";
import { fetchCase, type VerdictCase } from "./verdict/types";
import VerdictLayout from "./verdict/VerdictLayout";
import VerdictCasePage from "./verdict/VerdictCase";

function readTime(wordCount: number): string {
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [verdictCase, setVerdictCase] = useState<VerdictCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getContentBySlug(slug).then((result) => {
      if (!result) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setItem(result);
      // If verdictId is set, also fetch the case
      if (result.verdictId != null) {
        fetchCase(result.verdictId).then((vc) => {
          setVerdictCase(vc);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (notFound || !item) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <p className="text-muted-foreground mb-4">Not found.</p>
          <Link to="/" className="text-sm underline underline-offset-2">
            ← Home
          </Link>
        </div>
      </Layout>
    );
  }

  // ─── Verdict article ───────────────────────────────────────────────────────
  if (item.verdictId != null && verdictCase) {
    return (
      <VerdictLayout>
        {/* Back */}
        <div className="mb-6">
          <Link
            to="/verdict"
            className="text-xs font-mono transition-opacity hover:opacity-80"
            style={{ color: "var(--verdict-accent)" }}
          >
            ← All cases
          </Link>
        </div>

        {/* Verdict case header (EDI score, tier, jurisdiction) */}
        <div
          className="rounded-lg border p-5 mb-5"
          style={{
            backgroundColor: "var(--verdict-surface)",
            borderColor: "var(--verdict-border)",
          }}
        >
          <div className="flex items-start justify-between gap-6 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {/* Tier badge */}
                <span
                  className="text-[0.65rem] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase"
                  style={{
                    color: "var(--verdict-accent)",
                    backgroundColor: "transparent",
                    border: `1px solid var(--verdict-accent)`,
                  }}
                >
                  {verdictCase.computed.tier}
                </span>
                <span
                  className="text-[0.65rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
                  style={{
                    color: "var(--verdict-muted)",
                    backgroundColor: "var(--verdict-surface-2)",
                  }}
                >
                  {verdictCase.decision_type}
                </span>
                <span
                  className="text-[0.65rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
                  style={{
                    color: "var(--verdict-muted)",
                    backgroundColor: "var(--verdict-surface-2)",
                  }}
                >
                  {verdictCase.jurisdiction}
                </span>
              </div>
              <h1
                className="text-xl font-bold leading-snug mb-2"
                style={{ color: "var(--verdict-text)" }}
              >
                {verdictCase.title}
              </h1>
              <time
                className="text-xs font-mono"
                style={{ color: "var(--verdict-muted)" }}
              >
                {new Date(verdictCase.date).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* EDI score */}
            <div className="text-right shrink-0">
              <div
                className="text-[0.65rem] font-mono tracking-widest mb-1"
                style={{ color: "var(--verdict-muted)" }}
              >
                EDI SCORE
              </div>
              <div
                className="text-5xl font-mono font-bold leading-none"
                style={{ color: "var(--verdict-accent)" }}
              >
                {verdictCase.computed.EDI.toFixed(1)}
              </div>
              <div
                className="text-[0.6rem] font-mono mt-1"
                style={{ color: "var(--verdict-muted)" }}
              >
                [{verdictCase.computed.uncertainty_band[0].toFixed(1)},{" "}
                {verdictCase.computed.uncertainty_band[1].toFixed(1)}]
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--verdict-muted)" }}>
            {verdictCase.summary}
          </p>
        </div>

        {/* Article body (what happened, why it matters, etc.) */}
        {item.body && (
          <div
            className="rounded-lg border p-5 mb-5"
            style={{
              backgroundColor: "var(--verdict-surface)",
              borderColor: "var(--verdict-border)",
            }}
          >
            <div
              className="text-[0.65rem] font-mono tracking-widest uppercase mb-4"
              style={{ color: "var(--verdict-muted)" }}
            >
              Analysis
            </div>
            <div
              className="prose prose-sm max-w-none prose-invert
                prose-p:text-[var(--verdict-text)] prose-p:leading-relaxed
                prose-headings:text-[var(--verdict-text)] prose-headings:font-semibold
                prose-a:text-[var(--verdict-accent)] prose-a:underline
                prose-strong:text-[var(--verdict-accent)]"
              dangerouslySetInnerHTML={{ __html: marked.parse(item.body) as string }}
            />
          </div>
        )}

        {/* Verdict contributor */}
        {verdictCase.contributor && (
          <div
            className="text-xs font-mono text-right"
            style={{ color: "var(--verdict-muted)" }}
          >
            Contributed by {verdictCase.contributor}
          </div>
        )}
      </VerdictLayout>
    );
  }

  // ─── Regular article ────────────────────────────────────────────────────────
  const htmlBody = marked.parse(item.body) as string;
  const backLabel = item.form === "article" ? "Long-form" : "Short-form";
  const backHref = item.form === "article" ? "/articles" : "/newsletter";

  return (
    <Layout>
      <ReadingProgressBar />

      <div className="mb-6">
        <Link
          to={backHref}
          className="text-sm text-muted-foreground hover:text-warm-accent transition-colors duration-150"
        >
          ← {backLabel}
        </Link>
      </div>

      {/* Article header */}
      <header className="mb-10 pb-8 border-b border-border">
        <div className="flex items-center gap-2.5 mb-4">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium tracking-wide ${
              item.form === "newsletter"
                ? "bg-warm-accent-muted text-warm-accent"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {item.form === "newsletter" ? "Short-form" : "Long-form"}
          </span>
          <span className="text-xs text-muted-foreground/70">{readTime(item.wordCount)}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-snug mb-4">
          {item.title}
        </h1>

        <div className="flex items-center gap-3 flex-wrap mb-4">
          {item.date && (
            <time className="text-sm text-muted-foreground">
              {new Date(item.date).toLocaleDateString("en-SG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary text-muted-foreground px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <ReadingPreferences />
      </header>

      {/* Embedded PDF for long-form articles */}
      {item.pdf && (
        <div className="mb-8 rounded-lg border border-border overflow-hidden" style={{ height: "75vh" }}>
          <iframe
            src={item.pdf}
            className="w-full h-full"
            title={`PDF: ${item.title}`}
          />
        </div>
      )}

      {/* Article body */}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none
          prose-p:text-[1.0625rem] prose-p:leading-[1.85] prose-p:mb-5
          prose-headings:font-semibold prose-headings:tracking-tight prose-headings:mt-10 prose-headings:mb-4
          prose-h2:text-xl prose-h3:text-lg
          prose-a:text-warm-accent prose-a:underline-offset-2 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-warm-accent prose-blockquote:border-l-2 prose-blockquote:text-muted-foreground prose-blockquote:pl-4
          prose-code:text-warm-accent prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
          prose-pre:bg-secondary prose-pre:border prose-pre:border-border
          prose-img:rounded-lg prose-img:border prose-img:border-border
          prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: htmlBody }}
      />

      <div className="mt-10 pt-8 border-t border-border flex items-center gap-4">
        <LikeButton contentType={item.form} slug={item.slug} />
      </div>

      <AuthorBox />

      <div className="mt-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-80 shrink-0">
            <NewsletterSignup compact />
          </div>
          <div className="flex-1" />
        </div>
      </div>
    </Layout>
  );
}
