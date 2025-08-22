import { useState } from 'react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

const useAdvancedExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Função para capturar elemento como imagem
  const captureElement = async (elementId, options = {}) => {
    const element = document.getElementById(elementId);
    if (!element) return null;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ...options
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Erro ao capturar elemento:', error);
      return null;
    }
  };

  // Função para compilar dados completos do prospecto
  const compileProspectData = (prospect, evaluation, flags, comparablePlayers) => {
    const data = {
      // Informações Básicas
      basicInfo: {
        name: prospect.name || 'N/A',
        position: prospect.position || 'N/A',
        team: prospect.team || 'N/A',
        age: prospect.age || 'N/A',
        height: typeof prospect.height === 'object' ? prospect.height?.us : prospect.height || 'N/A',
        weight: (() => {
          try {
            if (typeof prospect.weight === 'object' && prospect.weight?.us) {
              const us = String(prospect.weight.us).replace('lbs', '').trim();
              const intl = String(prospect.weight.intl).replace('kg', '').trim();
              return `${us} lbs (${intl} kg)`;
            } else if (typeof prospect.weight === 'string' && prospect.weight.startsWith('{')) {
              const weightObj = JSON.parse(prospect.weight);
              const us = String(weightObj.us).replace('lbs', '').trim();
              const intl = String(weightObj.intl).replace('kg', '').trim();
              return `${us} lbs (${intl} kg)`;
            } else {
              return prospect.weight || 'N/A';
            }
          } catch (e) {
            return prospect.weight || 'N/A';
          }
        })(),
        nationality: prospect.nationality === '🇧🇷' ? 'Brasil' : 'Internacional'
      },

      // Estatísticas Básicas - versão simplificada para evitar erros
      basicStats: {
        ppg: prospect.ppg?.toFixed(1) || 'N/A',
        rpg: prospect.rpg?.toFixed(1) || 'N/A',
        apg: prospect.apg?.toFixed(1) || 'N/A',
        spg: prospect.spg?.toFixed(1) || 'N/A',
        bpg: prospect.bpg?.toFixed(1) || 'N/A',
        fg_percentage: (() => {
          try {
            if (evaluation?.basicStats?.fg_percentage) return evaluation.basicStats.fg_percentage;
            const totalAttempts = (prospect.two_pt_attempts || 0) + (prospect.three_pt_attempts || 0);
            const totalMakes = (prospect.two_pt_makes || 0) + (prospect.three_pt_makes || 0);
            return totalAttempts > 0 ? ((totalMakes / totalAttempts) * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        ft_percentage: (() => {
          try {
            if (evaluation?.basicStats?.ft_percentage) return evaluation.basicStats.ft_percentage;
            return prospect.ft_attempts > 0 ? ((prospect.ft_makes / prospect.ft_attempts) * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        three_p_percentage: (() => {
          try {
            if (evaluation?.basicStats?.three_pt_percentage) return evaluation.basicStats.three_pt_percentage;
            if (prospect.three_pct) return (prospect.three_pct * 100).toFixed(1) + '%';
            if (prospect.three_pt_percentage) return (prospect.three_pt_percentage * 100).toFixed(1) + '%';
            if (prospect.three_p_percentage) return (prospect.three_p_percentage * 100).toFixed(1) + '%';
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })()
      },

      // Estatísticas Avançadas - usando os mesmos campos da página ProspectDetail
      advancedStats: {
        trueShooting: (() => {
          try {
            if (prospect.ts_percent !== null && prospect.ts_percent !== undefined) {
              return (prospect.ts_percent * 100).toFixed(1) + '%';
            }
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        effectiveFG: (() => {
          try {
            if (prospect.efg_percent !== null && prospect.efg_percent !== undefined) {
              return (prospect.efg_percent * 100).toFixed(1) + '%';
            }
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        playerEfficiency: prospect.per?.toFixed(2) || 'N/A',
        usageRate: (() => {
          try {
            if (prospect.usg_percent !== null && prospect.usg_percent !== undefined) {
              return prospect.usg_percent.toFixed(1) + '%';
            }
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        offensiveRating: prospect.ortg?.toFixed(1) || 'N/A',
        defensiveRating: prospect.drtg?.toFixed(1) || 'N/A',
        turnoverRate: (() => {
          try {
            if (prospect.tov_percent !== null && prospect.tov_percent !== undefined) {
              return prospect.tov_percent.toFixed(1) + '%';
            }
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        assistRate: (() => {
          try {
            if (prospect.ast_percent !== null && prospect.ast_percent !== undefined) {
              return prospect.ast_percent.toFixed(1) + '%';
            }
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        totalReboundRate: (() => {
          try {
            if (prospect.trb_percent !== null && prospect.trb_percent !== undefined) {
              return prospect.trb_percent.toFixed(1) + '%';
            }
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        stealRate: (() => {
          try {
            if (prospect.stl_percent !== null && prospect.stl_percent !== undefined) {
              return prospect.stl_percent.toFixed(1) + '%';
            }
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        blockRate: (() => {
          try {
            if (prospect.blk_percent !== null && prospect.blk_percent !== undefined) {
              return prospect.blk_percent.toFixed(1) + '%';
            }
            return 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })()
      },

      // Radar Scores - corrigindo nomes das propriedades
      radarScores: {
        shooting: evaluation.categoryScores?.shooting || 'N/A',
        playmaking: evaluation.categoryScores?.playmaking || 'N/A',
        rebounding: evaluation.categoryScores?.rebounding || 'N/A',
        defense: evaluation.categoryScores?.defense || 'N/A',
        athleticism: evaluation.categoryScores?.athleticism || 'N/A',
        potential: evaluation.categoryScores?.potential || 'N/A'
      },

      // Análise do Radar Score
      radarAnalysis: {
        draftProjection: evaluation.draftProjection?.description || 'N/A',
        draftRange: evaluation.draftProjection?.range || 'N/A',
        readiness: evaluation.nbaReadiness || 'N/A',
        potentialScore: evaluation.potentialScore || 'N/A',
        confidenceScore: evaluation.confidenceScore ? `${Math.round(evaluation.confidenceScore * 100)}%` : 'N/A'
      },

      // Flags (Destaques e Alertas) - tratamento seguro
      flags: (() => {
        try {
          if (!flags || !Array.isArray(flags)) return [];
          return flags.map(flag => {
            try {
              if (typeof flag === 'string') {
                return {
                  type: 'Destaque',
                  message: flag
                };
              } else if (flag && typeof flag === 'object') {
                return {
                  type: flag.type === 'green' ? 'Destaque' : 'Alerta',
                  message: flag.message || flag.toString()
                };
              } else {
                return {
                  type: 'Destaque',
                  message: flag?.toString() || 'Flag não disponível'
                };
              }
            } catch (e) {
              return {
                type: 'Destaque',
                message: 'Flag não disponível'
              };
            }
          });
        } catch (e) {
          return [];
        }
      })(),

      // Comparações NBA - tratamento seguro
      nbaComparisons: (() => {
        try {
          if (!comparablePlayers || !Array.isArray(comparablePlayers)) return [];
          return comparablePlayers.map(player => {
            try {
              return {
                name: player?.name || 'Jogador não disponível',
                similarity: typeof player?.similarity === 'string' ? player.similarity : `${Math.round(player?.similarity || 0)}%`,
                careerSuccess: player?.careerSuccess || 'N/A'
              };
            } catch (e) {
              return {
                name: 'Jogador não disponível',
                similarity: '0%',
                careerSuccess: 'N/A'
              };
            }
          });
        } catch (e) {
          return [];
        }
      })(),

      // Análise Detalhada - usando os mesmos campos da página ProspectDetail
      detailedAnalysis: (() => {
        try {
          // Primeiro tenta usar a análise detalhada existente
          if (prospect.evaluation?.detailedAnalysis) {
            return prospect.evaluation.detailedAnalysis;
          }
          
          // Usar prospect.strengths e prospect.weaknesses como na página ProspectDetail
          const name = prospect?.name || 'Prospecto';
          let analysis = `Análise Detalhada do Jogador\n\n`;
          
          // Pontos Fortes
          if (prospect.strengths?.length > 0) {
            analysis += `Pontos Fortes\n`;
            prospect.strengths.forEach(strength => {
              analysis += `${strength}\n`;
            });
            analysis += '\n';
          }
          
          // Pontos a Melhorar
          if (prospect.weaknesses?.length > 0) {
            analysis += `Pontos a Melhorar\n`;
            prospect.weaknesses.forEach(weakness => {
              analysis += `${weakness}\n`;
            });
          }
          
          // Se não tiver strengths nem weaknesses, criar análise básica
          if (!prospect.strengths?.length && !prospect.weaknesses?.length) {
            analysis += `${name} é um prospect em desenvolvimento.\n\n`;
            
            const projection = evaluation?.draftProjection?.description || 'em avaliação';
            analysis += `PROJEÇÃO: ${name} é avaliado como um prospect ${projection.toLowerCase()}.`;
            
            if (prospect.evaluation?.radarScore) {
              analysis += `\n\nRADAR SCORE: ${prospect.evaluation.radarScore}/100`;
            }
          }
          
          return analysis;
        } catch (e) {
          console.error('Erro ao gerar análise detalhada:', e);
          return `${prospect?.name || 'Prospecto'} é um jogador com potencial interessante para o próximo nível. Análise detalhada disponível na plataforma.`;
        }
      })(),

      // Áreas de melhoria - usando prospect.weaknesses como na página
      improvementAreas: (() => {
        try {
          if (prospect.weaknesses?.length > 0) {
            return prospect.weaknesses;
          }
          // Se não tiver weaknesses, usar flags como fallback
          if (!flags || !Array.isArray(flags)) return ['Inexperiência'];
          const alertas = flags.filter(f => f?.type === 'Alerta' || f?.type === 'red').map(f => f?.message || '').slice(0, 3);
          return alertas.length > 0 ? alertas : ['Inexperiência'];
        } catch (e) {
          return ['Inexperiência'];
        }
      })()
    };

    return data;
  };

  // Exportação CSV Completa
  const exportToCSV = async (prospect, evaluation, flags, comparablePlayers) => {
    try {
      setIsExporting(true);
      setExportError(null);

      const data = compileProspectData(prospect, evaluation, flags, comparablePlayers);
      
      // Criar array para CSV com todas as informações detalhadas
      const csvData = [
        ['RELATÓRIO COMPLETO DE PROSPECTO - PROSPECTRADAR'],
        ['Data de Exportação', new Date().toLocaleDateString('pt-BR')],
        [''],
        ['INFORMAÇÕES BÁSICAS'],
        ['Nome', data.basicInfo.name],
        ['Posição', data.basicInfo.position],
        ['Time', data.basicInfo.team],
        ['Idade', data.basicInfo.age],
        ['Altura', data.basicInfo.height],
        ['Peso', data.basicInfo.weight],
        ['Nacionalidade', data.basicInfo.nationality],
        [''],
        ['ESTATÍSTICAS BÁSICAS'],
        ['Pontos por Jogo', data.basicStats.ppg],
        ['Rebotes por Jogo', data.basicStats.rpg],
        ['Assistências por Jogo', data.basicStats.apg],
        ['Roubos por Jogo', data.basicStats.spg],
        ['Tocos por Jogo', data.basicStats.bpg],
        ['FG%', data.basicStats.fg_percentage],
        ['FT%', data.basicStats.ft_percentage],
        ['3P%', data.basicStats.three_p_percentage],
        [''],
        ['ESTATÍSTICAS AVANÇADAS'],
        ['TS%', data.advancedStats.trueShooting],
        ['eFG%', data.advancedStats.effectiveFG],
        ['PER', data.advancedStats.playerEfficiency],
        ['USG%', data.advancedStats.usageRate],
        ['ORtg', data.advancedStats.offensiveRating],
        ['DRtg', data.advancedStats.defensiveRating],
        ['TOV%', data.advancedStats.turnoverRate],
        ['AST%', data.advancedStats.assistRate],
        ['TRB%', data.advancedStats.totalReboundRate],
        ['STL%', data.advancedStats.stealRate],
        ['BLK%', data.advancedStats.blockRate],
        [''],
        ['ANÁLISE DO RADAR SCORE'],
        ['Projeção de Draft', data.radarAnalysis.draftProjection],
        ['Range de Draft', data.radarAnalysis.draftRange],
        ['Prontidão para NBA', data.radarAnalysis.readiness],
        ['Score de Potencial', data.radarAnalysis.potentialScore],
        ['Nível de Confiança', data.radarAnalysis.confidenceScore],
        [''],
        ['SCORES DE CATEGORIA'],
        ['Arremesso', data.radarScores.shooting],
        ['Criação de Jogadas', data.radarScores.playmaking],
        ['Rebotes', data.radarScores.rebounding],
        ['Defesa', data.radarScores.defense],
        ['Atletismo', data.radarScores.athleticism],
        ['Potencial', data.radarScores.potential],
      ];

      // Adicionar flags detalhadas
      if (data.flags.length > 0) {
        csvData.push(['']);
        csvData.push(['DESTAQUES E ALERTAS']);
        csvData.push(['Tipo', 'Descrição']);
        data.flags.forEach(flag => {
          csvData.push([flag.type, flag.message]);
        });
      }

      // Adicionar comparações NBA detalhadas
      if (data.nbaComparisons.length > 0) {
        csvData.push(['']);
        csvData.push(['COMPARAÇÕES COM JOGADORES NBA']);
        csvData.push(['Jogador', 'Similaridade', 'Sucesso na Carreira', 'Descrição']);
        data.nbaComparisons.forEach(comp => {
          csvData.push([comp.name, comp.similarity, comp.careerSuccess, comp.description || '']);
        });
      }

      // Adicionar análise detalhada completa
      csvData.push(['']);
      csvData.push(['ANÁLISE DETALHADA DO JOGADOR']);
      csvData.push(['', data.detailedAnalysis]);
      
      if (data.improvementAreas.length > 0) {
        csvData.push(['']);
        csvData.push(['PONTOS A MELHORAR']);
        data.improvementAreas.forEach(area => {
          csvData.push(['⚠', area]);
        });
      }

      const ws = XLSX.utils.aoa_to_sheet(csvData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Prospect Report');
      
      const fileName = `${prospect.name.replace(/\s+/g, '_')}_Relatorio_Completo.csv`;
      XLSX.writeFile(wb, fileName);

      return { success: true };
    } catch (error) {
      setExportError('Erro ao exportar para CSV: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsExporting(false);
    }
  };

  // Exportação Excel Completa com múltiplas abas - formatação melhorada
  const exportToExcel = async (prospect, evaluation, flags, comparablePlayers) => {
    try {
      setIsExporting(true);
      setExportError(null);

      const data = compileProspectData(prospect, evaluation, flags, comparablePlayers);
      
      const wb = XLSX.utils.book_new();

      // Aba 1: Resumo Executivo - layout limpo
      const summaryData = [
        ['PROSPECT RADAR - RESUMO EXECUTIVO'],
        ['Data de Exportação:', new Date().toLocaleDateString('pt-BR')],
        [''],
        ['INFORMAÇÕES BÁSICAS'],
        ['Nome:', data.basicInfo.name],
        ['Posição:', data.basicInfo.position],
        ['Time:', data.basicInfo.team],
        ['Idade:', `${data.basicInfo.age} anos`],
        ['Altura:', data.basicInfo.height],
        ['Peso:', data.basicInfo.weight],
        ['Nacionalidade:', data.basicInfo.nationality],
        [''],
        ['PROJEÇÃO DE DRAFT'],
        ['Classificação:', data.radarAnalysis.draftProjection],
        ['Range Estimado:', data.radarAnalysis.draftRange],
        ['Prontidão NBA:', data.radarAnalysis.readiness],
        ['Score de Potencial:', data.radarAnalysis.potentialScore],
        ['Nível de Confiança:', data.radarAnalysis.confidenceScore],
        [''],
        ['ESTATÍSTICAS PRINCIPAIS'],
        ['PPG:', data.basicStats.ppg],
        ['RPG:', data.basicStats.rpg],
        ['APG:', data.basicStats.apg],
        ['FG%:', data.basicStats.fg_percentage],
        ['3P%:', data.basicStats.three_p_percentage],
        ['FT%:', data.basicStats.ft_percentage]
      ];
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      // Definir largura das colunas
      summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo Executivo');

      // Aba 2: Estatísticas Detalhadas - melhor organização
      const statsData = [
        ['ESTATÍSTICAS COMPLETAS'],
        [''],
        ['ESTATÍSTICAS BÁSICAS', 'Valor'],
        ['Pontos por Jogo', data.basicStats.ppg],
        ['Rebotes por Jogo', data.basicStats.rpg],
        ['Assistências por Jogo', data.basicStats.apg],
        ['Roubos por Jogo', data.basicStats.spg],
        ['Tocos por Jogo', data.basicStats.bpg],
        ['Field Goal %', data.basicStats.fg_percentage],
        ['Free Throw %', data.basicStats.ft_percentage],
        ['Three Point %', data.basicStats.three_p_percentage],
        [''],
        ['ESTATÍSTICAS AVANÇADAS', 'Valor'],
        ['True Shooting %', data.advancedStats.trueShooting],
        ['Effective FG %', data.advancedStats.effectiveFG],
        ['Player Efficiency', data.advancedStats.playerEfficiency],
        ['Usage Rate %', data.advancedStats.usageRate],
        ['Offensive Rating', data.advancedStats.offensiveRating],
        ['Defensive Rating', data.advancedStats.defensiveRating],
        ['Turnover %', data.advancedStats.turnoverRate],
        ['Assist Rate %', data.advancedStats.assistRate],
        ['Rebound Rate %', data.advancedStats.totalReboundRate],
        ['Steal Rate %', data.advancedStats.stealRate],
        ['Block Rate %', data.advancedStats.blockRate],
        [''],
        ['RADAR SCORES', 'Score'],
        ['Arremesso', data.radarScores.shooting],
        ['Criação', data.radarScores.playmaking],
        ['Rebotes', data.radarScores.rebounding],
        ['Defesa', data.radarScores.defense],
        ['Atletismo', data.radarScores.athleticism],
        ['Potencial', data.radarScores.potential]
      ];
      const statsWs = XLSX.utils.aoa_to_sheet(statsData);
      statsWs['!cols'] = [{ wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, statsWs, 'Estatísticas');

      // Aba 3: Análise Scouting
      const scoutingData = [
        ['ANÁLISE DE SCOUTING', '', ''],
        ['', '', '']
      ];
      
      if (data.flags.length > 0) {
        scoutingData.push(['DESTAQUES E ALERTAS', '', '']);
        scoutingData.push(['Tipo', 'Descrição', '']);
        data.flags.forEach(flag => {
          scoutingData.push([flag.type, flag.message, '']);
        });
        scoutingData.push(['', '', '']);
      }

      if (data.nbaComparisons.length > 0) {
        scoutingData.push(['COMPARAÇÕES COM JOGADORES NBA', '', '']);
        scoutingData.push(['Jogador', 'Similaridade', 'Sucesso na Carreira']);
        data.nbaComparisons.forEach(comp => {
          scoutingData.push([comp.name, comp.similarity, comp.careerSuccess]);
        });
        scoutingData.push(['', '', '']);
      }

      scoutingData.push(['ANÁLISE DETALHADA DO JOGADOR', '', '']);
      scoutingData.push(['', '', '']);
      
      // Quebrar análise detalhada em linhas
      const analysisLines = data.detailedAnalysis.split('\n');
      analysisLines.forEach(line => {
        if (line.trim()) {
          scoutingData.push([line.trim(), '', '']);
        }
      });

      if (data.improvementAreas.length > 0) {
        scoutingData.push(['', '', '']);
        scoutingData.push(['PONTOS A MELHORAR', '', '']);
        data.improvementAreas.forEach(area => {
          scoutingData.push(['⚠', area, '']);
        });
      }

      const scoutingWs = XLSX.utils.aoa_to_sheet(scoutingData);
      XLSX.utils.book_append_sheet(wb, scoutingWs, 'Análise Scouting');

      // Aba 4: Dados Brutos (para análises)
      const rawData = [
        ['DADOS BRUTOS PARA ANÁLISE', ''],
        ['', ''],
        ['Campo', 'Valor'],
        ['Nome', prospect.name || ''],
        ['Posição', prospect.position || ''],
        ['Time', prospect.team || ''],
        ['Idade', prospect.age || ''],
        ['Tier', prospect.tier || ''],
        ['Ranking', prospect.ranking || ''],
        ['PPG', prospect.ppg || ''],
        ['RPG', prospect.rpg || ''],
        ['APG', prospect.apg || ''],
        ['SPG', prospect.spg || ''],
        ['BPG', prospect.bpg || ''],
        ['FG_Attempts', prospect.fg_attempts || ''],
        ['FG_Makes', prospect.fg_makes || ''],
        ['FT_Attempts', prospect.ft_attempts || ''],
        ['FT_Makes', prospect.ft_makes || ''],
        ['Three_PT_Attempts', prospect.three_pt_attempts || ''],
        ['Three_PT_Makes', prospect.three_pt_makes || ''],
        ['Three_PCT', prospect.three_pct || ''],
        ['TS_Percent', prospect.ts_percent || ''],
        ['eFG_Percent', prospect.efg_percent || ''],
        ['PER', prospect.per || ''],
        ['USG_Percent', prospect.usg_percent || ''],
        ['ORtg', prospect.ortg || ''],
        ['DRtg', prospect.drtg || ''],
        ['TOV_Percent', prospect.tov_percent || ''],
        ['AST_Percent', prospect.ast_percent || ''],
        ['TRB_Percent', prospect.trb_percent || ''],
        ['STL_Percent', prospect.stl_percent || ''],
        ['BLK_Percent', prospect.blk_percent || '']
      ];
      const rawWs = XLSX.utils.aoa_to_sheet(rawData);
      XLSX.utils.book_append_sheet(wb, rawWs, 'Dados Brutos');

      const fileName = `${prospect.name.replace(/\s+/g, '_')}_Relatorio_Excel.xlsx`;
      XLSX.writeFile(wb, fileName);

      return { success: true };
    } catch (error) {
      setExportError('Erro ao exportar Excel: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsExporting(false);
    }
  };

  // Exportação PDF Avançada com Gráficos
  const exportToPDF = async (prospect, evaluation, flags, comparablePlayers, includeChart = true) => {
    try {
      console.log('🔥 Iniciando exportação PDF...');
      setIsExporting(true);
      setExportError(null);

      console.log('📊 Compilando dados...');
      const data = compileProspectData(prospect, evaluation, flags, comparablePlayers);
      console.log('✅ Dados compilados:', data);
      
      console.log('📄 Criando documento PDF...');
      const doc = new jsPDF('p', 'mm', 'a4');
      console.log('✅ Documento PDF criado');
      
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let currentY = margin;

      // Função para verificar quebra de página
      const checkPageBreak = (neededHeight) => {
        if (currentY + neededHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
          return true;
        }
        return false;
      };

      // Função para adicionar título de seção
      const addSectionTitle = (title, color = [0, 0, 0]) => {
        checkPageBreak(15);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...color);
        doc.text(title, margin, currentY);
        currentY += 10;
        doc.setTextColor(0, 0, 0);
      };

      // Header do PDF
      console.log('🎨 Criando header...');
      doc.setFillColor(45, 55, 72);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('RELATÓRIO DE PROSPECTO', margin, 20);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('prospectRadar - Análise Completa', margin, 30);
      console.log('✅ Header criado');
      
      currentY = 50;

      // Informações Básicas
      console.log('📝 Adicionando nome e informações básicas...');
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(data.basicInfo.name, margin, currentY);
      currentY += 8;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`${data.basicInfo.position} | ${data.basicInfo.team} | ${data.basicInfo.age} anos`, margin, currentY);
      currentY += 15;

      // Tabela de Informações Básicas
      console.log('📊 Criando tabela de informações básicas...');
      addSectionTitle('INFORMAÇÕES BÁSICAS', [59, 130, 246]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Atributo', 'Valor']],
        body: [
          ['Altura', data.basicInfo.height],
          ['Peso', data.basicInfo.weight],
          ['Nacionalidade', data.basicInfo.nationality],
          ['Time Atual', data.basicInfo.team]
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: margin, right: margin }
      });

      currentY = doc.lastAutoTable.finalY + 15;

      // Gráfico do Radar Score (se disponível)
      if (includeChart && evaluation.categoryScores) {
        const radarElement = document.getElementById('radar-chart-container');
        if (radarElement) {
          try {
            const chartImage = await captureElement('radar-chart-container');
            if (chartImage) {
              checkPageBreak(80);
              addSectionTitle('ANÁLISE DO RADAR SCORE', [168, 85, 247]);
              doc.addImage(chartImage, 'PNG', margin, currentY, 80, 60);
              currentY += 70;
            }
          } catch (error) {
            console.error('Erro ao capturar gráfico:', error);
          }
        }
      }

      // Projeção de Draft
      checkPageBreak(30);
      addSectionTitle('PROJEÇÃO DE DRAFT', [245, 101, 101]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Métrica', 'Valor']],
        body: [
          ['Classificação', data.radarAnalysis.draftProjection],
          ['Range Estimado', data.radarAnalysis.draftRange],
          ['Prontidão NBA', data.radarAnalysis.readiness],
          ['Score de Potencial', data.radarAnalysis.potentialScore],
          ['Nível de Confiança', data.radarAnalysis.confidenceScore]
        ],
        theme: 'grid',
        headStyles: { fillColor: [245, 101, 101] },
        margin: { left: margin, right: margin }
      });

      currentY = doc.lastAutoTable.finalY + 15;

      // Estatísticas
      checkPageBreak(60);
      addSectionTitle('ESTATÍSTICAS BÁSICAS', [16, 185, 129]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Métrica', 'Valor']],
        body: [
          ['Pontos por Jogo', data.basicStats.ppg],
          ['Rebotes por Jogo', data.basicStats.rpg],
          ['Assistências por Jogo', data.basicStats.apg],
          ['FG%', data.basicStats.fg_percentage],
          ['3P%', data.basicStats.three_p_percentage],
          ['FT%', data.basicStats.ft_percentage]
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: margin, right: margin }
      });

      currentY = doc.lastAutoTable.finalY + 15;

      // Estatísticas Avançadas
      checkPageBreak(80);
      addSectionTitle('ESTATÍSTICAS AVANÇADAS', [245, 158, 11]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Métrica', 'Valor']],
        body: [
          ['TS%', data.advancedStats.trueShooting],
          ['eFG%', data.advancedStats.effectiveFG],
          ['PER', data.advancedStats.playerEfficiency],
          ['USG%', data.advancedStats.usageRate],
          ['ORtg', data.advancedStats.offensiveRating],
          ['DRtg', data.advancedStats.defensiveRating],
          ['TOV%', data.advancedStats.turnoverRate],
          ['AST%', data.advancedStats.assistRate],
          ['TRB%', data.advancedStats.totalReboundRate],
          ['STL%', data.advancedStats.stealRate],
          ['BLK%', data.advancedStats.blockRate]
        ],
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11] },
        margin: { left: margin, right: margin }
      });

      currentY = doc.lastAutoTable.finalY + 15;

      // Flags (Destaques e Alertas)
      if (data.flags.length > 0) {
        checkPageBreak(30 + data.flags.length * 8);
        addSectionTitle('DESTAQUES E ALERTAS', [168, 85, 247]);
        
        autoTable(doc, {
          startY: currentY,
          head: [['Tipo', 'Descrição']],
          body: data.flags.map(flag => [flag.type, flag.message]),
          theme: 'grid',
          headStyles: { fillColor: [168, 85, 247] },
          margin: { left: margin, right: margin },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 'auto' }
          }
        });

        currentY = doc.lastAutoTable.finalY + 15;
      }

      // Comparações NBA
      if (data.nbaComparisons.length > 0) {
        checkPageBreak(30 + data.nbaComparisons.length * 8);
        addSectionTitle('COMPARAÇÕES COM JOGADORES NBA', [6, 182, 212]);
        
        autoTable(doc, {
          startY: currentY,
          head: [['Jogador', 'Similaridade', 'Sucesso na Carreira']],
          body: data.nbaComparisons.map(comp => [comp.name, comp.similarity, comp.careerSuccess]),
          theme: 'grid',
          headStyles: { fillColor: [6, 182, 212] },
          margin: { left: margin, right: margin }
        });

        currentY = doc.lastAutoTable.finalY + 15;
      }

      // Análise Detalhada do Jogador
      console.log('🔧 Verificando análise detalhada...', data.detailedAnalysis ? 'EXISTE' : 'NÃO EXISTE');
      if (data.detailedAnalysis) {
        checkPageBreak(50);
        addSectionTitle('ANÁLISE DETALHADA DO JOGADOR', [139, 69, 19]);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        // Quebrar o texto em linhas que cabem na página
        const maxWidth = pageWidth - (2 * margin);
        const lines = doc.splitTextToSize(data.detailedAnalysis, maxWidth);
        
        lines.forEach(line => {
          checkPageBreak(8);
          doc.text(line, margin, currentY);
          currentY += 6;
        });
        
        currentY += 10;
        console.log('✅ Análise detalhada adicionada ao PDF');
      }

      // Footer
      console.log('📋 Adicionando footer...');
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
        doc.text(`Gerado por prospectRadar em ${new Date().toLocaleDateString('pt-BR')}`, margin, pageHeight - 10);
      }
      console.log('✅ Footer adicionado');

      const fileName = `${prospect.name.replace(/\s+/g, '_')}_Relatorio_Completo.pdf`;
      console.log('💾 Salvando PDF:', fileName);
      doc.save(fileName);
      console.log('🎉 PDF exportado com sucesso!');

      return { success: true };
    } catch (error) {
      console.error('❌ Erro na exportação PDF:', error);
      setExportError('Erro ao exportar PDF: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsExporting(false);
    }
  };

  // Exportação de Imagem profissional (card de scout)
  const exportToImage = async (prospect, evaluation, flags, comparablePlayers) => {
    try {
      setIsExporting(true);
      setExportError(null);

      const data = compileProspectData(prospect, evaluation, flags, comparablePlayers);

      // Criar um canvas temporário com layout profissional
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Configurar dimensões para social media (ex: 1200x1600 para Instagram)
      canvas.width = 1200;
      canvas.height = 1600; 

      // Fundo branco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Header
      let currentY = 80;
      const headerLeftX = 50;
      const headerCenter = canvas.width / 2;

      // "prospect" em laranja
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f97316'; // orange-500
      ctx.fillText('prospect', headerLeftX, currentY);

      // "Radar" em azul
      const prospectTextWidth = ctx.measureText('prospect').width;
      ctx.fillStyle = '#2563eb'; // blue-600
      ctx.fillText('Radar', headerLeftX + prospectTextWidth, currentY);

      // Nome do prospecto (centralizado)
      ctx.fillStyle = '#1a202c';
      ctx.font = 'bold 56px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.basicInfo.name || 'N/A', headerCenter, currentY + 60);
      
      ctx.font = '32px Arial, sans-serif';
      ctx.fillStyle = '#4a5568';
      currentY += 105;
      ctx.fillText(`${data.basicInfo.position || 'N/A'} | ${data.basicInfo.team || 'N/A'}`, headerCenter, currentY);

      // Linha divisória
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      currentY += 30;
      ctx.moveTo(50, currentY);
      ctx.lineTo(canvas.width - 50, currentY);
      ctx.stroke();

      // Radar Score Section (Two Columns)
      currentY += 60;
      const radarSectionY = currentY;
      const radarLeftColumnX = 100;
      const radarRightColumnX = canvas.width / 2 + 50;

      // Initialize chart dimensions with default values
      let chartWidth = 450;
      let chartHeight = 337;

      // Radar Chart (Left Column)
      const radarChartImage = await captureElement('radar-chart-container');
      if (radarChartImage) {
        const img = new Image();
        img.src = radarChartImage;
        await new Promise(resolve => img.onload = resolve); 

        // Update chart dimensions if captured successfully
        // chartWidth and chartHeight are already defined above
        ctx.drawImage(img, radarLeftColumnX, radarSectionY, chartWidth, chartHeight);
      } else {
        ctx.fillStyle = '#e53e3e';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Radar Score Chart indisponível', radarLeftColumnX, radarSectionY + 100);
      }

      // Radar Analysis (Right Column)
      let radarAnalysisY = radarSectionY + 20; // Adjust starting Y for right column
      ctx.textAlign = 'left';

      // Função para quebrar texto
      const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let testLine;
        let metrics;
        let testWidth;
        for (let n = 0; n < words.length; n++) {
          testLine = line + words[n] + ' ';
          metrics = context.measureText(testLine);
          testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
        return y + lineHeight;
      };

      // Projeção de Draft
      ctx.fillStyle = '#e53e3e';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText('PROJEÇÃO DE DRAFT', radarRightColumnX, radarAnalysisY);
      
      radarAnalysisY += 45;
      ctx.fillStyle = '#1a202c';
      ctx.font = 'bold 36px Arial, sans-serif'; // Reduced font size
      const projectionText = data.radarAnalysis.draftProjection || 'N/A';
      const projectionMaxWidth = (canvas.width / 2) - 100;
      radarAnalysisY = wrapText(ctx, projectionText, radarRightColumnX, radarAnalysisY, projectionMaxWidth, 40); // Use wrapText
      
      radarAnalysisY += 15; // Adjust space after projection
      ctx.font = '24px Arial, sans-serif';
      ctx.fillStyle = '#4a5568';
      ctx.fillText(`Range: ${data.radarAnalysis.draftRange || 'N/A'}`, radarRightColumnX, radarAnalysisY);

      // NBA Readiness
      radarAnalysisY += 60;
      ctx.fillStyle = '#2b6cb0';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText('PRONTIDÃO PARA NBA', radarRightColumnX, radarAnalysisY);
      
      radarAnalysisY += 35;
      ctx.fillStyle = '#1a202c';
      ctx.font = '36px Arial, sans-serif';
      ctx.fillText(data.radarAnalysis.readiness || 'N/A', radarRightColumnX, radarAnalysisY);

      // Total Potential Score
      radarAnalysisY += 60;
      ctx.fillStyle = '#2b6cb0';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.fillText('SCORE TOTAL (POTENCIAL)', radarRightColumnX, radarAnalysisY);
      
      radarAnalysisY += 35;
      ctx.fillStyle = '#1a202c';
      ctx.font = '36px Arial, sans-serif';
      ctx.fillText(data.radarAnalysis.potentialScore || 'N/A', radarRightColumnX, radarAnalysisY);

      // Adjust currentY after radar section with more space
      currentY = Math.max(radarSectionY + chartHeight, radarAnalysisY) + 120;

      // Informações Básicas, Estatísticas Básicas, Estatísticas Avançadas, Flags
      const column1X = 100;
      const column2X = canvas.width / 2 + 50;
      let columnY = currentY;

      // Função auxiliar para desenhar seção
      const drawSection = (title, items, x, y, titleColor = '#2b6cb0', itemColor = '#1a202c', titleFont = 'bold 36px Arial, sans-serif', itemFont = '28px Arial, sans-serif') => {
        ctx.fillStyle = titleColor;
        ctx.font = titleFont;
        ctx.textAlign = 'left';
        ctx.fillText(title, x, y);
        y += 50;
        ctx.fillStyle = itemColor;
        ctx.font = itemFont;
        items.forEach(item => {
          ctx.fillText(item, x, y);
          y += 40;
        });
        return y;
      };

      // Informações Básicas
      columnY = drawSection('INFORMAÇÕES BÁSICAS', [
        `Idade: ${data.basicInfo.age || 'N/A'} anos`,
        `Altura: ${data.basicInfo.height || 'N/A'}`,
        `Peso: ${data.basicInfo.weight || 'N/A'}`,
        `Nacionalidade: ${data.basicInfo.nationality || 'N/A'}`,
      ], column1X, columnY);

      // Estatísticas Básicas
      columnY += 80; // Increased spacing
      columnY = drawSection('ESTATÍSTICAS BÁSICAS', [
        `PPG: ${data.basicStats.ppg || 'N/A'}`,
        `RPG: ${data.basicStats.rpg || 'N/A'}`,
        `APG: ${data.basicStats.apg || 'N/A'}`,
        `FG%: ${data.basicStats.fg_percentage || 'N/A'}`,
        `3P%: ${data.basicStats.three_p_percentage || 'N/A'}`,
        `FT%: ${data.basicStats.ft_percentage || 'N/A'}`,
      ], column1X, columnY);

      // Estatísticas Avançadas (segunda coluna)
      let advancedStatsY = currentY;
      advancedStatsY = drawSection('ESTATÍSTICAS AVANÇADAS', [
        `TS%: ${data.advancedStats.trueShooting || 'N/A'}`,
        `eFG%: ${data.advancedStats.effectiveFG || 'N/A'}`,
        `PER: ${data.advancedStats.playerEfficiency || 'N/A'}`,
        `USG%: ${data.advancedStats.usageRate || 'N/A'}`,
        `ORtg: ${data.advancedStats.offensiveRating || 'N/A'}`,
        `DRtg: ${data.advancedStats.defensiveRating || 'N/A'}`,
        `TOV%: ${data.advancedStats.turnoverRate || 'N/A'}`,
        `AST%: ${data.advancedStats.assistRate || 'N/A'}`,
        `TRB%: ${data.advancedStats.totalReboundRate || 'N/A'}`,
        `STL%: ${data.advancedStats.stealRate || 'N/A'}`,
        `BLK%: ${data.advancedStats.blockRate || 'N/A'}`,
      ], column2X, advancedStatsY);

      // Flags (terceira coluna, ou abaixo das avançadas se não houver espaço)
      let flagsY = Math.max(columnY, advancedStatsY) + 60;
      if (data.flags && data.flags.length > 0) {
        ctx.fillStyle = '#2b6cb0';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('DESTAQUES E ALERTAS', column1X, flagsY);
        flagsY += 50;
        ctx.font = '28px Arial, sans-serif';
        data.flags.slice(0, 4).forEach(flag => {
          ctx.fillStyle = flag.type === 'Alerta' ? '#e53e3e' : '#38a169';
          ctx.fillText(`• ${flag.message}`, column1X, flagsY);
          flagsY += 40;
        });
      }

      // Footer
      const footerY = canvas.height - 60;
      ctx.fillStyle = '#718096';
      ctx.font = '20px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} | prospectRadar.com`, canvas.width / 2, footerY);
      
      // Converter para blob e baixar
      canvas.toBlob((blob) => {
        const fileName = `${prospect.name.replace(/\s+/g, '_')}_Scout_Card.png`;
        saveAs(blob, fileName);
      });

      return { success: true };
    } catch (error) {
      console.error('Erro detalhado na exportação de imagem:', error);
      setExportError('Erro ao exportar como imagem: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportToImage,
    isExporting,
    exportError,
    setExportError
  };
};

export default useAdvancedExport;
