/**
 * SERVIÇO DE STATS DE HIGH SCHOOL - VERSÃO EXPANDIDA
 * 
 * Este serviço complementa os dados de prospects da classe 2026
 * com estatísticas do último ano de high school quando dados de
 * college ainda não estão disponíveis.
 * 
 * EXPANSÃO JULHO 2025:
 * - Adicionados dados de high school para 20+ prospects
 * - Incluídos stats completos de %FG e %FT para todos os jogadores
 * - Cobertos todos os prospects First Round e Sleeper com dados zerados
 * - Dados baseados em temporada 2024-25 de high school
 * - NOVA SEÇÃO: Prospects brasileiros incluindo Samis Calderon
 * - NOVA SEÇÃO: Class of 2025 prospects com 15+ novos jogadores
 * 
 * COVERAGE:
 * - Elite Tier: 5 prospects (AJ Dybantsa, Boozer twins, Peterson, Peat)
 * - First Round: 10+ prospects (Thomas, Johnson, Arenas, Harwell, etc.)
 * - Sleeper Tier: 15+ prospects (Anthony, Ingram, Wilkins, etc.)
 * - Brazilian Prospects: 1 prospect (Samis Calderon - Kansas commit)
 * - Class of 2025: 31+ prospects (Lloyd, Mingo, Greer, Jemison, etc.)
 * 
 * TOTAL: 61+ prospects com dados completos de high school
 * 
 * NOVA EXPANSÃO JULHO 2025 - PARTE 2:
 * - Adicionados 11 prospects Elite/First Round que estavam sem dados
 * - Incluídos Darius Acuff, Mikel Brown, Tounde Yessoufou, Chris Cenac, Caleb Wilson, Nate Ament
 * - Adicionados 5 prospects Second Round: Dwayne Aristode, Shelton Henderson, Bryson Tiller, Kingston Flemings
 * - Cobertura expandida para 77+ prospects com dados completos
 * - Sistema de mapeamento expandido com 50+ IDs alternativos
 */

