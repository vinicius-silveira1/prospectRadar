import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-super-dark-secondary/50 border-t border-slate-200 dark:border-super-dark-border mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Logo e Missão */}
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img src="/logo.svg" alt="ProspectRadar Logo" className="w-8 h-8 mr-2" />
              <h1 className="text-lg font-bold">
                <span className="text-brand-orange">prospect</span>
                <span className="text-brand-cyan">Radar</span>
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary">
              Analisando o futuro do basquete, um prospect de cada vez.
            </p>
          </div>

          {/* Links de Navegação */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-super-dark-text-primary uppercase tracking-wider mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors">Início</Link></li>
              <li><Link to="/prospects" className="text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors">Prospects</Link></li>
              <li><Link to="/draft" className="text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors">Mock Draft</Link></li>
              <li><Link to="/about" className="text-sm text-slate-600 dark:text-super-dark-text-secondary hover:text-brand-orange transition-colors">Sobre</Link></li>
            </ul>
          </div>

          {/* Social e Contato */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-super-dark-text-primary uppercase tracking-wider mb-4">Conecte-se</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-cyan transition-colors"><span className="sr-only">GitHub</span><Github size={20} /></a>
              <a href="#" className="text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-cyan transition-colors"><span className="sr-only">Twitter</span><Twitter size={20} /></a>
              <a href="#" className="text-slate-500 dark:text-super-dark-text-secondary hover:text-brand-cyan transition-colors"><span className="sr-only">LinkedIn</span><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-super-dark-border text-center text-sm text-slate-500 dark:text-super-dark-text-secondary">
          <p>&copy; {new Date().getFullYear()} ProspectRadar. Todos os direitos reservados.</p>
          <p className="mt-1">Feito com 🏀 no Brasil.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
