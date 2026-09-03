<script setup lang="ts">
import { defineAsyncComponent, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type GalleryModal from "./GalleryModal.vue";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import GalleryItem from "./GalleryItem.vue";
import { useCart } from "../composables/useCart";
import IconCart from "./icons/IconCart.vue";
import IconCheck from "./icons/IconCheck.vue";
import IconPlus from "./icons/IconPlus.vue";
import {
  getLayers,
  getProductImages,
  type CatalogProduct,
} from "../data/catalogData";
import type { Locale } from "../i18n";

const AsyncGalleryModal = defineAsyncComponent(() => import("./GalleryModal.vue"));

defineProps<{
  data: CatalogProduct[];
}>();

const { t, locale } = useI18n();
const cart = useCart();
const galleryModalRef = ref<InstanceType<typeof GalleryModal> | null>(null);
const galleryModalMounted = ref(false);
const galleryModalImages = ref<string[]>([]);
const pendingGalleryIndex = ref<number | null>(null);

const formatNumber = (value: number) =>
  new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 }).format(value);

// The estimate is the base the customer is committing to, so a chosen extra belongs in it.
const chosenExtrasPerUnit = (item: CatalogProduct) =>
  (item.extras ?? [])
    .filter((extra) => cart.hasExtra(item.id, extra.name))
    .reduce((sum, extra) => sum + extra.price, 0);

const minimumTotal = (item: CatalogProduct) =>
  Math.round((item.price + chosenExtrasPerUnit(item)) * (item.minimum ?? 0));

const productLayers = (item: CatalogProduct) => getLayers(item, locale.value as Locale);

