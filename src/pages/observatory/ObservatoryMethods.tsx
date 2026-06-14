import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Eq } from "./shared";

// A small helper for section headings inside the paper.
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold mt-10 mb-3 tracking-tight" style={{ color: "var(--obs-text)" }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold mt-6 mb-2" style={{ color: "var(--obs-accent)" }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--obs-text)" }}>
      {children}
    </p>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--obs-muted)" }}>{children}</span>;
}

function Mono({ children }: { children: React.ReactNode }) {
  return <code className="text-xs px-1 py-0.5 rounded font-mono" style={{ backgroundColor: "var(--obs-surface-2)", color: "var(--obs-accent)" }}>{children}</code>;
}

function ParamRow({ slider, param, range, baseline }: { slider: string; param: string; range: string; baseline: string }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--obs-border)" }}>
      <td className="py-2 pr-4 text-sm font-medium" style={{ color: "var(--obs-text)" }}>{slider}</td>
      <td className="py-2 pr-4 text-xs font-mono" style={{ color: "var(--obs-accent)" }}>{param}</td>
      <td className="py-2 pr-4 text-xs" style={{ color: "var(--obs-muted)" }}>{range}</td>
      <td className="py-2 text-xs" style={{ color: "var(--obs-muted)" }}>{baseline}</td>
    </tr>
  );
}

