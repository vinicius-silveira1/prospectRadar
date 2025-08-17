# 🛠️ Solução Temporária para Problemas de DNS

## 🎯 **PROBLEMA IDENTIFICADO:**
- `m.stripe.com` não resolve (ERR_NAME_NOT_RESOLVED)
- Edge Function com timeout (problema de conectividade)

## ⚡ **SOLUÇÕES IMEDIATAS:**

### **1. Configurar DNS (RECOMENDADO)**
```
1. Windows + R > "ncpa.cpl"
2. Clique com direito na sua conexão > Propriedades
3. IPv4 > Propriedades
4. "Usar os seguintes endereços de servidor DNS"
5. DNS preferencial: 8.8.8.8
6. DNS alternativo: 8.8.4.4
7. OK e reiniciar navegador
```

### **2. Usar Hosts File (TEMPORÁRIO)**
Execute no PowerShell como Administrador:
```powershell
# Adicionar entradas ao hosts file
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "151.101.1.49 m.stripe.com"
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "18.244.123.114 js.stripe.com"
ipconfig /flushdns
```

### **3. Teste Após Configuração**
```powershell
# Testar DNS
nslookup m.stripe.com 8.8.8.8
nslookup js.stripe.com 8.8.8.8

# Testar conectividade
curl https://m.stripe.com
curl https://js.stripe.com/v3/
```

## 🔄 **SE AINDA NÃO FUNCIONAR:**

### **Opção A: Usar VPN**
1. Conectar a uma VPN confiável
2. Testar novamente

### **Opção B: Hotspot Mobile**
1. Usar internet do celular temporariamente
2. Verificar se problema é da rede

### **Opção C: Continuar com Mock**
O sistema mock está implementado e funcional!

## 🧪 **SCRIPT DE TESTE COMPLETO**

Execute após configurar DNS:
```powershell
# Teste completo após configuração
Write-Host "🧪 TESTE PÓS-CONFIGURAÇÃO" -ForegroundColor Yellow

# Teste DNS
try { 
    $dns = Resolve-DnsName m.stripe.com -Server 8.8.8.8
    Write-Host "✅ DNS m.stripe.com: OK" -ForegroundColor Green
} catch { 
    Write-Host "❌ DNS m.stripe.com: FALHOU" -ForegroundColor Red
}

# Teste conectividade
try { 
    $web = Invoke-WebRequest "https://m.stripe.com" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Web m.stripe.com: OK" -ForegroundColor Green
} catch { 
    Write-Host "❌ Web m.stripe.com: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste Edge Function
try { 
    $headers = @{
        'Content-Type' = 'application/json'
        'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeXBheHl4cXZwc2FvbndhdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDUyNDIsImV4cCI6MjA2OTEyMTI0Mn0.aV817dd2opuRL3pLCf7M93O-dbf6t5hJNGwAkLE3fKc'
        'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeXBheHl4cXZwc2FvbndhdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDUyNDIsImV4cCI6MjA2OTEyMTI0Mn0.aV817dd2opuRL3pLCf7M93O-dbf6t5hJNGwAkLE3fKc'
    }
    $response = Invoke-WebRequest -Uri "https://thypaxyxqvpsaonwatrb.supabase.co/functions/v1/create-checkout-session" -Method POST -Headers $headers -Body '{"test":"pos-config"}' -TimeoutSec 15 -UseBasicParsing
    Write-Host "✅ Edge Function: OK ($($response.StatusCode))" -ForegroundColor Green
    Write-Host "Response: $($response.Content.Substring(0, 100))..." -ForegroundColor Gray
} catch { 
    Write-Host "❌ Edge Function: $($_.Exception.Message)" -ForegroundColor Red
}
```

## 🎯 **PRÓXIMOS PASSOS:**

1. **Configure DNS primeiro** (mais fácil)
2. **Execute o teste de verificação**
3. **Se funcionar**: Stripe real ativo!
4. **Se não funcionar**: Continue com mock (já funcional)

O sistema mock está perfeito para desenvolvimento e você pode continuar trabalhando normalmente!
