<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useEscapeKey } from "../composables/useEscapeKey";
import { useScrollTo } from "../composables/useScrollTo";
import { useCatalogTabs } from "../composables/useCatalogTabs";
import IconMenu from "./icons/IconMenu.vue";
import IconClose from "./icons/IconClose.vue";
import ThemeToggle from "./ThemeToggle.vue";
import LocaleToggle from "./LocaleToggle.vue";
import CartButton from "./CartButton.vue";

const { t } = useI18n();
const navOpen = ref(false);

// Mirrors the `xl:` variants on the menu below.
const DESKTOP_NAV_MEDIA_QUERY = "(min-width: 1280px)";

const { scrollTo } = useScrollTo();
const { selectTab } = useCatalogTabs();

useEscapeKey(navOpen, () => (navOpen.value = false));

const bodyStyleSnapshot = {
  position: "",
  top: "",
  left: "",
  right: "",
  width: "",
};
let savedScrollY = 0;
let isBodyScrollLocked = false;
let shouldRestoreScrollOnUnlock = true;
let removeDesktopBreakpointListener: (() => void) | null = null;

function lockBodyScroll() {
  if (isBodyScrollLocked) return;

  const body = document.body;
  savedScrollY = window.scrollY;
  bodyStyleSnapshot.position = body.style.position;
  bodyStyleSnapshot.top = body.style.top;
  bodyStyleSnapshot.left = body.style.left;
  bodyStyleSnapshot.right = body.style.right;
  bodyStyleSnapshot.width = body.style.width;

  body.style.position = "fixed";
  body.style.top = `-${savedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  isBodyScrollLocked = true;
  shouldRestoreScrollOnUnlock = true;
}

function unlockBodyScroll() {
  if (!isBodyScrollLocked) return;

  const body = document.body;
  body.style.position = bodyStyleSnapshot.position;
  body.style.top = bodyStyleSnapshot.top;
  body.style.left = bodyStyleSnapshot.left;
  body.style.right = bodyStyleSnapshot.right;
  body.style.width = bodyStyleSnapshot.width;
  if (shouldRestoreScrollOnUnlock) {
    window.scrollTo(0, savedScrollY);
  }
  isBodyScrollLocked = false;
  shouldRestoreScrollOnUnlock = true;
}

watch(navOpen, (open) => {
  if (open) {
    lockBodyScroll();
    return;
  }

  unlockBodyScroll();
});

onMounted(() => {
  const desktopBreakpoint = window.matchMedia(DESKTOP_NAV_MEDIA_QUERY);
  const onDesktop = (matches: boolean) => {
    if (!matches) return;
    navOpen.value = false;
    unlockBodyScroll();
  };

  const handleChange = (event: MediaQueryListEvent) => {
    onDesktop(event.matches);
  };

  onDesktop(desktopBreakpoint.matches);

  if (typeof desktopBreakpoint.addEventListener === "function") {
    desktopBreakpoint.addEventListener("change", handleChange);
    removeDesktopBreakpointListener = () => {
      desktopBreakpoint.removeEventListener("change", handleChange);
    };
    return;
  }

  desktopBreakpoint.addListener(handleChange);
  removeDesktopBreakpointListener = () => {
    desktopBreakpoint.removeListener(handleChange);
  };
});

onUnmounted(() => {
  removeDesktopBreakpointListener?.();
  removeDesktopBreakpointListener = null;
  unlockBodyScroll();
});

function runAfterClosingMobileMenu(action: () => void) {
  if (!navOpen.value) {
    action();
    return;
  }

  shouldRestoreScrollOnUnlock = false;
  navOpen.value = false;

  window.requestAnimationFrame(() => {
    action();
  });
}

function navigate(id: Parameters<typeof scrollTo>[0]) {
  runAfterClosingMobileMenu(() => {
    void scrollTo(id);
  });
}

function navigateToTab(tab: "cakes" | "pastries" | "bakery" | "events") {
  runAfterClosingMobileMenu(() => {
    selectTab(tab, true, true); // updateHash=true, scrollToTop=true
  });
}
</script>

<template>
  <nav class="flex items-center">
    <!-- Controls: order-1 on mobile (before hamburger), order-2 on desktop (after menu) -->
    <div class="flex items-center gap-1 order-1 xl:order-2 xl:ml-10">
      <LocaleToggle />
      <ThemeToggle />
      <CartButton />
    </div>

    <!-- Hamburger / close button (mobile only); z-30 sits above the menu panel -->
    <button
      type="button"
      class="relative z-30 xl:hidden p-2 rounded order-2 focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 focus-visible:outline-none"
      @click="navOpen = !navOpen"
      :aria-label="navOpen ? t('nav.closeMenu') : t('nav.menu')"
      :aria-expanded="navOpen"
    >
      <span
        v-if="!navOpen"
        class="ripple-container overflow-hidden pointer-events-none absolute inset-0 flex justify-center items-center"
      >
        <span class="ripple absolute bg-pink-300 dark:bg-pink-200"></span>
      </span>
      <IconClose
        v-if="navOpen"
        class="h-6 w-6 text-accent dark:text-accent-light relative z-10"
      />
      <IconMenu v-else class="h-6 w-6 text-accent dark:text-accent-light relative z-10" />
    </button>

    <!-- Backdrop behind the menu panel (below xl only) -->
    <div
      v-if="navOpen"
      class="fixed inset-0 z-10 bg-gray-900/40 xl:hidden"
      aria-hidden="true"
      @click="navOpen = false"
    ></div>

    <!-- Menu items -->
    <ul
      :class="[
        'fixed left-0 right-0 min-h-screen top-0 px-4 pt-8 space-y-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-transform duration-300 z-20',
        // sm: bounded right-hand drawer
        'sm:left-auto sm:w-80 sm:max-w-full sm:pt-24 sm:shadow-2xl sm:border-l sm:border-gray-200 dark:sm:border-gray-800',
        // xl: horizontal nav; unsets the drawer styles above
        'xl:relative xl:flex xl:items-center xl:space-x-8 xl:min-h-0 xl:px-0 xl:py-0 xl:pt-0 xl:space-y-0 xl:order-1 xl:z-auto',
        'xl:left-auto xl:w-auto xl:max-w-none xl:shadow-none xl:border-0',
        navOpen ? 'translate-x-0' : 'max-xl:translate-x-full',
        'transform',
      ]"
      @click="navOpen = false"
    >
      <li class="menu-item">
        <button @click="navigate('catalog')">{{ t("nav.catalog") }}</button>
        <ul class="sub-menu pl-4 mt-2 space-y-2 border-l-2 border-accent-light xl:hidden">
          <li>
            <button class="block px-4 py-2" @click="navigateToTab('cakes')">
              {{ t("nav.cakes") }}
            </button>
          </li>
          <li>
            <button class="block px-4 py-2" @click="navigateToTab('pastries')">
              {{ t("nav.pastries") }}
            </button>
          </li>
          <li>
            <button class="block px-4 py-2" @click="navigateToTab('bakery')">
              {{ t("nav.bakery") }}
            </button>
          </li>
          <li>
            <button class="block px-4 py-2" @click="navigateToTab('events')">
              {{ t("nav.events") }}
            </button>
          </li>
        </ul>
      </li>
      <li class="menu-item">
        <button @click="navigate('gallery')">{{ t("nav.gallery") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('aboutUs')">{{ t("nav.aboutUs") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('whyUs')">{{ t("nav.whyUs") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('reviews')">{{ t("nav.reviews") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('howToOrder')">{{ t("nav.howToOrder") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('contact')">{{ t("nav.contact") }}</button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="postcss">
.menu-item > button,
.sub-menu > li > button {
  @apply bg-transparent border-none cursor-pointer text-inherit;
}

.menu-item:hover > button,
.sub-menu > li:hover > button,
.menu-item:active > button,
.sub-menu > li:active > button {
  @apply text-accent dark:text-accent-light transition-colors duration-300;
}

.menu-item > button:focus-visible,
.sub-menu > li > button:focus-visible {
  @apply text-accent dark:text-accent-light outline-none ring-2 ring-accent dark:ring-accent-light ring-offset-2 rounded;
}

.ripple-container {
  border-radius: 50%;
}

.ripple {
  width: 120%;
  height: 120%;
  animation: ripple-animation 1.5s infinite ease-out;
  border-radius: 50%;
}

@keyframes ripple-animation {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
