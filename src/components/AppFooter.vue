<script setup lang="ts">
import AppSocialLinks from "./AppSocialLinks.vue";
</script>

<template>
  <footer class="w-screen mt-32 bg-gradient-to-r from-transparent via-nude to-nude">
    <section class="flex justify-between">
      <section id="cum-sa-comanzi" class="flex flex-col pt-16 pl-8 items-start">
        <h2 class="text-6xl mb-10">Cum să comanzi</h2>
        <div class="how-to-order-paragraphs">
          <p>― Alege un produs potrivit gusturilor tale</p>
          <p>― Consultă-ne pentru a lua cea mai bună decizie</p>
          <p>― Stabilește împreună cu noi data și ora la care vrei să fie gata comanda</p>
          <p>― Te așteptăm la locația noastră să îți ridici comanda</p>
        </div>
        <section class="h-full flex items-end">
          <div>
            <h1 class="text-4xl text-accent mt-10">Homemade by Dia</h1>
            <AppSocialLinks />
          </div>
          <div class="h-32 flex items-center">
            <p class="text-2xl flex flex-col items-start">
              <a
                href="tel:+40787283917"
                class="mb-2 underline hover:text-accent-dark cursor-pointer transition-colors duration-200"
              >
                +0787 283 917
              </a>
              <a
                href="mailto:diana@homemadebydia.ro"
                class="underline hover:text-accent-dark cursor-pointer transition-colors duration-200"
              >
                diana@homemadebydia.ro
              </a>
            </p>
          </div>
        </section>
      </section>
      <img
        src="/gallery/footer.jpg"
        class="w-1/3 hidden lg:block"
        alt="poză cu un tort văzut de sus"
      />
    </section>
  </footer>
</template>

<style scoped>
.how-to-order-paragraphs p {
  @apply text-xl mb-4;
}
</style>
