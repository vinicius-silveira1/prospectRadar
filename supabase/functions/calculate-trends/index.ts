import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Definição dos tipos para clareza
interface HistoryEntry {
  prospect_id: string;
  captured_date: string;
  radar_score: number | null;
  ppg: number | null;
  rpg: number | null;
  apg: number | null;
  per: number | null;
  ts_percent: number | null;
  bpm: number | null;
  win_shares: number | null;
}

interface TrendData {
  radar_score_change: number;
  ppg_change: number;
  rpg_change: number;
  apg_change: number;
  per_change: number;
  ts_percent_change: number;
  bpm_change: number;
  win_shares_change: number;
}

interface TrendUpdate {
  id: string;
  trending_today?: TrendData;
  trending_7_days?: TrendData;
  trending_30_days?: TrendData;
}

Deno.serve(async (req) => {
  // Tratamento para requisições OPTIONS (necessário para CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Cria um cliente Supabase com permissões de administrador para poder escrever na tabela
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🚀 Iniciando cálculo de tendências...');

    // 1. Buscar histórico dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: historyData, error: historyError } = await supabaseAdmin
      .from('prospect_stats_history')
      .select('prospect_id, captured_date, radar_score, ppg, rpg, apg, per, ts_percent, bpm, win_shares')
      .gte('captured_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('captured_date', { ascending: false });

    if (historyError) {
      throw new Error(`Erro ao buscar histórico: ${historyError.message}`);
    }

    console.log(`📈 Encontrados ${historyData.length} registros de histórico.`);

    // 2. Agrupar histórico por prospecto
    const groupedHistory = (historyData || []).reduce((acc, entry: HistoryEntry) => {
      const cleanId = entry.prospect_id.trim(); // 🛡️ Garante que o ID não tenha espaços
      if (!acc[cleanId]) {
        acc[cleanId] = [];
      }
      // Garante que não haja datas duplicadas, mantendo a mais recente
      if (!acc[cleanId].some(e => e.captured_date === entry.captured_date)) {
        acc[cleanId].push(entry);
      }
      return acc;
    }, {} as Record<string, HistoryEntry[]>);

    // 2.5. Validar quais prospectos ainda existem na tabela principal
    const existingProspectIds = Object.keys(groupedHistory);
    const { data: existingProspects, error: existingProspectsError } = await supabaseAdmin
      .from('prospects')
      .select('id')
      .in('id', existingProspectIds);

    if (existingProspectsError) {
      throw new Error(`Erro ao validar IDs de prospectos existentes: ${existingProspectsError.message}`);
    }

    const existingProspectIdSet = new Set((existingProspects || []).map(p => p.id.trim())); // 🛡️ Limpa os IDs aqui também
    console.log(`🔎 Encontrados ${existingProspectIdSet.size} prospectos existentes de ${existingProspectIds.length} IDs do histórico.`);


    const updates: TrendUpdate[] = [];

    // 3. Calcular tendências para cada prospecto
    for (const prospectId in groupedHistory) {
      const history = groupedHistory[prospectId];
      if (history.length < 2) continue; // Precisa de pelo menos 2 pontos para calcular tendência

      // Pula o cálculo se o prospecto não existir mais na tabela principal
      if (!existingProspectIdSet.has(prospectId)) {
        console.log(`-️⃣ Pulando ID órfão: ${prospectId}`);
        continue;
      }

      const update: TrendUpdate = { id: prospectId };
      const latest = history[0];

      // Função auxiliar para encontrar o registro mais próximo de uma data alvo
      const findClosestEntry = (targetDaysAgo: number) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - targetDaysAgo);
        
        let closestEntry: HistoryEntry | null = null;
        let smallestDiff = Infinity;

        // Começa do segundo registro, já que o primeiro é sempre o mais recente
        for (let i = 1; i < history.length; i++) {
          const entryDate = new Date(history[i].captured_date);
          const diff = Math.abs(entryDate.getTime() - targetDate.getTime());
          
          if (diff < smallestDiff) {
            smallestDiff = diff;
            closestEntry = history[i];
          }
        }
        return closestEntry;
      };

      const calculateChange = (latestVal: number | null, pastVal: number | null): number => {
        return parseFloat(((latestVal || 0) - (pastVal || 0)).toFixed(2));
      };

      const createTrendData = (latest: HistoryEntry, past: HistoryEntry): TrendData => ({
        radar_score_change: calculateChange(latest.radar_score, past.radar_score),
        ppg_change: calculateChange(latest.ppg, past.ppg),
        rpg_change: calculateChange(latest.rpg, past.rpg),
        apg_change: calculateChange(latest.apg, past.apg),
        per_change: calculateChange(latest.per, past.per),
        ts_percent_change: calculateChange(latest.ts_percent, past.ts_percent),
        bpm_change: calculateChange(latest.bpm, past.bpm),
        win_shares_change: calculateChange(latest.win_shares, past.win_shares),
      });

      // Calcular tendência de 1 dia (hoje vs. ontem)
      const yesterdayEntry = findClosestEntry(1);
      if (yesterdayEntry) {
        update.trending_today = createTrendData(latest, yesterdayEntry);
      }

      // Calcular tendência de 7 dias
      const sevenDaysAgoEntry = findClosestEntry(7);
      if (sevenDaysAgoEntry) {
        update.trending_7_days = createTrendData(latest, sevenDaysAgoEntry);
      }

      // Calcular tendência de 30 dias
      const thirtyDaysAgoEntry = findClosestEntry(30);
      if (thirtyDaysAgoEntry) {
        update.trending_30_days = createTrendData(latest, thirtyDaysAgoEntry);
      }
      
      // Adiciona para o batch update se houver alguma tendência calculada
      if (Object.keys(update).length > 1) {
        updates.push(update);
      }
    }

    console.log(`⚙️ Preparando para atualizar ${updates.length} prospectos.`);

    // 4. Atualizar a tabela 'prospects' em lote (batch)
    // 🛡️ Trocando upsert por múltiplos updates para garantir que nunca tentaremos criar um prospecto.
    if (updates.length > 0) {
      const updatePromises = updates.map(updateData => {
        const { id, ...trends } = updateData;
        return supabaseAdmin
          .from('prospects')
          .update(trends)
          .eq('id', id);
      });
      const results = await Promise.all(updatePromises);
      const firstError = results.find(res => res.error);
      if (firstError) {
        throw new Error(`Erro ao atualizar tendências: ${firstError.error.message}`);
      }
      console.log(`✅ Tendências atualizadas com sucesso para ${updates.length} prospectos!`);
    } else {
      console.log('ℹ️ Nenhuma tendência para atualizar.');
    }

    return new Response(JSON.stringify({ message: `Tendências atualizadas para ${updates.length} prospectos.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Erro na Edge Function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});