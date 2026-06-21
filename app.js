// ===== FALLBACK DATA =====
// Embedded snapshot for instant rendering. Overridden by data.json when available.
const FALLBACK_DATA = {
  lastUpdated: '2026-06-21',
  providers: {
    'DeepSeek':    { color: '#22d3ee' },
    'Z.ai':        { color: '#6366f1' },
    'MiniMax':     { color: '#f472b6' },
    'OpenAI':      { color: '#10b981' },
    'Google':      { color: '#3b82f6' },
    'Alibaba':     { color: '#fb923c' },
    'Anthropic':   { color: '#fbbf24' },
    'Moonshot AI': { color: '#c084fc' },
    'Mistral AI':  { color: '#2dd4bf' },
    'NVIDIA':      { color: '#84cc16' },
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
  hex = hex.replace(/^#/, '').toLowerCase();
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

// ===== TIMESTAMP FORMATTING =====
function formatLastUpdated(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const year = parts[0];
  const month = months[parseInt(parts[1], 10) - 1];
  const day = parseInt(parts[2], 10);
  return `${month} ${day}, ${year}`;
}

// ===== DATA LOADING =====
function applyData(data) {
  RAW_DATA = data.models;
  PROVIDER_COLORS = buildProviderColors(data.providers);
  ALL_PROVIDERS = deriveProviderList(data.models);

  for (const name of Object.keys(data.providers)) {
    if (!ALL_PROVIDERS.includes(name)) {
      ALL_PROVIDERS.push(name);
    }
  }

  // Update dynamic subtitle
  const modelCountEl = document.getElementById('modelCountVal');
  const providerCountEl = document.getElementById('providerCountVal');
  const lastUpdatedEl = document.getElementById('lastUpdatedVal');
  if (modelCountEl) modelCountEl.textContent = RAW_DATA.length;
  if (providerCountEl) providerCountEl.textContent = ALL_PROVIDERS.length;
  if (lastUpdatedEl && data.lastUpdated) {
    lastUpdatedEl.textContent = `Data as of ${formatLastUpdated(data.lastUpdated)}`;
  }
}

function updateSliderBounds() {
  const allModels = computeAllMetrics(RAW_DATA, 0);
  const maxBlended = Math.max(...allModels.map(m => m.blended));
  const sliderMax = Math.ceil(maxBlended);

  const priceMinInput = document.getElementById('priceMin');
  const priceMaxInput = document.getElementById('priceMax');

  const oldMax = parseFloat(priceMaxInput.max) || 12;

  priceMinInput.max = sliderMax;
  priceMaxInput.max = sliderMax;

  if (state.priceMax >= oldMax || state.priceMax >= sliderMax) {
    state.priceMax = sliderMax;
    priceMaxInput.value = sliderMax;
    document.getElementById('priceMaxVal').textContent = sliderMax.toFixed(2);
  }

  updatePriceRangeSliderHighlight();
}

function reinitProviderPills() {
  const container = document.getElementById('providerPills');
  container.innerHTML = '';

  ALL_PROVIDERS.forEach(p => {
    if (!state.activeProviders.has(p)) {
      state.activeProviders.add(p);
    }
  });

  for (const p of state.activeProviders) {
    if (!ALL_PROVIDERS.includes(p)) {
      state.activeProviders.delete(p);
    }
  }

  initProviderPills();
}

// Returns the fetched data object, or FALLBACK_DATA on failure.
async function loadData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!validateData(data)) {
      console.warn('[LLM Analysis] Fetched data.json failed schema validation — using fallback data.');
      return FALLBACK_DATA;
    }

    return data;
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
    return FALLBACK_DATA;
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
  highlightedModel: null,
  _barKeys: [],
  cardValues: {
    bestValue: 0,
    bestPerf: 0,
    cheapest: 0,
    expensive: 0,
  },
};

// ===== COMPUTATION =====
function computeBlended(inputPrice, outputPrice) {
  return 0.9573 * inputPrice + 0.0427 * outputPrice;
}

function computeAllMetrics(data, p) {
  const models = data.map(d => ({ ...d, blended: computeBlended(d.inputPrice, d.outputPrice) }));

  const lbMin = Math.min(...models.map(m => m.livebench));
  const lbMax = Math.max(...models.map(m => m.livebench));
  const aaMin = Math.min(...models.map(m => m.aaScore));
  const aaMax = Math.max(...models.map(m => m.aaScore));

  models.forEach(m => {
    const lbNorm = (lbMax - lbMin) === 0 ? 0 : (m.livebench - lbMin) / (lbMax - lbMin);
    const aaNorm = (aaMax - aaMin) === 0 ? 0 : (m.aaScore - aaMin) / (aaMax - aaMin);
    m.performance = (0.5 * lbNorm + 0.5 * aaNorm) * 100;
  });

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

function modelKey(m) {
  return m.provider + '|' + m.model;
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
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const datasetIndex = elements[0].datasetIndex;
          const modelData = scatterChart.data.datasets[datasetIndex].data[index];
          toggleHighlight(modelData.provider + '|' + modelData.model);
        } else {
          toggleHighlight(null);
        }
      },
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
              `Blended: $${item.raw.blended.toFixed(2)}`,
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
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          toggleHighlight(state._barKeys[index]);
        } else {
          toggleHighlight(null);
        }
      },
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
  document.getElementById('bestPerfModel').textContent = bestPerf.model;
  document.getElementById('cheapestModel').textContent = cheapest.model;
  document.getElementById('expensiveModel').textContent = expensive.model;

  animateValue(document.getElementById('bestValueStat'), state.cardValues.bestValue, bestValue.value, 400, false);
  animateValue(document.getElementById('bestPerfStat'), state.cardValues.bestPerf, bestPerf.performance, 400, false);
  animateValue(document.getElementById('cheapestStat'), state.cardValues.cheapest, cheapest.blended, 400, true);
  animateValue(document.getElementById('expensiveStat'), state.cardValues.expensive, expensive.blended, 400, true);

  state.cardValues.bestValue = bestValue.value;
  state.cardValues.bestPerf = bestPerf.performance;
  state.cardValues.cheapest = cheapest.blended;
  state.cardValues.expensive = expensive.blended;
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

  btn.style.display = filtered.length > 10 ? 'flex' : 'none';

  list.innerHTML = display.map((m, i) => `
    <div class="leaderboard-row ${state.highlightedModel === modelKey(m) ? 'highlighted' : ''}" data-key="${modelKey(m)}" data-model="${m.model}" tabindex="0" role="button">
      <span class="leaderboard-rank ${i < 3 ? 'top' : ''}">#${i + 1}</span>
      <span class="leaderboard-dot" style="background:${providerColor(m.provider)}"></span>
      <span class="leaderboard-name">${m.model} <span class="leaderboard-provider">${m.provider}</span></span>
      <div class="leaderboard-bar-track">
        <div class="leaderboard-bar-fill" style="width:0%; background:${providerColor(m.provider)}" data-width="${m.performance.toFixed(1)}%"></div>
      </div>
      <span class="leaderboard-score">${m.performance.toFixed(1)}</span>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    list.querySelectorAll('.leaderboard-bar-fill').forEach(fill => {
      fill.style.width = fill.dataset.width;
    });
  });
}

function updateScatterChart(filtered) {
  if (filtered.length === 0) {
    scatterChart.data.datasets[0].data = [];
    scatterChart.options.scales.x.labels = [];
    scatterChart.update();
    return;
  }

  const uniqueCosts = [...new Set(filtered.map(m => m.blended))].sort((a, b) => a - b);
  const labels = [...new Set(uniqueCosts.map(c => '$' + c.toFixed(2)))];

  scatterChart.options.scales.x.labels = labels;

  scatterChart.data.datasets[0].data = filtered.map(m => ({
    x: '$' + m.blended.toFixed(2),
    y: m.performance,
    model: m.model,
    provider: m.provider,
    value: m.value,
    blended: m.blended,
  }));

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const highlightBorder = isLight ? '#0f172a' : '#ffffff';

  scatterChart.data.datasets[0].backgroundColor = filtered.map(m => {
    const isHighlighted = state.highlightedModel === modelKey(m);
    const baseColor = providerRgb(m.provider);
    if (state.highlightedModel) {
      return isHighlighted ? `rgba(${baseColor}, 0.85)` : `rgba(${baseColor}, 0.15)`;
    }
    return `rgba(${baseColor}, 0.6)`;
  });
  scatterChart.data.datasets[0].borderColor = filtered.map(m => {
    const isHighlighted = state.highlightedModel === modelKey(m);
    if (state.highlightedModel) {
      return isHighlighted ? highlightBorder : `rgba(${providerRgb(m.provider)}, 0.2)`;
    }
    return providerColor(m.provider);
  });
  scatterChart.data.datasets[0].pointRadius = filtered.map(m => state.highlightedModel === modelKey(m) ? 11 : 7);
  scatterChart.data.datasets[0].pointHoverRadius = filtered.map(m => state.highlightedModel === modelKey(m) ? 13 : 10);
  scatterChart.data.datasets[0].borderWidth = filtered.map(m => state.highlightedModel === modelKey(m) ? 3 : 1.5);

  scatterChart.update();
}

function updateBarChart(filtered) {
  const metric = state.barMetric;
  const isAsc = metric === 'blended';
  const sorted = [...filtered].sort((a, b) => isAsc ? a[metric] - b[metric] : b[metric] - a[metric]);

  const metricLabels = { value: 'Value Score', performance: 'Performance', blended: 'Blended Cost ($/1M)', livebench: 'LiveBench', aaScore: 'AA Score' };
  barChart.options.scales.x.title.text = metricLabels[metric] || metric;

  const barHeight = Math.max(350, sorted.length * 28 + 60);
  document.getElementById('barChart').parentElement.style.height = barHeight + 'px';

  state._barKeys = sorted.map(m => modelKey(m));
  barChart.data.labels = sorted.map(m => m.model);
  barChart.data.datasets[0].data = sorted.map(m => m[metric]);

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const highlightBorder = isLight ? '#0f172a' : '#ffffff';

  barChart.data.datasets[0].backgroundColor = sorted.map(m => {
    const isHighlighted = state.highlightedModel === modelKey(m);
    const baseColor = providerRgb(m.provider);
    if (state.highlightedModel) {
      return isHighlighted ? `rgba(${baseColor}, 0.95)` : `rgba(${baseColor}, 0.15)`;
    }
    return `rgba(${baseColor}, 0.7)`;
  });
  barChart.data.datasets[0].borderColor = sorted.map(m => {
    const isHighlighted = state.highlightedModel === modelKey(m);
    if (state.highlightedModel) {
      return isHighlighted ? highlightBorder : `rgba(${providerRgb(m.provider)}, 0.2)`;
    }
    return providerColor(m.provider);
  });
  barChart.data.datasets[0].borderWidth = sorted.map(m => state.highlightedModel === modelKey(m) ? 2.5 : 1);

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
      <tr data-key="${modelKey(m)}" data-model="${m.model}" class="${state.highlightedModel === modelKey(m) ? 'highlighted' : ''}" tabindex="0" role="row">
        <td><span class="provider-dot" style="background:${providerColor(m.provider)}"></span>${m.provider}</td>
        <td>${m.model}</td>
        <td class="num">$${m.inputPrice.toFixed(2)}</td>
        <td class="num">$${m.outputPrice.toFixed(2)}</td>
        <td class="num">$${m.blended.toFixed(2)}</td>
        <td class="num">${m.livebench.toFixed(2)}</td>
        <td class="num">${m.aaScore}</td>
        <td class="num" style="color:${colorScale(m.performance, perfMin, perfMax)};font-weight:600">${m.performance.toFixed(1)}</td>
        <td class="num" style="color:${colorScale(m.value, valMin, valMax)};font-weight:600">${m.value.toFixed(1)}</td>
      </tr>
    `).join('');
  }

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
  const allModels = computeAllMetrics(RAW_DATA, 0);
  const maxBlended = Math.max(...allModels.map(m => m.blended));
  const sliderMax = Math.ceil(maxBlended);

  state.p = 0.2;
  state.search = '';
  state.priceMin = 0;
  state.priceMax = sliderMax;
  state.perfThreshold = 0;
  state.activeProviders = new Set(ALL_PROVIDERS);

  document.getElementById('pSlider').value = 0.2;
  document.getElementById('pValue').textContent = '0.20';
  document.getElementById('searchInput').value = '';
  document.getElementById('priceMin').value = 0;
  document.getElementById('priceMax').value = sliderMax;
  document.getElementById('priceMinVal').textContent = '0.00';
  document.getElementById('priceMaxVal').textContent = sliderMax.toFixed(2);
  document.getElementById('perfThreshold').value = 0;
  document.getElementById('perfThresholdVal').textContent = '0';

  document.querySelectorAll('.provider-pill').forEach(pill => {
    setPillState(pill, pill.dataset.provider, true);
  });

  updatePriceRangeSliderHighlight();
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
  document.getElementById('pSlider').addEventListener('input', e => {
    state.p = parseFloat(e.target.value);
    document.getElementById('pValue').textContent = state.p.toFixed(2);
    updateAll();
  });

  document.getElementById('searchInput').addEventListener('input', debounce(e => {
    state.search = e.target.value;
    updateAll();
  }, 200));

  const priceMinInput = document.getElementById('priceMin');
  const priceMaxInput = document.getElementById('priceMax');

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

  document.getElementById('providerSelectAll').addEventListener('click', () => {
    ALL_PROVIDERS.forEach(p => state.activeProviders.add(p));
    document.querySelectorAll('.provider-pill').forEach(pill => {
      setPillState(pill, pill.dataset.provider, true);
    });
    updateAll();
  });

  document.getElementById('providerClearAll').addEventListener('click', () => {
    state.activeProviders.clear();
    document.querySelectorAll('.provider-pill').forEach(pill => {
      setPillState(pill, pill.dataset.provider, false);
    });
    updateAll();
  });

  document.getElementById('perfThreshold').addEventListener('input', e => {
    state.perfThreshold = parseFloat(e.target.value);
    document.getElementById('perfThresholdVal').textContent = Math.round(state.perfThreshold);
    updateAll();
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      if (btn.dataset.tab === 'charts') {
        setTimeout(() => {
          scatterChart.resize();
          barChart.resize();
        }, 50);
      }
    });
  });

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

  document.getElementById('barMetricSelect').addEventListener('change', e => {
    state.barMetric = e.target.value;
    updateAll();
  });

  // Table row click/keyboard highlighting
  document.getElementById('tableBody').addEventListener('click', e => {
    const tr = e.target.closest('tr');
    if (tr && tr.dataset.key) toggleHighlight(tr.dataset.key);
  });
  document.getElementById('tableBody').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const tr = e.target.closest('tr');
      if (tr && tr.dataset.key) { e.preventDefault(); toggleHighlight(tr.dataset.key); }
    }
  });

  // Leaderboard row click/keyboard highlighting
  document.getElementById('leaderboardList').addEventListener('click', e => {
    const row = e.target.closest('.leaderboard-row');
    if (row && row.dataset.key) toggleHighlight(row.dataset.key);
  });
  document.getElementById('leaderboardList').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const row = e.target.closest('.leaderboard-row');
      if (row && row.dataset.key) { e.preventDefault(); toggleHighlight(row.dataset.key); }
    }
  });
}

