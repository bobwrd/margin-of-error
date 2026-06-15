import Layout from "@/components/Layout";
import NewsletterSignup from "@/components/NewsletterSignup";
import VerdictButton from "@/components/VerdictButton";
import LedgerButton from "@/components/LedgerButton";
import ObservatoryButton from "@/components/ObservatoryButton";
import { siteConfig } from "@/config/site";
import { Link } from "react-router-dom";

const highlights = [
  {
    href: "/observatory",
    title: "The Observatory — AI, Productivity and Prices",
    summary:
      "An interactive sandbox tracing how AI adoption might flow through to inflation, wages, and who captures the gains. Pick a named scenario or move the sliders yourself. Built to build intuition, not to forecast.",
    tag: "Interactive",
  },
  {
    href: "/verdict/1",
    title: "EU AI Act — Full Entry into Force",
    summary:
      "The world's first comprehensive AI regulation entered into force, establishing a risk-tiered framework with global implications for tech governance. Scored 87.3 EDI — the highest in the database.",
    tag: "The Verdict",
  },
  {
    href: "/others/access-to-justice-the-gap-nobody-measures",
    title: "Access to Justice — The Gap Nobody Measures",
    summary:
      "Most legal systems track case outcomes, not whether people could get to court in the first place. That gap in measurement is a gap in accountability.",
    tag: "Analysis",
  },
  {
    href: "/personal/us-economy-cheap-imports-china",
    title: "Is the US economy harmed by cheap imports from China?",
    summary:
      "Cheap Chinese imports raise aggregate living standards but harm specific workers and create strategic vulnerabilities. What counts as harm has to be defined distributionally and geopolitically, not just by GDP.",
    tag: "Personal Essay",
  },
  {
    href: "/others/issue-002-india-labour",
    title: "What Indian Labour Data Actually Shows",
    summary:
      "Early findings from working through the Periodic Labour Force Survey on sectoral employment trends. The informal sector is more durable than the standard narrative assumes.",
    tag: "Research Notes",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
            {siteConfig.title}
          </h1>
          <p className="text-muted-foreground text-sm mb-0.5">
            Arin Jain · IB Year 1
          </p>
          <p className="text-muted-foreground text-base">{siteConfig.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          <VerdictButton />
          <LedgerButton />
          <ObservatoryButton />
        </div>
      </div>

      {/* Thesis */}
      <div className="mb-12">
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
          I'm Arin — 17, studying economics and law. I'm trying to answer one question: where do formal
          institutions — legal systems, economic policy, regulatory frameworks — fall short of the people
          they are supposed to serve, and why?
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This site is where I work that out: through writing, coded databases, and a working economic sandbox.{" "}
          <Link to="/why" className="text-warm-accent hover:underline">
            Why this question →
          </Link>
        </p>
      </div>

      {/* Start Here */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">
          Start here
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          A few pieces that represent what this site is about.
        </p>
        <div className="flex flex-col gap-5">
          {highlights.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group block border border-border rounded-lg px-5 py-4 hover:border-warm-accent transition-colors duration-150"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {item.tag}
                </span>
              </div>
              <p className="font-semibold text-foreground group-hover:text-warm-accent transition-colors duration-150 mb-1.5">
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <div className="mb-14">
        <NewsletterSignup />
      </div>

      {/* About the project */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-3">
          What this is
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong className="text-foreground">Margin of Error</strong> is a
          personal writing and research hub covering economics, law, and the
          space between formal systems and the people they affect. Essays,
          research notes, and a weekly digest live here.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong className="text-foreground">The Observatory</strong> is an
          interactive explainer on AI, productivity and prices — a walkthrough
          of the transmission channels, a live data atlas covering five countries,
          and a toy model you can drive yourself. A way to explore mechanisms, not a forecast.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong className="text-foreground">The Verdict</strong> is a
          structured database of AI-related legal and regulatory events —
          each case scored on a transparent five-factor methodology to make
          the policy landscape scannable and comparable across jurisdictions.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          <strong className="text-foreground">The Ledger</strong> is a coded
          database of MAS (Monetary Authority of Singapore) enforcement
          actions, built to surface patterns in how Singapore's financial
          regulator actually exercises its powers.
        </p>
        <Link
          to="/about"
          className="text-sm text-warm-accent hover:underline"
        >
          Full project overview →
        </Link>
      </section>

      {/* Footer status */}
      <div className="border-t border-border pt-6 pb-2">
        <p className="text-xs text-muted-foreground">
          Last updated: June 2026. Currently working on: a quantitative paper on Indian sectoral employment
          using PLFS data (2017–2024), and CivicAid (legal literacy tool for Singapore, MVP in progress).
        </p>
      </div>
    </Layout>
  );
}
