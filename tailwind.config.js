/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        headerbg: "var(--color-header-bg)",
        navbg: "var(--color-nav-bg)",
      },
    },
  },
  plugins: [],
};
