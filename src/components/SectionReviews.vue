<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import IconGoogle from "./icons/IconGoogle.vue";
import IconStar from "./icons/IconStar.vue";
import AppPicture from "./AppPicture.vue";
import GalleryModal from "./GalleryModal.vue";
import { reviewMediaEntries } from "../data/review-media";
import { CONTACT } from "../constants";

const { t, locale } = useI18n();

interface ReviewCard {
  name: string;
  text: string;
  rating: number;
  avatar?: string;
  images?: string[];
}

interface ReviewTextContent {
  name: string;
  text: string;
  rating: number;
}

const galleryModalRef = ref<InstanceType<typeof GalleryModal>>();
const currentOriginalImage = ref<string[]>([]);
const reviewMediaByName = Object.fromEntries(
  reviewMediaEntries.map((entry) => [entry.name, { avatar: entry.avatar, images: entry.images }]),
) as Record<string, Pick<ReviewCard, "avatar" | "images">>;

const expanded = ref<number[]>([]);
const clamped = ref<boolean[]>([]);
const textRefs: (HTMLElement | null)[] = [];

const isExpanded = (index: number) => expanded.value.includes(index);

const REVEAL_MS = 300;
const revealing = ref<number[]>([]);

// -webkit-line-clamp cannot be animated, so the height is animated instead and the clamp is
// held off until the box has finished moving.
const toggleReview = async (index: number) => {
  const el = textRefs[index];
  const from = el?.getBoundingClientRect().height ?? 0;
  const opening = !isExpanded(index);

  if (!opening && el) revealing.value = [...revealing.value, index];
  expanded.value = opening
    ? [...expanded.value, index]
    : expanded.value.filter((i) => i !== index);

  const settle = () => {
    revealing.value = revealing.value.filter((i) => i !== index);
  };

  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    settle();
    return;
  }

  await nextTick();
  // closing animates towards the remembered clamped height, since the clamp is held off
  const to = opening ? el.getBoundingClientRect().height : (clampedHeights[index] ?? 0);
  if (Math.abs(to - from) < 1) {
    settle();
    return;
  }

  const animation = el.animate(
    [{ maxHeight: `${from}px` }, { maxHeight: `${to}px` }],
    { duration: REVEAL_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
  );
  animation.finished.then(settle, settle);
};

const setTextRef = (el: HTMLElement | null, index: number) => {
  textRefs[index] = el;
};

// only a card the clamp actually shortens gets the link
const clampedHeights: number[] = [];

const measureClamped = () => {
  clamped.value = textRefs.map((el, index) => {
    if (!el || isExpanded(index)) return clamped.value[index] ?? false;
    clampedHeights[index] = el.clientHeight;
    return el.scrollHeight > el.clientHeight + 1;
  });
};

let frame = 0;
const scheduleMeasure = () => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    measureClamped();
  });
};

onMounted(() => {
  measureClamped();
  window.addEventListener("resize", scheduleMeasure);
});

onUnmounted(() => {
  window.removeEventListener("resize", scheduleMeasure);
  if (frame) cancelAnimationFrame(frame);
});

const openImage = async (images: string[], index: number) => {
  currentOriginalImage.value = images;
  await nextTick();
  galleryModalRef.value?.openAt(index);
};

const attachReviewMedia = (review: ReviewTextContent): ReviewCard => ({
  ...review,
  ...reviewMediaByName[review.name],
});

