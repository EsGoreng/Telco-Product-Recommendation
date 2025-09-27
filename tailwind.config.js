/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Anda sudah menggunakan dark mode berbasis class
  content: [
    "./src/**/*.{html,js}", // Path ke semua file HTML dan JS Anda
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1193d4",
        "background-light": "#f6f7f8",
        "background-dark": "#101c22",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"], // Menambahkan fallback font
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}