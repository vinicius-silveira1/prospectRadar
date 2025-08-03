import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // Load environment variables from .env file

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessários.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populateGabrielFerreiraStats() {
  const prospectId = "gabriel-ferreira-ncaa";
  const prospectName = "Gabriel Ferreira";

  const dataToUpdate = {
    id: prospectId,
    name: prospectName,
    position: "PF",
    nationality: "🇧🇷",
    age: 19, // em 2025
    height: { us: "6'9\"", metric: 206 },
    weight: "220 lbs",
    team: "Radford University", // Equipe atual (2025-26)
    draft_class: 2026,
    eligibilityStatus: "Elegível para o Draft de 2026",

    // Estatísticas da Temporada Mais Atual (2024-25 - NBA Academy Latin America)
    ppg: 15.5,
    rpg: 10.1,
    spg: 1.4,
    bpg: 1.6,
    three_pct: 0.38, // 38%
    ft_pct: 0.824, // 82.4% (FIBA U18 2024)
    turnovers: 0.8, // Turnovers por Jogo (FIBA U18 2024)
    fg_pct: 0.500, // 50.0% no FIBA U18 2024

    // Análise de Potencial
    strengths: [
      "Excelente tamanho e atletismo para um ala/pivô moderno.",
      "Demonstra potencial de duas vias com forte capacidade de rebote, bloqueio de arremessos e versatilidade defensiva.",
      "Sua capacidade de \"espaçar a quadra como um ala\" com 38% de aproveitamento nos arremessos de três pontos é uma habilidade altamente cobiçada na NBA.",
      "Seu reconhecimento no BWB (All-Star, MVP Defensivo) sublinha seu talento e impacto.",
    ],
    weaknesses: [
      "Precisa continuar aprimorando seu jogo ofensivo geral e suas habilidades com a bola.",
      "Sua transição para o basquete da Divisão I da NCAA em Radford será um teste crucial de sua adaptabilidade e capacidade de manter alta produção contra forte concorrência universitária.",
    ],

    // Atributos subjetivos com valores padrão ou calculados (ajustar conforme necessário)
    athleticism: 8.0, // Baseado na descrição "Excelente atletismo"
    speed: 7.0, // Estimativa
    strength: 7.5, // Estimativa
    motor: 7.0, // Padrão, sem USG% para calcular
    basketball_iq: 7.0, // Padrão, sem AST% e TOV% para calcular
    
    last_verified_at: new Date().toISOString(),
  };

  // Remove undefined values to avoid issues with Supabase upsert
  Object.keys(dataToUpdate).forEach(key => {
    if (dataToUpdate[key] === undefined) {
      delete dataToUpdate[key];
    }
  });

  console.log(`Attempting to insert/update prospect: ${prospectName}`);
  console.log("Data to update:", dataToUpdate);

  const { data, error } = await supabase
    .from('prospects')
    .upsert(dataToUpdate, { onConflict: 'id' });

  if (error) {
    console.error(`Erro ao inserir/atualizar ${prospectName}:`, error);
  } else {
    console.log(`${prospectName} inserido/atualizado com sucesso!`, data);
  }
}

populateGabrielFerreiraStats();