// ===== THEME MANAGEMENT =====
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(defaultTheme);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('theme', theme);
  updateChartColors(theme);
}

function updateChartColors(theme) {
  const isLight = theme === 'light';
  const gridColor = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.06)';
  const textColor = isLight ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  const tickColor = isLight ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)';

  const tooltipStyle = isLight ? {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderWidth: 1,
    titleColor: '#0f172a',
    bodyColor: 'rgba(15, 23, 42, 0.8)',
    titleFont: { family: 'Inter', weight: '600' },
    bodyFont: { family: 'Inter' },
    padding: 12,
  } : {
    backgroundColor: 'rgba(15, 15, 26, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    titleColor: '#fff',
    bodyColor: 'rgba(255, 255, 255, 0.8)',
    titleFont: { family: 'Inter', weight: '600' },
    bodyFont: { family: 'Inter' },
    padding: 12,
  };

  [scatterChart, barChart].forEach(chart => {
    if (!chart) return;

    if (chart.options.scales.x) {
      if (chart.options.scales.x.grid) chart.options.scales.x.grid.color = gridColor;
      if (chart.options.scales.x.ticks) chart.options.scales.x.ticks.color = tickColor;
      if (chart.options.scales.x.title) chart.options.scales.x.title.color = textColor;
    }

    if (chart.options.scales.y) {
      if (chart.options.scales.y.grid) chart.options.scales.y.grid.color = gridColor;
      if (chart.options.scales.y.ticks) chart.options.scales.y.ticks.color = tickColor;
      if (chart.options.scales.y.title) chart.options.scales.y.title.color = textColor;
    }

    if (chart.options.plugins && chart.options.plugins.tooltip) {
      Object.assign(chart.options.plugins.tooltip, tooltipStyle);
    }

    chart.update('none');
  });
}

