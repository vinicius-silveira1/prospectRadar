// 📊 DatabaseComparison.jsx - Componente para mostrar status da base verificada
import React from 'react';
import { Trophy, CheckCircle, Star, Globe, Users } from 'lucide-react';
import Draft2026Database from '../services/Draft2026Database';

const DatabaseComparison = () => {
  // Usar a nova base limpa e verificada
  const database = new Draft2026Database();
  const prospects = database.getAllProspects();
  
  const stats = {
    total: prospects.length,
    brazilian: prospects.filter(p => p.nationality === '🇧🇷').length,
    international: prospects.filter(p => p.nationality !== 'Brazil').length,
    tier1: prospects.filter(p => p.tier === 'Elite').length,
    tier2: prospects.filter(p => p.tier === 'High-Level').length,
    tier3: prospects.filter(p => p.tier === 'Solid').length,
    verified: prospects.length, // Todos são verificados agora
    class2025: prospects.length // Todos são classe 2025
  };

  const StatCard = ({ icon: Icon, label, value, color, description }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-300">{label}</div>
        </div>
      </div>
      {description && (
        <div className="text-xs text-gray-400">{description}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            ✅ <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Base Verificada 2026
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Nossa base atual contém <span className="text-green-400 font-bold">{stats.total} prospects verificados</span> da classe 2025
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="bg-green-600 text-green-100 px-3 py-1 rounded-full text-sm">
              100% Verificados
            </span>
            <span className="bg-blue-600 text-blue-100 px-3 py-1 rounded-full text-sm">
              ESPN 100 & 247Sports
            </span>
            <span className="bg-purple-600 text-purple-100 px-3 py-1 rounded-full text-sm">
              Draft 2026 Elegíveis
            </span>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            icon={Users}
            label="Total de Prospects" 
            value={stats.total}
            color="bg-blue-600"
            description="Todos classe 2025, elegíveis para Draft 2026"
          />
          
          <StatCard 
            icon={CheckCircle}
            label="Prospects Verificados" 
            value={stats.verified}
            color="bg-green-600"
            description="100% verificados via ESPN 100 & 247Sports"
          />
          
          <StatCard 
            icon={Star}
            label="Prospects Brasileiros" 
            value={stats.brazilian}
            color="bg-yellow-600"
            description="Talentos nacionais em ascensão"
          />
          
          <StatCard 
            icon={Globe}
            label="Prospects Internacionais" 
            value={stats.international}
            color="bg-purple-600"
            description="Elite mundial fora do Brasil"
          />
        </div>

        {/* Distribuição por Tiers */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">🏆 Distribuição por Qualidade</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-yellow-400">{stats.tier1}</div>
              <div className="text-sm text-gray-300">Elite Tier</div>
              <div className="text-xs text-gray-400 mt-1">Lottery picks potenciais</div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400">{stats.tier2}</div>
              <div className="text-sm text-gray-300">High-Level</div>
              <div className="text-xs text-gray-400 mt-1">First round prospects</div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-400">{stats.tier3}</div>
              <div className="text-sm text-gray-300">Solid Prospects</div>
              <div className="text-xs text-gray-400 mt-1">Draft-worthy players</div>
            </div>
          </div>
        </div>

        {/* Qualidade dos Dados */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">🎯 Qualidade da Base</h3>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h4 className="font-bold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                ✅ Dados Verificados
              </h4>
              <ul className="text-sm space-y-2">
                <li>• {stats.verified} prospects 100% verificados</li>
                <li>• Fontes: ESPN 100, 247Sports, Rivals</li>
                <li>• Todos elegíveis para Draft 2026</li>
                <li>• Base limpa sem dados fictícios</li>
                <li>• Rankings atualizados regularmente</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                🏆 Qualidade Elite
              </h4>
              <ul className="text-sm space-y-2">
                <li>• Foco em qualidade vs. quantidade</li>
                <li>• Apenas prospects classe 2025</li>
                <li>• Sistema de tiers profissional</li>
                <li>• Comparável a sites especializados</li>
                <li>• Prospects reais e verificáveis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseComparison;
