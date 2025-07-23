import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Importe seus dados locais. O caminho pode precisar de ajuste.
// Com base nos seus commits, parece que você tem um serviço que já combina os dados.
// Se não, você pode importar os arrays de dados brutos diretamente.
import Draft2026Database from '../services/Draft2026Database.js'; // Apenas o serviço principal é necessário agora.

// Importe a chave da conta de serviço que você baixou.
// A sintaxe "assert { type: 'json' }" não é suportada em todas as versões do Node.js.
// A forma mais compatível é ler o arquivo e fazer o parse manualmente.
const serviceAccount = JSON.parse(readFileSync(new URL('../../firebase-service-account.json', import.meta.url)));
// Inicialize o Firebase Admin App
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
// Habilita a opção para ignorar campos com valor 'undefined'.
// Isso corrige o erro "Cannot use "undefined" as a Firestore value".
db.settings({
  ignoreUndefinedProperties: true
});

async function migrateData() {
  console.log('Iniciando a migração de dados para o Firestore...');

  // 1. Obtenha a lista final de prospects do serviço principal.
  // Com base nos seus commits, o Draft2026Database agora combina todos os dados.
  const draftService = new Draft2026Database();

  // O método mais provável para obter todos os dados é 'getAllProspects'.
  const finalProspects = draftService.getAllProspects();

  // Adicionando uma verificação para garantir que os dados foram carregados corretamente.
  if (!finalProspects || typeof finalProspects.forEach !== 'function') {
    console.error('❌ Erro: Não foi possível obter um array de prospects do serviço.');
    console.error("   Verifique o nome do método (ex: getAllProspects, getProspects) ou propriedade (ex: prospects) em 'src/services/Draft2026Database.js'.");
    return; // Interrompe a execução se os dados não forem um array.
  }

  console.log(`Total de ${finalProspects.length} prospects únicos para migrar.`);

  // 2. Escreva os dados em lote (batch)
  const prospectsCollection = db.collection('prospects');
  const batch = db.batch();

  for (const prospect of finalProspects) {
    if (prospect && prospect.name) {
      // Usamos o nome do prospect em minúsculas e sem espaços como ID do documento
      const docId = prospect.name.toLowerCase().replace(/\s+/g, '-');
      const docRef = prospectsCollection.doc(docId);
      batch.set(docRef, prospect);
    }
  }

  // 3. Commit o lote para o banco de dados
  try {
    await batch.commit();
    console.log('✅ Migração concluída com sucesso!');
    console.log(`${finalProspects.length} prospects foram adicionados à coleção "prospects".`);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

migrateData();