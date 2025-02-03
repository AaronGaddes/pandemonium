import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:6969",
        ws: true,
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:6969",
        ws: true,
        changeOrigin: true,
      },
      "/socket.io/": {
        target: "http://localhost:6969",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
