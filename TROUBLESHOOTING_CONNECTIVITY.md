# 🔧 Guia de Resolução de Problemas de Conectividade

## 🎯 **Problemas Identificados:**

1. **`ERR_NAME_NOT_RESOLVED` para `m.stripe.com`** - DNS/Conectividade
2. **Edge Function não responde** - Timeout ou erro interno
3. **Possível interferência de Firewall/Antivírus**

## 🔍 **Testes de Diagnóstico**

### **Teste 1: Conectividade Básica**
Execute no PowerShell:
```powershell
Test-NetConnection js.stripe.com -Port 443
Test-NetConnection thypaxyxqvpsaonwatrb.supabase.co -Port 443
nslookup js.stripe.com
nslookup m.stripe.com
```

### **Teste 2: Verificar DNS**
```powershell
# Limpar cache DNS
ipconfig /flushdns

# Testar diferentes DNS
nslookup js.stripe.com 8.8.8.8
nslookup m.stripe.com 1.1.1.1
```

### **Teste 3: Verificar Proxy/Firewall**
```powershell
# Verificar configurações de proxy
netsh winhttp show proxy

# Verificar se há interferência
curl -v https://js.stripe.com/v3/
```

## 🛠️ **Soluções Possíveis**

### **Solução 1: Configurar DNS Alternativo**
1. Vá em **Configurações de Rede**
2. **Propriedades da Conexão**
3. **IPv4 > Propriedades**
4. **Usar DNS**: `8.8.8.8` e `8.8.4.4`

### **Solução 2: Verificar Firewall/Antivírus**
1. **Temporariamente desabilitar** firewall do Windows
2. **Verificar configurações** do antivírus
3. **Adicionar exceções** para:
   - `*.stripe.com`
   - `*.supabase.co`
   - `localhost:5174`

### **Solução 3: Verificar Proxy Corporativo**
Se estiver em rede corporativa:
1. **Verificar configurações de proxy**
2. **Configurar exceções** para desenvolvimento
3. **Usar VPN** se necessário

### **Solução 4: Navegador**
1. **Testar em modo incógnito**
2. **Desabilitar extensões** temporariamente
3. **Limpar cache** e cookies
4. **Testar em outro navegador**

## 🧪 **Teste Rápido de Conectividade**

Execute este comando no PowerShell para teste completo:
```powershell
# Teste completo de conectividade
Write-Host "=== TESTE DE CONECTIVIDADE ===" -ForegroundColor Yellow
Write-Host "1. Testando Stripe JS..." -ForegroundColor Cyan
try { 
    $response = Invoke-WebRequest -Uri "https://js.stripe.com/v3/" -TimeoutSec 10
    Write-Host "✅ Stripe JS OK: $($response.StatusCode)" -ForegroundColor Green
} catch { 
    Write-Host "❌ Stripe JS FALHOU: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "2. Testando Stripe M..." -ForegroundColor Cyan
try { 
    $response = Invoke-WebRequest -Uri "https://m.stripe.com" -TimeoutSec 10
    Write-Host "✅ Stripe M OK: $($response.StatusCode)" -ForegroundColor Green
} catch { 
    Write-Host "❌ Stripe M FALHOU: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "3. Testando Supabase..." -ForegroundColor Cyan
try { 
    $response = Invoke-WebRequest -Uri "https://thypaxyxqvpsaonwatrb.supabase.co" -TimeoutSec 10
    Write-Host "✅ Supabase OK: $($response.StatusCode)" -ForegroundColor Green
} catch { 
    Write-Host "❌ Supabase FALHOU: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "4. Testando Edge Function..." -ForegroundColor Cyan
try { 
    $headers = @{
        'Content-Type' = 'application/json'
        'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeXBheHl4cXZwc2FvbndhdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDUyNDIsImV4cCI6MjA2OTEyMTI0Mn0.aV817dd2opuRL3pLCf7M93O-dbf6t5hJNGwAkLE3fKc'
        'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeXBheHl4cXZwc2FvbndhdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDUyNDIsImV4cCI6MjA2OTEyMTI0Mn0.aV817dd2opuRL3pLCf7M93O-dbf6t5hJNGwAkLE3fKc'
    }
    $body = '{"test":"connectivity"}'
    $response = Invoke-WebRequest -Uri "https://thypaxyxqvpsaonwatrb.supabase.co/functions/v1/create-checkout-session" -Method POST -Headers $headers -Body $body -TimeoutSec 10
    Write-Host "✅ Edge Function OK: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch { 
    Write-Host "❌ Edge Function FALHOU: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "=== FIM DO TESTE ===" -ForegroundColor Yellow
```

## 📋 **Próximos Passos**

1. **Execute o teste de conectividade** acima
2. **Me envie os resultados** para análise
3. **Tentaremos as soluções** baseadas nos resultados
4. **Se necessário**, implementaremos **workarounds** específicos

## 🎯 **Resultado Esperado**

Com conectividade funcionando, você deve ver:
- ✅ Todos os testes passando
- ✅ Edge Function respondendo
- ✅ Stripe carregando normalmente
