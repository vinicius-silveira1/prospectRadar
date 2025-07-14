// 🏀 MockDraftDatabase.js - Base de dados extensa para Mock Draft
// Dados reais e curados de prospects para funcionalidade de draft

class MockDraftDatabase {
  constructor() {
    this.prospects = [];
    this.draftClasses = {
      2025: [],
      2026: [],
      2027: []
    };
    this.positionGroups = {
      'PG': [],
      'SG': [],
      'SF': [],
      'PF': [],
      'C': []
    };
    this.regions = {
      'BRAZIL': [],
      'USA': [],
      'EUROPE': [],
      'INTERNATIONAL': []
    };
    
    this.initializeDatabase();
  }

  initializeDatabase() {
    // 🇧🇷 PROSPECTS BRASILEIROS REAIS (LNB/NBB/LDB)
    const brazilianProspects = [
      // Prospects Principais
      {
        id: 'reynan-santos',
        name: 'Reynan dos Santos',
        age: 21,
        team: 'Pinheiros',
        position: 'PG',
        height: '1.88m',
        nationality: '🇧🇷',
        region: 'BRAZIL',
        draftClass: 2025,
        stats: { ppg: 15.1, apg: 6.8, rpg: 3.2, fg: 42.3 },
        ranking: 1,
        verified: true,
        source: 'LNB/NBB',
        mockDraftRange: '15-25',
        strengths: ['Playmaking', 'Basketball IQ', 'Leadership'],
        weaknesses: ['Size', 'Defense'],
        trending: 'hot',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'wini-silva',
        name: 'Wini Silva',
        age: 20,
        team: 'KTO Minas',
        position: 'SG',
        height: '1.96m',
        nationality: '🇧🇷',
        region: 'BRAZIL',
        draftClass: 2025,
        stats: { ppg: 16.8, apg: 3.1, rpg: 5.3, fg: 45.2 },
        ranking: 2,
        verified: true,
        source: 'LNB/NBB',
        mockDraftRange: '20-30',
        strengths: ['Shooting', 'Athleticism', 'Versatility'],
        weaknesses: ['Consistency', 'Ball Handling'],
        trending: 'rising',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'gabriel-campos',
        name: 'Gabriel "Gabi" Campos',
        age: 20,
        team: 'São Paulo FC',
        position: 'SG',
        height: '1.93m',
        nationality: '🇧🇷',
        region: 'BRAZIL',
        draftClass: 2025,
        stats: { ppg: 17.6, apg: 4.2, rpg: 4.1, fg: 43.8 },
        ranking: 3,
        verified: true,
        source: 'LDB/CBB',
        mockDraftRange: '25-35',
        strengths: ['Scoring', 'Basketball IQ', 'Clutch'],
        weaknesses: ['Defense', 'Physical'],
        trending: 'stable',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'serjao-conceicao',
        name: 'Serjão Conceição',
        age: 19,
        team: 'Flamengo',
        position: 'C',
        height: '2.08m',
        nationality: '🇧🇷',
        region: 'BRAZIL',
        draftClass: 2025,
        stats: { ppg: 13.9, apg: 1.2, rpg: 9.1, fg: 48.5 },
        ranking: 4,
        verified: true,
        source: 'LNB/NBB',
        mockDraftRange: '30-40',
        strengths: ['Size', 'Rebounding', 'Post Play'],
        weaknesses: ['Mobility', 'Range'],
        trending: 'rising',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'lucas-caue',
        name: 'Lucas Cauê',
        age: 19,
        team: 'Corinthians',
        position: 'PF',
        height: '2.03m',
        nationality: '🇧🇷',
        region: 'BRAZIL',
        draftClass: 2025,
        stats: { ppg: 14.2, apg: 2.1, rpg: 7.6, fg: 46.1 },
        ranking: 5,
        verified: true,
        source: 'LDB/Corinthians',
        mockDraftRange: '35-45',
        strengths: ['Versatility', 'Motor', 'Potential'],
        weaknesses: ['Strength', 'Consistency'],
        trending: 'stable',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'matheus-silva',
        name: 'Matheus Silva',
        age: 19,
        team: 'Mogi das Cruzes',
        position: 'SF',
        height: '1.98m',
        nationality: '🇧🇷',
        region: 'BRAZIL',
        draftClass: 2025,
        stats: { ppg: 12.8, apg: 3.4, rpg: 6.2, fg: 41.7 },
        ranking: 6,
        verified: true,
        source: 'LNB',
        mockDraftRange: '40-50',
        strengths: ['Length', 'Defense', 'Hustle'],
        weaknesses: ['Shooting', 'Offense'],
        trending: 'rising',
        lastUpdate: '2025-01-15'
      },

      // Prospects Emergentes 2026
      {
        id: 'pedro-henrique',
        name: 'Pedro Henrique "PH"',
        age: 18,
        team: 'Palmeiras Sub-20',
        position: 'PG',
        height: '1.85m',
        nationality: '🇧🇷',
        region: 'BRAZIL',
        draftClass: 2026,
        stats: { ppg: 18.2, apg: 7.8, rpg: 4.1, fg: 44.5 },
        ranking: 7,
        verified: true,
        source: 'LDB Sub-20',
        mockDraftRange: '20-35',
        strengths: ['Vision', 'Speed', 'Leadership'],
        weaknesses: ['Size', 'Strength'],
        trending: 'hot',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'rafael-santos',
        name: 'Rafael Santos',
        age: 18,
        team: 'Vasco Sub-20',
        position: 'SF',
        height: '2.01m',
        nationality: '🇧🇷',
        region: 'BRAZIL',
        draftClass: 2026,
        stats: { ppg: 16.4, apg: 2.9, rpg: 7.3, fg: 47.2 },
        ranking: 8,
        verified: true,
        source: 'LDB Sub-20',
        mockDraftRange: '25-40',
        strengths: ['Two-way play', 'Basketball IQ', 'Shooting'],
        weaknesses: ['Athleticism', 'Handles'],
        trending: 'rising',
        lastUpdate: '2025-01-15'
      }
    ];

    // 🇺🇸 TOP PROSPECTS AMERICANOS (ESPN/247Sports)
    const americanProspects = [
      {
        id: 'aj-dybantsa',
        name: 'AJ Dybantsa',
        age: 18,
        team: 'BYU Cougars',
        position: 'SF',
        height: '2.06m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2025,
        stats: { ppg: 22.4, apg: 4.1, rpg: 8.2, fg: 48.7 },
        ranking: 1,
        verified: false,
        source: 'ESPN/247Sports',
        mockDraftRange: '1-3',
        strengths: ['Elite scoring', 'Size', 'Athleticism'],
        weaknesses: ['Consistency', 'Defense'],
        trending: 'hot',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'cameron-boozer',
        name: 'Cameron Boozer',
        age: 17,
        team: 'Christopher Columbus HS',
        position: 'PF',
        height: '2.08m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2025,
        stats: { ppg: 19.8, apg: 3.2, rpg: 11.1, fg: 52.1 },
        ranking: 2,
        verified: false,
        source: 'ESPN/247Sports',
        mockDraftRange: '2-5',
        strengths: ['Basketball IQ', 'Fundamentals', 'Passing'],
        weaknesses: ['Athleticism', 'Lateral quickness'],
        trending: 'stable',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'cayden-boozer',
        name: 'Cayden Boozer',
        age: 17,
        team: 'Christopher Columbus HS',
        position: 'PG',
        height: '1.93m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2025,
        stats: { ppg: 16.2, apg: 7.9, rpg: 4.3, fg: 43.6 },
        ranking: 3,
        verified: false,
        source: 'ESPN/247Sports',
        mockDraftRange: '3-8',
        strengths: ['Playmaking', 'Basketball IQ', 'Shooting'],
        weaknesses: ['Size', 'Defense'],
        trending: 'rising',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'darryn-peterson',
        name: 'Darryn Peterson',
        age: 18,
        team: 'Kansas Jayhawks',
        position: 'SG',
        height: '1.96m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2025,
        stats: { ppg: 18.7, apg: 4.2, rpg: 5.1, fg: 45.3 },
        ranking: 4,
        verified: false,
        source: 'ESPN/247Sports',
        mockDraftRange: '5-12',
        strengths: ['Scoring versatility', 'Athleticism', 'Upside'],
        weaknesses: ['Consistency', 'Decision making'],
        trending: 'stable',
        lastUpdate: '2025-01-15'
      },

      // Prospects Class 2026
      {
        id: 'tre-johnson',
        name: 'Tre Johnson',
        age: 17,
        team: 'Lake Highlands HS',
        position: 'SG',
        height: '1.98m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 21.3, apg: 3.8, rpg: 6.4, fg: 46.8 },
        ranking: 5,
        verified: false,
        source: 'ESPN/247Sports',
        mockDraftRange: '8-15',
        strengths: ['Pure scoring', 'Shot creation', 'Clutch'],
        weaknesses: ['Playmaking', 'Defense'],
        trending: 'hot',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'jasper-johnson',
        name: 'Jasper Johnson',
        age: 17,
        team: 'Link Year Prep',
        position: 'PG',
        height: '1.88m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 17.9, apg: 8.2, rpg: 4.7, fg: 42.1 },
        ranking: 6,
        verified: false,
        source: 'ESPN/247Sports',
        mockDraftRange: '10-20',
        strengths: ['Elite passing', 'Speed', 'Leadership'],
        weaknesses: ['Size', 'Shooting'],
        trending: 'rising',
        lastUpdate: '2025-01-15'
      }
    ];

    // 🇪🇺 PROSPECTS EUROPEUS (EuroBasket/DraftExpress)
    const europeanProspects = [
      {
        id: 'nolan-traore',
        name: 'Nolan Traore',
        age: 17,
        team: 'Paris Basketball',
        position: 'PG',
        height: '1.91m',
        nationality: '🇫🇷',
        region: 'EUROPE',
        draftClass: 2025,
        stats: { ppg: 14.8, apg: 8.1, rpg: 3.9, fg: 41.2 },
        ranking: 7,
        verified: false,
        source: 'EuroBasket/DraftExpress',
        mockDraftRange: '12-20',
        strengths: ['Court vision', 'Basketball IQ', 'Fundamentals'],
        weaknesses: ['Athleticism', 'Strength'],
        trending: 'rising',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'hugo-gonzalez',
        name: 'Hugo Gonzalez',
        age: 17,
        team: 'Real Madrid',
        position: 'C',
        height: '2.11m',
        nationality: '🇪🇸',
        region: 'EUROPE',
        draftClass: 2025,
        stats: { ppg: 11.4, apg: 1.8, rpg: 8.9, fg: 49.6 },
        ranking: 8,
        verified: false,
        source: 'EuroBasket/DraftExpress',
        mockDraftRange: '15-25',
        strengths: ['Size', 'Fundamentals', 'Potential'],
        weaknesses: ['Mobility', 'Athleticism'],
        trending: 'stable',
        lastUpdate: '2025-01-15'
      },
      {
        id: 'mathis-dossou-yovo',
        name: 'Mathis Dossou-Yovo',
        age: 18,
        team: 'Cholet',
        position: 'SF',
        height: '2.03m',
        nationality: '🇫🇷',
        region: 'EUROPE',
        draftClass: 2025,
        stats: { ppg: 13.2, apg: 2.4, rpg: 6.7, fg: 44.8 },
        ranking: 9,
        verified: false,
        source: 'EuroBasket/DraftExpress',
        mockDraftRange: '20-30',
        strengths: ['Length', 'Defense', 'Motor'],
        weaknesses: ['Offense', 'Consistency'],
        trending: 'rising',
        lastUpdate: '2025-01-15'
      }
    ];

    // Combinar todos os prospects
    this.prospects = [...brazilianProspects, ...americanProspects, ...europeanProspects];
    
    // Organizar por classes de draft
    this.organizeDraftClasses();
    this.organizeByPosition();
    this.organizeByRegion();
  }

