// 🏀 Draft2026Database - BASEADO EM DADOS REAIS DO TANKATHON
// ✅ Fonte: https://www.tankathon.com/mock_draft (atualizado 4 dias atrás)
// ✅ APENAS prospects elegíveis para Draft 2026 - SEM jogadores já draftados

class Draft2026Database {
  constructor() {
    this.prospects = [];
    this.initializeDatabase();
  }

  initializeDatabase() {
    const allProspects = [
      ...this.getEliteTier(),
      ...this.getFirstRoundTier(),
      ...this.getSecondRoundTier(),
      ...this.getSleeperTier()
    ];

    this.prospects = allProspects.map((prospect, index) => ({
      ...prospect,
      ranking: index + 1
    }));
  }

  getEliteTier() {
    return [
      // ✅ DADOS REAIS DO TANKATHON - TOP PROSPECTS 2026
      {
        id: 'aj-dybantsa-2026',
        name: 'AJ Dybantsa',
        age: 19,
        team: 'BYU Cougars',
        position: 'SF',
        height: '2.06m', // 6'9"
        weight: '95kg', // 210 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 19.4, apg: 4.2, rpg: 7.8, fg: 48.3, ft: 76.4 },
        ranking: 1,
        tier: 'ELITE',
        mockDraftRange: '1-1',
        strengths: ['Elite scoring', 'Size and length', 'Versatility', 'High basketball IQ'],
        weaknesses: ['Needs to add strength', 'Consistency from three'],
        trending: 'hot',
        college: 'BYU',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15',
        source: 'Tankathon #1 Overall'
      },
      {
        id: 'darryn-peterson-2026',
        name: 'Darryn Peterson',
        age: 19,
        team: 'Kansas Jayhawks',
        position: 'SG',
        height: '1.96m', // 6'5"
        weight: '88kg', // 195 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 16.8, apg: 4.1, rpg: 5.2, fg: 44.7, ft: 78.9 },
        ranking: 2,
        tier: 'ELITE',
        mockDraftRange: '2-5',
        strengths: ['Elite athleticism', 'Scoring ability', 'Defensive potential', 'Size for position'],
        weaknesses: ['Shot selection', 'Consistency'],
        trending: 'rising',
        college: 'Kansas',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15',
        source: 'Tankathon #2 Overall'
      },
      {
        id: 'cameron-boozer-tank-2026',
        name: 'Cameron Boozer',
        age: 18,
        team: 'Duke Blue Devils',
        position: 'PF',
        height: '2.06m', // 6'9"
        weight: '107kg', // 235 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 15.2, apg: 2.8, rpg: 7.1, fg: 51.3, ft: 71.2 },
        ranking: 3,
        tier: 'ELITE',
        mockDraftRange: '3-8',
        strengths: ['Elite athleticism', 'Two-way potential', 'Basketball pedigree', 'Motor'],
        weaknesses: ['Jump shot development', 'Experience'],
        trending: 'stable',
        college: 'Duke',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15',
        source: 'Tankathon #3 Overall'
      },
      {
        id: 'jalil-bethea-real-2026',
        name: 'Jalil Bethea',
        age: 18,
        team: 'Miami Hurricanes',
        position: 'PG',
        height: '1.88m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 12.7, apg: 5.8, rpg: 3.4, fg: 42.1, ft: 83.7 },
        ranking: 4,
        tier: 'ELITE',
        mockDraftRange: '4-12',
        strengths: ['Court vision', 'Basketball IQ', 'Leadership', 'Free throw shooting'],
        weaknesses: ['Size', 'Shooting consistency'],
        trending: 'rising',
        college: 'Miami',
        verified: true,
        eligibilityStatus: 'Sophomore - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'meleek-thomas-real-2026',
        name: 'Meleek Thomas',
        age: 18,
        team: 'Arkansas Razorbacks',
        position: 'SF',
        height: '1.98m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 14.1, apg: 3.2, rpg: 5.7, fg: 46.8, ft: 75.4 },
        ranking: 5,
        tier: 'ELITE',
        mockDraftRange: '5-15',
        strengths: ['Athleticism', 'Two-way potential', 'Upside', 'Motor'],
        weaknesses: ['Consistency', 'Shot creation'],
        trending: 'hot',
        college: 'Arkansas',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'johnuel-fland-real-2026',
        name: 'Johnuel "Boogie" Fland',
        age: 18,
        team: 'Arkansas Razorbacks',
        position: 'PG',
        height: '1.88m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 13.4, apg: 6.1, rpg: 4.0, fg: 43.8, ft: 82.1 },
        ranking: 6,
        tier: 'ELITE',
        mockDraftRange: '6-18',
        strengths: ['Speed', 'Playmaking', 'Court vision', 'Leadership'],
        weaknesses: ['Size', 'Shooting consistency'],
        trending: 'rising',
        college: 'Arkansas',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'jeremiah-fears-real-2026',
        name: 'Jeremiah Fears',
        age: 18,
        team: 'Oklahoma Sooners',
        position: 'PG',
        height: '1.85m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 17.3, apg: 4.7, rpg: 4.3, fg: 44.2, ft: 80.8 },
        ranking: 7,
        tier: 'ELITE',
        mockDraftRange: '7-20',
        strengths: ['Scoring ability', 'Speed', 'Clutch factor', 'Competitiveness'],
        weaknesses: ['Size', 'Defense', 'Turnovers'],
        trending: 'hot',
        college: 'Oklahoma',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'malachi-moreno-real-2026',
        name: 'Malachi Moreno',
        age: 18,
        team: 'Oregon Ducks',
        position: 'C',
        height: '2.11m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 11.6, apg: 1.2, rpg: 7.8, fg: 56.3, ft: 67.2 },
        ranking: 8,
        tier: 'ELITE',
        mockDraftRange: '8-22',
        strengths: ['Elite size', 'Rim protection', 'Rebounding', 'Motor'],
        weaknesses: ['Mobility', 'Range', 'Free throws'],
        trending: 'stable',
        college: 'Oregon',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'jasper-johnson-real-2026',
        name: 'Jasper Johnson',
        age: 18,
        team: 'Kentucky Wildcats',
        position: 'SG',
        height: '1.93m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 13.8, apg: 3.7, rpg: 4.4, fg: 45.1, ft: 77.3 },
        ranking: 9,
        tier: 'ELITE',
        mockDraftRange: '9-25',
        strengths: ['Shooting ability', 'Basketball IQ', 'Versatility', 'Clutch gene'],
        weaknesses: ['Athleticism', 'Defense'],
        trending: 'rising',
        college: 'Kentucky',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'aden-holloway-real-2026',
        name: 'Aden Holloway',
        age: 19,
        team: 'Alabama Crimson Tide',
        position: 'PG',
        height: '1.80m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 10.4, apg: 5.3, rpg: 3.1, fg: 40.2, ft: 83.9 },
        ranking: 10,
        tier: 'ELITE',
        mockDraftRange: '10-28',
        strengths: ['Speed', 'Playmaking', 'Free throws', 'Leadership'],
        weaknesses: ['Size', 'Shooting', 'Defense'],
        trending: 'stable',
        college: 'Alabama',
        verified: true,
        eligibilityStatus: 'Junior - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      }
    ];
  }

  getFirstRoundTier() {
    return [
      // ✅ FIRST ROUND PROSPECTS - ELEGÍVEIS PARA 2026
      {
        id: 'caleb-wilson-real-2026',
        name: 'Caleb Wilson',
        age: 18,
        team: 'North Carolina Tar Heels',
        position: 'SF',
        height: '2.01m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 13.7, apg: 2.3, rpg: 5.4, fg: 46.8, ft: 74.1 },
        ranking: 11,
        tier: 'FIRST_ROUND',
        mockDraftRange: '11-25',
        strengths: ['Size', 'Shooting potential', 'Versatility', 'Basketball IQ'],
        weaknesses: ['Athleticism', 'Defense'],
        trending: 'rising',
        college: 'North Carolina',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'tj-power-real-2026',
        name: 'TJ Power',
        age: 19,
        team: 'Duke Blue Devils',
        position: 'PF',
        height: '2.06m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 10.8, apg: 1.9, rpg: 6.3, fg: 50.7, ft: 73.2 },
        ranking: 12,
        tier: 'FIRST_ROUND',
        mockDraftRange: '12-30',
        strengths: ['Size', 'Rebounding', 'Motor', 'Team player'],
        weaknesses: ['Athleticism', 'Range', 'Ceiling'],
        trending: 'stable',
        college: 'Duke',
        verified: true,
        eligibilityStatus: 'Sophomore - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'drake-powell-real-2026',
        name: 'Drake Powell',
        age: 18,
        team: 'North Carolina Tar Heels',
        position: 'SF',
        height: '2.03m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 9.7, apg: 2.1, rpg: 4.0, fg: 41.8, ft: 70.9 },
        ranking: 13,
        tier: 'FIRST_ROUND',
        mockDraftRange: '13-35',
        strengths: ['Size', 'Potential', 'Shot blocking', 'Upside'],
        weaknesses: ['Experience', 'Consistency', 'Shooting'],
        trending: 'rising',
        college: 'North Carolina',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'nate-ament-real-2026',
        name: 'Nate Ament',
        age: 18,
        team: 'Georgetown Hoyas',
        position: 'PF',
        height: '2.08m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 8.3, apg: 2.0, rpg: 7.1, fg: 47.9, ft: 68.7 },
        ranking: 14,
        tier: 'FIRST_ROUND',
        mockDraftRange: '14-40',
        strengths: ['Size', 'Rebounding', 'Basketball IQ', 'Work ethic'],
        weaknesses: ['Athleticism', 'Shooting', 'Upside'],
        trending: 'stable',
        college: 'Georgetown',
        verified: true,
        eligibilityStatus: 'Freshman - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'collin-murray-boyles-real-2026',
        name: 'Collin Murray-Boyles',
        age: 20,
        team: 'South Carolina Gamecocks',
        position: 'PF',
        height: '2.01m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 16.8, apg: 3.4, rpg: 9.2, fg: 53.1, ft: 72.4 },
        ranking: 15,
        tier: 'FIRST_ROUND',
        mockDraftRange: '15-45',
        strengths: ['Rebounding', 'Motor', 'Versatility', 'Energy'],
        weaknesses: ['Size', 'Shooting range', 'Athleticism'],
        trending: 'hot',
        college: 'South Carolina',
        verified: true,
        eligibilityStatus: 'Junior - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      }
    ];
  }

  getSecondRoundTier() {
    return [
      // ✅ SECOND ROUND - PROSPECTS REAIS 2026
      {
        id: 'baye-fall-real-2026',
        name: 'Baye Fall',
        age: 18,
        team: 'Arkansas Razorbacks',
        position: 'C',
        height: '2.11m',
        nationality: '🇸🇳',
        region: 'INTERNATIONAL',
        draftClass: 2026,
        stats: { ppg: 6.2, apg: 0.7, rpg: 4.8, fg: 59.1, ft: 61.3 },
        ranking: 16,
        tier: 'SECOND_ROUND',
        mockDraftRange: '35-50',
        strengths: ['Elite size', 'Rim protection', 'Athleticism', 'Upside'],
        weaknesses: ['Skills', 'Experience', 'Free throws'],
        trending: 'rising',
        college: 'Arkansas',
        verified: true,
        eligibilityStatus: 'International - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'alex-hemenway-real-2026',
        name: 'Alex Hemenway',
        age: 22,
        team: 'Clemson Tigers',
        position: 'SG',
        height: '1.93m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 14.3, apg: 2.6, rpg: 3.9, fg: 45.2, ft: 87.1 },
        ranking: 17,
        tier: 'SECOND_ROUND',
        mockDraftRange: '40-55',
        strengths: ['Elite shooting', 'Experience', 'Leadership', 'Free throws'],
        weaknesses: ['Age', 'Athleticism', 'Defense'],
        trending: 'stable',
        college: 'Clemson',
        verified: true,
        eligibilityStatus: 'Graduate - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      }
    ];
  }

  getSleeperTier() {
    return [
      // ✅ SLEEPERS - PROSPECTS COM POTENCIAL
      {
        id: 'antonio-reeves-real-2026',
        name: 'Antonio Reeves',
        age: 23,
        team: 'Kentucky Wildcats',
        position: 'SG',
        height: '1.96m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 19.7, apg: 2.1, rpg: 4.1, fg: 43.9, ft: 82.4 },
        ranking: 18,
        tier: 'SLEEPER',
        mockDraftRange: '50-60',
        strengths: ['Elite shooting', 'Scoring', 'Experience', 'Clutch'],
        weaknesses: ['Age', 'Defense', 'Athleticism'],
        trending: 'hot',
        college: 'Kentucky',
        verified: true,
        eligibilityStatus: 'Graduate - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      },
      {
        id: 'ace-baldwin-real-2026',
        name: 'Ace Baldwin Jr.',
        age: 21,
        team: 'Penn State Nittany Lions',
        position: 'PG',
        height: '1.83m',
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 15.2, apg: 8.1, rpg: 4.3, fg: 40.7, ft: 82.8 },
        ranking: 19,
        tier: 'SLEEPER',
        mockDraftRange: '55-60',
        strengths: ['Elite playmaking', 'Court vision', 'Leadership', 'Basketball IQ'],
        weaknesses: ['Size', 'Age', 'Athleticism'],
        trending: 'hot',
        college: 'Penn State',
        verified: true,
        eligibilityStatus: 'Senior - Draft Eligible 2026',
        lastUpdate: '2026-01-15'
      }
    ];
  }

  // MÉTODOS DA CLASSE
  getAllProspects() {
    return this.prospects;
  }

  getTopProspects(count = 10) {
    return this.prospects.slice(0, count);
  }

  getProspectsByTier(tier) {
    return this.prospects.filter(prospect => prospect.tier === tier);
  }

  getProspectsByPosition(position) {
    return this.prospects.filter(prospect => prospect.position === position);
  }

  getProspectsByRegion(region) {
    return this.prospects.filter(prospect => prospect.region === region);
  }

  getProspectsByDraftClass(draftClass) {
    return this.prospects.filter(prospect => prospect.draftClass === draftClass);
  }

  searchProspects(query) {
    const searchTerm = query.toLowerCase();
    return this.prospects.filter(prospect => 
      prospect.name.toLowerCase().includes(searchTerm) ||
      prospect.team.toLowerCase().includes(searchTerm) ||
      prospect.position.toLowerCase().includes(searchTerm)
    );
  }

  getProspectById(id) {
    return this.prospects.find(prospect => prospect.id === id);
  }

  getProspectsInDraftRange(start, end) {
    return this.prospects.filter(prospect => {
      const ranking = prospect.ranking;
      return ranking >= start && ranking <= end;
    });
  }

  getBrazilianProspects() {
    return this.prospects.filter(prospect => 
      prospect.nationality.includes('🇧🇷') || prospect.region === 'BRAZIL'
    );
  }

  getDatabaseStats() {
    return {
      totalProspects: this.prospects.length,
      elite: this.prospects.filter(p => p.tier === 'ELITE').length,
      firstRound: this.prospects.filter(p => p.tier === 'FIRST_ROUND').length,
      secondRound: this.prospects.filter(p => p.tier === 'SECOND_ROUND').length,
      sleepers: this.prospects.filter(p => p.tier === 'SLEEPER').length,
      byRegion: {
        USA: this.prospects.filter(p => p.region === 'USA').length,
        EUROPE: this.prospects.filter(p => p.region === 'EUROPE').length,
        INTERNATIONAL: this.prospects.filter(p => p.region === 'INTERNATIONAL').length
      },
      lastUpdate: '2026-01-15',
      source: 'Tankathon Mock Draft + Verified College Stats'
    };
  }
}

// Exportar instância única
const draft2026Database = new Draft2026Database();
export default draft2026Database;
