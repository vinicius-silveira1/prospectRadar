#!/usr/bin/env node
/**
 * Atualiza o arquivo public/data/nba_standings.json automaticamente.
 * Fonte primária: pacote `nba` (NBA Stats API).
 * Fallback: URL custom em env `NBA_STANDINGS_SOURCE_URL` retornando array de objetos {team: 'BOS', wins: 10, losses: 3}.
 * Saída:
 * {
 *   updatedAt: ISODate,
 *   lottery: [ { team, wins, losses }, ... 14 ],
 *   playoff: [ { team, wins, losses }, ... 16 ]
 * }
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.resolve(ROOT, 'public', 'data', 'nba_standings.json');

// CLI flags simples (suporta --flag=valor ou --flag valor)
const rawArgs = process.argv.slice(2);
function parseArgs(list) {
  const map = {};
  for (let i = 0; i < list.length; i++) {
    const token = list[i];
    if (token.startsWith('--')) {
      const eqIdx = token.indexOf('=');
      if (eqIdx !== -1) {
        const key = token.slice(2, eqIdx);
        const value = token.slice(eqIdx + 1);
        map[key] = value;
      } else {
        const key = token.slice(2);
        const next = list[i + 1];
        if (next && !next.startsWith('--')) {
          map[key] = next;
          i++;
        } else {
          map[key] = true; // flag booleana
        }
      }
    }
  }
  return map;
}
const argMap = parseArgs(rawArgs);
const seasonStartYear = Number(argMap.seasonStart) || new Date().getFullYear(); // ex: 2025 para temporada 2025-26
let season = argMap.season || `${seasonStartYear}-${String((seasonStartYear + 1) % 100).padStart(2, '0')}`; // 2025-26
const output = argMap.out ? path.resolve(argMap.out) : OUTPUT_PATH;
const sourceUrl = process.env.NBA_STANDINGS_SOURCE_URL || argMap.source;
const force = !!argMap.force;

function log(msg) { console.log(`[update-standings] ${msg}`); }
function warn(msg) { console.warn(`[update-standings] WARN: ${msg}`); }
function error(msg) { console.error(`[update-standings] ERROR: ${msg}`); }

function normalizeSeason(str) {
  const re = /^(\d{4})-(\d{2})$/;
  const m = re.exec(str);
  if (!m) {
    warn(`Season='${str}' em formato inválido. Reconstruindo a partir de seasonStartYear=${seasonStartYear}.`);
    return `${seasonStartYear}-${String((seasonStartYear + 1) % 100).padStart(2, '0')}`;
  }
  const start = Number(m[1]);
  const suffix = m[2];
  const expectedSuffix = String((start + 1) % 100).padStart(2, '0');
  if (suffix !== expectedSuffix) {
    warn(`Season sufixo '${suffix}' inconsistente (esperado '${expectedSuffix}'). Ajustando automaticamente.`);
    return `${start}-${expectedSuffix}`;
  }
  return str;
}

season = normalizeSeason(season);

// Mapeamento de códigos inconsistentes entre Basketball Reference e convenção interna
const TEAM_CODE_MAP = { BRK: 'BKN', CHO: 'CHA', PHO: 'PHX' };
function normalizeTeamCodes(arr) {
  return arr.map(t => ({ ...t, team: TEAM_CODE_MAP[t.team] || t.team }));
}

async function fetchViaNbaPackage() {
  try {
    const nba = await import('nba'); // dynamic import para evitar falha caso pacote mude
    if (!nba?.default?.stats?.leagueStandings) {
      warn('Função leagueStandings não encontrada no pacote nba.');
      return null;
    }
    log(`Consultando standings via pacote nba para Season=${season}`);
    const res = await nba.default.stats.leagueStandings({ Season: season, SeasonType: 'Regular Season', LeagueID: '00' });
    const rows = res?.leagueStandings?.resultSets?.[0]?.rowSet;
    const headers = res?.leagueStandings?.resultSets?.[0]?.headers;
    if (!rows || !headers) {
      warn('Formato inesperado da resposta de leagueStandings. Dump parcial para diagnóstico.');
      try {
        const keys = Object.keys(res || {});
        log(`Chaves nível 1: ${keys.join(', ')}`);
        if (res?.leagueStandings?.resultSets) {
          log(`resultSets length: ${res.leagueStandings.resultSets.length}`);
          log(`resultSets[0] keys: ${Object.keys(res.leagueStandings.resultSets[0] || {}).join(', ')}`);
        }
      } catch (_) { /* noop */ }
      return null;
    }
    const idx = (name) => headers.indexOf(name);
    const teams = rows.map(r => ({
      team: r[idx('TeamTriCode')],
      wins: Number(r[idx('W')]),
      losses: Number(r[idx('L')]),
      winPct: Number(r[idx('W_PCT')]),
      conf: r[idx('Conference')],
      confRank: Number(r[idx('ConfRank')]),
    })).filter(t => !!t.team);
    if (teams.length < 30) {
      warn(`Menos de 30 times retornados (${teams.length}).`);
    }
    return teams;
  } catch (e) {
    warn(`Falha ao usar pacote nba: ${e.message}`);
    return null;
  }
}

