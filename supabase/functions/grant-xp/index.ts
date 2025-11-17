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
  // ... adicione mais níveis
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, userId } = await req.json();
    if (!action || !userId || !XP_MAP[action]) {
      throw new Error('Ação ou ID de usuário inválido.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Adicionar XP ao usuário
    const xpToAdd = XP_MAP[action];
    const { data: updatedProfile, error: rpcError } = await supabaseAdmin.rpc('add_xp_to_user', {
      user_id_param: userId,
      xp_to_add: xpToAdd
    });

    if (rpcError) throw rpcError;

    // 2. Verificar se o usuário subiu de nível
    const newXp = updatedProfile.xp;
    const currentLevel = updatedProfile.level;
    const nextLevel = currentLevel + 1;

    if (LEVEL_THRESHOLDS[nextLevel] && newXp >= LEVEL_THRESHOLDS[nextLevel]) {
      // Subiu de nível!
      await supabaseAdmin
        .from('profiles')
        .update({ level: nextLevel })
        .eq('id', userId);
      
      // Futuro: aqui você pode adicionar uma notificação para o usuário
      console.log(`🎉 Usuário ${userId} subiu para o nível ${nextLevel}!`);
    }

    // 3. Futuro: aqui você pode adicionar a lógica para verificar e conceder novas badges
    // Ex: Se o número de análises for 5, conceda a badge 'analyst_silver'

    return new Response(JSON.stringify({ message: `+${xpToAdd} XP concedido!` }), {
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
