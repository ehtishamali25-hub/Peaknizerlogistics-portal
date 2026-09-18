/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0E2A47',
          'navy-light': '#123457',
          emerald: '#10B981',
        },
      },
    },
  },
  plugins: [],
}