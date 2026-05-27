import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { useVerdictTheme } from "./VerdictLayout";
import { fetchCases, TIER_COLORS, TIER_BG, type VerdictCase } from "./types";
const GlobeComponent = lazy(() =>
    import(/* webpackChunkName: "verdict-globe" */ "./VerdictGlobe").then((m) => ({ default: m.default }))
  );

function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className="text-[0.65rem] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase"
      style={{
        color: TIER_COLORS[tier] ?? "var(--verdict-muted)",
        backgroundColor: TIER_BG[tier] ?? "transparent",
        border: `1px solid ${TIER_COLORS[tier] ?? "var(--verdict-border)"}`,
      }}
    >
      {tier}
    </span>
  );
}

function CompactTimeline({ cases }: { cases: VerdictCase[] }) {
  const { theme } = useVerdictTheme();

  const data = cases.map((c) => ({
    x: new Date(c.date).getTime(),
    y: c.computed.EDI,
    tier: c.computed.tier,
    title: c.title,
    id: c.case_id,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0] }[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div
        className="rounded border p-3 text-xs font-mono"
        style={{
          backgroundColor: theme === "dark" ? "#131929" : "#fff",
          borderColor: "var(--verdict-border)",
          color: "var(--verdict-text)",
        }}
      >
        <div style={{ color: TIER_COLORS[d.tier] }} className="font-bold mb-1">{d.tier}</div>
        <div className="text-[0.7rem] mb-1 max-w-[180px] leading-snug">{d.title}</div>
        <div>EDI: <span style={{ color: "var(--verdict-accent)" }}>{d.y.toFixed(1)}</span></div>
        <div style={{ color: "var(--verdict-muted)" }}>{new Date(d.x).toLocaleDateString("en-SG", { year: "numeric", month: "short" })}</div>
      </div>
    );
  };

  if (data.length === 0) return null;

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 30 }}>
          <XAxis
            dataKey="x"
            type="number"
            domain={["auto", "auto"]}
            tickFormatter={(v) => new Date(v).getFullYear().toString()}
            tick={{ fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "monospace" }}
            axisLine={{ stroke: "var(--verdict-border)" }}
            tickLine={false}
            scale="time"
            name="Date"
          />
          <YAxis
            dataKey="y"
            domain={[1, 10]}
            tick={{ fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "monospace" }}
            axisLine={{ stroke: "var(--verdict-border)" }}
            tickLine={false}
            name="EDI"
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} isAnimationActive>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={TIER_COLORS[entry.tier] ?? "var(--verdict-accent)"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function CaseCard({ c }: { c: VerdictCase }) {
  const { computed } = c;
  const band = computed.uncertainty_band;

  return (
    <Link to={`/verdict/${c.case_id}`} className="block group">
      <article
        className="rounded-lg border p-5 transition-all duration-200"
        style={{
          backgroundColor: "var(--verdict-surface)",
          borderColor: "var(--verdict-border)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--verdict-border-hover)";
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px var(--verdict-accent-dim)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--verdict-border)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <TierBadge tier={computed.tier} />
            <span
              className="text-[0.65rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
              style={{ color: "var(--verdict-muted)", backgroundColor: "var(--verdict-surface-2)" }}
            >
              {c.decision_type}
            </span>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-2xl font-mono font-bold"
              style={{ color: "var(--verdict-accent)" }}
            >
              {computed.EDI.toFixed(1)}
            </div>
            <div className="text-[0.6rem] font-mono" style={{ color: "var(--verdict-muted)" }}>
              ±[{band[0].toFixed(1)}, {band[1].toFixed(1)}]
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-base leading-snug mb-1 group-hover:opacity-90 transition-opacity"
          style={{ color: "var(--verdict-text)" }}
        >
          {c.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-xs font-mono" style={{ color: "var(--verdict-muted)" }}>
          <time>{new Date(c.date).toLocaleDateString("en-SG", { year: "numeric", month: "short", day: "numeric" })}</time>
          <span>·</span>
          <span>{c.jurisdiction}</span>
        </div>

        {/* Summary */}
        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--verdict-muted)" }}>
          {c.summary}
        </p>
      </article>
    </Link>
  );
}

type SortKey = "date" | "edi";
type FilterState = { type: string; jurisdiction: string; tier: string };

export default function VerdictIndex() {
  const [cases, setCases] = useState<VerdictCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("date");
  const [filters, setFilters] = useState<FilterState>({ type: "", jurisdiction: "", tier: "" });
  const { theme } = useVerdictTheme();

  useEffect(() => {
    fetchCases().then((data) => { setCases(data); setLoading(false); });
  }, []);

  const types = useMemo(() => [...new Set(cases.map((c) => c.decision_type))], [cases]);
  const jurisdictions = useMemo(() => [...new Set(cases.map((c) => c.jurisdiction))], [cases]);
  const tiers = useMemo(() => [...new Set(cases.map((c) => c.computed.tier))], [cases]);

  const filtered = useMemo(() => {
    let result = [...cases];
    if (filters.type) result = result.filter((c) => c.decision_type === filters.type);
    if (filters.jurisdiction) result = result.filter((c) => c.jurisdiction === filters.jurisdiction);
    if (filters.tier) result = result.filter((c) => c.computed.tier === filters.tier);
    if (sort === "date") result.sort((a, b) => b.date.localeCompare(a.date));
    else result.sort((a, b) => b.computed.EDI - a.computed.EDI);
    return result;
  }, [cases, filters, sort]);

  const stats = useMemo(() => {
    const total = cases.length;
    const avgEDI = total > 0 ? cases.reduce((s, c) => s + c.computed.EDI, 0) / total : 0;
    const byTier = cases.reduce((acc, c) => {
      acc[c.computed.tier] = (acc[c.computed.tier] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total, avgEDI, byTier };
  }, [cases]);

  const selectClass = "bg-transparent border rounded px-2 py-1 text-xs font-mono appearance-none cursor-pointer";
  const selectStyle = {
    borderColor: "var(--verdict-border)",
    color: "var(--verdict-muted)",
    backgroundColor: theme === "dark" ? "var(--verdict-surface)" : "var(--verdict-surface)",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--verdict-text)" }}>
          The Verdict
        </h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--verdict-muted)" }}>
          A structured database of AI-related court rulings, regulatory decisions, and major corporate actions —
          scored for legal weight, societal effect, and economic reach. Each case is computed using a reproducible
          methodology; scores are provisional and shift as the database grows.
        </p>
      </div>

      {/* Stats bar */}
      {!loading && cases.length > 0 && (
        <div
          className="flex items-center gap-6 flex-wrap rounded-lg border p-4 mb-8 text-xs font-mono"
          style={{ borderColor: "var(--verdict-border)", backgroundColor: "var(--verdict-surface)" }}
        >
          <div>
            <div className="text-lg font-bold" style={{ color: "var(--verdict-accent)" }}>{stats.total}</div>
            <div style={{ color: "var(--verdict-muted)" }}>cases</div>
          </div>
          <div className="w-px h-8 self-center" style={{ backgroundColor: "var(--verdict-border)" }} />
          <div>
            <div className="text-lg font-bold" style={{ color: "var(--verdict-accent)" }}>
              {stats.avgEDI.toFixed(2)}
            </div>
            <div style={{ color: "var(--verdict-muted)" }}>avg EDI</div>
          </div>
          <div className="w-px h-8 self-center" style={{ backgroundColor: "var(--verdict-border)" }} />
          <div className="flex items-center gap-3 flex-wrap">
            {Object.entries(stats.byTier).map(([tier, count]) => (
              <div key={tier} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: TIER_COLORS[tier] ?? "var(--verdict-muted)" }}
                />
                <span style={{ color: "var(--verdict-muted)" }}>{tier}: {count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Globe — lazy-loaded to keep initial bundle small */}
      {!loading && cases.length > 0 && (
        <div
          className="rounded-lg border p-4 mb-8"
          style={{ borderColor: "var(--verdict-border)", backgroundColor: "var(--verdict-surface)" }}
        >
          <div className="text-xs font-mono mb-3" style={{ color: "var(--verdict-muted)" }}>
            GLOBAL DISTRIBUTION — click a point to open that verdict
          </div>
          <div style={{ height: 320 }}>
            <Suspense fallback={
              <div className="h-full flex items-center justify-center rounded" style={{ backgroundColor: "var(--verdict-surface-2)", color: "var(--verdict-muted)" }}>
                <span className="text-xs font-mono">Loading globe…</span>
              </div>
            }>
              <GlobeComponent cases={filtered} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Timeline */}
      {!loading && cases.length > 0 && (
        <div
          className="rounded-lg border p-4 mb-8"
          style={{ borderColor: "var(--verdict-border)", backgroundColor: "var(--verdict-surface)" }}
        >
          <div className="text-xs font-mono mb-3" style={{ color: "var(--verdict-muted)" }}>
            TIMELINE — EDI by date
          </div>
          <CompactTimeline cases={filtered} />
        </div>
      )}

      {/* Filters + Sort */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={filters.jurisdiction}
          onChange={(e) => setFilters((f) => ({ ...f, jurisdiction: e.target.value }))}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All jurisdictions</option>
          {jurisdictions.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>

        <select
          value={filters.tier}
          onChange={(e) => setFilters((f) => ({ ...f, tier: e.target.value }))}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All tiers</option>
          {tiers.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-1">
          {(["date", "edi"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="px-2.5 py-1 rounded text-xs font-mono transition-colors duration-150"
              style={{
                color: sort === s ? "var(--verdict-accent)" : "var(--verdict-muted)",
                backgroundColor: sort === s ? "var(--verdict-accent-dim)" : "transparent",
                border: `1px solid ${sort === s ? "var(--verdict-accent)" : "var(--verdict-border)"}`,
              }}
            >
              {s === "date" ? "By date" : "By EDI"}
            </button>
          ))}
        </div>
      </div>

      {/* Cases */}
      {loading ? (
        <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--verdict-muted)" }}>
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--verdict-muted)" }}>
          No cases match the current filters.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((c) => <CaseCard key={c.case_id} c={c} />)}
        </div>
      )}
    </div>
  );
}
