/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F6F2',
        text: '#1F2937',
        accent: '#319795',
      },
    },
  },
  plugins: [],
}
