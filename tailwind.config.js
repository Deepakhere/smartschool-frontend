/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // brand accent — every button/link/CTA that needs the app's primary color
        // uses primary-* instead of a hardcoded Tailwind color family (previously
        // indigo-*), so changing the brand color is a one-line edit here.
        primary: {
          yankees: "#201F37",
          50: "#f0f7fe",
          100: "#ddecfe",
          200: "#b5d6fd",
          300: "#78b6fc",
          400: "#3692fc",
          500: "#0377fc",
          600: "#0276FC",
          700: "#045fc8",
          800: "#084d9b",
          900: "#0d3f77",
          950: "#0a2747",
        },
        base: {
          900: "#9D9CAF",
          600: "#6C6B80",
          400: "#201F37",
        },
        // neutral (true gray, no blue undertone) instead of Tailwind's default gray
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
