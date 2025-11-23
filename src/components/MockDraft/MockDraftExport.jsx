import React, { useRef } from 'react';
import { useProspectImage } from '@/hooks/useProspectImage';

const teamFullNames = {
  'ATL': 'Atlanta Hawks',
  'BOS': 'Boston Celtics',
  'BKN': 'Brooklyn Nets',
  'CHA': 'Charlotte Hornets',
  'CHI': 'Chicago Bulls',
  'CLE': 'Cleveland Cavaliers',
  'DAL': 'Dallas Mavericks',
  'DEN': 'Denver Nuggets',
  'DET': 'Detroit Pistons',
  'GSW': 'Golden State Warriors',
  'HOU': 'Houston Rockets',
  'IND': 'Indiana Pacers',
  'LAC': 'LA Clippers',
  'LAL': 'Los Angeles Lakers',
  'MEM': 'Memphis Grizzlies',
  'MIA': 'Miami Heat',
  'MIL': 'Milwaukee Bucks',
  'MIN': 'Minnesota Timberwolves',
  'NOP': 'New Orleans Pelicans',
  'NYK': 'New York Knicks',
  'OKC': 'Oklahoma City Thunder',
  'ORL': 'Orlando Magic',
  'PHI': 'Philadelphia 76ers',
  'PHX': 'Phoenix Suns',
  'POR': 'Portland Trail Blazers',
  'SAC': 'Sacramento Kings',
  'SAS': 'San Antonio Spurs',
  'TOR': 'Toronto Raptors',
  'UTA': 'Utah Jazz',
  'WAS': 'Washington Wizards',
};



// Removido: mapeamento de logos de times para simplificação do export

// Funções auxiliares para as imagens dos prospects
const getColorFromName = (name) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const ProspectImage = ({ prospect }) => {
  const prospectName = prospect?.name || 'N/A';
  const { imageUrl, isLoading } = useProspectImage(prospectName, prospect?.image);
  if (isLoading) {
    return <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />;
  }
  return (
    imageUrl ? (
      <img
        src={imageUrl}
        alt={prospect?.name || 'Prospect'}
        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
        crossOrigin="anonymous"
      />
    ) : (
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-md" style={{ backgroundColor: getColorFromName(prospectName) }}>
        <span>{getInitials(prospectName)}</span>
      </div>
    )
  );
};

const getHeightDisplay = (height) => {
  if (!height) return 'N/A';
  let parsedHeight = height;
  if (typeof height === 'string') {
    try {
      parsedHeight = JSON.parse(height);
    } catch (e) {
      return height; // Retorna como está se não for um JSON válido
    }
  }
  if (typeof parsedHeight === 'object' && parsedHeight !== null) {
    return parsedHeight.us || 'N/A';
  }
  return height;
};


