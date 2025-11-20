import React, { useMemo } from 'react';

// Export-focused view: receives already ordered board (array with tier info) and tiers definition.
// Props:
// - board: [{ id, name, position, radar_score, tier, ... }]
// - tiers: [{ id, label, color }]
// - boardName: string
// - draftClass: string|number
// - options: { showScore, showPosition, showTrending }
// - trendingMap (optional): { id: { direction, change } }
// Rendering aims for deterministic, static layout (no animations) for html2canvas.

const ExportBoardView = ({ board = [], tiers = [], boardName = 'Big Board', draftClass = '2026', options = {}, trendingMap = {}, maxItems = 30, density = 'normal' }) => {
  const { showScore = true, showPosition = true, showTrending = true } = options; // logo & watermark sempre ativos

  const limitedBoard = useMemo(() => {
    if (!Array.isArray(board)) return [];
    return board.slice(0, Math.max(1, maxItems || 30));
  }, [board, maxItems]);

  const grouped = useMemo(() => {
    const g = {};
    limitedBoard.forEach((p, idx) => {
      const t = p.tier || (tiers[0]?.id) || 'tier1';
      if (!g[t]) g[t] = [];
      g[t].push({ ...p, boardIndex: idx });
    });
    return g;
  }, [limitedBoard, tiers]);

  const totalByPosition = useMemo(() => {
    return limitedBoard.reduce((acc, p) => {
      if (p.position) acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {});
  }, [limitedBoard]);

  const positionSummary = Object.entries(totalByPosition).sort((a,b) => b[1]-a[1]).map(([pos, count]) => `${pos} ${count}`).join(' | ');

  const today = new Date();
  const dateStr = today.toISOString().slice(0,10);

  // getColumns removido no layout em colunas por tier

  const scoreFmt = (s) => {
    if (s == null) return '--';
    return (s).toFixed(2); // já está em escala 0-1
  };

  const getTierCols = (n) => {
    if (n <= 1) return 'grid-cols-1';
    if (n === 2) return 'grid-cols-2';
    if (n === 3) return 'grid-cols-3';
    if (n === 4) return 'grid-cols-4';
    if (n === 5) return 'grid-cols-5';
    return 'grid-cols-6';
  };

  return (
    <div className={`export-board-wrapper font-sans text-white w-full ${density==='compact' ? 'max-w-[1500px] p-6' : 'max-w-[1400px] p-8'} mx-auto bg-[#0B0B0F] relative`}>
      {/* Background grid sutil como mock draft */}
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)',backgroundSize:'22px 22px'}} />
      {/* Header estilo mock draft com logo */}
      <div className="relative z-10 mb-5 rounded-xl p-4 bg-gradient-to-r from-orange-500 via-purple-600 to-indigo-600 shadow-lg border border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="prospectRadar Logo" className="w-16 h-16 drop-shadow-lg" />
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none flex items-center gap-2">
                <span className="bg-white/10 backdrop-blur px-2.5 py-1 rounded-lg">{boardName}</span>
                <span className="text-yellow-300">{draftClass}</span>
              </h1>
              <p className="mt-1 text-[11px] font-medium opacity-90">Gerado {new Date().toLocaleDateString('pt-BR')} • {limitedBoard.length} prospectos</p>
              {positionSummary && <p className="mt-0.5 text-[10px] opacity-75">Posições: {positionSummary}</p>}
            </div>
          </div>
          <div className="text-right flex-1 min-w-[180px]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-[10px] font-semibold tracking-wide">
              <span className="text-yellow-200">{limitedBoard.length}</span> TOTAL
            </div>
          </div>
        </div>
      </div>

      {/* Tiers em colunas */}
      <div className={`grid ${getTierCols(tiers.length)} ${density==='compact' ? 'gap-3' : 'gap-4'}`}>
        {tiers.map(tier => {
          const list = grouped[tier.id] || [];
          return (
            <div key={tier.id} className={`rounded-xl overflow-hidden shadow ring-1 ring-white/10 bg-gradient-to-r ${tier.color}`}>
              {/* Cabeçalho do tier com overlay escuro para contraste */}
              <div className="p-3 border-b border-white/10 backdrop-brightness-[0.85] bg-black/20">
                <h2 className="text-sm font-bold uppercase tracking-wide flex items-center justify-between">
                  <span>{tier.label}</span>
                  <span className="text-[10px] font-normal opacity-90">{list.length}</span>
                </h2>
              </div>
              {/* Lista empilhada dos prospects do tier */}
              <div className={`p-3 ${density==='compact' ? 'space-y-1.5' : 'space-y-2'}`}>
                {list.length === 0 && (
                  <div className="text-[10px] opacity-60">(vazio)</div>
                )}
                {list.map(p => {
                  const trend = trendingMap[p.id];
                  return (
                    <div
                      key={p.id || p.slug}
                      className={[
                        'rounded-md','bg-black/35','border','border-white/10',
                        density==='compact' ? 'px-2 py-1.5' : 'px-3 py-2',
                        'flex','flex-col','gap-1'
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={[
                            density==='compact' ? 'text-[11px]' : 'text-[12px]', // fonte ampliada para maior legibilidade na imagem exportada
                            'font-semibold',
                            'leading-[1.3]',
                            'whitespace-nowrap','max-w-[185px]'
                          ].join(' ')}
                          style={{display:'inline-block',paddingBottom:'2px'}}
                        >
                          #{p.boardIndex+1} {p.name}
                        </span>
                        {showTrending && trend && (
                          <span
                            className={[
                              density==='compact' ? 'text-[9px]' : 'text-[10px]',
                              'font-medium',
                              trend.direction==='up' ? 'text-green-400' : 'text-red-400'
                            ].join(' ')}
                          >
                            {trend.direction==='up' ? '▲' : '▼'}{Math.abs(trend.change).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div
                        className={[
                          'flex','flex-wrap','items-center','gap-2',
                          density==='compact' ? 'text-[9px]' : 'text-[9.5px]',
                          'opacity-80'
                        ].join(' ')}
                      >
                        {showPosition && p.position && <span>{p.position}</span>}
                        {showScore && p.radar_score!=null && <span>Radar {scoreFmt(p.radar_score)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className="mt-8 pt-4 border-t border-white/10 text-[10px] flex flex-wrap gap-4 opacity-70">
        <span>prospectRadar • {dateStr}</span>
        <span>Board Size: {limitedBoard.length}</span>
        {positionSummary && <span>Positions: {positionSummary}</span>}
        <span>Radar v2</span>
      </div>
    </div>
  );
};

export default ExportBoardView;