async function fetchViaStatsEndpoint(season) {
  // Endpoint oficial JSON (pode requerer headers específicos para evitar 403).
  const url = `https://stats.nba.com/stats/leagueStandings?LeagueID=00&Season=${encodeURIComponent(season)}&SeasonType=Regular%20Season`;
  try {
    log(`Tentando fallback stats.nba.com direto Season=${season}`);
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) prospectRadar',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.nba.com/',
        'Origin': 'https://www.nba.com'
      },
      timeout: 15000
    });
    const data = res.data;
    const rows = data?.resultSets?.[0]?.rowSet || data?.leagueStandings?.resultSets?.[0]?.rowSet;
    const headers = data?.resultSets?.[0]?.headers || data?.leagueStandings?.resultSets?.[0]?.headers;
    if (!rows || !headers) {
      warn('Estrutura inesperada em stats endpoint.');
      return null;
    }
    const idx = (name) => headers.indexOf(name);
    const teams = rows.map(r => ({
      team: r[idx('TeamTriCode')],
      wins: Number(r[idx('W')]),
      losses: Number(r[idx('L')]),
      winPct: Number(r[idx('W_PCT')]),
      conf: r[idx('Conference')],
      confRank: Number(r[idx('ConfRank')])
    })).filter(t => !!t.team);
    return teams.length ? teams : null;
  } catch (e) {
    warn(`Falha stats endpoint: ${e.message}`);
    return null;
  }
}

async function fetchViaDataNba() {
  // Data feed pública (não parametrizada por Season, sempre "current"). Útil durante temporada regular.
  const url = 'https://data.nba.com/prod/v2/current/standings_all.json';
  try {
    log('Tentando fallback data.nba.com current standings');
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) prospectRadar',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.nba.com',
        'Referer': 'https://www.nba.com/'
      },
      timeout: 15000
    });
    const json = res.data;
    const teamsRaw = json?.league?.standard?.teams;
    if (!Array.isArray(teamsRaw)) {
      warn('Formato inesperado em data.nba.com');
      return null;
    }
    const teams = teamsRaw.map(t => ({
      team: t?.teamSitesOnly?.teamTricode || t?.tricode || t?.teamTriCode || t?.teamCode,
      wins: Number(t?.win),
      losses: Number(t?.loss),
      winPct: Number(t?.winPct),
      conf: t?.confName || t?.conference,
      confRank: Number(t?.confRank || t?.conferenceRank || 0)
    })).filter(t => !!t.team);
    return teams.length ? teams : null;
  } catch (e) {
    warn(`Falha data.nba.com: ${e.message}`);
    return null;
  }
}

async function fetchViaCdnLiveData() {
  const url = 'https://cdn.nba.com/static/json/liveData/standings/leagueStandings.json';
  try {
    log('Tentando fallback cdn.nba.com liveData standings');
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) prospectRadar',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 15000
    });
    const json = res.data;
    const teamsRaw = json?.league?.standings?.teams;
    if (!Array.isArray(teamsRaw)) {
      warn('Formato inesperado em cdn liveData');
      return null;
    }
    const teams = teamsRaw.map(t => ({
      team: t?.teamTricode || t?.tricode || t?.teamSitesOnly?.teamTricode,
      wins: Number(t?.win),
      losses: Number(t?.loss),
      winPct: Number(t?.winPct),
      conf: t?.confName || t?.conference,
      confRank: Number(t?.confRank || t?.conferenceRank || 0)
    })).filter(t => !!t.team);
    return teams.length ? teams : null;
  } catch (e) {
    warn(`Falha cdn liveData: ${e.message}`);
    return null;
  }
}

