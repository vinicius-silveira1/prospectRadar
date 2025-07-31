import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ArrowLeft } from 'lucide-react';

const ComingSoon = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-gray-50 p-6 rounded-lg shadow-inner">
      <div className="bg-yellow-100 text-yellow-700 p-4 rounded-full mb-6">
        <Wrench className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600 max-w-md mb-8">
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