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
          DEFAULT: '#8B0000',      /* Blood red / Dark red */
          light: '#A52A2A',        /* Brown red */
          dark: '#5C0000'          /* Darker red */
        },
        secondary: {
          DEFAULT: '#C41E3A',      /* Cardinal red */
          light: '#DC143C',        /* Crimson */
          dark: '#8B0000'
        },
        accent: '#B22222',         /* Firebrick */
        surface: '#ffffff',
        background: {
          DEFAULT: '#ffffff',
          alt: '#fafafa'
        },
        text: {
          DEFAULT: '#1a1a1a',
          light: '#666666',
          muted: '#999999'
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif']
      },
    },
  },
  plugins: [],
}
