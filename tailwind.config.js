import { venueColors } from "./utils/constants"; 

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
    extend: {
      colors: {
        ...Object.keys(venueColors).reduce((acc, key) => {
          acc[`venue-${key}`] = venueColors[key];
          return acc;
        }, {}),
      },
    },
  },
  safelist: [
    'text-venue-PC',
    'text-venue-CA',
    'text-venue-TT',
    'text-venue-TK',
    'text-venue-SV',
  ],
  plugins: [],
};
