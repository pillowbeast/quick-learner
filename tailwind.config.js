module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        text: "#333333",
        shadow: "#7f7b82",

        dark: {
          background: "#29232d",
          text: "#ffffff",
          shadow: "#7f7b82",
        },

        primary: "#8ED6CB",
        secondary: "#8F45A5",
      },

      fontFamily: {
        primary: ["Teko", "sans-serif"],
        secondary: ["AzeretMono", "monospace"],
      },

      spacing: {
        "view-width": "125rem",
        "extra-special": "12.2rem",
        "special": "6.3rem",
        "enough": "3.9rem",
        "standard": "2.4rem",
        "minimal": "1.2rem",
      },
    },
  },
  darkMode: "class", // Allows manual dark mode switching
  variants: {
    extend: {},
  },
  plugins: [],
}
