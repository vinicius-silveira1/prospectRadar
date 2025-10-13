import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.23.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

// Required for web browser calls
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16", // Keep API version for compatibility unless a change is needed
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { priceId, userId, successUrl, cancelUrl } = await req.json();

  try {
    // 1. Get or create a Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") { // Ignore "not found" error
      throw profileError;
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError) throw userError;

      const customer = await stripe.customers.create({
        email: user.user.email,
        metadata: { supabase_id: userId },
      });

      customerId = customer.id;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);

      if (updateError) throw updateError;
    }

    // 2. Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"],
      customer: customerId,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});