const reviewsRo: ReviewCard[] = [
  {
    name: "Cristiana Cristescu",
    text: "Cele mai bune eclere pe care le-am mâncat vreodată. Și spun asta fără nicio exagerare.\nAm încercat de-a lungul timpului eclere de la multe cofetării foarte cunoscute din București, inclusiv French Revolution, dar acestea sunt, pentru mine, la un cu totul alt nivel.\nSe simte imediat calitatea ingredientelor: bio, naturale, gusturi curate, creme fine, fără acea senzație excesiv de dulce sau artificială pe care o întâlnești atât de des la deserturi. Iar combinațiile de arome sunt absolut spectaculoase.\nSunt genul acela de eclere la care iei prima înghițitură și te oprești puțin pentru că efectiv nu te așteptai să fie atât de bune. 😊\nGust divin, ingrediente excelente și un produs făcut impecabil. Pentru mine, fără îndoială, cele mai bune eclere din București. Le recomand din toată inima și cu siguranță voi reveni!",
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
    name: "Cristiana Cristescu",
    text: "The best éclairs I have ever eaten. And I say that with no exaggeration at all.\nOver the years I have tried éclairs from many well-known patisseries in Bucharest, including French Revolution, but these are, for me, on a completely different level.\nYou taste the quality of the ingredients immediately: organic, natural, clean flavours, fine creams, without that excessively sweet or artificial feeling you meet so often in desserts. And the flavour combinations are absolutely spectacular.\nThey are the kind of éclair where you take the first bite and stop for a moment, because you simply did not expect them to be this good. 😊\nDivine taste, excellent ingredients and an impeccably made product. For me, without a doubt, the best éclairs in Bucharest. I recommend them wholeheartedly and I will certainly be back!",
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
const reviews = computed<ReviewCard[]>(() => (locale.value === "en" ? reviewsEn : reviewsRo));
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4 px-2">
    <article
      v-for="(review, index) in reviews"
      :key="index"
      class="relative bg-surface-sunk/50 rounded-surface p-6 shadow-card hover:shadow-raised transition-shadow flex flex-col overflow-hidden"
    >
      <!-- Header: Avatar + Name -->
      <header class="flex items-center gap-3 mb-2">
        <AppDeferredMedia
          v-if="review.avatar"
          wrapper-class="w-10 h-10 shrink-0"
          placeholder-class="w-full h-full rounded-full bg-brand/10"
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
          class="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand-ink font-semibold"
        >
          {{ review.name.charAt(0).toUpperCase() }}
        </div>
        <span class="font-medium text-ink">
          {{ review.name }}
        </span>
      </header>

      <!-- Stars -->
      <div
        role="img"
        class="flex gap-0.5 mb-3"
        :aria-label="t('reviews.rating', { count: review.rating })"
      >
        <IconStar v-for="star in review.rating" :key="star" class="w-4 h-4 text-star" />
        <IconStar
          v-for="star in 5 - review.rating"
          :key="'empty-' + star"
          class="w-4 h-4 text-ink-muted"
        />
      </div>

      <!-- Review text -->
      <div class="mb-4 flex flex-col items-start gap-2">
        <p
          :ref="(el) => setTextRef(el as HTMLElement | null, index)"
          class="overflow-hidden text-ink-soft leading-relaxed whitespace-pre-line max-w-[56ch]"
          :class="isExpanded(index) || revealing.includes(index) ? '' : 'md:line-clamp-[12]'"
        >
          {{ review.text }}
        </p>
        <button
          v-if="clamped[index]"
          type="button"
          class="hidden md:inline-block text-ui font-semibold text-brand-ink hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-control transition-colors"
          @click="toggleReview(index)"
        >
          <span class="border-b border-current pb-px">
            {{ isExpanded(index) ? t("reviews.readLess") : t("reviews.readMore") }}
          </span>
        </button>
      </div>

      <div
        v-if="review.images?.length"
        class="mt-auto -mx-6 -mb-6 grid gap-0.5"
        :class="review.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'"
      >
        <button
          v-for="(img, imgIndex) in review.images"
          :key="imgIndex"
          type="button"
          class="aspect-[4/3] overflow-hidden hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
          @click="openImage(review.images!, imgIndex)"
          :aria-label="
            t('accessibility.openReviewImage', { name: review.name, index: imgIndex + 1 })
          "
        >
          <AppDeferredMedia
            wrapper-class="w-full h-full"
            placeholder-class="w-full h-full bg-surface-sunk"
          >
            <AppPicture
              :src="img"
              :alt="t('reviews.imageAlt', { name: review.name })"
              img-class="w-full h-full object-cover"
              :sizes="
                review.images!.length > 1
                  ? '(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 13vw'
                  : '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw'
              "
            />
          </AppDeferredMedia>
        </button>
      </div>
    </article>
  </div>

  <div class="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
    <span class="text-ui text-ink-muted">{{ t("footer.didYouLike") }}</span>
    <a
      :href="CONTACT.googleReview"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 px-4 py-3 text-ui font-medium border border-line-strong rounded-full hover:border-brand hover:text-brand-ink active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-[transform,color,border-color]"
    >
      <IconGoogle class="w-4 h-4" aria-hidden="true" />
      {{ t("footer.leaveReview") }}
    </a>
  </div>

  <p class="text-center mt-4">
    <a
      href="https://share.google/hPCdZDLQpELxqblGd"
      target="_blank"
      rel="noopener noreferrer"
      class="-my-3 py-3 inline-flex items-center gap-1 text-ui font-medium text-ink-muted underline decoration-line-strong/70 underline-offset-4 hover:text-brand-ink hover:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-control transition-colors"
    >
      {{ t("reviews.source") }}
    </a>
  </p>

  <GalleryModal ref="galleryModalRef" :images="currentOriginalImage" />
</template>
