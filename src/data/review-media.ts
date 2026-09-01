export interface ReviewMediaImage {
  thumb: string;
  original: string;
}

export interface ReviewMediaEntry {
  name: string;
  avatar?: string;
  images?: ReviewMediaImage[];
}

export const reviewMediaEntries: ReviewMediaEntry[] = [
  {
    name: "Gabriela Mihai",
    avatar: "/gallery/reviews/gabriela-mihai.png",
    images: [
      {
        thumb: "/gallery/reviews/gabriela-mihai-cake",
        original: "/gallery/reviews/gabriela-mihai-cake",
      },
    ],
  },
  {
    name: "Anca Elena",
    images: [
      {
        thumb: "/gallery/reviews/anca-elena-cake",
        original: "/gallery/reviews/anca-elena-cake-original",
      },
    ],
  },
  {
    name: "AC Arhitectura",
    avatar: "/gallery/reviews/ac-arhitectura.png",
    images: [
      {
        thumb: "/gallery/reviews/ac-arhitectura-cake",
        original: "/gallery/reviews/ac-arhitectura-cake-original",
      },
    ],
  },
];
