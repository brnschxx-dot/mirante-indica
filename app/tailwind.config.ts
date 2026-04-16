import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4F46E5",   // Indigo Moderno
          secondary: "#0F172A", // Slate Industrial
          accent: "#F59E0B",    // Âmbar
          background: "#F8FAFC",// Cinza claríssimo
          card: "#FFFFFF",      // Branco
        }
      },
      borderRadius: {
        'app': '2.5rem',   // O padrão de arredondamento das telas
        'card': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;