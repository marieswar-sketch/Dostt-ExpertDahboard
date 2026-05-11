import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dostt: {
          purple: "#6B2FD9",
          "purple-light": "#8B5CF6",
          "purple-dark": "#4C1D95",
          "purple-bg": "#F3EEFF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
