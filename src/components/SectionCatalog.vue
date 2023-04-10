<script setup lang="ts">
import AppTabs from "./AppTabs.vue";
import AppTab from "./AppTab.vue";
import SectionCatalogGallery from "./SectionCatalogGallery.vue";
import cakes from "../assets/cakes.json";
import cookies from "../assets/cookies.json";
import pastry from "../assets/pastry.json";
</script>

<template>
  <AppTabs>
    <AppTab title="Torturi" tab-key="torturi">
      <SectionCatalogGallery :data="cakes" />
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

        <p class="mb-8">
          Pentru optare tematică candy bar +1,5 lei / persoană (include toppere, numele copilului,
          imagini comestibile, etc)
        </p>
      </div>
      <div class="columns-2xs gap-8 space-y-8">
        <div class="relative aspect-w-24 aspect-h-9">
          <img class="w-full object-cover rounded-lg" src="/gallery/events/1.jpg" alt="candy bar" />
          <div class="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
        </div>
        <div class="relative aspect-w-1 aspect-h-1">
          <img
            class="w-full object-cover rounded-lg"
            src="/gallery/events/2.jpg"
            alt="tort eveniment"
          />
          <div class="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
        </div>
        <div class="relative hidden sm:block aspect-w-16 aspect-h-9">
          <img
            class="w-full object-cover rounded-lg"
            src="/gallery/events/4.jpg"
            alt="cutie cu pavlova"
          />
          <div class="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
        </div>
        <div class="relative hidden sm:block aspect-w-16 aspect-h-9">
          <img
            class="w-full object-cover rounded-lg"
            src="/gallery/events/5.jpg"
            alt="tort eveniment"
          />
          <div class="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
        </div>
      </div>
    </AppTab>
  </AppTabs>
</template>
