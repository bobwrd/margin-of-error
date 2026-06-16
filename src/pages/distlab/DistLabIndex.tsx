import { useEffect, useMemo, useState } from "react";
import {
  fetchDistLab, baseAt, regimeAt, mobilityFor,
  REGIME_KEYS, type DistLabData, type CountryYearBase, type MobilityMatrix,
} from "./types";
import { useLabState, regimeToValues } from "./state";
import { resolve, DEFAULT_CONFIG, type ObservedPoint } from "./mapping";
import { CountryPicker, ModeToggle, RegimeBar, YearScrubber, EvidenceStrip, EvidenceDrawer } from "./controls";
import DistributionPanel from "./panels/DistributionPanel";
import MobilityPanel from "./panels/MobilityPanel";
import MacroPanel from "./panels/MacroPanel";

const OUTCOME_KEYS = [
  "gini", "top10_share", "poverty_headcount", "gdp_per_capita_ppp",
  "gni_per_capita", "education_years", "secondary_enrolment",
  "competitiveness_index", "wellbeing_index",
];

// Most recent cohort for a country (cohorts are decade strings like "1980s").
function latestCohort(ms: MobilityMatrix[]): MobilityMatrix | undefined {
  if (!ms.length) return undefined;
  return [...ms].sort((a, b) => b.cohort.localeCompare(a.cohort))[0];
}

export default function DistLabIndex() {
  const [data, setData] = useState<DistLabData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Margin of Error — The Distribution Lab";
    fetchDistLab().then(setData).catch(() => setError(true));
  }, []);

  if (error) return <LoadState msg="Live data is temporarily unavailable. The Distribution Lab needs its dataset (content/distlab/distlab.json) to be built and deployed." />;
  if (!data) return <LoadState msg="Loading…" />;
  return <Lab data={data} />;
}

function LoadState({ msg }: { msg: string }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <p className="text-sm max-w-md text-center" style={{ color: "var(--dl-muted)" }}>{msg}</p>
    </div>
  );
}

