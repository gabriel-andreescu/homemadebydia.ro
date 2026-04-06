<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import IconStar from "./icons/IconStar.vue";
import IconQuote from "./icons/IconQuote.vue";
import AppPicture from "./AppPicture.vue";
import GalleryModal from "./GalleryModal.vue";
import HorizontalScroller from "./HorizontalScroller.vue";
import { reviewMediaEntries } from "../data/review-media";

const { t, locale } = useI18n();

interface ReviewImage {
  thumb: string;
  original: string;
}

interface ReviewCard {
  name: string;
  text: string;
  rating: number;
  avatar?: string;
  images?: ReviewImage[];
}

interface ReviewTextContent {
  name: string;
  text: string;
  rating: number;
}

const galleryModalRef = ref<InstanceType<typeof GalleryModal>>();
const currentOriginalImage = ref<string[]>([]);
const reviewMediaByName = Object.fromEntries(
  reviewMediaEntries.map((entry) => [
    entry.name,
    { avatar: entry.avatar, images: entry.images },
  ]),
) as Record<string, Pick<ReviewCard, "avatar" | "images">>;

const openImage = async (images: ReviewImage[], index: number) => {
  currentOriginalImage.value = images.map((img) => img.original);
  await nextTick();
  galleryModalRef.value?.openAt(index);
};

const attachReviewMedia = (review: ReviewTextContent): ReviewCard => ({
  ...review,
  ...reviewMediaByName[review.name],
});

const reviewsRo: ReviewCard[] = [
  {
    name: "Gabriela Mihai",
    text: "Calitate excelentă!\nAm comandat la Diana un tort personalizat care a ieșit foarte frumos ca aspect, iar gustul a fost extrem de bun și echilibrat.\nCalitatea produselor este foarte bună și asta se resimte în gustul foarte bun al produselor sale.\nDiana a ascultat toate cerințele mele si le-a adaptat în funcție de ce i-am arătat și i-am spus, obținând un final spectaculos.\nI-am adus și o mini bicicletă pe care a integrat-o perfect în decor. 🥰",
    rating: 5,
  },
  {
    name: "Anca Elena",
    text: "E a doua oară când comandăm tortul de aici, primul a fost cu mango, al doilea tortul felie de lapte. Ne au plăcut foarte mult și invitaților noștri la fel.\nPersonal, îl prefer pe cel cu lapte. Foarte fresh, proaspăt, ingrediente naturale și mi a plăcut ca nu sunt acel gen de torturi și creme extrem de dulci. Sunt fix cum trebuie.\nIar prețul este unul corect pentru calitate, mult sub prețurile ce se găsesc în București.",
    rating: 5,
  },
  {
    name: "AC Arhitectura",
    text: "Recomand cu drag, sunt un om greu de mulțumit dar sunt foarte încântată de produse.\nDia ne-a făcut tortul de cununie, a fost excepțional, toată lumea întreba cine l-a făcut pentru că a fost foarte fresh, dulce cât trebuie, aromat, ingredientele proaspete.\nDe asemenea, prăjiturile, nu am cuvinte să vă spun cât de bune sunt. Cea mai nouă, cea cu bere... n-am cuvinte.",
    rating: 5,
  },
  {
    name: "Ramona Silvia Pavel",
    text: "Întotdeauna ne-a surprins cu dulciuri extraordinare, din ingrediente naturale. Excelent pentru a celebra momente în familie și a surprinde pe toată lumea. Feedback pozitiv de la toți invitații.\nTorturi: carrot cake și tortul casei.\nPlus mix de prăjituri.",
    rating: 5,
  },
].map(attachReviewMedia);

const reviewsEn: ReviewCard[] = [
  {
    name: "Gabriela Mihai",
    text: "Excellent quality!\nI ordered a custom cake from Diana which turned out beautifully, and the taste was extremely good and balanced.\nThe quality of her products is very high and you can taste it.\nDiana listened to all my requirements and adapted them based on what I showed and told her, achieving a spectacular result.\nI even brought her a mini bicycle which she integrated perfectly into the decoration. 🥰",
    rating: 5,
  },
  {
    name: "Anca Elena",
    text: "This is the second time we've ordered a cake from here - the first was mango, the second was the milk slice cake. We loved them both, and so did our guests.\nPersonally, I prefer the milk one. Very fresh, natural ingredients, and I loved that the cakes and creams aren't overly sweet. They're just right.\nThe price is fair for the quality - much lower than what you'd find in Bucharest.",
    rating: 5,
  },
  {
    name: "AC Arhitectura",
    text: "I highly recommend, I'm a hard person to please but I'm very happy with the products.\nDia made our civil wedding cake, it was exceptional, everyone was asking who made it because it was very fresh, just sweet enough, aromatic, with fresh ingredients.\nAlso, the pastries, I have no words to tell you how good they are. The newest one, with beer... I have no words.",
    rating: 5,
  },
  {
    name: "Ramona Silvia Pavel",
    text: "She has always surprised us with extraordinary sweets, made from natural ingredients. Excellent for celebrating family moments and surprising everyone. Positive feedback from all guests.\nCakes: carrot cake and house signature cake.\nPlus a mix of pastries.",
    rating: 5,
  },
].map(attachReviewMedia);

