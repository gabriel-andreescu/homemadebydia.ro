import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig, Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import Sitemap from "vite-plugin-sitemap";
import fs from "fs";
import path from "path";
import { VALID_UNITS } from "./src/constants";

function validateProductUnits(): Plugin {
  return {
    name: "validate-product-units",
    buildStart() {
      const catalogFiles = [
        "src/assets/cakes.json",
        "src/assets/cookies.json",
        "src/assets/pastry.json",
      ];

      const errors: string[] = [];

      for (const file of catalogFiles) {
        const filePath = path.resolve(process.cwd(), file);
        if (!fs.existsSync(filePath)) continue;

        const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        for (const product of products) {
          const unit = product.unit ?? "buc";
          if (!VALID_UNITS.includes(unit)) {
            errors.push(`Invalid unit "${unit}" in ${file} for "${product.title}"`);
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(
          `Product unit validation failed:\n${errors.join("\n")}\n\nValid units: ${VALID_UNITS.join(", ")}`,
        );
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    validateProductUnits(),
    vue(),
    ViteImageOptimizer({
      // We generate optimized responsive gallery variants ourselves,
      // so exclude the source `public/gallery/**` from this optimizer pass.
      includePublic: true,
      exclude: /[\\/]public[\\/]gallery[\\/]/i,
      logStats: true,
    }),
    Sitemap({
      hostname: "https://homemadebydia.ro",
      dynamicRoutes: [
        "/#catalog",
        "/#torturi",
        "/#prajituri",
        "/#patiserie",
        "/#evenimente",
        "/#galerie",
        "/#despre-noi",
        "/#de-ce-noi",
        "/#testimoniale",
        "/#cum-sa-comanzi",
        "/#contact",
      ],
      readable: true,
    }),
  ],
});