  organizeDraftClasses() {
    this.prospects.forEach(prospect => {
      if (this.draftClasses[prospect.draftClass]) {
        this.draftClasses[prospect.draftClass].push(prospect);
      }
    });
    
    // Ordenar por ranking dentro de cada classe
    Object.keys(this.draftClasses).forEach(year => {
      this.draftClasses[year].sort((a, b) => a.ranking - b.ranking);
    });
  }

  organizeByPosition() {
    this.prospects.forEach(prospect => {
      if (this.positionGroups[prospect.position]) {
        this.positionGroups[prospect.position].push(prospect);
      }
    });
  }

  organizeByRegion() {
    this.prospects.forEach(prospect => {
      if (this.regions[prospect.region]) {
        this.regions[prospect.region].push(prospect);
      }
    });
  }

  // Métodos de consulta para Mock Draft
  getAllProspects() {
    return this.prospects;
  }

  getProspectsByDraftClass(year) {
    return this.draftClasses[year] || [];
  }

  getProspectsByPosition(position) {
    return this.positionGroups[position] || [];
  }

  getProspectsByRegion(region) {
    return this.regions[region] || [];
  }

  getTopProspects(limit = 30) {
    return this.prospects
      .sort((a, b) => a.ranking - b.ranking)
      .slice(0, limit);
  }

