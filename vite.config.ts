import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:8080",  // scripts/dev-api.ts (npm run dev starts both)
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: "esnext",
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
