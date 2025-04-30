/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          yankees: "#201F37",
        },
        base: {
          900: "#9D9CAF",
          600: "#6C6B80",
          400: "#201F37",
        },
      },
    },
  },
  plugins: [],
};
