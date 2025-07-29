import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Ruler, Weight, Star, TrendingUp, Award, BarChart3, Globe } from 'lucide-react';
import useProspect from '@/hooks/useProspect.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';

const ProspectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prospect, loading, error } = useProspect(id);

  // CONDIÇÕES DE RETORNO APÓS TODOS OS HOOKS
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="mb-4">Erro ao carregar dados do prospect: {error}</p>
          <button 
            onClick={() => navigate('/prospects')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Voltar para Prospects
          </button>
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Prospect não encontrado.</p>
      </div>
    );
  }

  const getPositionColor = (position) => {
    const colors = {
      'PG': 'bg-blue-100 text-blue-800',
      'SG': 'bg-green-100 text-green-800',
      'SF': 'bg-yellow-100 text-yellow-800',
      'PF': 'bg-purple-100 text-purple-800',
      'C': 'bg-red-100 text-red-800'
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  const getTierColor = (tier) => {
    const colors = {
      'Elite': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      'First Round': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      'Second Round': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      'Sleeper': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
    };
    return colors[tier] || 'bg-gray-500 text-white';
  };

  const getStarRating = (prospect) => {
    // Usar ESPN grade para calcular rating de estrelas
    const rating = prospect.ranking ? Math.max(1, 5 - Math.floor((prospect.ranking - 1) / 10)) : // Simple rank-based rating
                   prospect.tier === 'Elite' ? 5 :
                   prospect.tier === 'Elite' ? 5 :
                   prospect.tier === 'First Round' ? 4 :
                   prospect.tier === 'Second Round' ? 3 : 2;
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => navigate('/prospects')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para <span className="text-brand-orange font-semibold ml-1">Prospects</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{prospect.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(prospect.position)}`}>
                    {prospect.position}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(prospect.tier)}`}>
                    {prospect.tier}
                  </span>
                  <div className="flex items-center">
                    {getStarRating(prospect)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right mt-4 lg:mt-0">
              <div className="text-3xl font-bold text-orange-500">#{prospect.ranking}</div>
              <div className="text-sm text-gray-600">Ranking Geral</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-orange-500" />
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prospect.nationality === 'BR' && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Nacionalidade</div>
                      <div className="font-medium flex items-center">
                        🇧🇷 Brasil
                        <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">BR</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Escola/College</div>
                    <div className="font-medium">{prospect.high_school_team || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Idade</div>
                    <div className="font-medium">{prospect.age} anos</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Ruler className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Altura</div>
                    <div className="font-medium">
                      {typeof prospect.height === 'object' && prospect.height !== null ? prospect.height.us : prospect.height || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Weight className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Peso</div>
                    <div className="font-medium">
                      {(() => {
                        try {
                          const parsedWeight = JSON.parse(prospect.weight);
                          return `${parsedWeight.us} lbs`;
                        } catch (e) {
                          return prospect.weight || 'N/A';
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                Análise do Jogador
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-3">Pontos Fortes</h3>
                  <ul className="space-y-2">
                    {prospect.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-3">Pontos a Melhorar</h3>
                  <ul className="space-y-2">
                    {prospect.weaknesses?.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Projection */}
            {(prospect.mockDraftRange || prospect.tier) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
                  Projeção para o Draft
                </h2>
                <div className="space-y-3">
                  {prospect.mockDraftRange && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Range Esperado:</span> Picks {prospect.mockDraftRange}
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="font-semibold">Categoria:</span> {prospect.tier}
                  </p>
                  {prospect.eligibilityStatus && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Status:</span> {prospect.eligibilityStatus}
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Estatísticas</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  High School
                </span>
              </div>                <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pontos por Jogo</span>
                  <span className="font-bold text-orange-500">{prospect.ppg?.toFixed(1) || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rebotes por Jogo</span>
                  <span className="font-bold text-blue-500">{prospect.rpg?.toFixed(1) || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Assistências por Jogo</span>
                  <span className="font-bold text-green-500">{prospect.apg?.toFixed(1) || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">% Field Goal</span>
                  <span className="font-bold text-purple-500">{prospect.fg_pct ? `${prospect.fg_pct.toFixed(1)}%` : 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">% Free Throw</span>
                  <span className="font-bold text-red-500">{prospect.ft_pct ? `${prospect.ft_pct.toFixed(1)}%` : 'N/A'}</span>
                </div>
                
                {prospect.espnGrade && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ESPN Grade</span>
                      <span className="font-bold text-yellow-500">{prospect.espnGrade}/100</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mock Draft Position */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Projeção Mock Draft</h3>
              <div className="text-3xl font-bold mb-1">Pick #{prospect.ranking || 'N/A'}</div>
              <div className="text-orange-100 text-sm">
                {prospect.tier === 'Elite' ? 'Lottery Pick' : 
                 prospect.tier === 'First Round' ? 'First Round' :
                 prospect.tier === 'Second Round' ? 'Second Round' : 
                 'Undrafted/International'}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ações</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate(`/compare?players=${prospect.id}`)}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Comparar Jogador
                </button>
                
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Adicionar à Watchlist
                </button>
                
                <button className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">
                  Compartilhar Perfil
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetail;
