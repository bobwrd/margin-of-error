import Layout from "@/components/Layout";
import NewsletterSignup from "@/components/NewsletterSignup";
import VerdictButton from "@/components/VerdictButton";
import LedgerButton from "@/components/LedgerButton";
import ObservatoryButton from "@/components/ObservatoryButton";
import ArenaButton from "@/components/ArenaButton";
import DistLabButton from "@/components/DistLabButton";
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
          <ArenaButton />
          <DistLabButton />
        </div>
      </div>

      {/* Thesis */}
      <div className="mb-12">
        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
          I'm Arin — 15, studying economics and law. The question running through everything here:
          where do formal institutions — legal systems, economic policy, regulatory frameworks — fall
          short of the people they are supposed to serve, and why?
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Margin of Error is a self-directed research project working toward that question across five
          subprojects. It combines three things: hand-built structured databases drawn from primary
          regulatory sources, interactive economic models grounded in published theory, and analysis
          of how institutions operate in practice. The work draws on data collection, basic econometrics,
          model implementation, and full-stack development. It is still evolving.{" "}
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
          <strong className="text-foreground">Margin of Error</strong> is an
          ongoing research project combining economics, law, and coding. The
          central question — where formal institutions fall short and why — runs
          across five subprojects, each with its own data, methods, and scope.
          Together they cover AI governance, financial regulation, market structure,
          macroeconomic transmission channels, and income distribution. New work
          is added as the question opens into new domains.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong className="text-foreground">The Observatory</strong> is a
          toy macro model tracing how AI adoption flows through to productivity,
          wages, prices, and markups — built to develop intuition about
          transmission channels, not to produce a forecast. Live World Bank and
          FRED data sit alongside the model so you can see which real series
          would move if those channels were active. Connected to ongoing debates
          about automation, labour share, and the wage-profit split.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong className="text-foreground">The Verdict</strong> is a
          methodology-driven index of AI-related legal and regulatory events —
          each case scored on five factors to produce an Enforcement-Driven
          Index (EDI), designed to make cross-jurisdictional comparison rigorous
          and reproducible. The scoring framework is fully transparent and
          documented. The database updates weekly.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong className="text-foreground">The Ledger</strong> is a
          hand-built database of MAS (Monetary Authority of Singapore)
          enforcement actions — coded by sector, violation type, sanction, and
          outcome. The novel contribution: it surfaces summary statistics and
          patterns over time in who gets penalised for what, which is not
          visible from the raw press releases alone.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong className="text-foreground">The Arena</strong> is built on
          standard industrial organisation models — Bertrand and Cournot
          competition, Aghion-style innovation curves, Harbring-Irlenbusch
          tournament incentives — structured into four chapters covering firm
          count and price, effort and sabotage, market outcomes, and policy
          lenses. Closed-form models you can drive yourself; no data fetch.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          <strong className="text-foreground">The Distribution Lab</strong> is
          grounded in a cross-country panel of 465 country-years from 1990 to
          2020. History mode shows observed distributional and wellbeing data
          alongside an eight-dimension regime bar. Playground mode maps
          institutional configurations to outcomes via Gaussian kernel weighting
          over the observed analogue pool — surfacing which real country-years
          back each estimate and flagging when no close analogue exists.
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
