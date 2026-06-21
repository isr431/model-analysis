// ===== FALLBACK DATA =====
// Embedded snapshot for instant rendering. Overridden by data.json when available.
const FALLBACK_DATA = {
  lastUpdated: '2026-06-21',
  providers: {
    'DeepSeek':    { color: '#22d3ee' },
    'Z.ai':        { color: '#2dd4bf' },
    'MiniMax':     { color: '#f472b6' },
    'OpenAI':      { color: '#10b981' },
    'Google':      { color: '#38bdf8' },
    'Alibaba':     { color: '#fb923c' },
    'Anthropic':   { color: '#f59e0b' },
    'Moonshot AI': { color: '#c084fc' },
    'Mistral AI':  { color: '#a78bfa' },
    'NVIDIA':      { color: '#4ade80' },
    'xAI':         { color: '#f43f5e' },
  },
  models: [
    { provider: 'xAI',         model: 'Grok 4.3',              inputPrice: 1.25,  outputPrice: 2.5,   livebench: 66.74, aaScore: 38 },
    { provider: 'OpenAI',      model: 'GPT-5.3 Codex',         inputPrice: 1.75,  outputPrice: 14.0,  livebench: 72.76, aaScore: 44 },
    { provider: 'DeepSeek',    model: 'DeepSeek V4 Pro',       inputPrice: 0.435, outputPrice: 0.87,  livebench: 73.58, aaScore: 44 },
    { provider: 'Z.ai',        model: 'GLM 5.2',               inputPrice: 1.4,   outputPrice: 4.4,   livebench: 76.24, aaScore: 51 },
    { provider: 'MiniMax',     model: 'MiniMax M3',             inputPrice: 0.3,   outputPrice: 1.2,   livebench: 70.02, aaScore: 44 },
    { provider: 'DeepSeek',    model: 'DeepSeek V4 Flash',      inputPrice: 0.14,  outputPrice: 0.28,  livebench: 67.25, aaScore: 40 },
    { provider: 'OpenAI',      model: 'GPT-5.4',                inputPrice: 2.5,   outputPrice: 15.0,  livebench: 80.28, aaScore: 51 },
    { provider: 'Google',      model: 'Gemini 3.5 Flash',       inputPrice: 1.5,   outputPrice: 9.0,   livebench: 75.02, aaScore: 50 },
    { provider: 'OpenAI',      model: 'GPT-5.4 nano',           inputPrice: 0.2,   outputPrice: 1.25,  livebench: 70.13, aaScore: 38 },
    { provider: 'Google',      model: 'Gemini 3.1 Pro',         inputPrice: 2.0,   outputPrice: 12.0,  livebench: 79.93, aaScore: 46 },
    { provider: 'Alibaba',     model: 'Qwen 3.7 Max',           inputPrice: 1.25,  outputPrice: 3.75,  livebench: 74.29, aaScore: 46 },
    { provider: 'OpenAI',      model: 'GPT-5.5',                inputPrice: 5.0,   outputPrice: 30.0,  livebench: 80.71, aaScore: 55 },
    { provider: 'Anthropic',   model: 'Claude Opus 4.8',        inputPrice: 5.0,   outputPrice: 25.0,  livebench: 77.22, aaScore: 56 },
    { provider: 'Moonshot AI', model: 'Kimi K2.6',              inputPrice: 0.95,  outputPrice: 4.0,   livebench: 72.17, aaScore: 43 },
    { provider: 'Anthropic',   model: 'Claude Opus 4.7',        inputPrice: 5.0,   outputPrice: 25.0,  livebench: 76.91, aaScore: 54 },
    { provider: 'Anthropic',   model: 'Claude Fable 5',         inputPrice: 10.0,  outputPrice: 50.0,  livebench: 78.31, aaScore: 60 },
    { provider: 'Anthropic',   model: 'Claude Sonnet 4.6',      inputPrice: 3.0,   outputPrice: 15.0,  livebench: 75.47, aaScore: 47 },
    { provider: 'OpenAI',      model: 'GPT-5.4 mini',           inputPrice: 0.75,  outputPrice: 4.5,   livebench: 67.54, aaScore: 40 },
    { provider: 'Z.ai',        model: 'GLM 5.1',                inputPrice: 1.4,   outputPrice: 4.4,   livebench: 70.18, aaScore: 40 },
    { provider: 'Anthropic',   model: 'Claude Opus 4.6',        inputPrice: 5.0,   outputPrice: 25.0,  livebench: 76.33, aaScore: 44 },
    { provider: 'Mistral AI',  model: 'Mistral Medium 3.5',     inputPrice: 1.5,   outputPrice: 7.5,   livebench: 63.80, aaScore: 30 },
    { provider: 'Anthropic',   model: 'Claude Haiku 4.5',       inputPrice: 1.0,   outputPrice: 5.0,   livebench: 61.32, aaScore: 30 },
    { provider: 'Google',      model: 'Gemini 3.1 Flash Lite',  inputPrice: 0.25,  outputPrice: 1.5,   livebench: 61.68, aaScore: 25 },
    { provider: 'NVIDIA',      model: 'Nemotron 3 Ultra',       inputPrice: 0.5,   outputPrice: 2.5,   livebench: 51.78, aaScore: 38 },
  ],
};

