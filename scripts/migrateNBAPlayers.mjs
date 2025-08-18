/**
 * Script para remover jogadores NBA da tabela prospects
 * 
 * Este script deve ser executado após criar uma tabela dedicada para jogadores NBA
 * e migrar os dados apropriadamente.
 */

import { supabase } from '../src/lib/supabaseClient.js';

const NBA_PLAYERS_TO_REMOVE = [
  'Luka Dončić',
  'Jalen Brunson', 
  'Michael Porter Jr.'
];

async function removeNBAPlayersFromProspects() {
  console.log('🏀 Iniciando remoção de jogadores NBA da tabela prospects...');
  
  try {
    // Primeiro, vamos buscar os jogadores para confirmar que existem
    const { data: existingPlayers, error: fetchError } = await supabase
      .from('prospects')
      .select('id, name')
      .in('name', NBA_PLAYERS_TO_REMOVE);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📋 Encontrados ${existingPlayers.length} jogadores NBA na base prospects:`);
    existingPlayers.forEach(player => {
      console.log(`   - ${player.name} (ID: ${player.id})`);
    });

    if (existingPlayers.length === 0) {
      console.log('✅ Nenhum jogador NBA encontrado na base prospects.');
      return;
    }

    // Confirmar antes de deletar
    console.log('\n⚠️  ATENÇÃO: Esta operação irá DELETAR permanentemente estes jogadores da tabela prospects.');
    console.log('   Certifique-se de que os dados foram migrados para a tabela nba_players antes de continuar.');
    
    // Aqui você normalmente pediria confirmação do usuário
    // Para propósitos de exemplo, vamos comentar a deleção
    
    /*
    // Deletar os jogadores NBA da tabela prospects
    const { error: deleteError } = await supabase
      .from('prospects')
      .delete()
      .in('name', NBA_PLAYERS_TO_REMOVE);

    if (deleteError) {
      throw deleteError;
    }

    console.log('✅ Jogadores NBA removidos com sucesso da tabela prospects!');
    */

    console.log('\n🔒 Script em modo SEGURO - deleção comentada.');
    console.log('   Descomente as linhas de deleção quando estiver pronto para executar.');
    
  } catch (error) {
    console.error('❌ Erro ao remover jogadores NBA:', error);
  }
}

async function migrateToNBAPlayersTable() {
  console.log('\n🚀 Preparando migração para tabela nba_players...');
  
  try {
    // Buscar dados completos dos jogadores NBA
    const { data: nbaPlayers, error: fetchError } = await supabase
      .from('prospects')
      .select('*')
      .in('name', NBA_PLAYERS_TO_REMOVE);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📋 Dados dos jogadores NBA encontrados:`);
    nbaPlayers.forEach(player => {
      console.log(`   - ${player.name}: PPG ${player.ppg}, RPG ${player.rpg}, APG ${player.apg}`);
    });

    // Transformar dados para o formato da tabela nba_players
    const nbaPlayersData = nbaPlayers.map(player => ({
      id: player.id,
      name: player.name,
      position: player.position,
      height_cm: player.height ? parseInt(player.height.us?.replace(/['"]/g, '')) * 2.54 : null,
      weight_kg: player.weight ? Math.round(player.weight.us * 0.453592) : null,
      draft_year: 2018, // Todos são da classe 2018
      draft_pick: getDraftPick(player.name),
      college_stats_raw: {
        ppg: player.ppg,
        rpg: player.rpg,
        apg: player.apg,
        fg_percentage: player.fg_percentage,
        three_pt_percentage: player.three_pt_percentage,
        ft_percentage: player.ft_percentage
      },
      // Adicionar mais campos conforme necessário
    }));

    console.log('\n📊 Dados transformados para tabela nba_players:');
    console.log(JSON.stringify(nbaPlayersData, null, 2));

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  }
}

function getDraftPick(playerName) {
  const draftPicks = {
    'Luka Dončić': 3,
    'Jalen Brunson': 33,
    'Michael Porter Jr.': 14
  };
  return draftPicks[playerName] || null;
}

// Executar as funções
async function main() {
  console.log('🏀 SCRIPT DE MIGRAÇÃO NBA PLAYERS\n');
  
  await migrateToNBAPlayersTable();
  await removeNBAPlayersFromProspects();
  
  console.log('\n✅ Script de migração concluído!');
  console.log('📝 Próximos passos:');
  console.log('   1. Criar tabela nba_players no Supabase');
  console.log('   2. Inserir dados na nova tabela');
  console.log('   3. Descomente a deleção e execute novamente');
  console.log('   4. Atualizar hooks para usar a nova tabela');
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { removeNBAPlayersFromProspects, migrateToNBAPlayersTable };