// Locale-specific reviews
const reviews = computed<ReviewCard[]>(() =>
  locale.value === "en" ? reviewsEn : reviewsRo,
);
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
    <article
      v-for="(review, index) in reviews"
      :key="index"
      class="relative bg-rose-50/50 dark:bg-neutral-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-hidden"
    >
      <!-- Quote icon -->
      <IconQuote
        class="absolute top-4 right-4 w-8 h-8 text-accent/40 dark:text-accent-light/40"
        aria-hidden="true"
      />

      <!-- Header: Avatar + Name -->
      <header class="flex items-center gap-3 mb-2">
        <AppDeferredMedia
          v-if="review.avatar"
          wrapper-class="w-10 h-10 shrink-0"
          placeholder-class="w-full h-full rounded-full bg-accent/10 dark:bg-accent-light/10"
        >
          <img
            :src="review.avatar"
            :alt="review.name"
            class="w-full h-full rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </AppDeferredMedia>
        <div
          v-else
          class="w-10 h-10 rounded-full bg-accent/10 dark:bg-accent-light/10 flex items-center justify-center text-accent dark:text-accent-light font-semibold"
        >
          {{ review.name.charAt(0).toUpperCase() }}
        </div>
        <span class="font-medium text-neutral-900 dark:text-neutral-100">
          {{ review.name }}
        </span>
      </header>

      <!-- Stars -->
      <div
        role="img"
        class="flex gap-0.5 mb-3"
        :aria-label="t('reviews.rating', { count: review.rating })"
      >
        <IconStar v-for="star in review.rating" :key="star" class="w-5 h-5 text-amber-400" />
        <IconStar
          v-for="star in 5 - review.rating"
          :key="'empty-' + star"
          class="w-5 h-5 text-neutral-300 dark:text-neutral-600"
        />
      </div>

      <!-- Review text -->
      <p class="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed whitespace-pre-line">
        {{ review.text }}
      </p>

      <!-- Review images: simple layout for 1-2 images -->
      <div
        v-if="review.images?.length && review.images.length <= 2"
        class="mt-auto flex gap-3"
      >
        <button
          v-for="(img, imgIndex) in review.images"
          :key="imgIndex"
          type="button"
          class="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
          @click="openImage(review.images!, imgIndex)"
          :aria-label="t('accessibility.openReviewImage', { name: review.name, index: imgIndex + 1 })"
        >
          <AppDeferredMedia
            wrapper-class="w-full h-full"
            placeholder-class="w-full h-full bg-rose-100 dark:bg-neutral-700"
          >
            <AppPicture
              :src="img.thumb"
              :alt="t('reviews.imageAlt', { name: review.name })"
              img-class="w-full h-full object-cover"
              sizes="128px"
            />
          </AppDeferredMedia>
        </button>
      </div>

      <!-- Review images: horizontal scroller for 3+ images -->
      <HorizontalScroller
        v-else-if="review.images?.length"
        class="mt-auto"
        gradient-class="from-rose-50 dark:from-neutral-800"
        gradient-height="h-32"
      >
        <button
          v-for="(img, imgIndex) in review.images"
          :key="imgIndex"
          type="button"
          class="flex-shrink-0 snap-start w-32 h-32 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
          @click="openImage(review.images!, imgIndex)"
          :aria-label="t('accessibility.openReviewImage', { name: review.name, index: imgIndex + 1 })"
        >
          <AppDeferredMedia
            wrapper-class="w-full h-full"
            placeholder-class="w-full h-full bg-rose-100 dark:bg-neutral-700"
          >
            <AppPicture
              :src="img.thumb"
              :alt="t('reviews.imageAlt', { name: review.name })"
              img-class="w-full h-full object-cover"
              sizes="128px"
            />
          </AppDeferredMedia>
        </button>
      </HorizontalScroller>
    </article>
  </div>

  <!-- Google attribution -->
  <p class="text-center mt-8">
    <a
      href="https://share.google/hPCdZDLQpELxqblGd"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-300 underline decoration-neutral-400/70 underline-offset-4 hover:text-accent dark:hover:text-accent-light hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm transition-colors"
    >
      {{ t("reviews.source") }}
    </a>
  </p>

  <GalleryModal ref="galleryModalRef" :images="currentOriginalImage" />
</template>
