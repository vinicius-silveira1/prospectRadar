/**
 * @fileoverview Script para migrar dados de um backup JSON do Firestore para o Supabase.
 * Este script assume que o arquivo 'firestore-backup.json' está na mesma pasta.
 * Uso: node ./functions/migrate-from-backup-to-supabase.js
 */

const { createClient } = require("@supabase/supabase-js");
const prospectsData = require("./firestore-backup.json");

// IMPORTANTE: Substitua com as suas chaves do Supabase.
// Você pode encontrá-las em Project Settings > API no seu painel do Supabase.
// NUNCA exponha a service_role_key no frontend. Use apenas para scripts de backend.
const SUPABASE_URL = "https://thypaxyxqvpsaonwatrb.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeXBheHl4cXZwc2FvbndhdHJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzU0NTI0MiwiZXhwIjoyMDY5MTIxMjQyfQ.BIFa8l1ewsVMzry5GY5ksh7JbmciYSJNpJTsj6GtfR8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrateData() {
  console.log("Iniciando a migração de dados do backup JSON para o Supabase...");

  if (!prospectsData || prospectsData.length === 0) {
    console.log("Nenhum prospect encontrado no arquivo de backup para migrar.");
    return;
  }

  // O Supabase é mais rigoroso com tipos de dados. Vamos garantir que os campos
  // que podem ser objetos ou arrays (JSONB, TEXT[]) não sejam nulos.
  const formattedProspects = prospectsData.map((p) => {
    const prospect = { ...p };

    // CORREÇÃO: Se um prospect tiver um campo 'college', renomeie-o para 'school'
    // para corresponder à coluna do banco de dados.
    if (prospect.college) {
      prospect.school = prospect.college;
      delete prospect.college;
    }

    // Garante que os campos JSON/array não sejam nulos.
    prospect.height = prospect.height || {};
    prospect.stats = prospect.stats || {};
    prospect.displayInfo = prospect.displayInfo || {};
    prospect.strengths = prospect.strengths || [];
    prospect.weaknesses = prospect.weaknesses || [];
    return prospect;
  });

  try {
    const { error } = await supabase.from("prospects").insert(formattedProspects);
    if (error) throw error;
    console.log(`✅ Migração concluída com sucesso! ${formattedProspects.length} prospects foram adicionados ao Supabase.`);
  } catch (error) {
    console.error("❌ Erro durante a migração:", error.message);
  }
}

migrateData();