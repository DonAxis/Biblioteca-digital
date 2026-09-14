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
          50:  '#eef2ff',
          100: '#dce6fd',
          200: '#b9ccfb',
          300: '#8aabf7',
          400: '#6090f2',
          500: '#3b6fe8',
          600: '#1e4fd8',
          700: '#1a3fbe',
          800: '#0d1b5e',
          900: '#0a1448',
        },
        ub: {
          navy:  '#0d1b5e',
          blue:  '#1e4fd8',
          light: '#60a5fa',
          white: '#ffffff',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
