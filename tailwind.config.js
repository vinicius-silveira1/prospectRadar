/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cores baseadas no logo ProspectRadar
        'brand': {
          'dark': '#0f172a',      // Azul escuro do fundo do logo
          'navy': '#1e293b',      // Azul navy
          'orange': '#ff6b35',    // Laranja vibrante da bola
          'cyan': '#06b6d4',      // Ciano do radar
          'light': '#f8fafc',     // Branco/cinza claro
        },
        // Cores NBA (mantidas para compatibilidade)
        'nba-blue': '#1d428a',
        'nba-red': '#c8102e',
        'draft-gold': '#fdb927',
      },
      fontFamily: {
        'basketball': ['Inter', 'Arial', 'sans-serif'],
        'display': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'accent-gradient': 'linear-gradient(135deg, #ff6b35 0%, #06b6d4 100%)',
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(15, 23, 42, 0.2)',
        'brand-lg': '0 10px 25px -3px rgba(15, 23, 42, 0.3)',
      },
    },
  },
  plugins: [],
}
