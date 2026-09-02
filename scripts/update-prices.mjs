#!/usr/bin/env node
// Sync the dashboard's data files. Two jobs in one command:
//
//   1. Refresh input/output/cache prices in data.json from the OpenRouter API.
//   2. Mirror data.json into the FALLBACK_DATA snapshot in app.js and bump the
//      ?v= cache-buster in index.html.
//
//   node scripts/update-prices.mjs              show what would change, write nothing
//   node scripts/update-prices.mjs --write      apply it
//   node scripts/update-prices.mjs --sync-only  skip OpenRouter; just mirror data.json
//
// Job 2 is why anyone editing data.json by hand — adding a model, fixing a
// benchmark — should finish by running this with --write instead of hand-copying
// rows into app.js. init() compares JSON.stringify(data.models) against
// FALLBACK_DATA.models, so the two must match field-for-field and in key order,
// and app.js cannot change without a new ?v= token or GitHub Pages keeps serving
// the old file to returning visitors.
//
// OpenRouter is the source of truth for prices only. Benchmark scores, `open`,
// and provider colors stay hand-curated.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const API = 'https://openrouter.ai/api/v1/models?output_modalities=all';
const ROOT = new URL('../', import.meta.url);
const DATA_PATH = new URL('data.json', ROOT);
const APP_PATH = new URL('app.js', ROOT);
const STYLES_PATH = new URL('styles.css', ROOT);
const INDEX_PATH = new URL('index.html', ROOT);

const PER_M = 1e6; // The API prices per token; data.json stores per 1M tokens.
const PRICE_KEYS = ['inputPrice', 'outputPrice', 'cachePrice'];
// data.json key order is load-bearing: init() compares JSON.stringify(data.models)
// against FALLBACK_DATA.models, so a field in a different slot reads as a change.
const KEY_ORDER = ['provider', 'model', 'inputPrice', 'outputPrice', 'cachePrice',
  'livebench', 'aaScore', 'open'];
// Script-only hints. They never reach FALLBACK_DATA, and app.js strips them on load.
const LOCAL_KEYS = ['openrouterId', 'priceLock'];

const write = process.argv.includes('--write');
const syncOnly = process.argv.includes('--sync-only');

// ===== MATCHING =====
// Split letter->digit boundaries so 'qwen3.6' and 'qwen 3.6' both tokenize to [qwen, 3, 6].
const norm = s => s.toLowerCase().replace(/([a-z])(\d)/g, '$1 $2').replace(/[^a-z0-9]+/g, ' ').trim();
const tokens = s => new Set(norm(s).split(' ').filter(Boolean));

// Normalized exact name first, then token-subset match, preferring canonical
// (non-alias) entries with the fewest extra tokens. Returns null when nothing matches.
function matchByName(target, entries) {
  const t = tokens(target);
  let best = null;
  entries.forEach((e, i) => {
    const cand = tokens(e.name);
    if (![...t].every(k => cand.has(k))) return;
    const score = [norm(e.name) === norm(target) ? 0 : 1, e.id.startsWith('~') ? 1 : 0, cand.size - t.size, i];
    if (!best || score < best[0]) best = [score, e];
  });
  return best ? best[1] : null;
}

// ===== FORMATTING =====
const usd = v => (Number.isFinite(v) ? Number((v * PER_M).toFixed(6)) : null);
const money = v => (v == null ? '—' : '$' + (v < 0.01 ? v.toFixed(4) : v.toFixed(2)));

// FALLBACK_DATA is hand-aligned JS, not JSON. Integer prices carry a trailing .0
// to match the existing column style; benchmarks print at their natural precision.
const price = v => (v == null ? 'null' : Number.isInteger(v) ? v.toFixed(1) : String(v));
const bench = v => (v == null ? 'null' : String(v));
const str = v => `'${String(v).replace(/'/g, "\\'")}'`;

