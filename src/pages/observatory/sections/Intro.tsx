export default function Intro() {
  return (
    <section id="intro" className="scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14">
        <div className="max-w-3xl">
          <div
            className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--obs-accent)" }}
          >
            The Observatory
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
            style={{ color: "var(--obs-text)" }}
          >
            AI, Productivity and Prices
          </h1>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed" style={{ color: "var(--obs-text)" }}>
            How could AI affect productivity, inflation and who gets the gains over time, and
            what does the data so far suggest about where we are in that process?
          </p>
          <div className="mt-6 space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            <p>
              This is not a forecast. It is a way to walk the channels that run from AI adoption to
              prices and wages, look at the real series that would move if those channels were
              active, and then play with a toy model to build intuition for the trade-offs.
            </p>
            <p>
              Read top to bottom: a short conceptual walkthrough, then a live data atlas, then a
              sandbox you can drive yourself. Anywhere you see a{" "}
              <span className="font-mono" style={{ color: "var(--obs-accent)" }}>Details</span> toggle,
              the underlying assumptions and math are tucked behind it.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { href: "#walkthrough", label: "1 · Walkthrough" },
              { href: "#atlas", label: "2 · Data atlas" },
              { href: "#lab", label: "3 · Lab" },
            ].map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="rounded-full border px-3.5 py-1.5 text-xs font-mono transition-colors"
                style={{ borderColor: "var(--obs-border)", color: "var(--obs-text)", backgroundColor: "var(--obs-surface)" }}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
