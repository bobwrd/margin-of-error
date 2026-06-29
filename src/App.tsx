import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";

// Route-level code splitting: only Home ships in the initial bundle.
// Everything else (especially the Verdict pages, which pull in recharts)
// loads on navigation. Vite emits a separate chunk per lazy import.
const WeeklyBriefing = lazy(() => import("./pages/WeeklyBriefing"));
const PersonalPieces = lazy(() => import("./pages/PersonalPieces"));
const Others = lazy(() => import("./pages/Others"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const About = lazy(() => import("./pages/About"));
const WhyMOE = lazy(() => import("./pages/WhyMOE"));
const ChangedMyMind = lazy(() => import("./pages/ChangedMyMind"));
const Changelog = lazy(() => import("./pages/Changelog"));

const VerdictShell = lazy(() =>
  import("./pages/verdict/VerdictLayout").then((m) => {
    const { default: VerdictLayout, VerdictThemeProvider } = m;
    return {
      default: function VerdictShell() {
        return (
          <VerdictThemeProvider>
            <VerdictLayout>
              <Outlet />
            </VerdictLayout>
          </VerdictThemeProvider>
        );
      },
    };
  })
);
const VerdictIndex = lazy(() => import("./pages/verdict/VerdictIndex"));
const VerdictCase = lazy(() => import("./pages/verdict/VerdictCase"));
const VerdictCharts = lazy(() => import("./pages/verdict/VerdictCharts"));
const VerdictAbout = lazy(() => import("./pages/verdict/VerdictAbout"));
const VerdictScored = lazy(() => import("./pages/verdict/VerdictScored"));
const VerdictSubmit = lazy(() => import("./pages/verdict/VerdictSubmit"));

// The Ledger — MAS enforcement actions database. Same standalone-product
// pattern as The Verdict: own theme shell, own lazy chunk.
const LedgerShell = lazy(() =>
  import("./pages/ledger/LedgerLayout").then((m) => {
    const { default: LedgerLayout, LedgerThemeProvider } = m;
    return {
      default: function LedgerShell() {
        return (
          <LedgerThemeProvider>
            <LedgerLayout>
              <Outlet />
            </LedgerLayout>
          </LedgerThemeProvider>
        );
      },
    };
  })
);
const LedgerIndex = lazy(() => import("./pages/ledger/LedgerIndex"));
const LedgerAction = lazy(() => import("./pages/ledger/LedgerAction"));
const LedgerCharts = lazy(() => import("./pages/ledger/LedgerCharts"));
const LedgerAbout = lazy(() => import("./pages/ledger/LedgerAbout"));

// The Observatory (/observatory) — AI, productivity and prices. One long
// scrollable page (intro → walkthrough → data atlas → lab → methodology) under
// its own teal/slate theme shell. recharts + heavy sections load on navigation.
const ObservatoryShell = lazy(() =>
  import("./pages/observatory/ObservatoryLayout").then((m) => {
    const { default: ObservatoryLayout, ObservatoryThemeProvider } = m;
    return {
      default: function ObservatoryShell() {
        return (
          <ObservatoryThemeProvider>
            <ObservatoryLayout>
              <Outlet />
            </ObservatoryLayout>
          </ObservatoryThemeProvider>
        );
      },
    };
  })
);
const ObservatoryIndex = lazy(() => import("./pages/observatory/ObservatoryIndex"));
const ObservatoryMethods = lazy(() => import("./pages/observatory/ObservatoryMethods"));

// The Arena (/arena) — competition and efficiency. One long scroll-driven page
// (intro -> four interactive chapters -> methodology) under its own
// ink-violet/rose theme shell. recharts + heavy sections load on navigation.
const ArenaShell = lazy(() =>
  import("./pages/arena/ArenaLayout").then((m) => {
    const { default: ArenaLayout, ArenaThemeProvider } = m;
    return {
      default: function ArenaShell() {
        return (
          <ArenaThemeProvider>
            <ArenaLayout>
              <Outlet />
            </ArenaLayout>
          </ArenaThemeProvider>
        );
      },
    };
  })
);
const ArenaIndex = lazy(() => import("./pages/arena/ArenaIndex"));
const ArenaMethods = lazy(() => import("./pages/arena/ArenaMethods"));

// The Distribution Lab (/lab) — inequality, mobility and wellbeing across five
// archetype countries. Unlike the scroll-essay shape of the Observatory and the
// Arena, this is a fixed full-screen app: a History/Playground mode toggle, three
// panels, and a year scrubber, under its own gold/indigo theme shell.
const DistLabShell = lazy(() =>
  import("./pages/distlab/DistLabLayout").then((m) => {
    const { default: DistLabLayout, DistLabThemeProvider } = m;
    return {
      default: function DistLabShell() {
        return (
          <DistLabThemeProvider>
            <DistLabLayout>
              <Outlet />
            </DistLabLayout>
          </DistLabThemeProvider>
        );
      },
    };
  })
);
const DistLabIndex = lazy(() => import("./pages/distlab/DistLabIndex"));
const DistLabMethods = lazy(() => import("./pages/distlab/DistLabMethods"));

// The Docket (/docket) — Indian court backlogs. A scroll-driven essay with
// interactive charts (backlog by state, trend over time), a bottleneck scoring
// index, a prototype citizen case-tracking dashboard, and an India–Singapore
// comparison, under its own emerald/forest theme shell.
const DocketShell = lazy(() =>
  import("./pages/docket/DocketLayout").then((m) => {
    const { default: DocketLayout, DocketThemeProvider } = m;
    return {
      default: function DocketShell() {
        return (
          <DocketThemeProvider>
            <DocketLayout>
              <Outlet />
            </DocketLayout>
          </DocketThemeProvider>
        );
      },
    };
  })
);
const DocketIndex = lazy(() => import("./pages/docket/DocketIndex"));
const DocketMethods = lazy(() => import("./pages/docket/DocketMethods"));

// Minimal fallback — pages fetch their own data, so the gap is brief.
// Intentionally unstyled-but-themed so there's no flash of wrong colors.
function RouteFallback() {
  return <div className="min-h-screen bg-background" aria-busy="true" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/weekly" element={<WeeklyBriefing />} />
            <Route path="/weekly/:slug" element={<ArticlePage />} />

            <Route path="/personal" element={<PersonalPieces />} />
            <Route path="/personal/:slug" element={<ArticlePage />} />

            <Route path="/others" element={<Others />} />
            <Route path="/others/:slug" element={<ArticlePage />} />

            {/* Legacy route — keep old links alive, redirect to the new category page. */}
            <Route path="/articles" element={<Navigate to="/weekly" replace />} />

            <Route path="/about" element={<About />} />
            <Route path="/why" element={<WhyMOE />} />
            <Route path="/changed-my-mind" element={<ChangedMyMind />} />
            <Route path="/changelog" element={<Changelog />} />

            <Route path="/verdict" element={<VerdictShell />}>
              <Route index element={<VerdictIndex />} />
              <Route path=":id" element={<VerdictCase />} />
              <Route path="charts" element={<VerdictCharts />} />
              <Route path="about" element={<VerdictAbout />} />
              <Route path="how-we-score" element={<VerdictScored />} />
              <Route path="submit" element={<VerdictSubmit />} />
            </Route>

            <Route path="/ledger" element={<LedgerShell />}>
              <Route index element={<LedgerIndex />} />
              <Route path="charts" element={<LedgerCharts />} />
              <Route path="about" element={<LedgerAbout />} />
              <Route path=":id" element={<LedgerAction />} />
            </Route>

            <Route path="/observatory" element={<ObservatoryShell />}>
              <Route index element={<ObservatoryIndex />} />
              <Route path="methods" element={<ObservatoryMethods />} />
            </Route>

            <Route path="/arena" element={<ArenaShell />}>
              <Route index element={<ArenaIndex />} />
              <Route path="methods" element={<ArenaMethods />} />
            </Route>

            <Route path="/lab" element={<DistLabShell />}>
              <Route index element={<DistLabIndex />} />
              <Route path="methods" element={<DistLabMethods />} />
            </Route>

            <Route path="/docket" element={<DocketShell />}>
              <Route index element={<DocketIndex />} />
              <Route path="methods" element={<DocketMethods />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
