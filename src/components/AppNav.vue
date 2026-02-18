<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useEscapeKey } from "../composables/useEscapeKey";
import { useScrollTo } from "../composables/useScrollTo";
import { useCatalogTabs } from "../composables/useCatalogTabs";
import IconMenu from "./icons/IconMenu.vue";
import ThemeToggle from "./ThemeToggle.vue";
import LocaleToggle from "./LocaleToggle.vue";
import CartButton from "./CartButton.vue";

const { t } = useI18n();
const navOpen = ref(false);

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
  const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");
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

function navigate(id: string) {
  shouldRestoreScrollOnUnlock = false;
  navOpen.value = false;
  scrollTo(id);
}

function navigateToTab(tab: string) {
  shouldRestoreScrollOnUnlock = false;
  navOpen.value = false;
  selectTab(tab, true, true); // updateHash=true, scrollToTop=true
}
</script>

<template>
  <nav class="flex items-center">
    <!-- Controls: order-1 on mobile (before hamburger), order-2 on desktop (after menu) -->
    <div class="flex items-center gap-1 order-1 lg:order-2 lg:ml-10">
      <LocaleToggle />
      <ThemeToggle />
      <CartButton />
    </div>

    <!-- Hamburger menu button (mobile only) -->
    <button
      type="button"
      class="relative lg:hidden p-2 rounded order-2 focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 focus-visible:outline-none"
      @click="navOpen = !navOpen"
      :aria-label="t('nav.menu')"
    >
      <span
        v-if="!navOpen"
        class="ripple-container overflow-hidden pointer-events-none absolute inset-0 flex justify-center items-center"
      >
        <span class="ripple absolute bg-pink-300 dark:bg-pink-200"></span>
      </span>
      <IconMenu class="h-6 w-6 text-accent dark:text-accent-light relative z-10" />
    </button>

    <!-- Menu items -->
    <ul
      :class="[
        'fixed left-0 right-0 min-h-screen top-0 px-4 pt-8 space-y-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-transform duration-300 z-20',
        'lg:relative lg:flex lg:items-center lg:space-x-10 lg:min-h-0 lg:px-0 lg:py-0 lg:space-y-0 lg:order-1 lg:z-auto',
        navOpen ? 'translate-x-0' : 'max-lg:translate-x-full',
        'transform',
      ]"
      @click="navOpen = false"
    >
      <li class="menu-item">
        <button @click="navigate('catalog')">{{ t("nav.catalog") }}</button>
        <ul class="sub-menu pl-4 mt-2 space-y-2 border-l-2 border-accent-light lg:hidden">
          <li>
            <button class="block px-4 py-2" @click="navigateToTab('torturi')">
              {{ t("nav.cakes") }}
            </button>
          </li>
          <li>
            <button class="block px-4 py-2" @click="navigateToTab('prajituri')">
              {{ t("nav.pastries") }}
            </button>
          </li>
          <li>
            <button class="block px-4 py-2" @click="navigateToTab('patiserie')">
              {{ t("nav.bakery") }}
            </button>
          </li>
          <li>
            <button class="block px-4 py-2" @click="navigateToTab('evenimente')">
              {{ t("nav.events") }}
            </button>
          </li>
        </ul>
      </li>
      <li class="menu-item">
        <button @click="navigate('galerie')">{{ t("nav.gallery") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('despre-noi')">{{ t("nav.aboutUs") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('de-ce-noi')">{{ t("nav.whyUs") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('testimoniale')">{{ t("nav.testimonials") }}</button>
      </li>
      <li class="menu-item">
        <button @click="navigate('cum-sa-comanzi')">{{ t("nav.howToOrder") }}</button>
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
