# 🧪 **TESTE DO SISTEMA SEM STRIPE**

Como ainda não configuramos o Stripe, você pode testar as funcionalidades premium manualmente:

## **1. Simular Usuário Scout**

No **SQL Editor** do Supabase, execute:

```sql
-- Substitua 'SEU_USER_ID_AQUI' pelo ID do seu usuário
UPDATE profiles 
SET subscription_tier = 'scout'
WHERE id = 'SEU_USER_ID_AQUI';
```

**Para encontrar seu User ID:**
1. Faça login na aplicação
2. Abra o DevTools (F12)
3. Console → digite: `supabase.auth.getUser()`
4. Copie o `id` do usuário

## **2. Verificar Funcionalidades Desbloqueadas**

Após atualizar para Scout, você deve ter acesso a:

✅ **Página Prospects:**
- Filtros avançados (altura, peso, stats, badges)
- Todos os filtros funcionando

✅ **Página ProspectDetail:**
- Gráfico do Radar Score
- Comparações com jogadores NBA
- Análise detalhada do jogador

✅ **Mock Draft:**
- Saves ilimitados

## **3. Voltar para Free**

Para testar a versão gratuita novamente:

```sql
UPDATE profiles 
SET subscription_tier = 'free'
WHERE id = 'SEU_USER_ID_AQUI';
```

## **4. Estados para Testar**

```sql
-- Scout ativo
UPDATE profiles SET subscription_tier = 'scout', subscription_status = 'active';

-- Scout cancelado (ainda tem acesso até o fim do período)
UPDATE profiles SET subscription_tier = 'scout', subscription_status = 'canceled';

-- Free
UPDATE profiles SET subscription_tier = 'free', subscription_status = 'inactive';
```

---

**💡 Isso permite testar toda a UX premium antes de configurar pagamentos!**
