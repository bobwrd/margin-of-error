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
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/Contact"));

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
const VerdictSubmit = lazy(() => import("./pages/verdict/VerdictSubmit"));

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

            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/verdict" element={<VerdictShell />}>
              <Route index element={<VerdictIndex />} />
              <Route path=":id" element={<VerdictCase />} />
              <Route path="charts" element={<VerdictCharts />} />
              <Route path="about" element={<VerdictAbout />} />
              <Route path="submit" element={<VerdictSubmit />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
