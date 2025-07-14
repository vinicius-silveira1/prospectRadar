/**
 * TESTE MANUAL DA INTEGRAÇÃO LDB
 * 
 * Este arquivo permite testar manualmente a coleta da LDB
 * para diagnóstico de problemas.
 */

import { fetchRealLDBAthletes, getLDBSystemHealth } from '../services/realLDBService.js';

// Função de teste que pode ser chamada no console do navegador
window.testLDBIntegration = async () => {
  console.log('🧪 INICIANDO TESTE DA INTEGRAÇÃO LDB...');
  console.log('=====================================');
  
  try {
    // 1. Verificar saúde do sistema
    console.log('📊 1. Verificando saúde do sistema...');
    const health = getLDBSystemHealth();
    console.log('✅ Sistema LDB:', health);
    
    // 2. Tentar coleta real
    console.log('\n🔍 2. Tentando coleta real da LDB...');
    const startTime = Date.now();
    
    const athletes = await fetchRealLDBAthletes();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️ Tempo de coleta: ${duration}ms`);
    console.log(`📊 Atletas coletados: ${athletes?.length || 0}`);
    
    if (athletes && athletes.length > 0) {
      console.log('✅ SUCESSO! Dados reais coletados da LDB');
      console.log('👤 Primeiro atleta:', athletes[0]);
      
      // Analisa qualidade dos dados
      const withStats = athletes.filter(a => a.stats && Object.keys(a.stats).length > 0);
      const withImages = athletes.filter(a => a.imageUrl);
      const withTeams = athletes.filter(a => a.team || a.school);
      
      console.log('\n📈 ANÁLISE DE QUALIDADE:');
      console.log(`🏀 Com estatísticas: ${withStats.length}/${athletes.length}`);
      console.log(`🖼️ Com imagens: ${withImages.length}/${athletes.length}`);
      console.log(`🏫 Com times: ${withTeams.length}/${athletes.length}`);
      
      return {
        success: true,
        count: athletes.length,
        duration,
        quality: {
          withStats: withStats.length,
          withImages: withImages.length,
          withTeams: withTeams.length
        },
        data: athletes
      };
      
    } else {
      console.log('⚠️ AVISO: Nenhum atleta coletado');
      console.log('💡 Possíveis causas:');
      console.log('   - Site da LNB mudou estrutura');
      console.log('   - Problemas de conectividade');
      console.log('   - Bloqueio CORS');
      console.log('   - Página não encontrada');
      
      return {
        success: false,
        count: 0,
        duration,
        error: 'Nenhum atleta encontrado'
      };
    }
    
  } catch (error) {
    console.error('❌ ERRO na integração LDB:', error);
    console.log('\n🔧 DIAGNÓSTICO:');
    console.log(`   Tipo: ${error.name}`);
    console.log(`   Mensagem: ${error.message}`);
    
    if (error.code === 'NETWORK_ERROR') {
      console.log('   🌐 Problema de rede detectado');
    } else if (error.message.includes('CORS')) {
      console.log('   🚫 Problema de CORS detectado');
    } else if (error.code === 'TIMEOUT') {
      console.log('   ⏰ Timeout na requisição');
    }
    
    return {
      success: false,
      count: 0,
      error: error.message,
      type: error.name
    };
  }
};

// Função para testar apenas a conectividade
window.testLDBConnectivity = async () => {
  console.log('🌐 TESTANDO CONECTIVIDADE COM LNB...');
  
  try {
    const response = await fetch('https://lnb.com.br/ldb/', { 
      method: 'HEAD',
      mode: 'no-cors' // Evita problemas de CORS no teste
    });
    
    console.log('✅ Site LNB acessível');
    return true;
    
  } catch (error) {
    console.log('❌ Site LNB inacessível:', error.message);
    return false;
  }
};

// Instruções para uso
console.log(`
🧪 COMANDOS DE TESTE DISPONÍVEIS:

# Teste completo da integração
testLDBIntegration()

# Teste simples de conectividade  
testLDBConnectivity()

# Verificar saúde do sistema
getLDBSystemHealth()

Abra o Console do navegador (F12) e execute os comandos acima.
`);

export { };  // Torna este um módulo ES6
