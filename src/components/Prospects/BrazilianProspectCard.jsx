/**
 * COMPONENTE ESPECIALIZADO PARA PROSPECTS BRASILEIROS DA LDB
 * 
 * Este componente apresenta informações específicas dos prospects
 * brasileiros coletados da Liga de Desenvolvimento de Basquete
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, MapPin, Trophy, Users } from 'lucide-react';
import HighSchoolStatsService from '../../services/HighSchoolStatsService';

const BrazilianProspectCard = ({ prospect, onToggleWatchlist, isRealData = false }) => {
  // Aplicar dados híbridos diretamente no componente
  const enhancedProspect = useMemo(() => {
    if (!prospect) return prospect;
    
    const hsService = new HighSchoolStatsService();
    
    // Verifica se precisa de dados de HS
    const needsHSData = !prospect.stats || 
                        (!prospect.stats.ppg && !prospect.stats.rpg && !prospect.stats.apg) || 
                        (prospect.stats.ppg === 0 && prospect.stats.rpg === 0 && prospect.stats.apg === 0);
    
    const hasHSData = hsService.hasHighSchoolData(prospect.id, prospect.name);
    
    if (needsHSData && hasHSData) {
      const hsData = hsService.getHighSchoolStats(prospect.id, prospect.name);
      
      return {
        ...prospect, // Preserva TUDO
        stats: hsData.stats, // Substitui apenas stats
        dataSource: 'high_school',
        fallbackUsed: true,
        season: hsData.season,
        hsSchool: hsData.school,
        hsAchievements: hsData.achievements,
        displayInfo: {
          sourceBadge: 'High School 2024-25',
          sourceColor: 'bg-orange-100 text-orange-700',
          reliability: 'Dados do último ano de High School'
        }
      };
    }
    
    // Se não precisa de HS, retorna o original
    return {
      ...prospect,
      dataSource: 'college',
      fallbackUsed: false
    };
  }, [prospect]);
  
  // Use enhanced prospect
  const workingProspect = enhancedProspect || prospect;
  
  // Extract hybrid data, with fallback to original prospect data
  const hybridStats = workingProspect?.stats || {};
  const hybridFallbackUsed = workingProspect?.fallbackUsed || false;
  const hybridSchool = workingProspect?.hsSchool || workingProspect?.school || workingProspect?.team;
  const hybridSeason = workingProspect?.season || null;
  // Renderiza ícone de trending baseado no status
  const renderTrendingIcon = () => {
    if (prospect.trending === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (prospect.trending === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  // Cor do badge de posição
  const getPositionColor = (position) => {
    const colors = {
      'PG': 'bg-blue-100 text-blue-800',
      'SG': 'bg-green-100 text-green-800', 
      'SF': 'bg-yellow-100 text-yellow-800',
      'PF': 'bg-orange-100 text-orange-800',
      'C': 'bg-red-100 text-red-800'
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  // Formatação de estatísticas brasileiras
  const formatBrazilianStats = () => {
    if (!hybridStats) return null;
    
    return {
      pontos: parseFloat(hybridStats.ppg || 0).toFixed(1),
      rebotes: parseFloat(hybridStats.rpg || 0).toFixed(1),
      assistencias: parseFloat(hybridStats.apg || 0).toFixed(1),
      aproveitamento: (parseFloat(hybridStats.fg || 0) * 100).toFixed(0)
    };
  };

  const formattedStats = formatBrazilianStats();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header com bandeira e badges */}
      <div className="relative">
        {/* Imagem do prospect */}
        <div className="h-48 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
          {prospect.imageUrl ? (
            <img 
              src={prospect.imageUrl} 
              alt={prospect.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100">
            <div className="text-center">
              <div className="text-4xl mb-2">🏀</div>
              <div className="text-sm font-medium text-gray-600">{prospect.name}</div>
            </div>
          </div>
        </div>

        {/* Badges sobrepostos */}
        <div className="absolute top-2 left-2 flex space-x-2">
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center">
            🇧🇷 BRASIL
          </span>
          {isRealData && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              LDB AO VIVO
            </span>
          )}
        </div>

        {/* Mock Draft Position */}
        <div className="absolute top-2 right-2 bg-white text-gray-800 text-sm px-2 py-1 rounded-full font-bold border">
          #{prospect.mockDraftPosition}
        </div>

        {/* Trending indicator */}
        <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
          {renderTrendingIcon()}
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Nome e informações básicas */}
        <div className="mb-3">
          <Link 
            to={`/prospects/${prospect.id}`}
            className="font-bold text-lg text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer block"
          >
            {prospect.name}
          </Link>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPositionColor(prospect.position)}`}>
                {prospect.position}
              </span>            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {hybridSchool || prospect.school || 'Time LDB'}
            </span>
            </div>
            <span className="text-gray-500">
              {prospect.age} anos
            </span>
          </div>
        </div>

        {/* Informações físicas */}
        <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-600">Altura:</span>
            <span className="font-medium ml-1">{prospect.height}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-600">Peso:</span>
            <span className="font-medium ml-1">{prospect.weight}</span>
          </div>
        </div>

        {/* Estatísticas principais */}
        {formattedStats && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Estatísticas
              {hybridFallbackUsed && (
                <span className="text-orange-600 text-xs ml-2">(High School)</span>
              )}
              {hybridSeason && (
                <span className="text-gray-500 text-xs ml-2">({hybridSeason})</span>
              )}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center bg-blue-50 p-2 rounded">
                <div className="font-bold text-blue-600">{formattedStats.pontos}</div>
                <div className="text-gray-600">PPG</div>
              </div>
              <div className="text-center bg-green-50 p-2 rounded">
                <div className="font-bold text-green-600">{formattedStats.rebotes}</div>
                <div className="text-gray-600">RPG</div>
              </div>
              <div className="text-center bg-yellow-50 p-2 rounded">
                <div className="font-bold text-yellow-600">{formattedStats.assistencias}</div>
                <div className="text-gray-600">APG</div>
              </div>
              <div className="text-center bg-purple-50 p-2 rounded">
                <div className="font-bold text-purple-600">{formattedStats.aproveitamento}%</div>
                <div className="text-gray-600">FG%</div>
              </div>
            </div>
          </div>
        )}

        {/* Liga e origem */}
        <div className="mb-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Liga:</span>
            <span className="font-medium text-green-600">
              {prospect.league || 'LDB - Liga de Desenvolvimento'}
            </span>
          </div>
          {prospect.hometown && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-600">Origem:</span>
              <span className="font-medium flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {prospect.hometown}
              </span>
            </div>
          )}
        </div>

        {/* Pontos fortes */}
        {prospect.strengths && prospect.strengths.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Pontos Fortes</h4>
            <div className="flex flex-wrap gap-1">
              {prospect.strengths.slice(0, 3).map((strength, index) => (
                <span 
                  key={index}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Informações da fonte */}
        <div className="text-xs text-gray-500 mb-3">
          {isRealData ? (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Dados coletados da LDB em tempo real
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Dados curados da LDB
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleWatchlist(prospect.id)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              prospect.watchlisted
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {prospect.watchlisted ? 'Monitorando' : 'Monitorar'}
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Ver Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrazilianProspectCard;
