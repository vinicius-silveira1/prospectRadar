import { scrapeNCAAStats } from './scrapeNCAAStats.mjs';

async function testScraper() {
  const playerName = "Hannes Steinbach";
  console.log(`--- Iniciando teste de scraping para ${playerName} ---`);
  
  const stats = await scrapeNCAAStats(playerName);

  if (stats) {
    console.log(`✅ Teste bem-sucedido! Dados encontrados para ${playerName}:`);
    console.log(JSON.stringify(stats, null, 2));
  } else {
    console.error(`❌ Teste falhou. Não foi possível encontrar dados para ${playerName}.`);
  }
  console.log(`--- Teste de scraping concluído ---`);
}

testScraper();
