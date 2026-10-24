import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet diambil dari web lama (variables.css)
        ivory: "#FCF9F2",
        gold: "#D4AF37",
        blush: "#FADADD",
        ink: "#333333",
        muted: "#666666",
        line: "#E5E0D8",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        site: "1440px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        // Dimatikan otomatis untuk pengguna yang memilih "reduce motion" (lihat globals.css)
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
