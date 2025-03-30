<script setup lang="ts">
import AppTabs from "./AppTabs.vue";
import AppTab from "./AppTab.vue";
import SectionCatalogGallery from "./SectionCatalogGallery.vue";
import cakes from "../assets/cakes.json";
import cookies from "../assets/cookies.json";
import pastry from "../assets/pastry.json";
import SectionCatalogEventsGallery from "./SectionCatalogEventsGallery.vue";
import { ref } from "vue";
import ImageModal from "./ImageModal.vue";

const imageModalRef = ref<InstanceType<typeof ImageModal>>();
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
      <section class="mt-10">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Sortimente disponibile</h2>
        <ul class="list-disc list-inside ml-4">
          <li>Choux: fistic și zmeură, alune de pădure, ciocolată, lămâie și bezea, exotic</li>
          <li>
            Tarte: fructe, caramel, fistic și zmeură, alune de pădure, ciocolată, lămâie și bezea,
            exotic
          </li>
          <li>
            Prajituri mini: pavlova, carrot, medovik, snickers, savarină clasică, savarină cu fistic
          </li>
        </ul>
      </section>
    </AppTab>
    <AppTab title="Patiserie" tab-key="patiserie">
      <SectionCatalogGallery :data="pastry" />
    </AppTab>
    <AppTab title="Evenimente" tab-key="evenimente" class="container">
      <div class="p-4 space-y-6 text-gray-600 leading-relaxed">
        <!-- Oferta standard -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Oferta standard</h2>
          <p>
            Oferta candy bar este de
            <strong>40 lei/persoană</strong>
            și include 4 prăjituri/persoană dintr-un total de 6 sortimente, plus
            <strong>bezele</strong>
            și
            <strong>fursecuri cadou</strong>
            . Poate fi personalizată în funcție de preferințe. Ofertă valabilă pentru minim 25 de
            persoane.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Sortimente disponibile</h2>
          <ul class="list-disc list-inside ml-4">
            <li>Choux: fistic și zmeură, alune de pădure, ciocolată, lămâie și bezea, exotic</li>
            <li>
              Tarte: fructe, caramel, fistic și zmeură, alune de pădure, ciocolată, lămâie și bezea,
              exotic
            </li>
            <li>
              Desert la pahar: mousse de ciocolată, fructe de pădure, exotic, panna cotta,
              cheesecake
            </li>
            <li>
              Prajituri mini: pavlova, carrot, medovik, snickers, savarină clasică, savarină cu
              fistic
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Tematică personalizată</h2>
          <p>
            Pentru tematică personalizată se adaugă
            <strong>+3 lei/persoană</strong>
            (include toppere, numele copilului, imagini comestibile etc.).
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Opțional</h2>
          <ul class="list-disc list-inside ml-4">
            <li>Chirie vase – începând de la 150 lei</li>
            <li>Montaj candy bar – 150 lei</li>
            <li>Preluare vase – începând de la 50 lei</li>
            <li>Livrare – începând de la 250 lei (mașină frigorifică)</li>
            <li>Mărturii – începând de la 10 lei</li>
          </ul>

          <figure class="mt-4">
            <picture>
              <source srcset="/gallery/marturii.webp" type="image/webp" />
              <source srcset="/gallery/marturii.jpg" type="image/jpeg" />
              <img
                src="/gallery/marturii.jpg"
                alt="Mărturii"
                class="w-1/2 h-auto rounded-lg cursor-pointer"
                loading="lazy"
                @click="imageModalRef?.openModal('/gallery/marturii')"
              />
            </picture>
            <figcaption class="text-sm text-gray-500 mt-1">
              Exemplu de mărturii disponibile
            </figcaption>
          </figure>
        </section>
      </div>

      <SectionCatalogEventsGallery />
    </AppTab>
  </AppTabs>
  <ImageModal ref="imageModalRef" />
</template>
