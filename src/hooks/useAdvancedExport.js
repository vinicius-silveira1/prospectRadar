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
        weight: typeof prospect.weight === 'object' ? `${prospect.weight?.us} lbs (${prospect.weight?.intl} kg)` : prospect.weight || 'N/A',
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

      // Estatísticas Avançadas - versão simplificada e segura
      advancedStats: {
        trueShooting: (() => {
          try {
            return prospect.ts_percentage ? (prospect.ts_percentage * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        effectiveFG: (() => {
          try {
            return prospect.efg_percentage ? (prospect.efg_percentage * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        playerEfficiency: prospect.per?.toFixed(2) || 'N/A',
        usageRate: (() => {
          try {
            return prospect.usg_percentage ? (prospect.usg_percentage * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        offensiveRating: prospect.ortg?.toFixed(1) || 'N/A',
        defensiveRating: prospect.drtg?.toFixed(1) || 'N/A',
        turnoverRate: (() => {
          try {
            return prospect.tov_percentage ? (prospect.tov_percentage * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        assistRate: (() => {
          try {
            return prospect.ast_percentage ? (prospect.ast_percentage * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        totalReboundRate: (() => {
          try {
            return prospect.trb_percentage ? (prospect.trb_percentage * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        stealRate: (() => {
          try {
            return prospect.stl_percentage ? (prospect.stl_percentage * 100).toFixed(1) + '%' : 'N/A';
          } catch (e) {
            return 'N/A';
          }
        })(),
        blockRate: (() => {
          try {
            return prospect.blk_percentage ? (prospect.blk_percentage * 100).toFixed(1) + '%' : 'N/A';
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

      // Análise Detalhada - tratamento seguro
      detailedAnalysis: (() => {
        try {
          const name = prospect?.name || 'Prospecto';
          const projection = evaluation?.draftProjection?.description || 'N/A';
          const positiveFlags = flags.filter(f => f?.type === 'Destaque' || f?.type === 'green').slice(0, 3);
          const negativeFlags = flags.filter(f => f?.type === 'Alerta' || f?.type === 'red').slice(0, 2);
          
          return `${name} é um prospect com perfil ${projection.toLowerCase()}.

PONTOS FORTES: ${positiveFlags.length > 0 ? positiveFlags.map(f => f?.message || '').join(', ') : 'Aspectos positivos identificados'}.

ÁREAS DE DESENVOLVIMENTO: ${negativeFlags.length > 0 ? negativeFlags.map(f => f?.message || '').join(', ') : 'Aspectos em desenvolvimento identificados'}.

PROJEÇÃO NBA: ${projection} com potencial de crescimento a longo prazo.`;
        } catch (e) {
          return `${prospect?.name || 'Prospecto'} é um jogador com potencial interessante para o próximo nível. Análise detalhada disponível na plataforma.`;
        }
      })(),

      // Áreas de melhoria - tratamento seguro
      improvementAreas: (() => {
        try {
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
          ['Prontidão NBA', data.radarAnalysis.nbaReadiness],
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
          ['TS%', data.advancedStats.ts_percent],
          ['PER', data.advancedStats.per],
          ['USG%', data.advancedStats.usg_percent],
          ['ORtg', data.advancedStats.ortg],
          ['DRtg', data.advancedStats.drtg],
          ['AST%', data.advancedStats.ast_percent],
          ['TRB%', data.advancedStats.trb_percent]
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

      // Pontos a Melhorar (se disponíveis)
      if (data.improvementAreas.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(229, 62, 62);
        doc.text('PONTOS A MELHORAR:', margin, currentY);
        currentY += 8;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        data.improvementAreas.forEach(area => {
          checkPageBreak(8);
          doc.text(`⚠ ${area}`, margin, currentY);
          currentY += 8;
        });
        
        currentY += 10;
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
      
      // Configurar dimensões (formato card profissional)
      canvas.width = 1200;
      canvas.height = 1600;
      
      // Fundo com gradiente
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#1a202c');
      bgGradient.addColorStop(0.5, '#2d3748');
      bgGradient.addColorStop(1, '#4a5568');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PROSPECT RADAR', canvas.width / 2, 50);
      
      ctx.font = '16px Arial, sans-serif';
      ctx.fillStyle = '#cbd5e0';
      ctx.fillText('Relatório de Scouting', canvas.width / 2, 75);
      
      // Card principal
      const cardY = 110;
      const cardHeight = canvas.height - 160;
      const cardPadding = 40;
      
      // Sombra do card
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(cardPadding + 5, cardY + 5, canvas.width - (cardPadding * 2), cardHeight);
      
      // Card branco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cardPadding, cardY, canvas.width - (cardPadding * 2), cardHeight);
      
      // Nome do jogador
      ctx.fillStyle = '#1a202c';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      let nameY = cardY + 60;
      ctx.fillText(prospect.name || 'N/A', canvas.width / 2, nameY);
      
      // Posição e time
      ctx.font = '20px Arial, sans-serif';
      ctx.fillStyle = '#4a5568';
      const subtitle = `${prospect.position || 'N/A'} | ${prospect.team || 'N/A'}`;
      nameY += 35;
      ctx.fillText(subtitle, canvas.width / 2, nameY);
      
      // Linha divisória
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      nameY += 25;
      ctx.moveTo(cardPadding + 30, nameY);
      ctx.lineTo(canvas.width - cardPadding - 30, nameY);
      ctx.stroke();
      
      // Projeção de Draft - destaque
      nameY += 40;
      ctx.fillStyle = '#e53e3e';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PROJEÇÃO DE DRAFT', canvas.width / 2, nameY);
      
      nameY += 35;
      ctx.fillStyle = '#1a202c';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText(data.radarAnalysis.draftProjection || 'N/A', canvas.width / 2, nameY);
      
      nameY += 30;
      ctx.font = '18px Arial, sans-serif';
      ctx.fillStyle = '#4a5568';
      ctx.fillText(`Range: ${data.radarAnalysis.draftRange || 'N/A'}`, canvas.width / 2, nameY);
      
      // Seção de informações (duas colunas)
      nameY += 50;
      const leftX = cardPadding + 30;
      const rightX = canvas.width / 2 + 20;
      
      // Coluna esquerda - Informações básicas
      ctx.textAlign = 'left';
      ctx.fillStyle = '#2b6cb0';
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillText('INFORMAÇÕES BÁSICAS', leftX, nameY);
      
      nameY += 30;
      ctx.fillStyle = '#1a202c';
      ctx.font = '16px Arial, sans-serif';
      
      const basicInfo = [
        `Idade: ${prospect.age || 'N/A'} anos`,
        `Altura: ${data.basicInfo.height || 'N/A'}`,
        `Peso: ${data.basicInfo.weight || 'N/A'}`,
        `Potencial: ${data.radarAnalysis.potentialScore || 'N/A'}`,
        `Confiança: ${data.radarAnalysis.confidenceScore || 'N/A'}`
      ];
      
      basicInfo.forEach(info => {
        ctx.fillText(info, leftX, nameY);
        nameY += 22;
      });
      
      // Coluna direita - Estatísticas
      let rightY = nameY - (basicInfo.length * 22) - 30;
      ctx.fillStyle = '#2b6cb0';
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.fillText('ESTATÍSTICAS', rightX, rightY);
      
      rightY += 30;
      ctx.fillStyle = '#1a202c';
      ctx.font = '16px Arial, sans-serif';
      
      const stats = [
        `PPG: ${data.basicStats.ppg || 'N/A'}`,
        `RPG: ${data.basicStats.rpg || 'N/A'}`,
        `APG: ${data.basicStats.apg || 'N/A'}`,
        `FG%: ${data.basicStats.fg_percentage || 'N/A'}`,
        `3P%: ${data.basicStats.three_p_percentage || 'N/A'}`
      ];
      
      stats.forEach(stat => {
        ctx.fillText(stat, rightX, rightY);
        rightY += 22;
      });
      
      // Flags (se houver)
      nameY = Math.max(nameY, rightY) + 30;
      if (data.flags && data.flags.length > 0) {
        ctx.fillStyle = '#2b6cb0';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DESTAQUES E ALERTAS', canvas.width / 2, nameY);
        
        nameY += 30;
        ctx.textAlign = 'left';
        ctx.font = '14px Arial, sans-serif';
        
        data.flags.slice(0, 3).forEach(flag => {
          ctx.fillStyle = flag.type === 'Alerta' ? '#e53e3e' : '#38a169';
          ctx.fillText(`• ${flag.message}`, leftX, nameY);
          nameY += 25;
        });
      }
      
      // Comparações NBA
      nameY += 20;
      if (data.nbaComparisons && data.nbaComparisons.length > 0) {
        ctx.fillStyle = '#2b6cb0';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('COMPARAÇÕES NBA', canvas.width / 2, nameY);
        
        nameY += 30;
        ctx.textAlign = 'left';
        ctx.font = '16px Arial, sans-serif';
        ctx.fillStyle = '#1a202c';
        
        data.nbaComparisons.slice(0, 2).forEach((comp, index) => {
          const compText = `${index + 1}. ${comp.name} (${comp.similarity})`;
          ctx.fillText(compText, leftX, nameY);
          nameY += 25;
        });
      }
      
      // Footer
      const footerY = canvas.height - 60;
      ctx.fillStyle = '#718096';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} | prospectRadar.com`, canvas.width / 2, footerY);
      
      // Converter para blob e baixar
      canvas.toBlob((blob) => {
        const fileName = `${prospect.name.replace(/\s+/g, '_')}_Scout_Card.png`;
        saveAs(blob, fileName);
      });

      return { success: true };
    } catch (error) {
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
