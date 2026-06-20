/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161B22",
        paper: "#F3F5F7",
        surface: "#FFFFFF",
        line: "#E2E6EA",
        teal: {
          50: "#EAF6F5",
          100: "#CFEAE8",
          400: "#1C9B96",
          500: "#0E7C7B",
          600: "#0A615F",
        },
        crimson: {
          50: "#FBEAE7",
          100: "#F4CCC4",
          500: "#C1473A",
          600: "#9F3A2F",
        },
        amber: {
          50: "#FBF3E3",
          500: "#C98A1F",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,27,34,0.04), 0 1px 0 rgba(22,27,34,0.06)",
        pop: "0 12px 24px -8px rgba(22,27,34,0.18)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
