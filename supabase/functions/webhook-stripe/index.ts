import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Ainda precisaremos do Stripe para outras chamadas de API (recuperar assinatura, etc.)
// mas não usaremos seu webhook constructEventAsync
import Stripe from 'https://esm.sh/stripe@14.23.0?target=deno'; // Mantenha isso para outras chamadas de API do Stripe

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15', // Considere atualizar isso para 2023-10-16 para consistência
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

// --- NOVO: Função de verificação de assinatura de webhook manual ---
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const [tPart, v1Part] = signature.split(',').map(part => part.trim());
  const timestamp = tPart.substring(2); // Remover 't='
  const signatureHash = v1Part.substring(3); // Remover 'v1='

  const signedPayload = `${timestamp}.${payload}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload)
  );

  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return expectedSignature === signatureHash;
}
// --- FIM NOVO ---

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 })
  }

  try {
    const body = await req.text()

    // --- MODIFICADO: Usar verificação manual ---
    const isSignatureValid = await verifyStripeSignature(body, signature, webhookSecret);
    if (!isSignatureValid) {
      console.error('Webhook error: Invalid signature');
      return new Response('Invalid signature', { status: 400 });
    }
    // --- FIM MODIFICADO ---

    // Analisar o evento após a verificação de assinatura bem-sucedida
    const event = JSON.parse(body); // O corpo do webhook é JSON

    console.log(`Processing webhook event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error.message)
    // Retornar 400 para erros gerais durante o processamento
    return new Response(`Webhook error: ${error.message}`, { status: 400 })
  }
})

// Mantenha as funções handle como estão (com a correção current_period_end)
async function handleCheckoutSessionCompleted(session) {
  const customerId = session.customer;

  // Obter detalhes da assinatura primeiro para obter seus metadados
  const subscription = await stripe.subscriptions.retrieve(session.subscription);

  const userId = subscription.metadata.supabase_user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata for session:', session.id);
    return;
  }

  // Atualizar perfil do usuário com informações da assinatura
  const { error } = await supabase
    .from('profiles')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      subscription_tier: 'scout',
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile subscription:', error);
  } else {
    console.log(`Subscription created for user ${userId}`);
  }
}

async function handleSubscriptionUpdated(subscription) {
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
  } else {
    console.log(`Subscription updated: ${subscription.id}`)
  }
}

async function handleSubscriptionDeleted(subscription) {
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      subscription_tier: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error canceling subscription:', error)
  } else {
    console.log(`Subscription canceled: ${subscription.id}`)
  }
}

async function handlePaymentSucceeded(invoice) {
  // Registrar pagamento bem-sucedido
  console.log(`Payment succeeded for subscription: ${invoice.subscription}`)

  // Você pode adicionar o rastreamento do histórico de pagamentos aqui
}

async function handlePaymentFailed(invoice) {
  // Lidar com pagamento falho
  console.log(`Payment failed for subscription: ${invoice.subscription}`)

  // Você pode enviar e-mails de notificação aqui
}