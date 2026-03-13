// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // We updated this section to check BOTH src/ and root level folders
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
          black: "#0A0A0A", 
          dark: "#1A1A1A",
          gray: "#F4F4F5",  
          blue: "#2563EB",  
          accent: "#EF4444", 
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [],
};
export default config;