/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B2E6B",
          navyDark: "#081F49",
          blue: "#1C4FA3",
          orange: "#F5A623",
          orangeDark: "#E08E00",
          green: "#1E9E5A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
