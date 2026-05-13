import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import Newsletter from "./pages/Newsletter";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";

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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}