import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "@/config/site";

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-semibold text-foreground tracking-tight text-base hover:opacity-75 transition-opacity"
        >
          {siteConfig.title}
        </Link>
        <nav className="flex items-center gap-1">
          {siteConfig.navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
