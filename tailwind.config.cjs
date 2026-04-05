/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.vue"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          light: "#FF80B8", // bright pink for dark mode text
          DEFAULT: "#E20076",
          dark: "#880047",
        },
        nude: "#D1D0CE",
        whatsapp: {
          DEFAULT: "#25D366",
          hover: "#20bd5a",
        },
      },
    },
  },
  plugins: [],
};