function renderFallbackModels(models) {
  const cols = models.map(m => ({
    provider: `provider: ${str(m.provider)},`,
    model: `model: ${str(m.model)},`,
    inputPrice: `inputPrice: ${price(m.inputPrice)},`,
    outputPrice: `outputPrice: ${price(m.outputPrice)},`,
    cachePrice: `cachePrice: ${price(m.cachePrice)},`,
    livebench: `livebench: ${bench(m.livebench)},`,
    aaScore: `aaScore: ${bench(m.aaScore)},`,
    open: `open: ${m.open === true},`,
  }));
  // Pad every column but the last to the widest cell, so the block stays aligned
  // as names and prices change length.
  const fields = Object.keys(cols[0]);
  const width = Object.fromEntries(fields.map(f => [f, Math.max(...cols.map(c => c[f].length))]));
  return cols.map(c => {
    const cells = fields.map((f, i) => (i === fields.length - 1 ? c[f] : c[f].padEnd(width[f])));
    return `    { ${cells.join(' ').trimEnd().replace(/,$/, '')} },`;
  }).join('\n');
}

const BLOCK_START = '  models: [\n';
const BLOCK_END = '\n  ],\n};';

function findBlock(src) {
  const start = src.indexOf(BLOCK_START);
  if (start === -1) throw new Error('FALLBACK_DATA: models block start not found in app.js');
  const end = src.indexOf(BLOCK_END, start + BLOCK_START.length);
  if (end === -1) throw new Error('FALLBACK_DATA: models block end not found in app.js');
  return { from: start + BLOCK_START.length, to: end, body: src.slice(start + BLOCK_START.length, end) };
}

const modelNames = block => [...block.matchAll(/model: '((?:[^'\\]|\\.)*)'/g)].map(m => m[1].replace(/\\'/g, "'"));

// ===== LOAD =====
const data = JSON.parse(await readFile(DATA_PATH, 'utf8'));
for (const m of data.models) {
  if (!('cachePrice' in m)) m.cachePrice = null; // Uniform schema; null = no cache pricing published.
}

// ===== JOB 1: PRICES =====
const changes = [];
const locked = [];
const unmatched = [];

if (!syncOnly) {
  const res = await fetch(API);
  if (!res.ok) throw new Error(`OpenRouter API ${res.status}: ${res.statusText}`);
  const { data: apiModels } = await res.json();

  for (const m of data.models) {
    if (m.priceLock === true) { locked.push(m.model); continue; }

    const api = m.openrouterId
      ? apiModels.find(e => e.id === m.openrouterId)
      : matchByName(m.model, apiModels);
    if (!api) {
      unmatched.push(m.openrouterId ? `${m.model} (pinned id ${m.openrouterId} not on OpenRouter)` : m.model);
      continue;
    }

    const p = api.pricing ?? {};
    const next = {
      inputPrice: usd(parseFloat(p.prompt)),
      outputPrice: usd(parseFloat(p.completion)),
      cachePrice: usd(parseFloat(p.input_cache_read)),
    };
    // A model with no input/output pricing is almost certainly a bad match; keep what we have.
    if (next.inputPrice == null || next.outputPrice == null) {
      unmatched.push(`${m.model} (matched ${api.id} but it publishes no pricing)`);
      continue;
    }

    for (const key of PRICE_KEYS) {
      if (m[key] !== next[key]) {
        changes.push({ model: m.model, id: api.id, key, from: m[key], to: next[key] });
        m[key] = next[key];
      }
    }
  }
}

// A model can be added to data.json with no prices at all and let this script fill
// them in — but only if OpenRouter actually matched it. Fail loudly rather than
// writing a file that validateData will reject at runtime.
const priceless = data.models.filter(m => typeof m.inputPrice !== 'number' || typeof m.outputPrice !== 'number');
if (priceless.length) {
  console.error(`\nNo input/output price for:\n  ${priceless.map(m => m.model).join('\n  ')}`);
  console.error('Set them by hand, or add an "openrouterId" so the lookup can find the model.');
  process.exit(1);
}

