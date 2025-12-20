<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppHeader from "./components/AppHeader.vue";
import AppSection from "./components/AppSection.vue";
import SectionHome from "./components/SectionHome.vue";
import SectionCatalog from "./components/SectionCatalog.vue";
import SectionWhyChooseUs from "./components/SectionWhyChooseUs.vue";
import AppFooter from "./components/AppFooter.vue";
import SectionGallery from "./components/SectionGallery.vue";
import SectionAboutUs from "./components/SectionAboutUs.vue";
import SectionTestimonials from "./components/SectionTestimonials.vue";
import CartDrawer from "./components/CartDrawer.vue";
import CartToast from "./components/CartToast.vue";
import { useCart } from "./composables/useCart";
import { useCatalogTabs } from "./composables/useCatalogTabs";
import { useDocumentTitle } from "./composables/useDocumentTitle";
import { CONTACT } from "./constants";
import IconPhone from "./components/icons/IconPhone.vue";
import IconWhatsappBrand from "./components/icons/IconWhatsappBrand.vue";

const { t } = useI18n();
const cart = useCart();
const { setCatalogInView } = useCatalogTabs();
useDocumentTitle();

const catalogReached = ref(false);
const contactInView = ref(false);
const showFloatingCTA = computed(() => catalogReached.value && !contactInView.value);

let catalogObserver: IntersectionObserver | null = null;
let contactObserver: IntersectionObserver | null = null;
let stickyTabsCatalogObserver: IntersectionObserver | null = null;
let stickyTabsTopObserver: IntersectionObserver | null = null;

onMounted(() => {
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

  // Track contact section visibility
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactObserver = new IntersectionObserver(
      ([entry]) => {
        contactInView.value = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    contactObserver.observe(contactSection);
  }
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
  <main class="container mx-auto pt-32">
    <SectionHome />
    <AppSection :title="t('sections.catalog')" id="catalog">
      <div id="catalog-top-sentinel" class="h-0" aria-hidden="true"></div>
      <SectionCatalog />
    </AppSection>
    <AppSection :title="t('sections.gallery')" id="galerie" class="px-2">
      <SectionGallery />
    </AppSection>
    <AppSection :title="t('sections.aboutUs')" id="despre-noi">
      <SectionAboutUs />
    </AppSection>
    <AppSection :title="t('sections.whyUs')" id="de-ce-noi">
      <SectionWhyChooseUs />
    </AppSection>
    <AppSection :title="t('sections.testimonials')" id="testimoniale">
      <SectionTestimonials />
    </AppSection>
  </main>
  <AppFooter />

  <!-- Cart drawer + toast -->
  <CartDrawer />
  <CartToast />

  <!-- Floating contact FABs -->
  <Transition name="fade-slide-right">
    <nav
      v-if="showFloatingCTA"
      class="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-center gap-3 lg:hidden"
      :aria-label="t('accessibility.quickContact')"
    >
      <!-- Phone -->
      <a
        :href="`tel:${CONTACT.phone}`"
        class="flex items-center justify-center w-12 h-12 bg-accent dark:bg-accent text-white rounded-full shadow-md active:scale-95 transition-all"
        :aria-label="t('accessibility.callNow')"
      >
        <IconPhone class="w-5 h-5" />
      </a>

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
</style>
