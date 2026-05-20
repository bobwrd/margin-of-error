import { createContext, useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

type VerdictTheme = "dark" | "light";

interface VerdictThemeContextType {
  theme: VerdictTheme;
  toggle: () => void;
}

const VerdictThemeContext = createContext<VerdictThemeContextType>({
  theme: "dark",
  toggle: () => {},
});

export function useVerdictTheme() {
  return useContext(VerdictThemeContext);
}

export function VerdictThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<VerdictTheme>(() => {
    const stored = localStorage.getItem("verdict-theme");
    return (stored === "light" || stored === "dark") ? stored : "dark";
  });

  const toggle = () => {
    const next: VerdictTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("verdict-theme", next);
  };

  return (
    <VerdictThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={`verdict-section${theme === "light" ? " verdict-light" : ""} min-h-screen`}
        style={{
          backgroundColor: "var(--verdict-bg)",
          color: "var(--verdict-text)",
        }}
      >
        {children}
      </div>
    </VerdictThemeContext.Provider>
  );
}

export default function VerdictLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { theme, toggle } = useVerdictTheme();

  const navLinks = [
    { label: "Index", href: "/verdict" },
    { label: "Charts", href: "/verdict/charts" },
    { label: "Methodology", href: "/verdict/about" },
    { label: "Submit", href: "/verdict/submit" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: theme === "dark" ? "rgba(10,14,26,0.95)" : "rgba(248,250,252,0.95)",
          borderColor: "var(--verdict-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-mono tracking-wider opacity-40 hover:opacity-70 transition-opacity"
              style={{ color: "var(--verdict-muted)" }}
            >
              ← MOE
            </Link>
            <Link
              to="/verdict"
              className="font-semibold tracking-tight text-sm flex items-center gap-2"
              style={{ color: "var(--verdict-accent)" }}
            >
              <span className="font-mono text-xs opacity-60">⬡</span>
              THE VERDICT
            </Link>
          </div>

          <nav className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = link.href === "/verdict"
                ? pathname === "/verdict"
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150"
                  style={{
                    color: active ? "var(--verdict-accent)" : "var(--verdict-muted)",
                    backgroundColor: active ? "var(--verdict-accent-dim)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggle}
            className="p-1.5 rounded transition-colors duration-150"
            style={{ color: "var(--verdict-muted)" }}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-20"
        style={{ borderColor: "var(--verdict-border)" }}
      >
        <div
          className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs font-mono"
          style={{ color: "var(--verdict-muted)" }}
        >
          <span>THE VERDICT · Margin of Error</span>
          <Link
            to="/verdict/about"
            className="hover:opacity-80 transition-opacity"
            style={{ color: "var(--verdict-accent)" }}
          >
            Methodology →
          </Link>
        </div>
      </footer>
    </div>
  );
}
