import React, { forwardRef } from 'react';
import { Crown, Gem, TrendingUp, Star } from 'lucide-react';

// Funções auxiliares para avatares (pode compartilhar com outros componentes)
const getAvatarColor = (name) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
  let hash = 0;
  if (!name) return colors[0];
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const ProspectCard = ({ prospect, pick, title, icon, bgColorClass, textColorClass }) => {
    if (!prospect) return null;
    return (
        <div className={`relative p-4 rounded-xl shadow-lg overflow-hidden ${bgColorClass}`}>
            <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 border-2 border-white/50" style={{ backgroundColor: getAvatarColor(prospect.name) }}>
                    {getInitials(prospect.name)}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        {icon}
                        <p className={`text-sm font-bold uppercase tracking-wider ${textColorClass}`}>{title}</p>
                    </div>
                    <p className="text-xl font-bold text-white truncate">{prospect.name}</p>
                    <div className="flex items-center space-x-2 text-xs font-mono">
                        <span className={`px-2 py-0.5 rounded-full ${textColorClass} bg-black/20`}>PICK #{pick}</span>
                        <span className={`px-2 py-0.5 rounded-full ${textColorClass} bg-black/20`}>RANK #{prospect.ranking}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DraftReportCard = forwardRef(({ reportData, draftName, isDark }, ref) => {
  if (!reportData) return null;

  const { grade, analysis, bestValuePick, worstValuePick } = reportData;

  const gradeInfo = {
    'A+': { color: 'text-cyan-300', shadow: 'shadow-cyan-400/50', label: 'ELITE' },
    'A': { color: 'text-green-400', shadow: 'shadow-green-500/50', label: 'ÓTIMO' },
    'B+': { color: 'text-lime-400', shadow: 'shadow-lime-500/50', label: 'BOM' },
    'B': { color: 'text-yellow-400', shadow: 'shadow-yellow-500/50', label: 'NA MÉDIA' },
    'C+': { color: 'text-orange-400', shadow: 'shadow-orange-500/50', label: 'OK' },
    'C': { color: 'text-red-400', shadow: 'shadow-red-500/50', label: 'ABAIXO DA MÉDIA' },
    'D': { color: 'text-red-500', shadow: 'shadow-red-600/50', label: 'RUIM' },
  }[grade] || { color: 'text-gray-400', shadow: 'shadow-gray-500/50', label: 'INDEFINIDO' };

  return (
    <div ref={ref} className={`w-[800px] p-8 font-sans relative overflow-hidden bg-gray-900 text-white`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\\'60\\\' height=\\\'60\\\' viewBox=\\\'0 0 60 60\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\'%3E%3Cg fill=\\\'none\\\' fill-rule=\\\'evenodd\\\'%3E%3Cg fill=\\\'%23ffffff\\\' fill-opacity=\\\'0.1\\\'%3E%3Cpath d=\\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-blue-900/30"></div>

        <div className="relative z-10">
            {/* Header */}
            <header className="flex justify-between items-center mb-6 pb-4 border-b border-white/20">
                <div>
                    <h1 className="text-2xl font-bold">
                        <span className="text-orange-400">prospect</span>
                        <span className="text-purple-400">Radar</span>
                    </h1>
                    <p className="text-gray-300 text-sm">Draft Report Card</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold">{draftName || 'Meu Mock Draft'}</p>
                    <p className="text-xs text-gray-400">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="grid grid-cols-2 gap-6">
                {/* Grade Section */}
                <div className="col-span-1 bg-black/30 rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-white/10 shadow-2xl">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest\">Sua Nota</p>
                    <p className={`text-9xl font-black ${gradeInfo.color} drop-shadow-lg ${gradeInfo.shadow}`}>{grade}</p>
                    <p className={`font-bold text-xl ${gradeInfo.color}`}>{gradeInfo.label}</p>
                    <p className="text-gray-300 mt-2 text-sm">{analysis}</p>
                </div>

                {/* Highlights Section */}
                <div className="col-span-1 space-y-4">
                    {bestValuePick && (
                        <ProspectCard 
                            prospect={bestValuePick.prospect} 
                            pick={bestValuePick.pick}
                            title="Maior Valor" 
                            icon={<Gem className="h-5 w-5 text-sky-300" />}
                            bgColorClass="bg-sky-500/20 border border-sky-400/30"
                            textColorClass="text-sky-300"
                        />
                    )}
                    {worstValuePick && (
                        <ProspectCard 
                            prospect={worstValuePick.prospect} 
                            pick={worstValuePick.pick}
                            title="Maior Reach" 
                            icon={<TrendingUp className="h-5 w-5 text-red-400" />}
                            bgColorClass="bg-red-500/20 border border-red-400/30"
                            textColorClass="text-red-400"
                        />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-8 pt-4 text-center border-t border-white/20">
                <p className="text-lg font-bold">Acha que consegue uma nota melhor?</p>
                <p className="text-purple-300 font-semibold text-2xl">prospectRadar.com.br</p>
            </footer>
        </div>
    </div>
  );
});

export default DraftReportCard;