async function fetchViaBasketballReference(seasonStartYear) {
  const seasonEndYear = seasonStartYear + 1;
  const url = `https://www.basketball-reference.com/leagues/NBA_${seasonEndYear}_standings.html`;
  try {
    log(`Tentando fallback Basketball Reference ${seasonEndYear} standings`);
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.basketball-reference.com/'
      },
      timeout: 20000
    });
    const html = res.data;
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const rows = doc.querySelectorAll('#confs_standings_E tbody tr, #confs_standings_W tbody tr');
    const teams = [];
    rows.forEach(r => {
      if (r.classList.contains('thead')) return; // skip header separator rows
      const teamAnchor = r.querySelector('th[data-stat="team_name"] a');
      if (!teamAnchor) return;
      const href = teamAnchor.getAttribute('href') || '';
      // href pattern /teams/BOS/2025.html
      const abbrMatch = /\/teams\/(\w{2,4})\//.exec(href);
      const team = abbrMatch ? abbrMatch[1] : teamAnchor.textContent.trim();
      const winsCell = r.querySelector('td[data-stat="wins"]');
      const lossesCell = r.querySelector('td[data-stat="losses"]');
      const wins = winsCell ? Number(winsCell.textContent.trim()) : 0;
      const losses = lossesCell ? Number(lossesCell.textContent.trim()) : 0;
      if (team && (wins + losses) >= 0) {
        teams.push({ team, wins, losses, winPct: (wins + losses) > 0 ? wins / (wins + losses) : 0 });
      }
    });
    if (teams.length < 20) {
      warn(`Basketball Reference retornou poucos times (${teams.length}).`);
      return null;
    }
    return teams;
  } catch (e) {
    warn(`Falha Basketball Reference: ${e.message}`);
    return null;
  }
}

async function fetchViaBasketballReferencePuppeteer(seasonStartYear) {
  const seasonEndYear = seasonStartYear + 1;
  const url = `https://www.basketball-reference.com/leagues/NBA_${seasonEndYear}_standings.html`;
  let browser;
  try {
    log(`Tentando fallback Basketball Reference (puppeteer) ${seasonEndYear} standings`);
    const puppeteerExtra = await import('puppeteer-extra');
    const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
    puppeteerExtra.default.use(StealthPlugin());
    browser = await puppeteerExtra.default.launch({
      headless: 'new',
      args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
    const teams = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('#confs_standings_E tbody tr, #confs_standings_W tbody tr'));
      return rows.filter(r => !r.classList.contains('thead')).map(r => {
        const a = r.querySelector('th[data-stat="team_name"] a');
        if (!a) return null;
        const href = a.getAttribute('href') || '';
        const m = /\/teams\/(\w{2,4})\//.exec(href);
        const team = m ? m[1] : a.textContent.trim();
        const winsEl = r.querySelector('td[data-stat="wins"]');
        const lossesEl = r.querySelector('td[data-stat="losses"]');
        const wins = winsEl ? Number(winsEl.textContent.trim()) : 0;
        const losses = lossesEl ? Number(lossesEl.textContent.trim()) : 0;
        return team ? { team, wins, losses, winPct: (wins + losses) ? wins / (wins + losses) : 0 } : null;
      }).filter(Boolean);
    });
    if (teams.length < 20) {
      return null;
    }
    return teams;
  } catch (e) {
    warn(`Falha BR puppeteer: ${e.message}`);
    return null;
  } finally {
    if (browser) {
      try { await browser.close(); } catch(_) {}
    }
  }
}

