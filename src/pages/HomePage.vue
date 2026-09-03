<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import AppHeader from "../components/AppHeader.vue";
import AppSection from "../components/AppSection.vue";
import SectionHome from "../components/SectionHome.vue";
import SectionCatalog from "../components/SectionCatalog.vue";
import SectionGallery from "../components/SectionGallery.vue";
import SectionAboutUs from "../components/SectionAboutUs.vue";
import SectionReviews from "../components/SectionReviews.vue";
import AppFooter from "../components/AppFooter.vue";
import CartDrawer from "../components/CartDrawer.vue";
import CartToast from "../components/CartToast.vue";
import IconClose from "../components/icons/IconClose.vue";
import IconPhone from "../components/icons/IconPhone.vue";
import IconWhatsappBrand from "../components/icons/IconWhatsappBrand.vue";
import { useCart } from "../composables/useCart";
import { useCatalogTabs } from "../composables/useCatalogTabs";
import { useDialogA11y } from "../composables/useDialogA11y";
import { useInitialHashAlignment } from "../composables/useInitialHashAlignment";
import { useSiteHead } from "../composables/useSiteHead";
import { CONTACT } from "../constants";
import type { Locale } from "../i18n";
import { getLocalizedAnchor } from "../siteNavigation";

const { t, locale } = useI18n();
const currentLocale = computed(() => locale.value as Locale);
const getAnchorId = (key: Parameters<typeof getLocalizedAnchor>[0]) =>
  getLocalizedAnchor(key, currentLocale.value);
const cart = useCart();
const { setCatalogInView } = useCatalogTabs();

useSiteHead();
useInitialHashAlignment();

const catalogReached = ref(false);
const contactInView = ref(false);
const showFloatingCTA = computed(() => catalogReached.value && !contactInView.value);
const phoneDialogOpen = ref(false);
const phoneDialogRef = ref<HTMLElement | null>(null);

useDialogA11y(phoneDialogOpen, phoneDialogRef, () => {
  phoneDialogOpen.value = false;
});

watch(phoneDialogOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

let catalogObserver: IntersectionObserver | null = null;
let contactObserver: IntersectionObserver | null = null;
let stickyTabsCatalogObserver: IntersectionObserver | null = null;
let stickyTabsTopObserver: IntersectionObserver | null = null;

const setupContactObserver = () => {
  contactObserver?.disconnect();
  contactObserver = null;

  const contactSection = document.getElementById(getAnchorId("contact"));
  if (!contactSection) {
    contactInView.value = false;
    return;
  }

  contactObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      contactInView.value = entry.isIntersecting;
    },
    { threshold: 0.1 },
  );
  contactObserver.observe(contactSection);
};

watch(currentLocale, () => {
  setupContactObserver();
});

onMounted(() => {
  const catalogSection = document.getElementById(getAnchorId("catalog"));
  const catalogTopSentinel = document.getElementById("catalog-top-sentinel");

  const catalogVisible = ref(false);
  const catalogTopPassed = ref(false);
  const updateStickyTabs = () => setCatalogInView(catalogVisible.value && catalogTopPassed.value);

  if (catalogSection) {
    stickyTabsCatalogObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        catalogVisible.value = entry.isIntersecting;
        updateStickyTabs();
      },
      { threshold: 0 },
    );
    stickyTabsCatalogObserver.observe(catalogSection);
  }

  if (catalogTopSentinel) {
    stickyTabsTopObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        // isIntersecting is false on both sides of the root, so the sentinel's position
        // tells them apart; comparing to the bottom stays clear of the crossing point.
        const rootBottom = entry.rootBounds ? entry.rootBounds.bottom : window.innerHeight;
        catalogTopPassed.value =
          !entry.isIntersecting && entry.boundingClientRect.top < rootBottom;
        updateStickyTabs();
      },
      // Collapsed masthead (65px) plus the docked strip (46px).
      { threshold: 0, rootMargin: "-111px 0px 0px 0px" },
    );
    stickyTabsTopObserver.observe(catalogTopSentinel);
  }

  if (catalogSection) {
    catalogObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          catalogReached.value = true;
        } else if (entry.boundingClientRect.top > 0) {
          catalogReached.value = false;
        }
      },
      { threshold: 0.1 },
    );
    catalogObserver.observe(catalogSection);
  }

  setupContactObserver();
});

onUnmounted(() => {
  catalogObserver?.disconnect();
  contactObserver?.disconnect();
  stickyTabsCatalogObserver?.disconnect();
  stickyTabsTopObserver?.disconnect();
});
</script>

