<script setup lang="ts">
import { useI18n } from "vue-i18n";
import IconCart from "./icons/IconCart.vue";
import { useCart } from "../composables/useCart";

const { t } = useI18n();
const cart = useCart();
</script>

<template>
  <button
    v-if="cart.count.value > 0"
    @click="cart.openDrawer()"
    class="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-accent dark:hover:text-accent-vivid rounded-full transition-colors"
    :class="{ 'animate-bounce-once': cart.lastAdded.value }"
    :aria-label="t('accessibility.cartItems', { count: cart.count.value })"
  >
    <IconCart class="w-6 h-6" />
    <span
      class="absolute top-0 right-0 min-w-4 h-4 px-1 bg-accent dark:bg-accent-vivid text-white text-[10px] font-bold rounded-full flex items-center justify-center"
    >
      {{ cart.count.value }}
    </span>
  </button>
</template>

<style scoped>
@keyframes bounce-once {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.25); }
  50% { transform: scale(0.95); }
  75% { transform: scale(1.1); }
}

.animate-bounce-once {
  animation: bounce-once 0.4s ease-out;
}
</style>