// ===== COUNTER ANIMATION =====
// Per-element rAF handle map; cancel any in-progress loop before starting a new one.
const _animHandles = new WeakMap();

function animateValue(element, start, end, duration = 400, isPrice = false) {
  if (isNaN(start)) start = 0;
  if (isNaN(end)) end = 0;

  // Cancel any in-progress animation on this element
  const existing = _animHandles.get(element);
  if (existing != null) cancelAnimationFrame(existing);

  const format = v => isPrice ? '$' + v.toFixed(2) : v.toFixed(1);

  // Instant set for same value or when user prefers reduced motion
  if (start === end || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = format(end);
    _animHandles.delete(element);
    return;
  }

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress * (2 - progress); // ease-out quad
    element.textContent = format(start + (end - start) * ease);

    if (progress < 1) {
      _animHandles.set(element, requestAnimationFrame(update));
    } else {
      element.textContent = format(end);
      _animHandles.delete(element);
    }
  }

  _animHandles.set(element, requestAnimationFrame(update));
}

// ===== DUAL SLIDER OVERLAP FIX =====
function initRangeSliderZIndexFix() {
  const dualSliderContainer = document.querySelector('.dual-slider');
  const priceMinInput = document.getElementById('priceMin');
  const priceMaxInput = document.getElementById('priceMax');

  function handleDualSliderPointer(e) {
    const rect = dualSliderContainer.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clickPercent = (clientX - rect.left) / rect.width;

    const sliderMax = parseFloat(priceMaxInput.max) || 12;
    const clickValue = clickPercent * sliderMax;

    const distMin = Math.abs(clickValue - state.priceMin);
    const distMax = Math.abs(clickValue - state.priceMax);

    if (distMin < distMax) {
      priceMinInput.style.zIndex = '10';
      priceMaxInput.style.zIndex = '9';
    } else {
      priceMinInput.style.zIndex = '9';
      priceMaxInput.style.zIndex = '10';
    }
  }

  dualSliderContainer.addEventListener('mousedown', handleDualSliderPointer);
  dualSliderContainer.addEventListener('touchstart', handleDualSliderPointer, { passive: true });
}

