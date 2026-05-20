import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Cpu,
  Target,
  Mail,
  Monitor,
  Globe,
  Palette,
  Activity,
  Smartphone,
  Search,
  X,
  ExternalLink,
} from "lucide-react";

type Tool = {
  name: string;
  description: string;
  url: string;
  installer?: string;
};

type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tools: Tool[];
};

const TOOLS_DATA: Category[] = [
  {
    id: "ai-coding",
    label: "AI & Coding",
    icon: Cpu,
    tools: [
      { name: "Claude 101", description: "Free guides to master Claude", url: "https://claude101.com/" },
      { name: "AnythingLLM", description: "All-in-one AI application for everyone", url: "https://anythingllm.com/" },
      { name: "Hermes Agent", description: "AI agent that grows with you", url: "https://hermes-agent.nousresearch.com/" },
      { name: "Awesome Vibe Coding", description: "AI-assisted coding resources", url: "https://github.com/filipecalegario/awesome-vibe-coding" },
      { name: "Awesome Generative AI", description: "Curated list of generative AI tools", url: "https://github.com/filipecalegario/awesome-generative-ai" },
      { name: "Wirken", description: "Secure AI agent gateway", url: "https://github.com/gebruder/wirken" },
      { name: "Bolt", description: "AI-powered website and app builder", url: "https://bolt.new/" },
    ],
  },
  {
    id: "productivity",
    label: "Productivity & Organization",
    icon: Target,
    tools: [
      { name: "Tangle", description: "Intentional calendar management", url: "#", installer: "Installer" },
      { name: "SuperMe", description: "Connect with experts and learn", url: "#", installer: "Installer" },
      { name: "Extra", description: "Rethinking email by BuildForever", url: "#", installer: "Installer" },
      { name: "Raycast", description: "Universal launcher for macOS", url: "https://raycast.com/" },
      { name: "1Password", description: "Password manager and identity protection", url: "https://1password.com/" },
      { name: "Notion", description: "All-in-one workspace for notes, databases, and collaboration", url: "https://notion.so/" },
      { name: "Obsidian", description: "Markdown-first knowledge base with local storage", url: "https://obsidian.md/" },
      { name: "Proton Mail", description: "Encrypted email service", url: "https://proton.me/" },
      { name: "Nextcloud", description: "Self-hosted file sync and collaboration", url: "https://nextcloud.com/" },
      { name: "Lovable", description: "Web design and development platform", url: "https://lovable.dev/" },
      { name: "Firebase", description: "Backend-as-a-service platform", url: "https://firebase.google.com/" },
    ],
  },
  {
    id: "communication",
    label: "Communication & Email",
    icon: Mail,
    tools: [
      { name: "YouniQmail", description: "Email management tool", url: "https://youniqmail.com/" },
      { name: "Contextly Notes", description: "Contextual note-taking app", url: "https://apps.apple.com/sg/app/contextly-notes/id6762497168" },
    ],
  },
  {
    id: "macos-tools",
    label: "macOS Tools & Utilities",
    icon: Monitor,
    tools: [
      { name: "Floaty", description: "Keep any window always on top", url: "https://www.floatytool.com/" },
      { name: "Pipiri", description: "Picture-in-Picture for macOS windows", url: "https://lowtechguys.com/pipiri/" },
      { name: "Kompressor", description: "Image and media compression", url: "https://kompressor.app/" },
    ],
  },
  {
    id: "web-reading",
    label: "Web & Reading Tools",
    icon: Globe,
    tools: [
      { name: "Monocle", description: "Web reader and newsletter tool", url: "https://monocle.heyiam.dk/" },
      { name: "Ordinary", description: "Minimalist web tool", url: "https://ordinary.page/" },
      { name: "Blento", description: "Web-based productivity tool", url: "https://blento.app/" },
      { name: "Keepfully", description: "Bookmarking and memory tool", url: "https://www.pxlwaves.com/keepfully/" },
    ],
  },
  {
    id: "browsers",
    label: "Browsers",
    icon: Globe,
    tools: [
      { name: "Dia", description: "Modern browser with Claude integration", url: "#" },
      { name: "Arc", description: "The browser designed for you", url: "https://arc.net/" },
      { name: "Brave", description: "Privacy-focused browser", url: "https://brave.com/" },
      { name: "Vivaldi", description: "Highly customizable browser", url: "https://vivaldi.com/" },
      { name: "Opera GX", description: "Resource-conscious browser", url: "https://www.operagx.com/" },
      { name: "Zen", description: "Minimal, fast browser", url: "https://zen-browser.app/" },
      { name: "DuckDuckGo", description: "Privacy-focused browser", url: "https://duckduckgo.com/" },
      { name: "Sidekick", description: "Browser for productivity", url: "https://www.sidekick.app/" },
      { name: "ChatGPT Atlas", description: "ChatGPT-integrated browser", url: "#" },
      { name: "Perplexity Comet", description: "Search-focused browser", url: "#" },
      { name: "Safari", description: "Apple's native browser", url: "#" },
      { name: "Chrome", description: "Google's browser", url: "#" },
      { name: "Firefox", description: "Open-source browser", url: "#" },
    ],
  },
  {
    id: "design-dev",
    label: "Design & Development",
    icon: Palette,
    tools: [
      { name: "Figma", description: "Collaborative design tool", url: "https://figma.com/" },
      { name: "Replit", description: "Online IDE for coding", url: "https://replit.com/" },
      { name: "Dropbox", description: "Cloud storage and file sync", url: "https://www.dropbox.com/" },
      { name: "Spotify Save CLI", description: "Command line for saving to Spotify", url: "https://github.com/spotify/save-to-spotify" },
    ],
  },
  {
    id: "fitness",
    label: "Fitness & Activity",
    icon: Activity,
    tools: [
      { name: "Strava", description: "Track cycling and running activities", url: "https://www.strava.com/" },
    ],
  },
  {
    id: "macios-apps",
    label: "macOS & iOS Apps",
    icon: Smartphone,
    tools: [
      { name: "Parcel", description: "Cross-platform package tracking app", url: "https://apps.apple.com/us/app/parcel-delivery-tracking/id375589283" },
      { name: "Poolsuite FM", description: "Retro-styled summer ambient music streaming", url: "https://poolsuite.net" },
      { name: "Hands Time", description: "Minimalist clock widget for iOS with retro watch faces", url: "https://apps.apple.com/us/app/hands-time-minimalist-widget/id6462440720" },
      { name: "Lickable Menu Bar", description: "Style your Mac menu bar with Tiger-era glossy effects", url: "https://apps.apple.com/us/app/lickable-menu-bar/id6444217677" },
      { name: "Sleeve", description: "Customizable music widget controller for macOS", url: "https://replay.software/sleeve" },
      { name: "Capture", description: "Web content capture and organization across Apple devices", url: "https://www.sir.studio/capture" },
      { name: "Gentler Streak", description: "Habit tracking app", url: "#" },
      { name: "Day One", description: "Digital journal and notes app", url: "#" },
      { name: "Endel", description: "Personalized focus and sleep soundscapes", url: "#" },
      { name: "Audm", description: "Audio articles app", url: "#" },
      { name: "News+", description: "Apple News service integration", url: "#" },
      { name: "Lake", description: "Simple focus and relaxation app", url: "#" },
      { name: "Agenda", description: "Calendar-based note-taking app", url: "#" },
      { name: "Bandbreite", description: "Apple Watch band collection and curation app", url: "#" },
      { name: "Dark Noise", description: "Ambient sound app for focus and relaxation", url: "#" },
    ],
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const isInstaller = tool.url === "#" && tool.installer === "Installer";

  return (
    <a
      href={tool.url === "#" ? undefined : tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "group flex flex-col gap-1.5 rounded-lg border border-border bg-card p-4",
        "transition-all duration-200 hover:border-primary/40 hover:bg-card/80 hover:shadow-md hover:-translate-y-0.5",
        tool.url === "#" ? "cursor-default opacity-70 hover:opacity-100" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-foreground text-sm leading-snug">
          {tool.name}
        </span>
        {isInstaller && (
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            Installer
          </span>
        )}
        {tool.url !== "#" && (
          <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {tool.description}
      </p>
    </a>
  );
}

export default function Tools() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = TOOLS_DATA.map((cat) => ({
    ...cat,
    tools: cat.tools.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.tools.length > 0);

  const visibleCategories = activeCategory
    ? filtered.filter((cat) => cat.id === activeCategory)
    : filtered;

  const totalTools = TOOLS_DATA.reduce((sum, cat) => sum + cat.tools.length, 0);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          Tools
        </h1>
        <p className="text-muted-foreground text-base">
          {totalTools} tools across {TOOLS_DATA.length} categories
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={[
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
            activeCategory === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
          ].join(" ")}
        >
          All
        </button>
        {TOOLS_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
            className={[
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
              activeCategory === cat.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            <cat.icon className="size-3.5 inline-block" /> {cat.label}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <div className="space-y-8">
        {visibleCategories.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">
                <cat.icon className="size-3.5 inline-block" />
              </span>
              <h2 className="text-base font-semibold text-foreground">{cat.label}</h2>
              <span className="text-xs text-muted-foreground">({cat.tools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cat.tools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </section>
        ))}
        {visibleCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tools found matching "{search}"
          </div>
        )}
      </div>
    </Layout>
  );
}