import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Script para adicionar novos prospectos da NCAA ao Supabase a partir de uma lista de URLs do Sports-Reference,
 * e então atualizar suas estatísticas usando o script individual.
 *
 * Uso:
 * node scripts/addNCAAProspectsFromUrls.mjs <DRAFT_CLASS> <URL1> <URL2> ...
 *
 * Exemplo:
 * node scripts/addNCAAProspectsFromUrls.mjs 2026 "https://www.sports-reference.com/cbb/players/hannes-steinbach-1.html" "https://www.sports-reference.com/cbb/players/tounde-yessoufou-1.html"
 */
async function addNCAAProspectsFromUrls() {
  const args = process.argv.slice(2);
  const draftClass = args[0];
  const urls = args.slice(1);

  if (!draftClass) {
    console.error('❌ Erro: Forneça a classe do draft como primeiro argumento. Ex: 2026');
    return;
  }

  if (urls.length === 0) {
    console.error('❌ Erro: Forneça pelo menos uma URL do Sports-Reference.');
    return;
  }

  console.log(`🚀 Iniciando adição e atualização de ${urls.length} novos prospectos para a classe ${draftClass}...`);

  const successfulAdditions = [];
  const failedAdditions = [];

  for (const url of urls) {
    try {
      const urlParts = url.split('/');
      const playerSlugWithNumber = urlParts[urlParts.length - 1].replace('.html', '');
      const playerSlug = playerSlugWithNumber.replace(/-\d+$/, ''); // Remove o número final (ex: -1, -2)
      const playerName = playerSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

      console.log(`
----------------------------------------------------`);
      console.log(`Processando URL: ${url}`);
      console.log(`Nome extraído: ${playerName}, Slug: ${playerSlug}`);

      // 1. Verificar se o prospecto já existe
      const { data: existingProspect, error: fetchError } = await supabase
        .from('prospects')
        .select('id, name')
        .eq('id', playerSlug)
        .single();

      let prospectId = playerSlug;

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
        throw new Error(`Erro ao verificar prospecto existente (${playerSlug}): ${fetchError.message}`);
      }

      if (existingProspect) {
        console.log(`ℹ️ Prospecto "${playerName}" (ID: ${playerSlug}) já existe. Pulando criação.`);
        prospectId = existingProspect.id; // Garante que estamos usando o ID existente
      } else {
        // 2. Criar o novo prospecto no Supabase
        console.log(`Criando novo prospecto "${playerName}" (ID: ${playerSlug})...`);
        const { data: newProspect, error: insertError } = await supabase
          .from('prospects')
          .insert([
            {
              id: playerSlug,
              name: playerName,
              draftClass: draftClass,
              // Adicione outros campos padrão se necessário, como 'league', 'position', etc.
              // Por exemplo: league: 'NCAA', position: 'Guard',
            }
          ])
          .select()
          .single();

        if (insertError) {
          throw new Error(`Erro ao criar prospecto "${playerName}": ${insertError.message}`);
        }
        console.log(`✅ Prospecto "${playerName}" criado com sucesso.`);
        prospectId = newProspect.id;
      }

      // 3. Chamar o script de atualização individual para raspar e processar as estatísticas
      console.log(`Chamando updateIndividualNCAAProspect.mjs para ${playerName} (ID: ${prospectId})...`);
      const { stdout, stderr } = await execPromise(`node scripts/updateIndividualNCAAProspect.mjs ${prospectId} "${url}"`);
      console.log('Saída do updateIndividualNCAAProspect:', stdout);
      if (stderr) {
        console.error('Erro no updateIndividualNCAAProspect:', stderr);
        failedAdditions.push(`${playerName} (Erro na atualização individual)`);
      } else {
        console.log(`✅ Prospecto "${playerName}" adicionado e atualizado com sucesso.`);
        successfulAdditions.push(playerName);
      }

    } catch (error) {
      console.error(`❌ Falha ao processar URL ${url}: ${error.message}`);
      failedAdditions.push(`${url} (Erro: ${error.message})`);
    }
  }

  console.log(`
----------------------------------------------------`);
  console.log(`🎉 Processo de adição de prospectos concluído!`);
  console.log(`
--- Sumário ---
`);
  console.log(`✅ Prospectos adicionados/atualizados com sucesso (${successfulAdditions.length}):`);
  successfulAdditions.forEach(name => console.log(`  - ${name}`));
  console.log(`❌ Prospectos com falha (${failedAdditions.length}):`);
  failedAdditions.forEach(item => console.log(`  - ${item}`));
  console.log(`-----------------`);
}

addNCAAProspectsFromUrls();
