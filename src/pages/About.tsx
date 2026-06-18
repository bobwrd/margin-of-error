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
            Margin of Error is a self-directed, multi-year research project combining economics, law, and coding.
            The central question running across all five subprojects: where do formal institutions — legal systems,
            economic policy, regulatory frameworks — fall short of the people they are supposed to serve, and why?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The project brings together three kinds of work: hand-built structured databases drawn from primary
            regulatory sources, interactive economic models grounded in published theory, and analysis of how
            institutions actually operate in practice. The writing, the models, and the databases are different
            approaches to the same underlying question — applied across AI governance, financial regulation,
            market structure, macroeconomic transmission, and income distribution.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The writing itself takes three forms:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Personal essays</strong> — longer, argued pieces on specific
              economic or legal questions. These usually start with a research question, engage with the evidence, and
              land somewhere opinionated. Most have an accompanying PDF.
            </li>
            <li>
              <strong className="text-foreground">Weekly briefing</strong> — a short weekly digest synthesising
              developments across three themes: development and access to justice; everyday microeconomics;
              and technology, AI, and political economy. Auto-generated from a curated set of sources and published
              every Saturday.
            </li>
            <li>
              <strong className="text-foreground">Others</strong> — analysis pieces, research notes, and cross-posts
              from The Verdict that don't fit neatly into either category above.
            </li>
          </ul>
        </section>

        {/* The Distribution Lab */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The Distribution Lab</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The Distribution Lab is grounded in a cross-country panel of 465 country-years across five countries
            (United States, Sweden, India, Brazil, Nigeria) from 1990 to 2020. History mode shows observed
            distributional and wellbeing data alongside an eight-dimension regime bar — welfare generosity, labour
            power, tax progressivity, minimum wage, education spending, trade openness, informality, structural mix.
            Playground mode maps institutional configurations to outcomes via Gaussian kernel weighting over the
            observed analogue pool, surfacing which real country-years back each estimate and flagging when no close
            match exists.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The research question: does institutional configuration predict distributional outcomes —
            Gini, top-10% income share, poverty headcount, education mobility — and how much does structural context
            condition that relationship? The kernel-weighting method is what makes it possible to answer that
            empirically rather than impressionistically: instead of asserting a relationship, it surfaces
            the actual analogue episodes from the data. Sources: World Bank WDI, WID, UNDP HDR, OECD SOCX and ICTWSS, GDIM.
          </p>
          <p className="text-xs text-muted-foreground mb-3">Started June 2026. Data covers 1990–2020.</p>
          <p className="text-muted-foreground leading-relaxed">
            <Link to="/lab/methods" className="text-warm-accent hover:underline">
              Methods note →
            </Link>
            {" · "}
            <Link to="/lab" className="text-warm-accent hover:underline">
              Open The Distribution Lab →
            </Link>
          </p>
        </section>

        {/* The Arena */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The Arena</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The Arena is an interactive explorer on competition and efficiency built on standard
            industrial organisation models. Four chapters, four research questions: how does the number
            of firms in a market affect price, quality, and slack? How do tournament-style incentives
            shape effort and sabotage? What does the combination of market concentration and behavioural
            distortion produce? And what do antitrust, consumer, and firm-level policy lenses each see
            when they look at the same market?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Every curve is a closed-form model anchored to published IO and experimental literature —
            Bresnahan-Reiss on entry and prices, Aghion et al. on competition and innovation,
            Harbring and Irlenbusch on tournament sabotage, De Loecker et al. on markups.
            All closed-form models you can drive yourself with sliders; there is no data fetch.
            The goal is intuition about mechanisms, not calibrated forecasts.
          </p>
          <p className="text-xs text-muted-foreground mb-3">Started June 2026. No live data — all closed-form models.</p>
          <p className="text-muted-foreground leading-relaxed">
            <Link to="/arena/methods" className="text-warm-accent hover:underline">
              Technical note →
            </Link>
            {" · "}
            <Link to="/arena" className="text-warm-accent hover:underline">
              Open The Arena →
            </Link>
          </p>
        </section>

        {/* The Observatory */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The Observatory</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The Observatory is a toy macro model of how AI adoption flows through to productivity, wages, prices,
            and markups — built to develop intuition about transmission channels rather than produce a forecast.
            Live World Bank and FRED data sit alongside the model across five countries, so you can see which real
            series would move if those channels were active. Three named scenarios and a fully adjustable sandbox
            let you work through the trade-offs yourself.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The model is deliberately simple and all assumptions are visible. The questions it is structured around
            connect directly to ongoing debates in the automation and labour-share literature — particularly how
            the wage-profit split of productivity gains, and the speed of monetary policy response, shape the
            distributional outcome. It engages with Acemoglu and Restrepo's task model and New Keynesian treatments
            of productivity shocks.
          </p>
          <p className="text-xs text-muted-foreground mb-3">Started April 2026. Data refreshed weekly.</p>
          <p className="text-muted-foreground leading-relaxed">
            <Link to="/observatory" className="text-warm-accent hover:underline">
              Open The Observatory →
            </Link>
          </p>
        </section>

        {/* The Verdict */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The Verdict</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The Verdict is a methodology-driven index of AI-related legal and regulatory events — court rulings,
            regulatory decisions, and major corporate actions. The central question: across everything reshaping
            AI governance globally, which decisions actually matter and how much?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Each case is scored on five factors (legal instrument, societal effect, economic reach, structural
            force, and political salience) and combined geometrically into an Enforcement-Driven Index (EDI).
            The EDI is what makes cross-jurisdictional comparison possible — most AI governance commentary
            treats all regulatory events as equally significant; the transparent scoring framework is what
            allows that to be tested rather than assumed. The methodology is fully documented and each score
            includes an uncertainty band from a three-scenario sensitivity analysis.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The database updates weekly via an automated scan; each new case is fact-checked against primary
            sources before publication.
          </p>
          <p className="text-xs text-muted-foreground mb-3">Started March 2025. Updated weekly.</p>
          <p className="text-muted-foreground leading-relaxed">
            <Link to="/verdict/about" className="text-warm-accent hover:underline">
              Full methodology →
            </Link>
            {" · "}
            <Link to="/verdict" className="text-warm-accent hover:underline">
              Browse cases →
            </Link>
          </p>
        </section>

        {/* The Ledger */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">The Ledger</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The Ledger is a hand-built database of enforcement actions taken by the MAS (Monetary Authority of
            Singapore), Singapore's central bank and financial regulator. The question it is trying to answer:
            how does the MAS actually use its powers in practice — against whom, for what, and with what consequences?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Enforcement actions are published as press releases with no cross-case structure. The Ledger codes each
            action by sector, violation type, sanction, and outcome — making it possible to surface summary statistics,
            year-on-year patterns, and cross-sector comparisons from the public record for the first time. The novel
            contribution is not the data itself but the structure: who gets penalised for what, and how that has
            shifted over time.
          </p>
          <p className="text-xs text-muted-foreground mb-3">Started January 2026. Updated as new actions are published.</p>
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
            CivicAid is a legal literacy tool I'm building for Singapore. It is designed for people who encounter legal
            problems — employment disputes, tenancy issues, consumer rights — but don't know where to start or can't
            afford a lawyer.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The premise is that legal information should be navigable without a law degree. CivicAid structures
            Singapore's legal aid landscape, relevant statutes, and practical next steps into something a non-expert
            can actually use. MVP in progress.
          </p>
        </section>

        {/* Research */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Research</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            I'm working on an economics paper analysing sectoral employment trends in India using PLFS
            (Periodic Labour Force Survey) data from 2017 to 2024. The paper looks at structural shifts between formal
            and informal sectors, across agriculture, manufacturing, and services, and how those shifts map onto policy
            interventions over the period.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Early findings on informal sector persistence and non-uniform gender gaps are in the{" "}
            <Link to="/others/issue-002-india-labour" className="text-warm-accent hover:underline">
              research notes →
            </Link>
          </p>
        </section>

        {/* About me */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">About me</h2>
          <p className="text-muted-foreground leading-relaxed mb-5">
            I'm Arin Jain, currently in IB Year 1. I study economics and law and am interested in the gap between how
            institutions are designed and how they actually function — especially for people who have the least access
            to them. Margin of Error has been running since early 2025. The technical side covers data work in Python
            and R, basic econometrics, interactive model implementation in TypeScript, and full-stack web development.
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

        {/* Currently reading */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Currently reading</h2>
          <p className="text-muted-foreground leading-relaxed">
            Acemoglu and Restrepo on AI, automation, and the task model of labour. Working through
            New Keynesian macro slowly — specifically how the standard model handles productivity shocks,
            which is what the Observatory's toy engine is trying to approximate.
          </p>
        </section>

        {/* How this site is built */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">How this site is built</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vite + React + TypeScript, deployed on Cloudflare Workers with a D1 database for dynamic data.
            Weekly content pipelines run automatically via GitHub Actions — the Observatory data refreshes
            every week, The Verdict gets a new scan every Monday morning. Source is public on{" "}
            <a
              href="https://github.com/bobwrd/margin-of-error"
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-accent hover:underline"
            >
              GitHub →
            </a>
          </p>
        </section>

        {/* More */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">More</h2>
          <div className="flex flex-col gap-2">
            <Link to="/why" className="text-sm text-warm-accent hover:underline">
              Why this question — the origin of the institutional-gap question across all five projects →
            </Link>
            <Link to="/changed-my-mind" className="text-sm text-warm-accent hover:underline">
              What I've changed my mind about — positions, evidence, and where I moved →
            </Link>
            <Link to="/changelog" className="text-sm text-warm-accent hover:underline">
              Changelog — what has been added or changed, and when →
            </Link>
          </div>
        </section>

      </div>
    </Layout>
  );
}
