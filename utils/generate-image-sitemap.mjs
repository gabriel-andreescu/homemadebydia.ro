import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { testimonialMediaEntries } from "../src/data/testimonial-media.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const publicDir = path.join(repoRoot, "public");
const distDir = path.join(repoRoot, "dist");

const SITE_URL = "https://homemadebydia.ro/";
const HOME_URL = SITE_URL;
const PAGE_SITEMAP_URL = new URL("sitemap.xml", SITE_URL).toString();
const IMAGE_SITEMAP_URL = new URL("image-sitemap.xml", SITE_URL).toString();

const PRODUCT_SOURCES = [
  "src/assets/cakes.json",
  "src/assets/cookies.json",
  "src/assets/pastry.json",
];

const IMAGE_NAMESPACE = "http://www.google.com/schemas/sitemap-image/1.1";
const URLSET_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9";

function toPosixPath(filePath) {
  return filePath.replace(/\\/g, "/");
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function readJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf-8"));
}

function resolvePublicBaseImage(basePath) {
  const normalizedBasePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const candidates = [".jpg", ".png"]
    .map((ext) => ({
      ext,
      absolutePath: path.join(publicDir, `${normalizedBasePath.slice(1)}${ext}`),
    }))
    .filter((candidate) => fs.existsSync(candidate.absolutePath));

  if (candidates.length === 0) {
    throw new Error(`Image sitemap generation failed: missing original image for "${normalizedBasePath}"`);
  }

  if (candidates.length > 1) {
    throw new Error(
      `Image sitemap generation failed: multiple original images found for "${normalizedBasePath}"`,
    );
  }

  return new URL(`${normalizedBasePath}${candidates[0].ext}`, SITE_URL).toString();
}

function collectProductImageUrls() {
  return PRODUCT_SOURCES.flatMap((sourcePath) => {
    const products = readJson(sourcePath);
    return products.flatMap((product) => {
      const imageUrls = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];
      return imageUrls.map((imageUrl) => resolvePublicBaseImage(imageUrl));
    });
  });
}

function collectGalleryImageUrls(galleryDirName) {
  const galleryDir = path.join(publicDir, "gallery", galleryDirName);
  const galleryFiles = fs
    .readdirSync(galleryDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(jpg|png)$/i.test(name))
    .filter((name) => !/\.w\d+\.(jpg|png)$/i.test(name))
    .sort((left, right) => right.localeCompare(left, undefined, { numeric: true, sensitivity: "base" }));

  return galleryFiles.map((fileName) => {
    const relativePath = toPosixPath(path.posix.join("/gallery", galleryDirName, fileName));
    return new URL(relativePath, SITE_URL).toString();
  });
}

function collectTestimonialImageUrls() {
  return testimonialMediaEntries.flatMap((entry) =>
    (entry.images ?? []).map((image) => resolvePublicBaseImage(image.original)),
  );
}

function dedupePreserveOrder(groups) {
  const seen = new Set();
  const deduped = [];

  for (const group of groups) {
    for (const imageUrl of group) {
      if (seen.has(imageUrl)) continue;
      seen.add(imageUrl);
      deduped.push(imageUrl);
    }
  }

  return deduped;
}

function generateImageSitemapXml(imageUrls) {
  const imageEntries = imageUrls
    .map(
      (imageUrl) => `    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
    </image:image>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="${URLSET_NAMESPACE}" xmlns:image="${IMAGE_NAMESPACE}">
  <url>
    <loc>${escapeXml(HOME_URL)}</loc>
${imageEntries}
  </url>
</urlset>
`;
}

function patchRobotsTxt() {
  const robotsPath = path.join(distDir, "robots.txt");
  if (!fs.existsSync(robotsPath)) {
    throw new Error(`Image sitemap generation failed: expected "${robotsPath}" to exist after build`);
  }

  const originalContent = fs.readFileSync(robotsPath, "utf-8");
  const eol = originalContent.includes("\r\n") ? "\r\n" : "\n";
  const lines = originalContent
    .split(/\r?\n/)
    .filter((line) => line !== `Sitemap: ${IMAGE_SITEMAP_URL}`);

  const pageSitemapIndex = lines.findIndex((line) => line === `Sitemap: ${PAGE_SITEMAP_URL}`);
  if (pageSitemapIndex === -1) {
    lines.push(`Sitemap: ${PAGE_SITEMAP_URL}`);
    lines.push(`Sitemap: ${IMAGE_SITEMAP_URL}`);
  } else if (lines[pageSitemapIndex + 1] !== `Sitemap: ${IMAGE_SITEMAP_URL}`) {
    lines.splice(pageSitemapIndex + 1, 0, `Sitemap: ${IMAGE_SITEMAP_URL}`);
  }

  const patchedContent = `${lines.join(eol).replace(new RegExp(`${eol}*$`), "")}${eol}`;
  fs.writeFileSync(robotsPath, patchedContent);
}

function main() {
  const imageUrls = dedupePreserveOrder([
    collectProductImageUrls(),
    collectGalleryImageUrls("gallery"),
    collectTestimonialImageUrls(),
    collectGalleryImageUrls("events"),
  ]);

  fs.writeFileSync(
    path.join(distDir, "image-sitemap.xml"),
    generateImageSitemapXml(imageUrls),
    "utf-8",
  );

  patchRobotsTxt();
}

main();
