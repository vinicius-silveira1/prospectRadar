import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import useProspectNotes from './useProspectNotes';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { loadUserNotes } = useProspectNotes();

  // Função auxiliar para calcular idade
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Função auxiliar para formatar dados do prospect
  const formatProspectData = async (prospect) => {
    try {
      const notes = await loadUserNotes();
      const prospectNote = notes?.find(note => note.prospect_id === prospect.id);
      
      return {
        nome: prospect.name || 'N/A',
        idade: calculateAge(prospect.birth_date),
        posicao: prospect.position || 'N/A',
        altura: prospect.height_cm ? `${prospect.height_cm} cm` : 'N/A',
        peso: prospect.weight_kg ? `${prospect.weight_kg} kg` : 'N/A',
        universidade: prospect.college || prospect.school || 'N/A',
        nacionalidade: prospect.nationality || 'N/A',
        radarScore: prospect.radar_score || 'N/A',
        pontos: prospect.stats?.points || 'N/A',
        rebotes: prospect.stats?.rebounds || 'N/A',
        assistencias: prospect.stats?.assists || 'N/A',
        anotacoes: prospectNote?.notes || 'Sem anotações'
      };
    } catch (error) {
      console.error('Erro ao formatar dados do prospect:', error);
      // Fallback sem anotações se houver erro
      return {
        nome: prospect.name || 'N/A',
        idade: calculateAge(prospect.birth_date),
        posicao: prospect.position || 'N/A',
        altura: prospect.height_cm ? `${prospect.height_cm} cm` : 'N/A',
        peso: prospect.weight_kg ? `${prospect.weight_kg} kg` : 'N/A',
        universidade: prospect.college || prospect.school || 'N/A',
        nacionalidade: prospect.nationality || 'N/A',
        radarScore: prospect.radar_score || 'N/A',
        pontos: prospect.stats?.points || 'N/A',
        rebotes: prospect.stats?.rebounds || 'N/A',
        assistencias: prospect.stats?.assists || 'N/A',
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

  // Exportar para PDF
  const exportToPDF = async (prospects, filename = 'prospects') => {
    try {
      setIsExporting(true);
      
      const doc = new jsPDF();
      
      // Configurar fonte para suportar acentos
      doc.setFont('helvetica');
      
      // Header do documento
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246); // Blue-600
      doc.text('ProspectRadar - Relatório de Prospects', 20, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      doc.text(`Total de prospects: ${prospects.length}`, 20, 45);
      
      // Preparar dados para a tabela
      const formattedData = await Promise.all(
        prospects.map(prospect => formatProspectData(prospect))
      );

      const tableData = formattedData.map(prospect => [
        prospect.nome,
        prospect.idade,
        prospect.posicao,
        prospect.altura,
        prospect.universidade,
        prospect.radarScore,
        prospect.pontos,
        prospect.rebotes,
        prospect.assistencias
      ]);

      // Configurar tabela
      autoTable(doc, {
        head: [['Nome', 'Idade', 'Posição', 'Altura', 'Universidade', 'Radar Score', 'PTS', 'REB', 'AST']],
        body: tableData,
        startY: 60,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246], // Blue-600
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Slate-50
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Nome
          1: { cellWidth: 15 }, // Idade
          2: { cellWidth: 20 }, // Posição
          3: { cellWidth: 18 }, // Altura
          4: { cellWidth: 30 }, // Universidade
          5: { cellWidth: 20 }, // Radar Score
          6: { cellWidth: 15 }, // PTS
          7: { cellWidth: 15 }, // REB
          8: { cellWidth: 15 }  // AST
        }
      });

      // Adicionar anotações em página separada se existirem
      const prospectsWithNotes = formattedData.filter(p => p.anotacoes !== 'Sem anotações');
      
      if (prospectsWithNotes.length > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('Anotações dos Prospects', 20, 25);
        
        let yPosition = 40;
        
        prospectsWithNotes.forEach(prospect => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 25;
          }
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`${prospect.nome}:`, 20, yPosition);
          
          const splitNotes = doc.splitTextToSize(prospect.anotacoes, 170);
          doc.setFontSize(10);
          doc.setTextColor(100, 116, 139);
          doc.text(splitNotes, 20, yPosition + 7);
          
          yPosition += 7 + (splitNotes.length * 4) + 10;
        });
      }

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
