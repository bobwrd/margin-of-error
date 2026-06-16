import { useEffect } from "react";
import { Section, Card, Eq, Details } from "./shared";
import { REGIME_KEYS, REGIME_META } from "./types";

export default function DistLabMethods() {
  useEffect(() => { document.title = "Margin of Error — The Distribution Lab: Methods"; }, []);
  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-2">
        <div className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "var(--dl-accent)" }}>
          Technical note · Margin of Error
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--dl-text)" }}>
          The Distribution Lab: data, indices and mapping
        </h1>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--dl-muted)" }}>
          How the panels are built, where the numbers come from, how the regime sliders map to outcomes, and where the
          method stops being grounded in observed data. The Lab is a playground for reasoning about distribution, not a
          forecasting tool.
        </p>
      </div>

      <Section id="modes" eyebrow="Two modes" title="History and Playground">
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--dl-text)" }}>
          History mode shows one country across 1990 to 2020. The year scrubber drives three panels at once: the
          distribution (Lorenz curve, Gini, top-10% share, poverty headcount), education-based mobility, and macro and
          wellbeing indicators. A regime bar above the panels shows eight discretised policy and structural dimensions
          for that country-year, with observed values rendered as solid level dots and interpolated ones as hollow.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
          Playground mode turns the regime bar into sliders. Moving a slider asks a different question: among real
          country-years that look like this regime, what did distribution, mobility and wellbeing look like? The answer
          comes from observed episodes, weighted by similarity, never from a fitted black-box model.
        </p>
      </Section>

      <Section id="sources" eyebrow="Data" title="Sources and coverage">
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--dl-text)" }}>
          The dataset covers five visible countries (United States, Sweden, India, Brazil, Nigeria) plus ten calibration
          countries that populate the Playground analogue space but are not shown in the UI. Two source tiers:
        </p>
        <Card title="Group A — World Bank WDI (fetched)">
          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
            GDP per capita (PPP), GNI per capita, Gini, poverty headcount at $2.15/day, education spending, secondary
            enrolment, trade openness, sector value-added shares, self-employment, tax revenue, and GDP per worker. These
            are pulled annually 1990 to 2020 by <code>scripts/distlab/fetch-wdi.mjs</code>. When the live pull is present
            it supersedes the curated benchmark values.
          </p>
        </Card>
        <div className="mt-4" />
        <Card title="Group B — curated (WID, UNDP, OECD, ICTWSS)">
          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
            Top-10% income share (WID), mean years of schooling and HDI (UNDP), union density and bargaining coverage
            (OECD/AIAS ICTWSS), social expenditure (OECD SOCX), minimum-wage-to-median ratio and top marginal income tax
            rate (OECD). These are not in WDI or are too sparse there, so they come from benchmark years and are
            interpolated between. Mobility is GDIM-based (Group C).
          </p>
        </Card>
        <p className="text-xs leading-relaxed mt-4" style={{ color: "var(--dl-muted)" }}>
          Every field carries a source family and an interpolation flag, surfaced in panel tooltips. Values between
          benchmark years are linearly interpolated and never extrapolated beyond a country's observed span.
        </p>
      </Section>

      <Section id="indices" eyebrow="Regime indices" title="How the eight dimensions are built">
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--dl-text)" }}>
          Each regime dimension is a raw metric (or a small blend) normalised to 0 to 1 by min-max scaling across the
          whole country pool, winsorised at the 2nd and 98th percentiles so a single outlier year does not compress the
          scale. The continuous value drives the distance metric; a 5-level bucket drives the display dots.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {REGIME_KEYS.map((k) => (
            <div key={k} className="rounded-lg border p-3" style={{ borderColor: "var(--dl-border)" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--dl-text)" }}>{REGIME_META[k].label}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--dl-muted)" }}>{REGIME_META[k].blurb}</div>
              <div className="text-[0.65rem] font-mono mt-1" style={{ color: "var(--dl-accent)" }}>raw: {REGIME_META[k].rawLabel}</div>
            </div>
          ))}
        </div>
        <Details summary="Blended indices">
          <p>Two dimensions combine more than one raw metric:</p>
          <Eq>tax_progressivity = 0.7 · top_marginal_rate + 0.3 · tax_revenue_%GDP</Eq>
          <Eq>labour_power = 0.6 · union_density + 0.4 · bargaining_coverage</Eq>
          <p>Sector mix is carried as three shares for display, but only the services share feeds the distance metric (the structural axis), so structure is not triple-counted.</p>
        </Details>
      </Section>

      <Section id="mapping" eyebrow="Playground" title="From sliders to outcomes">
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--dl-text)" }}>
          Every observed country-year is a point in the 8-dimensional regime space. For a slider configuration we measure
          the distance from the target to every observed point, weight points by a Gaussian kernel over that distance,
          then take weighted means of the outcome metrics.
        </p>
        <Eq>distance(target, point) = sqrt( Σ wᵢ · (targetᵢ − pointᵢ)² )</Eq>
        <Eq>weight(point) = exp( −distance² / (2 · h²) ),  h = median(distance) · 0.6</Eq>
        <Eq>estimate(metric) = Σ weight · metric / Σ weight</Eq>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--dl-text)" }}>
          Distance is on the raw 0-1 indices, not z-scored. The indices already share a 0-1 scale, and z-scoring would
          amplify a dimension just because countries cluster on it, which is the opposite of what similarity should mean.
          A kernel is used instead of fixed k-nearest-neighbours because it lets weight fade to zero: when no observed
          point is close, the effective neighbour count collapses and the Lab says so rather than quietly averaging the
          k least-bad matches.
        </p>
        <Details summary="Effective neighbour count and the extrapolation gate">
          <p>The number of episodes that actually back an estimate is the effective sample size of the weights:</p>
          <Eq>effectiveN = (Σ weight)² / Σ weight²</Eq>
          <p>
            An estimate is flagged as extrapolation when effectiveN falls below 4, or when the nearest observed point is
            more than 1.0 away in raw index units (roughly an average mismatch of 0.35 per axis across eight axes). In
            that state the panels desaturate, the Lorenz area switches to a hatched fill, and the evidence strip warns
            that there is no close real-world analogue.
          </p>
        </Details>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--dl-text)" }}>
          The evidence drawer lists the highest-weight contributing episodes with their country, year and key outcomes,
          so any simulated state can be traced back to the real observations that produced it.
        </p>
      </Section>

      <Section id="mobility" eyebrow="Mobility" title="The sparsest panel">
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--dl-text)" }}>
          Mobility is education-based and the least complete of the three panels. GDIM reports intergenerational
          education mobility by 10-year birth cohorts, not income decile transitions. From two GDIM-style numbers,
          absolute upward mobility and persistence, the build constructs a 3x3 row-stochastic matrix over bottom, middle
          and top education groups.
        </p>
        <Eq>bottom→stay = 0.25 + 0.55 · persistence    bottom→top = 0.45 · upward_mobility</Eq>
        <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
          This is an approximation, not an observed transition matrix, and it is labelled as such in the panel. Where a
          country-cohort has no usable GDIM coverage, the panel shows an explicit data-not-available state rather than a
          fabricated matrix. In Playground mode the matrix shown is the nearest analogue country's, marked accordingly.
        </p>
      </Section>

      <Section id="limits" eyebrow="Limits" title="What this is not">
        <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
          The Lab does not estimate causal effects. Moving a slider does not predict what would happen if a country
          changed that policy; it shows what distribution looked like in real episodes with a similar regime, which mixes
          policy with everything else those countries had going on. Correlations in the analogue space are not treatment
          effects. The curated benchmark values are rounded and interpolated, so trends are more reliable than any single
          year. Nothing here is policy advice.
        </p>
      </Section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t" style={{ borderColor: "var(--dl-border)" }}>
        <a href="/lab" className="text-sm hover:underline" style={{ color: "var(--dl-accent)" }}>← Back to the Lab</a>
      </div>
    </div>
  );
}
