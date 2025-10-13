import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.23.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15'
});

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

async function verifyStripeSignature(payload, signature, secret) {
  const [tPart, v1Part] = signature.split(',').map((part)=>part.trim());
  const timestamp = tPart.substring(2);
  const signatureHash = v1Part.substring(3);
  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer)).map((b)=>b.toString(16).padStart(2, '0')).join('');
  return expectedSignature === signatureHash;
}

serve(async (req)=>{
  const signature = req.headers.get('stripe-signature');
  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  try {
    const body = await req.text();
    const isSignatureValid = await verifyStripeSignature(body, signature, webhookSecret);
    if (!isSignatureValid) {
      console.error('Webhook error: Invalid signature');
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);
    console.log(`Processing webhook event: ${event.type}`);

    switch(event.type){
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});

// --- MODIFICADO: Lida com pagamentos síncronos e assíncronos ---
async function handleCheckoutSessionCompleted(session) {
  // Para pagamentos assíncronos como boleto, o status será 'unpaid' aqui.
  // Para pagamentos com cartão, será 'paid'.
  if (session.payment_status === 'paid') {
    // Lógica original para pagamentos imediatos (cartão de crédito)
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const userId = subscription.metadata.supabase_user_id;

    if (!userId) {
      console.error('No user_id in subscription metadata for session:', session.id);
      return;
    }

    const { error } = await supabase.from('profiles').update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status, // será 'active'
      subscription_tier: 'scout',
      current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString()
    }).eq('id', userId);

    if (error) {
      console.error('Error updating profile for immediate payment:', error);
    } else {
      console.log(`Subscription created immediately for user ${userId}`);
    }
  } else if (session.payment_status === 'unpaid') {
    // --- ADICIONADO: Lógica para pagamentos pendentes (Boleto) ---
    // A assinatura já foi criada, mas está aguardando pagamento.
    // Apenas registramos o status inicial.
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const userId = subscription.metadata.supabase_user_id;

     if (!userId) {
      console.error('No user_id in subscription metadata for pending session:', session.id);
      return;
    }

    // Marcamos a assinatura como 'incomplete' ou 'pending'
    const { error } = await supabase.from('profiles').update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: subscription.id,
      subscription_status: 'incomplete', // ou 'pending_payment'
      subscription_tier: 'scout', // Já podemos definir o tier
      updated_at: new Date().toISOString()
    }).eq('id', userId);

    if (error) {
        console.error('Error marking profile as pending:', error);
    } else {
        console.log(`Subscription pending for user ${userId}. Waiting for boleto payment.`);
    }
  }
}

async function handleSubscriptionUpdated(subscription) {
  const { error } = await supabase.from('profiles').update({
    subscription_status: subscription.status,
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString()
  }).eq('stripe_subscription_id', subscription.id);
  if (error) {
    console.error('Error updating subscription:', error);
  } else {
    console.log(`Subscription updated: ${subscription.id}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const { error } = await supabase.from('profiles').update({
    subscription_status: 'canceled',
    subscription_tier: 'free',
    updated_at: new Date().toISOString()
  }).eq('stripe_subscription_id', subscription.id);
  if (error) {
    console.error('Error canceling subscription:', error);
  } else {
    console.log(`Subscription canceled: ${subscription.id}`);
  }
}

// --- MODIFICADO: Ativa a assinatura quando o pagamento do boleto é confirmado ---
async function handlePaymentSucceeded(invoice) {
  // Este evento é crucial para boletos. Ele confirma que o dinheiro foi recebido.
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    console.log(`Invoice ${invoice.id} is not associated with a subscription. Ignoring.`);
    return; // Ignora pagamentos que não são de uma assinatura
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Atualiza o perfil do usuário para o status ativo.
  const { error } = await supabase.from('profiles').update({
    subscription_status: subscription.status, // Agora será 'active'
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString()
  }).eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error(`Error activating subscription ${subscriptionId} after payment:`, error);
  } else {
    console.log(`Subscription ${subscriptionId} activated following successful payment.`);
  }
}

async function handlePaymentFailed(invoice) {
  console.log(`Payment failed for subscription: ${invoice.subscription}`);
  // Opcional: atualizar o status no Supabase para 'past_due' ou similar.
  const { error } = await supabase.from('profiles').update({
    subscription_status: 'past_due'
  }).eq('stripe_subscription_id', invoice.subscription);

  if (error) {
    console.error('Error updating profile on payment failure:', error);
  }
}