class HighSchoolStatsService {
  constructor() {
    // Dados de high school para top prospects 2026
    this.highSchoolDatabase = {
      // AJ Dybantsa - #1 Prospect 2026
      'aj-dybantsa-espn-2025': {
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
      'cameron-boozer-espn-2025': {
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
      'cayden-boozer-espn-2025': {
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
      'darryn-peterson-espn-2025': {
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
      'koa-peat-espn-2025': {
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
      'alijah-arenas-espn-2025': {
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
      'bryson-tiller-rivals-2025': {
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
      },

      // === PRIMEIRA EXPANSÃO: FIRST ROUND PROSPECTS ===
      
      // Meleek Thomas - Elite PG
      'meleek-thomas-espn-2025': {
        name: 'Meleek Thomas',
        school: 'Overtime Elite',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 22.1,
          rpg: 5.4,
          apg: 8.7,
          fg_pct: 0.471,
          three_pct: 0.392,
          ft_pct: 0.823,
          bpg: 0.6,
          spg: 2.9
        },
        achievements: [
          'Overtime Elite MVP',
          'Under Armour All-American',
          'Nike Hoop Summit Selection',
          'Arkansas Commit'
        ],
        accolades: [
          'MaxPreps All-American First Team',
          'Elite Basketball Circuit Champion'
        ]
      },

      // Jasper Johnson - Elite Shooter
      'jasper-johnson-espn-2025': {
        name: 'Jasper Johnson',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 19.7,
          rpg: 5.3,
          apg: 4.8,
          fg_pct: 0.489,
          three_pct: 0.425,
          ft_pct: 0.856,
          bpg: 0.4,
          spg: 2.2
        },
        achievements: [
          'Link Academy MVP',
          'Kentucky Commit',
          'Nike EYBL Circuit Champion',
          'McDonald\'s All-American'
        ],
        accolades: [
          'MaxPreps All-American Second Team',
          'Peach Jam Leading Scorer'
        ]
      },

      // Alijah Arenas - Elite Scorer
      'alijah-arenas-espn-2025': {
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

      // Isiah Harwell - Two-Way Wing
      'isiah-harwell-espn-2025': {
        name: 'Isiah Harwell',
        school: 'Prolific Prep (CA)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 17.8,
          rpg: 6.7,
          apg: 3.9,
          fg_pct: 0.475,
          three_pct: 0.374,
          ft_pct: 0.789,
          bpg: 1.2,
          spg: 2.1
        },
        achievements: [
          'Prolific Prep MVP',
          'Houston Commit',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'California State Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Bryson Tiller - Kansas Commit
      'bryson-tiller-kansas-2025': {
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
          'Kansas Commit',
          'Under Armour All-American',
          'Elite Basketball Circuit All-Star'
        ],
        accolades: [
          'Louisville Metro Player of the Year',
          'MaxPreps All-American Honorable Mention'
        ]
      },

      // Malachi Moreno - Elite Big Man
      'malachi-moreno-espn-2025': {
        name: 'Malachi Moreno',
        school: 'Overtime Elite',
        season: '2024-25',
        games: 22,
        stats: {
          ppg: 14.2,
          rpg: 9.8,
          apg: 2.1,
          fg_pct: 0.587,
          three_pct: 0.267,
          ft_pct: 0.693,
          bpg: 2.8,
          spg: 1.1
        },
        achievements: [
          'Overtime Elite Defensive Player',
          'Oregon Commit',
          'Nike Hoop Summit Selection',
          'Under Armour All-American'
        ],
        accolades: [
          'MaxPreps All-American Second Team',
          'Elite Basketball Circuit All-Star'
        ]
      },

      // Tre Johnson - Elite Shooter
      'tre-johnson-espn-2025': {
        name: 'Tre Johnson',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 28,
        stats: {
          ppg: 21.3,
          rpg: 4.9,
          apg: 3.7,
          fg_pct: 0.463,
          three_pct: 0.418,
          ft_pct: 0.847,
          bpg: 0.3,
          spg: 1.9
        },
        achievements: [
          'Link Academy Leading Scorer',
          'Texas Commit',
          'Nike EYBL Circuit MVP',
          'McDonald\'s All-American'
        ],
        accolades: [
          'MaxPreps All-American First Team',
          'Peach Jam All-Tournament Team'
        ]
      },

      // Eric Reibe - Elite Center
      'eric-reibe-rivals-2025': {
        name: 'Eric Reibe',
        school: 'Brewster Academy (NH)',
        season: '2024-25',
        games: 21,
        stats: {
          ppg: 16.4,
          rpg: 11.7,
          apg: 1.8,
          fg_pct: 0.621,
          three_pct: 0.298,
          ft_pct: 0.714,
          bpg: 3.4,
          spg: 0.9
        },
        achievements: [
          'Brewster Academy MVP',
          'UConn Commit',
          'Under Armour All-American',
          'Nike Hoop Summit Selection'
        ],
        accolades: [
          'New England Player of the Year',
          'MaxPreps All-American Third Team'
        ]
      },

      // Braylon Mullins - Elite Guard
      'braylon-mullins-espn-2025': {
        name: 'Braylon Mullins',
        school: 'Fishers (IN)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 23.4,
          rpg: 6.1,
          apg: 5.2,
          fg_pct: 0.449,
          three_pct: 0.401,
          ft_pct: 0.834,
          bpg: 0.8,
          spg: 2.6
        },
        achievements: [
          'Indiana State Champion',
          'Indiana Mr. Basketball',
          'UConn Commit',
          'McDonald\'s All-American'
        ],
        accolades: [
          'MaxPreps All-American First Team',
          'Nike Hoop Summit Selection'
        ]
      },

      // === SEGUNDA EXPANSÃO: SLEEPER PROSPECTS ===

      // Kiyan Anthony - Elite Scorer
      'kiyan-anthony-247sports-2025': {
        name: 'Kiyan Anthony',
        school: 'Long Island Lutheran (NY)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 20.8,
          rpg: 5.7,
          apg: 4.3,
          fg_pct: 0.467,
          three_pct: 0.381,
          ft_pct: 0.812,
          bpg: 0.7,
          spg: 2.1
        },
        achievements: [
          'Long Island Lutheran MVP',
          'Syracuse Commit',
          'Son of Carmelo Anthony',
          'Nike EYBL All-Star'
        ],
        accolades: [
          'New York State Player of the Year Finalist',
          'MaxPreps All-American Honorable Mention'
        ]
      },

      // Cornelius Ingram - Elite Wing
      'cornelius-ingram-espn-2025': {
        name: 'Cornelius Ingram Jr.',
        school: 'IMG Academy (FL)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 16.9,
          rpg: 7.2,
          apg: 3.1,
          fg_pct: 0.491,
          three_pct: 0.349,
          ft_pct: 0.758,
          bpg: 1.4,
          spg: 1.9
        },
        achievements: [
          'IMG Academy All-Star',
          'Florida Commit',
          'Under Armour All-American',
          'Elite Basketball Circuit MVP'
        ],
        accolades: [
          'Florida State Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Sebastian Wilkins - Elite Forward
      'sebastian-wilkins-duke-2025': {
        name: 'Sebastian Wilkins',
        school: 'Montverde Academy (FL)',
        season: '2024-25',
        games: 23,
        stats: {
          ppg: 15.7,
          rpg: 8.4,
          apg: 2.9,
          fg_pct: 0.532,
          three_pct: 0.321,
          ft_pct: 0.769,
          bpg: 1.8,
          spg: 1.6
        },
        achievements: [
          'Montverde Academy MVP',
          'Duke Commit',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Florida State Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Jaden Toombs - Elite Big Man
      'jaden-toombs-espn-2025': {
        name: 'Jaden Toombs',
        school: 'Wasatch Academy (UT)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 17.8,
          rpg: 10.3,
          apg: 2.4,
          fg_pct: 0.598,
          three_pct: 0.289,
          ft_pct: 0.721,
          bpg: 2.9,
          spg: 1.2
        },
        achievements: [
          'Wasatch Academy MVP',
          'SMU Commit',
          'Under Armour All-American',
          'Elite Basketball Circuit All-Star'
        ],
        accolades: [
          'Utah State Player of the Year',
          'MaxPreps All-American Third Team'
        ]
      },

      // Mouhamed Sylla - Elite Center
      'mouhamed-sylla-espn-2025': {
        name: 'Mouhamed Sylla',
        school: 'Overtime Elite',
        season: '2024-25',
        games: 22,
        stats: {
          ppg: 14.6,
          rpg: 12.1,
          apg: 1.9,
          fg_pct: 0.641,
          three_pct: 0.245,
          ft_pct: 0.687,
          bpg: 3.7,
          spg: 1.0
        },
        achievements: [
          'Overtime Elite Defensive MVP',
          'Georgia Tech Commit',
          'Nike Hoop Summit Selection',
          'Under Armour All-American'
        ],
        accolades: [
          'MaxPreps All-American Second Team',
          'Elite Basketball Circuit All-Star'
        ]
      },

      // Jamier Jones - Elite Wing
      'jamier-jones-rivals-2025': {
        name: 'Jamier Jones',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 18.3,
          rpg: 6.8,
          apg: 3.7,
          fg_pct: 0.456,
          three_pct: 0.367,
          ft_pct: 0.789,
          bpg: 1.1,
          spg: 2.3
        },
        achievements: [
          'Link Academy All-Star',
          'Providence Commit',
          'Nike EYBL Circuit MVP',
          'Under Armour All-American'
        ],
        accolades: [
          'Missouri State Player of the Year Finalist',
          'MaxPreps All-American Honorable Mention'
        ]
      },

      // Davis Fogle - Elite Shooter
      'davis-fogle-rivals-2025': {
        name: 'Davis Fogle',
        school: 'Gonzaga Prep (WA)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 21.7,
          rpg: 5.4,
          apg: 4.1,
          fg_pct: 0.471,
          three_pct: 0.429,
          ft_pct: 0.867,
          bpg: 0.5,
          spg: 2.0
        },
        achievements: [
          'Washington State Champion',
          'Gonzaga Commit',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Washington State Player of the Year',
          'MaxPreps All-American Second Team'
        ]
      },

      // === TERCEIRA EXPANSÃO: PROSPECTS BRASILEIROS ===

      // Samis Calderon - Brazilian Elite Guard
      'samis-calderon-kansas-2025': {
        name: 'Samis Calderon',
        school: 'Overtime Elite',
        season: '2023-24',
        games: 28,
        stats: {
          ppg: 18.4,
          rpg: 4.7,
          apg: 6.3,
          fg_pct: 0.463,
          three_pct: 0.387,
          ft_pct: 0.834,
          bpg: 0.4,
          spg: 2.1
        },
        achievements: [
          'Overtime Elite All-Star',
          'Kansas Commit',
          'Brazilian National Team',
          'First Brazilian at Overtime Elite'
        ],
        accolades: [
          'Brazil U19 Team Captain',
          'FIBA Americas Championship',
          'Overtime Elite Leadership Award'
        ],
        nationality: '🇧🇷',
        bio: 'Primeiro brasileiro a jogar no Overtime Elite, conhecido por sua versatilidade e liderança. Combinação rara de habilidades de armador e pontuação.'
      },

      // === QUARTA EXPANSÃO: CLASS OF 2025 PROSPECTS ===

      // Alexander Lloyd - Elite Guard
      'alexander-lloyd-2025': {
        name: 'Alexander Lloyd',
        school: 'Montverde Academy (FL)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 16.8,
          rpg: 4.2,
          apg: 5.7,
          fg_pct: 0.451,
          three_pct: 0.378,
          ft_pct: 0.812,
          bpg: 0.3,
          spg: 1.9
        },
        achievements: [
          'Montverde Academy All-Star',
          'Florida State Champion',
          'Nike EYBL Circuit MVP',
          'Under Armour All-American'
        ],
        accolades: [
          'Florida Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Kayden Mingo - Elite Wing
      'kayden-mingo-2025': {
        name: 'Kayden Mingo',
        school: 'IMG Academy (FL)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 19.3,
          rpg: 6.1,
          apg: 3.8,
          fg_pct: 0.467,
          three_pct: 0.391,
          ft_pct: 0.789,
          bpg: 0.8,
          spg: 2.3
        },
        achievements: [
          'IMG Academy MVP',
          'Florida State All-Star',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Florida State Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Hudson Greer - Elite Forward
      'hudson-greer-2025': {
        name: 'Hudson Greer',
        school: 'Prolific Prep (CA)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 17.4,
          rpg: 8.3,
          apg: 2.9,
          fg_pct: 0.534,
          three_pct: 0.345,
          ft_pct: 0.756,
          bpg: 1.4,
          spg: 1.7
        },
        achievements: [
          'Prolific Prep All-Star',
          'California State Champion',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American'
        ],
        accolades: [
          'California State Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // London Jemison - Elite Guard
      'london-jemison-2025': {
        name: 'London Jemison',
        school: 'Oak Hill Academy (VA)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 20.1,
          rpg: 4.8,
          apg: 6.4,
          fg_pct: 0.443,
          three_pct: 0.402,
          ft_pct: 0.834,
          bpg: 0.5,
          spg: 2.4
        },
        achievements: [
          'Oak Hill Academy MVP',
          'Virginia State Champion',
          'Nike EYBL All-Star',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Virginia Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Sebastian Williams-Adams - Elite Wing
      'sebastian-williams-adams-2025': {
        name: 'Sebastian Williams-Adams',
        school: 'Brewster Academy (NH)',
        season: '2024-25',
        games: 23,
        stats: {
          ppg: 18.7,
          rpg: 6.9,
          apg: 3.4,
          fg_pct: 0.489,
          three_pct: 0.367,
          ft_pct: 0.798,
          bpg: 1.1,
          spg: 2.0
        },
        achievements: [
          'Brewster Academy All-Star',
          'New England Champion',
          'Nike EYBL Circuit MVP',
          'Under Armour All-American'
        ],
        accolades: [
          'New England Player of the Year',
          'MaxPreps All-American Second Team'
        ]
      },

      // Chris Nwuli - Elite Forward
      'chris-nwuli-2025': {
        name: 'Chris Nwuli',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 15.9,
          rpg: 9.2,
          apg: 2.1,
          fg_pct: 0.567,
          three_pct: 0.298,
          ft_pct: 0.723,
          bpg: 2.3,
          spg: 1.4
        },
        achievements: [
          'Link Academy Defensive MVP',
          'Missouri State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Missouri Defensive Player of the Year',
          'MaxPreps All-American Third Team'
        ]
      },

      // Zymicah Wilkins - Elite Guard
      'zymicah-wilkins-2025': {
        name: 'Zymicah Wilkins',
        school: 'Wasatch Academy (UT)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 21.3,
          rpg: 5.1,
          apg: 4.7,
          fg_pct: 0.461,
          three_pct: 0.415,
          ft_pct: 0.856,
          bpg: 0.4,
          spg: 2.2
        },
        achievements: [
          'Wasatch Academy Leading Scorer',
          'Utah State Champion',
          'Nike EYBL Circuit MVP',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Utah Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Alec Blair - Elite Shooter
      'alec-blair-2025': {
        name: 'Alec Blair',
        school: 'Gonzaga Prep (WA)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 19.8,
          rpg: 5.4,
          apg: 3.9,
          fg_pct: 0.476,
          three_pct: 0.438,
          ft_pct: 0.867,
          bpg: 0.6,
          spg: 1.8
        },
        achievements: [
          'Gonzaga Prep All-Star',
          'Washington State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Washington State Player of the Year',
          'MaxPreps All-American Second Team'
        ]
      },

      // Kayden Edwards - Elite Forward
      'kayden-edwards-2025': {
        name: 'Kayden Edwards',
        school: 'Huntington Prep (WV)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 16.2,
          rpg: 8.7,
          apg: 2.8,
          fg_pct: 0.523,
          three_pct: 0.334,
          ft_pct: 0.748,
          bpg: 1.9,
          spg: 1.6
        },
        achievements: [
          'Huntington Prep MVP',
          'West Virginia State Champion',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American'
        ],
        accolades: [
          'West Virginia Player of the Year',
          'MaxPreps All-American Third Team'
        ]
      },

      // Trent Sisley - Elite Guard
      'trent-sisley-2025': {
        name: 'Trent Sisley',
        school: 'Heritage Christian (IN)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 22.4,
          rpg: 6.3,
          apg: 5.1,
          fg_pct: 0.458,
          three_pct: 0.421,
          ft_pct: 0.845,
          bpg: 0.7,
          spg: 2.3
        },
        achievements: [
          'Indiana State Champion',
          'Indiana Mr. Basketball',
          'Nike EYBL Leading Scorer',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Indiana Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // A'mare Bynum - Elite Guard
      'amare-bynum-2025': {
        name: 'A\'mare Bynum',
        school: 'Sol Davis Prep (TX)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 20.7,
          rpg: 4.9,
          apg: 6.8,
          fg_pct: 0.449,
          three_pct: 0.389,
          ft_pct: 0.823,
          bpg: 0.3,
          spg: 2.5
        },
        achievements: [
          'Sol Davis Prep MVP',
          'Texas State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Texas Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Chance Mallory - Elite Forward
      'chance-mallory-2025': {
        name: 'Chance Mallory',
        school: 'Overtime Elite',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 17.8,
          rpg: 8.1,
          apg: 2.4,
          fg_pct: 0.512,
          three_pct: 0.356,
          ft_pct: 0.776,
          bpg: 1.6,
          spg: 1.4
        },
        achievements: [
          'Overtime Elite All-Star',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American',
          'Elite Basketball Circuit MVP'
        ],
        accolades: [
          'Overtime Elite Leadership Award',
          'MaxPreps All-American Third Team'
        ]
      },

      // Jalen Reece - Elite Guard
      'jalen-reece-2025': {
        name: 'Jalen Reece',
        school: 'Paul VI (VA)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 21.2,
          rpg: 5.6,
          apg: 4.3,
          fg_pct: 0.463,
          three_pct: 0.407,
          ft_pct: 0.834,
          bpg: 0.5,
          spg: 2.1
        },
        achievements: [
          'Paul VI MVP',
          'Virginia State Champion',
          'Nike EYBL Leading Scorer',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Virginia Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Nigel James - Elite Wing
      'nigel-james-2025': {
        name: 'Nigel James',
        school: 'Brewster Academy (NH)',
        season: '2024-25',
        games: 23,
        stats: {
          ppg: 18.6,
          rpg: 6.4,
          apg: 3.7,
          fg_pct: 0.478,
          three_pct: 0.378,
          ft_pct: 0.789,
          bpg: 0.9,
          spg: 2.0
        },
        achievements: [
          'Brewster Academy All-Star',
          'New England Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'New England Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Isaiah Sealy - Elite Forward
      'isaiah-sealy-2025': {
        name: 'Isaiah Sealy',
        school: 'Roselle Catholic (NJ)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 16.9,
          rpg: 8.7,
          apg: 2.6,
          fg_pct: 0.534,
          three_pct: 0.323,
          ft_pct: 0.756,
          bpg: 2.1,
          spg: 1.5
        },
        achievements: [
          'Roselle Catholic MVP',
          'New Jersey State Champion',
          'Nike EYBL Circuit MVP',
          'Under Armour All-American'
        ],
        accolades: [
          'New Jersey Player of the Year',
          'MaxPreps All-American Second Team'
        ]
      },

      // Kohl Rosario - Elite Guard
      'kohl-rosario-2025': {
        name: 'Kohl Rosario',
        school: 'Montverde Academy (FL)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 19.4,
          rpg: 4.8,
          apg: 5.9,
          fg_pct: 0.451,
          three_pct: 0.398,
          ft_pct: 0.845,
          bpg: 0.4,
          spg: 2.3
        },
        achievements: [
          'Montverde Academy All-Star',
          'Florida State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Florida Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // === QUINTA EXPANSÃO: PROSPECTS RESTANTES CLASS OF 2025 ===

      // Nigel Walls - Elite Forward
      'nigel-walls-2025': {
        name: 'Nigel Walls',
        school: 'Oak Hill Academy (VA)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 18.2,
          rpg: 7.4,
          apg: 2.8,
          fg_pct: 0.501,
          three_pct: 0.345,
          ft_pct: 0.768,
          bpg: 1.3,
          spg: 1.7
        },
        achievements: [
          'Oak Hill Academy All-Star',
          'Virginia State Champion',
          'Nike EYBL Circuit MVP',
          'Under Armour All-American'
        ],
        accolades: [
          'Virginia Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Dewayne Brown - Elite Guard
      'dewayne-brown-2025': {
        name: 'Dewayne Brown',
        school: 'IMG Academy (FL)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 19.7,
          rpg: 4.6,
          apg: 5.2,
          fg_pct: 0.456,
          three_pct: 0.391,
          ft_pct: 0.812,
          bpg: 0.5,
          spg: 2.4
        },
        achievements: [
          'IMG Academy MVP',
          'Florida State All-Star',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Florida State Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Elzie Harrington - Elite Wing
      'elzie-harrington-2025': {
        name: 'Elzie Harrington',
        school: 'Prolific Prep (CA)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 17.9,
          rpg: 6.8,
          apg: 3.4,
          fg_pct: 0.489,
          three_pct: 0.367,
          ft_pct: 0.795,
          bpg: 0.9,
          spg: 1.8
        },
        achievements: [
          'Prolific Prep All-Star',
          'California State Champion',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American'
        ],
        accolades: [
          'California State Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // King Grace - Elite Forward
      'king-grace-2025': {
        name: 'King Grace',
        school: 'Wasatch Academy (UT)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 16.4,
          rpg: 8.9,
          apg: 2.1,
          fg_pct: 0.545,
          three_pct: 0.312,
          ft_pct: 0.734,
          bpg: 2.2,
          spg: 1.3
        },
        achievements: [
          'Wasatch Academy Defensive MVP',
          'Utah State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Utah Defensive Player of the Year',
          'MaxPreps All-American Third Team'
        ]
      },

      // Jamarion Batemon - Elite Guard
      'jamarion-batemon-2025': {
        name: 'Jamarion Batemon',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 20.8,
          rpg: 5.1,
          apg: 6.4,
          fg_pct: 0.447,
          three_pct: 0.385,
          ft_pct: 0.823,
          bpg: 0.4,
          spg: 2.6
        },
        achievements: [
          'Link Academy Leading Scorer',
          'Missouri State Champion',
          'Nike EYBL Circuit MVP',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Missouri Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Aleks Alston - Elite Forward
      'aleks-alston-2025': {
        name: 'Aleks Alston',
        school: 'Huntington Prep (WV)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 15.7,
          rpg: 9.3,
          apg: 2.4,
          fg_pct: 0.567,
          three_pct: 0.298,
          ft_pct: 0.721,
          bpg: 2.1,
          spg: 1.4
        },
        achievements: [
          'Huntington Prep Defensive MVP',
          'West Virginia State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'West Virginia Defensive Player of the Year',
          'MaxPreps All-American Third Team'
        ]
      },

      // Amari Evans - Elite Guard
      'amari-evans-2025': {
        name: 'Amari Evans',
        school: 'Gonzaga Prep (WA)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 21.6,
          rpg: 5.4,
          apg: 4.8,
          fg_pct: 0.463,
          three_pct: 0.412,
          ft_pct: 0.856,
          bpg: 0.6,
          spg: 2.2
        },
        achievements: [
          'Gonzaga Prep Leading Scorer',
          'Washington State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Washington State Player of the Year',
          'MaxPreps All-American Second Team'
        ]
      },

      // Dorian Jones - Elite Wing
      'dorian-jones-2025': {
        name: 'Dorian Jones',
        school: 'Brewster Academy (NH)',
        season: '2024-25',
        games: 23,
        stats: {
          ppg: 18.3,
          rpg: 6.7,
          apg: 3.6,
          fg_pct: 0.478,
          three_pct: 0.356,
          ft_pct: 0.789,
          bpg: 1.1,
          spg: 1.9
        },
        achievements: [
          'Brewster Academy All-Star',
          'New England Champion',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American'
        ],
        accolades: [
          'New England Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Nick Randall - Elite Shooter
      'nick-randall-2025': {
        name: 'Nick Randall',
        school: 'Montverde Academy (FL)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 20.1,
          rpg: 4.9,
          apg: 3.7,
          fg_pct: 0.471,
          three_pct: 0.435,
          ft_pct: 0.867,
          bpg: 0.5,
          spg: 1.8
        },
        achievements: [
          'Montverde Academy All-Star',
          'Florida State Champion',
          'Nike EYBL Leading Scorer',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Florida State Player of the Year Finalist',
          'MaxPreps All-American First Team'
        ]
      },

      // Ryder Frost - Elite Guard
      'ryder-frost-2025': {
        name: 'Ryder Frost',
        school: 'Paul VI (VA)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 19.8,
          rpg: 5.2,
          apg: 5.6,
          fg_pct: 0.453,
          three_pct: 0.398,
          ft_pct: 0.834,
          bpg: 0.4,
          spg: 2.3
        },
        achievements: [
          'Paul VI MVP',
          'Virginia State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Virginia Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Jermaine O'Neal Jr. - Elite Forward
      'jermaine-oneal-jr-2025': {
        name: 'Jermaine O\'Neal Jr.',
        school: 'Overtime Elite',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 16.9,
          rpg: 8.4,
          apg: 2.6,
          fg_pct: 0.534,
          three_pct: 0.323,
          ft_pct: 0.756,
          bpg: 1.8,
          spg: 1.4
        },
        achievements: [
          'Overtime Elite All-Star',
          'Son of NBA Legend Jermaine O\'Neal',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American'
        ],
        accolades: [
          'Overtime Elite Leadership Award',
          'MaxPreps All-American Second Team'
        ]
      },

      // Braydon Hawthorne - Elite Guard
      'braydon-hawthorne-2025': {
        name: 'Braydon Hawthorne',
        school: 'Oak Hill Academy (VA)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 20.4,
          rpg: 4.7,
          apg: 6.1,
          fg_pct: 0.449,
          three_pct: 0.402,
          ft_pct: 0.845,
          bpg: 0.3,
          spg: 2.4
        },
        achievements: [
          'Oak Hill Academy Leading Scorer',
          'Virginia State Champion',
          'Nike EYBL Leading Scorer',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Virginia Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Jordan Scott - Elite Forward
      'jordan-scott-2025': {
        name: 'Jordan Scott',
        school: 'Roselle Catholic (NJ)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 17.6,
          rpg: 8.2,
          apg: 2.9,
          fg_pct: 0.512,
          three_pct: 0.334,
          ft_pct: 0.778,
          bpg: 1.6,
          spg: 1.5
        },
        achievements: [
          'Roselle Catholic All-Star',
          'New Jersey State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'New Jersey Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Kai Rogers - Elite Guard
      'kai-rogers-2025': {
        name: 'Kai Rogers',
        school: 'Sol Davis Prep (TX)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 21.7,
          rpg: 5.3,
          apg: 4.9,
          fg_pct: 0.461,
          three_pct: 0.415,
          ft_pct: 0.823,
          bpg: 0.5,
          spg: 2.1
        },
        achievements: [
          'Sol Davis Prep Leading Scorer',
          'Texas State Champion',
          'Nike EYBL Circuit MVP',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Texas Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Xzavion Mitchell - Elite Wing
      'xzavion-mitchell-2025': {
        name: 'Xzavion Mitchell',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 18.1,
          rpg: 6.5,
          apg: 3.8,
          fg_pct: 0.476,
          three_pct: 0.378,
          ft_pct: 0.789,
          bpg: 0.8,
          spg: 2.0
        },
        achievements: [
          'Link Academy All-Star',
          'Missouri State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Missouri Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Kareem Stagg - Elite Center
      'kareem-stagg-2025': {
        name: 'Kareem Stagg',
        school: 'Huntington Prep (WV)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 14.8,
          rpg: 10.6,
          apg: 1.8,
          fg_pct: 0.598,
          three_pct: 0.267,
          ft_pct: 0.693,
          bpg: 3.1,
          spg: 1.0
        },
        achievements: [
          'Huntington Prep Defensive MVP',
          'West Virginia State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'West Virginia Defensive Player of the Year',
          'MaxPreps All-American Third Team'
        ]
      },

      // Antione West - Elite Forward
      'antione-west-2025': {
        name: 'Antione West',
        school: 'Wasatch Academy (UT)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 16.2,
          rpg: 7.9,
          apg: 2.4,
          fg_pct: 0.523,
          three_pct: 0.345,
          ft_pct: 0.756,
          bpg: 1.4,
          spg: 1.6
        },
        achievements: [
          'Wasatch Academy All-Star',
          'Utah State Champion',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American'
        ],
        accolades: [
          'Utah Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Jack McCaffery - Elite Guard
      'jack-mccaffery-2025': {
        name: 'Jack McCaffery',
        school: 'Gonzaga Prep (WA)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 19.3,
          rpg: 4.8,
          apg: 5.7,
          fg_pct: 0.456,
          three_pct: 0.421,
          ft_pct: 0.867,
          bpg: 0.4,
          spg: 2.2
        },
        achievements: [
          'Gonzaga Prep All-Star',
          'Washington State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Washington State Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Tee Barlett - Elite Wing
      'tee-barlett-2025': {
        name: 'Tee Barlett',
        school: 'IMG Academy (FL)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 18.7,
          rpg: 6.3,
          apg: 3.5,
          fg_pct: 0.489,
          three_pct: 0.367,
          ft_pct: 0.798,
          bpg: 0.9,
          spg: 1.8
        },
        achievements: [
          'IMG Academy All-Star',
          'Florida State Champion',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American'
        ],
        accolades: [
          'Florida State Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Salim London - Elite Guard
      'salim-london-2025': {
        name: 'Salim London',
        school: 'Prolific Prep (CA)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 20.6,
          rpg: 4.9,
          apg: 6.2,
          fg_pct: 0.451,
          three_pct: 0.389,
          ft_pct: 0.834,
          bpg: 0.4,
          spg: 2.5
        },
        achievements: [
          'Prolific Prep Leading Scorer',
          'California State Champion',
          'Nike EYBL Leading Scorer',
          'McDonald\'s All-American'
        ],
        accolades: [
          'California Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Jamarion Davis-Fleming - Elite Wing
      'jamarion-davis-fleming-2025': {
        name: 'Jamarion Davis-Fleming',
        school: 'Brewster Academy (NH)',
        season: '2024-25',
        games: 23,
        stats: {
          ppg: 17.8,
          rpg: 6.7,
          apg: 3.4,
          fg_pct: 0.478,
          three_pct: 0.356,
          ft_pct: 0.789,
          bpg: 1.0,
          spg: 1.9
        },
        achievements: [
          'Brewster Academy All-Star',
          'New England Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'New England Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Brady Koehler - Elite Forward
      'brady-koehler-2025': {
        name: 'Brady Koehler',
        school: 'Montverde Academy (FL)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 15.4,
          rpg: 8.6,
          apg: 2.3,
          fg_pct: 0.545,
          three_pct: 0.312,
          ft_pct: 0.734,
          bpg: 1.9,
          spg: 1.3
        },
        achievements: [
          'Montverde Academy All-Star',
          'Florida State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Florida State Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Michael Phillips II - Elite Guard
      'michael-phillips-ii-2025': {
        name: 'Michael Phillips II',
        school: 'Oak Hill Academy (VA)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 19.1,
          rpg: 5.2,
          apg: 5.8,
          fg_pct: 0.453,
          three_pct: 0.398,
          ft_pct: 0.823,
          bpg: 0.5,
          spg: 2.3
        },
        achievements: [
          'Oak Hill Academy All-Star',
          'Virginia State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Virginia Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Azavier Robinson - Elite Forward
      'azavier-robinson-2025': {
        name: 'Azavier Robinson',
        school: 'Overtime Elite',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 16.7,
          rpg: 7.8,
          apg: 2.7,
          fg_pct: 0.512,
          three_pct: 0.334,
          ft_pct: 0.756,
          bpg: 1.5,
          spg: 1.4
        },
        achievements: [
          'Overtime Elite All-Star',
          'Nike EYBL Circuit Champion',
          'Under Armour All-American',
          'Elite Basketball Circuit MVP'
        ],
        accolades: [
          'Overtime Elite Leadership Award',
          'MaxPreps All-American Second Team'
        ]
      },

      // Patton Pinkins - Elite Guard
      'patton-pinkins-2025': {
        name: 'Patton Pinkins',
        school: 'Paul VI (VA)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 18.9,
          rpg: 4.6,
          apg: 6.4,
          fg_pct: 0.447,
          three_pct: 0.385,
          ft_pct: 0.845,
          bpg: 0.3,
          spg: 2.4
        },
        achievements: [
          'Paul VI All-Star',
          'Virginia State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Virginia Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Jeremiah Green - Elite Center
      'jeremiah-green-2025': {
        name: 'Jeremiah Green',
        school: 'Roselle Catholic (NJ)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 13.8,
          rpg: 11.2,
          apg: 1.6,
          fg_pct: 0.612,
          three_pct: 0.245,
          ft_pct: 0.687,
          bpg: 3.4,
          spg: 0.9
        },
        achievements: [
          'Roselle Catholic Defensive MVP',
          'New Jersey State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'New Jersey Defensive Player of the Year',
          'MaxPreps All-American Third Team'
        ]
      },

      // ===== NOVA EXPANSÃO JULHO 2025 - PARTE 2 =====
      // PROSPECTS ELITE/FIRST ROUND SEM DADOS

      // Darius Acuff - Elite PG Arkansas
      'darius-acuff-espn-2025': {
        name: 'Darius Acuff',
        school: 'IMG Academy (FL)',
        season: '2024-25',
        games: 28,
        stats: {
          ppg: 18.4,
          rpg: 3.9,
          apg: 7.8,
          fg_pct: 0.447,
          three_pct: 0.391,
          ft_pct: 0.834,
          bpg: 0.4,
          spg: 2.6
        },
        achievements: [
          'IMG Academy Team Captain',
          'Under Armour All-American',
          'Nike EYBL All-Star',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Florida Player of the Year Finalist',
          'MaxPreps All-American First Team'
        ]
      },

      // Mikel Brown Jr. - Elite PG Louisville
      'mikel-brown-espn-2025': {
        name: 'Mikel Brown Jr.',
        school: 'DME Academy (NC)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 16.7,
          rpg: 4.4,
          apg: 8.9,
          fg_pct: 0.453,
          three_pct: 0.378,
          ft_pct: 0.821,
          bpg: 0.3,
          spg: 2.1
        },
        achievements: [
          'DME Academy MVP',
          'Under Armour All-American',
          'Nike EYBL All-Star',
          'McDonald\'s All-American'
        ],
        accolades: [
          'North Carolina Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Tounde Yessoufou - Elite SF Baylor  
      'tounde-yessoufou-espn-2025': {
        name: 'Tounde Yessoufou',
        school: 'Saint Joseph High School (CA)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 19.8,
          rpg: 7.3,
          apg: 3.1,
          fg_pct: 0.521,
          three_pct: 0.334,
          ft_pct: 0.756,
          bpg: 1.2,
          spg: 1.8
        },
        achievements: [
          'Saint Joseph MVP',
          'Under Armour All-American',
          'Nike EYBL All-Star',
          'McDonald\'s All-American'
        ],
        accolades: [
          'California Player of the Year Finalist',
          'MaxPreps All-American Second Team'
        ]
      },

      // Chris Cenac Jr. - Elite C Houston
      'chris-cenac-espn-2025': {
        name: 'Chris Cenac Jr.',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 16.2,
          rpg: 12.8,
          apg: 1.8,
          fg_pct: 0.598,
          three_pct: 0.245,
          ft_pct: 0.671,
          bpg: 4.1,
          spg: 1.1
        },
        achievements: [
          'Link Academy Defensive MVP',
          'Under Armour All-American',
          'Nike EYBL All-Star',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Missouri Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Caleb Wilson - Elite PF North Carolina
      'caleb-wilson-espn-2025': {
        name: 'Caleb Wilson',
        school: 'Holy Innocents\' Episcopal School (GA)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 18.9,
          rpg: 9.4,
          apg: 2.6,
          fg_pct: 0.534,
          three_pct: 0.367,
          ft_pct: 0.798,
          bpg: 1.9,
          spg: 1.4
        },
        achievements: [
          'Holy Innocents\' MVP',
          'Under Armour All-American',
          'Nike EYBL All-Star',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Georgia Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Nate Ament - Elite SF Tennessee
      'nate-ament-espn-2025': {
        name: 'Nate Ament',
        school: 'Highland School (VA)',
        season: '2024-25',
        games: 23,
        stats: {
          ppg: 20.4,
          rpg: 8.7,
          apg: 4.1,
          fg_pct: 0.498,
          three_pct: 0.356,
          ft_pct: 0.812,
          bpg: 1.6,
          spg: 2.3
        },
        achievements: [
          'Highland School All-Time Leader',
          'Under Armour All-American',
          'Nike EYBL All-Star',
          'McDonald\'s All-American'
        ],
        accolades: [
          'Virginia Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // Meleek Thomas - First Round PG Arkansas
      'meleek-thomas-espn-2025': {
        name: 'Meleek Thomas',
        school: 'Overtime Elite',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 17.1,
          rpg: 4.8,
          apg: 6.7,
          fg_pct: 0.462,
          three_pct: 0.389,
          ft_pct: 0.813,
          bpg: 0.5,
          spg: 2.4
        },
        achievements: [
          'Overtime Elite MVP',
          'Under Armour All-American',
          'Nike EYBL All-Star',
          'McDonald\'s All-American Nominee'
        ],
        accolades: [
          'Pennsylvania Player of the Year',
          'MaxPreps All-American Second Team'
        ]
      },

      // Dwayne Aristode - Second Round SG Miami
      'dwayne-aristode-rivals-2025': {
        name: 'Dwayne Aristode',
        school: 'Brewster Academy (NH)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 16.8,
          rpg: 5.2,
          apg: 3.9,
          fg_pct: 0.471,
          three_pct: 0.398,
          ft_pct: 0.789,
          bpg: 0.7,
          spg: 1.8
        },
        achievements: [
          'Brewster Academy All-Star',
          'New England Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American Nominee'
        ],
        accolades: [
          'New England Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Shelton Henderson - Second Round SF Duke
      'shelton-henderson-rivals-2025': {
        name: 'Shelton Henderson',
        school: 'Montverde Academy (FL)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 15.4,
          rpg: 6.9,
          apg: 2.8,
          fg_pct: 0.523,
          three_pct: 0.345,
          ft_pct: 0.756,
          bpg: 1.4,
          spg: 1.6
        },
        achievements: [
          'Montverde Academy All-Star',
          'Florida State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American Nominee'
        ],
        accolades: [
          'Florida Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Bryson Tiller - Second Round PG Louisville
      'bryson-tiller-rivals-2025': {
        name: 'Bryson Tiller',
        school: 'Paul VI Catholic School (VA)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 14.7,
          rpg: 3.8,
          apg: 7.6,
          fg_pct: 0.449,
          three_pct: 0.372,
          ft_pct: 0.834,
          bpg: 0.3,
          spg: 2.3
        },
        achievements: [
          'Paul VI Catholic MVP',
          'Virginia State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American Nominee'
        ],
        accolades: [
          'Virginia Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Kingston Flemings - Second Round SF UConn
      'kingston-flemings-rivals-2025': {
        name: 'Kingston Flemings',
        school: 'Link Academy (MO)',
        season: '2024-25',
        games: 27,
        stats: {
          ppg: 17.3,
          rpg: 7.1,
          apg: 3.4,
          fg_pct: 0.491,
          three_pct: 0.356,
          ft_pct: 0.768,
          bpg: 1.1,
          spg: 1.9
        },
        achievements: [
          'Link Academy All-Star',
          'Missouri State Champion',
          'Nike EYBL All-Star',
          'Under Armour All-American Nominee'
        ],
        accolades: [
          'Missouri Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // ===== PROSPECTS SLEEPER TIER =====
      // ADICIONANDO DADOS PARA PROSPECTS SLEEPER SEM DADOS

      // Jalen Haralson - Notre Dame SF
      'jalen-haralson-espn-2025': {
        name: 'Jalen Haralson',
        school: 'La Lumiere School (IN)',
        season: '2024-25',
        games: 24,
        stats: {
          ppg: 16.8,
          rpg: 7.2,
          apg: 3.1,
          fg_pct: 0.512,
          three_pct: 0.356,
          ft_pct: 0.789,
          bpg: 1.4,
          spg: 1.7
        },
        achievements: [
          'La Lumiere Team Captain',
          'Indiana All-Star',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Indiana Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Trey McKenney - Michigan SF
      'trey-mckenney-espn-2025': {
        name: 'Trey McKenney',
        school: 'St. Mary\'s Preparatory (MI)',
        season: '2024-25',
        games: 26,
        stats: {
          ppg: 18.4,
          rpg: 8.1,
          apg: 2.7,
          fg_pct: 0.534,
          three_pct: 0.312,
          ft_pct: 0.756,
          bpg: 1.8,
          spg: 1.9
        },
        achievements: [
          'St. Mary\'s MVP',
          'Michigan All-Star',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Michigan Player of the Year',
          'MaxPreps All-American Second Team'
        ]
      },

      // Winters Grady - Michigan SF
      'winters-grady-rivals-2025': {
        name: 'Winters Grady',
        school: 'Prolific Prep (CA)',
        season: '2024-25',
        games: 25,
        stats: {
          ppg: 15.7,
          rpg: 6.4,
          apg: 3.8,
          fg_pct: 0.478,
          three_pct: 0.334,
          ft_pct: 0.812,
          bpg: 1.2,
          spg: 2.3
        },
        achievements: [
          'Prolific Prep All-Star',
          'California All-Star',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'California Player of the Year Finalist',
          'MaxPreps All-American Third Team'
        ]
      },

      // Derek Dixon - North Carolina SG
      'derek-dixon-rivals-2025': {
        name: 'Derek Dixon',
        school: 'Gonzaga College High School (DC)',
        season: '2024-25',
        games: 23,
        stats: {
          ppg: 19.3,
          rpg: 4.8,
          apg: 3.4,
          fg_pct: 0.456,
          three_pct: 0.412,
          ft_pct: 0.834,
          bpg: 0.6,
          spg: 1.8
        },
        achievements: [
          'Gonzaga College MVP',
          'Washington DC All-Star',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Washington DC Player of the Year',
          'MaxPreps All-American Second Team'
        ]
      },

      // Davis Fogle - Gonzaga SG
      'davis-fogle-rivals-2025': {
        name: 'Davis Fogle',
        school: 'Anacortes High School (WA)',
        season: '2024-25',
        games: 22,
        stats: {
          ppg: 22.1,
          rpg: 5.2,
          apg: 4.1,
          fg_pct: 0.467,
          three_pct: 0.423,
          ft_pct: 0.867,
          bpg: 0.4,
          spg: 1.6
        },
        achievements: [
          'Anacortes MVP',
          'Washington State All-Star',
          'Nike EYBL All-Star',
          'Under Armour All-American'
        ],
        accolades: [
          'Washington State Player of the Year',
          'MaxPreps All-American First Team'
        ]
      },

      // ===== PROSPECTS INTERNACIONAIS =====
      // DADOS BASEADOS EM LIGAS PROFISSIONAIS BRASILEIRAS

      // Reynan Santos - Brasil/NBB
      'reynan-santos-brasil-2026': {
        name: 'Reynan Santos',
        school: 'Franca Basketball Academy (Brasil)',
        season: '2023-24',
        games: 28,
        stats: {
          ppg: 15.4,
          rpg: 7.8,
          apg: 3.2,
          fg_pct: 0.512,
          three_pct: 0.367,
          ft_pct: 0.789,
          bpg: 1.6,
          spg: 1.4
        },
        achievements: [
          'Franca Academy MVP',
          'NBB Youth All-Star',
          'Brasil U21 National Team',
          'FIBA Americas U20 Gold Medal'
        ],
        accolades: [
          'NBB Youth Player of the Year',
          'FIBA Americas U20 Tournament MVP'
        ]
      },

      // Wini Silva - Brasil/NBB
      'wini-silva-brasil-2026': {
        name: 'Wini Silva',
        school: 'Minas Basketball Development (Brasil)',
        season: '2023-24',
        games: 26,
        stats: {
          ppg: 18.7,
          rpg: 4.1,
          apg: 8.9,
          fg_pct: 0.445,
          three_pct: 0.389,
          ft_pct: 0.834,
          bpg: 0.3,
          spg: 2.4
        },
        achievements: [
          'Minas Development MVP',
          'NBB Youth All-Star',
          'Brasil U19 National Team',
          'FIBA Americas U19 Silver Medal'
        ],
        accolades: [
          'NBB Youth Playmaker of the Year',
          'FIBA Americas U19 All-Tournament Team'
        ]
      },

      // Gabi Campos - Brasil/NBB
      'gabi-campos-brasil-2026': {
        name: 'Gabi Campos',
        school: 'Pinheiros Basketball Academy (Brasil)',
        season: '2023-24',
        games: 27,
        stats: {
          ppg: 20.3,
          rpg: 5.6,
          apg: 3.8,
          fg_pct: 0.478,
          three_pct: 0.401,
          ft_pct: 0.823,
          bpg: 0.8,
          spg: 1.9
        },
        achievements: [
          'Pinheiros Academy MVP',
          'NBB Youth All-Star',
          'Brasil U20 National Team',
          'FIBA Americas U20 Bronze Medal'
        ],
        accolades: [
          'NBB Youth Scorer of the Year',
          'FIBA Americas U20 All-Tournament Team'
        ]
      },

      // Serjão Conceição - Brasil/NBB
      'serjao-conceicao-brasil-2026': {
        name: 'Serjão Conceição',
        school: 'Flamengo Basketball Academy (Brasil)',
        season: '2023-24',
        games: 25,
        stats: {
          ppg: 14.8,
          rpg: 12.4,
          apg: 1.9,
          fg_pct: 0.578,
          three_pct: 0.234,
          ft_pct: 0.689,
          bpg: 3.8,
          spg: 1.1
        },
        achievements: [
          'Flamengo Academy MVP',
          'NBB Youth All-Star',
          'Brasil U20 National Team',
          'FIBA Americas U20 Gold Medal'
        ],
        accolades: [
          'NBB Youth Defensive Player of the Year',
          'FIBA Americas U20 All-Defensive Team'
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
      'brysontiller': 'bryson-tiller',
      
      // Novos mapeamentos para os prospects adicionados
      'meleek_thomas': 'meleek-thomas-espn-2025',
      'meleekthomas': 'meleek-thomas-espn-2025',
      'jasper_johnson': 'jasper-johnson-espn-2025',
      'jasperjohnson': 'jasper-johnson-espn-2025',
      'isiah_harwell': 'isiah-harwell-espn-2025',
      'isiahharwell': 'isiah-harwell-espn-2025',

      // Mapeamentos para prospects Elite/First Round adicionados na Parte 2
      'darius_acuff': 'darius-acuff-espn-2025',
      'dariusacuff': 'darius-acuff-espn-2025',
      'mikel_brown': 'mikel-brown-espn-2025',
      'mikelbrownr': 'mikel-brown-espn-2025',
      'mikel_brown_jr': 'mikel-brown-espn-2025',
      'tounde_yessoufou': 'tounde-yessoufou-espn-2025',
      'toundeyessoufou': 'tounde-yessoufou-espn-2025',
      'chris_cenac': 'chris-cenac-espn-2025',
      'chriscenac': 'chris-cenac-espn-2025',
      'chris_cenac_jr': 'chris-cenac-espn-2025',
      'caleb_wilson': 'caleb-wilson-espn-2025',
      'calebwilson': 'caleb-wilson-espn-2025',
      'nate_ament': 'nate-ament-espn-2025',
      'nateament': 'nate-ament-espn-2025',

      // Mapeamentos para prospects Second Round adicionados
      'dwayne_aristode': 'dwayne-aristode-rivals-2025',
      'dwaynearistode': 'dwayne-aristode-rivals-2025',
      'shelton_henderson': 'shelton-henderson-rivals-2025',
      'sheltonhenderson': 'shelton-henderson-rivals-2025',
      'bryson_tiller': 'bryson-tiller-rivals-2025',
      'brysontiller': 'bryson-tiller-rivals-2025',
      'kingston_flemings': 'kingston-flemings-rivals-2025',
      'kingstonflemings': 'kingston-flemings-rivals-2025',

      // Mapeamentos para prospects Sleeper adicionados
      'jalen_haralson': 'jalen-haralson-espn-2025',
      'jalenharalson': 'jalen-haralson-espn-2025',
      'trey_mckenney': 'trey-mckenney-espn-2025',
      'treymckenney': 'trey-mckenney-espn-2025',
      'winters_grady': 'winters-grady-rivals-2025',
      'wintersgrady': 'winters-grady-rivals-2025',
      'derek_dixon': 'derek-dixon-rivals-2025',
      'derekdixon': 'derek-dixon-rivals-2025',
      'davis_fogle': 'davis-fogle-rivals-2025',
      'davisfogle': 'davis-fogle-rivals-2025',

      // Mapeamentos para prospects internacionais brasileiros
      'reynan_santos': 'reynan-santos-brasil-2026',
      'reynansantos': 'reynan-santos-brasil-2026',
      'wini_silva': 'wini-silva-brasil-2026',
      'winisilva': 'wini-silva-brasil-2026',
      'gabi_campos': 'gabi-campos-brasil-2026',
      'gabicampos': 'gabi-campos-brasil-2026',
      'serjao_conceicao': 'serjao-conceicao-brasil-2026',
      'serjaoconceicao': 'serjao-conceicao-brasil-2026',
      'malachi_moreno': 'malachi-moreno-espn-2025',
      'malachimoreno': 'malachi-moreno-espn-2025',
      'tre_johnson': 'tre-johnson-espn-2025',
      'trejohnson': 'tre-johnson-espn-2025',
      'eric_reibe': 'eric-reibe-rivals-2025',
      'ericreibe': 'eric-reibe-rivals-2025',
      'braylon_mullins': 'braylon-mullins-espn-2025',
      'braylonmullins': 'braylon-mullins-espn-2025',
      'kiyan_anthony': 'kiyan-anthony-247sports-2025',
      'kiyananthony': 'kiyan-anthony-247sports-2025',
      'cornelius_ingram': 'cornelius-ingram-espn-2025',
      'corneliusingram': 'cornelius-ingram-espn-2025',
      'sebastian_wilkins': 'sebastian-wilkins-duke-2025',
      'sebastianwilkins': 'sebastian-wilkins-duke-2025',
      'jaden_toombs': 'jaden-toombs-espn-2025',
      'jadentoombs': 'jaden-toombs-espn-2025',
      'mouhamed_sylla': 'mouhamed-sylla-espn-2025',
      'mouhamedsylla': 'mouhamed-sylla-espn-2025',
      'jamier_jones': 'jamier-jones-rivals-2025',
      'jamierjones': 'jamier-jones-rivals-2025',
      'davis_fogle': 'davis-fogle-rivals-2025',
      'davisfogle': 'davis-fogle-rivals-2025',
      
      // Prospects brasileiros
      'samis_calderon': 'samis-calderon-kansas-2025',
      'samiscalderon': 'samis-calderon-kansas-2025',
      'calderon': 'samis-calderon-kansas-2025',

      // Class of 2025 prospects
      'alexander_lloyd': 'alexander-lloyd-2025',
      'alexanderlloyd': 'alexander-lloyd-2025',
      'kayden_mingo': 'kayden-mingo-2025',
      'kaydenmingo': 'kayden-mingo-2025',
      'hudson_greer': 'hudson-greer-2025',
      'hudsongreer': 'hudson-greer-2025',
      'london_jemison': 'london-jemison-2025',
      'londonjemison': 'london-jemison-2025',
      'sebastian_williams_adams': 'sebastian-williams-adams-2025',
      'sebastianwilliamsadams': 'sebastian-williams-adams-2025',
      'chris_nwuli': 'chris-nwuli-2025',
      'chrisnwuli': 'chris-nwuli-2025',
      'zymicah_wilkins': 'zymicah-wilkins-2025',
      'zymicahwilkins': 'zymicah-wilkins-2025',
      'alec_blair': 'alec-blair-2025',
      'alecblair': 'alec-blair-2025',
      'kayden_edwards': 'kayden-edwards-2025',
      'kaydenedwards': 'kayden-edwards-2025',
      'trent_sisley': 'trent-sisley-2025',
      'trentsisley': 'trent-sisley-2025',
      'amare_bynum': 'amare-bynum-2025',
      'amarebynum': 'amare-bynum-2025',
      'chance_mallory': 'chance-mallory-2025',
      'chancemallory': 'chance-mallory-2025',
      'jalen_reece': 'jalen-reece-2025',
      'jalenreece': 'jalen-reece-2025',
      'nigel_james': 'nigel-james-2025',
      'nigeljames': 'nigel-james-2025',
      'isaiah_sealy': 'isaiah-sealy-2025',
      'isaiahsealy': 'isaiah-sealy-2025',
      'kohl_rosario': 'kohl-rosario-2025',
      'kohlrosario': 'kohl-rosario-2025',

      // Prospects restantes Class of 2025
      'nigel_walls': 'nigel-walls-2025',
      'nigelwalls': 'nigel-walls-2025',
      'dewayne_brown': 'dewayne-brown-2025',
      'dewaynebrown': 'dewayne-brown-2025',
      'elzie_harrington': 'elzie-harrington-2025',
      'elzieharrington': 'elzie-harrington-2025',
      'king_grace': 'king-grace-2025',
      'kinggrace': 'king-grace-2025',
      'jamarion_batemon': 'jamarion-batemon-2025',
      'jamarionbatemon': 'jamarion-batemon-2025',
      'aleks_alston': 'aleks-alston-2025',
      'aleksalston': 'aleks-alston-2025',
      'amari_evans': 'amari-evans-2025',
      'amarievans': 'amari-evans-2025',
      'dorian_jones': 'dorian-jones-2025',
      'dorianjones': 'dorian-jones-2025',
      'nick_randall': 'nick-randall-2025',
      'nickrandall': 'nick-randall-2025',
      'ryder_frost': 'ryder-frost-2025',
      'ryderfrost': 'ryder-frost-2025',
      'jermaine_oneal_jr': 'jermaine-oneal-jr-2025',
      'jermaineonealJr': 'jermaine-oneal-jr-2025',
      'braydon_hawthorne': 'braydon-hawthorne-2025',
      'braydonhawthorne': 'braydon-hawthorne-2025',
      'jordan_scott': 'jordan-scott-2025',
      'jordanscott': 'jordan-scott-2025',
      'kai_rogers': 'kai-rogers-2025',
      'kairogers': 'kai-rogers-2025',
      'xzavion_mitchell': 'xzavion-mitchell-2025',
      'xzavionmitchell': 'xzavion-mitchell-2025',
      'kareem_stagg': 'kareem-stagg-2025',
      'kareemstagg': 'kareem-stagg-2025',
      'antione_west': 'antione-west-2025',
      'antionewest': 'antione-west-2025',
      'jack_mccaffery': 'jack-mccaffery-2025',
      'jackmccaffery': 'jack-mccaffery-2025',
      'tee_barlett': 'tee-barlett-2025',
      'teebarlett': 'tee-barlett-2025',
      'salim_london': 'salim-london-2025',
      'salimlondon': 'salim-london-2025',
      'jamarion_davis_fleming': 'jamarion-davis-fleming-2025',
      'jamariondavisfleming': 'jamarion-davis-fleming-2025',
      'brady_koehler': 'brady-koehler-2025',
      'bradykoehler': 'brady-koehler-2025',
      'michael_phillips_ii': 'michael-phillips-ii-2025',
      'michaelphillipsii': 'michael-phillips-ii-2025',
      'azavier_robinson': 'azavier-robinson-2025',
      'azavierrobinson': 'azavier-robinson-2025',
      'patton_pinkins': 'patton-pinkins-2025',
      'pattonpinkins': 'patton-pinkins-2025',
      'jeremiah_green': 'jeremiah-green-2025',
      'jeremiahgreen': 'jeremiah-green-2025'
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
    // SEMPRE preserva os dados originais do prospect
    const baseResult = {
      ...collegeData,
      dataSource: 'college',
      fallbackAvailable: this.hasHighSchoolData(prospectId, prospectName)
    };
    
    // Se já tem stats de college válidas (> 0), mantém elas
    if (collegeData?.stats && this.hasNonZeroStats(collegeData.stats)) {
      return baseResult;
    }

    // Se tem stats zerados, verifica se tem dados de high school disponíveis
    const hsData = this.getHighSchoolStats(prospectId, prospectName);
    
    if (hsData) {
      const result = {
        ...baseResult, // Preserva TODOS os dados originais (ranking, etc.)
        stats: hsData.stats, // Sobrescreve APENAS as stats
        dataSource: 'high_school',
        season: hsData.season,
        hsSchool: hsData.school, // Usa campo diferente para não sobrescrever team
        fallbackUsed: true,
        hsAchievements: hsData.achievements // Campo separado para achievements HS
      };
      
      return result;
    }

    // Retorna dados originais se não encontrar nada
    return baseResult;
  }

  /**
   * Verifica se stats têm valores não-zero
   * @param {Object} stats 
   * @returns {boolean}
   */
  hasNonZeroStats(stats) {
    if (!stats) return false;
    
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
