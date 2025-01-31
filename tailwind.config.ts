/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  safelist: [
    // Text colors
    {
      pattern: /^text-(red|blue|green|yellow|purple)-300$/,
    },
    // Background colors and hover states
    {
      pattern:
        /^(bg|hover:bg|focus-visible:outline)-(indigo|sky|blue|green|red|orange)-(800|500|600)$/,
    },
  ],
  plugins: [],
};
