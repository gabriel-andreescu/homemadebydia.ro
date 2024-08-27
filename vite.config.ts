import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteImageOptimizer({
      /* pass your config */
    }),
    Sitemap({
      hostname: "https://homemadebydia.ro",
    }),
  ],
});
