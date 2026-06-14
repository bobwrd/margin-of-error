import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend,
} from "recharts";
import { Section, Card, Caption, Details, Eq, useChartTheme } from "../shared";
import { useObservatoryTheme } from "../ObservatoryLayout";
import {
  buildLab, simulate, describeLab, labLabel, DEFAULT_SLIDERS, type LabSliders,
} from "../model";

const SLIDERS: { key: keyof LabSliders; label: string; lo: string; hi: string }[] = [
  { key: "adoptionSpeed", label: "Speed of AI adoption", lo: "slow", hi: "fast" },
  { key: "wageShare", label: "Share of AI gains going to wages", lo: "profits", hi: "wages" },
  { key: "hawkishness", label: "Central bank hawkishness", lo: "dovish", hi: "hawkish" },
  { key: "labourReplace", label: "Labour-replacing vs complementing", lo: "complement", hi: "replace" },
];

function Slider({
  label, lo, hi, value, onChange,
}: {
  label: string; lo: string; hi: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--obs-text)" }}>{label}</label>
        <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ color: "var(--obs-accent)", backgroundColor: "var(--obs-accent-dim)" }}>
          {labLabel(value)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="obs-range w-full"
      />
      <div className="flex justify-between text-[0.65rem] font-mono mt-0.5" style={{ color: "var(--obs-muted)" }}>
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  );
}

function OutChart({
  title, data, lines, unit, target,
}: {
  title: string;
  data: Record<string, number>[];
  lines: { key: string; name: string; color: string }[];
  unit: string;
  target?: number;
}) {
  const { theme } = useObservatoryTheme();
  const ct = useChartTheme(theme);
  return (
    <Card title={title}>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 14, bottom: 2, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
            <XAxis dataKey="year" tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={ct.tick} axisLine={false} tickLine={false} width={36} />
            <Tooltip contentStyle={ct.tooltip} formatter={(v: number, n) => [`${v}${unit}`, n]} labelFormatter={(l) => `Year ${l}`} />
            {target != null && <ReferenceLine y={target} stroke="var(--obs-muted)" strokeDasharray="4 4" />}
            {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }} />}
            {lines.map((l) => (
              <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function Lab() {
  const [s, setS] = useState<LabSliders>(DEFAULT_SLIDERS);

  const sim = useMemo(() => {
    const { exog, params } = buildLab(s);
    return simulate(exog, params, 0);
  }, [s]);

  const rows = sim.years.map((y, i) => ({
    year: y,
    inflation: sim.inflation[i],
    unemployment: sim.unemployment[i],
    wageHigh: sim.realWageHigh[i],
    wageLow: sim.realWageLow[i],
  }));

  const narrative = useMemo(() => describeLab(s, sim), [s, sim]);

  return (
    <Section id="lab" eyebrow="3 · Lab" title="Drive the model yourself">
      <div className="max-w-3xl mb-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--obs-text)" }}>
        A toy model, not a prediction. Move the sliders and the paths recompute. The point is to feel how
        adoption speed, who captures the gains, and the central bank's stance interact, not to read off numbers.
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card title="Controls" className="lg:col-span-2">
          <div className="space-y-5">
            {SLIDERS.map((sl) => (
              <Slider
                key={sl.key}
                label={sl.label}
                lo={sl.lo}
                hi={sl.hi}
                value={s[sl.key]}
                onChange={(v) => setS((prev) => ({ ...prev, [sl.key]: v }))}
              />
            ))}
          </div>
          <button
            onClick={() => setS(DEFAULT_SLIDERS)}
            className="mt-6 text-xs font-mono px-3 py-1.5 rounded border transition-colors"
            style={{ borderColor: "var(--obs-border)", color: "var(--obs-muted)" }}
          >
            Reset to medium
          </button>

          <div className="mt-5 rounded-lg p-3 text-sm leading-relaxed" style={{ backgroundColor: "var(--obs-surface-2)", color: "var(--obs-text)" }}>
            {narrative}
          </div>
        </Card>

        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
          <OutChart title="Inflation (%)" data={rows} unit="%" target={2} lines={[{ key: "inflation", name: "Inflation", color: "var(--obs-c2)" }]} />
          <OutChart title="Unemployment (%)" data={rows} unit="%" lines={[{ key: "unemployment", name: "Unemployment", color: "var(--obs-c4)" }]} />
          <OutChart
            title="Real wage index (base 100)"
            data={rows}
            unit=""
            lines={[
              { key: "wageHigh", name: "Higher-skill", color: "var(--obs-c1)" },
              { key: "wageLow", name: "Lower-skill", color: "var(--obs-c3)" },
            ]}
          />
          <Card title="How to read this">
            <p className="text-sm leading-relaxed" style={{ color: "var(--obs-muted)" }}>
              Watch the gap between the two wage lines: it widens when adoption is fast, gains tilt to profits,
              and AI is labour-replacing. Inflation and unemployment trade off through the central bank's
              reaction. Try the extremes to see the mechanism clearly.
            </p>
          </Card>
        </div>
      </div>

      <Details summary="Details · functional form & parameters">
        <p>The Lab uses the same engine as the scenarios (one step = one year):</p>
        <Eq>πₑ = ω·π* + (1−ω)·π₋₁</Eq>
        <Eq>y = ρ·y₋₁ + invest − σ·(i₋₁ − π₋₁ − r*)</Eq>
        <Eq>π = πₑ + κ·y − λ·g</Eq>
        <Eq>i = max(0, r* + π* + φπ·(π − π*) + φy·y),  u = u* − Okun·y</Eq>
        <p className="mt-2">Real wages split the labour share of gains across two groups:</p>
        <Eq>pool = g · wageShare</Eq>
        <Eq>highₜ = pool · (1 + 0.8·replace)</Eq>
        <Eq>lowₜ = pool · (1 − 1.7·replace) − 0.6·g·replace</Eq>
        <p className="mt-2">Slider mappings:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Adoption speed</strong> → steepness and timing of the logistic productivity path <em>g</em>, plus the size of the investment hump and how anchored expectations are (faster = less anchored).</li>
          <li><strong>Wage share</strong> → the fraction of <em>g</em> that flows to wages rather than profits.</li>
          <li><strong>Hawkishness</strong> → the Taylor-rule coefficient φπ (1.1 dovish to 2.5 hawkish).</li>
          <li><strong>Labour-replacing vs complementing</strong> → how the labour share splits between the two skill groups, and the displacement drag on lower-skill wages.</li>
        </ul>
        <p className="mt-2">
          What it deliberately omits: stochastic shocks, an explicit financial sector, open-economy/exchange-rate
          effects, sector detail, and any structural microfoundations. It is built for intuition about direction
          and trade-offs, not magnitudes.
        </p>
      </Details>
    </Section>
  );
}
