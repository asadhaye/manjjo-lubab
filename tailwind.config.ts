import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Manjjo Brand Colors
        'manjjo-red': '#DC2626',      // Primary red for buttons, accents
        'manjjo-yellow': '#FFC107',   // Secondary yellow for highlights
        'manjjo-orange': '#FFAE42',   // Orange for Order Now text
        'manjjo-dark': '#1A1A1A',     // Dark text, backgrounds
        'manjjo-light': '#F5F5F5',     // Light backgrounds, cards
        'manjjo-gray': '#6B7280',     // Muted text, borders
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}

export default config
