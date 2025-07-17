import React from 'react';
import HighSchoolStatsService from '../services/HighSchoolStatsService';

const HybridDebugComponent = () => {
  const hsService = new HighSchoolStatsService();
  
  // Teste com dados reais
  const testProspects = [
    { id: 'aj-dybantsa-espn-2025', name: 'AJ Dybantsa', stats: { ppg: 0, rpg: 0, apg: 0 } },
    { id: 'cameron-boozer-espn-2025', name: 'Cameron Boozer', stats: { ppg: 0, rpg: 0, apg: 0 } }
  ];
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg m-4">
      <h2 className="text-xl font-bold mb-4">🔍 Debug Sistema Híbrido</h2>
      
      {testProspects.map(prospect => {
        const needsHSData = !prospect.stats || 
                           (!prospect.stats.ppg && !prospect.stats.rpg && !prospect.stats.apg) || 
                           (prospect.stats.ppg === 0 && prospect.stats.rpg === 0 && prospect.stats.apg === 0);
        
        const hasHSData = hsService.hasHighSchoolData(prospect.id, prospect.name);
        const hsData = hasHSData ? hsService.getHighSchoolStats(prospect.id, prospect.name) : null;
        
        return (
          <div key={prospect.id} className="border p-4 mb-4 rounded">
            <h3 className="font-bold">{prospect.name}</h3>
            <p>ID: {prospect.id}</p>
            <p>Precisa HS: {needsHSData ? '✅' : '❌'}</p>
            <p>Tem dados HS: {hasHSData ? '✅' : '❌'}</p>
            
            {hsData && (
              <div className="mt-2 p-2 bg-orange-50 rounded">
                <p className="font-semibold">📊 Dados High School:</p>
                <p>PPG: {hsData.stats.ppg}</p>
                <p>RPG: {hsData.stats.rpg}</p>
                <p>APG: {hsData.stats.apg}</p>
                <p>Escola: {hsData.school}</p>
                <p>Temporada: {hsData.season}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HybridDebugComponent;
