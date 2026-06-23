/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        duits_light: {
          "primary": "#0F6E56",
          "secondary": "#042C53",
          "accent": "#1D9E75",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f8f9fa",
          "base-300": "#e5e7eb",
          "base-content": "#111827",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        }
      },
      {
        duits_dark: {
          "primary": "#1D9E75",
          "secondary": "#042C53",
          "accent": "#5DCAA5",
          "neutral": "#191D24",
          "base-100": "#0f1117",
          "base-200": "#1a1f2e",
          "base-300": "#1e293b",
          "base-content": "#f1f5f9",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        }
      }
    ],
  },
}