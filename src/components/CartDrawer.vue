<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import IconClose from "./icons/IconClose.vue";
import IconCart from "./icons/IconCart.vue";
import IconMinus from "./icons/IconMinus.vue";
import IconPlus from "./icons/IconPlus.vue";
import IconX from "./icons/IconX.vue";
import IconWhatsappBrand from "./icons/IconWhatsappBrand.vue";
import AppPicture from "./AppPicture.vue";
import { useDialogA11y } from "../composables/useDialogA11y";
import { useCart } from "../composables/useCart";
import { formatQuantity, formatQuantityUnit } from "../utils/quantity";

const { t } = useI18n();
const cart = useCart();
const dialogRef = ref<HTMLElement | null>(null);

useDialogA11y(cart.drawerOpen, dialogRef, cart.closeDrawer);

const formatPrice = (price: number) => {
  return Math.round(price);
};

const isEmpty = computed(() => cart.count.value === 0);
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="cart.drawerOpen.value"
        class="fixed inset-0 bg-black/50 z-[60]"
        @click="cart.closeDrawer()"
      >
        <div
          id="cart-drawer"
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          tabindex="-1"
          class="fixed bottom-0 left-0 right-0 bg-surface rounded-t-surface shadow-overlay max-h-[85vh] flex flex-col"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-line">
            <h2 id="cart-drawer-title" class="text-lead font-medium text-ink">
              {{ t('cart.myCart') }}
              <span v-if="!isEmpty" class="text-ui font-normal text-ink-muted">
                ({{ cart.count.value }} {{ cart.count.value === 1 ? t('cart.product') : t('cart.products') }})
              </span>
            </h2>
            <button
              type="button"
              @click="cart.closeDrawer()"
              class="grid place-items-center w-11 h-11 text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-colors"
              :aria-label="t('cart.closeCart')"
            >
              <IconClose class="w-7 h-7" />
            </button>
          </div>

          <!-- Empty state -->
          <div v-if="isEmpty" class="flex flex-col items-center justify-center py-12 px-4">
            <IconCart class="w-16 h-16 text-ink-faint mb-4" :stroke-width="1.5" />
            <p class="text-ink-muted text-center">{{ t('cart.emptyCart') }}</p>
            <p class="text-ui text-ink-faint mt-1">{{ t('cart.addFromCatalog') }}</p>
          </div>

          <!-- Cart items -->
          <div v-else class="flex-1 overflow-y-auto px-4 py-2">
            <div
              v-for="item in cart.items.value"
              :key="item.id"
              class="flex gap-3 py-4 border-b border-line last:border-0"
            >
              <!-- Product thumbnail -->
              <AppPicture
                :src="item.image"
                :alt="item.title"
                img-class="w-16 h-16 rounded-surface object-cover"
                sizes="64px"
              />

              <!-- Product details -->
              <div class="flex-1 min-w-0 flex flex-col">
                <!-- Title + base price -->
                <h3 class="font-medium text-ink leading-snug">{{ item.title }}</h3>
                <p class="text-ui text-ink-muted">{{ item.price }} lei/{{ item.unit }}</p>

                <ul v-if="item.extras.length" class="mt-1 flex flex-col gap-0.5">
                  <li
                    v-for="extra in item.extras"
                    :key="extra.name"
                    class="flex items-center gap-1.5 text-meta text-ink-muted"
                  >
                    <span class="min-w-0"
                      >+ {{ extra.name }} ({{ extra.price }} lei/{{ item.unit }})</span
                    >
                    <button
                      @click="cart.removeExtra(item.id, extra.name)"
                      class="-my-2 shrink-0 p-2 text-ink-faint hover:text-danger transition-colors rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      :aria-label="t('product.removeExtra', { name: extra.name })"
                    >
                      <IconX class="w-3 h-3" />
                    </button>
                  </li>
                </ul>

                <!-- Controls row: Quantity + Price + Delete -->
                <div class="flex items-center justify-between mt-auto pt-1">
                  <!-- Quantity stepper -->
                  <div class="flex items-center gap-1 bg-surface-sunk rounded-full">
                    <button
                      @click="cart.update(item.id, item.quantity - item.step)"
                      :disabled="item.quantity <= item.min"
                      class="w-11 h-11 flex items-center justify-center rounded-full text-ink-muted hover:bg-surface-sunk disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      :aria-label="t('cart.decreaseQuantity')"
                    >
                      <IconMinus class="w-3.5 h-3.5" />
                    </button>
                    <span class="w-12 text-center text-ui font-medium text-ink">
                      {{ formatQuantity(item.quantity, item.unit, item.step) }}{{ formatQuantityUnit(item.unit) }}
                    </span>
                    <button
                      @click="cart.update(item.id, item.quantity + item.step)"
                      class="w-11 h-11 flex items-center justify-center rounded-full text-ink-muted hover:bg-surface-sunk transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      :aria-label="t('cart.increaseQuantity')"
                    >
                      <IconPlus class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <!-- Price + Delete -->
                  <div class="text-right">
                    <p class="font-semibold text-ink">
                      {{ Math.round((item.price + item.extrasPerUnit) * item.quantity) }} lei
                    </p>
                    <button
                      @click="cart.remove(item.id)"
                      class="-mr-2 px-2 py-3.5 text-meta text-ink-faint hover:text-danger transition-colors rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      :aria-label="t('product.removeFromCart')"
                    >
                      {{ t('cart.delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="py-4 border-t border-line">
              <div class="flex items-center justify-between gap-3">
                <label
                  for="cart-order-notes"
                  class="text-ui font-medium text-ink-soft"
                >
                  {{ t("cart.orderNotes") }}
                </label>
                <span
                  id="cart-order-notes-count"
                  class="shrink-0 text-meta text-ink-faint"
                >
                  {{ cart.orderNotes.value.length }}/{{ cart.orderNotesMaxLength }}
                </span>
              </div>
              <textarea
                id="cart-order-notes"
                v-model="cart.orderNotes.value"
                :maxlength="cart.orderNotesMaxLength"
                :placeholder="t('cart.orderNotesPlaceholder')"
                aria-describedby="cart-order-notes-count"
                rows="4"
                class="block w-full mt-2 px-3 py-2.5 text-ui leading-relaxed text-ink placeholder:text-ink-faint bg-surface border border-line rounded-surface resize-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand focus-visible:border-transparent transition-colors"
              ></textarea>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="!isEmpty" class="px-4 py-4 border-t border-line bg-surface-sunk">
            <div class="mb-4">
              <div class="flex justify-between items-center gap-3">
                <span class="text-ink-muted">{{ t("cart.estimate") }}</span>
                <span class="shrink-0 text-lead font-semibold text-ink">
                  ~{{ formatPrice(cart.total.value) }} lei
                </span>
              </div>
              <p class="mt-1.5 text-meta leading-relaxed text-ink-muted">
                {{ t("cart.estimateNote") }}
              </p>
            </div>
            <a
              :href="cart.whatsappUrl.value"
              target="_blank"
              @click="cart.closeDrawer()"
              class="flex items-center justify-center gap-2 w-full py-3 bg-brand-solid text-on-brand font-medium rounded-surface shadow-raised hover:brightness-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-[transform,filter]"
            >
              <IconWhatsappBrand class="w-5 h-5" />
              {{ t('cart.sendOnWhatsApp') }}
            </a>
            <button
              @click="cart.clear()"
              class="w-full mt-2 py-3 text-ui font-medium border border-line-strong text-ink-muted rounded-full hover:border-danger hover:text-danger active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-[transform,color,border-color]"
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
  transition: opacity var(--duration-base) var(--ease-out);
}

.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform var(--duration-base) var(--ease-out);
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
