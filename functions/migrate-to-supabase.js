/**
 * @fileoverview Script para migrar dados locais para o Supabase.
 * Uso: node ./functions/migrate-to-supabase.js
 */

const { createClient } = require("@supabase/supabase-js");
// CORREÇÃO: O arquivo original foi deletado. Agora importamos de uma fonte de dados local dedicada à migração.
const { getLocalProspects } = require("../src/data/localProspectsData.js");

// IMPORTANTE: Substitua com as suas chaves do Supabase.
// NUNCA exponha a service_role_key no frontend. Use apenas para scripts de backend.
const SUPABASE_URL = "https://thypaxyxqvpsaonwatrb.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoeXBheHl4cXZwc2FvbndhdHJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzU0NTI0MiwiZXhwIjoyMDY5MTIxMjQyfQ.BIFa8l1ewsVMzry5GY5ksh7JbmciYSJNpJTsj6GtfR8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrateData() {
  console.log("Iniciando a migração de dados para o Supabase...");

  const prospects = getLocalProspects();

  if (prospects.length === 0) {
    console.log("Nenhum prospect encontrado para migrar.");
    return;
  }

  // No Supabase, o campo 'height' é um objeto JSON.
  // Precisamos garantir que ele seja um objeto, mesmo que esteja vazio.
  const formattedProspects = prospects.map(p => ({
    ...p,
    height: p.height || {},
  }));

  try {
    // O método insert do Supabase lida com o upload em lote.
    const { data, error } = await supabase.from("prospects").insert(formattedProspects);

    if (error) {
      throw error;
    }

    console.log(`✅ Migração concluída com sucesso! ${prospects.length} prospects foram adicionados/atualizados.`);
  } catch (error) {
    console.error("❌ Erro durante a migração:", error.message);
  }
}

migrateData();