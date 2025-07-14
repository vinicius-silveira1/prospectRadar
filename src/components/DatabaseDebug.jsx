// Componente Debug para verificar a base de dados
import React, { useState, useEffect } from 'react';
import Draft2026Database from '../services/Draft2026Database.js';

const DatabaseDebug = () => {
  const database = new Draft2026Database();
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    try {
      const allProspects = database.getAllProspects();
      const prospects2026 = allProspects.filter(p => p.draftClass === 2026);
      const prospects2025 = allProspects.filter(p => p.draftClass === 2025);
      
      const stats = database.getDatabaseStats();
      
      setDebugInfo({
        total: allProspects.length,
        draftClass2026: prospects2026.length,
        draftClass2025: prospects2025.length,
        stats: stats,
        sampleProspects: prospects2026.slice(0, 5),
        ajDybantsa: prospects2026.find(p => p.name.includes('AJ Dybantsa'))
      });
      
    } catch (error) {
      setDebugInfo({ error: error.message });
    }
  }, []);

  if (!debugInfo) return <div>Loading debug info...</div>;

  if (debugInfo.error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h3 className="text-red-800 font-bold">Erro:</h3>
        <p className="text-red-600">{debugInfo.error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="text-blue-800 font-bold mb-4">🔍 Debug Database Info</h3>
      
      <div className="space-y-2 text-sm">
        <p><strong>Total Prospects:</strong> {debugInfo.total}</p>
        <p><strong>Draft Class 2026:</strong> {debugInfo.draftClass2026}</p>
        <p><strong>Draft Class 2025:</strong> {debugInfo.draftClass2025}</p>
        
        <div className="mt-4">
          <strong>Stats from getDatabaseStats():</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(debugInfo.stats, null, 2)}
          </pre>
        </div>
        
        <div className="mt-4">
          <strong>Sample Prospects (Draft 2026):</strong>
          <ul className="list-disc list-inside">
            {debugInfo.sampleProspects.map((p, i) => (
              <li key={i} className="text-xs">
                {p.name} ({p.position}) - Draft: {p.draftClass} - Ranking: {p.ranking}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4">
          <strong>AJ Dybantsa encontrado:</strong> {debugInfo.ajDybantsa ? '✅ SIM' : '❌ NÃO'}
          {debugInfo.ajDybantsa && (
            <div className="text-xs ml-4">
              Ranking: {debugInfo.ajDybantsa.ranking}, Draft: {debugInfo.ajDybantsa.draftClass}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseDebug;
