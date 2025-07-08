// Mock data for prospects - Updated with real image system
import { generateFallbackAvatar } from '../utils/imageUtils.js';
import { getProspectImageUrls, generateProspectFallback } from '../utils/prospectImages.js';

export const mockProspects = [
  {
    id: 1,
    name: "AJ Dybantsa",
    age: 17,
    height: "6'9\"",
    position: "SF/PF",
    school: "BYU (Committed)",
    class: "2026",
    hometown: "Brockton, MA",
    stats: {
      ppg: 24.1,
      rpg: 9.3,
      apg: 4.8,
      fg_pct: 0.532,
      three_pt_pct: 0.387,
      ft_pct: 0.823
    },
    mockDraftPosition: 1,
    previousRanking: 1,
    trending: "stable",
    scoutingNotes: "Generational talent with elite size, skill, and basketball IQ. Consensus #1 prospect for 2026.",
    comparison: "Kevin Durant",
    strengths: ["Elite scoring", "Size", "Skill level", "Basketball IQ"],
    weaknesses: ["Needs to add strength", "Defensive consistency"],
    watchlisted: true,
    // Sistema de imagens reais do AJ Dybantsa
    imageUrl: getProspectImageUrls("AJ Dybantsa")[0],
    alternativeImageUrls: getProspectImageUrls("AJ Dybantsa").slice(1),
    fallbackImageUrl: generateProspectFallback("AJ Dybantsa", "2026")
  },
  {
    id: 2,
    name: "Jasper Johnson",
    age: 17,
    height: "6'4\"",
    position: "SG",
    school: "Kentucky (Committed)",
    class: "2026",
    hometown: "Link Academy, MO",
    stats: {
      ppg: 19.7,
      rpg: 5.1,
      apg: 4.2,
      fg_pct: 0.478,
      three_pt_pct: 0.421,
      ft_pct: 0.867
    },
    mockDraftPosition: 3,
    previousRanking: 4,
    trending: "up",
    scoutingNotes: "Elite shooter with improving playmaking ability. Rising quickly in rankings.",
    comparison: "Jaylen Brown",
    strengths: ["Elite shooting", "Athleticism", "Size for position", "Work ethic"],
    weaknesses: ["Ball handling", "Creating own shot"],
    watchlisted: true,
    // Sistema de imagens reais do Jasper Johnson
    imageUrl: getProspectImageUrls("Jasper Johnson")[0],
    alternativeImageUrls: getProspectImageUrls("Jasper Johnson").slice(1),
    fallbackImageUrl: generateProspectFallback("Jasper Johnson", "2026")
  },
  {
    id: 3,
    name: "Koa Peat",
    age: 17,
    height: "6'9\"",
    position: "PF/C",
    school: "Arizona (Committed)",
    class: "2026",
    hometown: "Perry, AZ",
    stats: {
      ppg: 16.8,
      rpg: 11.2,
      apg: 2.9,
      fg_pct: 0.592,
      three_pt_pct: 0.289,
      ft_pct: 0.743
    },
    mockDraftPosition: 5,
    previousRanking: 6,
    trending: "up",
    scoutingNotes: "Dominant interior presence with improving perimeter skills. Elite rebounder.",
    comparison: "Bam Adebayo",
    strengths: ["Rebounding", "Interior defense", "Athleticism", "Motor"],
    weaknesses: ["Perimeter shooting", "Offensive range"],
    watchlisted: false,
    // Sistema de imagens reais do Koa Peat
    imageUrl: getProspectImageUrls("Koa Peat")[0],
    alternativeImageUrls: getProspectImageUrls("Koa Peat").slice(1),
    fallbackImageUrl: generateProspectFallback("Koa Peat", "2026")
  },
  {
    id: 4,
    name: "Cayden Boozer",
    age: 17,
    height: "6'9\"",
    position: "PF",
    school: "Duke (Committed)",
    class: "2026",
    hometown: "Christopher Columbus, FL",
    stats: {
      ppg: 18.3,
      rpg: 8.7,
      apg: 3.1,
      fg_pct: 0.511,
      three_pt_pct: 0.356,
      ft_pct: 0.789
    },
    mockDraftPosition: 8,
    previousRanking: 7,
    trending: "stable",
    scoutingNotes: "Son of Carlos Boozer. Excellent basketball IQ with versatile skill set.",
    comparison: "Lauri Markkanen",
    strengths: ["Basketball IQ", "Shooting", "Size", "Fundamentals"],
    weaknesses: ["Athleticism", "Lateral quickness"],
    watchlisted: true,
    // Sistema de imagens reais do Cayden Boozer
    imageUrl: getProspectImageUrls("Cayden Boozer")[0],
    alternativeImageUrls: getProspectImageUrls("Cayden Boozer").slice(1),
    fallbackImageUrl: generateProspectFallback("Cayden Boozer", "2026")
  },
  {
    id: 5,
    name: "Cameron Boozer",
    age: 17,
    height: "6'8\"",
    position: "PF",
    school: "Duke (Committed)",
    class: "2026",
    hometown: "Christopher Columbus, FL",
    stats: {
      ppg: 17.9,
      rpg: 9.1,
      apg: 2.8,
      fg_pct: 0.498,
      three_pt_pct: 0.334,
      ft_pct: 0.801
    },
    mockDraftPosition: 9,
    previousRanking: 8,
    trending: "stable",
    scoutingNotes: "Twin brother of Cayden. More athletic than his brother with solid fundamentals.",
    comparison: "Kyle Kuzma",
    strengths: ["Athleticism", "Rebounding", "Versatility", "Team chemistry"],
    weaknesses: ["Perimeter skills", "Individual creation"],
    watchlisted: false,
    // Sistema de imagens reais do Cameron Boozer
    imageUrl: getProspectImageUrls("Cameron Boozer")[0],
    alternativeImageUrls: getProspectImageUrls("Cameron Boozer").slice(1),
    fallbackImageUrl: generateProspectFallback("Cameron Boozer", "2026")
  },
  // Classe 2027 Prospects
  {
    id: 6,
    name: "Darryn Peterson",
    age: 16,
    height: "6'5\"",
    position: "SG/SF",
    school: "Kansas (Committed)",
    class: "2027",
    hometown: "Prolific Prep, CA",
    stats: {
      ppg: 21.4,
      rpg: 6.2,
      apg: 5.1,
      fg_pct: 0.467,
      three_pt_pct: 0.389,
      ft_pct: 0.834
    },
    mockDraftPosition: 2,
    previousRanking: 3,
    trending: "up",
    scoutingNotes: "Elite scorer with NBA-ready size and athleticism. Excellent shot creator.",
    comparison: "Anthony Edwards",
    strengths: ["Scoring ability", "Athleticism", "Size", "Shot creation"],
    weaknesses: ["Decision making", "Defensive consistency"],
    watchlisted: true,
    // Sistema de imagens reais do Darryn Peterson
    imageUrl: getProspectImageUrls("Darryn Peterson")[0],
    alternativeImageUrls: getProspectImageUrls("Darryn Peterson").slice(1),
    fallbackImageUrl: generateProspectFallback("Darryn Peterson", "2027")
  },
  {
    id: 7,
    name: "Kiyan Anthony",
    age: 16,
    height: "6'5\"",
    position: "SG/SF",
    school: "Syracuse (Committed)",
    class: "2027",
    hometown: "Long Island Lutheran, NY",
    stats: {
      ppg: 18.9,
      rpg: 5.8,
      apg: 3.4,
      fg_pct: 0.445,
      three_pt_pct: 0.372,
      ft_pct: 0.798
    },
    mockDraftPosition: 8,
    previousRanking: 10,
    trending: "up",
    scoutingNotes: "Son of Carmelo Anthony with similar scoring instincts. Improving all-around game.",
    comparison: "Carmelo Anthony",
    strengths: ["Scoring instincts", "Size", "Basketball IQ", "Clutch gene"],
    weaknesses: ["Consistency", "Defensive effort"],
    watchlisted: true,
    imageUrl: "https://images.unsplash.com/photo-1577036853819-0238e7ba2d93?w=400&h=500&fit=crop&crop=face",
    alternativeImageUrls: [
      "https://images.unsplash.com/photo-1594736797933-d0c16ff64de2?w=400&h=500&fit=crop&crop=face"
    ],
    fallbackImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=KiyanAnthony&backgroundColor=1d428a,3b82f6&clothesColor=262e33,65c5db&skinColor=d08b5b,ae5d29"
  },
  {
    id: 8,
    name: "Labaron Philon",
    age: 16,
    height: "6'4\"",
    position: "PG/SG",
    school: "Alabama (Committed)",
    class: "2027",
    hometown: "Davidson Day School, NC",
    stats: {
      ppg: 22.1,
      rpg: 4.7,
      apg: 6.8,
      fg_pct: 0.481,
      three_pt_pct: 0.398,
      ft_pct: 0.856
    },
    mockDraftPosition: 4,
    previousRanking: 5,
    trending: "stable",
    scoutingNotes: "Elite point guard with excellent court vision and leadership. High basketball IQ.",
    comparison: "Jalen Brunson",
    strengths: ["Playmaking", "Leadership", "Basketball IQ", "Shooting"],
    weaknesses: ["Size", "Athletic ceiling"],
    watchlisted: false,
    imageUrl: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400&h=500&fit=crop&crop=face",
    alternativeImageUrls: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop&crop=face"
    ],
    fallbackImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=LabaronPhilon&backgroundColor=1d428a,3b82f6&clothesColor=262e33,65c5db&skinColor=ae5d29,f8d25c"
  },
  // Classe 2028 Prospects
  {
    id: 9,
    name: "Cameron Boozer Jr.",
    age: 15,
    height: "6'8\"",
    position: "SF/PF",
    school: "Uncommitted",
    class: "2028",
    hometown: "Christopher Columbus, FL",
    stats: {
      ppg: 16.3,
      rpg: 7.9,
      apg: 4.2,
      fg_pct: 0.478,
      three_pt_pct: 0.356,
      ft_pct: 0.789
    },
    mockDraftPosition: 12,
    previousRanking: 15,
    trending: "up",
    scoutingNotes: "Son of former NBA player Carlos Boozer. Excellent fundamentals and basketball IQ.",
    comparison: "Chris Bosh",
    strengths: ["Basketball IQ", "Fundamentals", "Size", "Versatility"],
    weaknesses: ["Athleticism", "Strength"],
    watchlisted: true,
    imageUrl: "https://images.unsplash.com/photo-1558618491-fcd25c85cd64?w=400&h=500&fit=crop&crop=face",
    fallbackImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=CameronBoozerJr&backgroundColor=1d428a,3b82f6&clothesColor=262e33,65c5db&skinColor=d08b5b,ae5d29"
  },
  {
    id: 10,
    name: "Braylon Mullins",
    age: 15,
    height: "6'6\"",
    position: "SG/SF",
    school: "Uncommitted",
    class: "2028", 
    hometown: "Greenfield Central, IN",
    stats: {
      ppg: 19.7,
      rpg: 6.1,
      apg: 3.8,
      fg_pct: 0.465,
      three_pt_pct: 0.401,
      ft_pct: 0.823
    },
    mockDraftPosition: 6,
    previousRanking: 8,
    trending: "up",
    scoutingNotes: "Elite shooter with improving all-around game. High-major recruit with NBA potential.",
    comparison: "Devin Booker",
    strengths: ["Shooting", "Scoring", "Size", "Work ethic"],
    weaknesses: ["Athleticism", "Defense"],
    watchlisted: false,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0c16ff64de2?w=400&h=500&fit=crop&crop=face",
    fallbackImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=BraylonMullins&backgroundColor=1d428a,3b82f6&clothesColor=262e33,65c5db&skinColor=f8d25c,fdbcb4"
  }
];

export const draftClasses = ["2026", "2027", "2028"];

export const positions = ["PG", "SG", "SF", "PF", "C"];

export const schools = [
  "BYU",
  "Kentucky", 
  "Arizona",
  "Duke",
  "North Carolina",
  "UCLA",
  "Gonzaga",
  "Auburn"
];
