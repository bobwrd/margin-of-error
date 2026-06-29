import { useEffect } from "react";
import Intro from "./sections/Intro";
import BacklogMap from "./sections/BacklogMap";
import Bottlenecks from "./sections/Bottlenecks";
import Tracker from "./sections/Tracker";
import IndoSing from "./sections/IndoSing";
import Methodology from "./sections/Methodology";

export default function DocketIndex() {
  useEffect(() => {
    document.title = "The Docket — Indian Court Backlogs · Margin of Error";
  }, []);

  return (
    <>
      <Intro />
      <BacklogMap />
      <Bottlenecks />
      <Tracker />
      <IndoSing />
      <Methodology />

      {/* Cross-links */}
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-4 border-t"
        style={{ borderColor: "var(--docket-border)" }}
      >
        <p className="text-xs mb-3" style={{ color: "var(--docket-muted)" }}>
          Related work on Margin of Error:
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="/verdict" className="hover:underline" style={{ color: "var(--docket-accent)" }}>
            The Verdict — AI regulation as it happens →
          </a>
          <a href="/ledger" className="hover:underline" style={{ color: "var(--docket-accent)" }}>
            The Ledger — MAS enforcement actions →
          </a>
          <a href="/others/access-to-justice-the-gap-nobody-measures" className="hover:underline" style={{ color: "var(--docket-accent)" }}>
            Access to Justice — the gap nobody measures →
          </a>
          <a href="/why" className="hover:underline" style={{ color: "var(--docket-accent)" }}>
            Why this question →
          </a>
        </div>
      </div>
    </>
  );
}
