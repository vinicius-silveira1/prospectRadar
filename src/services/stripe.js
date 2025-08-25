import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabaseClient';
import { createMockCheckoutSession, isMockMode } from './mockStripe';

// Initialize Stripe (only if keys are available)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise = null;
let stripeLoadError = false;

// Initialize Stripe with better error handling and DNS workaround
if (stripePublishableKey && !isMockMode()) {
  console.log('🔑 Inicializando Stripe com chave:', stripePublishableKey.substring(0, 12) + '...');
  
  // Configuração especial para contornar problemas de DNS
  stripePromise = loadStripe(stripePublishableKey, {
    stripeAccount: undefined,
    locale: 'pt-BR', // Força localização brasileira
  }).catch(error => {
    console.error('❌ Erro ao carregar Stripe:', error);
    console.warn('🚧 Ativando modo mock devido a erro de conectividade');
    stripeLoadError = true;
    return null;
  });
} else {
  console.warn('⚠️ Modo Mock ativado - Stripe real não disponível');
}

export const createCheckoutSession = async (priceId, userId) => {
  console.log('🔧 Stripe Service - Iniciando createCheckoutSession');
  console.log('📝 Price ID:', priceId);
  console.log('👤 User ID:', userId);
  console.log('🔑 Stripe Key configurada:', !!stripePublishableKey);
  console.log('🌍 Window origin:', window.location.origin);
  
  // Check if we should use mock mode
  if (isMockMode() || stripeLoadError) {
    console.log('🚧 Usando sistema de pagamento simulado');
    return createMockCheckoutSession(priceId, userId);
  }

  // Check if Stripe is properly configured
  if (!stripePublishableKey) {
    console.log('🚧 Stripe não configurado. Usando modo simulado...');
    return createMockCheckoutSession(priceId, userId);
  }

  // Validate inputs
  if (!priceId || !userId) {
    throw new Error('Price ID e User ID são obrigatórios');
  }

  try {
    console.log('🌐 Invocando função Supabase: create-checkout-session');
    
    // Call Supabase function with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: A função demorou mais de 10 segundos para responder')), 10000)
    );
    
    const functionPromise = supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        userId,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      },
    });

    const functionResponse = await Promise.race([functionPromise, timeoutPromise]);

    console.log('📤 Resposta completa da função:', functionResponse);

    const { data, error } = functionResponse;

    if (error) {
      console.error('❌ Erro da função Supabase:', error);
      throw new Error(`Erro na função: ${error.message || JSON.stringify(error)}`);
    }

    if (!data) {
      console.error('❌ Nenhum dado retornado da função');
      throw new Error('Nenhum dado retornado da função Supabase');
    }

    console.log('📋 Data recebida:', data);

    if (data.error) {
      console.error('❌ Erro reportado pela função:', data.error);
      throw new Error(`Erro da Edge Function: ${data.error}`);
    }

    if (!data.sessionId) {
      console.error('❌ Session ID não encontrado na resposta:', data);
      throw new Error('Session ID não retornado pela função');
    }

    console.log('🎯 Session ID recebido:', data.sessionId);
    
    // Load and verify Stripe
    console.log('🔄 Carregando Stripe...');
    const stripe = await stripePromise;
    
    if (!stripe) {
      console.error('❌ Stripe não foi carregado');
      throw new Error('Stripe não foi carregado corretamente');
    }

    console.log('✅ Stripe carregado com sucesso');
    console.log('🚀 Redirecionando para Stripe Checkout...');

    // Redirect to Stripe Checkout
    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (stripeError) {
      console.error('❌ Erro do Stripe durante redirect:', stripeError);
      throw new Error(`Erro do Stripe: ${stripeError.message}`);
    }

    console.log('✅ Redirecionamento bem-sucedido');
  } catch (error) {
    console.error('❌ Erro geral em createCheckoutSession:', error);
    
    // Fallback para modo mock se houver problemas de conectividade
    if (error.message.includes('Timeout') || error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      console.log('🚧 Erro de conectividade detectado. Ativando modo simulado...');
      return createMockCheckoutSession(priceId, userId);
    }
    
    throw error;
  }
};

export const createPortalSession = async (userId) => {
  if (!stripePublishableKey) {
    console.log('🚧 Stripe Portal não configurado ainda');
    alert('🚧 Portal de billing em desenvolvimento!');
    return;
  }

  try {
    // Get customer ID from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      throw new Error('Customer ID not found');
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        customerId: profile.stripe_customer_id,
        returnUrl: `${window.location.origin}/settings`,
      },
    });

    if (error) throw error;

    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, stripe_customer_id, current_period_end')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data || null;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return null;
  }
};
