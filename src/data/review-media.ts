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
  {
    name: "Ramona Silvia Pavel",
    images: [
      {
        thumb: "/gallery/reviews/ramona-silvia-pavel-1",
        original: "/gallery/reviews/ramona-silvia-pavel-1-original",
      },
      {
        thumb: "/gallery/reviews/ramona-silvia-pavel-2",
        original: "/gallery/reviews/ramona-silvia-pavel-2-original",
      },
      {
        thumb: "/gallery/reviews/ramona-silvia-pavel-3",
        original: "/gallery/reviews/ramona-silvia-pavel-3-original",
      },
      {
        thumb: "/gallery/reviews/ramona-silvia-pavel-4",
        original: "/gallery/reviews/ramona-silvia-pavel-4-original",
      },
    ],
  },
];