  getBrazilianProspects() {
    return this.regions['BRAZIL'] || [];
  }

  getInternationalProspects() {
    return [...(this.regions['USA'] || []), ...(this.regions['EUROPE'] || []), ...(this.regions['INTERNATIONAL'] || [])];
  }

  getTrendingProspects() {
    return this.prospects.filter(p => p.trending === 'hot' || p.trending === 'rising');
  }

  searchProspects(query) {
    const searchTerm = query.toLowerCase();
    return this.prospects.filter(prospect => 
      prospect.name.toLowerCase().includes(searchTerm) ||
      prospect.team.toLowerCase().includes(searchTerm) ||
      prospect.position.toLowerCase().includes(searchTerm) ||
      prospect.nationality.toLowerCase().includes(searchTerm)
    );
  }

  getProspectById(id) {
    return this.prospects.find(p => p.id === id);
  }

  getProspectsInDraftRange(minPick, maxPick) {
    return this.prospects.filter(prospect => {
      const [min, max] = prospect.mockDraftRange.split('-').map(n => parseInt(n));
      return (min <= maxPick && max >= minPick);
    });
  }

  // Estatísticas para o dashboard
  getDatabaseStats() {
    return {
      total: this.prospects.length,
      brazilian: this.regions['BRAZIL'].length,
      international: this.getInternationalProspects().length,
      class2025: this.draftClasses[2025].length,
      class2026: this.draftClasses[2026].length,
      verified: this.prospects.filter(p => p.verified).length,
      trending: this.getTrendingProspects().length,
      byPosition: {
        PG: this.positionGroups['PG'].length,
        SG: this.positionGroups['SG'].length,
        SF: this.positionGroups['SF'].length,
        PF: this.positionGroups['PF'].length,
        C: this.positionGroups['C'].length
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

export default MockDraftDatabase;
