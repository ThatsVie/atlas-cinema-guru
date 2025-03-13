/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: '#00003c',
        blueLight: '#64648c',
        teal: '#1ed2af',
        tealBright: '#3EEFC5',
        navy: '#000080',
      },
    },
  },
  plugins: [],
};
