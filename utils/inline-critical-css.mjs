// The whole stylesheet is small enough to inline, which takes it off the critical path.
// The file stays in dist so anything holding the hashed URL still resolves.
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve("dist");
const LINK = /<link[^>]+rel="stylesheet"[^>]*>/gi;
const HREF = /href="([^"]+\.css)"/i;

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const cache = new Map();
async function css(href) {
  if (!cache.has(href)) {
    cache.set(href, await readFile(path.join(DIST, href.replace(/^\//, "")), "utf8"));
  }
  return cache.get(href);
}

let inlined = 0;
for (const file of await htmlFiles(DIST)) {
  const html = await readFile(file, "utf8");
  const links = html.match(LINK) ?? [];
  let next = html;

  for (const link of links) {
    const href = link.match(HREF)?.[1];
    if (!href || !href.startsWith("/assets/")) continue;
    next = next.replace(link, `<style>${await css(href)}</style>`);
    inlined += 1;
  }

  if (next !== html) await writeFile(file, next);
}

const bytes = [...cache.values()].reduce((sum, text) => sum + Buffer.byteLength(text), 0);
console.log(
  `Inlined ${cache.size} stylesheet(s), ${(bytes / 1024).toFixed(1)} KiB, into ${inlined} page reference(s).`,
);
