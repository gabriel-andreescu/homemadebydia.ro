<!--suppress HtmlUnknownAnchorTarget -->
<script setup lang="ts">
import { ref } from "vue";
import useEventsBus from "../composables/eventBus";

const navOpen = ref(false);

const { emit } = useEventsBus();
</script>

<template>
  <nav>
    <button type="button" class="relative lg:hidden" @click="navOpen = !navOpen" aria-label="Menu">
      <span
        class="ripple-container overflow-hidden pointer-events-none absolute inset-0 flex justify-center items-center"
      >
        <span class="ripple absolute bg-pink-200"></span>
      </span>
      <svg class="h-8 w-8 text-accent relative z-10" viewBox="0 0 24 24">
        <path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z" />
      </svg>
    </button>
    <ul
      :class="[
        'fixed left-0 right-0 min-h-screen top-0 px-4 pt-8 space-y-4 bg-white transition duration-300',
        'lg:relative lg:flex lg:space-x-10 lg:min-h-0 lg:px-0 lg:py-0 lg:space-y-0 lg:translate-x-0',
        navOpen ? 'translate-x-0' : 'translate-x-full',
        'transform',
      ]"
      @click="navOpen = false"
    >
      <li class="menu-item"><a href="#" @click="navOpen = false">Acasă</a></li>
      <li class="menu-item">
        <a href="#catalog" @click="navOpen = false">Catalog</a>
        <ul class="sub-menu pl-4 mt-2 space-y-2 border-l-2 border-accent-light lg:hidden">
          <li>
            <a
              href="#catalog"
              class="block px-4 py-2"
              @click="
                navOpen = false;
                emit('switchCatalogTab', 'torturi');
              "
            >
              Torturi
            </a>
          </li>
          <li>
            <a
              href="#catalog"
              class="block px-4 py-2"
              @click="
                navOpen = false;
                emit('switchCatalogTab', 'prajituri');
              "
            >
              Prăjituri
            </a>
          </li>
          <li>
            <a
              href="#catalog"
              class="block px-4 py-2"
              @click="
                navOpen = false;
                emit('switchCatalogTab', 'patiserie');
              "
            >
              Patiserie
            </a>
          </li>
          <li>
            <a
              href="#catalog"
              class="block px-4 py-2"
              @click="
                navOpen = false;
                emit('switchCatalogTab', 'evenimente');
              "
            >
              Evenimente
            </a>
          </li>
        </ul>
      </li>
      <li class="menu-item">
        <a href="#galerie" @click="navOpen = false">Galerie</a>
      </li>
      <li class="menu-item"><a href="#de-ce-noi" @click="navOpen = false">De ce noi?</a></li>
      <li class="menu-item">
        <a href="#cum-sa-comanzi" @click="navOpen = false">Cum să comanzi</a>
      </li>
      <li class="menu-item"><a href="#contact" @click="navOpen = false">Contact</a></li>
    </ul>
  </nav>
</template>

<style scoped lang="postcss">
.menu-item:hover > a,
.sub-menu > li:hover > a,
.menu-item:active > a,
.sub-menu > li:active > a {
  @apply text-accent transition-colors duration-200;
}

.ripple-container {
  border-radius: 50%;
}

.ripple {
  width: 200%;
  height: 200%;
  animation: ripple-animation 1.5s infinite ease-out;
  border-radius: 50%;
}

@keyframes ripple-animation {
  0% {
    transform: scale(0);
    opacity: 0.75;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
