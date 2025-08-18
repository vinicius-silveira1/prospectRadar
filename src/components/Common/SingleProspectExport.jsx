import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useAdvancedExport from '../../hooks/useAdvancedExport';
import UpgradeModal from './UpgradeModal';
import ExportNotification from './ExportNotification';

const SingleProspectExport = ({ prospect }) => {
  const { user } = useAuth();
  const { 
    isExporting, 
    exportToCSV, 
    exportToExcel, 
    exportToPDF, 
    exportToImage,
    exportError 
  } = useAdvancedExport();
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: '', format: '' });
  
  const isScoutUser = user?.subscription_tier?.toLowerCase() === 'scout';

  // Gerar dados completos baseados no prospect
  const generateSimpleData = (prospect) => {
    if (!prospect) return { evaluation: {}, flags: [], comparablePlayers: [] };
    
    // Função para mapear tier para descrição em português
    const getTierDescription = (tier) => {
      switch(tier) {
        case 'Elite': return 'Elite/Lottery Pick';
        case 'First Round': return 'Primeira Rodada';
        case 'Second Round': return 'Início de Segunda Rodada';
        case 'Sleeper': return 'Sleeper/Undrafted';
        default: return tier || 'N/A';
      }
    };

    // Função para calcular range baseado no ranking
    const getDraftRange = (ranking, tier) => {
      if (ranking) {
        const start = Math.max(1, ranking - 7);
        const end = Math.min(60, ranking + 7);
        return `${start}-${end}`;
      }
      
      // Fallback baseado no tier
      switch(tier) {
        case 'Elite': return '1-14';
        case 'First Round': return '15-30';
        case 'Second Round': return '31-45';
        case 'Sleeper': return '46-60';
        default: return 'N/A';
      }
    };

    // Evaluation completa - prioriza dados reais do prospect.evaluation
    const evaluation = {
      draftProjection: {
        description: prospect.evaluation?.draftProjection?.description || getTierDescription(prospect.tier),
        range: prospect.evaluation?.draftProjection?.range || getDraftRange(prospect.ranking, prospect.tier)
      },
      nbaReadiness: prospect.evaluation?.nbaReadiness || (prospect.tier === 'Elite' ? 'Alta' : 
                    prospect.tier === 'First Round' ? 'Média-Alta' :
                    prospect.tier === 'Second Round' ? 'Média' : 'Baixa'),
      potentialScore: prospect.evaluation?.potentialScore || (prospect.ranking ? 
        Math.max(1, 100 - Math.floor((prospect.ranking - 1) * 1.5)) : 
        prospect.tier === 'Elite' ? 95 :
        prospect.tier === 'First Round' ? 80 :
        prospect.tier === 'Second Round' ? 65 : 50),
      confidenceScore: prospect.evaluation?.confidenceScore || (prospect.ppg && prospect.rpg && prospect.apg ? 0.9 : 0.7),
      categoryScores: prospect.evaluation?.categoryScores || {
        shooting: prospect.fg_percentage ? Math.round(prospect.fg_percentage * 100) : 
                 prospect.three_pt_percentage ? Math.round(prospect.three_pt_percentage * 100) : 50,
        playmaking: prospect.apg ? Math.min(100, Math.round(prospect.apg * 12)) : 50,
        rebounding: prospect.rpg ? Math.min(100, Math.round(prospect.rpg * 8)) : 50,
        defense: prospect.spg && prospect.bpg ? 
                Math.min(100, Math.round((prospect.spg + prospect.bpg) * 15)) : 
                prospect.spg ? Math.min(100, Math.round(prospect.spg * 20)) : 55,
        athleticism: 75, // Valor base para prospects brasileiros
        potential: prospect.ranking ? Math.max(1, 100 - Math.floor((prospect.ranking - 1) * 1.2)) : 78
      },
      // Dados adicionais para o PDF
      basicStats: {
        fg_percentage: (prospect.two_pt_attempts + prospect.three_pt_attempts) > 0 
          ? (((prospect.two_pt_makes + prospect.three_pt_makes) / (prospect.two_pt_attempts + prospect.three_pt_attempts)) * 100).toFixed(1) + '%'
          : 'N/A',
        three_pt_percentage: prospect.three_pct ? (prospect.three_pct * 100).toFixed(1) + '%' : 
                            prospect.three_pt_percentage ? (prospect.three_pt_percentage * 100).toFixed(1) + '%' : 
                            prospect.three_p_percentage ? (prospect.three_p_percentage * 100).toFixed(1) + '%' : 'N/A',
        ft_percentage: prospect.ft_attempts > 0 
          ? ((prospect.ft_makes / prospect.ft_attempts) * 100).toFixed(1) + '%'
          : 'N/A'
      }
    };

    // Use flags e comparações reais do prospect.evaluation se disponíveis, senão gera dados realísticos
    const flags = prospect.evaluation?.flags?.length > 0 ? 
      prospect.evaluation.flags : 
      (() => {
        const generatedFlags = [];
        
        // Scorer Elite (15+ PPG)
        if (prospect.ppg && prospect.ppg >= 15) {
          generatedFlags.push('Scorer Elite');
        }
        
        // Playmaker (5+ APG)
        if (prospect.apg && prospect.apg >= 5) {
          generatedFlags.push('Playmaker');
        }
        
        // Rebote forte (8+ RPG)
        if (prospect.rpg && prospect.rpg >= 8) {
          generatedFlags.push('Rebote Dominante');
        }
        
        // Eficiência no arremesso (45%+ FG)
        if (prospect.fg_percentage && prospect.fg_percentage >= 0.45) {
          generatedFlags.push('Eficiência de Arremesso');
        }
        
        // Arremesso de 3 (35%+ 3PT)
        if (prospect.three_pt_percentage && prospect.three_pt_percentage >= 0.35) {
          generatedFlags.push('Arremessador de 3 Pontos');
        }
        
        // Prospect brasileiro
        if (prospect.nationality === '🇧🇷') {
          generatedFlags.push('Prospect Brasileiro');
        }
        
        // Destaque na posição
        if (prospect.tier === 'Elite' || (prospect.ranking && prospect.ranking <= 20)) {
          generatedFlags.push('Destaque na Posição');
        }
        
        return generatedFlags;
      })();

    // Use comparações reais do prospect.evaluation se disponíveis, senão gera comparações realísticas
    const comparablePlayers = prospect.evaluation?.comparablePlayers?.length > 0 ?
      prospect.evaluation.comparablePlayers :
      (() => {
        const generatedComparisons = [];
        
        if (prospect.position === 'SG' || prospect.position === 'SF') {
          generatedComparisons.push(
            { 
              name: 'Bogdan Bogdanovic', 
              similarity: 0.78,
              careerSuccess: '7/10',
              description: 'Arremessador versátil com visão de jogo'
            },
            { 
              name: 'Dario Saric', 
              similarity: 0.72,
              careerSuccess: '6/10',
              description: 'Jogador fundamentado com QI de basquete'
            }
          );
        } else if (prospect.position === 'PG') {
          generatedComparisons.push(
            { 
              name: 'Facundo Campazzo', 
              similarity: 0.75,
              careerSuccess: '6/10',
              description: 'Armador criativo com experiência internacional'
            },
            { 
              name: 'Ricky Rubio', 
              similarity: 0.70,
              careerSuccess: '7/10',
              description: 'Facilitador nato com liderança'
            }
          );
        } else {
          // Para outras posições ou fallback
          generatedComparisons.push(
            { 
              name: 'Jonas Valanciunas', 
              similarity: 0.73,
              careerSuccess: '7/10',
              description: 'Presença sólida no garrafão'
            },
            { 
              name: 'Clint Capela', 
              similarity: 0.69,
              careerSuccess: '8/10',
              description: 'Especialista defensivo e rebotes'
            }
          );
        }
        
        return generatedComparisons;
      })();

    // Análise detalhada do jogador
    const playerAnalysis = `${prospect.name} é um prospect ${prospect.nationality === '🇧🇷' ? 'brasileiro' : 'internacional'} com perfil de ${evaluation.draftProjection.description}. 

PONTOS FORTES: Demonstra sólido conhecimento tático e experiência em competições de alto nível. ${prospect.ppg && prospect.ppg >= 12 ? `Possui capacidade ofensiva consistente (${prospect.ppg.toFixed(1)} PPG)` : 'Foca em contribuições além da pontuação'}. ${prospect.apg && prospect.apg >= 3 ? `Mostra visão de jogo (${prospect.apg.toFixed(1)} APG)` : 'Focado na própria função tática'}. 

ÁREAS DE DESENVOLVIMENTO: Como a maioria dos prospects internacionais, precisará se adaptar ao atletismo e velocidade da NBA. ${prospect.fg_percentage && prospect.fg_percentage < 0.45 ? 'Pode melhorar a eficiência ofensiva' : 'Mantém boa eficiência ofensiva'}. 

PROJEÇÃO NBA: ${prospect.tier === 'Elite' ? 'Potencial para impacto imediato como rotação' : prospect.tier === 'First Round' ? 'Candidato a desenvolver papel na rotação' : 'Projeto de longo prazo com fundamentos sólidos'}. Sua experiência internacional é um diferencial importante para adaptação ao basquete profissional.`;

    return { 
      evaluation: {
        ...evaluation,
        playerAnalysis
      }, 
      flags, 
      comparablePlayers 
    };
  };

  const showNotification = (type, format) => {
    setNotification({ visible: true, type, format });
    
    if (type !== 'processing') {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 4000);
    }
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const handleExport = async (format) => {
    if (!isScoutUser) {
      setShowUpgradeModal(true);
      return;
    }

    if (!prospect) {
      showNotification('error', format);
      return;
    }
    
    showNotification('processing', format);

    try {
      const { evaluation, flags, comparablePlayers } = generateSimpleData(prospect);
      let result = { success: false };
      
      switch (format) {
        case 'pdf':
          result = await exportToPDF(prospect, evaluation, flags, comparablePlayers, true);
          break;
        case 'excel':
          result = await exportToExcel(prospect, evaluation, flags, comparablePlayers);
          break;
        case 'csv':
          result = await exportToCSV(prospect, evaluation, flags, comparablePlayers);
          break;
        case 'image':
          result = await exportToImage(prospect, evaluation, flags, comparablePlayers);
          break;
        default:
          return;
      }

      hideNotification();
      
      if (result.success) {
        showNotification('success', format);
      } else {
        showNotification('error', format);
      }
    } catch (error) {
      console.error(`Erro na exportação ${format}:`, error);
      hideNotification();
      showNotification('error', format);
    }
  };

  const exportOptions = [
    {
      format: 'pdf',
      label: 'PDF',
      description: 'Relatório completo',
      icon: FileText,
      color: 'blue'
    },
    {
      format: 'excel',
      label: 'Excel',
      description: 'Planilha detalhada',
      icon: FileSpreadsheet,
      color: 'green'
    },
    {
      format: 'csv',
      label: 'CSV',
      description: 'Dados tabulares',
      icon: FileSpreadsheet,
      color: 'orange'
    },
    {
      format: 'image',
      label: 'Imagem',
      description: 'Para redes sociais',
      icon: Camera,
      color: 'purple'
    }
  ];

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Exportar Relatório Individual
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isScoutUser ? 'Gere um relatório completo deste prospect' : 'Recurso exclusivo para usuários Scout'}
            </p>
          </div>
        </div>

        {!isScoutUser && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              A exportação individual é um recurso exclusivo do plano Scout. 
              Upgrade para gerar relatórios personalizados!
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {exportOptions.map((option) => {
            const IconComponent = option.icon;
            const colorClasses = {
              blue: 'border-blue-300 dark:border-blue-500 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30',
              green: 'border-green-300 dark:border-green-500 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/30',
              orange: 'border-orange-300 dark:border-orange-500 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30',
              purple: 'border-purple-300 dark:border-purple-500 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
            };

            const iconColorClasses = {
              blue: 'text-blue-600 dark:text-blue-400',
              green: 'text-green-600 dark:text-green-400',
              orange: 'text-orange-600 dark:text-orange-400',
              purple: 'text-purple-600 dark:text-purple-400'
            };
            
            return (
              <button
                key={option.format}
                onClick={() => handleExport(option.format)}
                disabled={isExporting || !isScoutUser}
                className={`
                  flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 border-dashed transition-all duration-200 min-h-[100px] sm:min-h-[120px]
                  ${isScoutUser 
                    ? colorClasses[option.color] 
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }
                  ${isExporting ? 'opacity-50' : ''}
                `}
              >
                {isExporting ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mb-2 animate-spin text-blue-600 dark:text-blue-400" />
                ) : (
                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 mb-2 ${
                    isScoutUser ? iconColorClasses[option.color] : 'text-slate-400'
                  }`} />
                )}
                <div className="text-center">
                  <div className="font-medium text-xs sm:text-sm text-slate-900 dark:text-slate-100">{option.label}</div>
                  <div className={`text-xs mt-1 hidden sm:block ${
                    isScoutUser ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {option.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {isScoutUser && (
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
            Os relatórios incluem estatísticas completas, anotações e métricas do prospect
          </div>
        )}
      </div>

      {/* Modal de Upgrade */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="exportação individual"
      />

      {/* Notificação de Exportação */}
      <ExportNotification
        type={notification.type}
        format={notification.format}
        visible={notification.visible}
        onClose={hideNotification}
      />
    </>
  );
};

export default SingleProspectExport;
