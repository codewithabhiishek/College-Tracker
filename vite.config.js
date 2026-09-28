import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@clerk/")) {
            return "vendor-clerk";
          }
          if (id.includes("node_modules/react-big-calendar/") || id.includes("node_modules/moment/")) {
            return "vendor-calendar";
          }
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-motion";
          }
          if (id.includes("node_modules/@tanstack/react-query/")) {
            return "vendor-query";
          }
        },
      },
    },
  },
});