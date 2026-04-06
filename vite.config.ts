import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig, Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";
import { VALID_UNITS } from "./src/constants";

const DEFERRED_SECTION_ASSET_PREFIXES = [
  "SectionCatalog-",
  "catalogData-",
  "GalleryModal-",
  "belowFold-",
  "SectionGallery-",
  "HorizontalScroller-",
  "SectionAboutUs-",
  "SectionWhyChooseUs-",
  "SectionReviews-",
  "AppFooter-",
  "GalleryItem-",
  "AppTabs-",
  "AppTab-",
] as const;

const CATALOG_DEFERRED_ASSET_PREFIXES = ["SectionCatalog-", "catalogData-", "GalleryModal-"] as const;

const DEFERRED_SECTION_ASSET_PATTERN = new RegExp(
  String.raw`\/assets\/(?:${DEFERRED_SECTION_ASSET_PREFIXES.map((prefix) =>
    prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
  ).join("|")})[^"' ]*`,
);

const hasCatalogDeferredAssetPrefix = (assetPath: string) =>
  CATALOG_DEFERRED_ASSET_PREFIXES.some((prefix) =>
    assetPath.replace(/^\/?assets\//, "").startsWith(prefix),
  );

function stripDeferredSectionHints(html: string) {
  return html.replace(/<link\b[^>]*href=(["'])([^"']+)\1[^>]*>/g, (match, _quote, href) =>
    DEFERRED_SECTION_ASSET_PATTERN.test(href) ? "" : match,
  );
}

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
  build: {
    modulePreload: {
      resolveDependencies(filename, deps) {
        if (hasCatalogDeferredAssetPrefix(filename)) {
          return [];
        }

        return deps;
      },
    },
  },
  ssgOptions: {
    onPageRendered(_route, renderedHTML) {
      return stripDeferredSectionHints(renderedHTML);
    },
  },
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
  ],
});
