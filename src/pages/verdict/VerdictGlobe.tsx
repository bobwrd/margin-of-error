// @ts-nocheck — globe.gl has incomplete type definitions for its globe.gl-specific props
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback } from "react";
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

export default function VerdictGlobe({ cases }: VerdictGlobeProps) {
  const navigate = useNavigate();
  const { theme } = useVerdictTheme();
  const globeRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  const isDark = theme === "dark";

  const pointData: PointEntry[] = cases.map((c) => {
    const [lat, lng] = getCoords(c.jurisdiction);
    return { id: c.case_id, lat, lng, name: c.title, tier: c.computed.tier, edi: c.computed.EDI };
  });

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
          height: 440,
        }}
      >
        {!loaded && (
          <div
            className="absolute inset-0 flex items-center justify-center text-xs font-mono z-10"
            style={{ color: "var(--verdict-muted)" }}
          >
            Initialising globe…
          </div>
        )}

        <Globe
          ref={globeRef}
          globeColor={() => isDark ? "#0d1520" : "#c8e4ef"}
          bgColor={() => "transparent"}
          pointsData={pointData}
          pointLat="lat"
          pointLng="lng"
          pointColor={makePointColor}
          pointRadius={0.5}
          pointAltitude={0.015}
          pointLabel={makeTooltip}
          onPointClick={handleClick}
          hexBinColor={() => "rgba(34,211,238,0.4)"}
          hexBinHeight={0.25}
          hexBinRadius={2}
          hexBinResolution={3}
          hexTopColor={() => "rgba(34,211,238,0.5)"}
          hexSideColor={() => "rgba(34,211,238,0.25)"}
          hexGlobePolygonSide={0.5}
          onGlobeReady={() => setLoaded(true)}
          enablePointerInteraction={true}
        />

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--verdict-surface) 0%, transparent 100%)",
            opacity: 0.7,
          }}
        />
        {/* Top fade */}
        <div
          className="absolute inset-x-0 top-0 h-12 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, var(--verdict-surface) 0%, transparent 100%)",
            opacity: 0.5,
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