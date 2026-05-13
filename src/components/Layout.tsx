import Nav from "./Nav";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">{children}</main>
      <footer className="border-t border-border mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-sm text-muted-foreground flex items-center justify-between">
          <span>Margin of Error · Arin Jain</span>
          <a
            href="https://linkedin.com/in/arin-jain-69a954270"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
