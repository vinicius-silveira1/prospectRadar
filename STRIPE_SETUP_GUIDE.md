# 💳 **GUIA DE CONFIGURAÇÃO DO STRIPE**

## 🎯 **Status Atual**
- ✅ Funções Supabase criadas e deployadas
- ✅ Frontend preparado com graceful degradation
- ✅ Hooks e serviços implementados
- ⏳ Aguardando configuração das chaves Stripe

## 🔑 **Configuração das Chaves Stripe**

### **1. Criar Conta Stripe**
1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta
3. Ative o modo de teste
4. Vá para **Developers > API Keys**

### **2. Obter Chaves**
```bash
# Chaves necessárias:
Publishable Key: pk_test_...
Secret Key: sk_test_...
Webhook Secret: whsec_... (será criado no passo 4)
```

### **3. Configurar Produtos**
1. Vá para **Products** no dashboard
2. **Create Product**:
   - Name: "ProspectRadar Scout"
   - Price: R$ 19,90/month
   - Recurring: Monthly
3. Copie o **Price ID** (price_...)

### **4. Configurar Webhook**
1. Vá para **Developers > Webhooks**
2. **Add endpoint**:
   - URL: `https://thypaxyxqvpsaonwatrb.supabase.co/functions/v1/webhook-stripe`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. Copie o **Signing Secret** (whsec_...)

### **5. Atualizar Variáveis de Ambiente**

#### **Frontend (.env)**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
```

#### **Supabase (Dashboard > Settings > Edge Functions)**
```bash
STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_aqui
```

### **6. Atualizar Price ID no Código**
No arquivo `src/pages/Pricing.jsx`, linha ~25:
```jsx
await createCheckoutSession(
  'price_SEU_PRICE_ID_AQUI', // ← Substitua aqui
  user.id
);
```

## 🗃️ **Configuração do Banco de Dados**

✅ **Já configurado!** A migration foi aplicada com sucesso.

Sua tabela `profiles` agora tem as colunas necessárias:
- `stripe_customer_id` - ID do cliente no Stripe
- `stripe_subscription_id` - ID da assinatura
- `subscription_status` - Status da assinatura (active/canceled/etc)
- `subscription_tier` - Plano atual (free/scout)
- `current_period_end` - Data de vencimento

### **Verificar Estrutura (opcional):**
Execute no **SQL Editor** do Supabase para verificar:
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('stripe_customer_id', 'stripe_subscription_id', 'subscription_status', 'subscription_tier')
ORDER BY column_name;
```

## ✅ **Teste do Sistema**

### **Fluxo Completo:**
1. Usuário clica "Fazer Upgrade"
2. Redirecionado para Stripe Checkout
3. Preenche dados do cartão (use cartões de teste)
4. Webhook processa pagamento
5. Usuário vira Scout automaticamente

### **Cartões de Teste:**
```bash
# Sucesso
4242 4242 4242 4242 (Visa)
4000 0566 5566 5556 (Visa - Brasil)

# Falha
4000 0000 0000 0002 (Declined)
```

## 🎯 **Próximos Passos**

Após configurar Stripe:
1. **Testar fluxo completo** com cartão de teste
2. **Verificar webhooks** no dashboard Stripe
3. **Implementar página de sucesso** (`/success`)
4. **Adicionar billing portal** para usuários gerenciarem assinatura
5. **Configurar emails** de boas-vindas

## 💡 **Dicas Importantes**

- **Sempre use modo teste** até estar 100% pronto
- **Teste todos os cenários**: sucesso, falha, cancelamento
- **Monitore logs** das Edge Functions no Supabase
- **Configure Rate Limiting** no Stripe (Dashboard > Settings)

## 🚨 **Antes de ir ao Live**

- [ ] Todos os fluxos testados
- [ ] Webhooks funcionando perfeitamente
- [ ] Emails de confirmação configurados
- [ ] Política de reembolso definida
- [ ] Termos de serviço atualizados
- [ ] Mudar para chaves de produção

---

**🎉 Quando estiver pronto, você terá um sistema de pagamento profissional funcionando!**