function Lab({ data }: { data: DistLabData }) {
  const [state, dispatch] = useLabState(data.visible_countries[0], data.year_max);
  const { mode, country, year, regime, locked } = state;

  // Observed point cloud for the Playground analogue mapping. Coords are the 8
  // regime indices; outcomes come from the matching base row.
  const cloud = useMemo<ObservedPoint[]>(() => {
    const out: ObservedPoint[] = [];
    for (const rv of data.regime) {
      const coords = REGIME_KEYS.map((k) => rv.values[k]);
      if (!coords.every((x) => x != null && Number.isFinite(x))) continue;
      const b = baseAt(data, rv.country, rv.year);
      const outcomes: Record<string, number | null> = {};
      for (const key of OUTCOME_KEYS) outcomes[key] = (b as Record<string, unknown> | undefined)?.[key] as number ?? null;
      out.push({ country: rv.country, year: rv.year, coords: coords as number[], outcomes });
    }
    return out;
  }, [data]);

  // Re-seed the sliders from the current country-year whenever we enter Playground.
  useEffect(() => {
    if (mode === "playground") dispatch({ type: "loadRegime", regime: regimeToValues(regimeAt(data, country, year)) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const historyBase = baseAt(data, country, year);
  const historyRegime = regimeAt(data, country, year);

  // Playground resolution.
  const target = REGIME_KEYS.map((k) => regime[k]);
  const result = useMemo(() => resolve(target, cloud, OUTCOME_KEYS, DEFAULT_CONFIG), [target.join(","), cloud]);
  const topCountry = result.contributors[0]?.country;

  // What the three panels read, by mode.
  const playgroundBase: Partial<CountryYearBase> & { meta?: CountryYearBase["meta"] } = {
    gdp_per_capita_ppp: result.estimates.gdp_per_capita_ppp,
    gni_per_capita: result.estimates.gni_per_capita,
    education_years: result.estimates.education_years,
    secondary_enrolment: result.estimates.secondary_enrolment,
    education_spend_pct_gdp: null,
    competitiveness_index: result.estimates.competitiveness_index,
    wellbeing_index: result.estimates.wellbeing_index,
    meta: {},
  };

  const dist = mode === "history"
    ? { gini: historyBase?.gini ?? null, top10: historyBase?.top10_share ?? null, poverty: historyBase?.poverty_headcount ?? null }
    : { gini: result.estimates.gini, top10: result.estimates.top10_share, poverty: result.estimates.poverty_headcount };

  const mobility = mode === "history"
    ? latestCohort(mobilityFor(data, country))
    : (topCountry ? latestCohort(mobilityFor(data, topCountry)) : undefined);

  const names = data.country_names;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Control strip */}
      <div className="border-b" style={{ borderColor: "var(--dl-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <ModeToggle mode={mode} onChange={(m) => dispatch({ type: "setMode", mode: m })} />
          <CountryPicker countries={data.visible_countries} names={names} value={country} onChange={(c) => dispatch({ type: "setCountry", country: c })} />
        </div>
      </div>

      {/* Regime bar */}
      <div className="border-b" style={{ borderColor: "var(--dl-border)", backgroundColor: "var(--dl-surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--dl-accent)" }}>
              Regime {mode === "playground" ? "controls" : `· ${names[country] || country} ${year}`}
            </span>
            {mode === "playground" && (
              <button onClick={() => dispatch({ type: "loadRegime", regime: regimeToValues(regimeAt(data, country, year)) })} className="text-[0.65rem] font-mono px-2 py-1 rounded" style={{ color: "var(--dl-muted)", backgroundColor: "var(--dl-surface-2)" }}>
                reset to {names[country] || country} {year}
              </button>
            )}
          </div>
          <RegimeBar
            mode={mode}
            row={historyRegime}
            values={regime}
            locked={locked}
            onChange={(k, v) => dispatch({ type: "setRegime", key: k, value: v })}
            onToggleLock={(k) => dispatch({ type: "toggleLock", key: k })}
          />
        </div>
      </div>

      {/* Three panels */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DistributionPanel
            gini={dist.gini} top10={dist.top10} poverty={dist.poverty}
            uncertain={mode === "playground" && result.extrapolating}
            giniSrc={mode === "history" ? historyBase?.meta?.gini?.src : "analogue"}
            giniInterp={mode === "history" ? historyBase?.meta?.gini?.interp : undefined}
            top10Src={mode === "history" ? historyBase?.meta?.top10_share?.src : "analogue"}
            top10Interp={mode === "history" ? historyBase?.meta?.top10_share?.interp : undefined}
            povSrc={mode === "history" ? historyBase?.meta?.poverty_headcount?.src : "analogue"}
            povInterp={mode === "history" ? historyBase?.meta?.poverty_headcount?.interp : undefined}
          />
          <MobilityPanel matrix={mobility} estimatedFrom={mode === "playground" && topCountry ? (names[topCountry] || topCountry) : undefined} />
          <MacroPanel base={mode === "history" ? historyBase : playgroundBase} uncertain={mode === "playground" && result.extrapolating} />
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t shrink-0" style={{ borderColor: "var(--dl-border)", backgroundColor: "var(--dl-surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {mode === "history" ? (
            <YearScrubber year={year} min={data.year_min} max={data.year_max} onChange={(y) => dispatch({ type: "setYear", year: y })} />
          ) : (
            <div className="space-y-2">
              <EvidenceStrip result={result} names={names} />
              <EvidenceDrawer
                result={result}
                names={names}
                outcomeOf={(c, y) => {
                  const b = baseAt(data, c, y);
                  return { gini: b?.gini ?? null, gdp: b?.gdp_per_capita_ppp ?? null, well: b?.wellbeing_index ?? null };
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
