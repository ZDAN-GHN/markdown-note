/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        geek: {
          bg: '#0a0a0a',
          border: '#333333',
          text: '#c0c0c0',
          highlight: '#39ff14',
          'highlight-hover': '#32d912',
          muted: '#666666',
          input: '#1a1a1a',
          hover: '#151515',
          active: '#1a1a1a',
        },
      },
      fontFamily: {
        mono: ['"Fira Code"', '"Monaco"', '"Courier New"', 'monospace'],
        sans: ['"Inter"', '"Helvetica"', '"Arial"', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
      },
    },
  },
  plugins: [],
}