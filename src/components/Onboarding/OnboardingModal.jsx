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
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-super-dark-secondary rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden border border-slate-200 dark:border-super-dark-border"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand-purple/10 dark:bg-brand-purple/20 rounded-full">
                  {Icon && <Icon className="h-8 w-8 text-brand-purple" />} {/* Usando a variável */}
                </div>
                <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 dark:text-super-dark-text-secondary dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {onboardingSteps[currentStep].title}
              </h2>
              <p className="text-slate-600 dark:text-super-dark-text-secondary leading-relaxed">
                {onboardingSteps[currentStep].content}
              </p>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 my-6">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      currentStep === index ? 'w-6 bg-brand-purple' : 'bg-slate-300 dark:bg-super-dark-border'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                {currentStep > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-2 w-full bg-slate-200 hover:bg-slate-300 dark:bg-super-dark-border dark:hover:bg-slate-700 text-slate-700 dark:text-super-dark-text-primary font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Anterior
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={currentStep === onboardingSteps.length - 1 ? handleClose : handleNext}
                  className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {currentStep === onboardingSteps.length - 1 ? 'Finalizar' : 'Próximo'}
                  {currentStep < onboardingSteps.length - 1 && <ArrowRight size={16} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
