/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
    colours: {
      village: {
        1: '#6D8A91', // Even darker pastel blue
        2: '#CC7685', // Even darker pastel pink
        3: '#7A7A70', // Even darker pastel gray
        4: '#CCCC45', // Even darker pastel yellow
        5: '#6A516D',
      },
    },
  },
  plugins: [],
};