const specs = (item: CatalogProduct) => {
  const out: string[] = [];
  if (item.minimum) {
    out.push(`${t("product.minimum")} ${formatNumber(item.minimum)} ${item.unit}`);
    out.push(`~${formatNumber(minimumTotal(item))} ${t("product.pricePerUnit")}`);
  }
  if (item.weight) out.push(item.weight);
  return out;
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
    <article
      v-for="(item, index) in data"
      :key="item.id"
      class="@container card-stagger flex flex-col bg-surface rounded-surface shadow-card hover:shadow-raised transition-shadow overflow-hidden"
      :style="{ animationDelay: `${index * 40}ms` }"
    >
      <div class="relative w-full aspect-square overflow-hidden cursor-pointer">
        <AppDeferredMedia
          wrapper-class="w-full h-full"
          placeholder-class="w-full h-full bg-surface-sunk"
          root-margin="0px 0px"
        >
          <div
            v-if="getProductImages(item).length > 1"
            class="grid grid-cols-2 h-full"
          >
            <div
              v-for="(imagePath, imageIndex) in getProductImages(item)"
              :key="imagePath"
              class="overflow-hidden"
            >
              <GalleryItem
                :image-path="imagePath"
                :alt="item.title + ' ' + t('accessibility.productAltSuffix')"
                :rounded="false"
                :cover="true"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, min(25vw, 384px)"
                @open="openGallery(getProductImages(item), imageIndex)"
              />
            </div>
          </div>
          <GalleryItem
            v-else
            :image-path="getProductImages(item)[0]"
            :alt="item.title + ' ' + t('accessibility.productAltSuffix')"
            :cover="true"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, min(25vw, 384px)"
            @open="openGallery(getProductImages(item), 0)"
          />
        </AppDeferredMedia>
      </div>

      <div class="flex-1 flex flex-col gap-2.5 sm:gap-3 p-3 sm:p-4">
        <h3
          class="card-title font-serif text-ink leading-tight text-balance"
        >
          {{ item.title }}
        </h3>
        <template v-if="productLayers(item).length">
          <p class="text-meta font-semibold uppercase tracking-[0.16em] text-ink-faint">
            {{ t("product.composition") }}
          </p>
          <ul class="strata card-body flex flex-col gap-1.5 text-ink-soft leading-snug">
            <li
              v-for="layer in productLayers(item)"
              :key="layer.name"
              :style="{ '--layer': layer.color }"
            >
              {{ layer.name }}
            </li>
          </ul>
        </template>

        <template v-if="item.variants?.length">
          <p class="text-meta font-semibold uppercase tracking-[0.16em] text-ink-faint">
            {{ t("product.variants") }}
          </p>
          <ul class="flex flex-wrap gap-1">
            <li
              v-for="variant in item.variants"
              :key="variant"
              class="rounded-control bg-ink/8 px-2 py-1 text-meta text-ink-soft"
            >
              {{ variant }}
            </li>
          </ul>
        </template>

        <p v-if="item.note" class="card-body text-ink-muted leading-snug">
          {{ item.note }}
        </p>

        <div v-if="item.extras?.length" class="mt-auto flex flex-col -space-y-px">
          <button
            v-for="extra in item.extras"
            :key="extra.name"
            type="button"
            :aria-pressed="cart.hasExtra(item.id, extra.name)"
            :aria-label="t('product.addExtra', { name: extra.name, price: extra.price })"
            class="card-body w-full border px-2.5 py-3 text-left text-ink-soft transition-colors first:rounded-t-control last:rounded-b-control focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand @min-[13rem]:flex @min-[13rem]:items-center @min-[13rem]:gap-2"
            :class="
              cart.hasExtra(item.id, extra.name)
                ? 'border-brand bg-brand/10'
                : 'border-line-strong hover:bg-surface-sunk'
            "
            @click="cart.toggleExtra(item, extra)"
          >
            <span class="@min-[13rem]:min-w-0"
              ><span
                class="mr-2 inline-grid size-5 place-items-center rounded-full bg-brand-solid align-middle text-on-brand"
                aria-hidden="true"
              >
                <IconCheck v-if="cart.hasExtra(item.id, extra.name)" class="w-3 h-3" />
                <IconPlus v-else class="w-3 h-3" />
              </span>{{ extra.name }}</span>
            <span class="font-semibold text-ink whitespace-nowrap @min-[13rem]:ml-auto">
              +{{ extra.price }} {{ t("product.pricePerUnit") }}/{{ item.unit }}
            </span>
          </button>
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between gap-3 border-t border-line bg-surface-sunk px-3 sm:px-4 py-3"
      >
        <p class="min-w-0 flex flex-col gap-0.5 leading-tight">
          <span class="card-price font-serif font-semibold tabular-nums text-ink">
            {{ item.price }} {{ t("product.pricePerUnit")
            }}<span v-if="item.unit" class="text-[0.6em] font-normal">/{{ item.unit }}</span>
          </span>
          <span
            v-if="specs(item).length"
            class="flex flex-row flex-wrap text-meta text-ink-faint"
          >
            <template v-for="(spec, specIndex) in specs(item)" :key="spec">
              <span v-if="specIndex" aria-hidden="true"
                >&nbsp;·&nbsp;</span
              >
              <span>{{ spec }}</span>
            </template>
          </span>
        </p>

        <button
          @click="
            cart.has(item.id) ? cart.openDrawer() : cart.add(item)
          "
          class="shrink-0 size-11 grid place-items-center rounded-surface transition-[transform,filter,box-shadow,color,background-color] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          :class="
            cart.has(item.id)
              ? 'bg-brand/15 text-brand-ink hover:bg-brand/25'
              : 'bg-brand-solid text-on-brand shadow-card hover:brightness-90 hover:shadow-raised'
          "
          :title="
            cart.has(item.id)
              ? t('product.inCartOpenCart')
              : t('product.addToCart')
          "
          :aria-label="
            cart.has(item.id)
              ? t('product.inCartOpenCart')
              : t('product.addToCart')
          "
        >
          <IconCheck v-if="cart.has(item.id)" class="w-5 h-5" />
          <IconCart v-else class="w-5 h-5" />
        </button>
      </div>
    </article>
  </div>
  <AsyncGalleryModal
    v-if="galleryModalMounted"
    ref="galleryModalRef"
    :images="galleryModalImages"
  />
</template>

<style scoped>
.card-stagger {
  animation: card-enter var(--duration-base) var(--ease-out) both;
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
