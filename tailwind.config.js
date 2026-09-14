/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f8f6f0',
          100: '#ede8d8',
          200: '#d9cfb0',
          300: '#c9a84c',
          400: '#b8963e',
          500: '#a07c2e',
          600: '#856420',
          700: '#1a2744',
          800: '#131e36',
          900: '#0d1424',
        },
        hall: {
          navy:  '#1a2744',
          gold:  '#c9a84c',
          cream: '#f5f0e8',
          dark:  '#0d1424',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
