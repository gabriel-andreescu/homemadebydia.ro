import cakesRo from "../assets/cakes.json";
import cakesEn from "../assets/cakes.en.json";
import cookiesRo from "../assets/cookies.json";
import cookiesEn from "../assets/cookies.en.json";
import pastryRo from "../assets/pastry.json";
import pastryEn from "../assets/pastry.en.json";
import type { Locale } from "../i18n";

export interface CatalogProduct {
  imageUrl: string | string[];
  title: string;
  assortments?: string;
  desc?: string[];
  price: number;
  min?: number;
  unit?: string;
}

export interface CatalogCollections {
  cakes: CatalogProduct[];
  pastries: CatalogProduct[];
  bakery: CatalogProduct[];
  allProducts: CatalogProduct[];
  productMap: Map<string, CatalogProduct>;
}

export function getProductId(product: Pick<CatalogProduct, "imageUrl">): string {
  if (Array.isArray(product.imageUrl)) {
    return product.imageUrl[0] ?? "";
  }

  return product.imageUrl;
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
    productMap: new Map(allProducts.map((product) => [getProductId(product), product])),
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
