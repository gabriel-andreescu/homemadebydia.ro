<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import AppSection from "./components/AppSection.vue";
import SectionHome from "./components/SectionHome.vue";
import SectionCatalog from "./components/SectionCatalog.vue";
import SectionWhyChooseUs from "./components/SectionWhyChooseUs.vue";
import AppFooter from "./components/AppFooter.vue";
import SectionGallery from "./components/SectionGallery.vue";
import SectionAboutUs from "./components/SectionAboutUs.vue";
</script>

<template>
  <AppHeader />
  <main class="container mx-auto pt-32">
    <AppSection>
      <SectionHome />
      <SectionAboutUs />
    </AppSection>
    <AppSection title="Catalog" id="catalog">
      <SectionCatalog />
    </AppSection>
    <AppSection title="Galerie" id="galerie">
      <SectionGallery />
    </AppSection>
    <AppSection title="De ce noi?" id="de-ce-noi">
      <SectionWhyChooseUs />
    </AppSection>
  </main>
  <AppFooter />
</template>
