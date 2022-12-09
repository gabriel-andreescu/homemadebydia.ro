<!--suppress HtmlUnknownAnchorTarget -->
<template>
  <div class="p-4">
    <div class="absolute">
      <img src="/logo.svg" alt="Homemade by Dia logo" class="h-24" />
    </div>
    <nav class="flex flex-nowrap items-center justify-center h-24">
      <ul class="flex">
        <li><a href="#catalog">Catalog</a></li>
        <li><a href="#de-ce-noi">De ce noi?</a></li>
        <li>Contact</li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
ul li {
  @apply p-2 mx-6 z-10;
}

ul li:hover {
  @apply text-accent;
}
</style>
