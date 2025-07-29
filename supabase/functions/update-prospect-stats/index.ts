import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { scrapeStatsFromMaxPreps } from "./scrapers.ts";

// Interface para definir a forma dos nossos prospects
interface Prospect {
  id: string;
  name: string;
  // Adicione outros campos se precisar deles na função
}

const BATCH_SIZE = 8; // Processar 8 prospects por invocação para ficar dentro do timeout

// A função principal que será executada
Deno.serve(async (req) => {
  try {
    // A função agora aceita um 'offset' para processar em lotes
    const { offset = 0 } = await req.json().catch(() => ({ offset: 0 }));
    console.log(`Processing batch starting at offset: ${offset}`);

    // Crie o cliente Supabase com as variáveis de ambiente
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Buscar um LOTE de prospects do banco de dados
    const { data: prospects, error: fetchError } = await supabaseClient
      .from('prospects')
      .select('id, name')
      .range(offset, offset + BATCH_SIZE - 1); // Usando .range() para paginar

    if (fetchError) throw fetchError;

    if (!prospects || prospects.length === 0) {
      console.log("No more prospects to process. Task complete.");
      return new Response(JSON.stringify({ message: "Task complete." }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    let updatedCount = 0;

    // 2. Iterar e atualizar o lote atual
    for (const prospect of prospects as Prospect[]) {
      const newStats = await scrapeStatsFromMaxPreps(prospect.name);

      if (newStats) {
        const { error: updateError } = await supabaseClient
          .from('prospects')
          .update({
            stats: newStats,
            stats_last_updated: new Date().toISOString(),
          })
          .eq('id', prospect.id);

        if (updateError) {
          console.error(`Failed to update ${prospect.name}:`, updateError.message);
        } else {
          updatedCount++;
        }
      }
      // Adiciona um pequeno delay para não sobrecarregar o site alvo
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 3. Se processamos um lote completo, chame a próxima função em cadeia
    if (prospects.length === BATCH_SIZE) {
      const nextOffset = offset + BATCH_SIZE;
      console.log(`Chaining next batch. New offset: ${nextOffset}`);
      
      // Invoca a próxima função de forma assíncrona (não esperamos a resposta)
      // para garantir que a função atual termine rapidamente.
      supabaseClient.functions.invoke('update-prospect-stats', {
        body: { offset: nextOffset },
      });
    } else {
        console.log("Final batch processed. Task complete.");
    }

    const summary = `Batch finished. Processed: ${prospects.length}. Updated: ${updatedCount}.`;
    console.log(summary);

    return new Response(JSON.stringify({ message: summary }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
