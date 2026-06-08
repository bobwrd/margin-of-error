import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";
import WeeklyBriefing from "./pages/WeeklyBriefing";
import PersonalPieces from "./pages/PersonalPieces";
import ArticlePage from "./pages/ArticlePage";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import VerdictLayout, { VerdictThemeProvider } from "./pages/verdict/VerdictLayout";
import VerdictIndex from "./pages/verdict/VerdictIndex";
import VerdictCase from "./pages/verdict/VerdictCase";
import VerdictCharts from "./pages/verdict/VerdictCharts";
import VerdictAbout from "./pages/verdict/VerdictAbout";
import VerdictSubmit from "./pages/verdict/VerdictSubmit";

function VerdictShell() {
  return (
    <VerdictThemeProvider>
      <VerdictLayout>
        <Outlet />
      </VerdictLayout>
    </VerdictThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/weekly" element={<WeeklyBriefing />} />
          <Route path="/weekly/:slug" element={<ArticlePage />} />

          <Route path="/personal" element={<PersonalPieces />} />
          <Route path="/personal/:slug" element={<ArticlePage />} />

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
      </BrowserRouter>
    </ThemeProvider>
  );
}
