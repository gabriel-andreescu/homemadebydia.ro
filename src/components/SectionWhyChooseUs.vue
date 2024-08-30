<script setup lang="ts"></script>

<template>
  <div class="flex flex-wrap justify-center items-end">
    <div class="flex flex-col m-4 items-center">
      <picture class="w-64 h-64 rounded-full">
        <source srcset="/gallery/calitate.webp" type="image/webp" />
        <source srcset="/gallery/calitate.jpg" type="image/jpeg" />
        <img
          src="/gallery/calitate.jpg"
          alt="poza care reprezinta calitatea serviciilor noastre"
          class="w-64 h-64 rounded-full"
        />
      </picture>
      <h3 class="text-2xl text-bold mb-2 mt-2">Calitate</h3>
      <p class="text-lg w-64 text-center">Produse artizanale concepute cu ingrediente naturale</p>
    </div>
    <div class="flex flex-col m-4 items-center">
      <picture class="lg:w-72 lg:h-72 w-64 h-64 rounded-full">
        <source srcset="/gallery/unicitate.webp" type="image/webp" />
        <source srcset="/gallery/unicitate.jpg" type="image/jpeg" />
        <img
          src="/gallery/unicitate.jpg"
          alt="poza care reprezinta unicitatea serviciilor noastre"
          class="lg:w-72 lg:h-72 w-64 h-64 rounded-full"
        />
      </picture>
      <h3 class="text-2xl text-bold mb-2 mt-2">Unicitate</h3>
      <p class="text-lg w-64 text-center">Folosim rețete proprii, pline de savoare</p>
    </div>

    <div class="flex flex-col m-4 items-center">
      <picture class="w-64 h-64 rounded-full">
        <source srcset="/gallery/profesionalism.webp" type="image/webp" />
        <source srcset="/gallery/profesionalism.jpg" type="image/jpeg" />
        <img
          src="/gallery/profesionalism.jpg"
          alt="poza care reprezinta profesionalism-ul serviciilor noastre"
          class="w-64 h-64 rounded-full"
        />
      </picture>
      <h3 class="text-2xl text-bold mb-2 mt-2">Profesionalism</h3>
      <p class="text-lg w-64 text-center">Comunicarea cu clienții este prioritatea noastră</p>
    </div>
  </div>
</template>
