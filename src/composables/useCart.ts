import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { CONTACT } from "../constants";
import { getCatalogProductMap, getProductId, type CatalogProduct } from "../data/catalogData";
import type { Locale } from "../i18n";
import { formatQuantityLabel, getQuantityStep, normalizeQuantity } from "../utils/quantity";

interface CartItemSnapshot {
  title: string;
  price: number;
  unit: string;
  min: number;
  step: number;
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
  step: number;
  price: number;
  min: number;
}

const STORAGE_KEY = "homemadebydia_cart";
const drawerOpen = ref(false);
const lastAdded = ref<string | null>(null);
const storedItems = ref<StoredCartItem[]>([]);
const ROMANIAN_CATALOG_PRODUCT_MAP = getCatalogProductMap("ro");

let initialized = false;
let persistenceInitialized = false;

function buildSnapshot(product: CatalogProduct): CartItemSnapshot {
  const unit = product.unit ?? "buc";

  return {
    title: product.title,
    price: product.price,
    unit,
    min: product.min ?? 1,
    step: getQuantityStep(unit, product.step),
  };
}

function repairStoredItemsWithProductMap(productMap: Map<string, CatalogProduct>) {
  storedItems.value.forEach((stored) => {
    const product = productMap.get(stored.id);
    if (!product) return;

    const snapshot = buildSnapshot(product);
    const normalizedQuantity = normalizeQuantity(stored.quantity, snapshot.unit, snapshot.step);

    if (stored.quantity !== normalizedQuantity) {
      stored.quantity = normalizedQuantity;
    }

    if (
      !stored.snapshot ||
      stored.snapshot.title !== snapshot.title ||
      stored.snapshot.price !== snapshot.price ||
      stored.snapshot.unit !== snapshot.unit ||
      stored.snapshot.min !== snapshot.min ||
      stored.snapshot.step !== snapshot.step
    ) {
      stored.snapshot = snapshot;
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
                step: getQuantityStep(
                  item.snapshot.unit,
                  typeof item.snapshot.step === "number" ? item.snapshot.step : undefined,
                ),
              }
            : undefined;

        return {
          id: item.id,
          quantity: snapshot
            ? normalizeQuantity(item.quantity, snapshot.unit, snapshot.step)
            : item.quantity,
          snapshot,
        };
      })
      .filter((item): item is StoredCartItem => item !== null);
  } catch {
    return [];
  }
}

function repairStoredItemsForLocale(locale: Locale) {
  repairStoredItemsWithProductMap(getCatalogProductMap(locale));
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
      repairStoredItemsForLocale(locale.value as Locale);
    }
  });

  ensurePersistenceWatcher();

  watch(
    () => locale.value,
    (nextLocale) => {
      if (storedItems.value.length > 0) {
        repairStoredItemsForLocale(nextLocale as Locale);
      }
    },
  );

  const productMap = computed(() => getCatalogProductMap(locale.value as Locale));

  const items = computed<CartItem[]>(() =>
    storedItems.value
      .map((stored) => {
        const product = productMap.value.get(stored.id);
        const snapshot = product ? buildSnapshot(product) : stored.snapshot;
        if (!snapshot) return null;

        return {
          id: stored.id,
          title: snapshot.title,
          quantity: normalizeQuantity(stored.quantity, snapshot.unit, snapshot.step),
          unit: snapshot.unit,
          step: snapshot.step,
          price: snapshot.price,
          min: snapshot.min,
        };
      })
      .filter((item): item is CartItem => item !== null),
  );

  const count = computed(() => storedItems.value.length);

  const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

  const whatsappUrl = computed(() => {
    if (storedItems.value.length === 0) return CONTACT.whatsapp;

    const lines = storedItems.value
      .map((stored) => {
        const product = ROMANIAN_CATALOG_PRODUCT_MAP.get(stored.id);
        const snapshot = product ? buildSnapshot(product) : stored.snapshot;
        if (!snapshot) return null;

        const quantity = normalizeQuantity(stored.quantity, snapshot.unit, snapshot.step);

        return `• ${snapshot.title} - ${formatQuantityLabel(quantity, snapshot.unit, snapshot.step)}`;
      })
      .filter((line): line is string => line !== null);

    if (lines.length === 0) return CONTACT.whatsapp;

    const message = `Bună ziua! Aș dori să comand:\n${lines.join("\n")}\n\nMulțumesc!`;

    return `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
  });

  function add(product: CatalogProduct) {
    const id = getProductId(product);
    const existing = storedItems.value.find((item) => item.id === id);
    if (existing) return;

    const snapshot = buildSnapshot(product);
    storedItems.value.push({
      id,
      quantity: normalizeQuantity(snapshot.min, snapshot.unit, snapshot.step),
      snapshot,
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
    const snapshot = product ? buildSnapshot(product) : stored.snapshot;
    if (!snapshot) return;

    stored.quantity = normalizeQuantity(
      Math.max(snapshot.min, quantity),
      snapshot.unit,
      snapshot.step,
    );
    stored.snapshot = snapshot;
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
