// scripts/ncaaScrapingExceptions.mjs

/**
 * Mapeia prospectId para a URL direta do Sports-Reference.com
 * para casos onde a busca automática falha.
 *
 * Formato: { "prospect-id-": "https://www.sports-reference.com/cbb/players/player-slug-X.html" }
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
  "patrick-ngongba": "https://www.sports-reference.com/cbb/players/patrick-ngongba-2.html",
  "christian-anderson": "https://www.sports-reference.com/cbb/players/christian-anderson-2.html",
  "taniya-latson": "https://www.sports-reference.com/cbb/players/taniya-latson-1.html",
  "nigel-james-2025": "https://www.sports-reference.com/cbb/players/nigel-james-jr-1.html",
  "chris-nwuli-2025": "https://www.sports-reference.com/cbb/players/christopher-nwuli-1.html",
  "c3d4e5f6-a7b8-9012-3456-7890abcdef12": "https://www.sports-reference.com/cbb/players/flaujae-johnson-1.html",
  "amare-bynum-2025": "https://www.sports-reference.com/cbb/players/amare-bynum-1.html",
  "dwayne-aristode-rivals-2025": "https://www.sports-reference.com/cbb/players/dwayne-aristode-1.html",
  "derek-dixon-rivals-2025": "https://www.sports-reference.com/cbb/players/derek-dixon-1.html",
  "aday-mara": "https://www.sports-reference.com/cbb/players/aday-mara-2.html",
  "jasper-johnson-espn-2025": "https://www.sports-reference.com/cbb/players/jasper-johnson-2.html",
  "anthony-robinson": "https://www.sports-reference.com/cbb/players/anthony-robinson-6.html",
  "anthony-robinson-ii": "https://www.sports-reference.com/cbb/players/anthony-robinson-ii-1.html",
  "mikel-brown-espn-2025": "https://www.sports-reference.com/cbb/players/mikel-brown-jr-1.html",
  "mackenzie-mgbako": "https://www.sports-reference.com/cbb/players/mackenzie-mgbako-2.html"


  // Adicione outros prospectos que falham aqui
};
