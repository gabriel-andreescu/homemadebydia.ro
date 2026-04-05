<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useCart } from "../composables/useCart";
import IconCheck from "./icons/IconCheck.vue";

const { t } = useI18n();
const cart = useCart();
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="cart.lastAdded.value"
        class="fixed top-20 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-full shadow-lg"
      >
        <IconCheck class="w-4 h-4 text-green-400 dark:text-green-600" />
        <span>{{ t('cart.addedToCart') }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -0.5rem);
}
</style>

