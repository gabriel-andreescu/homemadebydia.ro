<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import IconClose from "./icons/IconClose.vue";
import IconCart from "./icons/IconCart.vue";
import IconMinus from "./icons/IconMinus.vue";
import IconPlus from "./icons/IconPlus.vue";
import IconWhatsappBrand from "./icons/IconWhatsappBrand.vue";
import AppPicture from "./AppPicture.vue";
import { useDialogA11y } from "../composables/useDialogA11y";
import { useCart } from "../composables/useCart";
import { UNIT_STEPS, DEFAULT_UNIT_STEP } from "../constants";

const { t } = useI18n();
const cart = useCart();
const dialogRef = ref<HTMLElement | null>(null);

useDialogA11y(cart.drawerOpen, dialogRef, cart.closeDrawer);

const formatPrice = (price: number) => {
  return Math.round(price);
};

const getStep = (unit: string) => UNIT_STEPS[unit] ?? DEFAULT_UNIT_STEP;

const formatQuantity = (quantity: number, unit: string) => {
  const step = getStep(unit);
  if (step < 1) {
    return quantity.toFixed(1);
  }
  if (unit === "100 g") {
    return (quantity * 100).toFixed(0);
  }
  return quantity.toFixed(0);
};

const formatUnit = (unit: string) => {
  return unit === "100 g" ? "g" : unit;
};

const isEmpty = computed(() => cart.count.value === 0);
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="cart.drawerOpen.value"
        class="fixed inset-0 bg-black bg-opacity-50 z-[60]"
        @click="cart.closeDrawer()"
      >
        <div
          id="cart-drawer"
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          tabindex="-1"
          class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 id="cart-drawer-title" class="text-lg font-medium text-gray-800 dark:text-gray-100">
              {{ t('cart.myCart') }}
              <span v-if="!isEmpty" class="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({{ cart.count.value }} {{ cart.count.value === 1 ? t('cart.product') : t('cart.products') }})
              </span>
            </h2>
            <button
              type="button"
              @click="cart.closeDrawer()"
              class="grid place-items-center w-9 h-9 text-gray-700 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 transition-colors"
              :aria-label="t('cart.closeCart')"
            >
              <IconClose class="w-7 h-7" />
            </button>
          </div>

          <!-- Empty state -->
          <div v-if="isEmpty" class="flex flex-col items-center justify-center py-12 px-4">
            <IconCart class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" :stroke-width="1.5" />
            <p class="text-gray-500 dark:text-gray-400 text-center">{{ t('cart.emptyCart') }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">{{ t('cart.addFromCatalog') }}</p>
          </div>

          <!-- Cart items -->
          <div v-else class="flex-1 overflow-y-auto px-4 py-2">
            <div
              v-for="item in cart.items.value"
              :key="item.id"
              class="flex gap-3 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <!-- Product thumbnail -->
              <AppPicture
                :src="item.id"
                :alt="item.title"
                img-class="w-16 h-16 rounded-xl object-cover"
                sizes="64px"
              />

              <!-- Product details -->
              <div class="flex-1 min-w-0 flex flex-col">
                <!-- Title + base price -->
                <h3 class="font-medium text-gray-800 dark:text-gray-100 leading-snug">{{ item.title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.price }} lei/{{ item.unit }}</p>

                <!-- Controls row: Quantity + Price + Delete -->
                <div class="flex items-center justify-between mt-auto pt-1">
                  <!-- Quantity stepper -->
                  <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <button
                      @click="cart.update(item.id, item.quantity - getStep(item.unit))"
                      :disabled="item.quantity <= item.min"
                      class="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      :aria-label="t('cart.decreaseQuantity')"
                    >
                      <IconMinus class="w-3.5 h-3.5" />
                    </button>
                    <span class="w-12 text-center text-sm font-medium text-gray-800 dark:text-gray-100">
                      {{ formatQuantity(item.quantity, item.unit) }}{{ formatUnit(item.unit) }}
                    </span>
                    <button
                      @click="cart.update(item.id, item.quantity + getStep(item.unit))"
                      class="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      :aria-label="t('cart.increaseQuantity')"
                    >
                      <IconPlus class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <!-- Price + Delete -->
                  <div class="text-right">
                    <p class="font-semibold text-gray-800 dark:text-gray-100">{{ Math.round(item.price * item.quantity) }} lei</p>
                    <button
                      @click="cart.remove(item.id)"
                      class="text-xs text-gray-400 dark:text-gray-500 hover:text-accent dark:hover:text-accent-light transition-colors"
                      :aria-label="t('product.removeFromCart')"
                    >
                      {{ t('cart.delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="!isEmpty" class="px-4 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-600 dark:text-gray-400">{{ t('cart.estimate') }}</span>
              <span class="text-xl font-semibold text-gray-800 dark:text-gray-100">~{{ formatPrice(cart.total.value) }} lei</span>
            </div>
            <a
              :href="cart.whatsappUrl.value"
              target="_blank"
              @click="cart.closeDrawer()"
              class="flex items-center justify-center gap-2 w-full py-3 bg-whatsapp text-white font-medium rounded-xl shadow-lg hover:bg-whatsapp-hover active:scale-[0.98] transition-all"
            >
              <IconWhatsappBrand class="w-6 h-6" />
              {{ t('cart.sendOnWhatsApp') }}
            </a>
            <button
              @click="cart.clear()"
              class="w-full mt-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent-light transition-colors"
            >
              {{ t('cart.clearCart') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