const MockDraftExport = React.forwardRef(({ draftData, isDark }, ref) => {
  // Hooks devem ser chamados sempre; usar fallbacks quando dados ausentes
  const rootInnerRef = useRef(null);
  // Removido gating de fontes (não necessário após simplificação)
  // const [fontsReady, setFontsReady] = useState(false);

  // Gating de fontes removido

  const board = draftData?.board || [];
  const settings = draftData?.settings || {};
  const firstRound = board.filter(p => p.round === 1);
  const secondRound = board.filter(p => p.round === 2);

  // Estatísticas básicas para header
  const filledPicks = board.filter(p => p.prospect);

  const totalFilled = filledPicks.length;
  const top5Set = new Set(firstRound.filter(p => p.pick <= 5).map(p => p.pick));
  const lotteryLimit = firstRound.length >= 14 ? 14 : (firstRound.length >= 4 ? 4 : 0);
  const lotterySet = new Set(firstRound.filter(p => p.pick <= lotteryLimit).map(p => p.pick));

  // Apenas mostra a segunda rodada se houver pelo menos um prospect selecionado nela.
  const shouldRenderSecondRound = secondRound.some(pick => pick.prospect !== null);

  const renderRound = (round, title) => {
    const COLUMNS = 3;
    const rows = Math.ceil(round.length / COLUMNS);
    const ordered = []; // Ordenação em colunas para preenchimento vertical
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < COLUMNS; c++) {
        const idx = r + c * rows;
        if (idx < round.length) ordered.push(round[idx]);
      }
    }
    return (
    <div key={title} className="relative mb-10">
      <div className={`rounded-xl px-6 py-3 mb-6 shadow-inner border ${isDark ? 'bg-gradient-to-r from-orange-900/20 via-purple-900/20 to-indigo-900/20 border-orange-700/40' : 'bg-gradient-to-r from-orange-50 via-purple-50 to-indigo-50 border-orange-200/50'}`}>
        <h3 className={`text-3xl font-extrabold tracking-wide text-center drop-shadow-sm leading-normal ${isDark ? 'text-gray-100' : 'text-gray-800'}`} style={{ transform: 'translateY(-14px)' }}>
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {ordered.map((pick) => {
          const isTop5 = top5Set.has(pick.pick);
          const isLottery = lotterySet.has(pick.pick);
          return (
            <div
              key={pick.pick}
              data-export-card
              className={
                `relative group rounded-2xl px-5 pt-2 pb-3 flex items-center transition-all duration-300 border backdrop-blur-sm ${
                (pick.prospect
                  ? (isDark ? 'bg-gray-900/70 border-gray-700' : 'bg-white/90 border-gray-200') + ' shadow-lg hover:shadow-xl'
                  : (isDark ? 'bg-gray-800/50 border-dashed border-gray-600 hover:bg-gray-800/70' : 'bg-white/60 border-dashed border-gray-300 hover:bg-white/80'))
              }`}
              style={{
                boxShadow: isTop5
                  ? '0 0 0 2px rgba(249,115,22,0.15), 0 8px 24px -4px rgba(168,85,247,0.25)'
                  : isLottery
                  ? '0 0 0 2px rgba(99,102,241,0.12), 0 4px 16px -2px rgba(99,102,241,0.25)'
                  : '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              {/* Background Accent for Top5 / Lottery */}
              {isTop5 && (
                <div className={`absolute inset-0 rounded-2xl pointer-events-none ${isDark ? 'bg-gradient-to-br from-orange-500/10 to-yellow-500/5' : 'bg-gradient-to-br from-orange-100/60 to-yellow-50/40'}`} />
              )}
              {!isTop5 && isLottery && (
                <div className={`absolute inset-0 rounded-2xl pointer-events-none ${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/5' : 'bg-gradient-to-br from-indigo-100/40 to-purple-100/30'}`} />
              )}
              <div className="relative flex items-center gap-5 w-full">
                {/* Pick Pill */}
                <div
                  className={
                    `relative w-14 h-14 rounded-xl shadow-md border text-sm font-bold tracking-wide ${
                    (isTop5
                      ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white border-orange-600'
                      : isLottery
                      ? 'bg-gradient-to-b from-indigo-600 to-purple-600 text-white border-indigo-600'
                      : (isDark ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'))
                  }`}
                  data-pick-pill
                >
                  <div data-pill-content className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateY(-14px)' }}>
                    <span className="text-3xl leading-none">{pick.pick}</span>
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {pick.prospect ? (
                    <div className="-translate-y-2">
                      <h3 className={`font-black text-2xl leading-tight tracking-tight ${isDark ? 'text-gray-50' : 'text-gray-900'}`}>
                        {pick.prospect.name || 'Nome Indisponível'}
                      </h3>
                      <p className={`text-md font-semibold mt-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {pick.prospect.position} • {getHeightDisplay(pick.prospect.height)} • {pick.prospect.team || pick.prospect.high_school_team || 'N/A'}
                      </p>
                      {/* Badges removidas para simplificação do export */}
                    </div>
                  ) : (
                    <div className={`italic font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Seleção em aberto</div>
                  )}
                </div>
              </div>
              {/* LOGO DE FUNDO (WATERMARK) */}
              {pick.prospect && (
                <img
                  src={`/images/teams/${pick.newOwner}.svg`}
                  alt=""
                  className={`absolute right-0 top-0 h-full w-auto object-contain pointer-events-none ${isDark ? 'opacity-30' : 'opacity-40'}`}
                  style={{ transform: 'translateX(10%)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  };
  // Ajuste dinâmico removido para evitar deslocamentos artificiais

  return (
    <div
      ref={ref}
      className={`w-[1200px] pt-4 pb-8 px-8 font-sans relative rounded-2xl shadow-2xl ${isDark ? 'bg-[#0A0B12]' : 'bg-white'}`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Grid Background Sutil */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.04]'}`} style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.35) 1px, transparent 0)',
        backgroundSize: '22px 22px'
      }} />
      
      {/* Corner Accents Simples */}
      <div className={`absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 pointer-events-none ${isDark ? 'border-orange-600/60' : 'border-orange-300'}`}></div>
      <div className={`absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 pointer-events-none ${isDark ? 'border-purple-600/60' : 'border-purple-300'}`}></div>

      {/* Header Limpo */}
      <div ref={rootInnerRef} className="relative transition-none">
      <header className="relative z-10 mb-8">
        <div className="rounded-2xl p-6 bg-gradient-to-r from-orange-500 via-purple-600 to-indigo-600 text-white shadow-xl border border-white/10 dark:border-white/5">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <img src="/logo.png" alt="prospectRadar Logo" className="w-24 h-24 drop-shadow-lg" />
                <div className={isDark ? 'text-white' : 'text-black'}>
                  <h1 className="text-4xl font-black tracking-tight leading-normal flex items-center gap-2">
                  <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-lg">Mock Draft</span>
                  <span className="text-yellow-300">{settings.draftClass}</span>
                </h1>
                <p className="mt-2 text-sm font-medium opacity-90">Compartilhe seu board • Atualizado {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            <div className="text-right flex-1 min-w-[250px]">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-sm font-semibold tracking-wide">
                <span className="text-yellow-200">{totalFilled}</span> / {board.length} PICKS DEFINIDOS
              </div>
            </div>
          </div>
        </div>
        {/* Bloco de estatísticas removido para simplificar o export */}
      </header>
      <section className="relative z-10 py-2">
        {renderRound(firstRound, "PRIMEIRA RODADA")}
        {shouldRenderSecondRound && renderRound(secondRound, "SEGUNDA RODADA")}
      </section>

      {/* Footer Limpo */}
      <footer className={`relative z-10 mt-2 text-center p-6 rounded-2xl border shadow-inner ${isDark ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-r from-gray-100 via-white to-gray-100 border-gray-200'}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg font-extrabold tracking-tight">
            <span className="text-orange-600">prospect</span><span className={isDark ? 'text-purple-400' : 'text-purple-700'}>Radar</span>
          </div>
          <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Crie seu próprio mock em prospectradar.com.br • #{settings.draftClass} #NBADraft #ProspectRadar</div>
          <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{new Date().toLocaleDateString('pt-BR')} • Visual Premium Export</div>
        </div>
      </footer>
      </div>
    </div>
  );
});

export default MockDraftExport;