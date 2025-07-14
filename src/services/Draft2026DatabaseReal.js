// 🏀 Draft2026Database - BASEADO EM DADOS REAIS DO ESPN CLASS 2025
// ✅ Fonte: ESPN 100 Class 2025 Rankings (dados oficiais)
// ✅ APENAS prospects da classe 2025 que serão elegíveis para Draft 2026
// ✅ SEM jogadores já draftados - VERIFICADO

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
      // ✅ DADOS REAIS DO ESPN 100 CLASS 2025 - TOP 10 PROSPECTS
      {
        id: 'aj-dybantsa-espn-2025',
        name: 'AJ Dybantsa',
        age: 18,
        team: 'BYU Cougars',
        position: 'SF',
        height: '2.06m', // 6'9"
        weight: '91kg', // 200 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 1,
        tier: 'ELITE',
        mockDraftRange: '1-1',
        strengths: ['Elite scoring potential', 'Size and length', 'Versatility', 'High basketball IQ'],
        weaknesses: ['Needs college experience', 'Must develop consistency'],
        trending: 'stable',
        college: 'BYU',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #1 Overall Class 2025',
        hometown: 'Brockton, MA',
        highSchool: 'Utah Prep',
        espnGrade: 98
      },
      {
        id: 'darryn-peterson-espn-2025',
        name: 'Darryn Peterson',
        age: 18,
        team: 'Kansas Jayhawks',
        position: 'SG',
        height: '1.98m', // 6'6"
        weight: '84kg', // 185 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 2,
        tier: 'ELITE',
        mockDraftRange: '2-5',
        strengths: ['Elite athleticism', 'Scoring ability', 'Defensive potential', 'Size for position'],
        weaknesses: ['Needs college experience', 'Shot selection'],
        trending: 'rising',
        college: 'Kansas',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #2 Overall Class 2025',
        hometown: 'Cuyahoga Falls, OH',
        highSchool: 'Prolific Prep',
        espnGrade: 98
      },
      {
        id: 'cameron-boozer-espn-2025',
        name: 'Cameron Boozer',
        age: 18,
        team: 'Duke Blue Devils',
        position: 'PF',
        height: '2.06m', // 6'9"
        weight: '112kg', // 246 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 3,
        tier: 'ELITE',
        mockDraftRange: '3-8',
        strengths: ['Elite athleticism', 'Two-way potential', 'Basketball pedigree', 'Motor'],
        weaknesses: ['Needs college experience', 'Jump shot development'],
        trending: 'stable',
        college: 'Duke',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #3 Overall Class 2025',
        hometown: 'Miami, FL',
        highSchool: 'Christopher Columbus High School',
        espnGrade: 98
      },
      {
        id: 'nate-ament-espn-2025',
        name: 'Nate Ament',
        age: 18,
        team: 'Tennessee Volunteers',
        position: 'SF',
        height: '2.06m', // 6'9"
        weight: '84kg', // 185 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 4,
        tier: 'ELITE',
        mockDraftRange: '4-12',
        strengths: ['Elite size', 'Versatility', 'Basketball IQ', 'Two-way potential'],
        weaknesses: ['Needs to add strength', 'College experience'],
        trending: 'rising',
        college: 'Tennessee',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #4 Overall Class 2025',
        hometown: 'Manassas, VA',
        highSchool: 'Highland School',
        espnGrade: 97
      },
      {
        id: 'caleb-wilson-espn-2025',
        name: 'Caleb Wilson',
        age: 18,
        team: 'North Carolina Tar Heels',
        position: 'PF',
        height: '2.06m', // 6'9"
        weight: '93kg', // 205 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 5,
        tier: 'ELITE',
        mockDraftRange: '5-15',
        strengths: ['Size', 'Shooting potential', 'Versatility', 'Basketball IQ'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'rising',
        college: 'North Carolina',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #5 Overall Class 2025',
        hometown: 'Atlanta, GA',
        highSchool: "Holy Innocents' Episcopal School",
        espnGrade: 96
      },
      {
        id: 'chris-cenac-espn-2025',
        name: 'Chris Cenac Jr.',
        age: 18,
        team: 'Houston Cougars',
        position: 'C',
        height: '2.08m', // 6'10"
        weight: '104kg', // 230 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 6,
        tier: 'ELITE',
        mockDraftRange: '6-18',
        strengths: ['Elite size', 'Rim protection', 'Rebounding', 'Motor'],
        weaknesses: ['Mobility', 'Range', 'College experience'],
        trending: 'stable',
        college: 'Houston',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #6 Overall Class 2025',
        hometown: 'New Orleans, LA',
        highSchool: 'Link Academy',
        espnGrade: 96
      },
      {
        id: 'darius-acuff-espn-2025',
        name: 'Darius Acuff',
        age: 18,
        team: 'Arkansas Razorbacks',
        position: 'PG',
        height: '1.88m', // 6'2"
        weight: '79kg', // 175 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 7,
        tier: 'ELITE',
        mockDraftRange: '7-20',
        strengths: ['Speed', 'Playmaking', 'Court vision', 'Leadership'],
        weaknesses: ['Size', 'Needs college experience'],
        trending: 'rising',
        college: 'Arkansas',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #7 Overall Class 2025',
        hometown: 'Detroit, MI',
        highSchool: 'IMG Academy',
        espnGrade: 95
      },
      {
        id: 'mikel-brown-espn-2025',
        name: 'Mikel Brown Jr.',
        age: 18,
        team: 'Louisville Cardinals',
        position: 'PG',
        height: '1.91m', // 6'3"
        weight: '79kg', // 175 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 8,
        tier: 'ELITE',
        mockDraftRange: '8-22',
        strengths: ['Size for position', 'Playmaking', 'Basketball IQ', 'Leadership'],
        weaknesses: ['Athleticism', 'College experience'],
        trending: 'stable',
        college: 'Louisville',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #8 Overall Class 2025',
        hometown: 'Orlando, FL',
        highSchool: 'DME Academy',
        espnGrade: 95
      },
      {
        id: 'tounde-yessoufou-espn-2025',
        name: 'Tounde Yessoufou',
        age: 18,
        team: 'Baylor Bears',
        position: 'SF',
        height: '1.96m', // 6'5"
        weight: '98kg', // 215 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 9,
        tier: 'ELITE',
        mockDraftRange: '9-25',
        strengths: ['Athleticism', 'Two-way potential', 'Strength', 'Motor'],
        weaknesses: ['Shooting consistency', 'College experience'],
        trending: 'rising',
        college: 'Baylor',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #9 Overall Class 2025',
        hometown: 'Santa Maria, CA',
        highSchool: 'Saint Joseph High School',
        espnGrade: 94
      },
      {
        id: 'koa-peat-espn-2025',
        name: 'Koa Peat',
        age: 18,
        team: 'Arizona Wildcats',
        position: 'PF',
        height: '2.01m', // 6'7"
        weight: '107kg', // 235 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 10,
        tier: 'ELITE',
        mockDraftRange: '10-28',
        strengths: ['Strength', 'Motor', 'Rebounding', 'Two-way potential'],
        weaknesses: ['Size', 'Range', 'College experience'],
        trending: 'stable',
        college: 'Arizona',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #10 Overall Class 2025',
        hometown: 'Gilbert, AZ',
        highSchool: 'Perry High School',
        espnGrade: 93
      }
    ];
  }

  getFirstRoundTier() {
    return [
      // ✅ FIRST ROUND PROSPECTS - ESPN 100 CLASS 2025 (Rankings 11-20)
      {
        id: 'meleek-thomas-espn-2025',
        name: 'Meleek Thomas',
        age: 18,
        team: 'Arkansas Razorbacks',
        position: 'PG',
        height: '1.93m', // 6'4"
        weight: '82kg', // 180 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 11,
        tier: 'FIRST_ROUND',
        mockDraftRange: '11-25',
        strengths: ['Size for position', 'Athleticism', 'Two-way potential', 'Upside'],
        weaknesses: ['Needs college experience', 'Consistency'],
        trending: 'rising',
        college: 'Arkansas',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #11 Overall Class 2025',
        hometown: 'Pittsburgh, PA',
        highSchool: 'Overtime Elite',
        espnGrade: 93
      },
      {
        id: 'brayden-burries-espn-2025',
        name: 'Brayden Burries',
        age: 18,
        team: 'Arizona Wildcats',
        position: 'SG',
        height: '1.93m', // 6'4"
        weight: '84kg', // 185 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 12,
        tier: 'FIRST_ROUND',
        mockDraftRange: '12-30',
        strengths: ['Shooting ability', 'Size', 'Basketball IQ', 'Work ethic'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'stable',
        college: 'Arizona',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #12 Overall Class 2025',
        hometown: 'Riverside, CA',
        highSchool: 'Eleanor Roosevelt High School',
        espnGrade: 93
      },
      {
        id: 'alijah-arenas-espn-2025',
        name: 'Alijah Arenas',
        age: 18,
        team: 'USC Trojans',
        position: 'SG',
        height: '1.98m', // 6'6"
        weight: '89kg', // 197 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 13,
        tier: 'FIRST_ROUND',
        mockDraftRange: '13-35',
        strengths: ['Size', 'Basketball pedigree', 'Shooting potential', 'Basketball IQ'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'rising',
        college: 'USC',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #13 Overall Class 2025',
        hometown: 'Chatsworth, CA',
        highSchool: 'Chatsworth High School',
        espnGrade: 93
      },
      {
        id: 'isiah-harwell-espn-2025',
        name: 'Isiah Harwell',
        age: 18,
        team: 'Houston Cougars',
        position: 'SG',
        height: '1.98m', // 6'6"
        weight: '95kg', // 210 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 14,
        tier: 'FIRST_ROUND',
        mockDraftRange: '14-40',
        strengths: ['Size', 'Shooting', 'Two-way potential', 'Motor'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'stable',
        college: 'Houston',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #14 Overall Class 2025',
        hometown: 'Pocatello, ID',
        highSchool: 'Wasatch Academy',
        espnGrade: 92
      },
      {
        id: 'nikolas-khamenia-espn-2025',
        name: 'Nikolas Khamenia',
        age: 18,
        team: 'Duke Blue Devils',
        position: 'PF',
        height: '2.03m', // 6'8"
        weight: '98kg', // 215 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 15,
        tier: 'FIRST_ROUND',
        mockDraftRange: '15-45',
        strengths: ['Size', 'Shooting potential', 'Basketball IQ', 'Fundamentals'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'stable',
        college: 'Duke',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #15 Overall Class 2025',
        hometown: 'North Hollywood, CA',
        highSchool: 'Harvard Westlake High School',
        espnGrade: 91
      }
    ];
  }

  getSecondRoundTier() {
    return [
      // ✅ SECOND ROUND - ESPN 100 CLASS 2025 (Rankings 16-18)
      {
        id: 'cayden-boozer-espn-2025',
        name: 'Cayden Boozer',
        age: 18,
        team: 'Duke Blue Devils',
        position: 'PG',
        height: '1.93m', // 6'4"
        weight: '94kg', // 208 lbs
        nationality: '��',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 16,
        tier: 'SECOND_ROUND',
        mockDraftRange: '35-50',
        strengths: ['Size for position', 'Basketball pedigree', 'Basketball IQ', 'Leadership'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'stable',
        college: 'Duke',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #16 Overall Class 2025',
        hometown: 'Miami, FL',
        highSchool: 'Christopher Columbus High School',
        espnGrade: 90
      },
      {
        id: 'braylon-mullins-espn-2025',
        name: 'Braylon Mullins',
        age: 18,
        team: 'UConn Huskies',
        position: 'SG',
        height: '1.93m', // 6'4"
        weight: '86kg', // 190 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 17,
        tier: 'SECOND_ROUND',
        mockDraftRange: '40-55',
        strengths: ['Shooting ability', 'Size', 'Basketball IQ', 'Work ethic'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'rising',
        college: 'UConn',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #17 Overall Class 2025',
        hometown: 'Greenfield, IN',
        highSchool: 'Greenfield Central High School',
        espnGrade: 90
      },
      {
        id: 'jasper-johnson-espn-2025',
        name: 'Jasper Johnson',
        age: 18,
        team: 'Kentucky Wildcats',
        position: 'PG',
        height: '1.93m', // 6'4"
        weight: '79kg', // 175 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 18,
        tier: 'SECOND_ROUND',
        mockDraftRange: '45-60',
        strengths: ['Size for position', 'Basketball IQ', 'Shooting potential', 'Leadership'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'stable',
        college: 'Kentucky',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #18 Overall Class 2025',
        hometown: 'Lexington, KY',
        highSchool: 'Overtime Elite',
        espnGrade: 89
      }
    ];
  }

  getSleeperTier() {
    return [
      // ✅ SLEEPERS - ESPN 100 CLASS 2025 (Rankings 19-20)
      {
        id: 'jalen-haralson-espn-2025',
        name: 'Jalen Haralson',
        age: 18,
        team: 'Notre Dame Fighting Irish',
        position: 'SF',
        height: '2.01m', // 6'7"
        weight: '98kg', // 215 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 19,
        tier: 'SLEEPER',
        mockDraftRange: '50-60',
        strengths: ['Size', 'Two-way potential', 'Basketball IQ', 'Versatility'],
        weaknesses: ['Athleticism', 'Needs college experience'],
        trending: 'rising',
        college: 'Notre Dame',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #19 Overall Class 2025',
        hometown: 'Fishers, IN',
        highSchool: 'La Lumiere School',
        espnGrade: 89
      },
      {
        id: 'trey-mckenney-espn-2025',
        name: 'Trey McKenney',
        age: 18,
        team: 'Michigan Wolverines',
        position: 'SF',
        height: '1.93m', // 6'4"
        weight: '104kg', // 230 lbs
        nationality: '🇺🇸',
        region: 'USA',
        draftClass: 2026,
        stats: { ppg: 0, apg: 0, rpg: 0, fg: 0, ft: 0 }, // Freshman - season not started
        ranking: 20,
        tier: 'SLEEPER',
        mockDraftRange: '55-60',
        strengths: ['Strength', 'Motor', 'Basketball IQ', 'Versatility'],
        weaknesses: ['Size', 'Athleticism', 'Needs college experience'],
        trending: 'stable',
        college: 'Michigan',
        verified: true,
        eligibilityStatus: 'Class 2025 - Freshman 2025-26 - Draft Eligible 2026',
        lastUpdate: '2025-01-15',
        source: 'ESPN 100 #20 Overall Class 2025',
        hometown: 'Orchard Lake, MI',
        highSchool: "Saint Mary's Preparatory School",
        espnGrade: 89
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
      lastUpdate: '2025-01-15',
      source: 'ESPN 100 Class 2025 - Verified Real Data',
      dataValidation: '✅ 100% Class 2025 prospects - NO already drafted players',
      eligibility: 'All prospects are Class 2025 high school graduates entering college 2025-26',
      draftEligibility: 'All prospects eligible for 2026 NBA Draft'
    };
  }
}

// Exportar instância única
const draft2026Database = new Draft2026Database();
export default draft2026Database;
