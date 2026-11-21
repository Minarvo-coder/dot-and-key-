/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#EDE6DD",
          card: "#F8F3EC",
          subtle: "#F2EAE1",
        },
        ink: {
          primary: "#231F20",
          muted: "#81776F",
          inverted: "#F8F3EC",
        },
        terracotta: {
          DEFAULT: "#B4532A",
          hover: "#9C431F",
          light: "#F5EBE6",
        },
        sage: {
          DEFAULT: "#6B7F73",
          soft: "#E3E8E5",
          dark: "#4F7359",
        },
        sand: {
          DEFAULT: "#D9C7AE",
          light: "#F0E8DD",
        },
        line: {
          subtle: "#D9CFC3",
          strong: "#BAAEA0",
        },
        status: {
          success: "#4F7359",
          "success-bg": "#EAF1EC",
          warning: "#B87B28",
          "warning-bg": "#F7F2E7",
          error: "#A63A2A",
          "error-bg": "#F7EAE8",
        },
      },
      fontFamily: {
        serif: ["DM Serif Display", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "DM Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        "clay-sm": "0 1px 2px 0 rgba(35, 31, 32, 0.04)",
        "clay-md": "0 4px 12px -2px rgba(35, 31, 32, 0.06), 0 2px 4px -1px rgba(35, 31, 32, 0.03)",
        "clay-lg": "0 12px 24px -4px rgba(35, 31, 32, 0.08), 0 4px 8px -2px rgba(35, 31, 32, 0.04)",
      },
    },
  },
  plugins: [],
};
