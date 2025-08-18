// Edge Function super simples que definitivamente funciona
Deno.serve(async (req: Request): Promise<Response> => {
  console.log(`🚀 Function called: ${req.method} ${req.url}`);
  
  // Headers CORS obrigatórios
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  // Responder a OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('📋 CORS preflight request');
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    console.log('📦 Processing request...');
    
    // Ler body
    const body = await req.json().catch(() => ({}));
    console.log('📋 Request body:', JSON.stringify(body));
    
    const timestamp = new Date().toISOString();
    
    // Resposta de teste simples
    const response = {
      status: 'success',
      message: 'Edge Function is working perfectly!',
      timestamp,
      method: req.method,
      url: req.url,
      receivedData: body,
      environment: {
        STRIPE_SECRET_KEY: Deno.env.get('STRIPE_SECRET_KEY') ? 'configured' : 'missing',
        SUPABASE_URL: Deno.env.get('SUPABASE_URL') ? 'configured' : 'missing',
        SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'configured' : 'missing'
      }
    };
    
    console.log('✅ Sending response:', JSON.stringify(response));
    
    return new Response(JSON.stringify(response, null, 2), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      },
      status: 200,
    });
    
  } catch (error) {
    console.error('💥 Error:', error);
    
    const errorResponse = {
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(errorResponse, null, 2), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      },
      status: 500,
    });
  }
});
