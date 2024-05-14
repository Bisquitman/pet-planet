import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";

export default defineConfig({
  root: "./src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
  },
  plugins: [
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 70,
      },
    }),
  ],
});