// ===== ACTIVE DATA (starts as fallback, replaced by fetched data) =====
let RAW_DATA = FALLBACK_DATA.models;
let PROVIDER_COLORS = {};
let ALL_PROVIDERS = [];

// ===== UTILITIES =====
function hexToRgb(hex) {
  // Strip # prefix and normalize to lowercase
  hex = hex.replace(/^#/, '').toLowerCase();
  // Expand 3-char shorthand (e.g. 'f0b' → 'ff00bb')
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

function buildProviderColors(providers) {
  const colors = {};
  for (const [name, config] of Object.entries(providers)) {
    colors[name] = {
      bg: config.color,
      rgb: hexToRgb(config.color),
    };
  }
  return colors;
}

function deriveProviderList(models) {
  return [...new Set(models.map(d => d.provider))];
}

// ===== SCHEMA VALIDATION =====
function validateData(data) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.models) || data.models.length === 0) return false;
  if (!data.providers || typeof data.providers !== 'object') return false;

  const requiredFields = ['provider', 'model', 'inputPrice', 'outputPrice', 'livebench', 'aaScore'];
  const numericFields = ['inputPrice', 'outputPrice', 'livebench', 'aaScore'];

  for (const model of data.models) {
    for (const field of requiredFields) {
      if (!(field in model)) return false;
    }
    for (const field of numericFields) {
      if (typeof model[field] !== 'number' || isNaN(model[field])) return false;
    }
  }
  return true;
}

// ===== DATA LOADING =====
function applyData(data) {
  RAW_DATA = data.models;
  PROVIDER_COLORS = buildProviderColors(data.providers);
  ALL_PROVIDERS = deriveProviderList(data.models);

  // Ensure all providers from the providers config are included
  for (const name of Object.keys(data.providers)) {
    if (!ALL_PROVIDERS.includes(name)) {
      ALL_PROVIDERS.push(name);
    }
  }
}

function updateSliderBounds() {
  // Compute max blended cost across all models and set slider bounds dynamically
  const allModels = computeAllMetrics(RAW_DATA, 0);
  const maxBlended = Math.max(...allModels.map(m => m.blended));
  // Round up to next whole number for a clean slider max
  const sliderMax = Math.ceil(maxBlended);

  const priceMinInput = document.getElementById('priceMin');
  const priceMaxInput = document.getElementById('priceMax');

  priceMinInput.max = sliderMax;
  priceMaxInput.max = sliderMax;

  // If state.priceMax was at the old max (meaning "show all"), update it to the new max
  if (state.priceMax >= parseFloat(priceMaxInput.max) || state.priceMax >= sliderMax) {
    state.priceMax = sliderMax;
    priceMaxInput.value = sliderMax;
    document.getElementById('priceMaxVal').textContent = sliderMax.toFixed(2);
  }

  updatePriceRangeSliderHighlight();
}

function reinitProviderPills() {
  const container = document.getElementById('providerPills');
  container.innerHTML = '';

  // Add any new providers to the active set
  ALL_PROVIDERS.forEach(p => {
    if (!state.activeProviders.has(p)) {
      state.activeProviders.add(p);
    }
  });

  // Remove providers from activeProviders that no longer exist
  for (const p of state.activeProviders) {
    if (!ALL_PROVIDERS.includes(p)) {
      state.activeProviders.delete(p);
    }
  }

  initProviderPills();
}

