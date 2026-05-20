import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Newsletter from "./pages/Newsletter";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Tools from "./pages/Tools";
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
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/newsletter/:slug" element={<ArticlePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools" element={<Tools />} />
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
