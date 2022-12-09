/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.vue",
  ],
  theme: {
    extend: {
        colors: {
          'accent': {
            light: '#ee66ad',
            DEFAULT: '#E20076',
            dark: '#880047',
          },
        }
    },
  },
  plugins: [],
}
