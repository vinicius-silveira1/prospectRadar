import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-super-dark-secondary/50 border-t border-slate-200 dark:border-super-dark-border mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
          {/* Logo e Missão */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center sm:justify-start mb-3 sm:mb-4">
              <img src="/logo.png" alt="ProspectRadar Logo" className="w-8 h-8 mr-2 flex-shrink-0" />
              <h1 className="text-base sm:text-lg font-bold">
                <span className="text-brand-orange">prospect</span>
                <span className="text-brand-purple">Radar</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary leading-relaxed">
              Analisando o futuro do basquete, um prospect de cada vez.
            </p>
          </div>

          {/* Links de Navegação */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-super-dark-text-primary uppercase tracking-wider mb-3 sm:mb-4">Navegação</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link to="/" className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors">Início</Link></li>
              <li><Link to="/prospects" className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors">Prospects</Link></li>
              <li><Link to="/mock-draft" className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors">Mock Draft</Link></li>
              <li><Link to="/about" className="text-xs sm:text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors">Sobre</Link></li>
            </ul>
          </div>

          {/* Social e Contato */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-super-dark-text-primary uppercase tracking-wider mb-3 sm:mb-4">Conecte-se</h3>
            <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
              <a href="#" className="text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-purple transition-colors"><span className="sr-only">GitHub</span><Github size={18} className="sm:w-5 sm:h-5" /></a>
              <a href="#" className="text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-purple transition-colors"><span className="sr-only">Twitter</span><Twitter size={18} className="sm:w-5 sm:h-5" /></a>
              <a href="#" className="text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-purple transition-colors"><span className="sr-only">LinkedIn</span><Linkedin size={18} className="sm:w-5 sm:h-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 dark:border-super-dark-border text-center text-xs sm:text-sm text-slate-500 dark:text-super-dark-text-secondary">
          <p>&copy; {new Date().getFullYear()} prospectRadar. Todos os direitos reservados.</p>
          <p className="mt-1">Feito com 🏀 no Brasil.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
