/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB87A',
        dark: '#0B3D2E',
        mint: '#F0FAF6',
        teal: '#6EE7B7',
        body: '#1C2B26',
        muted: '#6B7B74',
        border: '#D1EEE4',
        surface: '#F5F7F5',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
