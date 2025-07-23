/**
 * CARD PARA JOGADORES REAIS VERIFICADOS
 * Mostra dados autênticos coletados de fontes oficiais
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Users, CheckCircle, Shield, Globe, Award, Verified } from 'lucide-react';
import useHybridProspect from '../../hooks/useHybridProspect';

const MultiSourceProspectCard = ({ 
  prospect, 
  onExpand, 
  isExpanded, 
  onToggleWatchlist,
  showVerification = false,
  showTrending = false,
  showSource = false,
  actionButton = null // { text, onClick, icon, className }
}) => {
  // Aplica o hook de dados híbridos para obter a versão mais completa do prospect
  const enhancedProspect = useHybridProspect(prospect);
  
  // Use enhanced prospect
  const workingProspect = enhancedProspect || prospect;
  
  // Extract hybrid data, with fallback to original prospect data
  const hybridStats = workingProspect?.stats || {};
  const hybridDisplayInfo = workingProspect?.displayInfo || {};
  const hybridFallbackUsed = workingProspect?.fallbackUsed || false;
  const hybridSchool = workingProspect?.hsSchool || workingProspect?.school || workingProspect?.team;
  const hybridSeason = workingProspect?.season || null;

  const {
    name = prospect.name,
    age = prospect.age,
    position = prospect.position,
    team = hybridSchool || prospect.team,
    height = prospect.height,
    achievements = prospect.achievements || [],
    source = prospect.source,
    isReal = prospect.isReal,
    verified = prospect.verified,
    trending,
    mockDraftPosition,
    prospectScore,
    isProspect,
    country,
    nationality,
    draftClass,
    projectedDraftPosition,
    prospectRank
  } = prospect;

  // Cor do trending
  const getTrendingColor = () => {
    if (trending === 'hot') return 'text-red-500 bg-red-100';
    if (trending === 'rising') return 'text-orange-500 bg-orange-100';
    return 'text-gray-500 bg-gray-100';
  };

  // Ícone do trending
  const getTrendingIcon = () => {
    if (trending === 'hot') return '🔥';
    if (trending === 'rising') return '📈';
    return '➡️';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-brand-orange transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Header com verificação */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Link 
                to={`/prospects/${prospect?.id || id}`}
                className="font-bold text-lg text-gray-900 truncate hover:text-blue-600 transition-colors cursor-pointer"
              >
                {name}
              </Link>
              {verified && showVerification && (
                <Verified className="h-4 w-4 text-green-600" title="Dados Verificados" />
              )}
              {isReal && (
                <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  REAL
                </div>
              )}
              {hybridDisplayInfo?.sourceBadge && (
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                  hybridDisplayInfo.sourceColor || 'bg-blue-100 text-blue-700'
                }`}>
                  {hybridDisplayInfo.sourceBadge}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{position}</span>
              <span>•</span>
              <span>{hybridSchool || team}</span>
              {age && (
                <>
                  <span>•</span>
                  <span>{age} anos</span>
                </>
              )}
              {country && (
                <>
                  <span>•</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                    {country}
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {height && typeof height === 'object' ? `${height.us} (${height.intl} cm)` : height} 
              {hybridSeason && ` • Temporada ${hybridSeason}`}
              {showSource && source && ` • ${source}`}
              {draftClass && ` • Draft ${draftClass}`}
              {hybridFallbackUsed && (
                <span className="text-orange-600 font-medium"> • Dados HS</span>
              )}
            </div>
          </div>
          
          {/* Draft Position e Trending */}
          <div className="flex flex-col items-end space-y-1">
            {(prospectRank || mockDraftPosition || projectedDraftPosition) && (
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {prospectRank ? `#${prospectRank}` : 
                   projectedDraftPosition ? `#${projectedDraftPosition}` :
                   `#${mockDraftPosition}`}
                </div>
                <div className="text-xs text-gray-500">
                  {prospectRank ? 'Ranking' :
                   projectedDraftPosition ? 'Proj. Draft' :
                   'Draft'}
                </div>
              </div>
            )}
            {showTrending && trending && trending !== 'stable' && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendingColor()}`}>
                {getTrendingIcon()} {trending.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats principais */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-900">{hybridStats.ppg || 0}</div>
            <div className="text-xs text-gray-600">PPG</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-900">{hybridStats.rpg || 0}</div>
            <div className="text-xs text-gray-600">RPG</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-900">{hybridStats.apg || 0}</div>
            <div className="text-xs text-gray-600">APG</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-900">
              {hybridStats.fg_pct ? (hybridStats.fg_pct * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-gray-600">FG%</div>
          </div>
        </div>

        {/* Prospect Score */}
        {prospectScore && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Pontuação Prospect</span>
              <span className="text-sm font-bold text-blue-600">{prospectScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${prospectScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-1 mb-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Conquistas</span>
            </div>
            <div className="space-y-1">
              {achievements.slice(0, 2).map((achievement, index) => (
                <div key={index} className="text-xs text-gray-600 bg-yellow-50 px-2 py-1 rounded">
                  {achievement}
                </div>
              ))}
              {achievements.length > 2 && (
                <div className="text-xs text-gray-500 italic">
                  +{achievements.length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Badges de qualidade */}
        <div className="flex flex-wrap gap-1 mt-3">
          {isProspect && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              PROSPECT
            </span>
          )}
          {country && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
              {country === 'USA' ? '🇺🇸 USA' : 
               country === 'France' ? '🇫🇷 FRA' :
               country === 'Spain' ? '🇪🇸 ESP' :
               `🌍 ${country}`}
            </span>
          )}
          {!country && nationality && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
              {nationality === '🇺🇸' ? '🇺🇸 USA' : 
               nationality === '🇧🇷' ? '🇧🇷 BRASIL' :
               nationality === '🇫🇷' ? '🇫🇷 FRANÇA' :
               nationality === '🇪🇸' ? '🇪🇸 ESPANHA' :
               nationality === '🇷🇺' ? '🇷🇺 RÚSSIA' :
               nationality === '🇮🇹' ? '🇮🇹 ITÁLIA' :
               nationality === '🇵🇹' ? '🇵🇹 PORTUGAL' :
               nationality === '🇷🇸' ? '🇷🇸 SÉRVIA' :
               nationality === '🇮🇳' ? '🇮🇳 ÍNDIA' :
               nationality === '🇬🇭' ? '🇬🇭 GANA' :
               nationality === '🇨🇦' ? '🇨🇦 CANADÁ' :
               `${nationality} INTERNACIONAL`}
            </span>
          )}
          {!country && !nationality && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
              🌍 INTERNACIONAL
            </span>
          )}
          {verified && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              VERIFICADO
            </span>
          )}
          {prospectRank && prospectRank <= 5 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
              TOP 5
            </span>
          )}
          {source && showSource && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
              {source.split('/')[0]}
            </span>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onExpand && onExpand(prospect)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            {isExpanded ? 'Menos Detalhes' : 'Ver Detalhes'}
          </button>
          <button
            onClick={() => onToggleWatchlist && onToggleWatchlist(prospect.id)}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
          >
            <Star className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Detalhes expandidos */}
      {isExpanded && (
        <div className="border-t bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Stats Avançadas</h4>
              {hybridStats.three_pct && (
                <div className="flex justify-between">
                  <span className="text-gray-600">3P%:</span>
                  <span className="font-medium">{(hybridStats.three_pct * 100).toFixed(1)}%</span>
                </div>
              )}
              {hybridStats.ft_pct && (
                <div className="flex justify-between">
                  <span className="text-gray-600">FT%:</span>
                  <span className="font-medium">{(hybridStats.ft_pct * 100).toFixed(1)}%</span>
                </div>
              )}
              {hybridStats.bpg && (
                <div className="flex justify-between">
                  <span className="text-gray-600">BPG:</span>
                  <span className="font-medium">{hybridStats.bpg}</span>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informações</h4>
              <div className="flex justify-between">
                <span className="text-gray-600">Fonte:</span>
                <span className="font-medium">{source || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${verified ? 'text-green-600' : 'text-gray-600'}`}>
                  {verified ? 'Verificado' : 'Não verificado'}
                </span>
              </div>
              {trending && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tendência:</span>
                  <span className="font-medium">{trending}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Botão de Ação Customizado */}
      {actionButton && (
        <div className="px-4 pb-4">
          <button
            onClick={actionButton.onClick}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              actionButton.className || 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {actionButton.icon && <span>{actionButton.icon}</span>}
            <span>{actionButton.text}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiSourceProspectCard;
