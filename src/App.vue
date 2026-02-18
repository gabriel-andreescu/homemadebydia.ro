<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import AppHeader from "./components/AppHeader.vue";
import AppSection from "./components/AppSection.vue";
import SectionHome from "./components/SectionHome.vue";
import SectionCatalog from "./components/SectionCatalog.vue";
import CartDrawer from "./components/CartDrawer.vue";
import CartToast from "./components/CartToast.vue";
import { useCart } from "./composables/useCart";
import { useCatalogTabs } from "./composables/useCatalogTabs";
import { useDocumentTitle } from "./composables/useDocumentTitle";
import { CONTACT } from "./constants";
import IconClose from "./components/icons/IconClose.vue";
import IconPhone from "./components/icons/IconPhone.vue";
import IconWhatsappBrand from "./components/icons/IconWhatsappBrand.vue";
import { useDialogA11y } from "./composables/useDialogA11y";
import { registerLazySectionReveal } from "./composables/useLazySectionReveal";

const loadSectionGallery = () => import("./components/SectionGallery.vue");
const loadSectionAboutUs = () => import("./components/SectionAboutUs.vue");
const loadSectionWhyChooseUs = () => import("./components/SectionWhyChooseUs.vue");
const loadSectionTestimonials = () => import("./components/SectionTestimonials.vue");
const loadAppFooter = () => import("./components/AppFooter.vue");

const SectionGallery = defineAsyncComponent(loadSectionGallery);
const SectionAboutUs = defineAsyncComponent(loadSectionAboutUs);
const SectionWhyChooseUs = defineAsyncComponent(loadSectionWhyChooseUs);
const SectionTestimonials = defineAsyncComponent(loadSectionTestimonials);
const AppFooter = defineAsyncComponent(loadAppFooter);

const { t } = useI18n();
const cart = useCart();
const { setCatalogInView } = useCatalogTabs();
useDocumentTitle();

const catalogReached = ref(false);
const contactInView = ref(false);
const showFloatingCTA = computed(() => catalogReached.value && !contactInView.value);
const phoneDialogOpen = ref(false);
const phoneDialogRef = ref<HTMLElement | null>(null);
const showGallery = ref(false);
const showAboutUs = ref(false);
const showWhyChooseUs = ref(false);
const showTestimonials = ref(false);
const showFooter = ref(false);

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
let galleryLazyObserver: IntersectionObserver | null = null;
let aboutUsLazyObserver: IntersectionObserver | null = null;
let whyChooseUsLazyObserver: IntersectionObserver | null = null;
let testimonialsLazyObserver: IntersectionObserver | null = null;
let footerLazyObserver: IntersectionObserver | null = null;

const LAZY_SECTION_ROOT_MARGIN = "1200px 0px";

const setupRevealObserver = (targetId: string, reveal: (visible: boolean) => void) => {
  const target = document.getElementById(targetId);
  if (!target) {
    reveal(true);
    return null;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        reveal(true);
        observer.disconnect();
      }
    },
    { threshold: 0, rootMargin: LAZY_SECTION_ROOT_MARGIN },
  );

  observer.observe(target);
  return observer;
};

const setupContactObserver = () => {
  contactObserver?.disconnect();
  contactObserver = null;

  const contactSection = document.getElementById("contact");
  if (!contactSection) {
    contactInView.value = false;
    return;
  }

  contactObserver = new IntersectionObserver(
    ([entry]) => {
      contactInView.value = entry.isIntersecting;
    },
    { threshold: 0.1 },
  );
  contactObserver.observe(contactSection);
};

