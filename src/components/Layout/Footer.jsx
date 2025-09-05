import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import BetaBadge from '../Common/BetaBadge';

const Footer = () => {
  const navigationLinks = [
    { to: "/", label: "Início" },
    { to: "/prospects", label: "Prospects" },
    { to: "/mock-draft", label: "Mock Draft" },
    { to: "/about", label: "Sobre" }
  ];

  const socialLinks = [
    { href: "#", icon: Github, label: "GitHub", color: "hover:text-gray-600" },
    { href: "#", icon: Twitter, label: "Twitter", color: "hover:text-blue-400" },
    { href: "#", icon: Linkedin, label: "LinkedIn", color: "hover:text-blue-600" }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 to-white dark:from-super-dark-primary dark:to-super-dark-secondary border-t border-slate-200/60 dark:border-super-dark-border/60 mt-auto overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="footerPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" fill="currentColor" className="text-brand-purple/20" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#footerPattern)" />
        </svg>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 via-transparent to-brand-purple/5" />

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Logo e Missão */}
          <motion.div 
            className="sm:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center sm:justify-start mb-4">
              <motion.img 
                src="src\assets\logo.png" 
                alt="prospectRadar Logo" 
                className="w-16 h-16 mr-3 flex-shrink-0" 
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.h1 
                className="text-lg font-black tracking-tight flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div>
                  <span className="text-brand-orange font-black">prospect</span>
                  <span className="text-brand-purple font-black italic">Radar</span>
                </div>
                <BetaBadge size="xs" />
              </motion.h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary leading-relaxed max-w-xs mx-auto sm:mx-0">
              Analisando o futuro do basquete, um prospect de cada vez. 
              <br />
              <span className="text-brand-orange font-semibold">Dados precisos. Análises profundas.</span>
            </p>
          </motion.div>

          {/* Links de Navegação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-super-dark-text-primary uppercase tracking-wider mb-4 flex items-center justify-center sm:justify-start gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-brand-orange to-brand-purple rounded-full"></div>
              Navegação
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link, index) => (
                <motion.li 
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    to={link.to} 
                    className="text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-all duration-300 group inline-flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-slate-400 dark:bg-super-dark-text-secondary rounded-full group-hover:bg-brand-orange transition-colors"></span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social e Contato */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-super-dark-text-primary uppercase tracking-wider mb-4 flex items-center justify-center sm:justify-start gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-brand-purple to-brand-orange rounded-full"></div>
              Conecte-se
            </h3>
            <div className="flex space-x-4 justify-center sm:justify-start">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className={`p-2 rounded-xl bg-white/80 dark:bg-super-dark-primary/80 backdrop-blur-sm text-slate-500 dark:text-super-dark-text-secondary ${social.color} transition-all duration-300 shadow-md hover:shadow-lg group`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="sr-only">{social.label}</span>
                    <IconComponent size={18} className="group-hover:scale-110 transition-transform" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-8 pt-6 border-t border-slate-200/60 dark:border-super-dark-border/60 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-sm text-slate-500 dark:text-super-dark-text-secondary mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            &copy; {new Date().getFullYear()} prospectRadar. Todos os direitos reservados.
          </motion.p>
          <motion.p 
            className="text-sm text-slate-600 dark:text-super-dark-text-secondary flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            Feito com 
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                color: ["#f97316", "#a855f7", "#f97316"]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block"
            >
              <Heart className="w-4 h-4 fill-current" />
            </motion.span>
            e 🏀 no Brasil.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
