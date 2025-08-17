// 🚧 Sistema de Pagamento Mock para Desenvolvimento
// Este arquivo simula o comportamento do Stripe para testes locais

export const createMockCheckoutSession = async (priceId, userId) => {
  console.log('🚧 MODO DESENVOLVIMENTO - Simulando pagamento Stripe');
  console.log('📝 Price ID:', priceId);
  console.log('👤 User ID:', userId);
  
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular criação de sessão bem-sucedida
  const mockSessionId = `cs_test_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const mockCheckoutUrl = `https://checkout.stripe.com/c/pay/${mockSessionId}`;
  
  console.log('✅ Mock session criada:', mockSessionId);
  
  // Em vez de redirecionar para Stripe, mostrar um modal de simulação
  return showMockPaymentModal(mockSessionId, mockCheckoutUrl);
};

const showMockPaymentModal = (sessionId, checkoutUrl) => {
  return new Promise((resolve) => {
    // Criar modal de simulação
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem;">💳</div>
        <h2 style="margin: 0 0 1rem 0; color: #1f2937;">Simulação de Pagamento Stripe</h2>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">
          Esta é uma simulação para desenvolvimento.<br>
          <strong>Nenhum pagamento real será processado.</strong>
        </p>
        
        <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <div><strong>Plano:</strong> ProspectRadar Scout</div>
          <div><strong>Valor:</strong> R$ 19,90/mês</div>
          <div><strong>Session ID:</strong> <code style="font-size: 0.8rem;">${sessionId}</code></div>
        </div>
        
        <div style="display: flex; gap: 1rem;">
          <button id="mockSuccess" style="
            flex: 1;
            background: #10b981;
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          ">✅ Simular Sucesso</button>
          
          <button id="mockCancel" style="
            flex: 1;
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          ">❌ Simular Cancelamento</button>
        </div>
        
        <p style="font-size: 0.8rem; color: #9ca3af; margin-top: 1rem;">
          💡 Para usar o Stripe real, configure as chaves no arquivo .env
        </p>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handlers dos botões
    const successBtn = modal.querySelector('#mockSuccess');
    const cancelBtn = modal.querySelector('#mockCancel');
    
    successBtn.onclick = () => {
      document.body.removeChild(modal);
      console.log('🎉 Simulação: Pagamento bem-sucedido!');
      
      // Simular upgrade do usuário
      simulateUserUpgrade();
      
      // Redirecionar para página de sucesso
      window.location.href = '/success?mock=true';
      resolve({ success: true, mock: true });
    };
    
    cancelBtn.onclick = () => {
      document.body.removeChild(modal);
      console.log('❌ Simulação: Pagamento cancelado');
      resolve({ success: false, mock: true, canceled: true });
    };
    
    // Fechar com ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        cancelBtn.click();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  });
};

const simulateUserUpgrade = async () => {
  console.log('🔄 Simulando upgrade do usuário...');
  
  try {
    // Simular chamada para atualizar status do usuário
    const { supabase } = await import('./supabaseClient');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Atualizar perfil para Scout (simulado)
      await supabase
        .from('profiles')
        .update({ 
          subscription_status: 'active',
          subscription_tier: 'scout',
          // Simular dados do Stripe
          stripe_customer_id: `cus_mock_${Date.now()}`,
          stripe_subscription_id: `sub_mock_${Date.now()}`,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', user.id);
      
      console.log('✅ Usuário atualizado para Scout (simulado)');
    }
  } catch (error) {
    console.warn('⚠️ Erro ao simular upgrade:', error);
  }
};

export const isMockMode = () => {
  // Verificar se estamos em modo mock (sem chaves Stripe válidas ou com problemas de conectividade)
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  return !stripeKey || stripeKey.includes('mock') || window.location.hostname === 'localhost';
};
