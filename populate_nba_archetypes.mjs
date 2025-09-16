import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Para carregar variáveis .env

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("URL e Chave Anon do Supabase são obrigatórias. Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estejam definidos em seu ambiente ou arquivo .env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const allNbaPlayerArchetypes = [
  { "name": "Devin Booker", "position": "SG", "archetypes": ["Elite Scorer / Volume Scorer", "Primary Ball-Handler / Playmaker"] },
  { "name": "Jayson Tatum", "position": "SF", "archetypes": ["Elite Scorer / Volume Scorer", "Versatile Forward / All-Around"] },
  { "name": "Jrue Holiday", "position": "PG", "archetypes": ["Low-Usage Specialist", "Elite Perimeter Defender"] },
  { "name": "LeBron James", "position": "SF", "archetypes": ["Unique / Generational Talent", "Versatile Forward / All-Around", "Primary Ball-Handler / Playmaker", "Elite Scorer / Volume Scorer"] },
  { "name": "Mikal Bridges", "position": "SF", "archetypes": ["3-and-D Wing", "Low-Usage Specialist"] },
  { "name": "Myles Turner", "position": "C", "archetypes": ["Defensive Anchor / Rim Protector", "Stretch Big"] },
  { "name": "Bam Adebayo", "position": "C", "archetypes": ["Defensive Anchor / Rim Protector", "Versatile Forward / All-Around"] },
  { "name": "Brook Lopez", "position": "C", "archetypes": ["Stretch Big", "Defensive Anchor / Rim Protector"] },
  { "name": "Derrick White", "position": "SG", "archetypes": ["Low-Usage Specialist", "3-and-D Wing"] },
  { "name": "Nikola Jokic", "position": "C", "archetypes": ["Unique / Generational Talent", "Primary Ball-Handler / Playmaker", "Versatile Forward / All-Around"] },
  { "name": "OG Anunoby", "position": "SF", "archetypes": ["3-and-D Wing", "Elite Perimeter Defender"] },
  { "name": "Robert Covington", "position": "PF", "archetypes": ["3-and-D Wing", "Low-Usage Specialist"] },
  { "name": "Stephen Curry", "position": "PG", "archetypes": ["Elite Scorer / Volume Scorer", "Primary Ball-Handler / Playmaker", "Unique / Generational Talent"] },
  { "name": "Alec Burks", "position": "SG", "archetypes": ["Low-Usage Specialist"] },
  { "name": "Anthony Bennett", "position": "PF", "archetypes": ["Low-Usage Specialist"] },
  { "name": "Ben McLemore", "position": "SG", "archetypes": ["Low-Usage Specialist"] },
  { "name": "Bismack Biyombo", "position": "C", "archetypes": ["Defensive Anchor / Rim Protector", "Rebounding Specialist"] },
  { "name": "Derrick Williams", "position": "PF", "archetypes": ["Athletic Finisher / Slasher"] },
  { "name": "Brandon Knight", "position": "PG", "archetypes": ["Elite Scorer / Volume Scorer", "Primary Ball-Handler / Playmaker"] },
  { "name": "Danté Exum", "position": "PG", "archetypes": ["Low-Usage Specialist", "Elite Perimeter Defender"] },
  { "name": "Dragan Bender", "position": "PF", "archetypes": ["Low-Usage Specialist"] },
  { "name": "Andrei Kirilenko", "position": "SF", "archetypes": ["Versatile Forward / All-Around", "Elite Perimeter Defender"] },
  { "name": "Anthony Edwards", "position": "SG", "archetypes": ["Elite Scorer / Volume Scorer", "Athletic Finisher / Slasher"] },
  { "name": "Ben Simmons", "position": "PG", "archetypes": ["Primary Ball-Handler / Playmaker", "Elite Perimeter Defender"] },
  { "name": "Cade Cunningham", "position": "PG", "archetypes": ["Primary Ball-Handler / Playmaker", "Elite Scorer / Volume Scorer"] },
  { "name": "Charles Barkley", "position": "PF", "archetypes": ["Versatile Forward / All-Around", "Rebounding Specialist", "Elite Scorer / Volume Scorer"] },
  { "name": "Chet Holmgren", "position": "C", "archetypes": ["Defensive Anchor / Rim Protector", "Stretch Big", "Unique / Generational Talent"] },
  { "name": "Dennis Rodman", "position": "PF", "archetypes": ["Rebounding Specialist", "Defensive Anchor / Rim Protector"] },
  { "name": "Enes Freedom", "position": "C", "archetypes": ["Rebounding Specialist", "Low-Usage Specialist"] },
  { "name": "Evan Mobley", "position": "PF", "archetypes": ["Defensive Anchor / Rim Protector", "Versatile Forward / All-Around"] },
  { "name": "Frank Ntilikina", "position": "PG", "archetypes": ["Low-Usage Specialist", "Elite Perimeter Defender", "Connector"] },
  { "name": "Giannis Antetokounmpo", "position": "PF", "archetypes": ["Unique / Generational Talent", "Versatile Forward / All-Around", "Elite Scorer / Volume Scorer", "Defensive Anchor / Rim Protector"] },
  { "name": "Hakeem Olajuwon", "position": "C", "archetypes": ["Unique / Generational Talent", "Defensive Anchor / Rim Protector", "Elite Scorer / Volume Scorer", "Rebounding Specialist"] },
  { "name": "Jalen Green", "position": "SG", "archetypes": ["Elite Scorer / Volume Scorer", "Athletic Finisher / Slasher"] },
  { "name": "Jan Vesely", "position": "PF", "archetypes": ["Athletic Finisher / Slasher", "Low-Usage Specialist"] },
  { "name": "Jimmer Fredette", "position": "SG", "archetypes": ["Low-Usage Specialist"] },
  { "name": "John Stockton", "position": "PG", "archetypes": ["Primary Ball-Handler / Playmaker", "Low-Usage Specialist", "Elite Perimeter Defender"] },
  { "name": "Jonas Valančiūnas", "position": "C", "archetypes": ["Rebounding Specialist", "Low-Usage Specialist"] },
  { "name": "Kawhi Leonard", "position": "SF", "archetypes": ["Unique / Generational Talent", "3-and-D Wing", "Elite Scorer / Volume Scorer", "Elite Perimeter Defender"] },
  { "name": "Kemba Walker", "position": "PG", "archetypes": ["Elite Scorer / Volume Scorer", "Primary Ball-Handler / Playmaker"] },
  { "name": "Kevin Durant", "position": "SF", "archetypes": ["Unique / Generational Talent", "Elite Scorer / Volume Scorer", "Stretch Big"] },
  { "name": "Klay Thompson", "position": "SG", "archetypes": ["3-and-D Wing", "Elite Scorer / Volume Scorer"] },
  { "name": "Kobe Bryant", "position": "SG", "archetypes": ["Elite Scorer / Volume Scorer", "Versatile Forward / All-Around", "Primary Ball-Handler / Playmaker", "Elite Perimeter Defender"] },
  { "name": "Kyrie Irving", "position": "SG", "archetypes": ["Elite Scorer / Volume Scorer", "Primary Ball-Handler / Playmaker"] },
  { "name": "LaMelo Ball", "position": "PG", "archetypes": ["Primary Ball-Handler / Playmaker", "Versatile Forward / All-Around"] },
  { "name": "Larry Bird", "position": "SF", "archetypes": ["Unique / Generational Talent", "Versatile Forward / All-Around", "Elite Scorer / Volume Scorer", "Primary Ball-Handler / Playmaker"] },
  { "name": "Lou Williams", "position": "SG", "archetypes": ["Low-Usage Specialist"] },
  { "name": "Luka Dončić", "position": "PG", "archetypes": ["Unique / Generational Talent", "Primary Ball-Handler / Playmaker", "Elite Scorer / Volume Scorer", "Versatile Forward / All-Around"] },
  { "name": "Magic Johnson", "position": "PG", "archetypes": ["Unique / Generational Talent", "Primary Ball-Handler / Playmaker", "Versatile Forward / All-Around"] },
  { "name": "Manu Ginóbili", "position": "SG", "archetypes": ["Versatile Forward / All-Around", "Primary Ball-Handler / Playmaker", "Low-Usage Specialist", "Elite Perimeter Defender"] },
  { "name": "Marcus Morris Sr.", "position": "PF", "archetypes": ["Low-Usage Specialist", "3-and-D Wing"] },
  { "name": "Marcus Smart", "position": "PG", "archetypes": ["Elite Perimeter Defender", "Primary Ball-Handler / Playmaker", "Low-Usage Specialist", "Connector"] },,
  { "name": "Markelle Fultz", "position": "PG", "archetypes": ["Primary Ball-Handler / Playmaker", "Low-Usage Specialist"] },
  { "name": "Markieff Morris", "position": "PF", "archetypes": ["Low-Usage Specialist"] },
  { "name": "Michael Jordan", "position": "SG", "archetypes": ["Unique / Generational Talent", "Elite Scorer / Volume Scorer", "Elite Perimeter Defender"] },
  { "name": "Paolo Banchero", "position": "PF", "archetypes": ["Versatile Forward / All-Around", "Elite Scorer / Volume Scorer", "Primary Ball-Handler / Playmaker"] },
  { "name": "Patrick Ewing", "position": "C", "archetypes": ["Defensive Anchor / Rim Protector", "Elite Scorer / Volume Scorer", "Rebounding Specialist"] },
  { "name": "Reggie Miller", "position": "SG", "archetypes": ["Elite Scorer / Volume Scorer", "Elite Shooter", "Low-Usage Specialist"] },
  { "name": "Ray Allen", "position": "SG", "archetypes": ["Elite Shooter", "Low-Usage Specialist", "3-and-D Wing"] },
  { "name": "Scoot Henderson", "position": "PG", "archetypes": ["Primary Ball-Handler / Playmaker", "Athletic Finisher / Slasher", "Elite Scorer / Volume Scorer"] },
  { "name": "Scottie Pippen", "position": "SF", "archetypes": ["Versatile Forward / All-Around", "Elite Perimeter Defender", "Primary Ball-Handler / Playmaker"] },
  { "name": "Shaquille O'Neal", "position": "C", "archetypes": ["Unique / Generational Talent", "Elite Scorer / Volume Scorer", "Rebounding Specialist", "Defensive Anchor / Rim Protector"] },
  { "name": "Tim Duncan", "position": "PF", "archetypes": ["Unique / Generational Talent", "Versatile Forward / All-Around", "Defensive Anchor / Rim Protector", "Rebounding Specialist"] },
  { "name": "Trae Young", "position": "PG", "archetypes": ["Primary Ball-Handler / Playmaker", "Elite Scorer / Volume Scorer"] },
  { "name": "Tristan Thompson", "position": "C", "archetypes": ["Rebounding Specialist", "Low-Usage Specialist"] },
  { "name": "Tyrese Haliburton", "position": "PG", "archetypes": ["Primary Ball-Handler / Playmaker", "Low-Usage Specialist"] },
  { "name": "Victor Wembanyama", "position": "C", "archetypes": ["Unique / Generational Talent", "Defensive Anchor / Rim Protector", "Stretch Big", "Elite Scorer / Volume Scorer"] },
  { "name": "Zion Williamson", "position": "PF", "archetypes": ["Unique / Generational Talent", "Athletic Finisher / Slasher", "Elite Scorer / Volume Scorer", "Rebounding Specialist"] },
  { "name": "Kevin Love", "position": "PF", "archetypes": ["Stretch Big", "Rebounding Specialist", "Elite Shooter"] },
  { "name": "Kristaps Porziņģis", "position": "C", "archetypes": ["Stretch Big", "Elite Shooter", "Defensive Anchor / Rim Protector"] }
];

async function updateNbaPlayerArchetypes() {
  for (const player of allNbaPlayerArchetypes) {
    try {
      const { data, error } = await supabase
        .from('nba_players_historical')
        .update({ archetypes: player.archetypes, position: player.position }) // Atualiza arquétipos E posição
        .eq('name', player.name);

      if (error) {
        console.error(`Erro ao atualizar arquétipos e posição para ${player.name}:`, error);
      } else {
        console.log(`Arquétipos e posição atualizados com sucesso para ${player.name}`);
      }
    } catch (e) {
      console.error(`Erro inesperado ao atualizar arquétipos e posição para ${player.name}:`, e);
    }
  }
  console.log("Concluída a atualização de todos os arquétipos e posições de jogadores da NBA.");
}

updateNbaPlayerArchetypes();