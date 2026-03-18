/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E07B39',
        secondary: '#2D6A4F',
        background: '#FFF8F0',
        surface: '#FFFFFF',
        'text-main': '#1A1A2E',
        'text-muted': '#6B7280',
        accent: '#F4D03F',
      },
      fontFamily: {
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
        ui: ['Poppins', 'sans-serif'],
        display: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
}
