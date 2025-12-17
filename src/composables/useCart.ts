import { ref, computed, watch } from "vue";
import { CONTACT } from "../constants";
import cakes from "../assets/cakes.json";
import cookies from "../assets/cookies.json";
import pastry from "../assets/pastry.json";

// What we store in localStorage (minimal)
interface StoredCartItem {
  id: string;
  quantity: number;
}

// What we expose (resolved with fresh catalog data)
export interface CartItem {
  id: string;
  title: string;
  quantity: number;
  unit: string;
  price: number;
  min: number;
}

interface CatalogProduct {
  imageUrl: string | string[];
  title: string;
  price: number;
  min?: number;
  unit?: string;
}

const STORAGE_KEY = "homemadebydia_cart";
const drawerOpen = ref(false);
const lastAdded = ref<string | null>(null);

// Build lookup map from all catalogs
const allProducts = [...cakes, ...cookies, ...pastry] as CatalogProduct[];

function getProductId(product: CatalogProduct): string {
  return Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl;
}

const productMap = new Map<string, CatalogProduct>(allProducts.map((p) => [getProductId(p), p]));

function loadFromStorage(): StoredCartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const storedItems = ref<StoredCartItem[]>(loadFromStorage());

watch(
  storedItems,
  (newItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  },
  { deep: true },
);

export function useCart() {
  // Resolve stored items with fresh catalog data, filtering out missing products
  const items = computed<CartItem[]>(() => {
    return storedItems.value
      .map((stored) => {
        const product = productMap.get(stored.id);
        if (!product) return null;

        return {
          id: stored.id,
          title: product.title,
          quantity: stored.quantity,
          unit: product.unit ?? "buc",
          price: product.price,
          min: product.min ?? 1,
        };
      })
      .filter((item): item is CartItem => item !== null);
  });

  const count = computed(() => items.value.length);

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  const whatsappUrl = computed(() => {
    if (items.value.length === 0) return CONTACT.whatsapp;

    const lines = items.value.map((item) => `• ${item.title} - ${item.quantity}${item.unit}`);

    const message = `Bună ziua! Aș dori să comand:\n${lines.join("\n")}\n\nMulțumesc!`;

    return `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
  });

  function add(product: CatalogProduct) {
    const id = getProductId(product);

    const existing = storedItems.value.find((item) => item.id === id);
    if (existing) return;

    storedItems.value.push({
      id,
      quantity: product.min ?? 1,
    });

    // Trigger feedback (toast + animation)
    lastAdded.value = product.title;
    setTimeout(() => {
      lastAdded.value = null;
    }, 2500);
  }

  function update(id: string, quantity: number) {
    const stored = storedItems.value.find((i) => i.id === id);
    const product = productMap.get(id);
    if (stored && product) {
      stored.quantity = Math.max(product.min ?? 1, quantity);
    }
  }

  function remove(id: string) {
    const index = storedItems.value.findIndex((i) => i.id === id);
    if (index !== -1) {
      storedItems.value.splice(index, 1);
    }
  }

  function clear() {
    storedItems.value = [];
  }

  function has(id: string) {
    return storedItems.value.some((i) => i.id === id);
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
