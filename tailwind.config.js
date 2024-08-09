import daisyui from "daisyui"
import typography from '@tailwindcss/typography';
import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
    daisyui,
    scrollbar,
  ],
  daisyui: {
    themes: ["pastel", "forest"],
  },
}

