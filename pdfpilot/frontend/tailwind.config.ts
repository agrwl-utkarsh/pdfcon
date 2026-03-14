import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F19",
        fog: "#F4F3EE",
        sea: "#0F7C82",
        coral: "#F28C5B",
        cloud: "#E7EDF0"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(15, 124, 130, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
