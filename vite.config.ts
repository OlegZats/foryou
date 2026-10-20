import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // This must match the GitHub repository name exactly: OlegZats/foryou
  base: "/foryou/",
});
