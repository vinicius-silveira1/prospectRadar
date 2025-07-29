/**
 * @fileoverview Script para baixar uma coleção inteira do Firestore e salvá-la como um arquivo JSON.
 * Uso: node ./functions/download-firestore-collection.js
 */

const admin = require("firebase-admin");
const fs = require("fs");

// IMPORTANTE: Certifique-se de que sua nova chave privada foi renomeada para 'serviceAccountKey.json'
// e está nesta mesma pasta (functions).
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const collectionName = "prospects";
const outputFileName = "firestore-backup.json";

async function downloadCollection() {
  console.log(`Iniciando o download da coleção '${collectionName}'...`);

  try {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log(`A coleção '${collectionName}' está vazia ou não foi encontrada.`);
      return;
    }

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    fs.writeFileSync(`./functions/${outputFileName}`, JSON.stringify(data, null, 2));
    console.log(`✅ Download concluído! ${data.length} documentos foram salvos em './functions/${outputFileName}'`);
  } catch (error) {
    console.error("❌ Erro durante o download:", error);
  }
}

downloadCollection();