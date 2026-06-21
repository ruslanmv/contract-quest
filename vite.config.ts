import { defineConfig } from "vite";

// Vercel serves the game from the domain root, so the default base is "/".
// GitHub Pages can still set VITE_BASE=/contract-quest/ in its workflow.
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  build: { target: "es2020", outDir: "dist", sourcemap: false },
  server: { host: true, port: 5173 },
});