// Canonical key order, with the script-only hints kept out of FALLBACK_DATA.
const orderedModels = data.models.map(m => {
  const out = {};
  for (const k of KEY_ORDER) if (k in m) out[k] = m[k];
  return out;
});
data.models = data.models.map((m, i) => {
  const out = { ...orderedModels[i] };
  for (const k of LOCAL_KEYS) if (k in m) out[k] = m[k];
  return out;
});

// ===== JOB 2: SNAPSHOT DRIFT =====
// Anything that changes data.json — a new model, an edited benchmark, a rename —
// has to reach FALLBACK_DATA too, so compare the rendered block to what app.js holds.
let app = await readFile(APP_PATH, 'utf8');
const block = findBlock(app);
const nextBlock = renderFallbackModels(orderedModels);
const snapshotStale = block.body !== nextBlock;
const stampInApp = app.match(/const FALLBACK_DATA = \{\n  lastUpdated: '([^']*)'/)?.[1];

const before = modelNames(block.body);
const after = modelNames(nextBlock);
const added = after.filter(n => !before.includes(n));
const removed = before.filter(n => !after.includes(n));

// ===== REPORT =====
const pad = (s, n) => String(s).padEnd(n);
if (syncOnly) {
  console.log('Sync only — OpenRouter not contacted.');
} else if (changes.length) {
  const w = Math.max(...changes.map(c => c.model.length));
  console.log(`${changes.length} price change(s):`);
  for (const c of changes) {
    console.log(`  ${pad(c.model, w)}  ${pad(c.key, 11)} ${pad(money(c.from), 9)} -> ${pad(money(c.to), 9)}  [${c.id}]`);
  }
} else {
  console.log('No price changes — data.json already matches OpenRouter.');
}
if (locked.length) console.log(`\npriceLock, left alone:\n  ${locked.join('\n  ')}`);
if (unmatched.length) console.warn(`\nNo OpenRouter match, kept existing prices:\n  ${unmatched.join('\n  ')}`);

if (snapshotStale) {
  console.log('\nFALLBACK_DATA in app.js is out of date and will be regenerated.');
  if (added.length) console.log(`  added:   ${added.join(', ')}`);
  if (removed.length) console.log(`  removed: ${removed.join(', ')}`);
  if (!added.length && !removed.length) console.log('  field-level edits only');
}

if (!changes.length && !snapshotStale) { console.log('\nEverything is in sync. Nothing to write.'); process.exit(0); }
if (!write) { console.log('\nDry run. Re-run with --write to apply.'); process.exit(0); }

// ===== WRITE =====
// lastUpdated moves only when something actually changed, so a no-op run leaves
// the tree clean and the weekly job produces no commit.
const now = new Date();
const stamp = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
  .map((n, i) => String(n).padStart(i ? 2 : 4, '0')).join('-');
data.lastUpdated = stamp;

await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n');

app = app.replace(/(const FALLBACK_DATA = \{\n  lastUpdated: ')[^']*(')/, `$1${stamp}$2`);
app = app.slice(0, block.from) + nextBlock + app.slice(block.to);
await writeFile(APP_PATH, app);

// Hash the served assets rather than trusting the date: two runs on the same day
// must still produce different tokens, or returning visitors keep the stale file.
const styles = await readFile(STYLES_PATH, 'utf8');
const digest = createHash('sha256').update(app).update(styles).digest('hex').slice(0, 6);
const token = `${stamp.replace(/-/g, '')}-${digest}`;
let index = await readFile(INDEX_PATH, 'utf8');
index = index.replace(/((?:styles\.css|app\.js)\?v=)[^"']*/g, `$1${token}`);
await writeFile(INDEX_PATH, index);

console.log(`\nWrote data.json, FALLBACK_DATA in app.js, and ?v=${token} in index.html.`);
