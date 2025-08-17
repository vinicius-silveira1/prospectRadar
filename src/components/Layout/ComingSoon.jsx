import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowLeft } from 'lucide-react';

const ComingSoon = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg shadow-inner border dark:border-slate-700">
      <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 p-4 rounded-full mb-6">
        <Wrench className="h-12 w-12" />
      </div>
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white mb-2">{title}</h1>
      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md mb-8">
        {message}
      </p>
      <Link
        to="/"
        className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Voltar para o Início
      </Link>
    </div>
  );
};

export default ComingSoon;
