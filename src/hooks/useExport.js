import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import useProspectNotes from './useProspectNotes';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { loadUserNotes } = useProspectNotes();

  

  // Função auxiliar para formatar dados do prospect
  const formatProspectData = async (prospect) => {
    try {
      const notes = await loadUserNotes();
      const prospectNote = notes?.find(note => note.prospect_id === prospect.id);
      
      return {
        nome: prospect.name || 'N/A',
        idade: prospect.age || 'N/A',
        posicao: prospect.position || 'N/A',
        altura: prospect.height && typeof prospect.height === 'object' ? `${prospect.height.us} (${prospect.height.intl} cm)` : prospect.height || 'N/A',
        peso: prospect.weight && typeof prospect.weight === 'object' ? `${prospect.weight.us} lb (${prospect.weight.intl} kg)` : prospect.weight || 'N/A',
        universidade: prospect.college || prospect.school || 'N/A',
        nacionalidade: prospect.nationality || 'N/A',
        radarScore: prospect.radar_score || 'N/A',
        pontos: prospect.ppg || 'N/A',
        rebotes: prospect.rpg || 'N/A',
        assistencias: prospect.apg || 'N/A',
        anotacoes: prospectNote?.notes || 'Sem anotações'
      };
    } catch (error) {
      console.error('Erro ao formatar dados do prospect:', error);
      // Fallback sem anotações se houver erro
      return {
        nome: prospect.name || 'N/A',
        idade: prospect.age || 'N/A',
        posicao: prospect.position || 'N/A',
        altura: prospect.height && typeof prospect.height === 'object' ? `${prospect.height.us} (${prospect.height.intl} cm)` : prospect.height || 'N/A',
        peso: prospect.weight && typeof prospect.weight === 'object' ? `${prospect.weight.us} lb (${prospect.weight.intl} kg)` : prospect.weight || 'N/A',
        universidade: prospect.college || prospect.school || 'N/A',
        nacionalidade: prospect.nationality || 'N/A',
        radarScore: prospect.radar_score || 'N/A',
        pontos: prospect.ppg || 'N/A',
        rebotes: prospect.rpg || 'N/A',
        assistencias: prospect.apg || 'N/A',
        anotacoes: 'Sem anotações'
      };
    }
  };

  // Exportar para CSV
  const exportToCSV = async (prospects, filename = 'prospects') => {
    try {
      setIsExporting(true);
      
      const formattedData = await Promise.all(
        prospects.map(prospect => formatProspectData(prospect))
      );

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Prospects');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'text/csv;charset=utf-8;' });
      
      saveAs(data, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      return true;
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  // Exportar para Excel
  const exportToExcel = async (prospects, filename = 'prospects') => {
    try {
      setIsExporting(true);
      
      const formattedData = await Promise.all(
        prospects.map(prospect => formatProspectData(prospect))
      );

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      
      // Configurar larguras das colunas
      const columnWidths = [
        { wch: 20 }, // nome
        { wch: 8 },  // idade
        { wch: 12 }, // posicao
        { wch: 10 }, // altura
        { wch: 10 }, // peso
        { wch: 25 }, // universidade
        { wch: 15 }, // nacionalidade
        { wch: 12 }, // radarScore
        { wch: 10 }, // pontos
        { wch: 10 }, // rebotes
        { wch: 12 }, // assistencias
        { wch: 30 }  // anotacoes
      ];
      
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Prospects');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      
      saveAs(data, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      return true;
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  // Exportar para PDF com gaming design melhorado
  const exportToPDF = async (prospects, filename = 'prospects') => {
    try {
      setIsExporting(true);
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.width;
      let currentY = 30;

      // Gaming Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(251, 191, 36); // yellow-400
      doc.text('prospectRadar', 20, 25);
      
      doc.setFontSize(16);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('• ANÁLISE PROFISSIONAL DE PROSPECTS', 20, 35);
      
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('RELATÓRIO DE PROSPECTS', 20, 45);

      currentY = 60;

      // Preparar dados formatados
      const formattedData = await Promise.all(
        prospects.map(prospect => formatProspectData(prospect))
      );

      // Gaming table com cores atualizadas
      autoTable(doc, {
        startY: currentY,
        head: [['Nome', 'Pos.', 'Idade', 'Altura', 'Radar Score', 'PPG', 'RPG', 'APG']],
        body: formattedData.map(prospect => [
          prospect.nome,
          prospect.posicao,
          prospect.idade,
          prospect.altura,
          prospect.radarScore,
          prospect.pontos,
          prospect.rebotes,
          prospect.assistencias
        ]),
        theme: 'grid',
        headStyles: { 
          fillColor: [59, 130, 246], // blue-500
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // slate-50
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 }
        }
      });

      // Gaming Footer
      const footerY = doc.internal.pageSize.height - 20;
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} | prospectRadar.com | O futuro do scouting brasileiro`, 20, footerY);

      doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportToCSV,
    exportToExcel,
    exportToPDF
  };
};
