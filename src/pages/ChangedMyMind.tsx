import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function ChangedMyMind() {
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          What I've changed my mind about
        </h1>
        <p className="text-muted-foreground text-base">
          Positions I held, evidence that pushed me off them, and what I think now.
        </p>
      </div>

      <div className="space-y-14 text-sm text-muted-foreground leading-relaxed max-w-prose">

        {/* Entry 1 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            On whether AI regulation can be genuinely cross-jurisdictional
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Updated May 2026</p>

          <p className="mb-4">
            When I started building The Verdict, I assumed the most important regulatory events would be
            the ones with explicit international coordination behind them — joint statements, mutual
            recognition frameworks, treaty-level commitments. The EU AI Act scored high on my Policy
            Synergy factor partly because it claimed to set a global baseline.
          </p>

          <p className="mb-4">
            Working through the cases changed that. The Act has had real downstream effects — companies
            outside the EU redesigning compliance pipelines, other jurisdictions drafting similar
            risk-tier frameworks — but those effects are not the result of coordination. They are the
            result of market pressure. If you want to sell into the EU, you comply. That is Brussels
            Effect, not international governance.
          </p>

          <p className="mb-4">
            The distinction matters. Brussels Effect is fragile in ways that actual coordination is not:
            it depends on the EU remaining a large enough market to be worth the compliance cost, and it
            does not bind anyone who is not selling there. It also tends to produce compliance with the
            letter of the regulation rather than the spirit, because there is no enforcement mechanism
            beyond market access.
          </p>

          <p>
            I still score Policy Synergy highly for cases that align with international frameworks. But I
            weight genuine coordination mechanisms differently from market-driven convergence, and I am
            more sceptical that the latter produces durable governance. The Verdict's methodology page
            has not caught up with this yet —{" "}
            <Link to="/verdict/about" className="text-warm-accent hover:underline">
              that update is in progress →
            </Link>
          </p>
        </section>

        {/* Entry 2 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            On what the informal sector in India actually tells you
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Updated April 2026</p>

          <p className="mb-4">
            My prior going into the PLFS data was that informal sector persistence was primarily a
            failure of policy — that with better enforcement of labour regulations, workers would move
            into formal employment and wages would rise. The standard development economics story.
          </p>

          <p className="mb-4">
            The data does not support a clean version of that story. Informality in India is not
            primarily a compliance failure. It is a structural feature: small firms have strong
            incentives to stay below the thresholds that trigger formal employment obligations, and
            workers in many sectors have limited outside options that would make formal employment
            attractive even if it were offered. The informal sector is also not uniformly low-wage —
            in some sub-sectors, informal piece-rate workers earn more than formal employees in the
            same industry.
          </p>

          <p>
            I now think the more useful frame is not "how do we formalise the informal sector" but
            "what protections can be extended to informal workers without requiring formalisation as
            the gateway." That is a harder policy problem with fewer obvious levers, and it is what
            the research paper is trying to be precise about.{" "}
            <Link to="/others/issue-002-india-labour" className="text-warm-accent hover:underline">
              Early findings →
            </Link>
          </p>
        </section>

        {/* Entry 3 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            On whether access to justice is primarily a funding problem
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Updated February 2026</p>

          <p className="mb-4">
            I started thinking about legal access as a resource allocation problem: not enough legal
            aid, not enough lawyers willing to do pro bono work, not enough courts. The obvious fix
            was more funding.
          </p>

          <p className="mb-4">
            The more I read, the less confident I became in that framing. In systems where legal aid
            funding has increased significantly — parts of England and Wales, some Canadian provinces —
            the access gap has not closed proportionally. The bottleneck is often not funding but
            complexity: the law itself is hard to navigate even with a lawyer, let alone without one.
            Forms, procedures, deadlines, jurisdictional questions. People who give up do not always
            give up because they cannot afford representation. They give up because the process is
            opaque enough that they cannot figure out where to start.
          </p>

          <p>
            That is the premise behind CivicAid — not that it replaces legal aid funding, but that
            navigability is a distinct problem from affordability, and one that is more tractable. You
            can structure information without needing a larger legal aid budget. Whether that actually
            changes outcomes is something I want to test once there is an MVP to test it with.
          </p>
        </section>

        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            Last updated: June 2026. I add to this when I notice I've actually moved, not just refined.
          </p>
        </div>

      </div>
    </Layout>
  );
}
