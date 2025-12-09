// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forj: {
          bg: "#050816", // deep near-black
          card: "#0B1020",
          accent: "#11C5F8", // bright teal/blue accent
          accentSoft: "#0F718F",
          text: "#F9FAFB",
          muted: "#9CA3AF",
          border: "#1F2933",
        },
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