async function loadData() {
  // Phase 1: Immediately apply fallback data
  applyData(FALLBACK_DATA);

  // Phase 2: Attempt to fetch fresh data in the background
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!validateData(data)) {
      console.warn('[LLM Analysis] Fetched data.json failed schema validation — using fallback data.');
      return false;
    }

    // Check if the data is actually different from the fallback
    const fallbackStr = JSON.stringify(FALLBACK_DATA.models);
    const fetchedStr = JSON.stringify(data.models);

    if (fallbackStr !== fetchedStr || JSON.stringify(FALLBACK_DATA.providers) !== JSON.stringify(data.providers)) {
      applyData(data);
      updateSliderBounds();
      reinitProviderPills();
      updateAll();
      console.info('[LLM Analysis] Data loaded from data.json successfully.');
    } else {
      console.info('[LLM Analysis] data.json matches fallback — no update needed.');
    }

    return true;
  } catch (err) {
    if (window.location.protocol === 'file:') {
      console.warn(
        '[LLM Analysis] Cannot fetch data.json over file:// protocol. ' +
        'Use a local server (e.g., python3 -m http.server) for live data loading. ' +
        'The app is running normally with its embedded fallback data.'
      );
    } else {
      console.warn('[LLM Analysis] Failed to load data.json — using fallback data.', err.message);
    }
    return false;
  }
}

// ===== STATE =====
const state = {
  p: 0.2,
  search: '',
  priceMin: 0,
  priceMax: 12,
  perfThreshold: 0,
  activeProviders: new Set(),
  sortColumn: 'value',
  sortDirection: 'desc',
  barMetric: 'value',
};

// ===== COMPUTATION =====
function computeBlended(inputPrice, outputPrice) {
  return 0.9573 * inputPrice + 0.0427 * outputPrice;
}

function computeAllMetrics(data, p) {
  // Step 1: compute blended
  const models = data.map(d => ({ ...d, blended: computeBlended(d.inputPrice, d.outputPrice) }));

  // Step 2: min/max across ALL models (not filtered)
  const lbMin = Math.min(...models.map(m => m.livebench));
  const lbMax = Math.max(...models.map(m => m.livebench));
  const aaMin = Math.min(...models.map(m => m.aaScore));
  const aaMax = Math.max(...models.map(m => m.aaScore));

  // Step 3: performance = 50/50 normalized blend
  models.forEach(m => {
    const lbNorm = (lbMax - lbMin) === 0 ? 0 : (m.livebench - lbMin) / (lbMax - lbMin);
    const aaNorm = (aaMax - aaMin) === 0 ? 0 : (m.aaScore - aaMin) / (aaMax - aaMin);
    m.performance = (0.5 * lbNorm + 0.5 * aaNorm) * 100;
  });

  // Step 4: value = performance / blended^p
  models.forEach(m => {
    m.value = m.blended > 0 && p > 0 ? m.performance / Math.pow(m.blended, p) : m.performance;
  });

  return models;
}

function getFilteredModels(allModels) {
  return allModels.filter(m =>
    state.activeProviders.has(m.provider) &&
    m.blended >= state.priceMin &&
    m.blended <= state.priceMax &&
    m.performance >= state.perfThreshold &&
    (state.search === '' ||
     m.model.toLowerCase().includes(state.search.toLowerCase()) ||
     m.provider.toLowerCase().includes(state.search.toLowerCase()))
  );
}

// ===== UTILITIES =====
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

function lerp(a, b, t) { return a + (b - a) * t; }

function colorScale(value, min, max) {
  const t = (max - min) === 0 ? 0.5 : (value - min) / (max - min);
  if (t < 0.5) {
    const r = Math.round(lerp(248, 251, t * 2));
    const g = Math.round(lerp(113, 191, t * 2));
    const b = Math.round(lerp(113, 36, t * 2));
    return `rgb(${r},${g},${b})`;
  } else {
    const r = Math.round(lerp(251, 52, (t - 0.5) * 2));
    const g = Math.round(lerp(191, 211, (t - 0.5) * 2));
    const b = Math.round(lerp(36, 153, (t - 0.5) * 2));
    return `rgb(${r},${g},${b})`;
  }
}

