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

const ProspectImage = ({ prospect }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect);
  if (isLoading) {
    return <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />;
  }
  return (
    <img
      src={imageUrl}
      alt={prospect.name}
      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
      crossOrigin="anonymous"
    />
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
    <div key={title}>
      <h3 className="text-2xl font-bold text-gray-800 my-6 text-center bg-gray-100 py-2 rounded-lg">{title}</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {round.map((pick) => (
          <div key={pick.pick} className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="w-10 text-center font-bold text-gray-500 text-xl">
              {pick.pick}
            </div>
            <div className="w-16 flex-shrink-0 flex items-center justify-center">
              <img src={getTeamLogo(pick.team)} alt={pick.team} className="h-10 w-10 object-contain" />
            </div>
            <div className="flex-1 ml-4">
              {pick.prospect ? (
                <div className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    <ProspectImage prospect={pick.prospect} />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">{pick.prospect.name}</p>
                    <p className="text-sm text-gray-600">{pick.prospect.position} • {pick.prospect.high_school_team}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic">Seleção em aberto</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="w-[1200px] bg-slate-50 p-10 font-sans border-4 border-blue-600">
      <header className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
        <div className="flex items-center">
          <img src="/logo.svg" alt="ProspectRadar Logo" className="w-16 h-16 mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              <span className="text-brand-orange">prospect</span>
              <span className="text-brand-cyan">Radar</span>
            </h1>
            <p className="text-gray-500 text-lg">Seu Mock Draft Personalizado</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-blue-700">Mock Draft {settings.draftClass}</h2>
          <p className="text-sm text-gray-500">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </header>

      <section className="py-8">
        {renderRound(firstRound, "Primeira Rodada")}
        {shouldRenderSecondRound && renderRound(secondRound, "Segunda Rodada")}
      </section>

      {/* Footer */}
      <footer className="text-center pt-6 mt-6 border-t-2 border-gray-200">
        <p className="text-gray-500">Relatório gerado por <span className="font-bold text-brand-orange">prospect</span><span className="font-bold text-brand-cyan">Radar</span></p>
        <p className="text-sm text-gray-400">prospectradar.com</p>
      </footer>
    </div>
  );
});

export default MockDraftExport;
