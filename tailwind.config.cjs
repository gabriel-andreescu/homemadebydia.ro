/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.vue"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          light: "#ee66ad",
          DEFAULT: "#E20076",
          dark: "#880047",
          vivid: "#FF1493", // brighter for dark mode
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
