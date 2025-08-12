import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Ruler, Weight, Star, TrendingUp, Award, BarChart3, Globe, Heart, Share2, GitCompare, Lightbulb, Clock, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import useProspect from '@/hooks/useProspect.js';
import useWatchlist from '@/hooks/useWatchlist.js';
import { useAuth } from '@/context/AuthContext.jsx';
import useProspectImage from '@/hooks/useProspectImage.js'; // Added back
import { getInitials, getColorFromName } from '../utils/imageUtils.js';
import LoadingSpinner from '@/components/Layout/LoadingSpinner.jsx';
import RadarScoreChart from '@/components/Intelligence/RadarScoreChart.jsx';
import AdvancedStatsExplanation from '@/components/Common/AdvancedStatsExplanation.jsx';


const AwaitingStats = ({ prospectName }) => (
  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6 text-center">
    <Clock className="mx-auto h-10 w-10 text-blue-500 mb-4" />
    <h3 className="text-lg font-bold text-slate-900 dark:text-super-dark-text-primary">Aguardando Início da Temporada</h3>
    <p className="text-sm text-slate-600 dark:text-super-dark-text-secondary mt-2">
      As estatísticas detalhadas e a análise do Radar Score para {prospectName} serão geradas assim que a temporada 2025-26 começar.
    </p>
  </div>
);

const ProspectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { prospect, loading, error } = useProspect(id);
  const { user } = useAuth();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { imageUrl, isLoading } = useProspectImage(prospect?.id, prospect?.image_url);

  const getWeightDisplay = (weight) => {
    if (typeof weight === 'object' && weight !== null) {
      return `${weight.us} lbs (${weight.intl} kg)`;
    }
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
    return <div className="min-h-screen bg-gray-50 dark:bg-super-dark-primary flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-super-dark-primary flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="mb-4">Erro ao carregar dados do prospect: {error}</p>
          <button onClick={() => navigate('/prospects')} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Voltar para Prospects</button>
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-super-dark-primary flex items-center justify-center">
        <p className="text-gray-600 dark:text-super-dark-text-secondary">Prospect não encontrado.</p>
      </div>
    );
  }

  const isInWatchlist = watchlist.has(prospect.id);
  const evaluation = prospect.evaluation || {};
  const flags = evaluation.flags || [];
  const comparablePlayers = evaluation.comparablePlayers || [];
  const hasStats = prospect.ppg > 0;

  // CORREÇÃO: Movido para o local correto
  const fgPercentage = (prospect.two_pt_attempts + prospect.three_pt_attempts) > 0 
    ? (((prospect.two_pt_makes + prospect.three_pt_makes) / (prospect.two_pt_attempts + prospect.three_pt_attempts)) * 100).toFixed(1) 
    : 'N/A';

  const ftPercentage = prospect.ft_attempts > 0 
    ? ((prospect.ft_makes / prospect.ft_attempts) * 100).toFixed(1) 
    : 'N/A';

  const getPositionColor = (position) => {
    const colors = { 'PG': 'bg-blue-100 text-blue-800 dark:bg-black/50 dark:text-blue-300', 'SG': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', 'SF': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', 'PF': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', 'C': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };
    return colors[position] || 'bg-gray-100 text-gray-800 dark:bg-super-dark-secondary dark:text-super-dark-text-secondary';
  };

  const getTierColor = (tier) => {
    const colors = { 'Elite': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white', 'First Round': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white', 'Second Round': 'bg-gradient-to-r from-green-500 to-green-600 text-white', 'Sleeper': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white', 'Early Second': 'bg-gradient-to-r from-green-500 to-green-600 text-white', 'Late Second': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white' };
    return colors[tier] || 'bg-gray-500 text-white';
  };

  const getStarRating = (prospect) => {
    const rating = prospect.ranking ? Math.max(1, 5 - Math.floor((prospect.ranking - 1) / 10)) : prospect.tier === 'Elite' ? 5 : prospect.tier === 'First Round' ? 4 : prospect.tier === 'Second Round' ? 3 : 2;
    return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400 dark:text-super-dark-text-secondary'}`} />);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-super-dark-primary">
      <div className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 dark:from-brand-navy dark:via-purple-800 dark:to-brand-dark text-white shadow-lg overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <button onClick={() => navigate('/prospects')} className="flex items-center text-blue-100 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para <span className="text-yellow-300 font-semibold ml-1">Prospects</span>
          </button>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Prospect Image */}
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold" style={{ backgroundColor: prospect ? getColorFromName(prospect.name) : '#ccc' }}>
              {isLoading ? (
                <div className="w-full h-full bg-slate-300 dark:bg-slate-600 animate-pulse"></div>
              ) : imageUrl ? (
                <img src={imageUrl} alt={prospect.name} className="w-full h-full object-cover object-top" />
              ) : (
                <span className="text-white">{prospect ? getInitials(prospect.name) : ''}</span>
              )}
            </div>

            {/* Prospect Info */}
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white mb-2">{prospect.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(prospect.position)}`}>{prospect.position}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(evaluation.draftProjection?.description)}`}>{evaluation.draftProjection?.description || prospect.tier}</span>
                <div className="flex items-center">{getStarRating(prospect)}</div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-blue-100 text-lg">
                <div className="flex items-center"><MapPin className="w-5 h-5 mr-2" />{prospect.team || 'N/A'}</div>
                <div className="flex items-center"><Calendar className="w-5 h-5 mr-2" />{prospect.age} anos</div>
                <div className="flex items-center"><Ruler className="w-5 h-5 mr-2" />{typeof prospect.height === 'object' && prospect.height !== null ? prospect.height.us : prospect.height || 'N/A'}</div>
                <div className="flex items-center"><Weight className="w-5 h-5 mr-2" />{getWeightDisplay(prospect.weight)}</div>
              </div>
            </div>

            </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-orange-500" />Informações Básicas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prospect.nationality === '🇧🇷' && <div className="flex items-center"><Globe className="w-5 h-5 text-gray-400 dark:text-super-dark-text-secondary mr-3" /><div><div className="text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Nacionalidade</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary flex items-center">🇧🇷 Brasil<span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-bold">BR</span></div></div></div>}
                <div className="flex items-center"><MapPin className="w-5 h-5 text-gray-400 dark:text-super-dark-text-secondary mr-3" /><div><div className="text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Time Atual</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary">{prospect.team || 'N/A'}</div></div></div>
                <div className="flex items-center"><Calendar className="w-5 h-5 text-gray-400 dark:text-super-dark-text-secondary mr-3" /><div><div className="text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Idade</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary">{prospect.age} anos</div></div></div>
                <div className="flex items-center"><Ruler className="w-5 h-5 text-gray-400 dark:text-super-dark-text-secondary mr-3" /><div><div className="text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Altura</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary">{typeof prospect.height === 'object' && prospect.height !== null ? prospect.height.us : prospect.height || 'N/A'}</div></div></div>
                <div className="flex items-center"><Weight className="w-5 h-5 text-gray-400 dark:text-super-dark-text-secondary mr-3" /><div><div className="text-sm leading-normal text-gray-600 dark:text-super-dark-text-secondary">Peso</div><div className="font-medium text-gray-800 dark:text-super-dark-text-primary">{getWeightDisplay(prospect.weight)}</div></div></div>
              </div>
            </div>

            {hasStats ? (
              <>
                <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-blue-500" />Estatísticas Avançadas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Helper function for stat display with progress bar */}
                    {(() => {
                      const renderStat = (label, value, colorClass, isPercentage = true) => (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-super-dark-text-secondary leading-normal">{label}</span>
                          <span className={`font-bold ${colorClass}`}>{value !== 'N/A' ? `${value}${isPercentage ? '%' : ''}` : 'N/A'}</span>
                        </div>
                      );

                      return (
                        <>
                          {renderStat('TS%', (prospect.ts_percent * 100)?.toFixed(1), 'text-cyan-500')}
                          {renderStat('eFG%', (prospect.efg_percent * 100)?.toFixed(1), 'text-teal-500')}
                          {renderStat('PER', prospect.per?.toFixed(2), 'text-indigo-500', false)}
                          {renderStat('USG%', prospect.usg_percent?.toFixed(1), 'text-pink-500')}
                          {renderStat('ORtg', prospect.ortg?.toFixed(1), 'text-lime-500', false)}
                          {renderStat('DRtg', prospect.drtg?.toFixed(1), 'text-red-500', false)}
                          {renderStat('TOV%', prospect.tov_percent?.toFixed(1), 'text-orange-500')}
                          {renderStat('AST%', prospect.ast_percent?.toFixed(1), 'text-green-500')}
                          {renderStat('TRB%', prospect.trb_percent?.toFixed(1), 'text-blue-500')}
                          {renderStat('STL%', prospect.stl_percent?.toFixed(1), 'text-purple-500')}
                          {renderStat('BLK%', prospect.blk_percent?.toFixed(1), 'text-yellow-500')}
                        </>
                      );
                    })()}
                  </div>
                </div>
                <AdvancedStatsExplanation />

                {evaluation.categoryScores && (
                  <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4 flex items-center"><Link to="/radar-score-explained" className="flex items-center hover:text-brand-orange transition-colors"><Lightbulb className="w-5 h-5 mr-2 text-purple-500" />Análise do Radar Score</Link></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div><RadarScoreChart data={evaluation.categoryScores} /></div>
                      <div className="space-y-4">
                        <div><h3 className="font-semibold text-gray-700 dark:text-super-dark-text-primary leading-normal">Projeção de Draft</h3><p className="text-lg font-bold text-blue-600 dark:text-blue-400">{evaluation.draftProjection?.description || 'N/A'}</p><p className="text-sm text-gray-500 dark:text-super-dark-text-secondary">Alcance: {evaluation.draftProjection?.range || 'N/A'}</p></div>
                        <div><h3 className="font-semibold text-gray-700 dark:text-super-dark-text-primary leading-normal">Prontidão para a NBA</h3><p className="text-lg font-bold text-green-600 dark:text-green-400">{evaluation.nbaReadiness || 'N/A'}</p></div>
                        <div>
                          <h3 className="font-semibold text-gray-700 dark:text-super-dark-text-primary leading-normal">Score Total (Potencial)</h3>
                          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{evaluation.potentialScore}</p>
                        </div>

                        {evaluation.confidenceScore < 1.0 && (
                          <div>
                            <h3 className="font-semibold text-gray-700 dark:text-super-dark-text-primary leading-normal flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                              Nível de Confiança
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 dark:bg-super-dark-border rounded-full h-2.5">
                                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${evaluation.confidenceScore * 100}%` }}></div>
                              </div>
                              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                {Math.round(evaluation.confidenceScore * 100)}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-super-dark-text-secondary mt-1">Baseado em uma amostra pequena de jogos.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <AwaitingStats prospectName={prospect.name} />
            )}

            {/* SEÇÃO DE FLAGS (DESTAQUES E ALERTAS) */}
            {flags.length > 0 && hasStats && (
              <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4 flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />Destaques & Alertas do Radar</h2>
                <div className="space-y-3">
                  {flags.map((flag, index) => (
                    <div key={index} className={`flex items-start p-4 rounded-lg shadow-sm ${flag.type === 'green' ? 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500' : 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500'}`}>
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        {flag.type === 'green' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
                      </div>
                      <div>
                        <p className={`text-sm leading-relaxed ${flag.type === 'green' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'} mt-1`}>{flag.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO DE COMPARAÇÕES NBA */}
            {comparablePlayers.length > 0 && hasStats && (
              <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-cyan-500" />Comparações NBA</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comparablePlayers.map((player, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-super-dark-secondary p-4 rounded-lg border border-slate-200 dark:border-super-dark-border">
                      <p className="font-bold text-slate-800 dark:text-super-dark-text-primary">{player.name}</p>
                      <p className="text-sm leading-normal text-slate-600 dark:text-super-dark-text-secondary">Similaridade: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{player.similarity}%</span></p>
                      <p className="text-xs leading-normal text-slate-500 dark:text-super-dark-text-secondary mt-1">Sucesso na Carreira: {player.careerSuccess}/10</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Only render the analysis section if there are strengths or weaknesses */}
            {(prospect.strengths?.length > 0 || prospect.weaknesses?.length > 0) && (
              <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-6 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-orange-500" />Análise do Jogador</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Conditionally render Strengths */}
                  {prospect.strengths?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">Pontos Fortes</h3>
                      <ul className="space-y-2">
                        {prospect.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-super-dark-text-primary leading-relaxed">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Conditionally render Weaknesses */}
                  {prospect.weaknesses?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">Pontos a Melhorar</h3>
                      <ul className="space-y-2">
                        {prospect.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700 dark:text-super-dark-text-primary leading-relaxed">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-super-dark-text-primary">Estatísticas</h3>
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-black/50 dark:text-blue-300 px-2 py-1 rounded-full font-medium">{prospect.scope || 'N/A'}</span>
              </div>
              <div className="space-y-4">
                {/* Helper function for stat display with progress bar */}
                {(() => {
                  const renderStat = (label, value, colorClass, isPercentage = true) => (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-super-dark-text-secondary leading-normal">{label}</span>
                      <span className={`font-bold ${colorClass}`}>{value !== 'N/A' ? `${value}${isPercentage ? '%' : ''}` : 'N/A'}</span>
                    </div>
                  );

                  return (
                    <>
                      {renderStat('TS%', (prospect.ts_percent * 100)?.toFixed(1), 'text-cyan-500')}
                      {renderStat('eFG%', (prospect.efg_percent * 100)?.toFixed(1), 'text-teal-500')}
                      {renderStat('PER', prospect.per?.toFixed(2), 'text-indigo-500', false)}
                      {renderStat('USG%', prospect.usg_percent?.toFixed(1), 'text-pink-500')}
                      {renderStat('ORtg', prospect.ortg?.toFixed(1), 'text-lime-500', false)}
                      {renderStat('DRtg', prospect.drtg?.toFixed(1), 'text-red-500', false)}
                      {renderStat('TOV%', prospect.tov_percent?.toFixed(1), 'text-orange-500')}
                      {renderStat('AST%', prospect.ast_percent?.toFixed(1), 'text-green-500')}
                      {renderStat('TRB%', prospect.trb_percent?.toFixed(1), 'text-blue-500')}
                      {renderStat('STL%', prospect.stl_percent?.toFixed(1), 'text-purple-500')}
                      {renderStat('BLK%', prospect.blk_percent?.toFixed(1), 'text-yellow-500')}
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Projeção Mock Draft</h3>
              <div className="text-3xl font-bold mb-1">{evaluation.draftProjection?.description || 'N/A'}</div>
              <div className="text-orange-100 text-sm">{evaluation.draftProjection?.range ? `Range: ${evaluation.draftProjection.range}` : 'N/A'}</div>
            </div>
            <div className="bg-white dark:bg-super-dark-secondary rounded-xl shadow-sm border border-slate-200 dark:border-super-dark-border p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-super-dark-text-primary mb-4">Ações</h3>
              <div className="space-y-3">
                <button onClick={() => navigate(`/compare?add=${prospect.id}`)} className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"><GitCompare className="w-4 h-4 mr-2" />Comparar Jogador</button>
                {user && <button onClick={() => toggleWatchlist(prospect.id)} className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${isInWatchlist ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-super-dark-border dark:text-super-dark-text-primary dark:hover:bg-super-dark-secondary'}`}><Heart className={`w-4 h-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />{isInWatchlist ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}</button>}
                <button onClick={handleShare} className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 dark:bg-super-dark-border dark:text-super-dark-text-primary dark:hover:bg-super-dark-secondary transition-colors"><Share2 className="w-4 h-4 mr-2" />Compartilhar Perfil</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetail;