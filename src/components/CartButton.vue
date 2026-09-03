<script setup lang="ts">
import { useI18n } from "vue-i18n";
import IconCart from "./icons/IconCart.vue";
import { useCart } from "../composables/useCart";

const { t } = useI18n();
const cart = useCart();
</script>

<template>
  <!-- Transition on the wrapper; the button's transform belongs to the bounce. -->
  <Transition name="cart-slot">
    <span v-if="cart.count.value > 0" class="inline-flex overflow-hidden">
      <button
        @click="cart.openDrawer()"
        class="relative p-[10px] text-ink-muted hover:bg-surface-sunk hover:text-brand-ink rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        :class="{ 'animate-bounce-once': cart.lastAdded.value }"
        :aria-label="t('accessibility.cartItems', { count: cart.count.value })"
      >
        <IconCart class="size-[24px]" />
        <span
          class="absolute top-0 right-0 min-w-[16px] h-[16px] px-[4px] bg-brand-solid text-on-brand text-[11px] font-bold rounded-full flex items-center justify-center"
        >
          {{ cart.count.value }}
        </span>
      </button>
    </span>
  </Transition>
</template>

<style scoped>
.cart-slot-enter-active,
.cart-slot-leave-active {
  transition:
    max-width var(--duration-base) var(--ease-out),
    opacity var(--duration-short) var(--ease-out),
    margin-left var(--duration-base) var(--ease-out);
}

.cart-slot-enter-from,
.cart-slot-leave-to {
  max-width: 0;
  opacity: 0;
  /* Swallows the flex gap the slot is not yet entitled to. */
  margin-left: -0.25rem;
}

.cart-slot-enter-to,
.cart-slot-leave-from {
  max-width: 4rem;
}

@media (prefers-reduced-motion: reduce) {
  .cart-slot-enter-active,
  .cart-slot-leave-active {
    transition: none;
  }
}

@keyframes bounce-once {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.25); }
  50% { transform: scale(0.95); }
  75% { transform: scale(1.1); }
}

.animate-bounce-once {
  animation: bounce-once var(--duration-base) var(--ease-out);
}
</style>

