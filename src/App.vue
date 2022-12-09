<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import AppSection from "./components/AppSection.vue";
import SectionHome from "./components/SectionHome.vue";
import SectionCatalog from "./components/SectionCatalog.vue";
import SectionWhyChooseUs from "./components/SectionWhyChooseUs.vue";
</script>

<template>
  <AppHeader />
  <main class="container mx-auto pt-32">
    <AppSection>
      <SectionHome />
    </AppSection>
    <AppSection title="Catalog" id="catalog">
      <SectionCatalog />
    </AppSection>
    <AppSection title="De ce noi?" id="de-ce-noi">
      <SectionWhyChooseUs />
    </AppSection>
  </main>
  <footer class="container mx-auto h-64">
    <p class="text-center py-4">© 2023 Homemade by Dia</p>
    <div>test</div>
  </footer>
</template>
