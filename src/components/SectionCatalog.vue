<script setup lang="ts">
import AppTabs from "./AppTabs.vue";
import AppTab from "./AppTab.vue";
import SectionCatalogGallery from "./SectionCatalogGallery.vue";
import cakes from "../assets/cakes.json";
import cookies from "../assets/cookies.json";
import pastry from "../assets/pastry.json";
import SectionCatalogEventsGallery from "./SectionCatalogEventsGallery.vue";
</script>

<template>
  <AppTabs>
    <AppTab title="Torturi" tab-key="torturi">
      <SectionCatalogGallery :data="cakes" />
      <p class="mt-2 mb-8">
        * Decorurile personalizate se achită separat, prețul începând de la 20 lei până la 200 lei in funcție de complexitate<br>
        * În cazul în care suferiţi de o alergie / sunteți intolerant la un ingredient, vă rugăm să solicitaţi informaţii
        suplimentare înainte de efectuarea comenzii
      </p>
    </AppTab>
    <AppTab title="Prăjituri" tab-key="prajituri">
      <SectionCatalogGallery :data="cookies" />
    </AppTab>
    <AppTab title="Patiserie" tab-key="patiserie">
      <SectionCatalogGallery :data="pastry" />
    </AppTab>
    <AppTab title="Evenimente" tab-key="evenimente" class="container">
      <div>
        <p>
          Oferta pentru candy bar pornește de la 15 lei / persoană, se poate personaliza în funcție
          de preferințe.
        </p>

        <div class="ml-12 mt-2">
          <ul class="list-disc">
            <li>15 lei include 3 prăjituri / persoană, 5 sortimente</li>
            <li>20 lei include 4 prăjituri / persoană, 7 sortimente</li>
          </ul>
          <span class="font-light">
            * Ambele oferte includ bezele colorate și fursecuri. Decor doar cromatic.
          </span>
        </div>

        <p class="mt-2">
          Pentru optare tematică candy bar +1,5 lei / persoană (include toppere, numele copilului,
          imagini comestibile, etc)
        </p>

        <p class="font-light mt-2">Opțional</p>
        <div class="ml-12 mt-2 mb-8">
          <ul class="list-disc">
            <li>Chirie vase - începând de la 150 lei</li>
            <li>Montaj candy bar - 150 lei</li>
            <li>Preluare vase - începând de la 50 lei</li>
            <li>Livrare - începând de la 120 lei (mașină frigorifică)</li>
          </ul>
        </div>
      </div>
      <SectionCatalogEventsGallery />
    </AppTab>
  </AppTabs>
</template>
