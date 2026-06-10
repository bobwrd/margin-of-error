import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5173,
    strictPort: true,
    hmr: false,
  },
  build: {
    // Modern target: smaller output, no legacy transforms. Fine for any
    // browser from ~2022 onward.
    target: "es2022",
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Stable vendor chunk: changes rarely, so returning visitors keep
          // the cached copy across content deploys.
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // recharts is only used by Verdict pages; isolating it keeps it
          // out of every other route chunk.
          recharts: ["recharts"],
        },
      },
    },
  },
});