<template>
  <div id="page-top-sentinel" class="h-0" aria-hidden="true"></div>
  <AppHeader />
  <!-- Clears the 113px masthead and leaves air under its rule. -->
  <main class="pt-36">
    <div class="container mx-auto">
      <SectionHome />
      <AppSection
        :eyebrow="t('sections.catalog')"
        :title="t('sectionTitles.catalog')"
        :id="getAnchorId('catalog')"
        class="mt-16"
        head-class="px-2"
      >
        <SectionCatalog />
      </AppSection>
    </div>

    <div class="mt-16 py-16 bg-surface-sunk">
      <div class="container mx-auto">
        <AppSection
          :eyebrow="t('sections.gallery')"
          :title="t('sectionTitles.gallery')"
          :id="getAnchorId('gallery')"
          class="px-2"
        >
          <SectionGallery />
        </AppSection>
      </div>
    </div>

    <div class="container mx-auto">
      <AppSection :id="getAnchorId('aboutUs')" class="mt-16 px-2">
        <SectionAboutUs />
      </AppSection>
      <AppSection
        :eyebrow="t('sections.reviews')"
        :title="t('sectionTitles.reviews')"
        :id="getAnchorId('reviews')"
        class="mt-16"
        head-class="px-2"
      >
        <SectionReviews />
      </AppSection>
    </div>
  </main>
  <div id="footer-sentinel" class="h-px" aria-hidden="true"></div>
  <AppFooter />

  <CartDrawer />
  <CartToast />

  <Transition name="fade-slide-right">
    <nav
      v-if="showFloatingCTA"
      class="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-center gap-3"
      :aria-label="t('accessibility.quickContact')"
    >
      <a
        :href="`tel:${CONTACT.phone}`"
        class="flex lg:hidden items-center justify-center w-12 h-12 bg-brand-solid text-on-brand rounded-full shadow-card active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-transform"
        :aria-label="t('accessibility.callNow')"
      >
        <IconPhone class="w-5 h-5" />
      </a>

      <button
        type="button"
        class="hidden lg:flex items-center justify-center w-12 h-12 bg-brand-solid text-on-brand rounded-full shadow-card active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-transform"
        :aria-label="t('accessibility.callNow')"
        aria-haspopup="dialog"
        :aria-expanded="phoneDialogOpen ? 'true' : 'false'"
        @click="phoneDialogOpen = true"
      >
        <IconPhone class="w-5 h-5" />
      </button>

      <a
        :href="cart.count.value > 0 ? cart.whatsappUrl.value : CONTACT.whatsapp"
        target="_blank"
        class="flex items-center justify-center w-12 h-12 bg-whatsapp text-on-whatsapp rounded-full shadow-card active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-transform"
        :aria-label="t('accessibility.sendWhatsApp')"
      >
        <IconWhatsappBrand class="w-6 h-6" />
      </a>
    </nav>
  </Transition>

  <Teleport to="body">
    <Transition name="phone-dialog">
      <div
        v-if="phoneDialogOpen"
        class="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4"
        @click.self="phoneDialogOpen = false"
      >
        <div
          ref="phoneDialogRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="phone-dialog-title"
          tabindex="-1"
          class="relative w-full max-w-xs rounded-surface bg-surface p-6 shadow-overlay text-center"
        >
          <button
            type="button"
            class="absolute top-2 right-2 grid place-items-center w-9 h-9 text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-colors"
            :aria-label="t('accessibility.closeDialog')"
            @click="phoneDialogOpen = false"
          >
            <IconClose class="w-7 h-7" />
          </button>
          <h2 id="phone-dialog-title" class="sr-only">{{ t("accessibility.callNow") }}</h2>
          <a
            :href="`tel:${CONTACT.phone}`"
            class="inline-flex items-center justify-center text-title font-medium tracking-wide underline decoration-2 underline-offset-4 text-brand-ink hover:text-brand-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-control"
            @click="phoneDialogOpen = false"
          >
            {{ CONTACT.phoneDisplay }}
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-slide-right-enter-active,
.fade-slide-right-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-slide-right-enter-from,
.fade-slide-right-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}

.phone-dialog-enter-active,
.phone-dialog-leave-active {
  transition: opacity var(--duration-short) var(--ease-out);
}

.phone-dialog-enter-active > div,
.phone-dialog-leave-active > div {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.phone-dialog-enter-from,
.phone-dialog-leave-to {
  opacity: 0;
}

.phone-dialog-enter-from > div,
.phone-dialog-leave-to > div {
  transform: translateY(8px) scale(0.98);
  opacity: 0;
}
</style>
