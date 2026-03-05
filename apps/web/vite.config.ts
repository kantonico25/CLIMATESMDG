import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          dompurify: ["dompurify"]
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 5173
  }
});
