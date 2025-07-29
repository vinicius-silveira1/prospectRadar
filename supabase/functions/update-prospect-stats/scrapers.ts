import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

/**
 * Tenta extrair estatísticas de um jogador do MaxPreps.
 * ATENÇÃO: Este scraper é instável devido à forte proteção do site.
 * @param playerName O nome do jogador a ser buscado.
 * @returns Um objeto com as estatísticas ou nulo se falhar.
 */
export async function scrapeStatsFromMaxPreps(playerName: string): Promise<object | null> {
  try {
    const apiKey = Deno.env.get("SCRAPINGBEE_API_KEY");
    if (!apiKey) {
      throw new Error("SCRAPINGBEE_API_KEY is not set in environment variables.");
    }

    const searchUrl = `https://www.maxpreps.com/search/athletes.aspx?q=${encodeURIComponent(
      playerName.toLowerCase(),
    )}`;
    console.log(`[${playerName}] [MaxPreps] Step 1: Fetching search URL...`);

    // Usando a configuração mais robusta (e cara) como última tentativa.
    const proxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(
      searchUrl,
    )}&render_js=true&premium_proxy=true&country_code=us`;
    
    const searchResponse = await fetch(proxyUrl);

    if (!searchResponse.ok) {
      console.error(`[${playerName}] [MaxPreps] ERROR: Proxy failed to fetch search page (status: ${searchResponse.status}): ${await searchResponse.text()}`);
      return null;
    }

    const searchHtml = await searchResponse.text();
    let profileDoc = new DOMParser().parseFromString(searchHtml, "text/html");
    if (!profileDoc) return null;

    const isProfilePage = profileDoc.querySelector("div.athlete-summary");
    const isSearchResultsPage = profileDoc.querySelector("ul.search-results-list");

    if (isProfilePage) {
      console.log(`[${playerName}] [MaxPreps] Step 2: Landed directly on profile page.`);
    } else if (isSearchResultsPage) {
      console.log(`[${playerName}] [MaxPreps] Step 2: On search results page, finding profile link...`);
      const profileLink = profileDoc.querySelector("ul.search-results-list li.search-results-item a");
      if (!profileLink) {
        console.log(`[${playerName}] [MaxPreps] ERROR: Profile link not found on search results page.`);
        return null;
      }
      const profileUrl = `https://www.maxpreps.com${profileLink.getAttribute("href")}`;

      console.log(`[${playerName}] [MaxPreps] Step 3: Fetching profile URL...`);
      const profileProxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(
        profileUrl,
      )}&render_js=true&premium_proxy=true&country_code=us`;
      const profileResponse = await fetch(profileProxyUrl);

      if (!profileResponse.ok) {
        console.error(`[${playerName}] [MaxPreps] ERROR: Proxy failed to fetch profile page: ${await profileResponse.text()}`);
        return null;
      }
      const profileHtml = await profileResponse.text();
      profileDoc = new DOMParser().parseFromString(profileHtml, "text/html");
      if (!profileDoc) return null;
    } else {
      console.log(`[${playerName}] [MaxPreps] Player not found. Page is not a known type.`);
      return null;
    }

    console.log(`[${playerName}] [MaxPreps] Step 4: Extracting stats...`);
    const table = profileDoc.querySelector("table.g-table-stats");
    if (!table) {
      console.log(`[${playerName}] [MaxPreps] ERROR: Stats table not found.`);
      return null;
    }

    const headers = Array.from(table.querySelectorAll("thead th")).map((th) => th.textContent.trim().toUpperCase());
    const ppgIndex = headers.indexOf("PPG");
    const rpgIndex = headers.indexOf("RPG");
    const apgIndex = headers.indexOf("APG");
    const fgPctIndex = headers.indexOf("FG%");

    const dataRows = Array.from(table.querySelectorAll("tbody tr"));
    if (dataRows.length === 0) return null;

    let targetRow = dataRows.find(row => row.querySelector("th")?.textContent.trim() === "Career") || dataRows[dataRows.length - 1];
    const cells = targetRow.querySelectorAll("td");
    if (cells.length === 0) return null;

    const stats: { [key: string]: number } = {};
    if (ppgIndex > 0) stats.ppg = parseFloat(cells[ppgIndex - 1]?.textContent.trim() || "0");
    if (rpgIndex > 0) stats.rpg = parseFloat(cells[rpgIndex - 1]?.textContent.trim() || "0");
    if (apgIndex > 0) stats.apg = parseFloat(cells[apgIndex - 1]?.textContent.trim() || "0");
    if (fgPctIndex > 0) stats.fg_pct = parseFloat(cells[fgPctIndex - 1]?.textContent.trim() || "0");

    if (Object.keys(stats).length === 0 || Object.values(stats).every(val => isNaN(val) || val === 0)) return null;

    console.log(`[${playerName}] [MaxPreps] SUCCESS: Stats found:`, stats);
    return stats;
  } catch (error) {
    console.error(`[${playerName}] [MaxPreps] FATAL ERROR:`, error.message);
    return null;
  }
}