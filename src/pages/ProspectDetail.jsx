import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Ruler, Weight, Star, TrendingUp, Award, BarChart3, Globe, Heart, Share2, GitCompare, Lightbulb } from 'lucide-react';
import useProspect from '@/hooks/useProspect.js';
import useWatchlist from '@/hooks/useWatchlist.js';
import { useAuth } from '@/context/AuthContext.jsx';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import RadarScoreChart from '@/components/Intelligence/RadarScoreChart.jsx';

const ProspectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prospect, loading, error } = useProspect(id);
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const getWeightDisplay = (weight) => {
    return weight || 'N/A';
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `ProspectRadar: ${prospect.name}`, text: `Confira o perfil completo de ${prospect.name} no ProspectRadar.`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do perfil copiado para a área de transferência!');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="mb-4">Erro ao carregar dados do prospect: {error}</p>
          <button onClick={() => navigate('/prospects')} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Voltar para Prospects</button>
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-slate-400">Prospect não encontrado.</p>
      </div>
    );
  }

  const isInWatchlist = watchlist.has(prospect.id);
  const evaluation = prospect.evaluation || {};
  const advancedStats = prospect.stats?.advanced || {};

  const getPositionColor = (position) => {
    const colors = { 'PG': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', 'SG': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', 'SF': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', 'PF': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', 'C': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
    return colors[position] || 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
  };

  const getTierColor = (tier) => {
    const colors = { 'Elite': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white', 'First Round': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white', 'Second Round': 'bg-gradient-to-r from-green-500 to-green-600 text-white', 'Sleeper': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white', 'Early Second': 'bg-gradient-to-r from-green-500 to-green-600 text-white', 'Late Second': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white' };
    return colors[tier] || 'bg-gray-500 text-white';
  };

  const getStarRating = (prospect) => {
    const rating = prospect.ranking ? Math.max(1, 5 - Math.floor((prospect.ranking - 1) / 10)) : prospect.tier === 'Elite' ? 5 : prospect.tier === 'First Round' ? 4 : prospect.tier === 'Second Round' ? 3 : 2;
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400 dark:text-slate-600'}`} />);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800/50 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/prospects')} className="flex items-center text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para <span className="text-brand-orange font-semibold ml-1">Prospects</span>
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{prospect.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(prospect.position)}`}>{prospect.position}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(evaluation.draftProjection?.description)}`}>{evaluation.draftProjection?.description || prospect.tier}</span>
                <div className="flex items-center">{getStarRating(prospect)}</div>
              </div>
            </div>
            <div className="text-right mt-4 lg:mt-0">
              <div className="text-3xl font-bold text-orange-500">#{prospect.ranking}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Ranking Geral</div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-orange-500" />Informações Básicas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prospect.nationality === '🇧🇷' && <div className="flex items-center"><Globe className="w-5 h-5 text-gray-400 dark:text-slate-500 mr-3" /><div><div className="text-sm text-gray-600 dark:text-slate-400">Nacionalidade</div><div className="font-medium text-gray-800 dark:text-slate-200 flex items-center">🇧🇷 Brasil<span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">BR</span></div></div></div>}
                <div className="flex items-center"><MapPin className="w-5 h-5 text-gray-400 dark:text-slate-500 mr-3" /><div><div className="text-sm text-gray-600 dark:text-slate-400">Time Atual</div><div className="font-medium text-gray-800 dark:text-slate-200">{prospect.team || 'N/A'}</div></div></div>
                <div className="flex items-center"><Calendar className="w-5 h-5 text-gray-400 dark:text-slate-500 mr-3" /><div><div className="text-sm text-gray-600 dark:text-slate-400">Idade</div><div className="font-medium text-gray-800 dark:text-slate-200">{prospect.age} anos</div></div></div>
                <div className="flex items-center"><Ruler className="w-5 h-5 text-gray-400 dark:text-slate-500 mr-3" /><div><div className="text-sm text-gray-600 dark:text-slate-400">Altura</div><div className="font-medium text-gray-800 dark:text-slate-200">{typeof prospect.height === 'object' && prospect.height !== null ? prospect.height.us : prospect.height || 'N/A'}</div></div></div>
                <div className="flex items-center"><Weight className="w-5 h-5 text-gray-400 dark:text-slate-500 mr-3" /><div><div className="text-sm text-gray-600 dark:text-slate-400">Peso</div><div className="font-medium text-gray-800 dark:text-slate-200">{getWeightDisplay(prospect.weight)}</div></div></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-blue-500" />Estatísticas Avançadas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">TS%</span><span className="font-bold text-gray-800 dark:text-slate-200">{(advancedStats['TS%'] * 100)?.toFixed(1) || 'N/A'}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">eFG%</span><span className="font-bold text-gray-800 dark:text-slate-200">{(advancedStats['eFG%'] * 100)?.toFixed(1) || 'N/A'}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">PER</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats.PER?.toFixed(2) || 'N/A'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">USG%</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats['USG%']?.toFixed(1) || 'N/A'}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">ORtg</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats.ORtg?.toFixed(1) || 'N/A'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">DRtg</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats.DRtg?.toFixed(1) || 'N/A'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">TOV%</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats['TOV%']?.toFixed(1) || 'N/A'}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">AST%</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats['AST%']?.toFixed(1) || 'N/A'}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">TRB%</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats['TRB%']?.toFixed(1) || 'N/A'}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">STL%</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats['STL%']?.toFixed(1) || 'N/A'}%</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">BLK%</span><span className="font-bold text-gray-800 dark:text-slate-200">{advancedStats['BLK%']?.toFixed(1) || 'N/A'}%</span></div>
              </div>
            </div>

            {evaluation.totalScore && (
              <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center"><Link to="/radar-score-explained" className="flex items-center hover:text-brand-orange transition-colors"><Lightbulb className="w-5 h-5 mr-2 text-purple-500" />Análise do Radar Score</Link></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div><RadarScoreChart data={evaluation.categoryScores} /></div>
                  <div className="space-y-4">
                    <div><h3 className="font-semibold text-gray-700 dark:text-slate-300">Projeção de Draft</h3><p className="text-lg font-bold text-blue-600 dark:text-blue-400">{evaluation.draftProjection?.description || 'N/A'}</p><p className="text-sm text-gray-500 dark:text-slate-400">Range: {evaluation.draftProjection?.range || 'N/A'}</p></div>
                    <div><h3 className="font-semibold text-gray-700 dark:text-slate-300">Prontidão para a NBA</h3><p className="text-lg font-bold text-green-600 dark:text-green-400">{evaluation.nbaReadiness || 'N/A'}</p></div>
                    <div><h3 className="font-semibold text-gray-700 dark:text-slate-300">Score Total</h3><p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{evaluation.totalScore}</p></div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-orange-500" />Análise do Jogador</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">Pontos Fortes</h3><ul className="space-y-2">{prospect.strengths?.map((strength, index) => <li key={index} className="flex items-start"><div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div><span className="text-gray-700 dark:text-slate-300">{strength}</span></li>)}</ul></div>
                <div><h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">Pontos a Melhorar</h3><ul className="space-y-2">{prospect.weaknesses?.map((weakness, index) => <li key={index} className="flex items-start"><div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div><span className="text-gray-700 dark:text-slate-300">{weakness}</span></li>)}</ul></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Estatísticas</h3><span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded-full font-medium">{prospect.scope || 'N/A'}</span></div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">Pontos por Jogo</span><span className="font-bold text-orange-500">{prospect.ppg?.toFixed(1) || 'N/A'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">Rebotes por Jogo</span><span className="font-bold text-blue-500">{prospect.rpg?.toFixed(1) || 'N/A'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">Assistências por Jogo</span><span className="font-bold text-green-500">{prospect.apg?.toFixed(1) || 'N/A'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">% Field Goal</span><span className="font-bold text-purple-500">{prospect.fg_pct ? `${prospect.fg_pct.toFixed(1)}%` : 'N/A'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-slate-400">% Free Throw</span><span className="font-bold text-red-500">{prospect.ft_pct ? `${prospect.ft_pct.toFixed(1)}%` : 'N/A'}</span></div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Projeção Mock Draft</h3>
              <div className="text-3xl font-bold mb-1">{evaluation.draftProjection?.description || 'N/A'}</div>
              <div className="text-orange-100 text-sm">{evaluation.draftProjection?.range ? `Range: ${evaluation.draftProjection.range}` : 'N/A'}</div>
            </div>
            <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ações</h3>
              <div className="space-y-3">
                <button onClick={() => navigate(`/compare?add=${prospect.id}`)} className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"><GitCompare className="w-4 h-4 mr-2" />Comparar Jogador</button>
                {user && <button onClick={() => toggleWatchlist(prospect.id)} className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${isInWatchlist ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}><Heart className={`w-4 h-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />{isInWatchlist ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}</button>}
                <button onClick={handleShare} className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"><Share2 className="w-4 h-4 mr-2" />Compartilhar Perfil</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetail;