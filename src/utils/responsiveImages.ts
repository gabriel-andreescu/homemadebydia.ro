// Single source of truth lives in `utils/responsive-images.config.mjs`.
// This file provides a typed helper for Vue components.
import { RESPONSIVE_IMAGE_WIDTHS as WIDTHS } from "../../utils/responsive-images.config.mjs";

export type ResponsiveImageFormat = "avif" | "webp" | "jpg";

export const RESPONSIVE_IMAGE_WIDTHS = WIDTHS as number[];

export function makeResponsiveSrcset(basePath: string, format: ResponsiveImageFormat): string {
  return RESPONSIVE_IMAGE_WIDTHS.map((w) => `${basePath}.w${w}.${format} ${w}w`).join(", ");
}


