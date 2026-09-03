import cakesRo from "../assets/cakes.json";
import cakesEn from "../assets/cakes.en.json";
import cookiesRo from "../assets/cookies.json";
import cookiesEn from "../assets/cookies.en.json";
import pastryRo from "../assets/pastry.json";
import pastryEn from "../assets/pastry.en.json";
import layerVocabulary from "../assets/layers.json";
import type { Locale } from "../i18n";

interface LayerEntry {
  /** null falls back to the rule colour. */
  color: string | null;
  ro: string;
  en: string;
}

export interface CatalogLayer {
  name: string;
  color: string | null;
}

export interface CatalogExtra {
  name: string;
  price: number;
}

export interface CatalogProduct {
  id: string;
  image: string | string[];
  title: string;
  price: number;
  unit: string;
  minimum?: number;
  step?: number;
  /** Keys into layers.json, in stacking order. */
  layers?: string[];
  variants?: string[];
  weight?: string;
  note?: string;
  extras?: CatalogExtra[];
}

export interface CatalogCollections {
  cakes: CatalogProduct[];
  pastries: CatalogProduct[];
  bakery: CatalogProduct[];
  allProducts: CatalogProduct[];
  productMap: Map<string, CatalogProduct>;
}

const layers = layerVocabulary as Record<string, LayerEntry>;

export function getLayers(product: CatalogProduct, locale: Locale): CatalogLayer[] {
  return (product.layers ?? []).flatMap((key) => {
    const entry = layers[key];
    return entry ? [{ name: entry[locale], color: entry.color }] : [];
  });
}

export function getProductImages(product: CatalogProduct): string[] {
  return Array.isArray(product.image) ? product.image : [product.image];
}

function buildCollections(
  cakes: CatalogProduct[],
  pastries: CatalogProduct[],
  bakery: CatalogProduct[],
): CatalogCollections {
  const allProducts = [...cakes, ...pastries, ...bakery];

  return {
    cakes,
    pastries,
    bakery,
    allProducts,
    productMap: new Map(allProducts.map((product) => [product.id, product])),
  };
}

const catalogByLocale: Record<Locale, CatalogCollections> = {
  ro: buildCollections(cakesRo as CatalogProduct[], cookiesRo as CatalogProduct[], pastryRo as CatalogProduct[]),
  en: buildCollections(cakesEn as CatalogProduct[], cookiesEn as CatalogProduct[], pastryEn as CatalogProduct[]),
};

export function getCatalogCollections(locale: Locale): CatalogCollections {
  return catalogByLocale[locale];
}

export function getCatalogProductMap(locale: Locale): Map<string, CatalogProduct> {
  return getCatalogCollections(locale).productMap;
}
