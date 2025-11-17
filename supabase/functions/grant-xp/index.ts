import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Mapeamento de ações para XP
const XP_MAP = {
  'SUBMIT_ANALYSIS': 50,
  'RECEIVE_ASSIST': 10,
  'GIVE_ASSIST': 1,
  'SUBMIT_COMMENT': 5,
  'COMPLETE_MOCK_DRAFT': 25,
  'ADD_TO_WATCHLIST': 5,
};

// Mapeamento de Níveis para XP necessário
const LEVEL_THRESHOLDS = {
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  // Expansão de Níveis
  6: 1750,
  7: 2750,
  8: 4000,
  9: 5500,
  10: 7500, // Nível "Elite Scout"
  11: 10000,
  12: 13000,
  13: 16500,
  14: 20500,
  15: 25000, // Nível "Lendário"
};

// Mapeamento de Níveis para Badges
const LEVEL_BADGES = {
  3: 'level_3',
  4: 'level_4',
  5: 'level_5',
  6: 'level_6',
  7: 'level_7',
  8: 'level_8',
  9: 'level_9',
  10: 'level_10',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, userId, targetId } = await req.json(); // Adicionado targetId
    if (!action || !userId || !XP_MAP[action]) {
      throw new Error('Ação, ID de usuário ou targetId inválido.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Ações que devem ser concedidas apenas uma vez por alvo
    const uniqueActions = ['ADD_TO_WATCHLIST'];

    if (uniqueActions.includes(action)) {
      if (!targetId) {
        throw new Error('targetId é necessário para ações únicas.');
      }
      // Verifica se a ação já foi registrada
      const { error: insertError } = await supabaseAdmin
        .from('xp_actions')
        .insert({
          user_id: userId,
          action_type: action,
          target_id: targetId,
        });

      if (insertError) {
        // Se houver um erro de violação de chave única, significa que a ação já foi feita.
        // Retornamos sucesso, mas não concedemos XP.
        if (insertError.code === '23505') { // Código de erro para violação de unicidade no PostgreSQL
          console.log(`Ação '${action}' para o alvo '${targetId}' já registrada para o usuário ${userId}. Nenhum XP concedido.`);
          return new Response(JSON.stringify({ message: 'Ação já registrada.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }
        throw insertError; // Lança outros erros
      }
    }

    // 1. Adicionar XP ao usuário
    const { data: result, error: rpcError } = await supabaseAdmin.rpc('grant_xp_and_level_up', {
      user_id_param: userId,
      xp_to_add: XP_MAP[action]
    });

    if (rpcError || !result) {
      throw rpcError || new Error("Erro ao processar XP e nível.");
    }

    // CORREÇÃO: Acessar o primeiro elemento do array retornado pelo RPC
    const rpcResult = Array.isArray(result) ? result[0] : result;
    const { xp_added, leveled_up, new_level } = rpcResult;

    if (leveled_up) {
      console.log(`🎉 Usuário ${userId} subiu para o nível ${new_level}!`);
      // Concede a badge para o novo nível alcançado
      const badgeToGrant = LEVEL_BADGES[new_level];
      if (badgeToGrant) {
        const { error: badgeError } = await supabaseAdmin
          .from('user_badges')
          .insert({ user_id: userId, badge_id: badgeToGrant }, { onConflict: 'user_id,badge_id' }); // Ignora se já tiver
        
        if (badgeError) console.error(`Erro ao conceder badge de nível ${new_level}:`, badgeError);
        else console.log(`🏅 Badge '${badgeToGrant}' concedida para o usuário ${userId}.`);
      }
    }

    return new Response(JSON.stringify({ 
      message: `+${xp_added} XP!`,
      leveledUp: leveled_up,
      newLevel: new_level,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
