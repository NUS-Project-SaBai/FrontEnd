import plugin from 'tailwindcss';

/** @type {import('tailwindcss').Config} */

const safelist = [
  // Text colors from villageColorClasses
  'text-red-500',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-purple-500',

  // Background and hover colors for buttons or other components
  'bg-indigo-800',
  'hover:bg-indigo-500',
  'focus-visible:outline-indigo-600',

  'bg-sky-800',
  'hover:bg-sky-500',
  'focus-visible:outline-sky-600',

  'bg-blue-800',
  'hover:bg-blue-500',
  'focus-visible:outline-blue-600',

  'bg-green-800',
  'hover:bg-green-500',
  'focus-visible:outline-green-600',

  'bg-red-800',
  'hover:bg-red-500',
  'focus-visible:outline-red-600',

  'bg-orange-800',
  'hover:bg-orange-500',
  'focus-visible:outline-orange-600',
];

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
  },
  safelist,
  plugins: [],
};
