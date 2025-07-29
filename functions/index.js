const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getLatestStats } = require("./services/statsService");

// Inicializa o SDK do Firebase Admin para poder interagir com o Firestore.
admin.initializeApp();
const db = admin.firestore();

exports.updateProspectStats = functions.region("southamerica-east1") // Opcional: Especifique a região mais próxima
    .pubsub.schedule("every 24 hours")
    .onRun(async (_context) => {
      console.log("Iniciando a tarefa agendada: updateProspectStats");

      const prospectsRef = db.collection("prospects");
      const snapshot = await prospectsRef.get();

      if (snapshot.empty) {
        console.log("Nenhum prospect encontrado. Encerrando a função.");
        return null;
      }

      let updatedCount = 0;
      const updatePromises = [];

      // Itera sobre cada documento de prospect
      snapshot.forEach((doc) => {
        const prospectData = doc.data();
        const prospectName = prospectData.name;

        // Cria uma promessa para buscar e atualizar os dados de cada prospect
        const updatePromise = getLatestStats(prospectName)
            .then((latestStats) => {
              if (latestStats) {
                console.log(`Atualizando stats para ${prospectName} no Firestore.`);
                updatedCount++;
                // Retorna a promessa de atualização do documento
                return doc.ref.update({ stats: latestStats });
              }
              return Promise.resolve(); // Retorna uma promessa resolvida se não houver stats
            })
            .catch((error) => {
              console.error(`Erro ao processar ${prospectName}:`, error);
            });

        updatePromises.push(updatePromise);
      });

      // Espera todas as atualizações serem concluídas
      await Promise.all(updatePromises);

      const summary = `Tarefa concluída. Total de prospects: ${snapshot.size}. Prospects atualizados: ${updatedCount}.`;
      console.log(summary);
      return null;
    });
