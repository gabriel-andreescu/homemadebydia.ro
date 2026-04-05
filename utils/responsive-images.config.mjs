// Shared responsive image configuration (used by both build-time generation and runtime srcset).
//
// Keep this list small and stable; adding widths increases generated file count.
export const RESPONSIVE_IMAGE_WIDTHS = [64, 128, 256, 384, 512, 640, 768, 960, 1280, 1600];

// Image quality configuration for the responsive image generator.
//
// Notes:
// - Smaller widths can tolerate more compression.
// - Some sources are excluded entirely (ex: gradient-heavy footer assets you don't want re-encoded).

// Do not generate any responsive variants for these basenames.
// Example: `public/gallery/footer.jpg` has basename `footer`.
export const RESPONSIVE_IMAGE_EXCLUDE_BASENAMES = ["footer", "footer-dark", "footer-dark.min"];

export const RESPONSIVE_IMAGE_FORMATS = ["avif", "webp", "jpg"];

export const RESPONSIVE_IMAGE_QUALITY_PROFILES = {
  normal: { avifQuality: 40, webpQuality: 78, jpgQuality: 80 },
};

export const RESPONSIVE_IMAGE_AVIF_EFFORT = 7;

export function responsiveImageAvifQualityForWidth(baseQuality, width) {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  if (width <= 256) return clamp(baseQuality - 10, 28, 95);
  if (width <= 384) return clamp(baseQuality - 8, 28, 95);
  if (width <= 512) return clamp(baseQuality - 6, 28, 95);
  return clamp(baseQuality, 28, 95);
}


