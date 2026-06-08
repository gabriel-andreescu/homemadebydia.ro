// Single source of truth lives in `utils/responsive-images.config.mjs`.
// This file provides a typed helper for Vue components.
import { RESPONSIVE_IMAGE_WIDTHS as WIDTHS } from "../../utils/responsive-images.config.mjs";
import { RESPONSIVE_IMAGE_MANIFEST } from "../generated/responsive-image-manifest";

export type ResponsiveImageFormat = "avif" | "webp" | "jpg";
type ResponsiveImagePath = keyof typeof RESPONSIVE_IMAGE_MANIFEST;

export const RESPONSIVE_IMAGE_WIDTHS = WIDTHS as number[];

export function getResponsiveImageWidths(basePath: string): readonly number[] {
  return RESPONSIVE_IMAGE_MANIFEST[basePath as ResponsiveImagePath] ?? RESPONSIVE_IMAGE_WIDTHS;
}

export function makeResponsiveSrcset(basePath: string, format: ResponsiveImageFormat): string {
  return getResponsiveImageWidths(basePath)
    .map((w) => `${basePath}.w${w}.${format} ${w}w`)
    .join(", ");
}

export function getResponsiveFallbackSrc(
  basePath: string,
  format: ResponsiveImageFormat = "jpg",
  targetWidth = 640,
): string {
  const widths = getResponsiveImageWidths(basePath);
  const fallbackWidth =
    widths.find((w) => w >= targetWidth) ?? widths[widths.length - 1] ?? targetWidth;
  return `${basePath}.w${fallbackWidth}.${format}`;
}