function providerColor(provider) {
  return PROVIDER_COLORS[provider]?.bg || '#888';
}

function providerRgb(provider) {
  return PROVIDER_COLORS[provider]?.rgb || '136,136,136';
}

// ===== CHARTS =====
let scatterChart, barChart;

function initCharts() {
  const tooltipStyle = {
    backgroundColor: 'rgba(15,15,26,0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    titleColor: '#fff',
    bodyColor: 'rgba(255,255,255,0.8)',
    padding: 12,
    titleFont: { family: 'Inter', weight: '600' },
    bodyFont: { family: 'Inter' },
  };

  scatterChart = new Chart(document.getElementById('scatterChart'), {
    type: 'scatter',
    data: { datasets: [{ data: [], pointRadius: 7, pointHoverRadius: 10, borderWidth: 1.5 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category',
          offset: true,
          title: { display: true, text: 'Blended Cost ($/1M tokens)', color: 'rgba(255,255,255,0.7)', font: { family: 'Inter' } },
          ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
        y: {
          title: { display: true, text: 'Performance Score', color: 'rgba(255,255,255,0.7)', font: { family: 'Inter' } },
          ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
          grace: '5%',
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            title: items => items[0].raw.model,
            label: item => [
              `Provider: ${item.raw.provider}`,
              `Blended: $${item.raw.blended.toFixed(4)}`,
              `Performance: ${item.raw.y.toFixed(1)}`,
              `Value: ${item.raw.value.toFixed(1)}`,
            ],
          },
        },
      },
    },
  });

  barChart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], borderWidth: 1, borderRadius: 4 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: 'Value Score', color: 'rgba(255,255,255,0.7)', font: { family: 'Inter' } },
          ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'Inter', size: 11 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
        y: {
          ticks: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter', size: 11 } },
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            label: item => {
              const metricLabels = { value: 'Value', performance: 'Performance', blended: 'Blended Cost', livebench: 'LiveBench', aaScore: 'AA Score' };
              return `${metricLabels[state.barMetric]}: ${item.raw.toFixed(2)}`;
            },
          },
        },
      },
    },
  });
}

// ===== VIEW UPDATE FUNCTIONS =====
function updateSummaryCards(filtered) {
  if (filtered.length === 0) {
    ['bestValueModel', 'bestPerfModel', 'cheapestModel', 'expensiveModel'].forEach(id => {
      document.getElementById(id).textContent = '—';
    });
    ['bestValueStat', 'bestPerfStat', 'cheapestStat', 'expensiveStat'].forEach(id => {
      document.getElementById(id).textContent = '—';
    });
    return;
  }

  const bestValue = filtered.reduce((a, b) => a.value > b.value ? a : b);
  const bestPerf = filtered.reduce((a, b) => a.performance > b.performance ? a : b);
  const cheapest = filtered.reduce((a, b) => a.blended < b.blended ? a : b);
  const expensive = filtered.reduce((a, b) => a.blended > b.blended ? a : b);

  document.getElementById('bestValueModel').textContent = bestValue.model;
  document.getElementById('bestValueStat').textContent = bestValue.value.toFixed(1);
  document.getElementById('bestPerfModel').textContent = bestPerf.model;
  document.getElementById('bestPerfStat').textContent = bestPerf.performance.toFixed(1);
  document.getElementById('cheapestModel').textContent = cheapest.model;
  document.getElementById('cheapestStat').textContent = '$' + cheapest.blended.toFixed(4);
  document.getElementById('expensiveModel').textContent = expensive.model;
  document.getElementById('expensiveStat').textContent = '$' + expensive.blended.toFixed(4);
}

let leaderboardExpanded = false;

function toggleLeaderboard() {
  leaderboardExpanded = !leaderboardExpanded;
  const btn = document.getElementById('leaderboardExpand');
  if (leaderboardExpanded) {
    btn.innerHTML = 'Show Top 10 <span class="arrow">▼</span>';
    btn.classList.add('expanded');
  } else {
    btn.innerHTML = 'Show All <span class="arrow">▼</span>';
    btn.classList.remove('expanded');
  }
  // Re-run with current data
  const allModels = computeAllMetrics(RAW_DATA, state.p);
  const filtered = getFilteredModels(allModels);
  updateLeaderboard(filtered);
}

