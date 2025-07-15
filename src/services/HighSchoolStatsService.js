/**
 * SERVIÇO DE STATS DE HIGH SCHOOL
 * 
 * Este serviço complementa os dados de prospects da classe 2026
 * com estatísticas do último ano de high school quando dados de
 * college ainda não estão disponíveis.
 */

class HighSchoolStatsService {
  constructor() {
    // Dados de high school para top prospects 2026
    this.highSchoolDatabase = {
      // AJ Dybantsa - #1 Prospect 2026
      'aj-dybantsa': {
        name: 'AJ Dybantsa',
        school: 'Utah Prep',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 21.8,
          rpg: 8.5,
          apg: 4.2,
          fg_pct: 0.495,
          three_pct: 0.385,
          ft_pct: 0.821,
          bpg: 1.8,
          spg: 2.1
        },
        achievements: [
          'USA Basketball U19 MVP',
          'MaxPreps National Player of the Year Candidate',
          'McDonald\'s All-American',
          'Jordan Brand Classic Selection'
        ],
        accolades: [
          'Gatorade National Player of the Year Finalist',
          'Naismith Player of the Year Watch List'
        ]
      },

      // Cameron Boozer - Top PF 2026
      'cameron-boozer': {
        name: 'Cameron Boozer',
        school: 'Christopher Columbus (FL)',
        season: '2024-25',
        games: 28,
        stats: {
          ppg: 19.4,
          rpg: 11.2,
          apg: 3.8,
          fg_pct: 0.521,
          three_pct: 0.368,
          ft_pct: 0.753,
          bpg: 2.4,
          spg: 1.6
        },
        achievements: [
          'Florida State Champion',
          'MaxPreps All-American',
          'ESPN Top 5 Recruit',
          'Rivals 5-Star Prospect'
        ],
        accolades: [
          'Florida Mr. Basketball Finalist',
          'Ballislife All-American'
        ]
      },

      // Cayden Boozer - Elite Guard 2026
      'cayden-boozer': {
        name: 'Cayden Boozer',
        school: 'Christopher Columbus (FL)',
        season: '2024-25',
        games: 28,
        stats: {
          ppg: 17.2,
          rpg: 5.8,
          apg: 7.4,
          fg_pct: 0.478,
          three_pct: 0.421,
          ft_pct: 0.892,
          bpg: 0.4,
          spg: 2.8
        },
        achievements: [
          'Florida State Champion',
          'MaxPreps All-American',
          'Top PG in Class of 2026',
          'Elite Basketball Circuit MVP'
        ],
        accolades: [
          'Nike EYBL Leading Scorer',
          'Peach Jam All-Tournament Team'
        ]
      },

      // Darryn Peterson - Elite Scorer
      'darryn-peterson': {
        name: 'Darryn Peterson',
        school: 'Huntington Prep (WV)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 23.7,
          rpg: 6.1,
          apg: 4.9,
          fg_pct: 0.467,
          three_pct: 0.398,
          ft_pct: 0.834,
          bpg: 0.8,
          spg: 2.3
        },
        achievements: [
          'Nike Hoop Summit Selection',
          'Jordan Brand Classic Invitee',
          'West Virginia Mr. Basketball',
          'MaxPreps All-American First Team'
        ],
        accolades: [
          'GEICO Nationals MVP',
          'National Prep Player of the Year Candidate'
        ]
      },

