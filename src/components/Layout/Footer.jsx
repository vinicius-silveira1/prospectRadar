import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      className="relative bg-white dark:bg-super-dark-secondary/50 border-t border-slate-200 dark:border-super-dark-border mt-auto overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Hexagonal pattern background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hexPattern-footer" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
            <polygon points="12.5,2 23,8 23,17 12.5,23 2,17 2,8" fill="currentColor" className="text-brand-purple/20" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexPattern-footer)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
          {/* Logo e Missão */}
          <motion.div 
            className="sm:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center justify-center sm:justify-start mb-3 sm:mb-4 group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.img 
                src="/logo.png" 
                alt="ProspectRadar Logo" 
                className="w-8 h-8 mr-2 flex-shrink-0" 
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <h1 className="text-base sm:text-lg font-bold">
                <span className="text-brand-orange">prospect</span>
                <span className="text-brand-purple">Radar</span>
              </h1>
            </motion.div>
            <motion.p 
              className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary leading-relaxed"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Analisando o futuro do basquete, um prospect de cada vez.
            </motion.p>
          </motion.div>

          {/* Links de Navegação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.h3 
              className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-super-dark-text-primary uppercase tracking-wider mb-3 sm:mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Navegação
            </motion.h3>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { to: "/", label: "Início" },
                { to: "/prospects", label: "Prospects" },
                { to: "/mock-draft", label: "Mock Draft" },
                { to: "/about", label: "Sobre" }
              ].map((link, index) => (
                <motion.li 
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social e Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.h3 
              className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-super-dark-text-primary uppercase tracking-wider mb-3 sm:mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Conecte-se
            </motion.h3>
            <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
              {[
                { href: "#", icon: Github, label: "GitHub" },
                { href: "#", icon: Twitter, label: "Twitter" },
                { href: "#", icon: Linkedin, label: "LinkedIn" }
              ].map((social, index) => (
                <motion.a 
                  key={social.label}
                  href={social.href} 
                  className="text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-purple transition-colors"
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 5,
                    boxShadow: "0 0 15px rgba(168, 85, 247, 0.3)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon size={18} className="sm:w-5 sm:h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 dark:border-super-dark-border text-center text-xs sm:text-sm text-slate-500 dark:text-super-dark-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.p
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            &copy; {new Date().getFullYear()} prospectRadar. Todos os direitos reservados.
          </motion.p>
          <motion.p 
            className="mt-1"
            animate={{ 
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            Feito com 🏀 no Brasil.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