function updateLeaderboard(filtered) {
  const list = document.getElementById('leaderboardList');
  const btn = document.getElementById('leaderboardExpand');
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>No models match your filters</p>
        <button class="reset-btn" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    btn.style.display = 'none';
    return;
  }

  const sorted = [...filtered].sort((a, b) => b.performance - a.performance);
  const display = leaderboardExpanded ? sorted : sorted.slice(0, 10);

  // Show/hide expand button based on whether there are more than 10
  btn.style.display = filtered.length > 10 ? 'flex' : 'none';

  list.innerHTML = display.map((m, i) => `
    <div class="leaderboard-row">
      <span class="leaderboard-rank ${i < 3 ? 'top' : ''}">#${i + 1}</span>
      <span class="leaderboard-dot" style="background:${providerColor(m.provider)}"></span>
      <span class="leaderboard-name">${m.model} <span class="leaderboard-provider">${m.provider}</span></span>
      <div class="leaderboard-bar-track">
        <div class="leaderboard-bar-fill" style="width:${m.performance.toFixed(1)}%; background:${providerColor(m.provider)}"></div>
      </div>
      <span class="leaderboard-score">${m.performance.toFixed(1)}</span>
    </div>
  `).join('');
}

function updateScatterChart(filtered) {
  if (filtered.length === 0) {
    scatterChart.data.datasets[0].data = [];
    scatterChart.options.scales.x.labels = [];
    scatterChart.update();
    return;
  }

  // Extract unique costs of filtered models and sort them
  const uniqueCosts = [...new Set(filtered.map(m => m.blended))].sort((a, b) => a - b);
  const labels = [...new Set(uniqueCosts.map(c => '$' + c.toFixed(2)))];

  // Update the categories on the X-axis
  scatterChart.options.scales.x.labels = labels;

  scatterChart.data.datasets[0].data = filtered.map(m => ({
    x: '$' + m.blended.toFixed(2),
    y: m.performance,
    model: m.model,
    provider: m.provider,
    value: m.value,
    blended: m.blended,
  }));

  scatterChart.data.datasets[0].backgroundColor = filtered.map(m => `rgba(${providerRgb(m.provider)}, 0.6)`);
  scatterChart.data.datasets[0].borderColor = filtered.map(m => providerColor(m.provider));
  scatterChart.update();
}

function updateBarChart(filtered) {
  const metric = state.barMetric;
  const isAsc = metric === 'blended';
  const sorted = [...filtered].sort((a, b) => isAsc ? a[metric] - b[metric] : b[metric] - a[metric]);

  const metricLabels = { value: 'Value Score', performance: 'Performance', blended: 'Blended Cost ($/1M)', livebench: 'LiveBench', aaScore: 'AA Score' };
  barChart.options.scales.x.title.text = metricLabels[metric] || metric;

  // Dynamically size the bar chart based on how many models are visible
  const barHeight = Math.max(350, sorted.length * 28 + 60);
  document.getElementById('barChart').parentElement.style.height = barHeight + 'px';

  barChart.data.labels = sorted.map(m => m.model);
  barChart.data.datasets[0].data = sorted.map(m => m[metric]);
  barChart.data.datasets[0].backgroundColor = sorted.map(m => `rgba(${providerRgb(m.provider)}, 0.7)`);
  barChart.data.datasets[0].borderColor = sorted.map(m => providerColor(m.provider));
  barChart.resize();
  barChart.update();
}