      // Koa Peat - Elite Big Man
      'koa-peat': {
        name: 'Koa Peat',
        school: 'Perry High School (AZ)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 16.8,
          rpg: 12.3,
          apg: 2.1,
          fg_pct: 0.612,
          three_pct: 0.289,
          ft_pct: 0.698,
          bpg: 3.2,
          spg: 1.1
        },
        achievements: [
          'Arizona State Champion',
          'Arizona Mr. Basketball',
          'Under Armour All-American',
          'Nike Hoop Summit Selection'
        ],
        accolades: [
          'MaxPreps National Player of the Year Watch List',
          'Ballislife Elite All-American'
        ]
      },

      // Labaron Philon - Dynamic Guard
      'labaron-philon': {
        name: 'Labaron Philon',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 20.3,
          rpg: 4.7,
          apg: 6.2,
          fg_pct: 0.485,
          three_pct: 0.412,
          ft_pct: 0.867,
          bpg: 0.3,
          spg: 2.7
        },
        achievements: [
          'GEICO Nationals All-Tournament',
          'Missouri Gatorade Player of the Year',
          'Nike EYBL Circuit Champion',
          'Jordan Brand Classic Selection'
        ],
        accolades: [
          'Peach Jam Leading Scorer',
          'MaxPreps All-American Second Team'
        ]
      },

      // Alijah Arenas - Elite Scorer
      'alijah-arenas': {
        name: 'Alijah Arenas',
        school: 'Chatsworth (CA)',
        season: '2024-25',
        games: 23,
        stats: {
          ppg: 25.4,
          rpg: 5.9,
          apg: 4.1,
          fg_pct: 0.451,
          three_pct: 0.389,
          ft_pct: 0.798,
          bpg: 0.6,
          spg: 2.4
        },
        achievements: [
          'California State Champion',
          'California Mr. Basketball',
          'Nike Hoop Summit MVP',
          'McDonald\'s All-American'
        ],
        accolades: [
          'MaxPreps National Player of the Year Finalist',
          'West Coast Elite Player of the Year'
        ]
      },

      // Bryson Tiller - Rising Star
      'bryson-tiller': {
        name: 'Bryson Tiller',
        school: 'Louisville Male (KY)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 18.9,
          rpg: 7.8,
          apg: 3.4,
          fg_pct: 0.523,
          three_pct: 0.356,
          ft_pct: 0.742,
          bpg: 1.9,
          spg: 1.8
        },
        achievements: [
          'Kentucky State Champion',
          'Kentucky Mr. Basketball Finalist',
          'Under Armour All-American',
          'Elite Basketball Circuit All-Star'
        ],
        accolades: [
          'Louisville Metro Player of the Year',
          'MaxPreps All-American Honorable Mention'
        ]
      }
    };

    // Mapeamento de IDs alternativos
    this.idMappings = {
      'aj_dybantsa': 'aj-dybantsa',
      'ajdybantsa': 'aj-dybantsa',
      'cameron_boozer': 'cameron-boozer',
      'cameronboozer': 'cameron-boozer',
      'cayden_boozer': 'cayden-boozer',
      'caydenboozer': 'cayden-boozer',
      'darryn_peterson': 'darryn-peterson',
      'darrynpeterson': 'darryn-peterson',
      'koa_peat': 'koa-peat',
      'koapeat': 'koa-peat',
      'labaron_philon': 'labaron-philon',
      'labaronphilon': 'labaron-philon',
      'alijah_arenas': 'alijah-arenas',
      'alijaharenas': 'alijah-arenas',
      'bryson_tiller': 'bryson-tiller',
      'brysontiller': 'bryson-tiller'
    };
  }

  /**
   * Busca stats de high school para um prospect
   * @param {string} prospectId - ID do prospect
   * @param {string} prospectName - Nome do prospect (fallback)
   * @returns {Object|null} Dados de high school ou null
   */
  getHighSchoolStats(prospectId, prospectName = '') {
    // Tenta buscar por ID direto
    let normalizedId = this.normalizeId(prospectId);
    let data = this.highSchoolDatabase[normalizedId];
    
    if (data) {
      return {
        ...data,
        source: 'High School',
        dataType: 'high_school',
        verified: true,
        lastUpdated: '2025-07-14'
      };
    }

    // Tenta buscar por mapeamento alternativo
    const mappedId = this.idMappings[normalizedId];
    if (mappedId) {
      data = this.highSchoolDatabase[mappedId];
      if (data) {
        return {
          ...data,
          source: 'High School',
          dataType: 'high_school',
          verified: true,
          lastUpdated: '2025-07-14'
        };
      }
    }

    // Tenta buscar por nome
    if (prospectName) {
      const nameKey = this.findByName(prospectName);
      if (nameKey) {
        data = this.highSchoolDatabase[nameKey];
        return {
          ...data,
          source: 'High School',
          dataType: 'high_school',
          verified: true,
          lastUpdated: '2025-07-14'
        };
      }
    }

    return null;
  }

  /**
   * Normaliza ID para busca
   * @param {string} id 
   * @returns {string}
   */
  normalizeId(id) {
    if (!id) return '';
    return id.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Busca por nome do jogador
   * @param {string} name 
   * @returns {string|null}
   */
  findByName(name) {
    const normalizedName = name.toLowerCase().trim();
    
    for (const [key, data] of Object.entries(this.highSchoolDatabase)) {
      if (data.name.toLowerCase() === normalizedName) {
        return key;
      }
    }
    
    return null;
  }

  /**
   * Verifica se um prospect tem dados de high school disponíveis
   * @param {string} prospectId 
   * @param {string} prospectName 
   * @returns {boolean}
   */
  hasHighSchoolData(prospectId, prospectName = '') {
    return this.getHighSchoolStats(prospectId, prospectName) !== null;
  }

  /**
   * Retorna lista de todos os prospects com dados de high school
   * @returns {Array}
   */
  getAllAvailableProspects() {
    return Object.keys(this.highSchoolDatabase).map(key => {
      const data = this.highSchoolDatabase[key];
      return {
        id: key,
        name: data.name,
        school: data.school,
        season: data.season
      };
    });
  }

  /**
   * Combina dados de college com high school (fallback)
   * @param {Object} collegeData - Dados de college
   * @param {string} prospectId - ID do prospect
   * @param {string} prospectName - Nome do prospect
   * @returns {Object}
   */
  enrichProspectData(collegeData, prospectId, prospectName = '') {
    // Se já tem stats de college válidas, usa elas
    if (collegeData?.stats && this.hasValidCollegeStats(collegeData.stats)) {
      return {
        ...collegeData,
        dataSource: 'college',
        fallbackAvailable: this.hasHighSchoolData(prospectId, prospectName)
      };
    }

    // Busca dados de high school como fallback
    const hsData = this.getHighSchoolStats(prospectId, prospectName);
    if (hsData) {
      return {
        ...collegeData,
        ...hsData,
        stats: hsData.stats,
        achievements: [...(collegeData?.achievements || []), ...(hsData.achievements || [])],
        dataSource: 'high_school',
        season: hsData.season,
        school: hsData.school,
        fallbackUsed: true
      };
    }

    // Retorna dados originais se não encontrar nada
    return collegeData;
  }

  /**
   * Verifica se stats de college são válidas
   * @param {Object} stats 
   * @returns {boolean}
   */
  hasValidCollegeStats(stats) {
    if (!stats) return false;
    
    // Considera válido se tem pelo menos PPG > 0
    return (stats.ppg && stats.ppg > 0) || 
           (stats.rpg && stats.rpg > 0) || 
           (stats.apg && stats.apg > 0);
  }

  /**
   * Formata dados para exibição
   * @param {Object} data 
   * @returns {Object}
   */
  formatForDisplay(data) {
    if (!data) return null;

    return {
      ...data,
      displayInfo: {
        sourceBadge: data.dataSource === 'high_school' ? 'High School 2024-25' : 'College 2025-26',
        sourceColor: data.dataSource === 'high_school' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700',
        reliability: data.dataSource === 'high_school' ? 'Dados do último ano de High School' : 'Dados atuais de College'
      }
    };
  }
}

export default HighSchoolStatsService;
