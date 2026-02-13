import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@app": path.resolve(__dirname, "src/app"),
      "@modules": path.resolve(__dirname, "modules"),
      "@proshop": path.resolve(__dirname, "modules/proshop"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // ✅ ALL API calls go to backend :4000
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },

      // ✅ if you use socket.io
      "/socket.io": {
        target: "http://localhost:4000",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
