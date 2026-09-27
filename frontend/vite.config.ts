import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  assetsInclude: ["**/*.riv"], // Rive animation files — not a Vite-recognized asset type by default
});
