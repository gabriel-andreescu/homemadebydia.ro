<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppTabs from "./AppTabs.vue";
import AppTab from "./AppTab.vue";
import SectionCatalogGallery from "./SectionCatalogGallery.vue";
import AppPicture from "./AppPicture.vue";
import GalleryModal from "./GalleryModal.vue";
import { getCatalogCollections } from "../data/catalogData";
import { PRICES } from "../constants";

const { t, locale } = useI18n();

const catalogCollections = computed(() => getCatalogCollections(locale.value === "en" ? "en" : "ro"));
const cakes = computed(() => catalogCollections.value.cakes);
const cookies = computed(() => catalogCollections.value.pastries);
const pastry = computed(() => catalogCollections.value.bakery);

const favorsModalRef = ref<InstanceType<typeof GalleryModal>>();
</script>

<template>
  <div class="w-full">
    <AppTabs :key="locale">
      <AppTab :title="t('catalog.cakes')" tab-key="cakes">
        <SectionCatalogGallery :data="cakes" />
        <div
          class="mt-6 mb-8 p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl shadow-sm text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3"
        >
          <p class="flex gap-2">
            <span class="text-accent dark:text-accent-light shrink-0">●</span>
            <span>
              {{ t("catalog.decorNote", { decorMin: PRICES.decorMin, decorMax: PRICES.decorMax }) }}
            </span>
          </p>
          <p class="flex gap-2">
            <span class="text-accent dark:text-accent-light shrink-0">●</span>
            <span>{{ t("catalog.allergyNote") }}</span>
          </p>
        </div>
      </AppTab>
      <AppTab :title="t('catalog.pastries')" tab-key="pastries">
        <SectionCatalogGallery :data="cookies" />
        <div
          class="mt-6 mb-8 p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl shadow-sm text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2"
        >
          <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {{ t("catalog.availableAssortments") }}
          </h3>
          <p class="flex gap-2">
            <span class="text-accent dark:text-accent-light shrink-0">●</span>
            <span>
              <strong class="text-gray-800 dark:text-gray-100">
                {{ t("catalog.chouxList").split(":")[0] }}:
              </strong>
              {{ t("catalog.chouxList").split(":")[1] }}
            </span>
          </p>
          <p class="flex gap-2">
            <span class="text-accent dark:text-accent-light shrink-0">●</span>
            <span>
              <strong class="text-gray-800 dark:text-gray-100">
                {{ t("catalog.tarteList").split(":")[0] }}:
              </strong>
              {{ t("catalog.tarteList").split(":")[1] }}
            </span>
          </p>
          <p class="flex gap-2">
            <span class="text-accent dark:text-accent-light shrink-0">●</span>
            <span>
              <strong class="text-gray-800 dark:text-gray-100">
                {{ t("catalog.miniPastriesList").split(":")[0] }}:
              </strong>
              {{ t("catalog.miniPastriesList").split(":")[1] }}
            </span>
          </p>
        </div>
      </AppTab>
      <AppTab :title="t('catalog.bakery')" tab-key="bakery">
        <SectionCatalogGallery :data="pastry" />
      </AppTab>
      <AppTab :title="t('catalog.events')" tab-key="events" class="container">
        <div
          class="p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl shadow-sm text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-6"
        >
          <!-- Oferta standard -->
          <section>
            <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {{ t("catalog.standardOffer") }}
            </h3>
            <p>
              {{
                t("catalog.standardOfferDesc", {
                  price: PRICES.candyBarPerPerson,
                  pastriesPerPerson: PRICES.pastriesPerPerson,
                  varietiesCount: PRICES.varietiesCount,
                  minimumGuests: PRICES.minimumGuests,
                })
              }}
            </p>
          </section>

          <section>
            <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {{ t("catalog.availableAssortments") }}
            </h3>
            <div class="space-y-1.5">
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>
                  <strong class="text-gray-800 dark:text-gray-100">
                    {{ t("catalog.chouxList").split(":")[0] }}:
                  </strong>
                  {{ t("catalog.chouxList").split(":")[1] }}
                </span>
              </p>
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>
                  <strong class="text-gray-800 dark:text-gray-100">
                    {{ t("catalog.tarteList").split(":")[0] }}:
                  </strong>
                  {{ t("catalog.tarteList").split(":")[1] }}
                </span>
              </p>
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>
                  <strong class="text-gray-800 dark:text-gray-100">
                    {{ t("catalog.dessertsGlassList").split(":")[0] }}:
                  </strong>
                  {{ t("catalog.dessertsGlassList").split(":")[1] }}
                </span>
              </p>
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>
                  <strong class="text-gray-800 dark:text-gray-100">
                    {{ t("catalog.miniPastriesList").split(":")[0] }}:
                  </strong>
                  {{ t("catalog.miniPastriesList").split(":")[1] }}
                </span>
              </p>
            </div>
          </section>

          <section>
            <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {{ t("catalog.customTheme") }}
            </h3>
            <p>
              {{
                t("catalog.customThemeDesc", { customThemeSurcharge: PRICES.customThemeSurcharge })
              }}
            </p>
          </section>

          <section>
            <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {{ t("catalog.optional") }}
            </h3>
            <div class="space-y-1.5">
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>{{ t("catalog.dishRental", { dishRental: PRICES.dishRental }) }}</span>
              </p>
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>{{ t("catalog.candyBarSetup", { candyBarSetup: PRICES.candyBarSetup }) }}</span>
              </p>
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>{{ t("catalog.dishPickup", { dishPickup: PRICES.dishPickup }) }}</span>
              </p>
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>{{ t("catalog.delivery", { delivery: PRICES.delivery }) }}</span>
              </p>
              <p class="flex gap-2">
                <span class="text-accent dark:text-accent-light shrink-0">●</span>
                <span>{{ t("catalog.favors", { favors: PRICES.favors }) }}</span>
              </p>
            </div>

            <figure class="mt-4">
              <AppPicture
                src="/gallery/marturii"
                :alt="t('catalog.favorsAlt')"
                img-class="w-1/2 h-auto rounded-lg cursor-pointer"
                @click="favorsModalRef?.openAt(0)"
                sizes="(max-width: 768px) 50vw, 384px"
              />
              <figcaption class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ t("catalog.favorsCaption") }}
              </figcaption>
            </figure>
          </section>
        </div>
      </AppTab>
    </AppTabs>
    <GalleryModal ref="favorsModalRef" :images="['/gallery/marturii']" />
  </div>
</template>
