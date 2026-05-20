import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "@/config/site";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-semibold text-foreground tracking-tight text-[0.9375rem] hover:text-warm-accent transition-colors duration-150 shrink-0"
        >
          {siteConfig.title}
        </Link>
        <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {siteConfig.navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const isVerdict = item.href === "/verdict";
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors duration-150 ${
                  active
                    ? isVerdict
                      ? "bg-cyan-500/10 text-cyan-400 font-medium"
                      : "bg-secondary text-foreground font-medium"
                    : isVerdict
                      ? "text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {item.label}
                {isVerdict && (
                  <span className="ml-1.5 text-[0.6rem] font-mono bg-cyan-500/15 text-cyan-400 px-1 py-px rounded uppercase tracking-wider">
                    ⬡
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
