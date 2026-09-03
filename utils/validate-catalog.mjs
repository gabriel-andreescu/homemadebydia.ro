// Catalogue invariants, checked before a build. Each failure below is otherwise silent.
import { readFileSync } from "node:fs";
import path from "node:path";

const ASSETS = path.resolve("src/assets");
const MANIFEST = path.resolve("src/generated/responsive-image-manifest.ts");
const COLLECTIONS = ["cakes", "cookies", "pastry"];
const LOCALES = { ro: (f) => `${f}.json`, en: (f) => `${f}.en.json` };
const UNITS = new Set(["kg", "buc", "100 g"]);

const read = (file) => JSON.parse(readFileSync(path.join(ASSETS, file), "utf8"));
const errors = [];
const fail = (message) => errors.push(message);

const layers = read("layers.json");
for (const [key, entry] of Object.entries(layers)) {
  if (!entry.ro || !entry.en) fail(`layers.json: "${key}" is missing a translation`);
  if (entry.color != null && !/^#[0-9a-fA-F]{6}$/.test(entry.color))
    fail(`layers.json: "${key}" has an invalid colour ${JSON.stringify(entry.color)}`);
}

const manifest = readFileSync(MANIFEST, "utf8");
const byLocale = {};

for (const [locale, name] of Object.entries(LOCALES)) {
  const products = COLLECTIONS.flatMap((c) => read(name(c)));
  byLocale[locale] = products;

  const seen = new Map();
  for (const p of products) {
    if (!p.id) fail(`${locale}: a product has no id (${p.title ?? "untitled"})`);
    if (seen.has(p.id)) fail(`${locale}: duplicate id "${p.id}" — ${seen.get(p.id)} and ${p.title}`);
    seen.set(p.id, p.title);

    if (!p.title) fail(`${locale}/${p.id}: no title`);
    if (typeof p.price !== "number") fail(`${locale}/${p.id}: price must be a number`);
    if (!UNITS.has(p.unit)) fail(`${locale}/${p.id}: unit "${p.unit}" is not one of ${[...UNITS].join(", ")}`);
    if (p.minimum != null && typeof p.minimum !== "number") fail(`${locale}/${p.id}: minimum must be a number`);

    for (const key of p.layers ?? [])
      if (!layers[key]) fail(`${locale}/${p.id}: layer "${key}" is not in layers.json`);

    const extraNames = new Set();
    for (const extra of p.extras ?? []) {
      if (!extra.name || typeof extra.price !== "number")
        fail(`${locale}/${p.id}: an extra needs a name and a numeric price`);
      // The cart keys a chosen extra by its name.
      if (extraNames.has(extra.name))
        fail(`${locale}/${p.id}: two extras are both called "${extra.name}"`);
      extraNames.add(extra.name);
    }

    for (const image of Array.isArray(p.image) ? p.image : [p.image]) {
      if (!image) fail(`${locale}/${p.id}: no image`);
      else if (!manifest.includes(`"${image}"`))
        fail(`${locale}/${p.id}: ${image} is not in the responsive image manifest — run generate-responsive-images`);
    }
  }
}

const roIds = byLocale.ro.map((p) => p.id);
const enIds = byLocale.en.map((p) => p.id);
for (const id of roIds) if (!enIds.includes(id)) fail(`"${id}" exists in ro but not in en`);
for (const id of enIds) if (!roIds.includes(id)) fail(`"${id}" exists in en but not in ro`);

const used = new Set(byLocale.ro.flatMap((p) => p.layers ?? []));
for (const key of Object.keys(layers))
  if (!used.has(key)) fail(`layers.json: "${key}" is defined but no product uses it`);

if (errors.length) {
  console.error(`catalogue invalid — ${errors.length} problem${errors.length > 1 ? "s" : ""}:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `catalogue ok: ${roIds.length} products, ${Object.keys(layers).length} layers, both locales aligned`,
);
