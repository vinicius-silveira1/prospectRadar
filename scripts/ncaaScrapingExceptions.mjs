// scripts/ncaaScrapingExceptions.mjs

/**
 * Mapeia prospectId para a URL direta do Sports-Reference.com
 * para casos onde a busca automática falha.
 *
 * Formato: { "prospect-id-no-espn-suffix": "https://www.sports-reference.com/cbb/players/player-slug-X.html" }
 *
 * IMPORTANTE: O prospectId deve ser o ID do prospecto no Supabase,
 * que geralmente é o slug do nome do jogador.
 */
export const ncaaScrapingExceptions = {
  "eduardo-klafke-ncaa": "https://www.sports-reference.com/cbb/players/eduardo-klafke-1.html",
  "cameron-boozer-espn-2025": "https://www.sports-reference.com/cbb/players/cameron-boozer-3.html",
  "darius-acuff-espn-2025": "https://www.sports-reference.com/cbb/players/darius-acuff-jr-1.html",
  "dewayne-brown-2025": "https://www.sports-reference.com/cbb/players/dewayne-brown-ii-1.html",
  "jordan-scott-2025": "https://www.sports-reference.com/cbb/players/jordan-scott-3.html",
  "patrick-ngongba": "https://www.sports-reference.com/cbb/players/patrick-ngongba-2.html"
  "christian-anderson": "https://www.sports-reference.com/cbb/players/christian-anderson-2.html"
  // Adicione outros prospectos que falham aqui
};
