import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const jsonPath = path.resolve('./nba_players_historical_rows_full.json');

async function main() {
  const json = fs.readFileSync(jsonPath, 'utf8');
  const players = JSON.parse(json);
  for (const player of players) {
    const { id, ...rest } = player;
    const { error } = await supabase
      .from('nba_players_historical')
      .upsert({ id, ...rest }, { onConflict: 'id' });
    if (error) {
      console.error(`Erro ao inserir ${player.name}:`, error.message);
    } else {
      console.log(`Inserido/atualizado: ${player.name}`);
    }
  }
}

main();