export default function ObservatoryMethods() {
  useEffect(() => {
    document.title = "Technical Note — The Observatory · Margin of Error";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      {/* Back link */}
      <Link
        to="/observatory"
        className="text-xs font-mono tracking-wider mb-8 inline-block transition-opacity hover:opacity-70"
        style={{ color: "var(--obs-muted)" }}
      >
        ← Back to The Observatory
      </Link>

      {/* Title block */}
      <div className="mt-4 mb-10 border-b pb-8" style={{ borderColor: "var(--obs-border)" }}>
        <div className="text-[0.65rem] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "var(--obs-accent)" }}>
          Technical Note · Working Paper
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--obs-text)" }}>
          The Observatory — AI, Productivity and Prices: Data Sources, Transformations and Model Structure
        </h1>
        <p className="text-xs font-mono mb-6" style={{ color: "var(--obs-muted)" }}>
          Margin of Error · Methods appendix · {new Date().getFullYear()}
        </p>
        <div className="rounded-lg p-4 text-sm leading-relaxed border" style={{ borderColor: "var(--obs-border)", backgroundColor: "var(--obs-surface)", color: "var(--obs-text)" }}>
          <strong className="text-xs font-mono uppercase tracking-wider block mb-2" style={{ color: "var(--obs-muted)" }}>Abstract</strong>
          This note documents the data sources, transformations and modelling choices behind The Observatory, an interactive tool that combines observed macroeconomic data with a small, stylised simulation model to illustrate how AI adoption might affect productivity, inflation, unemployment and the distribution of wage gains across worker groups. It is intended for readers who want to understand or replicate the underlying mechanics. The model is deliberately simple and non-predictive; all numerical results are illustrative.
        </div>
      </div>

      {/* 1. Objective and scope */}
      <H2>1. Objective and scope</H2>
      <P>
        The Observatory addresses a specific question: through which economic channels can AI adoption affect productivity, inflation, unemployment and the distribution of gains between higher-skill and lower-skill workers, and what do currently available data series suggest about whether those channels are active? It does not attempt to produce a point forecast. Instead it pursues two complementary objectives.
      </P>
      <P>
        First, it presents observed data from public sources — the World Bank and the Federal Reserve Economic Data (FRED) repository — that correspond to the nodes of the AI-to-macro transmission chain: price indices, productivity measures, investment proxies and wage or earnings series. These are presented descriptively, without imposing a structural interpretation.
      </P>
      <P>
        Second, it provides a stylised simulation model that generates time paths for inflation, unemployment, the policy interest rate and real wages under user-specified assumptions about adoption speed, the wage-vs-profit split of productivity gains, monetary policy stance and whether AI tends to complement or displace labour. The model is not calibrated to any specific country and does not use the observed data as direct inputs; the data and the model are parallel rather than integrated.
      </P>

      {/* 2. Data and transformations */}
      <H2>2. Data sources and transformations</H2>

      <H3>2.1 World Bank series</H3>
      <P>
        The baseline dataset draws on two World Bank Development Indicators, available for all five countries in the atlas (United States, United Kingdom, Germany, Japan, Singapore):
      </P>
      <ul className="list-none space-y-2 mb-4 text-sm" style={{ color: "var(--obs-text)" }}>
        <li><Mono>FP.CPI.TOTL.ZG</Mono> — Annual headline CPI inflation (percent). Used as-is; no transformation beyond filtering to the user-selected time window.</li>
        <li><Mono>SL.GDP.PCAP.EM.KD</Mono> — GDP per person employed, constant PPP dollars. Converted to annual growth rates for the Walkthrough productivity panel. The 5- and 10-year averages shown in the Walkthrough are simple arithmetic means of the annual growth rate series over the most recent 5 and 10 complete observations.</li>
      </ul>
      <P>
        World Bank data is annual and refreshed weekly by an automated job (<Mono>fetch-observatory.mjs</Mono>), then baked into the static site build. Data lags source publication by a varying margin; the <Mono>generated</Mono> timestamp in the API response records when the last fetch ran.
      </P>

      <H3>2.2 FRED series (US only, optional)</H3>
      <P>
        When a FRED API key is configured, the following series enrich the US panels. Without the key, the atlas falls back to the World Bank baseline for all countries.
      </P>
      <ul className="list-none space-y-2 mb-4 text-sm" style={{ color: "var(--obs-text)" }}>
        <li><Mono>CPIAUCSL</Mono> — Headline CPI, monthly. Transformed to year-over-year percent change: <em>((P_t / P_{"{t-12}"}) − 1) × 100</em>.</li>
        <li><Mono>CPILFESL</Mono> — Core CPI (excluding food and energy), monthly. Same YoY transformation.</li>
        <li><Mono>PCEPILFE</Mono> — Core PCE deflator, monthly. Same YoY transformation. PCE is the Federal Reserve's preferred inflation gauge.</li>
        <li><Mono>PPIITM</Mono> or equivalent — Software or IT-related producer price index, monthly. Same YoY transformation; included as a proxy for AI-related deflation in the Prices panel.</li>
        <li><Mono>Y033RC1Q027SBEA</Mono> or equivalent — Non-residential information-processing equipment and software investment, quarterly. Shown in levels to track the AI investment build-out.</li>
        <li><Mono>CES5000000001</Mono> or equivalent — Information-sector employment, monthly. Shown in thousands; a labour-market proxy for tech hiring.</li>
        <li><Mono>LES1252881600Q</Mono> or equivalent — Real median usual weekly earnings for full-time wage and salary workers, quarterly. Deflated at source; shown as a level series.</li>
      </ul>
      <P>
        AI milestone markers (ChatGPT public release, GPT-4, GPT-4o) are hard-coded reference dates overlaid on the monthly price and investment charts. They are not derived from data.
      </P>

      <H3>2.3 Relationship between data and model</H3>
      <P>
        The observed data are used descriptively only. No series is used to directly estimate or calibrate model parameters. The stylised parameter values described in Section 4 are chosen to produce qualitatively plausible dynamics for a generic advanced economy, not to fit any specific country's historical path.
      </P>

      {/* 3. Model structure */}
      <H2>3. Model structure</H2>
      <P>
        The simulation engine is a small, deterministic, New-Keynesian-flavoured system solved one year at a time over a 15-year horizon. It has no stochastic shocks, no explicit financial sector, no exchange rate and no sectoral disaggregation. Each period's outcomes depend only on last period's state variables and the current-period exogenous inputs (the AI productivity flow and the investment term).
      </P>

      <H3>3.1 AI adoption and the productivity flow</H3>
      <P>
        AI adoption follows a logistic S-curve. The cumulative adoption level at time <em>t</em> is:
      </P>
      <Eq>A(t) = 1 / (1 + exp(−s · (t − t₀)))</Eq>
      <P>
        where <em>s</em> is the speed parameter and <em>t₀</em> is the inflection point (mid-adoption year). The per-period productivity <em>flow</em> <em>g_t</em> is the first difference of <em>A(t)</em>, re-scaled so that the cumulative sum equals a total productivity gain parameter (expressed in percentage points). This ensures that faster adoption produces a larger early-period productivity impulse while holding the long-run total roughly constant.
      </P>

      <H3>3.2 Investment demand channel</H3>
      <P>
        During the AI build-out, firms invest heavily in capital and infrastructure before the productivity gains fully materialise. This demand-side channel is captured by an investment term <em>inv_t</em> that enters the output-gap equation positively. In the Lab, <em>inv_t</em> is a function of the current productivity flow and a front-loaded Gaussian hump calibrated to peak in year 1–2 of the simulation, with its size scaled by adoption speed.
      </P>

      <H3>3.3 Inflation and the output gap</H3>
      <P>
        Expected inflation is a weighted average of the target and last period's realised inflation, reflecting partial expectation anchoring:
      </P>
      <Eq>πₑₜ = ω · π* + (1 − ω) · πₜ₋₁</Eq>
      <P>
        The output gap <em>y_t</em> evolves with inertia, responds positively to investment demand and negatively to the ex-ante real interest rate:
      </P>
      <Eq>yₜ = ρ · yₜ₋₁ + invₜ − σ · (iₜ₋₁ − πₜ₋₁ − r*)</Eq>
      <P>
        Inflation is determined by a linearised Phillips curve that adds the output-gap pressure to expected inflation and subtracts the direct disinflationary effect of productivity growth:
      </P>
      <Eq>πₜ = πₑₜ + κ · yₜ − λ · gₜ</Eq>
      <P>
        The parameter <em>λ</em> captures how quickly unit-cost reductions from AI feed through to consumer prices. Higher <em>λ</em> produces faster disinflation for a given productivity impulse.
      </P>

      <H3>3.4 Monetary policy (Taylor rule)</H3>
      <P>
        The policy interest rate follows a Taylor-type rule, subject to a zero lower bound:
      </P>
      <Eq>iₜ = max(0,  r* + π* + φπ · (πₜ − π*) + φy · yₜ)</Eq>
      <P>
        The coefficient <em>φπ</em> governs how aggressively the central bank responds to inflation deviations. A value above 1 satisfies the Taylor principle (the real rate rises when inflation rises), which is the requirement for determinacy in standard New-Keynesian models. The output-gap coefficient <em>φy</em> is held fixed at 0.3 across scenarios.
      </P>

      <H3>3.5 Labour market (Okun-type relation)</H3>
      <P>
        Unemployment deviates from its natural rate in proportion to the output gap, following a standard Okun relationship:
      </P>
      <Eq>uₜ = u* − Okun · yₜ</Eq>
      <P>
        The result is clamped to the range [1.5%, 14%] to prevent the model from producing implausible unemployment paths at extreme slider settings.
      </P>

      <H3>3.6 Wage distribution</H3>
      <P>
        Each period, the labour share of the productivity flow — determined by <em>wageShare</em> — is split between a higher-skill (complemented) group and a lower-skill (at-risk-of-displacement) group. Let <em>pool_t = g_t × wageShare</em>. The real wage growth rates for each group are:
      </P>
      <Eq>highGrowthₜ = pool_t · (1 + 0.8 · replace)</Eq>
      <Eq>lowGrowthₜ  = pool_t · (1 − 1.7 · replace) − 0.6 · g_t · replace</Eq>
      <P>
        where <em>replace ∈ [0, 1]</em> is the labour-replacing parameter. When <em>replace = 0</em>, both groups receive equal shares of the pool. As <em>replace</em> rises, a larger share tilts to the complemented group and a displacement drag — proportional to the raw productivity flow, not just the labour share — is subtracted from lower-skill wage growth. At high values of <em>replace</em>, lower-skill real wages can fall even as productivity rises. Wage indices are cumulative products of (1 + growth_t / 100), initialised at 100.
      </P>

      {/* 4. Parameter mapping */}
      <H2>4. Slider-to-parameter mapping</H2>
      <P>
        Each Lab slider maps to one or more model parameters. The table below summarises the mapping, the range each slider spans and the baseline value (slider at 0.5).
      </P>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--obs-border)" }}>
              <th className="text-left pb-2 pr-4 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Slider</th>
              <th className="text-left pb-2 pr-4 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Parameter(s)</th>
              <th className="text-left pb-2 pr-4 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Range</th>
              <th className="text-left pb-2 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Baseline (0.5)</th>
            </tr>
          </thead>
          <tbody className="leading-relaxed">
            <ParamRow
              slider="Speed of AI adoption"
              param="s, t₀, total gains, inv hump, ω"
              range="s: 0.5→1.6; total gains: 4→9 pp; ω: 0.75→0.45"
              baseline="s ≈ 1.05; midpoint ~year 5; ~6.5 pp cumulative"
            />
            <ParamRow
              slider="Share of AI gains going to wages"
              param="wageShare"
              range="0 → 1"
              baseline="0.5 (equal split between wages and profits)"
            />
            <ParamRow
              slider="Central bank hawkishness"
              param="φπ"
              range="1.1 (dovish) → 2.5 (hawkish)"
              baseline="φπ = 1.8 (Taylor principle satisfied; moderate)"
            />
            <ParamRow
              slider="Labour-replacing vs complementing"
              param="replace"
              range="0 (complement) → 1 (replace)"
              baseline="0.5 (symmetric)"
            />
          </tbody>
        </table>
      </div>
      <P>
        Faster adoption also reduces the expectation-anchoring weight <em>ω</em> (from 0.75 at slow to 0.45 at fast), on the reasoning that rapid unexpected productivity gains are less likely to be incorporated into inflation expectations quickly. All other parameters — <em>κ</em> (0.35), <em>λ</em> (0.7), <em>ρ</em> (0.55), <em>σ</em> (0.5), <em>φy</em> (0.3), <em>Okun</em> (0.5), <em>u*</em> (4.5%), <em>r*</em> (1%), <em>π*</em> (2%) — are fixed across Lab runs.
      </P>

      {/* 5. Outputs */}
      <H2>5. Construction of outputs</H2>

      <H3>5.1 Simulated time paths</H3>
      <P>
        The model produces 15-year annual paths for inflation (<em>π_t</em>), unemployment (<em>u_t</em>), the policy rate (<em>i_t</em>), and real wage indices for each worker group. Paths are initialised at steady state: <em>π₀ = π*</em>, <em>y₋₁ = 0</em>, <em>i₋₁ = r* + π*</em>, and both wage indices at 100. All series are rounded to two decimal places before display.
      </P>

      <H3>5.2 Baseline vs scenario comparison</H3>
      <P>
        The Lab maintains two independent slider states: a <em>scenario</em> (the current slider values) and a <em>baseline</em> (initially set to the default medium configuration, but overrideable by the user). Each is run through the model separately to produce two complete sets of paths. Charts render the baseline as a dashed line and the scenario as a solid line, differentiated by both linestyle and opacity for accessibility. The wage-gap statistic is derived by comparing the two groups' indices at year 10 (index position 9 in a zero-indexed 15-element array): <em>gap = wageHigh[9] − wageLow[9]</em>, reported for both baseline and scenario.
      </P>

      <H3>5.3 Paycheque illustration</H3>
      <P>
        The paycheque calculator applies the model's wage index path to a user-supplied nominal starting wage <em>W₀</em>. The illustrative real wage at year 10 is:
      </P>
      <Eq>W₁₀ = W₀ × (index[9] / 100)</Eq>
      <P>
        where <em>index[9]</em> is the relevant group's wage index at year 10. This is computed separately for baseline and scenario. The result is expressed in approximate today's dollars — the wage indices are real (deflated by the model's productivity path) rather than nominal, so no additional deflator is applied. The calculator is explicitly labelled as illustrative and does not store any user input.
      </P>

      {/* 6. Limitations */}
      <H2>6. Limitations and interpretation</H2>
      <P>
        The model is intentionally stripped down. The following features are omitted by design:
      </P>
      <ul className="list-disc pl-5 space-y-1.5 mb-4 text-sm leading-relaxed" style={{ color: "var(--obs-text)" }}>
        <li><strong>Stochastic shocks.</strong> There are no supply or demand shocks, no uncertainty intervals, and no Monte Carlo draws. Every path is deterministic given the slider settings.</li>
        <li><strong>Financial sector.</strong> Credit conditions, asset prices, bank lending and financial accelerator effects are absent. The policy rate affects demand only through the simple IS-curve term.</li>
        <li><strong>Open economy.</strong> There is no exchange rate, no export or import channel, and no foreign demand. This is a closed-economy model.</li>
        <li><strong>Sectoral detail.</strong> The model has no sector decomposition. "AI adoption" is treated as an economy-wide aggregate process.</li>
        <li><strong>Country-specific calibration.</strong> Parameters are not estimated from or fitted to any country's data. The baseline values are chosen to be broadly plausible for a generic advanced economy but will not match the cyclical properties of any particular country.</li>
        <li><strong>Non-linear dynamics and regime change.</strong> The model is linearised and has no structural breaks, threshold effects or endogenous regime switching.</li>
      </ul>
      <P>
        Given these omissions, the model can speak usefully to the <em>direction</em> of effects (does faster adoption tend to push inflation up or down?), the <em>sequencing</em> of channels (does a demand boom precede the productivity dividend?), and the <em>relative magnitudes</em> of competing forces (is the central bank's hawkishness strong enough to contain the inflationary demand impulse?). It cannot produce reliable point estimates of inflation, unemployment or wage growth for any real economy, and it should not be interpreted as doing so.
      </P>
      <P>
        All numerical outputs — including the paycheque illustrations and the wage-gap statistics — are contingent on the assumed parameter values and the logistic adoption path, both of which are stylised. They reflect the internal logic of a particular simple model, not an empirical estimate of AI's likely macroeconomic impact.
      </P>

      {/* Footer note */}
      <div className="mt-12 pt-6 border-t text-xs font-mono" style={{ borderColor: "var(--obs-border)", color: "var(--obs-muted)" }}>
        <p>THE OBSERVATORY · Margin of Error · Technical Note</p>
        <p className="mt-1">
          Data: World Bank Development Indicators (<Mono>FP.CPI.TOTL.ZG</Mono>, <Mono>SL.GDP.PCAP.EM.KD</Mono>); FRED optional enrichment. Model: <Mono>model.ts</Mono> in the Observatory source. Not a forecast. Not investment, financial or policy advice.
        </p>
        <Link to="/observatory" className="mt-3 inline-block hover:opacity-70 transition-opacity" style={{ color: "var(--obs-accent)" }}>
          ← Return to The Observatory
        </Link>
      </div>
    </div>
  );
}
