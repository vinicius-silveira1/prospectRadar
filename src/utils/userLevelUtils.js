// src/utils/userLevelUtils.js

export const getLevelUsernameStyle = (level) => {
  if (!level) return '';

  if (level >= 10) {
    // Nível 10+: Gradiente animado
    return 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-text-gradient bg-[200%_auto]';
  }
  if (level >= 9) {
    // Nível 9: Gradiente estático
    return 'bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent';
  }
  if (level >= 8) {
    // Nível 8: Glow intenso
    return 'text-sky-300 [text-shadow:0_0_8px_rgba(56,189,248,0.7)]';
  }
  if (level >= 7) {
    // Nível 7: Glow sutil
    return 'text-green-300 [text-shadow:0_0_5px_rgba(74,222,128,0.5)]';
  }

  return ''; // Sem estilo especial para níveis inferiores
};
