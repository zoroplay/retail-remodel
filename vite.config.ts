import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["ie >= 11"], // Target IE11 and above (ES5 compatible)
      polyfills: [
        "es.symbol",
        "es.array.iterator",
        "es.promise",
        "es.object.assign",
        "es.promise.finally",
      ],
      modernPolyfills: false,
      // Generate legacy chunks for ES5 compatibility
      renderLegacyChunks: true,
    }),
  ],

  // Resolve aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  // Build configuration
  build: {
    outDir: "build",
    sourcemap: true,
    target: "es5", // Target ES5 for maximum compatibility
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
  },

  // Preview server configuration
  preview: {
    port: 3000,
    strictPort: true,
  },

  // Define global constants
  define: {
    "process.env": {},
  },
});
