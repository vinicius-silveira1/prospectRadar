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
          'orange': '#ff6b35',    // Laranja vibrante da bola (mantido)
          'purple': '#6b21a8',    // Novo roxo da marca (substitui ciano)
          'yellow': '#facc15',    // Novo amarelo da marca
          'light': '#f8fafc',     // Branco/cinza claro
        },
        // Cores NBA (mantidas para compatibilidade)
        'nba-blue': '#1d428a',
        'nba-red': '#c8102e',
        'draft-gold': '#fdb927',
        // Novas cores para o modo super escuro
        'super-dark': {
          'primary': '#0A0A0A',
          'secondary': '#1A1A1A',
          'text-primary': '#E0E0E0',
          'text-secondary': '#A0A0A0',
          'border': '#3A3A3A',
        },
      },
      fontFamily: {
        'basketball': ['Inter', 'Arial', 'sans-serif'],
        'display': ['Inter', 'sans-serif'],
        'gaming': ['Orbitron', 'Exo 2', 'Rajdhani', 'Inter', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'accent-gradient': 'linear-gradient(135deg, #ff6b35 0%, #06b6d4 100%)',
        'main-banner-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))'
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(15, 23, 42, 0.2)',
        'brand-lg': '0 10px 25px -3px rgba(15, 23, 42, 0.3)',
      },
    },
    keyframes: {
      'fade-in-up': {
        '0%': {
          opacity: '0',
          transform: 'translateY(10px)',
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },
      'fade-in': {
        '0%': {
          opacity: '0',
        },
        '100%': {
          opacity: '1',
        },
      },
      'pulse': {
        '0%, 100%': {
          transform: 'scale(1)',
          opacity: '1',
        },
        '50%': {
          transform: 'scale(1.2)',
          opacity: '0.7',
        },
      },
    },
    animation: {
      'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      'fade-in': 'fade-in 0.5s ease-out forwards',
      'pulse-once': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards',
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
