// @ts-nocheck — globe.gl has incomplete type definitions for its globe.gl-specific props
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Globe from "react-globe.gl";
import { useVerdictTheme } from "./VerdictLayout";
import type { VerdictCase } from "./types";

function getCoords(jurisdiction: string): [number, number] {
  switch (jurisdiction) {
    case "European Union": return [52, 10];
    case "United States": return [38, -98];
    case "United Kingdom": return [54, -2];
    case "Canada": return [56, -106];
    case "Australia": return [-25, 134];
    case "China": return [35, 105];
    case "Japan": return [36, 138];
    case "India": return [22, 78];
    case "Singapore": return [1.4, 104];
    case "South Korea": return [36, 128];
    case "Brazil": return [-10, -52];
    case "Germany": return [51, 10];
    case "France": return [46, 2];
    default: return [20, 0];
  }
}

interface VerdictGlobeProps {
  cases: VerdictCase[];
}

const TIER_HEX: Record<string, string> = {
  Seismic: "#f87171",
  Major: "#fb923c",
  Moderate: "#facc15",
  Marginal: "#94a3b8",
};

interface PointEntry {
  id: number;
  lat: number;
  lng: number;
  name: string;
  tier: string;
  edi: number;
}

// Spread points from the same jurisdiction so they never stack on the same coord.
// We deterministically fan them out in a small ring around the anchor; the ring
// scales with group size and a tiny per-case radial jitter keeps it organic.
function spreadPoints(
  cases: VerdictCase[],
  baseStepDeg = 2.4
): PointEntry[] {
  const groups = new Map<string, VerdictCase[]>();
  for (const c of cases) {
    const key = c.jurisdiction;
    const list = groups.get(key) ?? [];
    list.push(c);
    groups.set(key, list);
  }

  const out: PointEntry[] = [];
  for (const [jurisdiction, list] of groups) {
    const [baseLat, baseLng] = getCoords(jurisdiction);
    const n = list.length;

    if (n === 1) {
      const c = list[0];
      out.push({ id: c.case_id, lat: baseLat, lng: baseLng, name: c.title, tier: c.computed.tier, edi: c.computed.EDI });
      continue;
    }

    // Place points on concentric rings; first point sits on the anchor.
    // ringIndex 0 = anchor, 1 = first ring, etc.
    let placed = 0;
    let ringIndex = 0;
    while (placed < n) {
      const capacity = ringIndex === 0 ? 1 : 6 * ringIndex;
      const ringStart = placed;
      const ringEnd = Math.min(n, placed + capacity);
      const ringCount = ringEnd - ringStart;

      for (let i = 0; i < ringCount; i++) {
        const c = list[ringStart + i];
        if (ringIndex === 0) {
          out.push({ id: c.case_id, lat: baseLat, lng: baseLng, name: c.title, tier: c.computed.tier, edi: c.computed.EDI });
        } else {
          // Distribute `ringCount` points evenly around the ring.
          const angle = (i / ringCount) * Math.PI * 2;
          const ringRadiusDeg = baseStepDeg * ringIndex;
          // Slight per-case radial jitter (deterministic from case_id) so points
          // don't form a perfect circle. Keep it small so they stay clustered.
          const jitter = (((c.case_id * 9301 + 49297) % 233280) / 233280 - 0.5) * (baseStepDeg * 0.35);
          const r = ringRadiusDeg + jitter;
          const lat = baseLat + Math.sin(angle) * r;
          const lng = baseLng + Math.cos(angle) * r;
          out.push({ id: c.case_id, lat, lng, name: c.title, tier: c.computed.tier, edi: c.computed.EDI });
        }
      }
      placed = ringEnd;
      ringIndex++;
    }
  }
  return out;
}

export default function VerdictGlobe({ cases }: VerdictGlobeProps) {
  const navigate = useNavigate();
  const { theme } = useVerdictTheme();
  const globeRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  const isDark = theme === "dark";

  const pointData: PointEntry[] = useMemo(() => spreadPoints(cases), [cases]);

  const handleClick = useCallback((d: any) => {
    navigate(`/verdict/${d.id}`);
  }, [navigate]);

  const makeTooltip = useCallback((d: any) => {
    const color = TIER_HEX[d.tier] ?? "#22d3ee";
    return `<div style="background:${isDark ? "#111827" : "#fff"};border:1px solid ${isDark ? "rgba(34,211,238,0.35)" : "rgba(14,116,144,0.25)"};color:${isDark ? "#e2e8f0" : "#0f172a"};padding:8px 12px;border-radius:8px;font-family:monospace;font-size:11px;max-width:220px;box-shadow:0 4px 20px rgba(0,0,0,0.3)">
      <div style="font-weight:600;margin-bottom:6px">${d.name}</div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color}"></span>
        <span style="color:${isDark ? "#22d3ee" : "#0e7490"};font-size:13px;font-weight:700">EDI ${d.edi}</span>
        <span style="color:${color};font-size:10px">${d.tier}</span>
      </div>
      <div style="color:${isDark ? "#94a3b8" : "#64748b"};font-size:10px;margin-top:6px">Click to open →</div>
    </div>`;
  }, [isDark]);

  const makePointColor = useCallback((d: any) => TIER_HEX[d.tier] ?? "#22d3ee", []);

  return (
    <div>
      <div
        className="rounded-lg border overflow-hidden relative"
        style={{
          borderColor: "var(--verdict-border)",
          backgroundColor: "var(--verdict-surface)",
          height: 420,
          minHeight: 420,
        }}
      >
        <div style={{ height: 420, position: "relative" }}>
        {!loaded && (
          <div
            className="absolute inset-0 flex items-center justify-center text-xs font-mono z-10"
            style={{ color: "var(--verdict-muted)", backgroundColor: "var(--verdict-surface)" }}
          >
            Initialising globe…
          </div>
        )}

        {/* @ts-ignore */}
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          topojsonUrl="//unpkg.com/world-atlas@2/countries-110m.json"
          atmosphereColor="#22d3ee"
          atmosphereOpacity={0.18}
          globeColor={() => isDark ? "#0d1520" : "#c8e4ef"}
          bgColor="transparent"
          pointsData={pointData}
          pointLat="lat"
          pointLng="lng"
          pointColor={makePointColor}
          pointRadius={0.55}
          pointAltitude={0.02}
          pointLabel={makeTooltip}
          onPointClick={handleClick}
          onGlobeReady={() => setLoaded(true)}
          enablePointerInteraction={true}
        />
        </div>

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--verdict-surface) 0%, transparent 100%)",
            opacity: 0.6,
          }}
        />
        {/* Top fade */}
        <div
          className="absolute inset-x-0 top-0 h-10 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, var(--verdict-surface) 0%, transparent 100%)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <span className="text-[0.6rem] font-mono" style={{ color: "var(--verdict-muted)" }}>
          Click any point to open that verdict
        </span>
        <div className="flex items-center gap-4 flex-wrap">
          {(["Seismic", "Major", "Moderate", "Marginal"] as const).map((tier) => (
            <div key={tier} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: TIER_HEX[tier] }}
              />
              <span className="text-[0.6rem] font-mono" style={{ color: "var(--verdict-muted)" }}>
                {tier}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}