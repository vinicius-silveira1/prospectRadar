import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

const LeagueContext = createContext();

export const LeagueProvider = ({ children }) => {
  const [league, setLeague] = useState(() => {
    const savedLeague = localStorage.getItem('league');
    return savedLeague || 'NBA';
  });

  useEffect(() => {
    localStorage.setItem('league', league);
  }, [league]);

  const value = useMemo(() => ({ league, setLeague }), [league]);

  return (
    <LeagueContext.Provider value={value}>
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
};

export { LeagueContext };
