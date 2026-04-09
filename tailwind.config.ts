import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-crimson-text)", "Georgia", "serif"],
        display: ["var(--font-im-fell-english)", "Georgia", "serif"],
      },
      colors: {
        parchment: {
          50:  "#fdf8ed",
          100: "#f9f0d0",
          200: "#f4e8c1",
          300: "#ecddb0",
          400: "#e8d5a0",
          500: "#d4bc7a",
          600: "#b89a50",
          700: "#8b6914",
        },
        ink: {
          DEFAULT: "#2c1810",
          light:   "#5a3e2b",
          muted:   "#7a6050",
        },
        dnd: {
          red:    "#8b1a1a",
          redLight:"#c0392b",
          gold:   "#8b6914",
          goldLight:"#d4a017",
          border: "#7a5c2e",
          green:  "#2e7d32",
        },
      },
      boxShadow: {
        sheet: "0 0 0 6px #5a3e2b, 0 0 0 9px #d4bc7a, 0 20px 60px rgba(0,0,0,0.8)",
        inset: "inset 0 0 8px rgba(120,80,20,0.08), 2px 2px 4px rgba(44,24,16,0.3)",
        "ca-shield": "0 0 12px rgba(139,105,20,0.5), inset 0 0 8px rgba(0,0,0,0.3)",
      },
      backgroundImage: {
        "parchment-texture":
          "linear-gradient(160deg, #f9f0d0 0%, #f4e8c1 40%, #ecddb0 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
