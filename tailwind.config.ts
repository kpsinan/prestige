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
          primary: "#2563EB", // Primary (blue-600)
          accent: "#60A5FA",  // Accent (blue-400)
          dark: "#0B0F19",    // Dark
          gray: "#6B7280",    // Gray
          light: "#F9FAFB",   // Light
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite', // Custom slow spin for Settings icons
      }
    },
  },
  plugins: [],
};
export default config;