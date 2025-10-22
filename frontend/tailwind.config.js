/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        accent: '#f472b6'
      }
    }
  },
  plugins: []
};
