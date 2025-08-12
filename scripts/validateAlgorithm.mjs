import 'dotenv/config';
import { ProspectRankingAlgorithm } from '../src/intelligence/prospectRankingAlgorithm.js';
import fs from 'fs';
// Não precisamos de supabase ou generateDataDrivenScoutingReport para este backtesting
// import { supabase } from '../src/lib/supabaseClient.js';
// import { generateDataDrivenScoutingReport } from '../src/services/scoutingDataGenerator.js';

/**
 * Função principal para executar a validação.
 */
async function validateAlgorithm() {
  const draftClassDataPath = './backtesting/2018_draft_class.json';
  const outputFilePath = './backtesting_2018_results.json';

  try {
    const rawData = fs.readFileSync(draftClassDataPath, 'utf8');
    const players2018 = JSON.parse(rawData);

    const rankingAlgorithm = new ProspectRankingAlgorithm();
    const results = [];

    console.log(`Iniciando backtesting para a classe de 2018 (${players2018.length} jogadores)...`);
    console.log("----------------------------------------------------");

    for (const player of players2018) {
      // Mapear os dados do jogador para o formato esperado pelo algoritmo
      // O JSON já tem as chaves no formato que o algoritmo espera, mas vamos garantir
      // que os campos de porcentagem e por jogo estejam corretos.
      const prospectData = {
        ...player,
        // Garantir que as porcentagens estejam em decimal se vierem como 0.xxx
        fg_pct: player.fg_pct,
        three_pct: player.three_pct,
        ft_pct: player.ft_pct,
        ts_percent: player.ts_percent,
        usg_percent: player.usg_rate, // Mapear usg_rate para usg_percent
        // Mapear campos de jogo para o formato esperado pelo algoritmo
        // O algoritmo já lida com ppg, rpg, apg, etc. diretamente
        // Certificar que wingspan e height são strings para o parser
        height: player.height,
        wingspan: player.wingspan,
        // Adicionar campos que o algoritmo espera mas podem estar ausentes no JSON
        // e que agora são calculados ou têm valores padrão
        athleticism: player.athleticism || null, // Permitir que o algoritmo estime
        strength: player.strength || null,
        speed: player.speed || null,
        shooting: player.shooting || null,
        ballHandling: player.ballHandling || null,
        defense: player.defense || null,
        basketballIQ: player.basketballIQ || null,
        leadership: player.leadership || null,
        improvement: player.improvement || null,
        competition_level: player.competition_level || null,
        coachability: player.coachability || null,
        work_ethic: player.work_ethic || null,
        // Adicionar campos que o algoritmo espera para flags/cálculos
        tov_percent: player.tov_per_game ? (player.tov_per_game / (player.ppg + player.rpg + player.apg + player.stl_per_game + player.blk_per_game + player.tov_per_game)) : null, // Exemplo de cálculo se não houver tov_percent direto
        // O JSON já tem bpm, per, win_shares, etc.
      };

      // O JSON de 2018 tem 'tov_per_game', mas o algoritmo espera 'tov_percent' para algumas flags.
      // Vamos adicionar uma conversão simples para tov_percent se não estiver presente.
      // No entanto, o algoritmo já tem uma lógica para isso.
      // Vamos confiar nos dados que já estão no JSON e no algoritmo.
      if (player.tov_percent === undefined && player.tov_per_game !== undefined) {
        // Isso é uma estimativa grosseira, o ideal seria ter o tov_percent real
        // Mas para fins de teste, vamos tentar derivar algo.
        // No entanto, o algoritmo já tem uma lógica para isso.
        // Vamos confiar nos dados que já estão no JSON e no algoritmo.
      }

      // Para os campos que o algoritmo espera como `p.ncaa_raw_stats?.advanced?.conf_abbr`
      // e que não estão no JSON de 2018, eles serão `undefined` e o algoritmo usará o padrão.
      // Se quisermos simular o `competition_level` com base na conferência, precisaríamos
      // adicionar essa informação ao JSON de 2018 ou mapeá-la aqui.
      // Por enquanto, vamos deixar o algoritmo usar seus padrões para esses campos.

      const evaluation = rankingAlgorithm.evaluateProspect(prospectData);

      results.push({
        name: player.name,
        actual_draft_pick: player.actual_draft_pick,
        radar_score: evaluation.totalScore,
        draft_projection: evaluation.draftProjection.description,
        nba_readiness: evaluation.nbaReadiness,
        flags: evaluation.flags.map(f => f.message),
        category_scores: evaluation.categoryScores,
        // Incluir os valores subjetivos estimados para análise
        estimated_shooting: evaluation.categoryScores.technicalSkills, // technicalSkills inclui shooting
        estimated_athleticism: evaluation.categoryScores.physicalAttributes, // physicalAttributes inclui athleticism
        // Para os outros, precisaríamos de um retorno mais granular de estimateSubjectiveScores
        // ou adicioná-los ao objeto de avaliação.
      });

      console.log(`Avaliando ${player.name}: Score ${evaluation.totalScore}, Projeção: ${evaluation.draftProjection.description}`);
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2));
    console.log("----------------------------------------------------");
    console.log(`Backtesting concluído. Resultados salvos em ${outputFilePath}`);

  } catch (err) {
    console.error("Erro durante o backtesting:", err);
  }
}

// Executar o script
validateAlgorithm();