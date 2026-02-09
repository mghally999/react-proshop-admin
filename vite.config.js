import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "src/shared"),

      // IMPORTANT: your screenshot shows these folders at ROOT, not inside src
      "@app": path.resolve(__dirname, "app"),
      "@modules": path.resolve(__dirname, "modules"),
      "@proshop": path.resolve(__dirname, "modules/proshop"),
    },
  },
});
