import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Standard CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);

    if (userError) {
      console.error('Error getting user from JWT:', userError);
      return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userId = user.id;

    // 2. Delete user-related data from all tables
    const standardTables = ['user_watchlists', 'saved_mock_drafts', 'prospect_notes'];
    for (const table of standardTables) {
      const { error: deleteError } = await supabaseAdmin
        .from(table)
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        // Throw immediately to expose the specific error in logs
        throw new Error(`Failed to delete from ${table}: ${deleteError.message}`);
      }
    }

    // The 'profiles' table's primary key is the user's id itself
    const { error: profileDeleteError } = await supabaseAdmin.from('profiles').delete().eq('id', userId);
    if (profileDeleteError) {
        throw new Error(`Failed to delete from profiles: ${profileDeleteError.message}`);
    }

    // 3. Delete the user from the auth schema
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId, false);

    if (authError) {
      console.error(`Error deleting user ${userId} from auth schema:`, authError);
      throw new Error('Failed to delete user from authentication system.');
    }

    return new Response(JSON.stringify({ message: 'User and all related data deleted successfully.' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});