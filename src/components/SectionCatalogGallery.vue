<script setup lang="ts">
import { defineAsyncComponent, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type GalleryModal from "./GalleryModal.vue";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import GalleryItem from "./GalleryItem.vue";
import { useCart } from "../composables/useCart";
import IconCheck from "./icons/IconCheck.vue";
import IconX from "./icons/IconX.vue";
import { getProductId, type CatalogProduct } from "../data/catalogData";

const AsyncGalleryModal = defineAsyncComponent(() => import("./GalleryModal.vue"));

defineProps<{
  data: CatalogProduct[];
}>();

const { t } = useI18n();
const cart = useCart();
const expandedItems = ref<Set<string>>(new Set());
const galleryModalRef = ref<InstanceType<typeof GalleryModal> | null>(null);
const galleryModalMounted = ref(false);
const galleryModalImages = ref<string[]>([]);
const pendingGalleryIndex = ref<number | null>(null);

const toggleExpand = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};

const openGallery = async (images: string[], index: number) => {
  galleryModalImages.value = images;
  galleryModalMounted.value = true;
  pendingGalleryIndex.value = index;
  await nextTick();
  if (!galleryModalRef.value) return;

  galleryModalRef.value.openAt(index);
  pendingGalleryIndex.value = null;
};

watch(galleryModalRef, (modal) => {
  if (!modal || pendingGalleryIndex.value === null) return;

  modal.openAt(pendingGalleryIndex.value);
  pendingGalleryIndex.value = null;
});
</script>

<template>
  <div class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
    <div
      v-for="(item, index) in data"
      :key="item.title"
      class="card-stagger flex flex-col bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
      :style="{ animationDelay: `${index * 40}ms` }"
    >
      <div class="relative w-full aspect-square overflow-hidden cursor-pointer">
        <AppDeferredMedia
          wrapper-class="w-full h-full"
          placeholder-class="w-full h-full bg-surface-sunk"
          root-margin="0px 0px"
        >
          <div v-if="Array.isArray(item.imageUrl)" class="grid grid-cols-2 h-full">
            <div
              v-for="(imagePath, imageIndex) in item.imageUrl"
              :key="imagePath"
              class="overflow-hidden"
            >
              <GalleryItem
                :image-path="imagePath"
                :alt="item.title + ' ' + t('accessibility.productAltSuffix')"
                :rounded="false"
                :cover="true"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, min(25vw, 384px)"
                @open="openGallery(item.imageUrl, imageIndex)"
              />
            </div>
          </div>
          <GalleryItem
            v-else
            :image-path="item.imageUrl"
            :alt="item.title + ' ' + t('accessibility.productAltSuffix')"
            :cover="true"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, min(25vw, 384px)"
            @open="openGallery([item.imageUrl], 0)"
          />
        </AppDeferredMedia>
      </div>

      <div class="flex-1 flex flex-col p-3">
        <h3
          class="text-sm md:text-base font-semibold text-ink leading-tight"
        >
          {{ item.title }}
        </h3>
        <p class="text-xs text-ink-muted mt-0.5" v-if="item.assortments">
          {{ item.assortments }}
        </p>

        <!-- Description list -->
        <div v-if="item.desc" class="mt-2">
          <div
            class="relative overflow-hidden transition-all duration-300"
            :class="[
              expandedItems.has(getProductId(item))
                ? 'max-h-96'
                : 'max-h-[4.25rem] md:max-h-20 min-h-[4.25rem] md:min-h-20',
              item.desc.length > 3 ? 'cursor-pointer' : '',
            ]"
            @click="item.desc.length > 3 && toggleExpand(getProductId(item))"
          >
            <ul class="text-left text-xs text-ink-muted leading-snug space-y-0.5">
              <li v-for="desc in item.desc" :key="desc" class="flex items-start gap-1.5">
                <span class="text-brand-ink shrink-0 text-[10px] mt-0.5">
                  ●
                </span>
                <span>{{ desc.replace(/^-\s*/, "").replace(/^\*\s*/, "") }}</span>
              </li>
            </ul>
            <div
              v-if="item.desc.length > 3"
              class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-surface to-transparent pointer-events-none transition-opacity duration-300"
              :class="expandedItems.has(getProductId(item)) ? 'opacity-0' : 'opacity-100'"
            ></div>
          </div>
          <!-- Fixed-height row for button alignment -->
          <div class="h-5 flex items-center">
            <button
              v-if="item.desc.length > 3"
              @click="toggleExpand(getProductId(item))"
              class="text-[11px] text-brand-ink hover:underline"
            >
              {{ expandedItems.has(getProductId(item)) ? t("product.seeLess") : t("product.seeMore") }}
            </button>
          </div>
        </div>

        <!-- Price + Button pushed to bottom -->
        <div class="mt-auto pt-3 border-t border-line">
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-brand-ink">
              {{ item.price }}
            </span>
            <span class="text-xs text-ink-muted font-medium">
              {{ t("product.pricePerUnit") }}
              <span v-if="item.unit">/{{ item.unit }}</span>
            </span>
          </div>
          <p class="text-[11px] text-ink-muted" v-if="item.min">
            {{ t("product.minimum") }} {{ item.min }} {{ item.unit }}
          </p>

          <button
            v-if="!cart.has(getProductId(item))"
            @click="cart.add(item)"
            class="mt-2.5 w-full py-2 border border-line-strong text-ink text-sm font-medium tracking-wide rounded-full hover:border-brand hover:text-brand-ink active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-all"
          >
            {{ t("product.addToCart") }}
          </button>
          <div v-else class="mt-2.5 flex gap-1.5">
            <div
              class="flex-1 py-2 bg-brand/10 text-brand-ink text-sm font-medium tracking-wide rounded-full flex items-center justify-center gap-1.5"
            >
              <IconCheck class="w-4 h-4" />
              {{ t("product.inCart") }}
            </div>
            <button
              @click="cart.remove(getProductId(item))"
              class="px-2.5 py-2 text-ink-faint hover:text-danger hover:bg-danger-soft rounded-full transition-colors"
              :title="t('product.removeFromCart')"
            >
              <IconX class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AsyncGalleryModal
    v-if="galleryModalMounted"
    ref="galleryModalRef"
    :images="galleryModalImages"
  />
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
