<script setup lang="ts">
import AppTabs from "./AppTabs.vue";
import AppTab from "./AppTab.vue";
import SectionCatalogGallery from "./SectionCatalogGallery.vue";
import cakes from "../assets/cakes.json";
import cookies from "../assets/cookies.json";
import pastry from "../assets/pastry.json";
import SectionCatalogEventsGallery from "./SectionCatalogEventsGallery.vue";
import { ref } from "vue";

const isModalOpen = ref(false);
const selectedImage = ref("");

const openModal = (image: string) => {
  selectedImage.value = image;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedImage.value = "";
};
</script>

<template>
  <AppTabs>
    <AppTab title="Torturi" tab-key="torturi">
      <SectionCatalogGallery :data="cakes" />
      <p class="m-2 mt-4 mb-8 font-light text-gray-600 leading-relaxed">
        * Decorurile personalizate se achită separat, prețul începând de la 20 lei până la 200 lei
        in funcție de complexitate
        <br />
        <br />
        * În cazul în care suferiţi de o alergie / sunteți intolerant la un ingredient, vă rugăm să
        solicitaţi informaţii suplimentare înainte de efectuarea comenzii
      </p>
    </AppTab>
    <AppTab title="Prăjituri" tab-key="prajituri">
      <SectionCatalogGallery :data="cookies" />
    </AppTab>
    <AppTab title="Patiserie" tab-key="patiserie">
      <SectionCatalogGallery :data="pastry" />
    </AppTab>
    <AppTab title="Evenimente" tab-key="evenimente" class="container">
      <div class="p-4">
        <p class="text-gray-600 leading-relaxed">
          Oferta pentru candy bar pornește de la 24 lei/persoană, se poate personaliza în funcție de
          preferințe. Ofertă valabilă pentru minim 30 de persoane.
        </p>

        <div class="ml-6 mt-4">
          <ul class="list-disc list-inside text-gray-600 leading-relaxed">
            <li>24 lei include 3 prăjituri/persoană, 5 sortimente</li>
            <li>32 lei include 4 prăjituri/persoană, 7 sortimente</li>
          </ul>
          <span class="font-light text-gray-500 block mt-2">
            * Ambele oferte includ bezele colorate și fursecuri. Decor doar cromatic.
          </span>
        </div>

        <p class="mt-4 text-gray-600 leading-relaxed">
          Pentru optare tematică candy bar +3 lei/persoană (include toppere, numele copilului,
          imagini comestibile, etc).
        </p>

        <p class="font-light mt-4 text-gray-500">Opțional</p>
        <div class="ml-6 mt-2 mb-8">
          <ul class="list-disc list-inside text-gray-600 leading-relaxed">
            <li>Chirie vase - începând de la 150 lei</li>
            <li>Montaj candy bar - 150 lei</li>
            <li>Preluare vase - începând de la 50 lei</li>
            <li>Livrare - începând de la 120 lei (mașină frigorifică)</li>
            <li>Mărturii - începând de la 7 lei</li>
          </ul>
          <picture>
            <source srcset="/gallery/marturii.webp" type="image/webp" />
            <source srcset="/gallery/marturii.jpg" type="image/jpeg" />
            <img
              src="/gallery/marturii.jpg"
              alt="Marturii"
              class="w-1/2 h-auto rounded-lg"
              loading="lazy"
              @click="openModal('/gallery/marturii')"
            />
          </picture>
        </div>
      </div>
      <SectionCatalogEventsGallery />
    </AppTab>
  </AppTabs>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <div class="relative">
      <button
        @click="closeModal"
        class="font-serif absolute top-2 right-2 flex items-center justify-center text-2xl pb-1.5 text-accent w-8 h-8 rounded-3xl bg-white"
      >
        &times;
      </button>
      <picture>
        <source :srcset="selectedImage + '.webp'" type="image/webp" />
        <source :srcset="selectedImage + '.jpg'" type="image/jpeg" />
        <img
          :src="selectedImage + '.jpg'"
          alt="imagine mărită"
          class="max-w-full max-h-full object-contain rounded-xl"
        />
      </picture>
    </div>
  </div>
</template>
