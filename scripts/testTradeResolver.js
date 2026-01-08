import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  resolve2026DraftOrder, 
  resolveSecondRound, 
  generateInitialOrderFromStandings, 
  generateSecondRoundOrderFromStandings 
} from '../src/logic/tradeResolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Carrega o arquivo JSON de standings real.
 */
function loadStandings() {
  try {
    const jsonPath = path.join(__dirname, '../public/data/nba_standings.json');
    if (!fs.existsSync(jsonPath)) {
        console.error("❌ Arquivo nba_standings.json não encontrado em:", jsonPath);
        return null;
    }
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error("❌ Erro ao carregar standings:", error);
    return null;
  }
}

function runIntegrationTest() {
  console.log('🚀 INICIANDO TESTE DE INTEGRAÇÃO (JSON -> RESOLVER)...\n');
  
  const standings = loadStandings();
  if (!standings) return;
  console.log(`✅ Standings carregadas (Season: ${standings.season})`);

  const initialOrder = generateInitialOrderFromStandings(standings);
  console.log(`✅ Ordem inicial construída (${initialOrder.length} times).`);
  
  // Verificação de Sanidade dos Dados
  if (!initialOrder[0].team) {
      console.error("❌ ERRO CRÍTICO: Objeto inicial não tem propriedade 'team'. O Resolver vai falhar.");
      console.log("Exemplo de objeto:", initialOrder[0]);
      return;
  }

  // Executa o Resolver
  const finalOrder = resolve2026DraftOrder(initialOrder);
  
  console.log('\n📊 ORDEM FINAL 1ª RODADA (Amostra):');
  console.table(finalOrder.map(p => ({ 
      pick: p.pick, 
      original: p.originalTeam, 
      owner: p.newOwner, 
      traded: p.isTraded, 
      desc: p.description[0]?.substring(0, 40) + '...' 
  })));

  // Segunda Rodada
  const initialSecond = generateSecondRoundOrderFromStandings(standings);
  const finalSecond = resolveSecondRound(initialSecond, finalOrder);
  
  console.log('\n📊 ORDEM FINAL 2ª RODADA (Amostra):');
  console.table(finalSecond.map(p => ({ 
      pick: p.pick, 
      original: p.originalTeam, 
      owner: p.newOwner, 
      traded: p.isTraded, 
      desc: p.description[0]?.substring(0, 40) + '...' 
  })));

  console.log('\n🏁 Teste de Integração Concluído.');
}

runIntegrationTest();