const revealSectionsUpTo = async (targetId: string) => {
  const preloadPromises: Promise<unknown>[] = [];
  const ensureRevealed = (current: boolean, show: () => void, preload: () => Promise<unknown>) => {
    if (current) return;
    show();
    preloadPromises.push(preload());
  };

  if (targetId === "galerie") {
    ensureRevealed(showGallery.value, () => (showGallery.value = true), loadSectionGallery);
  } else if (targetId === "despre-noi") {
    ensureRevealed(showGallery.value, () => (showGallery.value = true), loadSectionGallery);
    ensureRevealed(showAboutUs.value, () => (showAboutUs.value = true), loadSectionAboutUs);
  } else if (targetId === "de-ce-noi") {
    ensureRevealed(showGallery.value, () => (showGallery.value = true), loadSectionGallery);
    ensureRevealed(showAboutUs.value, () => (showAboutUs.value = true), loadSectionAboutUs);
    ensureRevealed(
      showWhyChooseUs.value,
      () => (showWhyChooseUs.value = true),
      loadSectionWhyChooseUs,
    );
  } else if (targetId === "testimoniale") {
    ensureRevealed(showGallery.value, () => (showGallery.value = true), loadSectionGallery);
    ensureRevealed(showAboutUs.value, () => (showAboutUs.value = true), loadSectionAboutUs);
    ensureRevealed(
      showWhyChooseUs.value,
      () => (showWhyChooseUs.value = true),
      loadSectionWhyChooseUs,
    );
    ensureRevealed(
      showTestimonials.value,
      () => (showTestimonials.value = true),
      loadSectionTestimonials,
    );
  } else if (targetId === "cum-sa-comanzi" || targetId === "contact") {
    ensureRevealed(showGallery.value, () => (showGallery.value = true), loadSectionGallery);
    ensureRevealed(showAboutUs.value, () => (showAboutUs.value = true), loadSectionAboutUs);
    ensureRevealed(
      showWhyChooseUs.value,
      () => (showWhyChooseUs.value = true),
      loadSectionWhyChooseUs,
    );
    ensureRevealed(
      showTestimonials.value,
      () => (showTestimonials.value = true),
      loadSectionTestimonials,
    );
    ensureRevealed(showFooter.value, () => (showFooter.value = true), loadAppFooter);
  }

  if (preloadPromises.length > 0) {
    await Promise.all(preloadPromises);
    await nextTick();
  }
};

const unregisterLazySectionReveal = registerLazySectionReveal(async (targetId) => {
  await revealSectionsUpTo(targetId);
});

watch(showFooter, async (visible) => {
  if (!visible) return;
  await nextTick();
  setupContactObserver();
});

onMounted(() => {
  if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
    showGallery.value = true;
    showAboutUs.value = true;
    showWhyChooseUs.value = true;
    showTestimonials.value = true;
    showFooter.value = true;
  } else {
    galleryLazyObserver = setupRevealObserver("galerie", (visible) => {
      showGallery.value = visible;
    });
    aboutUsLazyObserver = setupRevealObserver("despre-noi", (visible) => {
      showAboutUs.value = visible;
    });
    whyChooseUsLazyObserver = setupRevealObserver("de-ce-noi", (visible) => {
      showWhyChooseUs.value = visible;
    });
    testimonialsLazyObserver = setupRevealObserver("testimoniale", (visible) => {
      showTestimonials.value = visible;
    });
    footerLazyObserver = setupRevealObserver("footer-sentinel", (visible) => {
      showFooter.value = visible;
    });
  }

  // Sticky tabs: IntersectionObserver (avoids scroll + getBoundingClientRect forced reflow)
  const catalogSection = document.getElementById("catalog");
  const catalogTopSentinel = document.getElementById("catalog-top-sentinel");

  const catalogVisible = ref(false);
  const topSentinelVisible = ref(true);
  const updateStickyTabs = () => setCatalogInView(catalogVisible.value && !topSentinelVisible.value);

  if (catalogSection) {
    stickyTabsCatalogObserver = new IntersectionObserver(
      ([entry]) => {
        catalogVisible.value = entry.isIntersecting;
        updateStickyTabs();
      },
      { threshold: 0 },
    );
    stickyTabsCatalogObserver.observe(catalogSection);
  }

  if (catalogTopSentinel) {
    stickyTabsTopObserver = new IntersectionObserver(
      ([entry]) => {
        topSentinelVisible.value = entry.isIntersecting;
        updateStickyTabs();
      },
      // Account for the fixed header so "top sentinel visible" means "you are still at the top of catalog"
      // even when the header overlaps the page.
      { threshold: 0, rootMargin: "-140px 0px 0px 0px" },
    );
    stickyTabsTopObserver.observe(catalogTopSentinel);
  }

  // Track when catalog section has been reached (for floating CTA)
  const catalogSectionForCta = document.getElementById("catalog");
  if (catalogSectionForCta) {
    catalogObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          catalogReached.value = true;
        } else if (entry.boundingClientRect.top > 0) {
          // Scrolled back up above catalog
          catalogReached.value = false;
        }
      },
      { threshold: 0.1 },
    );
    catalogObserver.observe(catalogSectionForCta);
  }

  setupContactObserver();
});

