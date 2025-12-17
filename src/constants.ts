export const CONTACT = {
  phone: "+40787283917",
  phoneDisplay: "0787 283 917",
  email: "diana@homemadebydia.ro",
  whatsapp: "https://wa.me/40787283917",
  facebook: "https://www.facebook.com/homemadebyDia",
  messenger: "https://m.me/homemadebyDia",
  instagram: "https://www.instagram.com/homemade.by.dia",
  googleReview: "https://g.page/r/CfsLVETol7P7EBM/review",
} as const;

export const PRICES = {
  // Candy bar package
  candyBarPerPerson: 40,
  pastriesPerPerson: 3,
  varietiesCount: 6,
  minimumGuests: 25,
  // Custom options
  customThemeSurcharge: 3,
  decorMin: 20,
  decorMax: 200,
  // Optional services
  dishRental: 150,
  candyBarSetup: 150,
  dishPickup: 50,
  delivery: 250,
  favors: 10,
} as const;

export const SCROLL_THRESHOLD = 50;

export const UNIT_STEPS: Record<string, number> = {
  kg: 0.1,
  buc: 1,
  "100 g": 1,
} as const;

export const VALID_UNITS = Object.keys(UNIT_STEPS);

export const DEFAULT_UNIT_STEP = 1;
