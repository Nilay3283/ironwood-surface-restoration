/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#111111',
        charcoal: '#252525',
        ivory: '#F4F0E8',
        gold: '#B69A68',
        stone: '#C7BBA7',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { luxe: '0.32em', wide2: '0.18em' },
    },
  },
  plugins: [],
};
