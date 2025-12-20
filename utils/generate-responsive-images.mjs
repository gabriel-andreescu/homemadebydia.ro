// utils/convert-images-to-webp.js
//
// Build-time image pipeline:
// - scans `public/gallery/**`
// - for each source JPG/JPEG/PNG, generates multi-width variants:
//   - `${base}.w{width}.avif`
//   - `${base}.w{width}.webp`
//   - `${base}.w{width}.jpg`   (for PNG sources we still generate JPG fallback; avoid using PNG with alpha via AppPicture)
// - skips work if output is newer than input
//
// Notes:
// - We intentionally keep the existing `${base}.webp` and `${base}.jpg` files (legacy) intact.
// - Width variants enable real `srcset` + `sizes` in components.

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import {
  RESPONSIVE_IMAGE_AVIF_EFFORT,
  RESPONSIVE_IMAGE_FORMATS,
  RESPONSIVE_IMAGE_EXCLUDE_BASENAMES,
  RESPONSIVE_IMAGE_QUALITY_PROFILES,
  RESPONSIVE_IMAGE_WIDTHS,
  responsiveImageAvifQualityForWidth,
} from "./responsive-images.config.mjs";
import { fileURLToPath } from "url";
import os from "os";

const galleryPath = path.resolve("public/gallery");

const WIDTHS = RESPONSIVE_IMAGE_WIDTHS;

const EXCLUDED_BASENAMES = new Set(RESPONSIVE_IMAGE_EXCLUDE_BASENAMES);

function toPositiveInt(value) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function pickJobCount() {
  const cpuCount = os.cpus()?.length ?? 1;

  // Allow explicit overrides.
  const fromEnv =
    toPositiveInt(process.env.HBD_IMAGE_JOBS) ??
    toPositiveInt(process.env.IMAGE_JOBS) ??
    toPositiveInt(process.env.JOBS);
  if (fromEnv) return fromEnv;

  // Local default: use a good chunk of cores but avoid thrashing.
  // Sharp/libvips also uses threads internally, so too high can backfire.
  return Math.max(1, Math.min(12, cpuCount));
}

async function asyncPool(limit, items, worker) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = Promise.resolve().then(() => worker(item));
    results.push(p);
    executing.add(p);
    p.finally(() => executing.delete(p));
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return await Promise.all(results);
}

function isGeneratedVariantFileName(fileName) {
  return /\.w\d+\.(avif|webp|jpg)$/i.test(fileName);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function statMtimeMs(filePath) {
  const s = await fs.stat(filePath);
  return s.mtimeMs;
}

async function ensureVariant(
  inputPath,
  outputPath,
  format,
  width,
  qualityProfile,
  pipelineMtimeMs,
) {
  const inputMtime = await statMtimeMs(inputPath);
  if (await exists(outputPath)) {
    const outMtime = await statMtimeMs(outputPath);
    // Regenerate if either the source image changed OR our pipeline/config changed.
    if (outMtime >= Math.max(inputMtime, pipelineMtimeMs)) return { didWork: false };
  }

  let pipeline = sharp(inputPath, { failOn: "none" }).resize({
    width,
    withoutEnlargement: true,
  });

  if (format === "avif") {
    pipeline = pipeline.avif({
      quality: responsiveImageAvifQualityForWidth(qualityProfile.avifQuality, width),
      effort: RESPONSIVE_IMAGE_AVIF_EFFORT,
    });
  } else if (format === "webp") {
    pipeline = pipeline.webp({
      quality: qualityProfile.webpQuality,
    });
  } else {
    pipeline = pipeline.jpeg({
      quality: qualityProfile.jpgQuality,
      mozjpeg: true,
    });
  }

  await pipeline.toFile(outputPath);
  return { didWork: true };
}

async function processImageSource(filePath, pipelineMtimeMs) {
  const ext = path.extname(filePath).toLowerCase();
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);

  // Don’t treat already-generated variants as inputs.
  if (isGeneratedVariantFileName(path.basename(filePath))) return { generated: 0, skipped: 1 };

  // Ignore SVGs, icons, etc.
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return { generated: 0, skipped: 1 };

  // Explicitly exclude some sources (ex: gradient-heavy footer assets).
  if (EXCLUDED_BASENAMES.has(baseName)) return { generated: 0, skipped: 1 };

  const qualityProfile = RESPONSIVE_IMAGE_QUALITY_PROFILES.normal;

  let generated = 0;
  let skipped = 0;

  for (const width of WIDTHS) {
    const baseOut = path.join(dir, `${baseName}.w${width}`);

    const avifPath = `${baseOut}.avif`;
    const webpPath = `${baseOut}.webp`;
    const jpgPath = `${baseOut}.jpg`;

    for (const format of RESPONSIVE_IMAGE_FORMATS) {
      const outPath = format === "avif" ? avifPath : format === "webp" ? webpPath : jpgPath;
      try {
        const res = await ensureVariant(
          filePath,
          outPath,
          format,
          width,
          qualityProfile,
          pipelineMtimeMs,
        );
        if (res.didWork) generated += 1;
        else skipped += 1;
      } catch (err) {
        console.error(`Failed generating ${outPath} from ${filePath}:`, err);
        // continue other outputs
      }
    }
  }

  return { generated, skipped };
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

async function main() {
  // Never run image generation in CI environments (Cloudflare/GitHub/etc).
  // This script is intended to be run locally only.
  const isCI = process.env.CI === "true" || process.env.CI === "1";
  if (isCI) {
    console.log("Responsive image generation skipped (CI=true).");
    return;
  }

  const selfPath = fileURLToPath(import.meta.url);
  const configPath = fileURLToPath(new URL("./responsive-images.config.mjs", import.meta.url));
  const pipelineMtimeMs = Math.max(await statMtimeMs(selfPath), await statMtimeMs(configPath));

  // Concurrency tuning:
  // - `sharp.concurrency(n)` controls libvips internal thread pool (per process).
  // - We also run multiple input files in parallel via `asyncPool`.
  const cpuCount = os.cpus()?.length ?? 1;
  const jobs = pickJobCount();
  const sharpThreads = Math.max(1, Math.min(cpuCount, toPositiveInt(process.env.SHARP_CONCURRENCY) ?? 8));
  sharp.concurrency(sharpThreads);

  console.log(
    `Responsive images: cpu=${cpuCount}, jobs=${jobs}, sharpThreads=${sharpThreads} (override via HBD_IMAGE_JOBS / SHARP_CONCURRENCY)`,
  );

  const files = await walk(galleryPath);

  let generated = 0;
  let skipped = 0;

  const results = await asyncPool(jobs, files, (f) => processImageSource(f, pipelineMtimeMs));
  for (const res of results) {
    generated += res.generated;
    skipped += res.skipped;
  }

  console.log(
    `Responsive image generation complete. Generated: ${generated}, skipped/up-to-date: ${skipped}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
