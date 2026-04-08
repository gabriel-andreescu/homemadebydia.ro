import { computed, onMounted, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { CONTACT } from "../constants";
import type { Locale } from "../i18n";
import type { CatalogProduct } from "../data/catalogData";
import { formatQuantityLabel, normalizeQuantity } from "../utils/quantity";

interface CartItemSnapshot {
  title: string;
  price: number;
  unit: string;
  min: number;
}

interface StoredCartItem {
  id: string;
  quantity: number;
  snapshot?: CartItemSnapshot;
}

export interface CartItem {
  id: string;
  title: string;
  quantity: number;
  unit: string;
  price: number;
  min: number;
}

const STORAGE_KEY = "homemadebydia_cart";
const drawerOpen = ref(false);
const lastAdded = ref<string | null>(null);
const storedItems = ref<StoredCartItem[]>([]);
const productMapsByLocale = shallowRef<Partial<Record<Locale, Map<string, CatalogProduct>>>>({});

const pendingProductMaps = new Map<Locale, Promise<Map<string, CatalogProduct>>>();
const EMPTY_PRODUCT_MAP = new Map<string, CatalogProduct>();

let initialized = false;
let persistenceInitialized = false;

function getProductId(product: Pick<CatalogProduct, "imageUrl">): string {
  if (Array.isArray(product.imageUrl)) {
    return product.imageUrl[0] ?? "";
  }

  return product.imageUrl;
}

function buildSnapshot(product: CatalogProduct): CartItemSnapshot {
  return {
    title: product.title,
    price: product.price,
    unit: product.unit ?? "buc",
    min: product.min ?? 1,
  };
}

function repairStoredItemsWithProductMap(productMap: Map<string, CatalogProduct>) {
  storedItems.value.forEach((stored) => {
    const product = productMap.get(stored.id);
    if (!product) return;

    const unit = product.unit ?? "buc";
    const normalizedQuantity = normalizeQuantity(stored.quantity, unit);

    if (stored.quantity !== normalizedQuantity) {
      stored.quantity = normalizedQuantity;
    }

    if (!stored.snapshot) {
      stored.snapshot = buildSnapshot(product);
    }
  });
}

function loadFromStorage(): StoredCartItem[] {
  if (typeof localStorage === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (!item || typeof item.id !== "string" || typeof item.quantity !== "number") {
          return null;
        }

        const snapshot =
          item.snapshot &&
          typeof item.snapshot.title === "string" &&
          typeof item.snapshot.price === "number" &&
          typeof item.snapshot.unit === "string" &&
          typeof item.snapshot.min === "number"
            ? {
                title: item.snapshot.title,
                price: item.snapshot.price,
                unit: item.snapshot.unit,
                min: item.snapshot.min,
              }
            : undefined;

        return {
          id: item.id,
          quantity: snapshot ? normalizeQuantity(item.quantity, snapshot.unit) : item.quantity,
          snapshot,
        };
      })
      .filter((item): item is StoredCartItem => item !== null);
  } catch {
    return [];
  }
}

async function ensureCatalogProductMap(locale: Locale): Promise<Map<string, CatalogProduct>> {
  const cached = productMapsByLocale.value[locale];
  if (cached) {
    repairStoredItemsWithProductMap(cached);
    return cached;
  }

  const pending = pendingProductMaps.get(locale);
  if (pending) {
    return pending;
  }

  const loadPromise = import("../data/catalogData")
    .then(({ getCatalogProductMap }) => {
      const productMap = getCatalogProductMap(locale);
      productMapsByLocale.value = {
        ...productMapsByLocale.value,
        [locale]: productMap,
      };
      repairStoredItemsWithProductMap(productMap);
      pendingProductMaps.delete(locale);
      return productMap;
    })
    .catch((error) => {
      pendingProductMaps.delete(locale);
      throw error;
    });

  pendingProductMaps.set(locale, loadPromise);
  return loadPromise;
}

function ensureClientInitialization() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  storedItems.value = loadFromStorage();
}

function ensurePersistenceWatcher() {
  if (persistenceInitialized) return;
  persistenceInitialized = true;

  watch(
    storedItems,
    (newItems) => {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    },
    { deep: true },
  );
}

export function useCart() {
  const { locale } = useI18n();

  onMounted(() => {
    ensureClientInitialization();

    if (storedItems.value.length > 0) {
      void ensureCatalogProductMap(locale.value as Locale);
    }
  });

  ensurePersistenceWatcher();

  watch(
    () => locale.value,
    (nextLocale) => {
      if (storedItems.value.length > 0) {
        void ensureCatalogProductMap(nextLocale as Locale);
      }
    },
  );

  const productMap = computed(
    () => productMapsByLocale.value[locale.value as Locale] ?? EMPTY_PRODUCT_MAP,
  );

  const items = computed<CartItem[]>(() =>
    storedItems.value
      .map((stored) => {
        const product = productMap.value.get(stored.id);
        const snapshot = product ? buildSnapshot(product) : stored.snapshot;
        if (!snapshot) return null;

        return {
          id: stored.id,
          title: snapshot.title,
          quantity: normalizeQuantity(stored.quantity, snapshot.unit),
          unit: snapshot.unit,
          price: snapshot.price,
          min: snapshot.min,
        };
      })
      .filter((item): item is CartItem => item !== null),
  );

  const count = computed(() => storedItems.value.length);

  const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

  const whatsappUrl = computed(() => {
    if (items.value.length === 0) return CONTACT.whatsapp;

    const lines = items.value.map(
      (item) => `• ${item.title} - ${formatQuantityLabel(item.quantity, item.unit)}`,
    );
    const message = `Bună ziua! Aș dori să comand:\n${lines.join("\n")}\n\nMulțumesc!`;

    return `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
  });

  function add(product: CatalogProduct) {
    const id = getProductId(product);
    const existing = storedItems.value.find((item) => item.id === id);
    if (existing) return;

    storedItems.value.push({
      id,
      quantity: normalizeQuantity(product.min ?? 1, product.unit ?? "buc"),
      snapshot: buildSnapshot(product),
    });

    lastAdded.value = product.title;
    setTimeout(() => {
      lastAdded.value = null;
    }, 2500);
  }

  function update(id: string, quantity: number) {
    const stored = storedItems.value.find((item) => item.id === id);
    if (!stored) return;

    const product = productMap.value.get(id);
    const minimum = product?.min ?? stored.snapshot?.min ?? 1;
    const unit = product?.unit ?? stored.snapshot?.unit ?? "buc";
    stored.quantity = normalizeQuantity(Math.max(minimum, quantity), unit);

    if (product) {
      stored.snapshot = buildSnapshot(product);
    }
  }

  function remove(id: string) {
    const index = storedItems.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      storedItems.value.splice(index, 1);
    }
  }

  function clear() {
    storedItems.value = [];
  }

  function has(id: string) {
    return storedItems.value.some((item) => item.id === id);
  }

  function openDrawer() {
    void ensureCatalogProductMap(locale.value as Locale);
    drawerOpen.value = true;
  }

  function closeDrawer() {
    drawerOpen.value = false;
  }

  return {
    items,
    count,
    total,
    whatsappUrl,
    add,
    update,
    remove,
    clear,
    has,
    drawerOpen,
    openDrawer,
    closeDrawer,
    lastAdded,
  };
}
