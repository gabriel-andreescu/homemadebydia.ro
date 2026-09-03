export interface ReviewMediaEntry {
  name: string;
  avatar?: string;
  images?: string[];
}

export const reviewMediaEntries: ReviewMediaEntry[] = [
  {
    name: "Cristiana Cristescu",
    avatar: "/gallery/reviews/cristiana-cristescu.png",
    images: [
      "/gallery/reviews/cristiana-cristescu-1-original",
      "/gallery/reviews/cristiana-cristescu-2-original",
    ],
  },
  {
    name: "Anca Elena",
    images: ["/gallery/reviews/anca-elena-cake-original"],
  },
  {
    name: "AC Arhitectura",
    avatar: "/gallery/reviews/ac-arhitectura.png",
    images: ["/gallery/reviews/ac-arhitectura-cake-original"],
  },
  {
    name: "Ramona Silvia Pavel",
    images: [
      "/gallery/reviews/ramona-silvia-pavel-1-original",
      "/gallery/reviews/ramona-silvia-pavel-2-original",
      "/gallery/reviews/ramona-silvia-pavel-3-original",
      "/gallery/reviews/ramona-silvia-pavel-4-original",
    ],
  },
];
