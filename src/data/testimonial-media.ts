export interface TestimonialMediaImage {
  thumb: string;
  original: string;
}

export interface TestimonialMediaEntry {
  name: string;
  avatar?: string;
  images?: TestimonialMediaImage[];
}

export const testimonialMediaEntries: TestimonialMediaEntry[] = [
  {
    name: "Gabriela Mihai",
    avatar: "/gallery/testimonials/gabriela-mihai.png",
    images: [
      {
        thumb: "/gallery/testimonials/gabriela-mihai-cake",
        original: "/gallery/testimonials/gabriela-mihai-cake",
      },
    ],
  },
  {
    name: "Anca Elena",
    images: [
      {
        thumb: "/gallery/testimonials/anca-elena-cake",
        original: "/gallery/testimonials/anca-elena-cake-original",
      },
    ],
  },
  {
    name: "AC Arhitectura",
    avatar: "/gallery/testimonials/ac-arhitectura.png",
    images: [
      {
        thumb: "/gallery/testimonials/ac-arhitectura-cake",
        original: "/gallery/testimonials/ac-arhitectura-cake-original",
      },
    ],
  },
  {
    name: "Ramona Silvia Pavel",
    images: [
      {
        thumb: "/gallery/testimonials/ramona-silvia-pavel-1",
        original: "/gallery/testimonials/ramona-silvia-pavel-1-original",
      },
      {
        thumb: "/gallery/testimonials/ramona-silvia-pavel-2",
        original: "/gallery/testimonials/ramona-silvia-pavel-2-original",
      },
      {
        thumb: "/gallery/testimonials/ramona-silvia-pavel-3",
        original: "/gallery/testimonials/ramona-silvia-pavel-3-original",
      },
      {
        thumb: "/gallery/testimonials/ramona-silvia-pavel-4",
        original: "/gallery/testimonials/ramona-silvia-pavel-4-original",
      },
    ],
  },
];