// ===== HIGHLIGHTING MANAGEMENT =====
function toggleHighlight(modelName) {
  state.highlightedModel = state.highlightedModel === modelName ? null : modelName;
  updateHighlights();
}

function updateHighlights() {
  const modelName = state.highlightedModel;

  document.querySelectorAll('#tableBody tr').forEach(tr => {
    if (tr.dataset.key) {
      tr.classList.toggle('highlighted', tr.dataset.key === modelName);
    }
  });

  document.querySelectorAll('.leaderboard-row').forEach(row => {
    if (row.dataset.key) {
      row.classList.toggle('highlighted', row.dataset.key === modelName);
    }
  });

  const allModels = computeAllMetrics(RAW_DATA, state.p);
  const filtered = getFilteredModels(allModels);
  updateScatterChart(filtered);
  updateBarChart(filtered);
}

// ===== SKELETON REMOVAL =====
function removeSkeletons() {
  document.querySelectorAll('.skeleton-element').forEach(el => {
    el.classList.remove('skeleton-element', 'pulse');
  });
}

// ===== INIT =====
async function init() {
  // Setup theme before charts so first paint uses correct colors
  initTheme();

  // Apply fallback data and render immediately (instant render — no delay)
  applyData(FALLBACK_DATA);
  state.activeProviders = new Set(ALL_PROVIDERS);

  initCharts();
  initProviderPills();
  initEventListeners();
  initRangeSliderZIndexFix();
  updateSliderBounds();
  updatePriceRangeSliderHighlight();

  // First paint with fallback data; remove skeleton state
  updateAll();
  removeSkeletons();

  // Fetch fresh data in the background — swap and refresh only if different
  loadData().then(data => {
    const sameModels = JSON.stringify(data.models) === JSON.stringify(FALLBACK_DATA.models);
    const sameProviders = JSON.stringify(data.providers) === JSON.stringify(FALLBACK_DATA.providers);

    if (!sameModels || !sameProviders) {
      applyData(data);
      state.activeProviders = new Set(ALL_PROVIDERS);
      reinitProviderPills();
      updateSliderBounds();
      updatePriceRangeSliderHighlight();
      updateAll();
      console.info('[LLM Analysis] Data refreshed from data.json.');
    } else {
      console.info('[LLM Analysis] data.json matches fallback — no update needed.');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