async function fetchViaCustomUrl(url) {
  if (!url) return null;
  try {
    log(`Fetch custom URL: ${url}`);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 prospectRadar updater' } });
    if (!res.ok) {
      warn(`Status ${res.status} ao acessar fonte custom.`);
      return null;
    }
    const json = await res.json();
    if (Array.isArray(json)) {
      // Espera array já normalizado
      return json.map(t => ({
        team: t.team || t.tricode || t.code,
        wins: Number(t.wins ?? t.win ?? t.W),
        losses: Number(t.losses ?? t.loss ?? t.L),
        winPct: t.winPct ?? t.win_percentage ?? (t.W != null && t.L != null ? t.W / (t.W + t.L) : undefined),
        conf: t.conference || t.conf,
        confRank: Number(t.confRank ?? t.conference_rank ?? t.rank ?? 0),
      })).filter(t => !!t.team);
    }
    // Caso tenha chave teams
    if (json?.teams && Array.isArray(json.teams)) {
      return json.teams.map(t => ({
        team: t.team || t.tricode || t.code,
        wins: Number(t.wins ?? t.win ?? t.W),
        losses: Number(t.losses ?? t.loss ?? t.L),
        winPct: t.winPct ?? t.win_percentage ?? (t.W != null && t.L != null ? t.W / (t.W + t.L) : undefined),
        conf: t.conference || t.conf,
        confRank: Number(t.confRank ?? t.conference_rank ?? t.rank ?? 0),
      })).filter(t => !!t.team);
    }
    warn('Fonte custom não tem formato reconhecido.');
    return null;
  } catch (e) {
    warn(`Falha na fonte custom: ${e.message}`);
    return null;
  }
}

function deriveLotteryAndPlayoff(teams) {
  // Ordena por winPct asc (piores primeiro). Se winPct ausente, calcula.
  const withPct = teams.map(t => ({ ...t, winPct: (t.winPct != null ? t.winPct : (t.wins + t.losses > 0 ? t.wins / (t.wins + t.losses) : 0)) }));
  withPct.sort((a, b) => a.winPct - b.winPct || a.wins - b.wins);
  const lottery = withPct.slice(0, 14).map(({ team, wins, losses }) => ({ team, wins, losses }));
  const playoff = withPct.slice(14).map(({ team, wins, losses }) => ({ team, wins, losses }));
  return { lottery, playoff };
}

async function main() {
  log(`Iniciando atualização. Season=${season}`);
  let teams = null;
  let usedSource = null;
  // Helper para tentar uma fonte
  async function attempt(label, fn) {
    if (teams) return; // já temos dados
    const result = await fn();
    if (result && !teams) {
      teams = result;
      usedSource = label;
    }
  }
  await attempt('nba-package', fetchViaNbaPackage);
  await attempt('stats-endpoint', () => fetchViaStatsEndpoint(season));
  await attempt('cdn-liveData', fetchViaCdnLiveData);
  await attempt('data-nba', fetchViaDataNba);
  await attempt('basketball-reference', () => fetchViaBasketballReference(seasonStartYear));
  await attempt('basketball-reference-puppeteer', () => fetchViaBasketballReferencePuppeteer(seasonStartYear));
  await attempt('custom-source', () => fetchViaCustomUrl(sourceUrl));
  if (!teams || teams.length === 0) {
    error('Não foi possível obter standings de nenhuma fonte. Mantendo arquivo existente (se houver).');
    if (!fs.existsSync(output)) {
      process.exitCode = 1;
    }
    return;
  }
  // Normaliza códigos
  teams = normalizeTeamCodes(teams);
  const { lottery, playoff } = deriveLotteryAndPlayoff(teams);
  if (lottery.length !== 14) warn(`Quantidade de lottery != 14 (${lottery.length}).`);
  const payload = {
    updatedAt: new Date().toISOString(),
    lottery,
    playoff,
    source: usedSource || 'unknown',
    season,
  };

  if (fs.existsSync(output) && !force) {
    // Carrega anterior para comparar
    try {
      const prev = JSON.parse(fs.readFileSync(output, 'utf-8'));
      const changed = JSON.stringify(prev.lottery) !== JSON.stringify(payload.lottery) || JSON.stringify(prev.playoff) !== JSON.stringify(payload.playoff);
      if (!changed) {
        log('Sem mudanças detectadas. Use --force para sobrescrever mesmo assim.');
        return;
      }
    } catch (_) {
      warn('Falha lendo arquivo anterior, continuará e sobrescreverá.');
    }
  }

  fs.writeFileSync(output, JSON.stringify(payload, null, 2));
  log(`Standings atualizadas em ${output}`);
  log(`Lottery (primeiros 3): ${lottery.slice(0,3).map(t=>t.team).join(', ')} ...`);
}

main().catch(e => {
  error(`Erro inesperado: ${e.stack || e.message}`);
  process.exitCode = 1;
});
