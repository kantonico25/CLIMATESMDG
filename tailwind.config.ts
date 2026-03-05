// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#048180',
          yellow: '#F3CB03',
          coral: '#F78181',
          gray: '#d9d9d9',
          dark: '#1a202c',
          light: '#f7fafc',
          'teal-custom': '#0d8a8a',
        },
      },
      fontFamily: {
        sans: ['Arimo', 'sans-serif'],
        heading: ['Arimo', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;