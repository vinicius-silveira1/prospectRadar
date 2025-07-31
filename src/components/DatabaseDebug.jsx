import React, { useMemo } from 'react';
import useProspects from '@/hooks/useProspects.js';
import { ExternalLink, CheckCircle, AlertCircle, Database, Clock } from 'lucide-react';
import LoadingSpinner from './Layout/LoadingSpinner.jsx';

const DatabaseDebug = () => {
  const { prospects, loading, error } = useProspects();

  const debugInfo = useMemo(() => {
    if (loading || error || prospects.length === 0) return null;

    const byDraftClass = prospects.reduce((acc, p) => {
      // Assumindo que a classe do draft é 2026 para todos, vamos simular uma verificação
      // Em um cenário real, você teria um campo `draftClass` no seu DB.
      const draftClass = p.class || '2026'; // Usando o campo 'class' se existir
      acc[draftClass] = (acc[draftClass] || 0) + 1;
      return acc;
    }, {});

    const byScope = prospects.reduce((acc, p) => {
      const scope = p.scope || 'N/A';
      acc[scope] = (acc[scope] || 0) + 1;
      return acc;
    }, {});

    const statsCompleteness = prospects.reduce((acc, p) => {
      if (p.ppg && p.rpg && p.apg) acc.complete += 1;
      else acc.incomplete += 1;
      return acc;
    }, { complete: 0, incomplete: 0 });

    const brazilianProspects = prospects.filter(p => p.nationality === '🇧🇷');

    // Identifica prospects que podem precisar de verificação (ex: sem fonte ou com fonte genérica)
    const unverifiedProspects = prospects.filter(p => !p.source || (!p.source.includes('Curated') && !p.source.includes('LDB_Official_Scrape')));

    const lastScraped = prospects
      .filter(p => p.source === 'LDB_Official_Scrape' && p.last_verified_at)
      .map(p => new Date(p.last_verified_at))
      .sort((a, b) => b - a)[0];

    return {
      total: prospects.length,
      byDraftClass,
      byScope,
      statsCompleteness,
      brazilianCount: brazilianProspects.length,
      lastScraped: lastScraped ? lastScraped.toLocaleString('pt-BR') : 'Nunca',
      sampleBrazilian: brazilianProspects.slice(0, 3),
      unverifiedCount: unverifiedProspects.length,
      sampleInternational: prospects.filter(p => p.nationality !== '🇧🇷').slice(0, 3),
    };
  }, [prospects, loading, error]);

  if (loading) return <div className="p-4 bg-blue-100 border border-blue-400 rounded"><LoadingSpinner /></div>;
  if (error) return <div className="p-4 bg-red-100 border border-red-400 rounded"><p>Erro ao carregar dados para debug: {error}</p></div>;
  if (!debugInfo) return null;

  return (
    <div className="p-4 bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-lg my-6">
      <h3 className="text-yellow-800 font-bold mb-4 text-lg">🔍 Painel de Diagnóstico da Base de Dados</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
        <div className="flex items-center gap-2"><Database className="h-4 w-4" /><strong>Total:</strong> {debugInfo.total}</div>
        <div><strong>Prospects por Classe:</strong> <pre className="inline bg-yellow-100 p-1 rounded">{JSON.stringify(debugInfo.byDraftClass)}</pre></div>
        <div><strong>Prospects por Escopo:</strong> <pre className="inline bg-yellow-100 p-1 rounded">{JSON.stringify(debugInfo.byScope)}</pre></div>
        <div><strong>Completude de Stats:</strong> {debugInfo.statsCompleteness.complete} completos / {debugInfo.statsCompleteness.incomplete} incompletos</div>
        <div className="flex items-center gap-2">
          {debugInfo.unverifiedCount > 0 ? <AlertCircle className="text-red-500 h-4 w-4" /> : <CheckCircle className="text-green-500 h-4 w-4" />}
          <strong>A Verificar:</strong> {debugInfo.unverifiedCount}
        </div>
        <div className="flex items-center gap-2 col-span-full md:col-span-1 lg:col-auto">
          <Clock className="h-4 w-4" />
          <strong>Último Scrape LDB:</strong> {debugInfo.lastScraped}
        </div>
      </div>
      <div className="mt-4">
        <strong>Amostra de Dados (para verificação visual):</strong>
        <pre className="bg-yellow-100 p-2 rounded text-xs overflow-auto mt-2">
          {JSON.stringify({ brasileiros: debugInfo.sampleBrazilian, internacionais: debugInfo.sampleInternational }, null, 2)}
        </pre>
      </div>
      {debugInfo.unverifiedCount > 0 && (
        <div className="mt-4">
          <h4 className="text-yellow-800 font-bold mb-2">Prospects para Verificação</h4>
          <ul className="text-sm space-y-1">
            {prospects.filter(p => !p.source || (!p.source.includes('Curated') && !p.source.includes('LDB_Official_Scrape'))).slice(0, 5).map(p => (
              <li key={p.id} className="flex items-center gap-4">
                <span>{p.name} (Fonte: {p.source || 'N/A'})</span>
                <div className="flex gap-2">
                  <a href={`https://basketball.latinbasket.com/search.asp?Player=${encodeURIComponent(p.name)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center">Latinbasket <ExternalLink size={12} className="ml-1" /></a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(p.name)}+basketball+stats`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center">Google <ExternalLink size={12} className="ml-1" /></a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DatabaseDebug;