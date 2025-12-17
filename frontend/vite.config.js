// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
// plugins: [react()],
//  server: {
//   proxy: {
//   "/api-local": {
//    target: "http://localhost:6000/",
//    changeOrigin: true,
//    rewrite: (path) => path.replace(/^\/api-local/, ""),
//   },
//   "/api": {
//    target: "https://backend-prod.moonrider.ai",
//    changeOrigin: true,
//    secure: false,
//   },
//  },
//  },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local backend
      "/api-local": {
        target: "http://localhost:6000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-local/, ""),
      },

      // Moonrider SSE backend (used only in local dev)
      "/api": {
        target: "https://backend-prod.moonrider.ai",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
