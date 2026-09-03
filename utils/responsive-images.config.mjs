// Shared responsive image configuration (used by both build-time generation and runtime srcset).
//
// Keep this list small and stable; adding widths increases generated file count.
export const RESPONSIVE_IMAGE_WIDTHS = [
  64, 128, 256, 384, 512, 640, 768, 960, 1024, 1280, 1600, 2000, 2400,
];

// Image quality configuration for the responsive image generator.
//
// Notes:
// - Some sources are excluded entirely (ex: gradient-heavy footer assets you don't want re-encoded).

// Do not generate any responsive variants for these basenames.
// Example: `public/gallery/footer.jpg` has basename `footer`.
export const RESPONSIVE_IMAGE_EXCLUDE_BASENAMES = [];

export const RESPONSIVE_IMAGE_FORMATS = ["avif", "webp", "jpg"];

export const RESPONSIVE_IMAGE_QUALITY_PROFILES = {
  normal: { avifQuality: 55, webpQuality: 78, jpgQuality: 80 },
};

export const RESPONSIVE_IMAGE_AVIF_EFFORT = 9;



