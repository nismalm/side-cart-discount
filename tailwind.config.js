/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          500: '#38bec9',
          600: '#2bb0bb', 
          700: '#1e9ca1',
        },
        teal: {
          50: '#ecfeff',
          500: '#38bec9',
          600: '#2bb0bb',
          700: '#1e9ca1',
          800: '#177a7f',
          900: '#0d4f52',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}