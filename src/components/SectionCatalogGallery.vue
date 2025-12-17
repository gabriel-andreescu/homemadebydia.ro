<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import GalleryItem from "./GalleryItem.vue";
import { useCart } from "../composables/useCart";
import IconCheck from "./icons/IconCheck.vue";
import IconX from "./icons/IconX.vue";

interface CatalogGalleryDataItem {
  imageUrl: string | string[];
  title: string;
  assortments?: string;
  desc?: string | string[];
  price: number;
  min?: number;
  unit?: string;
}

defineProps<{
  data: CatalogGalleryDataItem[];
}>();

const { t } = useI18n();
const cart = useCart();
const expandedItems = ref<Set<string>>(new Set());

const getItemId = (item: CatalogGalleryDataItem) =>
  Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl;

const toggleExpand = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};
</script>

<template>
  <div class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
    <div
      v-for="(item, index) in data"
      :key="item.title"
      class="card-stagger flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
      :style="{ animationDelay: `${index * 40}ms` }"
    >
      <div class="relative w-full h-48 lg:h-72 overflow-hidden cursor-pointer">
        <div v-if="Array.isArray(item.imageUrl)" class="grid grid-cols-2 h-full">
          <div v-for="imagePath in item.imageUrl" :key="imagePath" class="overflow-hidden">
            <GalleryItem
              :image-path="imagePath"
              :alt="item.title + ' ' + t('accessibility.productAltSuffix')"
              :rounded="false"
              :cover="true"
            />
          </div>
        </div>
        <GalleryItem
          v-else
          :image-path="item.imageUrl"
          :alt="item.title + ' ' + t('accessibility.productAltSuffix')"
          :cover="true"
        />
      </div>

      <div class="flex-1 flex flex-col p-3">
        <h3
          class="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100 leading-tight"
        >
          {{ item.title }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5" v-if="item.assortments">
          {{ item.assortments }}
        </p>

        <!-- Description list -->
        <div v-if="item.desc" class="mt-2">
          <div
            class="relative overflow-hidden transition-all duration-300"
            :class="[
              expandedItems.has(getItemId(item))
                ? 'max-h-96'
                : 'max-h-[4.25rem] md:max-h-20 min-h-[4.25rem] md:min-h-20',
              item.desc.length > 3 ? 'cursor-pointer' : '',
            ]"
            @click="item.desc.length > 3 && toggleExpand(getItemId(item))"
          >
            <ul class="text-left text-xs text-gray-600 dark:text-gray-300 leading-snug space-y-0.5">
              <li v-for="desc in item.desc" :key="desc" class="flex items-start gap-1.5">
                <span class="text-accent dark:text-accent-vivid shrink-0 text-[10px] mt-0.5">
                  ●
                </span>
                <span>{{ desc.replace(/^-\s*/, "").replace(/^\*\s*/, "") }}</span>
              </li>
            </ul>
            <div
              v-if="item.desc.length > 3"
              class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none transition-opacity duration-300"
              :class="expandedItems.has(getItemId(item)) ? 'opacity-0' : 'opacity-100'"
            ></div>
          </div>
          <!-- Fixed-height row for button alignment -->
          <div class="h-5 flex items-center">
            <button
              v-if="item.desc.length > 3"
              @click="toggleExpand(getItemId(item))"
              class="text-[11px] text-accent dark:text-accent-light hover:underline"
            >
              {{ expandedItems.has(getItemId(item)) ? t("product.seeLess") : t("product.seeMore") }}
            </button>
          </div>
        </div>

        <!-- Price + Button pushed to bottom -->
        <div class="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-accent dark:text-accent-vivid">
              {{ item.price }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {{ t("product.pricePerUnit") }}
              <span v-if="item.unit">/{{ item.unit }}</span>
            </span>
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-300" v-if="item.min">
            {{ t("product.minimum") }} {{ item.min }} {{ item.unit }}
          </p>

          <button
            v-if="!cart.has(getItemId(item))"
            @click="cart.add(item)"
            class="mt-2.5 w-full py-2 bg-accent dark:bg-accent-vivid text-white text-sm font-medium tracking-wide rounded-full shadow-md shadow-accent/20 dark:shadow-accent-vivid/30 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all"
          >
            {{ t("product.addToCart") }}
          </button>
          <div v-else class="mt-2.5 flex gap-1.5">
            <div
              class="flex-1 py-2 bg-accent/10 dark:bg-accent-vivid/20 text-accent dark:text-accent-vivid text-sm font-medium tracking-wide rounded-full flex items-center justify-center gap-1.5"
            >
              <IconCheck class="w-4 h-4" />
              {{ t("product.inCart") }}
            </div>
            <button
              @click="cart.remove(getItemId(item))"
              class="px-2.5 py-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-full transition-colors"
              :title="t('product.removeFromCart')"
            >
              <IconX class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-stagger {
  animation: card-enter 0.35s ease-out both;
}

@keyframes card-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
