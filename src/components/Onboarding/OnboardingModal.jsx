import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, LayoutDashboard, Shuffle, Users, Heart } from 'lucide-react';

const onboardingSteps = [
  {
    icon: LayoutDashboard,
    title: 'Bem-vindo ao seu Dashboard',
    content: 'Este é o seu centro de comando. Aqui você encontra os principais prospects, talentos brasileiros em destaque e atalhos para as funcionalidades mais importantes.',
  },
  {
    icon: Shuffle,
    title: 'Crie seu Mock Draft',
    content: 'Simule o futuro do basquete! Use nossa ferramenta de Mock Draft para criar suas próprias seleções, testar cenários, salvar suas previsões e compartilhar com a comunidade.',
  },
  {
    icon: Users,
    title: 'Compare lado a lado',
    content: 'Tire suas dúvidas comparando estatísticas básicas e avançadas de até 4 jogadores simultaneamente para uma análise profunda.',
  },
  {
    icon: Heart,
    title: 'Acompanhe com a Watchlist',
    content: 'Nunca perca um lance. Adicione seus prospects favoritos à sua Watchlist para acompanhar de perto a evolução deles e fazer anotações.',
  },
];

const OnboardingModal = ({ show, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, onboardingSteps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleClose = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    onClose();
  };

  const Icon = onboardingSteps[currentStep].icon; // Variável com letra maiúscula

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-gradient-to-b from-white to-slate-50 dark:from-super-dark-primary dark:to-super-dark-secondary rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-slate-200/60 dark:border-super-dark-border/60 backdrop-blur-xl relative"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="onboardingPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" fill="currentColor" className="text-brand-purple/20" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#onboardingPattern)" />
              </svg>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 via-transparent to-brand-purple/5" />

            <div className="p-6 sm:p-8 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <motion.div 
                  className="p-4 bg-gradient-to-br from-brand-purple/10 to-brand-orange/10 dark:from-brand-purple/20 dark:to-brand-orange/20 rounded-xl backdrop-blur-sm border border-brand-purple/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {Icon && <Icon className="h-8 w-8 text-brand-purple" />}
                </motion.div>
                <motion.button 
                  onClick={handleClose} 
                  className="p-2 rounded-xl bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-sm text-slate-400 hover:text-slate-600 dark:text-super-dark-text-secondary dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <motion.h2 
                className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {onboardingSteps[currentStep].title}
              </motion.h2>
              <motion.p 
                className="text-slate-600 dark:text-super-dark-text-secondary leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {onboardingSteps[currentStep].content}
              </motion.p>

              {/* Progress Dots */}
              <motion.div 
                className="flex justify-center gap-3 my-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {onboardingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      currentStep === index 
                        ? 'w-8 bg-gradient-to-r from-brand-orange to-brand-purple shadow-lg' 
                        : 'w-2 bg-slate-300 dark:bg-super-dark-border hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </motion.div>

              {/* Navigation */}
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {currentStep > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 dark:from-super-dark-border dark:to-super-dark-secondary dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-700 dark:text-super-dark-text-primary font-semibold py-3 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm border border-slate-200/60 dark:border-super-dark-border/60 relative overflow-hidden group"
                  >
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    <ArrowLeft size={16} className="relative z-10" />
                    <span className="relative z-10">Anterior</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={currentStep === onboardingSteps.length - 1 ? handleClose : handleNext}
                  className="w-full bg-gradient-to-r from-brand-purple to-brand-orange hover:from-brand-purple/90 hover:to-brand-orange/90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  <span className="relative z-10">{currentStep === onboardingSteps.length - 1 ? 'Finalizar' : 'Próximo'}</span>
                  {currentStep < onboardingSteps.length - 1 && <ArrowRight size={16} className="relative z-10" />}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
