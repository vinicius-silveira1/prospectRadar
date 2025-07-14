// 📄 pdfExporter.js - Utilitário para exportar Mock Draft em PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class MockDraftPDFExporter {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  /**
   * Exporta o Mock Draft completo em PDF
   * @param {Object} draftData - Dados do draft do hook useMockDraft
   * @param {Object} options - Opções de exportação
   */
  async exportMockDraftToPDF(draftData, options = {}) {
    const {
      title = 'Mock Draft NBA 2026',
      subtitle = 'ProspectRadar - Análise Completa',
      includeStats = true,
      includeProspectDetails = false, // Desabilitado para manter uma página
      format = 'table' // Novo formato padrão: tabela
    } = options;

    try {
      // Validação de dados de entrada
      if (!draftData) {
        throw new Error('Dados do draft não fornecidos');
      }

      if (!draftData.draftBoard || !Array.isArray(draftData.draftBoard)) {
        throw new Error('Draft board inválido ou ausente');
      }

      // Verificar se há dados suficientes para exportar
      const draftedPicks = draftData.draftBoard.filter(pick => pick && pick.prospect);
      if (draftedPicks.length === 0) {
        throw new Error('Nenhum prospect foi draftado ainda');
      }

      const pdf = new jsPDF('portrait', 'mm', 'a4');
      let yPosition = this.margin;

      // Adicionar marca d'água do ProspectRadar
      this.addWatermark(pdf);

      // Apenas a tabela moderna - sem cabeçalhos ou seções extras
      yPosition = this.addDraftTable(pdf, draftData.draftBoard, yPosition);

      // Salvar PDF
      const fileName = `mock-draft-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      return {
        success: true,
        fileName,
        message: 'Mock Draft exportado com sucesso!'
      };

    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro ao exportar Mock Draft'
      };
    }
  }

  /**
   * Não adiciona cabeçalho - apenas retorna a posição inicial
   */
  addHeader(pdf, title, subtitle, yPosition) {
    // Sem cabeçalho - retorna posição inicial para maximizar espaço da tabela
    return yPosition;
  }

  /**
   * Adiciona marca d'água discreta do ProspectRadar
   */
  addWatermark(pdf) {
    // Marca d'água no canto inferior direito
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(180, 180, 180); // Cor cinza claro
    
    const watermarkText = 'ProspectRadar.com';
    const textWidth = pdf.getTextWidth(watermarkText);
    const x = this.pageWidth - this.margin - textWidth;
    const y = this.pageHeight - 5;
    
    pdf.text(watermarkText, x, y);
    
    // Reset cor para preto
    pdf.setTextColor(0, 0, 0);
  }

  /**
   * Adiciona informações gerais do draft
   */
  addDraftInfo(pdf, draftData, yPosition) {
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Informações do Draft', this.margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');

    // Verificações de segurança para os dados
    const draftBoard = draftData.draftBoard || [];
    const stats = draftData.stats || {};
    const totalPicked = stats.totalPicked || 0;
    const remaining = stats.remaining || 0;
    const timestamp = draftData.timestamp || new Date().toISOString();

    const info = [
      `Total de Picks: ${draftBoard.length}`,
      `Prospects Draftados: ${totalPicked}`,
      `Prospects Restantes: ${remaining}`,
      `Timestamp: ${new Date(timestamp).toLocaleString('pt-BR')}`
    ];

    info.forEach(line => {
      pdf.text(line, this.margin, yPosition);
      yPosition += 6;
    });

    return yPosition + 10;
  }

  /**
   * Adiciona estatísticas do draft
   */
  addStats(pdf, stats, yPosition) {
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Estatísticas por Posição', this.margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');

    // Verificação de segurança para stats
    const safeStats = stats || {};
    const byPosition = safeStats.byPosition || {};

    // Estatísticas por posição
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
    positions.forEach(pos => {
      const count = byPosition[pos] || 0;
      pdf.text(`${pos}: ${count} prospect${count !== 1 ? 's' : ''}`, this.margin, yPosition);
      yPosition += 6;
    });

    return yPosition + 10;
  }

  /**
   * Adiciona o draft board ao PDF
   */
  async addDraftBoard(pdf, draftBoard, yPosition, format) {
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Draft Board', this.margin, yPosition);
    yPosition += 10;

    if (format === 'compact') {
      return this.addCompactDraftBoard(pdf, draftBoard, yPosition);
    } else {
      return this.addProfessionalDraftBoard(pdf, draftBoard, yPosition);
    }
  }

  /**
   * Adiciona draft board em formato compacto
   */
  addCompactDraftBoard(pdf, draftBoard, yPosition) {
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');

    const draftedPicks = draftBoard.filter(pick => pick.prospect);
    
    draftedPicks.forEach((pick, index) => {
      if (yPosition > this.pageHeight - 30) {
        pdf.addPage();
        yPosition = this.margin;
      }

      const prospect = pick.prospect;
      const line = `${pick.pickNumber}. ${prospect.name} (${prospect.position}) - ${prospect.team || 'N/A'}`;
      
      pdf.text(line, this.margin, yPosition);
      yPosition += 6;
    });

    return yPosition;
  }

  /**
   * Adiciona draft board em formato profissional
   */
  addProfessionalDraftBoard(pdf, draftBoard, yPosition) {
    const draftedPicks = draftBoard.filter(pick => pick.prospect);
    const itemsPerPage = 10;
    
    for (let i = 0; i < draftedPicks.length; i += itemsPerPage) {
      if (i > 0) {
        pdf.addPage();
        yPosition = this.margin;
      }

      const pageItems = draftedPicks.slice(i, i + itemsPerPage);
      
      pageItems.forEach(pick => {
        yPosition = this.addProspectCard(pdf, pick, yPosition);
      });
    }

    return yPosition;
  }

  /**
   * Adiciona um card de prospect individual
   */
  addProspectCard(pdf, pick, yPosition) {
    const prospect = pick.prospect;
    const cardHeight = 25;

    // Verificar se cabe na página
    if (yPosition + cardHeight > this.pageHeight - this.margin) {
      pdf.addPage();
      yPosition = this.margin;
    }

    // Retângulo do card
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(248, 249, 250);
    pdf.rect(this.margin, yPosition, this.contentWidth, cardHeight, 'FD');

    // Pick number (círculo) - Com verificação de segurança
    const pickX = this.margin + 8;
    const pickY = yPosition + 12;
    pdf.setFillColor(59, 130, 246); // blue-500
    pdf.circle(pickX, pickY, 6, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    
    // Verificação segura para pickNumber
    const pickNumber = pick.pickNumber || pick.pick || '?';
    pdf.text(String(pickNumber), pickX - 3, pickY + 2);

    // Nome do prospect - Com verificação
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(prospect.name || 'Nome não disponível', this.margin + 20, yPosition + 8);

    // Posição e time - Com verificações
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(100, 100, 100);
    const position = prospect.position || 'N/A';
    const team = prospect.team || 'N/A';
    pdf.text(`${position} | ${team}`, this.margin + 20, yPosition + 15);

    // Nacionalidade (se disponível)
    if (prospect.nationality) {
      pdf.text(String(prospect.nationality), this.margin + 20, yPosition + 22);
    }

    // Ranking/Score (lado direito)
    if (prospect.prospectScore) {
      pdf.setTextColor(34, 197, 94); // green-500
      pdf.setFont(undefined, 'bold');
      pdf.text(`Score: ${prospect.prospectScore}`, this.pageWidth - this.margin - 30, yPosition + 12);
    }

    return yPosition + cardHeight + 5;
  }

  /**
   * Adiciona página com detalhes dos prospects
   */
  async addProspectDetails(pdf, draftBoard, yPosition) {
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Detalhes dos Prospects', this.margin, yPosition);
    yPosition += 15;

    const draftedPicks = draftBoard.filter(pick => pick.prospect);

    for (const pick of draftedPicks) {
      yPosition = this.addDetailedProspectInfo(pdf, pick, yPosition);
      
      // Verificar se precisa de nova página
      if (yPosition > this.pageHeight - 80) {
        pdf.addPage();
        yPosition = this.margin;
      }
    }

    return yPosition;
  }

  /**
   * Adiciona informações detalhadas de um prospect
   */
  addDetailedProspectInfo(pdf, pick, yPosition) {
    const prospect = pick.prospect;

    // Verificação de segurança para pickNumber
    const pickNumber = pick.pickNumber || pick.pick || '?';
    const prospectName = prospect.name || 'Nome não disponível';

    // Título do prospect
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(`${pickNumber}. ${prospectName}`, this.margin, yPosition);
    yPosition += 8;

    // Informações básicas - com verificações de segurança
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    const details = [
      `Posição: ${prospect.position || 'N/A'}`,
      `Time: ${prospect.team || 'N/A'}`,
      `Idade: ${prospect.age || 'N/A'}`,
      `Altura: ${prospect.height || 'N/A'}`,
      `Nacionalidade: ${prospect.nationality || 'N/A'}`
    ];

    details.forEach(detail => {
      pdf.text(detail, this.margin + 5, yPosition);
      yPosition += 5;
    });

    // Stats (se disponível) - com verificação robusta
    if (prospect.stats && typeof prospect.stats === 'object' && Object.keys(prospect.stats).length > 0) {
      yPosition += 3;
      pdf.setFont(undefined, 'bold');
      pdf.text('Estatísticas:', this.margin + 5, yPosition);
      yPosition += 5;
      
      pdf.setFont(undefined, 'normal');
      Object.entries(prospect.stats).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          pdf.text(`${key}: ${String(value)}`, this.margin + 10, yPosition);
          yPosition += 4;
        }
      });
    }

    // Linha separadora
    yPosition += 5;
    pdf.setDrawColor(230, 230, 230);
    pdf.line(this.margin, yPosition, this.pageWidth - this.margin, yPosition);
    
    return yPosition + 8;
  }

  /**
   * Captura elemento HTML e adiciona ao PDF
   */
  async captureElementToPDF(pdf, element, yPosition) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = this.contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Verificar se cabe na página
      if (yPosition + imgHeight > this.pageHeight - this.margin) {
        pdf.addPage();
        yPosition = this.margin;
      }

      pdf.addImage(imgData, 'PNG', this.margin, yPosition, imgWidth, imgHeight);
      return yPosition + imgHeight + 10;

    } catch (error) {
      console.error('Erro ao capturar elemento:', error);
      return yPosition;
    }
  }

  /**
   * Adiciona informações compactas do draft
   */
  addCompactDraftInfo(pdf, draftData, yPosition) {
    // Verificações de segurança para os dados
    const draftBoard = draftData.draftBoard || [];
    const stats = draftData.stats || {};
    const totalPicked = stats.totalPicked || 0;
    const remaining = stats.remaining || 0;

    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Resumo do Draft', this.margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');

    // Informações em uma linha compacta
    const info = `Picks: ${totalPicked} | Restantes: ${remaining} | Gerado: ${new Date().toLocaleDateString('pt-BR')}`;
    pdf.text(info, this.margin, yPosition);
    yPosition += 8;

    return yPosition;
  }

  /**
   * Adiciona estatísticas compactas
   */
  addCompactStats(pdf, stats, yPosition) {
    const safeStats = stats || {};
    const byPosition = safeStats.byPosition || {};

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('Por Posição:', this.margin, yPosition);
    
    // Estatísticas em uma linha
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
    const statsLine = positions.map(pos => `${pos}: ${byPosition[pos] || 0}`).join(' | ');
    
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(9);
    pdf.text(statsLine, this.margin + 25, yPosition);
    yPosition += 10;

    return yPosition;
  }

  /**
   * Adiciona uma tabela moderna em duas colunas com design único
   */
  addDraftTable(pdf, draftBoard, yPosition) {
    const draftedPicks = draftBoard.filter(pick => pick && pick.prospect);
    
    if (draftedPicks.length === 0) {
      // Mensagem elegante para estado vazio
      pdf.setFillColor(245, 245, 245);
      pdf.rect(this.margin, yPosition, this.contentWidth, 30, 'F');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'normal');
      const text = 'Nenhum prospect draftado ainda';
      const textWidth = pdf.getTextWidth(text);
      const centerX = (this.pageWidth - textWidth) / 2;
      pdf.text(text, centerX, yPosition + 20);
      return yPosition + 40;
    }

    // Configuração da tabela em duas colunas
    const tableMargin = 5;
    const columnWidth = (this.contentWidth - tableMargin) / 2;
    const rowHeight = 7;
    const headerHeight = 10;

    // Cores modernas e profissionais
    const colors = {
      primary: [59, 130, 246],     // Blue-500
      secondary: [15, 23, 42],     // Slate-900
      accent: [34, 197, 94],       // Green-500
      background: [248, 250, 252], // Slate-50
      border: [226, 232, 240],     // Slate-200
      text: [15, 23, 42],          // Slate-900
      textLight: [100, 116, 139]   // Slate-500
    };

    // Larguras das colunas simplificadas (ajustadas para melhor truncamento)
    const colWidths = {
      pick: 12,      // Pick #
      name: 40,      // Nome (reduzido para evitar overflow)
      position: 12,  // Posição
      team: 30       // Universidade (reduzido para forçar truncamento)
    };

    // Calcular quantos prospects cabem por coluna
    const availableHeight = this.pageHeight - yPosition - this.margin - 20;
    const maxRowsPerColumn = Math.floor(availableHeight / rowHeight);
    const totalRows = Math.min(draftedPicks.length, maxRowsPerColumn * 2);
    
    // Dividir os prospects em duas colunas
    const midPoint = Math.ceil(totalRows / 2);
    const leftColumn = draftedPicks.slice(0, midPoint);
    const rightColumn = draftedPicks.slice(midPoint, totalRows);

    // Função para desenhar uma coluna
    const drawColumn = (prospects, startX, columnIndex) => {
      let currentY = yPosition;

      // Cabeçalho da coluna
      pdf.setFillColor(...colors.primary);
      pdf.rect(startX, currentY, columnWidth, headerHeight, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'bold');

      let headerX = startX + 2;
      // Cabeçalho "#" centralizado
      const hashText = '#';
      const hashWidth = pdf.getTextWidth(hashText);
      const hashCenterX = headerX + (colWidths.pick - hashWidth) / 2;
      pdf.text(hashText, hashCenterX, currentY + 6.5);
      headerX += colWidths.pick;
      
      pdf.text('PROSPECT', headerX, currentY + 6.5);
      headerX += colWidths.name;
      
      // Cabeçalho "POS" centralizado
      const posHeaderText = 'POS';
      const posHeaderWidth = pdf.getTextWidth(posHeaderText);
      const posHeaderCenterX = headerX + (colWidths.position - posHeaderWidth) / 2;
      pdf.text(posHeaderText, posHeaderCenterX, currentY + 6.5);
      headerX += colWidths.position;
      
      pdf.text('UNIVERSIDADE', headerX, currentY + 6.5);

      currentY += headerHeight;

      // Linhas da tabela
      prospects.forEach((pick, index) => {
        const prospect = pick.prospect;
        const globalIndex = columnIndex === 0 ? index : midPoint + index;
        const pickNumber = pick.pickNumber || pick.pick || (globalIndex + 1);
        
        // Fundo alternado
        if (index % 2 === 0) {
          pdf.setFillColor(...colors.background);
          pdf.rect(startX, currentY, columnWidth, rowHeight, 'F');
        }

        // Destaque para Top 5
        if (globalIndex < 5) {
          pdf.setFillColor(...colors.accent);
          pdf.rect(startX, currentY, 2, rowHeight, 'F');
        }

        let cellX = startX + 2;
        pdf.setTextColor(...colors.text);
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(8);
        
        // Pick number - centralizado na coluna
        const pickText = String(pickNumber);
        const pickWidth = pdf.getTextWidth(pickText);
        const pickCenterX = cellX + (colWidths.pick - pickWidth) / 2;
        pdf.text(pickText, pickCenterX, currentY + 4.5);
        cellX += colWidths.pick;
        
        // Nome do prospect - com truncamento mais agressivo
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(8);
        const name = prospect.name || 'N/A';
        const maxNameChars = 15; // Limite mais restritivo
        const truncatedName = name.length > maxNameChars ? name.substring(0, maxNameChars - 3) + '...' : name;
        pdf.text(truncatedName, cellX, currentY + 4.5);
        cellX += colWidths.name;
        
        // Posição com destaque - centralizada
        pdf.setTextColor(...colors.primary);
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(7.5);
        const posText = prospect.position || 'N/A';
        const posWidth = pdf.getTextWidth(posText);
        const posCenterX = cellX + (colWidths.position - posWidth) / 2;
        pdf.text(posText, posCenterX, currentY + 4.5);
        cellX += colWidths.position;
        
        // Universidade - com truncamento forçado
        pdf.setTextColor(...colors.textLight);
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(7);
        const team = prospect.team || 'N/A';
        const maxTeamChars = 10; // Limite bem restritivo
        const truncatedTeam = team.length > maxTeamChars ? team.substring(0, maxTeamChars - 3) + '...' : team;
        pdf.text(truncatedTeam, cellX, currentY + 4.5);

        currentY += rowHeight;
      });

      // Borda da coluna
      pdf.setDrawColor(...colors.border);
      pdf.setLineWidth(0.3);
      pdf.rect(startX, yPosition, columnWidth, headerHeight + (prospects.length * rowHeight), 'S');

      // Separadores verticais
      let separatorX = startX + colWidths.pick;
      for (let i = 0; i < 3; i++) {
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(230, 230, 230);
        pdf.line(separatorX, yPosition, 
                 separatorX, yPosition + headerHeight + (prospects.length * rowHeight));
        const colKeys = Object.keys(colWidths);
        if (i + 1 < colKeys.length) {
          separatorX += colWidths[colKeys[i + 1]];
        }
      }

      return currentY;
    };

    // Desenhar coluna esquerda
    const leftX = this.margin;
    const leftEndY = drawColumn(leftColumn, leftX, 0);

    // Desenhar coluna direita
    const rightX = this.margin + columnWidth + tableMargin;
    const rightEndY = drawColumn(rightColumn, rightX, 1);

    const finalY = Math.max(leftEndY, rightEndY);

    // Indicador de prospects restantes
    if (draftedPicks.length > totalRows) {
      const remaining = draftedPicks.length - totalRows;
      pdf.setFillColor(250, 250, 250);
      pdf.rect(this.margin, finalY + 5, this.contentWidth, 12, 'F');
      
      pdf.setTextColor(...colors.textLight);
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'italic');
      const moreText = `+ ${remaining} prospects adicionais não mostrados`;
      const textWidth = pdf.getTextWidth(moreText);
      const centerX = this.margin + (this.contentWidth - textWidth) / 2;
      pdf.text(moreText, centerX, finalY + 12);
      
      return finalY + 20;
    }

    return finalY + 10;
  }

  /**
   * Converte nacionalidade/bandeira para texto legível
   */
  getNationalityText(nationality) {
    if (!nationality) return 'N/A';

    // Mapeamento de bandeiras/códigos para nomes de países
    const countryMap = {
      '🇺🇸': 'USA',
      '🇧🇷': 'BRASIL',
      '🇫🇷': 'FRANÇA',
      '🇪🇸': 'ESPANHA',
      '🇷🇺': 'RÚSSIA',
      '🇮🇹': 'ITÁLIA',
      '🇵🇹': 'PORTUGAL',
      '🇷🇸': 'SÉRVIA',
      '🇮🇳': 'ÍNDIA',
      '🇬🇭': 'GANA',
      '🇨🇦': 'CANADÁ',
      'USA': 'USA',
      'Brazil': 'BRASIL',
      'France': 'FRANÇA',
      'Spain': 'ESPANHA',
      'Russia': 'RÚSSIA',
      'Italy': 'ITÁLIA',
      'Portugal': 'PORTUGAL',
      'Serbia': 'SÉRVIA',
      'India': 'ÍNDIA',
      'Ghana': 'GANA',
      'Canada': 'CANADÁ'
    };

    return countryMap[nationality] || nationality.toString().toUpperCase();
  }
}

// Exportar instância única
export const mockDraftPDFExporter = new MockDraftPDFExporter();

// Função helper para uso direto
export const exportMockDraftToPDF = async (draftData, options) => {
  return await mockDraftPDFExporter.exportMockDraftToPDF(draftData, options);
};

export default MockDraftPDFExporter;
