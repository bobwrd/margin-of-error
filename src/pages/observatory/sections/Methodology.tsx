import { Section, Card } from "../shared";
import type { ObservatoryData } from "../types";

export default function Methodology({ data }: { data: ObservatoryData | null }) {
  return (
    <Section id="methodology" eyebrow="Methodology" title="Data, models, and what this is not">
      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Data sources">
          <ul className="space-y-2 text-sm">
            {(data?.sources ?? []).map((s) => (
              <li key={s.name} className="leading-relaxed">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--obs-accent)" }}>
                  {s.name}
                </a>
                {s.id && s.id !== "FRED" && <span className="font-mono text-xs ml-1" style={{ color: "var(--obs-muted)" }}>({s.id})</span>}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            World Bank series are annual and cover every listed country. FRED series are US monthly or quarterly and
            enrich the atlas only when a FRED API key is configured; without it the page falls back to the World Bank
            baseline. Data is refreshed weekly by a scheduled job and baked into the site build.
          </p>
        </Card>

        <Card title="Transformations">
          <ul className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed" style={{ color: "var(--obs-text)" }}>
            <li>Monthly price indices are converted to year-over-year percent change (value vs. the same month a year earlier).</li>
            <li>Productivity growth in Step 1 is the annualised change in GDP per person employed, averaged over the last 5 and 10 years.</li>
            <li>Real wage lines in the Lab are indices (base 100), not levels.</li>
            <li>AI milestone markers (ChatGPT, GPT-4, GPT-4o) are hard-coded reference dates, not derived from data.</li>
          </ul>
        </Card>

        <Card title="The toy model" className="lg:col-span-2">
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--obs-text)" }}>
            The walkthrough scenarios and the Lab share one small, deterministic, New-Keynesian-flavoured system,
            solved one year at a time. A logistic curve represents AI adoption and the productivity flow it
            delivers; an investment term represents the demand side of the build-out; a Phillips curve, a Taylor
            rule, and Okun's law close the loop. Full equations sit behind the <span className="font-mono" style={{ color: "var(--obs-accent)" }}>Details</span> toggles
            in each section and in <span className="font-mono">model.ts</span>.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            <strong style={{ color: "var(--obs-warn)" }}>What it is not:</strong> it is not a forecast, not calibrated to any
            country, and not a structural model. It has no random shocks, no financial sector, no exchange rate, and
            no sectoral detail. It is built to make the <em>direction</em> of effects and the trade-offs between them
            intuitive, and it will happily produce paths that no real economy would follow if you push the sliders to
            extremes. Treat every number as illustrative.
          </p>
        </Card>
      </div>
    </Section>
  );
}
