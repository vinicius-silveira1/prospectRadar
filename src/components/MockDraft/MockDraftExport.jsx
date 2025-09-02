import React from 'react';
import { useProspectImage } from '@/hooks/useProspectImage';

const teamLogos = {
  'ATL': 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg',
  'BOS': 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
  'BKN': 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
  'CHA': 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg',
  'CHI': 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg',
  'CLE': 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg',
  'DAL': 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
  'DEN': 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
  'DET': 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg',
  'GSW': 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
  'HOU': 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg',
  'IND': 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg',
  'LAC': 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg',
  'LAL': 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
  'MEM': 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg',
  'MIA': 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
  'MIL': 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
  'MIN': 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg',
  'NOP': 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg',
  'NYK': 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
  'OKC': 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg',
  'ORL': 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg',
  'PHI': 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
  'PHX': 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
  'POR': 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg',
  'SAC': 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg',
  'SAS': 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg',
  'TOR': 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
  'UTA': 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg',
  'WAS': 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg',
};

const getTeamLogo = (teamName) => teamLogos[teamName] || '/logo.svg';

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

const MockDraftExport = React.forwardRef(({ draftData }, ref) => {
  if (!draftData || !draftData.board) {
    return null;
  }

  const { board, settings } = draftData;
  const firstRound = board.filter(p => p.round === 1);
  const secondRound = board.filter(p => p.round === 2);

  // Apenas mostra a segunda rodada se houver pelo menos um prospect selecionado nela.
  const shouldRenderSecondRound = secondRound.some(pick => pick.prospect !== null);

  const renderRound = (round, title) => (
    <div key={title} className="relative mb-6">
      {/* Section Header Simplificado */}
      <div className="bg-gray-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
        <h3 className="text-2xl font-bold text-gray-800 text-center">
          {title}
        </h3>
      </div>
      
      {/* Grid Layout de Duas Colunas com Mais Espaço */}
      <div className="grid grid-cols-2 gap-6">
        {round.map((pick) => (
          <div key={pick.pick} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              {/* Pick Number */}
              <div className="w-12 h-12 flex items-center justify-center font-bold text-white text-lg bg-blue-600 rounded-lg flex-shrink-0">
                {pick.pick}
              </div>
              
              {/* Team Logo */}
              <div className="w-10 flex-shrink-0 flex items-center justify-center">
                <img src={getTeamLogo(pick.team)} alt={pick.team} className="w-10 h-10 object-contain" />
              </div>
              
              {/* Prospect Info */}
              <div className="flex-1 min-w-0">
                {pick.prospect ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <ProspectImage prospect={pick.prospect} />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-base text-gray-900 leading-tight">
                          {pick.prospect.name}
                        </p>
                      </div>
                    </div>
                    <div className="ml-15 space-y-1">
                      <div className="text-blue-600 font-semibold text-sm">
                        {pick.prospect.position}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {pick.prospect.high_school_team}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 font-bold">?</span>
                    </div>
                    <p className="text-gray-400 italic text-sm">Seleção em aberto</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="w-[1200px] bg-white p-8 font-sans relative overflow-hidden">
      {/* Grid Background Sutil */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Corner Accents Simples */}
      <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-blue-500"></div>
      <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-blue-500"></div>

      {/* Header Simplificado */}
      <header className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="ProspectRadar Logo" className="w-16 h-16 mr-4" />
            <div>
              <h1 className="text-3xl font-bold mb-1">
                <span className="text-orange-300">prospect</span>
                <span className="text-white">Radar</span>
              </h1>
              <p className="text-blue-100 text-lg">Mock Draft Profissional</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-300 mb-1">
              DRAFT {settings.draftClass}
            </div>
            <div className="bg-black/20 px-3 py-1 rounded">
              <p className="text-sm text-gray-200">GERADO EM: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="relative z-10 py-6">
        {renderRound(firstRound, "PRIMEIRA RODADA")}
        {shouldRenderSecondRound && renderRound(secondRound, "SEGUNDA RODADA")}
      </section>

      {/* Footer Simplificado */}
      <footer className="relative z-10 bg-gray-50 border-t-2 border-blue-500 text-center p-4 rounded-lg">
        <div className="mb-2">
          <span className="text-xl font-bold text-blue-600">prospectRadar</span>
          <span className="text-gray-600 ml-2">• Análise Profissional de Prospects</span>
        </div>
        <div className="text-sm text-gray-500">
          prospectradar.com • {new Date().toLocaleDateString('pt-BR')}
        </div>
      </footer>
    </div>
  );
});

export default MockDraftExport;