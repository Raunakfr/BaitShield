/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0F1F38',
        surface: '#162440',
        border: '#1E3054',
        accent: '#F97316',
        text: '#E2E8F0',
        muted: '#64748B',
        high: '#EF4444',
        med: '#F59E0B',
        low: '#22C55E'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
