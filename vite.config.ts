import { defineConfig } from "vite";

// base must match the GitHub Pages repo path for asset URLs to resolve.
// For https://<user>.github.io/contract-quest/ set base to "/contract-quest/".
export default defineConfig({
  base: process.env.VITE_BASE ?? "/contract-quest/",
  build: { target: "es2020", outDir: "dist", sourcemap: false },
  server: { host: true, port: 5173 },
});
