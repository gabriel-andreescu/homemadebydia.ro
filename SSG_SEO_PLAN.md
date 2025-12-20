# Plan goal

Move from a hash-based SPA (single `index.html`) to **real, indexable pages** (RO + EN) with **static prerendered HTML** so crawlers get unique content + titles without relying on client-side rendering.

## Decisions (agreed)

- **Hosting**: Cloudflare Pages builds from `main` (GitHub) and deploys the static `dist/` output.
- **Routing model**: Keep client-side routing for UX, but generate **real HTML per route** via SSG/prerender so URLs are directly fetchable as static files.
- **Locale URLs**:
  - Romanian at root: `/<route>`
  - English under `/en`: `/en/<route>`
- **English slugs**: use translated slugs (e.g. `/en/cakes`) rather than Romanian slugs under `/en`.
- **Locale UX**: language is decided by URL; show a small “Prefer English?” popup when browser locale isn’t Romanian (no auto-redirect).
- **Content source**: catalog content is build-time JSON imports, which is compatible with prerendered pages.
- **SSG tooling direction**: prefer a simple Vite-based SSG/prerender approach (e.g. `vite-ssg`) over heavier SSR frameworks.
- **Homepage UX**:
  - Keep `/` as a strong landing page (hero + story + trust + conversion).
  - Replace the full catalog section with a curated **“Most popular”** section (manual list from Diana).
  - Keep **teasers** (not full duplicates) on homepage for About, linking to a full page.
  - Keep **Recenzii** on homepage (rename `testimoniale` -> `recenzii`): ~6 curated reviews + link to Google Business reviews for the full list (no dedicated reviews page).
- **Navigation UX (mobile-first)**:
  - Use the mobile hamburger/slide-out menu UI on desktop too (remove separate desktop menu layout).
- **No legacy URL handling**:
  - Do not add redirects or compatibility handling for old hash URLs (for example `/#catalog`, `/#torturi`).
- **Products: stable identity + translated URLs**:
  - Every product has a stable `id` (same across RO/EN).
  - Every product has a translated `slug` (can differ RO vs EN).
  - `id` and `slug` are **kebab-case ASCII**: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
  - Uniqueness:
    - `id` unique within each category dataset (`cakes`, `cookies`, `pastry`).
    - `slug` unique within each category dataset per locale.
- **Most popular (homepage) data**:
  - Popular products are marked directly in the category JSONs with:
    - `popular: true`
    - `popularIndex: number` (required when `popular: true`)
  - `popularIndex` is globally unique across all categories.
  - Popular set/order is identical across RO/EN (same products, same `popularIndex`).
  - Build step generates `popular.ro.json` and `popular.en.json` as a **flat list** sorted by `popularIndex`.
  - Each generated entry is the **full product object** (same shape as category JSONs), plus:
    - `categoryId: "cakes" | "cookies" | "pastry"` (derived from the source JSON file; used to build links via locale-aware mapping)
  - Generated popular JSON does **not** include `categoryTitle` (UI derives labels via i18n).
- **Build enforcement**:
  - Add a Vite build plugin (like existing `validateProductUnits()`) that fails the build if:
    - a product is missing `id`/`slug`, format is invalid, or uniqueness rules fail
    - RO/EN are out of sync for `id`s
    - `popular: true` is missing `popularIndex`
    - `popularIndex` is duplicated
    - RO/EN mismatch for `popular` / `popularIndex` on the same `id`

## Notes / constraints

- Current sitemap is hash-based (`/#torturi` etc). With real routes, sitemap should be switched to real URLs.
- “Pretty URLs” on static hosting typically map to `dist/<route>/index.html` while still looking like `/route` in the browser.

## Production snapshot (current `main` branch)

- Current production (`main`) is a **single-page site** (sections navigated via `#hash`, not real URLs).
- `dist/sitemap.xml` on `main` contains **only** `https://homemadebydia.ro/` (no hash URLs).
- `vite.config.ts` on `main` has sitemap generation configured with only `hostname` (no `dynamicRoutes`).
- There is no SSG/prerender or multi-route setup in `main` yet (this plan introduces it).

## Open questions

- None (all current decisions have been made).
