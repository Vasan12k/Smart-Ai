import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/auth": "http://localhost:4000",
      "/manager": "http://localhost:4000",
      "/orders": "http://localhost:4000",
      "/payments": "http://localhost:4000",
      "/recommendations": "http://localhost:4000",
      "/ai": "http://localhost:4000",
    },
  },
});