function updateTable(filtered) {
  const tbody = document.getElementById('tableBody');
  const col = state.sortColumn;
  const dir = state.sortDirection;

  const sorted = [...filtered].sort((a, b) => {
    let va = a[col], vb = b[col];
    if (typeof va === 'string') {
      return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return dir === 'asc' ? va - vb : vb - va;
  });

  // Get min/max for color scales, default to 0 and 100 if empty
  const perfVals = filtered.map(m => m.performance);
  const valVals = filtered.map(m => m.value);
  const perfMin = perfVals.length > 0 ? Math.min(...perfVals) : 0;
  const perfMax = perfVals.length > 0 ? Math.max(...perfVals) : 100;
  const valMin = valVals.length > 0 ? Math.min(...valVals) : 0;
  const valMax = valVals.length > 0 ? Math.max(...valVals) : 100;

  if (sorted.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">
          <p style="margin-bottom: 8px;">No models match your filters</p>
          <button class="reset-btn" onclick="resetFilters()">Reset Filters</button>
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = sorted.map(m => `
      <tr>
        <td><span class="provider-dot" style="background:${providerColor(m.provider)}"></span>${m.provider}</td>
        <td>${m.model}</td>
        <td class="num">$${m.inputPrice.toFixed(2)}</td>
        <td class="num">$${m.outputPrice.toFixed(2)}</td>
        <td class="num">$${m.blended.toFixed(4)}</td>
        <td class="num">${m.livebench.toFixed(2)}</td>
        <td class="num">${m.aaScore}</td>
        <td class="num" style="color:${colorScale(m.performance, perfMin, perfMax)};font-weight:600">${m.performance.toFixed(1)}</td>
        <td class="num" style="color:${colorScale(m.value, valMin, valMax)};font-weight:600">${m.value.toFixed(1)}</td>
      </tr>
    `).join('');
  }

  // Update sort indicators on headers
  document.querySelectorAll('#modelTable th').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.sort === col) {
      th.classList.add(dir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

function updateFormulaP() {
  document.getElementById('formulaPVal').textContent = state.p.toFixed(2);
}

// ===== MASTER UPDATE =====
function updateAll() {
  const allModels = computeAllMetrics(RAW_DATA, state.p);
  const filtered = getFilteredModels(allModels);
  updateSummaryCards(filtered);
  updateLeaderboard(filtered);
  updateScatterChart(filtered);
  updateBarChart(filtered);
  updateTable(filtered);
  updateFormulaP();
}

// ===== PROVIDER PILLS STATE HELPERS =====
function setPillState(pill, p, active) {
  if (active) {
    pill.classList.add('active');
    pill.style.color = providerColor(p);
    pill.style.borderColor = `rgba(${providerRgb(p)}, 0.4)`;
    pill.style.background = `rgba(${providerRgb(p)}, 0.12)`;
  } else {
    pill.classList.remove('active');
    pill.style.color = 'var(--text-muted)';
    pill.style.borderColor = 'var(--glass-border)';
    pill.style.background = 'transparent';
  }
}

function updatePriceRangeSliderHighlight() {
  const minVal = state.priceMin;
  const maxVal = state.priceMax;
  const sliderMax = parseFloat(document.getElementById('priceMax').max) || 12;
  const minPercent = (minVal / sliderMax) * 100;
  const maxPercent = (maxVal / sliderMax) * 100;
  const highlight = document.getElementById('priceRangeHighlight');
  if (highlight) {
    highlight.style.left = minPercent + '%';
    highlight.style.width = (maxPercent - minPercent) + '%';
  }
}

function resetFilters() {
  // Compute the current slider max from the data
  const allModels = computeAllMetrics(RAW_DATA, 0);
  const maxBlended = Math.max(...allModels.map(m => m.blended));
  const sliderMax = Math.ceil(maxBlended);

  state.p = 0.2;
  state.search = '';
  state.priceMin = 0;
  state.priceMax = sliderMax;
  state.perfThreshold = 0;
  state.activeProviders = new Set(ALL_PROVIDERS);

  // Reset controls in the DOM
  document.getElementById('pSlider').value = 0.2;
  document.getElementById('pValue').textContent = '0.20';
  document.getElementById('searchInput').value = '';
  document.getElementById('priceMin').value = 0;
  document.getElementById('priceMax').value = sliderMax;
  document.getElementById('priceMinVal').textContent = '0.00';
  document.getElementById('priceMaxVal').textContent = sliderMax.toFixed(2);
  document.getElementById('perfThreshold').value = 0;
  document.getElementById('perfThresholdVal').textContent = '0';

  // Update provider pills visually
  document.querySelectorAll('.provider-pill').forEach(pill => {
    setPillState(pill, pill.dataset.provider, true);
  });

  // Update dual range slider highlight
  updatePriceRangeSliderHighlight();

  // Trigger redraw
  updateAll();
}

// ===== PROVIDER PILLS =====
function initProviderPills() {
  const container = document.getElementById('providerPills');
  ALL_PROVIDERS.forEach(p => {
    const pill = document.createElement('button');
    pill.className = 'provider-pill';
    pill.dataset.provider = p;
    pill.innerHTML = `<span class="dot" style="background:${providerColor(p)}"></span>${p}`;

    setPillState(pill, p, state.activeProviders.has(p));

    pill.addEventListener('click', () => {
      if (state.activeProviders.has(p)) {
        state.activeProviders.delete(p);
        setPillState(pill, p, false);
      } else {
        state.activeProviders.add(p);
        setPillState(pill, p, true);
      }
      updateAll();
    });

    container.appendChild(pill);
  });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // P slider
  document.getElementById('pSlider').addEventListener('input', e => {
    state.p = parseFloat(e.target.value);
    document.getElementById('pValue').textContent = state.p.toFixed(2);
    updateAll();
  });

  // Search (debounced)
  document.getElementById('searchInput').addEventListener('input', debounce(e => {
    state.search = e.target.value;
    updateAll();
  }, 200));

  const priceMinInput = document.getElementById('priceMin');
  const priceMaxInput = document.getElementById('priceMax');

  // Price range — min
  priceMinInput.addEventListener('input', e => {
    let val = parseFloat(e.target.value);
    if (val > state.priceMax) val = state.priceMax;
    state.priceMin = val;
    e.target.value = val;
    document.getElementById('priceMinVal').textContent = val.toFixed(2);
    priceMinInput.style.zIndex = '10';
    priceMaxInput.style.zIndex = '9';
    updatePriceRangeSliderHighlight();
    updateAll();
  });

  // Price range — max
  priceMaxInput.addEventListener('input', e => {
    let val = parseFloat(e.target.value);
    if (val < state.priceMin) val = state.priceMin;
    state.priceMax = val;
    e.target.value = val;
    document.getElementById('priceMaxVal').textContent = val.toFixed(2);
    priceMinInput.style.zIndex = '9';
    priceMaxInput.style.zIndex = '10';
    updatePriceRangeSliderHighlight();
    updateAll();
  });

  // Provider Select All
  document.getElementById('providerSelectAll').addEventListener('click', () => {
    ALL_PROVIDERS.forEach(p => state.activeProviders.add(p));
    document.querySelectorAll('.provider-pill').forEach(pill => {
      setPillState(pill, pill.dataset.provider, true);
    });
    updateAll();
  });

  // Provider Clear All
  document.getElementById('providerClearAll').addEventListener('click', () => {
    state.activeProviders.clear();
    document.querySelectorAll('.provider-pill').forEach(pill => {
      setPillState(pill, pill.dataset.provider, false);
    });
    updateAll();
  });

  // Performance threshold
  document.getElementById('perfThreshold').addEventListener('input', e => {
    state.perfThreshold = parseFloat(e.target.value);
    document.getElementById('perfThresholdVal').textContent = Math.round(state.perfThreshold);
    updateAll();
  });

  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      // Charts need a resize after being shown
      if (btn.dataset.tab === 'charts') {
        setTimeout(() => {
          scatterChart.resize();
          barChart.resize();
        }, 50);
      }
    });
  });

  // Table header sorting
  document.querySelectorAll('#modelTable th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortColumn === key) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortColumn = key;
        state.sortDirection = (key === 'provider' || key === 'model') ? 'asc' : 'desc';
      }
      updateAll();
    });
  });

  // Bar chart metric selector
  document.getElementById('barMetricSelect').addEventListener('change', e => {
    state.barMetric = e.target.value;
    updateAll();
  });
}

// ===== INIT =====
async function init() {
  // Apply fallback data immediately for instant render
  applyData(FALLBACK_DATA);
  state.activeProviders = new Set(ALL_PROVIDERS);

  // Initialize UI
  initCharts();
  initProviderPills();
  initEventListeners();
  updateSliderBounds();
  updatePriceRangeSliderHighlight();
  updateAll();

  // Fetch fresh data in the background (non-blocking)
  await loadData();
}

document.addEventListener('DOMContentLoaded', init);
