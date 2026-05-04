import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        // Updated target to your live Render backend
        target: "https://autocarehub-4.onrender.com", 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});