import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Linkedin, Youtube, FileText } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          About
        </h1>
        <p className="text-muted-foreground text-base">
          What Margin of Error is, who's behind it, and what else I'm building.
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-foreground space-y-10">

        {/* MOE */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Margin of Error</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Margin of Error is a personal writing and research hub. The central question it is trying to answer is:
            where do formal institutions — legal systems, economic policy, regulatory frameworks — fall short of the
            people they are supposed to serve, and why?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            That question shows up across three types of content:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Personal essays</strong> — longer, more argued pieces on specific
              economic or legal questions. These usually start with a research question, engage with the evidence, and
              land somewhere opinionated. Most have an accompanying PDF.
            </li>
            <li>
              <strong className="text-foreground">Weekly briefing</strong> — a short weekly digest synthesising
              developments across three broad themes: development and access to justice; everyday microeconomics;
              and technology, AI, and political economy. Auto-generated from a curated set of sources and published
              every Saturday.
            </li>
            <li>
              <strong className="text-foreground">Others</strong> — analysis pieces, research notes, and cross-posts
              from The Verdict that don't fit neatly into either category above.
            </li>
          </ul>
        </section>

        {/* The Verdict */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The Verdict</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The Verdict is a structured, scored database of AI-related legal and regulatory events. The question it is
            trying to answer is: across all the laws, court decisions, and agency actions that are reshaping AI
            governance globally, which ones actually matter — and how much?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Each case is scored on five factors (legislative impact, sectoral effect, enforcement risk, sanction force,
            and policy synergy) to produce a single composite score: the EDI (Event Disruption Index). The methodology
            is fully transparent and designed to make comparisons across jurisdictions meaningful.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The database is updated weekly via an automated scan, with each new case fact-checked against primary
            sources before being published.{" "}
            <Link to="/verdict/about" className="text-warm-accent hover:underline">
              Full methodology →
            </Link>
          </p>
        </section>

        {/* The Ledger */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The Ledger</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The Ledger is a coded database of enforcement actions taken by the MAS (Monetary Authority of Singapore),
            Singapore's central bank and financial regulator. The question it is trying to answer is: how does the MAS
            actually use its powers in practice — against whom, for what, and with what consequences?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Enforcement actions are often buried in press releases and notices. The Ledger structures them into a
            searchable, comparable dataset — each action coded by sector, violation type, sanction, and outcome — so
            patterns in regulatory behaviour become visible.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <Link to="/ledger" className="text-warm-accent hover:underline">
              Browse The Ledger →
            </Link>
          </p>
        </section>

        {/* CivicAid */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">CivicAid</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            CivicAid is a legal literacy app for Singapore, currently in development. It is designed for people who
            encounter legal problems — employment disputes, tenancy issues, consumer rights — but don't know where to
            start or can't afford a lawyer.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The core premise is that legal information should be navigable without a law degree. CivicAid structures
            Singapore's legal aid landscape, relevant statutes, and practical next-steps into something a non-expert
            can actually use.
          </p>
        </section>

        {/* Research */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Research</h2>
          <p className="text-muted-foreground leading-relaxed">
            I'm working on an economics research paper analysing sectoral employment trends in India using PLFS
            (Periodic Labour Force Survey) data. The paper looks at how structural shifts in employment — particularly
            the movement between formal and informal sectors, and across agriculture, manufacturing, and services —
            map onto policy interventions over the last decade.
          </p>
        </section>

        {/* About me */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">About me</h2>
          <p className="text-muted-foreground leading-relaxed mb-5">
            I'm Arin Jain, currently in IB Year 1. I study economics and law and am interested in the gap between how
            institutions are designed and how they actually function — especially for people who have least access to
            them.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://linkedin.com/in/arin-jain-69a954270"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200 no-underline"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/watch?v=GucwscPHSGs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200 no-underline"
            >
              <Youtube className="size-4" />
              TEDx Talk
            </a>
            <a
              href="https://drive.google.com/file/d/17Zxrc2eKob4WHcAnGsNgLUb-xrgRgJQ_/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200 no-underline"
            >
              <FileText className="size-4" />
              Download CV
            </a>
          </div>
        </section>

      </div>
    </Layout>
  );
}