onUnmounted(() => {
  catalogObserver?.disconnect();
  contactObserver?.disconnect();
  stickyTabsCatalogObserver?.disconnect();
  stickyTabsTopObserver?.disconnect();
  galleryLazyObserver?.disconnect();
  aboutUsLazyObserver?.disconnect();
  whyChooseUsLazyObserver?.disconnect();
  testimonialsLazyObserver?.disconnect();
  footerLazyObserver?.disconnect();
  unregisterLazySectionReveal();
});
</script>

<template>
  <div id="page-top-sentinel" class="h-0" aria-hidden="true"></div>
  <AppHeader />
  <main class="container mx-auto pt-32">
    <SectionHome />
    <AppSection :title="t('sections.catalog')" id="catalog">
      <div id="catalog-top-sentinel" class="h-0" aria-hidden="true"></div>
      <SectionCatalog />
    </AppSection>
    <AppSection :title="t('sections.gallery')" id="galerie" class="px-2">
      <SectionGallery v-if="showGallery" />
    </AppSection>
    <AppSection :title="t('sections.aboutUs')" id="despre-noi">
      <SectionAboutUs v-if="showAboutUs" />
    </AppSection>
    <AppSection :title="t('sections.whyUs')" id="de-ce-noi">
      <SectionWhyChooseUs v-if="showWhyChooseUs" />
    </AppSection>
    <AppSection :title="t('sections.testimonials')" id="testimoniale">
      <SectionTestimonials v-if="showTestimonials" />
    </AppSection>
  </main>
  <div id="footer-sentinel" class="h-px" aria-hidden="true"></div>
  <AppFooter v-if="showFooter" />

  <!-- Cart drawer + toast -->
  <CartDrawer />
  <CartToast />

  <!-- Floating contact FABs -->
  <Transition name="fade-slide-right">
    <nav
      v-if="showFloatingCTA"
      class="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-center gap-3"
      :aria-label="t('accessibility.quickContact')"
    >
      <!-- Phone (mobile direct call) -->
      <a
        :href="`tel:${CONTACT.phone}`"
        class="flex lg:hidden items-center justify-center w-12 h-12 bg-accent dark:bg-accent text-white rounded-full shadow-md active:scale-95 transition-all"
        :aria-label="t('accessibility.callNow')"
      >
        <IconPhone class="w-5 h-5" />
      </a>

      <!-- Phone (desktop opens number modal) -->
      <button
        type="button"
        class="hidden lg:flex items-center justify-center w-12 h-12 bg-accent dark:bg-accent text-white rounded-full shadow-md active:scale-95 transition-all"
        :aria-label="t('accessibility.callNow')"
        aria-haspopup="dialog"
        :aria-expanded="phoneDialogOpen ? 'true' : 'false'"
        @click="phoneDialogOpen = true"
      >
        <IconPhone class="w-5 h-5" />
      </button>

      <!-- WhatsApp -->
      <a
        :href="cart.count.value > 0 ? cart.whatsappUrl.value : CONTACT.whatsapp"
        target="_blank"
        class="flex items-center justify-center w-12 h-12 bg-whatsapp text-white rounded-full shadow-md active:scale-95 transition-all"
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
          class="relative w-full max-w-xs rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl text-center"
        >
          <button
            type="button"
            class="absolute top-2 right-2 grid place-items-center w-9 h-9 text-gray-700 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 transition-colors"
            :aria-label="t('accessibility.closeDialog')"
            @click="phoneDialogOpen = false"
          >
            <IconClose class="w-7 h-7" />
          </button>
          <h2 id="phone-dialog-title" class="sr-only">{{ t("accessibility.callNow") }}</h2>
          <a
            :href="`tel:${CONTACT.phone}`"
            class="inline-flex items-center justify-center text-2xl font-medium tracking-wide underline decoration-2 underline-offset-4 text-accent dark:text-accent-light hover:text-accent-dark dark:hover:text-white transition-colors"
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}

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
  transition: opacity 0.2s ease;
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
