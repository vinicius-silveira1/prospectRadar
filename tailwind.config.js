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
      'text-gradient-animation': {
        '0%, 100%': { 'background-position': '0% 50%' },
        '50%': { 'background-position': '100% 50%' },
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
      'text-gradient': 'text-gradient-animation 5s ease infinite',
    },
  },
  plugins: [require('@tailwindcss/typography')],
  // Adicionado safelist para garantir que as classes de cor dinâmicas sejam geradas
  safelist: [
    // Cores para as badges de usuário (UserAchievement)
    'from-amber-700', 'to-yellow-600', 'text-amber-600',
    'from-slate-500', 'to-slate-400', 'text-slate-400',
    'from-yellow-500', 'to-yellow-300', 'text-yellow-400',
    'from-cyan-400', 'to-teal-300', 'text-cyan-300',
    // Cores para os ícones de badge (BadgeIcon)
    'text-yellow-500', 'bg-yellow-100/50', 'dark:bg-yellow-900/50', 'border-yellow-500/50',
    'text-gray-500', 'bg-gray-100/50', 'dark:bg-gray-700/50', 'border-gray-400/50',
    'text-orange-600', 'bg-orange-100/50', 'dark:bg-orange-900/50', 'border-orange-500/50',
    // Cores para os nomes de usuário por nível (userLevelUtils)
    'bg-gradient-to-r', 'from-yellow-400', 'via-orange-500', 'to-red-500', 'bg-clip-text', 'text-transparent', 'animate-text-gradient', 'bg-[200%_auto]',
    'from-purple-400', 'to-pink-500',
    'text-sky-300', '[text-shadow:0_0_8px_rgba(56,189,248,0.7)]',
    'text-green-300', '[text-shadow:0_0_5px_rgba(74,222,128,0.5)]',
    // Cores para os cards de estatísticas avançadas (AdvancedStatsExplanation)
    'text-purple-700', 'dark:text-purple-400', 'bg-gradient-to-br', 'from-purple-50', 'to-purple-100/50', 'dark:from-purple-900/20', 'dark:to-purple-800/10', 'border-purple-200/50', 'dark:border-purple-700/30', 'shadow-purple-500/30',
    'text-teal-700', 'dark:text-teal-400', 'from-teal-50', 'to-teal-100/50', 'dark:from-teal-900/20', 'dark:to-teal-800/10', 'border-teal-200/50', 'dark:border-teal-700/30', 'shadow-teal-500/30',
    'text-indigo-700', 'dark:text-indigo-400', 'from-indigo-50', 'to-indigo-100/50', 'dark:from-indigo-900/20', 'dark:to-indigo-800/10', 'border-indigo-200/50', 'dark:border-indigo-700/30', 'shadow-indigo-500/30',
    'text-pink-700', 'dark:text-pink-400', 'from-pink-50', 'to-pink-100/50', 'dark:from-pink-900/20', 'dark:to-pink-800/10', 'border-pink-200/50', 'dark:border-pink-700/30', 'shadow-pink-500/30',
    'text-lime-700', 'dark:text-lime-400', 'from-lime-50', 'to-lime-100/50', 'dark:from-lime-900/20', 'dark:to-lime-800/10', 'border-lime-200/50', 'dark:border-lime-700/30', 'shadow-lime-500/30',
    'text-red-700', 'dark:text-red-400', 'from-red-50', 'to-red-100/50', 'dark:from-red-900/20', 'dark:to-red-800/10', 'border-red-200/50', 'dark:border-red-700/30', 'shadow-red-500/30',
    'text-orange-700', 'dark:text-orange-400', 'from-orange-50', 'to-orange-100/50', 'dark:from-orange-900/20', 'dark:to-orange-800/10', 'border-orange-200/50', 'dark:border-orange-700/30', 'shadow-orange-500/30',
    'text-green-700', 'dark:text-green-400', 'from-green-50', 'to-green-100/50', 'dark:from-green-900/20', 'dark:to-green-800/10', 'border-green-200/50', 'dark:border-green-700/30', 'shadow-green-500/30',
    'text-blue-700', 'dark:text-blue-400', 'from-blue-50', 'to-blue-100/50', 'dark:from-blue-900/20', 'dark:to-blue-800/10', 'border-blue-200/50', 'dark:border-blue-700/30', 'shadow-blue-500/30',
    'text-violet-700', 'dark:text-violet-400', 'from-violet-50', 'to-violet-100/50', 'dark:from-violet-900/20', 'dark:to-violet-800/10', 'border-violet-200/50', 'dark:border-violet-700/30', 'shadow-violet-500/30',
    'text-yellow-700', 'dark:text-yellow-400', 'from-yellow-50', 'to-yellow-100/50', 'dark:from-yellow-900/20', 'dark:to-yellow-800/10', 'border-yellow-200/50', 'dark:border-yellow-700/30', 'shadow-yellow-500/30',
  ],
}
