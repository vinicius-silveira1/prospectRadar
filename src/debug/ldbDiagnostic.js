/**
 * 🔍 TESTE DIAGNÓSTICO LDB - Conectividade
 * 
 * Este script testa diretamente a conectividade com a LDB
 * para identificar onde está o problema
 */

// Função para testar conectividade básica
async function testLDBConnectivity() {
  console.log('🔄 Testando conectividade com LDB...');
  
  try {
    // Teste 1: Verificar se a URL da LDB está acessível
    const response = await fetch('https://lnb.com.br/ldb/atletas/', {
      method: 'GET',
      headers: {
        'User-Agent': 'ProspectRadar/1.0 Test',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.5'
      }
    });
    
    console.log(`📊 Status HTTP: ${response.status}`);
    console.log(`📄 Tipo de conteúdo: ${response.headers.get('content-type')}`);
    
    if (response.ok) {
      const html = await response.text();
      console.log(`✅ Conectividade OK - ${html.length} caracteres recebidos`);
      console.log(`🔍 Preview: ${html.substring(0, 300)}...`);
      
      // Análise simples do HTML
      const hasAtletasText = html.toLowerCase().includes('atletas');
      const hasPlayerText = html.toLowerCase().includes('player');
      const hasJogadorText = html.toLowerCase().includes('jogador');
      
      console.log(`📋 Contém "atletas": ${hasAtletasText}`);
      console.log(`📋 Contém "player": ${hasPlayerText}`);
      console.log(`📋 Contém "jogador": ${hasJogadorText}`);
      
      return {
        success: true,
        status: response.status,
        htmlLength: html.length,
        hasRelevantContent: hasAtletasText || hasPlayerText || hasJogadorText
      };
    } else {
      console.log(`❌ Falha HTTP: ${response.status} - ${response.statusText}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
    
  } catch (error) {
    console.error('❌ Erro de conectividade:', error.message);
    
    // Diagnóstico do tipo de erro
    if (error.message.includes('CORS')) {
      console.log('🚫 Problema: CORS policy blocking request');
      console.log('💡 Solução: Implementar proxy ou server-side scraping');
    } else if (error.message.includes('network')) {
      console.log('🌐 Problema: Falha de rede ou conectividade');
    } else if (error.message.includes('fetch')) {
      console.log('🔌 Problema: Fetch API não disponível ou bloqueado');
    }
    
    return { success: false, error: error.message };
  }
}

// Função para testar integração completa
async function testLDBIntegration() {
  console.log('🚀 Iniciando teste completo da integração LDB...');
  
  try {
    // Import dinâmico do serviço (caminho correto)
    const { fetchRealLDBAthletes } = await import('../services/realLDBService.js');
    
    console.log('📦 Serviço LDB carregado com sucesso');
    
    // Teste da função principal
    const athletes = await fetchRealLDBAthletes();
    
    console.log(`✅ Integração funcionando: ${athletes.length} atletas`);
    
    if (athletes.length > 0) {
      console.log('📋 Primeiro atleta:', athletes[0]);
      console.log('🎯 Todos os atletas têm source:', athletes.every(a => a.source));
      
      const realLDBAthletes = athletes.filter(a => a.source?.includes('LDB') && !a.source?.includes('Fallback'));
      console.log(`🔴 Atletas REAIS da LDB: ${realLDBAthletes.length}`);
      console.log(`📋 Atletas FALLBACK: ${athletes.length - realLDBAthletes.length}`);
      
      return {
        success: true,
        totalAthletes: athletes.length,
        realLDBAthletes: realLDBAthletes.length,
        fallbackAthletes: athletes.length - realLDBAthletes.length,
        sampleAthlete: athletes[0]
      };
    } else {
      console.log('⚠️ Nenhum atleta retornado - verificar implementação');
      return { success: false, error: 'No athletes returned' };
    }
    
  } catch (error) {
    console.error('❌ Erro na integração:', error.message);
    return { success: false, error: error.message };
  }
}

// Função para verificar configuração do ambiente
function checkEnvironment() {
  console.log('🔍 Verificando configuração do ambiente...');
  
  const useRealData = import.meta?.env?.VITE_USE_REAL_DATA;
  const nodeEnv = import.meta?.env?.VITE_NODE_ENV;
  
  console.log(`📋 VITE_USE_REAL_DATA: ${useRealData}`);
  console.log(`📋 VITE_NODE_ENV: ${nodeEnv}`);
  console.log(`📋 Development mode: ${import.meta?.env?.DEV}`);
  
  const isConfiguredForRealData = useRealData === 'true';
  
  if (!isConfiguredForRealData) {
    console.log('⚠️ AVISO: Aplicação não está configurada para usar dados reais');
    console.log('💡 Solução: Definir VITE_USE_REAL_DATA=true no .env');
  }
  
  return {
    useRealData,
    nodeEnv,
    isConfiguredForRealData,
    isDev: import.meta?.env?.DEV
  };
}

// Função completa de diagnóstico
async function fullLDBDiagnostic() {
  console.log('🩺 DIAGNÓSTICO COMPLETO LDB');
  console.log('=====================================');
  
  // 1. Verificar ambiente
  console.log('\n1️⃣ Verificando ambiente...');
  const envCheck = checkEnvironment();
  
  // 2. Testar conectividade
  console.log('\n2️⃣ Testando conectividade...');
  const connectivityTest = await testLDBConnectivity();
  
  // 3. Testar integração
  console.log('\n3️⃣ Testando integração...');
  const integrationTest = await testLDBIntegration();
  
  // 4. Relatório final
  console.log('\n📊 RELATÓRIO FINAL');
  console.log('=====================================');
  console.log('Ambiente:', envCheck.isConfiguredForRealData ? '✅ OK' : '❌ Incorreto');
  console.log('Conectividade:', connectivityTest.success ? '✅ OK' : '❌ Falhou');
  console.log('Integração:', integrationTest.success ? '✅ OK' : '❌ Falhou');
  
  if (integrationTest.success) {
    console.log(`\n🎯 RESULTADO: ${integrationTest.realLDBAthletes} atletas reais da LDB`);
    if (integrationTest.realLDBAthletes === 0) {
      console.log('⚠️ AVISO: Sistema está funcionando mas usando dados fallback');
      console.log('💡 Possível causa: Site da LDB mudou estrutura HTML');
    }
  }
  
  return {
    environment: envCheck,
    connectivity: connectivityTest,
    integration: integrationTest
  };
}

// Exportar funções para uso no console
window.testLDBConnectivity = testLDBConnectivity;
window.testLDBIntegration = testLDBIntegration;
window.fullLDBDiagnostic = fullLDBDiagnostic;

console.log('🔧 Funções de debug disponíveis:');
console.log('- testLDBConnectivity()');
console.log('- testLDBIntegration()');
console.log('- fullLDBDiagnostic()');
