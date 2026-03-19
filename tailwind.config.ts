import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        prestige: {
          primary: "#0F766E", // Deep Teal - Trustworthy and modern
          accent: "#EA580C",  // Vibrant Orange - High conversion for buttons
          dark: "#1E293B",    // Slate 800 - Softer, premium black for text
          gray: "#94A3B8",    // Slate 400 - Muted text and borders
          light: "#F8FAFC",   // Slate 50 - Clean, crisp background
          white: "#FFFFFF",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite', 
      }
    },
  },
  plugins: [],
};
export default config;