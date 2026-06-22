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
    { provider: 'DeepSeek',    model: 'DeepSeek V3.2',          inputPrice: 0.2288, outputPrice: 0.3432, livebench: 62.20, aaScore: 33 },
    { provider: 'Alibaba',     model: 'Qwen 3.6 Plus',          inputPrice: 0.325, outputPrice: 1.95,  livebench: 70.85, aaScore: 40 },
    { provider: 'Moonshot AI', model: 'Kimi K2.7 Code',          inputPrice: 0.95,  outputPrice: 4.0,   livebench: 71.89, aaScore: 42 },
    { provider: 'OpenAI',      model: 'gpt-oss-120b',           inputPrice: 0.039, outputPrice: 0.18,  livebench: 46.09, aaScore: 24 },
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
let GLOBAL_LOG_MIN = 0;
let GLOBAL_LOG_MAX = 0;

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

  // Calculate global min/max log blended costs
  const blendedCosts = data.models.map(m => computeBlended(m.inputPrice, m.outputPrice));
  const floorCosts = blendedCosts.map(c => Math.max(c, 0.01));
  GLOBAL_LOG_MIN = Math.log10(Math.min(...floorCosts));
  GLOBAL_LOG_MAX = Math.log10(Math.max(...floorCosts));

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

function reinitProviderPills(oldProvidersSet) {
  const container = document.getElementById('providerPills');
  container.innerHTML = '';

  ALL_PROVIDERS.forEach(p => {
    if (oldProvidersSet && !oldProvidersSet.has(p)) {
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
  p: 0.07,
  search: '',
  priceMin: 0,
  priceMax: 12,
  perfThreshold: 70,
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

  const lbMax = Math.max(...models.map(m => m.livebench));
  const aaMax = Math.max(...models.map(m => m.aaScore));

  models.forEach(m => {
    const lbNorm = lbMax === 0 ? 0 : m.livebench / lbMax;
    const aaNorm = aaMax === 0 ? 0 : m.aaScore / aaMax;
    m.performance = (0.5 * lbNorm + 0.5 * aaNorm) * 100;
  });

  models.forEach(m => {
    m.value = m.blended > 0 && p > 0 ? m.performance / Math.pow(m.blended, p) : m.performance;
  });

  return models;
}

function getParetoFrontier(filtered) {
  if (filtered.length === 0) return [];
  const sorted = [...filtered].sort((a, b) => {
    if (a.blended === b.blended) return b.performance - a.performance;
    return a.blended - b.blended;
  });

  const frontier = [];
  let maxPerf = -1;

  for (const m of sorted) {
    if (m.performance > maxPerf) {
      frontier.push(m);
      maxPerf = m.performance;
    }
  }
  return frontier;
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
let scatterChart, barChart, radarChart;

function initCharts() {
  const tooltipStyle = {
    backgroundColor: 'rgba(15,15,26,0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    titleColor: '#fff',
    bodyColor: 'rgba(255,255,255,0.8)',
    padding: 12,
    titleFont: { family: 'JetBrains Mono', weight: '600' },
    bodyFont: { family: 'JetBrains Mono' },
  };

  scatterChart = new Chart(document.getElementById('scatterChart'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Models',
          data: [],
          pointStyle: 'rect',
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 1.5
        },
        {
          label: 'Pareto Frontier',
          type: 'line',
          data: [],
          fill: false,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.15,
          showLine: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const datasetIndex = elements[0].datasetIndex;
          if (datasetIndex === 0) {
            const index = elements[0].index;
            const modelData = scatterChart.data.datasets[0].data[index];
            toggleHighlight(modelData.provider + '|' + modelData.model);
          }
        } else {
          toggleHighlight(null);
        }
      },
      scales: {
        x: {
          type: 'category',
          offset: true,
          title: { display: true, text: 'Blended Cost ($/1M tokens)', color: 'rgba(255,255,255,0.7)', font: { family: 'JetBrains Mono' } },
          ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'JetBrains Mono', size: 10 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
        y: {
          title: { display: true, text: 'Performance Score', color: 'rgba(255,255,255,0.7)', font: { family: 'JetBrains Mono' } },
          ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'JetBrains Mono', size: 10 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
          grace: '5%',
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            title: items => {
              if (items[0].datasetIndex === 1) return 'Pareto Frontier';
              return items[0].raw.model;
            },
            label: item => {
              if (item.datasetIndex === 1) {
                return 'Optimized cost/performance boundary';
              }
              return [
                `Provider: ${item.raw.provider}`,
                `Blended: $${item.raw.blended.toFixed(2)}`,
                `Performance: ${item.raw.y.toFixed(1)}`,
                `Value: ${item.raw.value.toFixed(1)}`,
              ];
            },
          },
        },
      },
    },
  });

  barChart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], borderWidth: 1, borderRadius: 0 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 12
        }
      },
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
          title: { display: true, text: 'Value Score', color: 'rgba(255,255,255,0.7)', font: { family: 'JetBrains Mono' } },
          ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'JetBrains Mono', size: 10 } },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
        y: {
          ticks: {
            color: 'rgba(255,255,255,0.7)',
            font: { family: 'JetBrains Mono', size: 10 },
            autoSkip: false
          },
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

  radarChart = new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: ['Value Score', 'Performance', 'Cost Efficiency', 'LiveBench (Norm)', 'AA Score (Norm)'],
      datasets: [
        {
          label: 'Filtered Average',
          data: [],
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: 'rgba(99, 102, 241, 0.4)',
          borderWidth: 1.5,
          pointStyle: 'rect',
          pointRadius: 4,
        },
        {
          label: 'Highlighted Model',
          data: [],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
          pointStyle: 'rectRot',
          pointRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.06)' },
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'JetBrains Mono', size: 9, weight: '500' } },
          ticks: {
            color: 'rgba(255, 255, 255, 0.4)',
            backdropColor: 'transparent',
            font: { family: 'JetBrains Mono', size: 8 },
            stepSize: 20
          },
          min: 0,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'JetBrains Mono', size: 10 } }
        },
        tooltip: {
          ...tooltipStyle,
          callbacks: {
            label: item => `${item.dataset.label}: ${item.raw.toFixed(1)}`
          }
        }
      }
    }
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
    if (scatterChart.data.datasets[1]) {
      scatterChart.data.datasets[1].data = [];
    }
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

  if (scatterChart.data.datasets[1]) {
    const paretoFrontier = getParetoFrontier(filtered);
    scatterChart.data.datasets[1].data = paretoFrontier.map(m => ({
      x: '$' + m.blended.toFixed(2),
      y: m.performance
    }));
  }

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

  const barHeight = Math.max(280, sorted.length * 22 + 50);
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

function updateRadarChart(filtered) {
  if (!radarChart) return;

  if (filtered.length === 0) {
    radarChart.data.datasets[0].data = [];
    radarChart.data.datasets[1].data = [];
    radarChart.update();
    return;
  }

  // 1. Calculate the Max/Min bounds in the filtered set for normalization
  const lbMax = Math.max(...RAW_DATA.map(m => m.livebench));
  const aaMax = Math.max(...RAW_DATA.map(m => m.aaScore));
  const maxValue = Math.max(...filtered.map(m => m.value));

  // 2. Calculate the averages of the filtered models
  let sumValue = 0, sumPerf = 0, sumCostEff = 0, sumLb = 0, sumAa = 0;
  filtered.forEach(m => {
    const lbNorm = lbMax === 0 ? 0 : (m.livebench / lbMax) * 100;
    const aaNorm = aaMax === 0 ? 0 : (m.aaScore / aaMax) * 100;
    const valNorm = maxValue === 0 ? 0 : (m.value / maxValue) * 100;
    
    const logVal = Math.log10(Math.max(m.blended, 0.01));
    const costEff = (GLOBAL_LOG_MAX === GLOBAL_LOG_MIN)
      ? 100
      : ((GLOBAL_LOG_MAX - logVal) / (GLOBAL_LOG_MAX - GLOBAL_LOG_MIN)) * 100;

    sumValue += valNorm;
    sumPerf += m.performance;
    sumCostEff += costEff;
    sumLb += lbNorm;
    sumAa += aaNorm;
  });

  const count = filtered.length;
  const avgValue = sumValue / count;
  const avgPerf = sumPerf / count;
  const avgCostEff = sumCostEff / count;
  const avgLb = sumLb / count;
  const avgAa = sumAa / count;

  radarChart.data.datasets[0].data = [avgValue, avgPerf, avgCostEff, avgLb, avgAa];

  // 3. Highlighted Model dataset
  if (state.highlightedModel) {
    const match = filtered.find(m => modelKey(m) === state.highlightedModel);
    if (match) {
      const lbNorm = lbMax === 0 ? 0 : (match.livebench / lbMax) * 100;
      const aaNorm = aaMax === 0 ? 0 : (match.aaScore / aaMax) * 100;
      const valNorm = maxValue === 0 ? 0 : (match.value / maxValue) * 100;
      
      const logVal = Math.log10(Math.max(match.blended, 0.01));
      const costEff = (GLOBAL_LOG_MAX === GLOBAL_LOG_MIN)
        ? 100
        : ((GLOBAL_LOG_MAX - logVal) / (GLOBAL_LOG_MAX - GLOBAL_LOG_MIN)) * 100;

      radarChart.data.datasets[1].data = [valNorm, match.performance, costEff, lbNorm, aaNorm];
      radarChart.data.datasets[1].label = match.model;

      const baseColor = providerRgb(match.provider);
      radarChart.data.datasets[1].backgroundColor = `rgba(${baseColor}, 0.2)`;
      radarChart.data.datasets[1].borderColor = `rgb(${baseColor})`;
      radarChart.data.datasets[1].hidden = false;
    } else {
      radarChart.data.datasets[1].data = [];
      radarChart.data.datasets[1].hidden = true;
    }
  } else {
    radarChart.data.datasets[1].data = [];
    radarChart.data.datasets[1].hidden = true;
  }

  radarChart.update();
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
  updateRadarChart(filtered);
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

  state.p = 0.07;
  state.search = '';
  state.priceMin = 0;
  state.priceMax = sliderMax;
  state.perfThreshold = 70;
  state.activeProviders = new Set(ALL_PROVIDERS);

  document.getElementById('pSlider').value = 0.07;
  document.getElementById('pValue').textContent = '0.07';
  document.getElementById('searchInput').value = '';
  document.getElementById('priceMin').value = 0;
  document.getElementById('priceMax').value = sliderMax;
  document.getElementById('priceMinVal').textContent = '0.00';
  document.getElementById('priceMaxVal').textContent = sliderMax.toFixed(2);
  document.getElementById('perfThreshold').value = 70;
  document.getElementById('perfThresholdVal').textContent = '70';

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
          if (radarChart) radarChart.resize();
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
  const defaultTheme = savedTheme || 'dark';

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
  const paretoColor = isLight ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.4)';

  if (scatterChart && scatterChart.data.datasets[1]) {
    scatterChart.data.datasets[1].borderColor = paretoColor;
  }

  const tooltipStyle = isLight ? {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderWidth: 1,
    titleColor: '#0f172a',
    bodyColor: 'rgba(15, 23, 42, 0.8)',
    titleFont: { family: 'JetBrains Mono', weight: '600' },
    bodyFont: { family: 'JetBrains Mono' },
    padding: 12,
  } : {
    backgroundColor: 'rgba(15, 15, 26, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    titleColor: '#fff',
    bodyColor: 'rgba(255, 255, 255, 0.8)',
    titleFont: { family: 'JetBrains Mono', weight: '600' },
    bodyFont: { family: 'JetBrains Mono' },
    padding: 12,
  };

  [scatterChart, barChart, radarChart].forEach(chart => {
    if (!chart) return;

    if (chart === radarChart) {
      const rScale = chart.options.scales.r;
      if (rScale) {
        if (rScale.angleLines) rScale.angleLines.color = gridColor;
        if (rScale.grid) rScale.grid.color = gridColor;
        if (rScale.pointLabels) rScale.pointLabels.color = textColor;
        if (rScale.ticks) rScale.ticks.color = tickColor;
      }
      if (chart.options.plugins && chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = textColor;
      }
      // Update average dataset colors
      const avgDataset = chart.data.datasets[0];
      if (avgDataset) {
        if (isLight) {
          avgDataset.backgroundColor = 'rgba(79, 70, 229, 0.08)';
          avgDataset.borderColor = 'rgba(79, 70, 229, 0.4)';
        } else {
          avgDataset.backgroundColor = 'rgba(129, 140, 248, 0.1)';
          avgDataset.borderColor = 'rgba(129, 140, 248, 0.4)';
        }
      }
    } else {
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

    if (distMin === distMax) {
      if (clickValue < state.priceMin) {
        priceMinInput.style.zIndex = '10';
        priceMaxInput.style.zIndex = '9';
      } else {
        priceMinInput.style.zIndex = '9';
        priceMaxInput.style.zIndex = '10';
      }
    } else if (distMin < distMax) {
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
  updateRadarChart(filtered);
}

// ===== SKELETON REMOVAL =====
function removeSkeletons() {
  document.querySelectorAll('.skeleton-element').forEach(el => {
    el.classList.remove('skeleton-element', 'pulse');
  });
}

// ===== CHATBOT CONTROLLER =====
const CHAT_STATE = {
  isOpen: false,
  apiKey: localStorage.getItem('openrouter_api_key') || '',
  selectedModel: localStorage.getItem('openrouter_chat_model') || 'google/gemini-3.5-flash',
  reasoningEffort: localStorage.getItem('openrouter_reasoning_effort') || 'high',
  messages: []
};

function initChatResizer() {
  const drawer = document.getElementById('chatDrawer');
  const resizerT = document.getElementById('chatResizerT');
  const resizerL = document.getElementById('chatResizerL');
  const resizerTL = document.getElementById('chatResizerTL');

  if (!drawer || !resizerT || !resizerL || !resizerTL) return;

  // Restore saved dimensions
  const savedWidth = localStorage.getItem('chat_drawer_width');
  const savedHeight = localStorage.getItem('chat_drawer_height');
  const maxWidth = window.innerWidth * 0.95;
  const maxHeight = window.innerHeight * 0.85;

  if (savedWidth && window.innerWidth > 480) {
    const clampedWidth = Math.min(parseInt(savedWidth, 10), maxWidth);
    drawer.style.width = clampedWidth + 'px';
  }
  if (savedHeight && window.innerWidth > 480) {
    const clampedHeight = Math.min(parseInt(savedHeight, 10), maxHeight);
    drawer.style.height = clampedHeight + 'px';
  }

  function setupResizer(resizer, type) {
    resizer.addEventListener('mousedown', onMouseDown);
    resizer.addEventListener('touchstart', onTouchStart, { passive: false });

    function onMouseDown(e) {
      e.preventDefault();
      startResize(e.clientX, e.clientY);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    function onTouchStart(e) {
      if (e.touches.length > 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      startResize(touch.clientX, touch.clientY);
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }

    let startX, startY, startWidth, startHeight;

    function startResize(clientX, clientY) {
      if (window.innerWidth <= 480) return;

      startX = clientX;
      startY = clientY;
      const rect = drawer.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;

      drawer.classList.add('resizing');
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';

      if (type === 't') document.body.style.cursor = 'ns-resize';
      else if (type === 'l') document.body.style.cursor = 'ew-resize';
      else if (type === 'tl') document.body.style.cursor = 'nwse-resize';
    }

    function moveResize(clientX, clientY) {
      const dx = clientX - startX;
      const dy = clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (type === 't' || type === 'tl') {
        newHeight = startHeight - dy;
      }
      if (type === 'l' || type === 'tl') {
        newWidth = startWidth - dx;
      }

      // Clamp dimensions
      const minWidth = 360;
      const minHeight = 400;
      const maxWidth = window.innerWidth * 0.95;
      const maxHeight = window.innerHeight * 0.85;

      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

      drawer.style.width = newWidth + 'px';
      drawer.style.height = newHeight + 'px';
    }

    function onMouseMove(e) {
      moveResize(e.clientX, e.clientY);
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        moveResize(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    function stopResize() {
      drawer.classList.remove('resizing');
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.cursor = '';

      const rect = drawer.getBoundingClientRect();
      localStorage.setItem('chat_drawer_width', Math.round(rect.width));
      localStorage.setItem('chat_drawer_height', Math.round(rect.height));
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      stopResize();
    }

    function onTouchEnd() {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      stopResize();
    }
  }

  setupResizer(resizerT, 't');
  setupResizer(resizerL, 'l');
  setupResizer(resizerTL, 'tl');
}

function initChatbot() {
  const fab = document.getElementById('chatFab');
  const drawer = document.getElementById('chatDrawer');
  const clearBtn = document.getElementById('chatClearBtn');
  const closeBtn = document.getElementById('chatCloseBtn');
  const settingsBtn = document.getElementById('chatSettingsBtn');
  const apiKeyView = document.getElementById('chatApiKeyView');
  const apiKeyInput = document.getElementById('chatApiKeyInput');
  const saveKeyBtn = document.getElementById('saveApiKeyBtn');
  const clearKeyBtn = document.getElementById('clearApiKeyBtn');
  const modelSelect = document.getElementById('chatModelSelect');
  const reasoningSelect = document.getElementById('chatReasoningSelect');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');

  if (!fab || !drawer) return;

  // Initialize custom resizer handles
  initChatResizer();

  // Load state
  if (CHAT_STATE.apiKey) {
    apiKeyInput.value = CHAT_STATE.apiKey;
    clearKeyBtn.classList.remove('hide');
  } else {
    apiKeyView.classList.remove('hide');
  }

  if (modelSelect) {
    modelSelect.value = CHAT_STATE.selectedModel;
  }
  if (reasoningSelect) {
    reasoningSelect.value = CHAT_STATE.reasoningEffort;
  }

  // Listeners
  fab.addEventListener('click', () => {
    CHAT_STATE.isOpen = !CHAT_STATE.isOpen;
    drawer.classList.toggle('hide', !CHAT_STATE.isOpen);
    if (CHAT_STATE.isOpen) {
      if (!CHAT_STATE.apiKey) {
        apiKeyInput.focus();
      } else {
        chatInput.focus();
      }
      scrollToBottom();
      // Remove badge animation once chat is opened
      document.querySelector('.chat-fab-badge')?.classList.remove('pulse-badge');
    }
  });

  closeBtn.addEventListener('click', () => {
    CHAT_STATE.isOpen = false;
    drawer.classList.add('hide');
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the chat context?')) {
        CHAT_STATE.messages = [];
        const logs = document.getElementById('chatLogs');
        if (logs) {
          logs.innerHTML = `
            <div class="chat-message assistant">
              <div class="chat-sender-label">Assistant</div>
              <div class="message-bubble">
                Hello! I am your Model Assistant. Ask me anything about the model scores, value calculations, or current filter rankings!
              </div>
            </div>
          `;
        }
      }
    });
  }

  settingsBtn.addEventListener('click', () => {
    apiKeyView.classList.toggle('hide');
  });

  saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      CHAT_STATE.apiKey = key;
      localStorage.setItem('openrouter_api_key', key);
      apiKeyView.classList.add('hide');
      clearKeyBtn.classList.remove('hide');
      addSystemMessage('API key saved successfully.');
    } else {
      alert('Please enter a valid OpenRouter API key.');
    }
  });

  clearKeyBtn.addEventListener('click', () => {
    CHAT_STATE.apiKey = '';
    localStorage.removeItem('openrouter_api_key');
    apiKeyInput.value = '';
    clearKeyBtn.classList.add('hide');
    apiKeyView.classList.remove('hide');
    addSystemMessage('API key cleared.');
  });

  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      CHAT_STATE.selectedModel = e.target.value;
      localStorage.setItem('openrouter_chat_model', e.target.value);
    });
  }

  if (reasoningSelect) {
    reasoningSelect.addEventListener('change', (e) => {
      CHAT_STATE.reasoningEffort = e.target.value;
      localStorage.setItem('openrouter_reasoning_effort', e.target.value);
    });
  }

  chatInput.addEventListener('input', () => {
    // Auto-grow textarea height
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(80, chatInput.scrollHeight) + 'px';
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  });

  sendBtn.addEventListener('click', handleChatSubmit);
}

function scrollToBottom() {
  const logs = document.getElementById('chatLogs');
  if (logs) {
    logs.scrollTop = logs.scrollHeight;
  }
}

function addSystemMessage(text) {
  const logs = document.getElementById('chatLogs');
  if (!logs) return;
  const div = document.createElement('div');
  div.className = 'chat-message system';
  div.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
  logs.appendChild(div);
  scrollToBottom();
}

function handleChatSubmit() {
  const chatInput = document.getElementById('chatInput');
  if (!chatInput) return;
  const text = chatInput.value.trim();
  if (!text) return;

  if (!CHAT_STATE.apiKey) {
    const keyView = document.getElementById('chatApiKeyView');
    if (keyView) keyView.classList.remove('hide');
    const keyInput = document.getElementById('chatApiKeyInput');
    if (keyInput) keyInput.focus();
    return;
  }

  // Clear input
  chatInput.value = '';
  chatInput.style.height = 'auto';

  // Append user message
  appendMessage('user', text);

  // Disable inputs during streaming
  setChatLoading(true);

  // Send request
  streamResponse(text).catch(err => {
    console.error(err);
    appendMessage('system', `Error: ${err.message || 'Failed to stream response.'}`);
    setChatLoading(false);
  });
}

function appendMessage(role, text) {
  const logs = document.getElementById('chatLogs');
  if (!logs) return;
  const div = document.createElement('div');
  div.className = `chat-message ${role}`;
  
  if (role === 'system') {
    div.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
  } else {
    const senderName = role === 'user' ? 'You' : 'Assistant';
    div.innerHTML = `
      <div class="chat-sender-label">${senderName}</div>
      <div class="message-bubble">${parseMarkdown(text)}</div>
    `;
  }
  
  logs.appendChild(div);
  scrollToBottom();
  
  // Save to message history
  if (role !== 'system') {
    CHAT_STATE.messages.push({ role, content: text });
  }
}

function setChatLoading(isLoading) {
  const sendBtn = document.getElementById('chatSendBtn');
  const chatInput = document.getElementById('chatInput');
  const statusIndicator = document.querySelector('.chat-status-indicator');

  if (sendBtn) sendBtn.disabled = isLoading;
  if (chatInput) chatInput.disabled = isLoading;
  if (statusIndicator) {
    statusIndicator.classList.toggle('loading', isLoading);
  }
}



const CHAT_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_dashboard_settings',
      description: 'Retrieve the current active settings from the dashboard. Use this when the user asks what cost sensitivity (P), min performance, active providers, or price bounds are currently set on their screen. Returns Cost Sensitivity P, searchQuery, activeProviders list, priceMin, priceMax, and performanceThreshold.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_summary_stats',
      description: 'Retrieve the highlight stats from the summary cards. Use this to find the names and values/costs of the best value model, best performance model, cheapest model, and most expensive model currently matching filters.',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_leaderboard_rankings',
      description: 'Retrieve the leaderboard list of models matching the current filters. Use this tool when the user asks for rankings, lists of top-performing models, or comparisons of the highest-rated models on the leaderboard. Returns ranks, model names, providers, performance scores, value scores, and blended costs.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'The maximum number of ranking rows to return (default is 10).',
            default: 10
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_model_details',
      description: 'Retrieve detailed attributes and scores for a specific language model by searching for its name. Use this tool when the user queries a specific model\'s input price, output price, blended cost, LiveBench score, AA score, normalized performance, or value score.',
      parameters: {
        type: 'object',
        properties: {
          model_name: {
            type: 'string',
            description: 'The name of the model to look up (e.g. "DeepSeek V4 Pro", "Gemini 3.5 Flash", "GLM 5.2").'
          }
        },
        required: ['model_name']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_all_models',
      description: 'Retrieve a list of all models and their providers in the database. Use this tool to see the names of all models, list models for a specific provider, or check if a model exists in the database before querying details.',
      parameters: {
        type: 'object',
        properties: {
          provider: {
            type: 'string',
            description: 'Filter models list to only include this provider (e.g. "OpenAI", "DeepSeek", "Google").'
          }
        }
      }
    }
  }
];

function executeGetDashboardSettings() {
  const activeProvidersStr = Array.from(state.activeProviders).join(', ');
  return JSON.stringify({
    costSensitivityP: state.p,
    searchQuery: state.search,
    activeProviders: activeProvidersStr,
    priceMin: state.priceMin,
    priceMax: state.priceMax,
    perfThreshold: state.perfThreshold
  });
}

function executeGetSummaryStats() {
  const allModels = computeAllMetrics(RAW_DATA, state.p);
  const filtered = getFilteredModels(allModels);
  if (filtered.length === 0) return JSON.stringify({ error: "No models match current filters." });

  const bestValue = filtered.reduce((a, b) => a.value > b.value ? a : b);
  const bestPerf = filtered.reduce((a, b) => a.performance > b.performance ? a : b);
  const cheapest = filtered.reduce((a, b) => a.blended < b.blended ? a : b);
  const expensive = filtered.reduce((a, b) => a.blended > b.blended ? a : b);

  return JSON.stringify({
    bestValue: { model: bestValue.model, provider: bestValue.provider, valueScore: bestValue.value },
    bestPerformance: { model: bestPerf.model, provider: bestPerf.provider, performanceScore: bestPerf.performance },
    cheapest: { model: cheapest.model, provider: cheapest.provider, blendedCost: cheapest.blended },
    mostExpensive: { model: expensive.model, provider: expensive.provider, blendedCost: expensive.blended }
  });
}

function executeGetLeaderboardRankings(args) {
  const limit = args.limit || 10;
  const allModels = computeAllMetrics(RAW_DATA, state.p);
  const filtered = getFilteredModels(allModels);
  const sorted = [...filtered].sort((a, b) => b.performance - a.performance);
  
  return JSON.stringify(sorted.slice(0, limit).map((m, i) => ({
    rank: i + 1,
    model: m.model,
    provider: m.provider,
    performance: m.performance,
    value: m.value,
    blendedCost: m.blended
  })));
}

function executeGetModelDetails(args) {
  if (!args.model_name) return JSON.stringify({ error: "Missing model_name parameter." });
  const query = args.model_name.toLowerCase().trim();
  const allModels = computeAllMetrics(RAW_DATA, state.p);
  
  const match = allModels.find(m => m.model.toLowerCase().includes(query));
  if (!match) return JSON.stringify({ error: `Model "${args.model_name}" not found.` });

  return JSON.stringify({
    model: match.model,
    provider: match.provider,
    inputPricePerMillion: match.inputPrice,
    outputPricePerMillion: match.outputPrice,
    blendedCostPerMillion: match.blended,
    livebenchScore: match.livebench,
    aaScore: match.aaScore,
    normalizedPerformance: match.performance,
    valueScore: match.value
  });
}

function executeListAllModels(args) {
  const providerFilter = args.provider ? args.provider.toLowerCase().trim() : null;
  const allModels = computeAllMetrics(RAW_DATA, state.p);
  
  let list = allModels;
  if (providerFilter) {
    list = allModels.filter(m => m.provider.toLowerCase() === providerFilter);
  }
  
  return JSON.stringify(list.map(m => ({
    model: m.model,
    provider: m.provider,
    blendedCost: m.blended
  })));
}

async function executeTool(name, argsString) {
  let args = {};
  try {
    if (argsString) {
      args = JSON.parse(argsString);
    }
  } catch (e) {
    console.error("Failed to parse tool arguments:", argsString, e);
  }

  console.info(`[Chatbot Tool] Invoking "${name}" with args:`, args);

  switch (name) {
    case 'get_dashboard_settings':
      return executeGetDashboardSettings();
    case 'get_summary_stats':
      return executeGetSummaryStats();
    case 'get_leaderboard_rankings':
      return executeGetLeaderboardRankings(args);
    case 'get_model_details':
      return executeGetModelDetails(args);
    case 'list_all_models':
      return executeListAllModels(args);
    default:
      return JSON.stringify({ error: `Tool "${name}" is not implemented.` });
  }
}

async function streamResponse(userPrompt) {
  let loopCount = 0;
  const maxLoops = 5;
  
  const logs = document.getElementById('chatLogs');
  if (!logs) return;
  
  let currentMessageDiv = null;
  let currentBubbleDiv = null;
  let currentThinkingDetails = null;
  let currentThinkingContentDiv = null;

  while (loopCount < maxLoops) {
    const systemPrompt = `You are a helpful AI Assistant embedded in an interactive LLM Model Analysis dashboard.
You help users analyze models, compute values, and compare prices.

You have access to tools that query the dashboard state and model details.
Use tools when asked about:
- What filters or settings are currently set (get_dashboard_settings)
- Summary statistics/cards (get_summary_stats)
- Model rankings/leaderboard data (get_leaderboard_rankings)
- Model details, prices, or benchmark scores (get_model_details)
- Listing all models (list_all_models)

Do NOT assume what the active settings or values are. Call tools to get the correct live data.

Formula Guidelines:
- Blended Cost = 0.9573 * Input Price + 0.0427 * Output Price
- Performance = 50% * (Normalized LiveBench) + 50% * (Normalized AA Score)
- Value = Performance / Blended Cost^P

Answer rules:
1. Cite values and rankings from the tool execution results.
2. Be brief, professional, and clear. Use bullet points and lists.
3. Keep answers short and relevant to model analysis.`;

    const messagesToSend = [
      { role: 'system', content: systemPrompt },
      ...CHAT_STATE.messages
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAT_STATE.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/isr431/model-analysis',
        'X-Title': 'LLM Model Analysis Dashboard'
      },
      body: JSON.stringify({
        model: CHAT_STATE.selectedModel,
        messages: messagesToSend,
        stream: true,
        tools: CHAT_TOOLS,
        max_tokens: 4096,
        reasoning: CHAT_STATE.reasoningEffort === 'none' ? { exclude: true } : { effort: CHAT_STATE.reasoningEffort }
      })
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorMsg = errorJson.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    
    let reasoningText = '';
    let contentText = '';
    let buffer = '';
    let toolCalls = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last partial line

      for (const line of lines) {
        const cleaned = line.trim();
        if (!cleaned) continue;
        if (cleaned.startsWith('data: ')) {
          const dataStr = cleaned.slice(6);
          if (dataStr === '[DONE]') continue;
          
          try {
            const data = JSON.parse(dataStr);
            const delta = data.choices?.[0]?.delta;
            if (delta) {
              const reasoningChunk = delta.reasoning || delta.reasoning_content || '';
              const contentChunk = delta.content || '';
              const toolCallsDelta = delta.tool_calls;

              if (reasoningChunk) {
                if (!currentMessageDiv) {
                  createAssistantMessageNodes();
                }
                if (currentThinkingDetails.classList.contains('hide')) {
                  currentThinkingDetails.classList.remove('hide');
                }
                reasoningText += reasoningChunk;
                currentThinkingContentDiv.textContent = reasoningText;
                scrollToBottom();
              }

              if (contentChunk) {
                if (!currentMessageDiv) {
                  createAssistantMessageNodes();
                }
                if (currentThinkingDetails.open && reasoningText.length > 0) {
                  currentThinkingDetails.open = false;
                }
                contentText += contentChunk;
                currentBubbleDiv.innerHTML = parseMarkdown(contentText);
                scrollToBottom();
              }

              if (toolCallsDelta) {
                toolCallsDelta.forEach(tc => {
                  const idx = tc.index;
                  if (!toolCalls[idx]) {
                    toolCalls[idx] = {
                      id: tc.id || '',
                      name: tc.function?.name || '',
                      arguments: tc.function?.arguments || ''
                    };
                  } else {
                    if (tc.id) toolCalls[idx].id = tc.id;
                    if (tc.function?.name) toolCalls[idx].name = tc.function.name;
                    if (tc.function?.arguments) toolCalls[idx].arguments += tc.function.arguments;
                  }
                });
              }
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    if (buffer) {
      const cleaned = buffer.trim();
      if (cleaned.startsWith('data: ')) {
        const dataStr = cleaned.slice(6);
        if (dataStr !== '[DONE]') {
          try {
            const data = JSON.parse(dataStr);
            const delta = data.choices?.[0]?.delta;
            if (delta) {
              const contentChunk = delta.content || '';
              if (contentChunk) {
                if (!currentMessageDiv) createAssistantMessageNodes();
                contentText += contentChunk;
                currentBubbleDiv.innerHTML = parseMarkdown(contentText);
                scrollToBottom();
              }
            }
          } catch (e) {}
        }
      }
    }

    function createAssistantMessageNodes() {
      currentMessageDiv = document.createElement('div');
      currentMessageDiv.className = 'chat-message assistant';

      // Prepend label
      const labelDiv = document.createElement('div');
      labelDiv.className = 'chat-sender-label';
      labelDiv.textContent = 'Assistant';
      currentMessageDiv.appendChild(labelDiv);

      currentThinkingDetails = document.createElement('details');
      currentThinkingDetails.className = 'thinking-block hide';
      currentThinkingDetails.open = true;
      currentThinkingDetails.innerHTML = `
        <summary class="thinking-title">Thinking Process</summary>
        <div class="thinking-content"></div>
      `;

      currentBubbleDiv = document.createElement('div');
      currentBubbleDiv.className = 'message-bubble';

      currentMessageDiv.appendChild(currentThinkingDetails);
      currentMessageDiv.appendChild(currentBubbleDiv);
      logs.appendChild(currentMessageDiv);
      currentThinkingContentDiv = currentThinkingDetails.querySelector('.thinking-content');
    }

    if (currentThinkingDetails && reasoningText.trim().length === 0) {
      currentThinkingDetails.remove();
    }

    const activeToolCalls = toolCalls.filter(Boolean);

    if (activeToolCalls.length > 0) {
      activeToolCalls.forEach(tc => {
        addToolStatusMessage(`Running tool: ${tc.name}...`);
      });

      CHAT_STATE.messages.push({
        role: 'assistant',
        content: contentText || null,
        tool_calls: activeToolCalls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.name,
            arguments: tc.arguments
          }
        }))
      });

      for (const tc of activeToolCalls) {
        const result = await executeTool(tc.name, tc.arguments);
        CHAT_STATE.messages.push({
          role: 'tool',
          tool_call_id: tc.id,
          name: tc.name,
          content: result
        });
      }

      loopCount++;
      currentMessageDiv = null;
      currentBubbleDiv = null;
      currentThinkingDetails = null;
      currentThinkingContentDiv = null;
    } else {
      if (contentText.trim().length === 0 && reasoningText.trim().length === 0) {
        if (!currentMessageDiv) createAssistantMessageNodes();
        currentBubbleDiv.textContent = 'No response generated.';
      } else if (contentText.trim().length > 0) {
        CHAT_STATE.messages.push({ role: 'assistant', content: contentText });
      }
      break;
    }
  }

  setChatLoading(false);
}

function addToolStatusMessage(text) {
  const logs = document.getElementById('chatLogs');
  if (!logs) return;
  const div = document.createElement('div');
  div.className = 'chat-message tool-status';
  div.innerHTML = `<div class="message-bubble">⚙️ ${escapeHtml(text)}</div>`;
  logs.appendChild(div);
  scrollToBottom();
}

// Helper to escape HTML characters
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Simple markdown parsing helper
function parseMarkdown(markdown) {
  let normalized = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let html = escapeHtml(normalized);

  // 1. Block Preservation: Extract code blocks
  const codeBlocks = [];
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    const placeholder = `%%CODEBLOCK_${codeBlocks.length}%%`;
    let cleanCode = code.replace(/^\n/, '');
    
    // Detect and strip language identifier (e.g. ```javascript\n)
    const firstLineEnd = cleanCode.indexOf('\n');
    let lang = '';
    if (firstLineEnd !== -1) {
      const firstLine = cleanCode.substring(0, firstLineEnd).trim();
      if (/^[a-zA-Z0-9_-]+$/.test(firstLine)) {
        lang = firstLine;
        cleanCode = cleanCode.substring(firstLineEnd + 1);
      }
    } else {
      const trimmed = cleanCode.trim();
      if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        lang = trimmed;
        cleanCode = '';
      }
    }
    
    const classAttr = lang ? ` class="language-${lang}"` : '';
    codeBlocks.push(`<pre><code${classAttr}>${cleanCode}</code></pre>`);
    return `\n${placeholder}\n`;
  });

  // 2. Block Preservation: Extract inline code blocks
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `%%INLINECODE_${inlineCodes.length}%%`;
    inlineCodes.push(`<code>${code}</code>`);
    return placeholder;
  });

  // 3. Link Parsing & Security Check
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const cleanUrl = url.trim();
    if (cleanUrl.toLowerCase().startsWith('javascript:')) {
      return text;
    }
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  // 4. Tables Parsing
  const linesForTable = html.split('\n');
  let inTable = false;
  let tableRows = [];
  let parsedLines = [];

  for (let i = 0; i < linesForTable.length; i++) {
    const line = linesForTable[i].trim();
    const isRow = line.startsWith('|') && line.endsWith('|');
    
    if (isRow) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
    } else {
      if (inTable) {
        parsedLines.push(renderMarkdownTable(tableRows));
        inTable = false;
      }
      parsedLines.push(linesForTable[i]);
    }
  }
  if (inTable) {
    parsedLines.push(renderMarkdownTable(tableRows));
  }
  html = parsedLines.join('\n');

  // 5. Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 6. Horizontal Rules
  html = html.replace(/^\s*---+\s*$/gim, '<hr>');

  // 7. Bold & Italic text
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>');
  html = html.replace(/_([\s\S]*?)_/g, '<em>$1</em>');

  // 8. Lists (ordered & unordered)
  const lines = html.split('\n');
  let inListType = null; // 'ul', 'ol', or null
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const isOrdered = /^\d+\./.test(listMatch[2]);
      const currentType = isOrdered ? 'ol' : 'ul';
      
      if (inListType && inListType !== currentType) {
        result.push(`</${inListType}>`);
        inListType = null;
      }
      
      if (!inListType) {
        result.push(`<${currentType}>`);
        inListType = currentType;
      }
      result.push(`<li>${listMatch[3]}</li>`);
    } else if (line.trim() === '' && inListType) {
      // Lookahead: check if the next non-empty line continues list of same type
      let nextListItemType = null;
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine !== '') {
          const nextMatch = lines[j].match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
          if (nextMatch) {
            const nextIsOrdered = /^\d+\./.test(nextMatch[2]);
            nextListItemType = nextIsOrdered ? 'ol' : 'ul';
          }
          break;
        }
      }
      
      if (nextListItemType === inListType) {
        continue; // Keep list open and discard formatting whitespace
      } else {
        result.push(`</${inListType}>`);
        inListType = null;
        result.push(line);
      }
    } else {
      if (inListType) {
        result.push(`</${inListType}>`);
        inListType = null;
      }
      result.push(line);
    }
  }
  if (inListType) {
    result.push(`</${inListType}>`);
  }
  html = result.join('\n');

  // 9. Wrap Paragraphs
  const paragraphs = html.split(/\n{2,}/);
  let finalHtml = paragraphs.map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith('<pre>') || trimmed.startsWith('<ul>') || trimmed.startsWith('<ol>') || trimmed.startsWith('<li>') || trimmed.startsWith('<table>') || trimmed.startsWith('<h1') || trimmed.startsWith('<h2') || trimmed.startsWith('<h3') || trimmed.startsWith('<hr>') || trimmed.startsWith('%%CODEBLOCK_')) {
      return trimmed;
    }
    if (trimmed === '') {
      return '';
    }
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).filter(Boolean).join('');

  // 10. Restore Preserved Blocks
  codeBlocks.forEach((block, idx) => {
    finalHtml = finalHtml.replace(`%%CODEBLOCK_${idx}%%`, block);
  });
  inlineCodes.forEach((code, idx) => {
    finalHtml = finalHtml.replace(`%%INLINECODE_${idx}%%`, code);
  });

  return finalHtml;
}

function renderMarkdownTable(rows) {
  if (rows.length < 2) {
    return rows.join('\n');
  }

  const headers = rows[0]
    .split('|')
    .slice(1, -1)
    .map(cell => cell.trim());

  const isDivider = /^[\s|:-]+$/.test(rows[1]);
  if (!isDivider) {
    return rows.join('\n');
  }

  let tableHtml = '<table><thead><tr>';
  headers.forEach(h => {
    tableHtml += `<th>${h}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  for (let r = 2; r < rows.length; r++) {
    const cells = rows[r]
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim());

    tableHtml += '<tr>';
    for (let c = 0; c < headers.length; c++) {
      const val = cells[c] !== undefined ? cells[c] : '';
      tableHtml += `<td>${val}</td>`;
    }
    tableHtml += '</tr>';
  }
  tableHtml += '</tbody></table>';
  return tableHtml;
}

// ===== INIT =====
async function init() {
  // Setup theme before charts so first paint uses correct colors
  initTheme();

  // Apply fallback data and render immediately (instant render — no delay)
  applyData(FALLBACK_DATA);
  state.activeProviders = new Set(ALL_PROVIDERS);

  initCharts();
  // Apply theme colors to charts now that they exist — initTheme() ran
  // before initCharts(), so its updateChartColors() call was a no-op.
  const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  updateChartColors(activeTheme);
  initProviderPills();
  initEventListeners();
  initRangeSliderZIndexFix();
  updateSliderBounds();
  updatePriceRangeSliderHighlight();
  initChatbot();

  // First paint with fallback data; remove skeleton state
  updateAll();
  removeSkeletons();

  // Fetch fresh data in the background — swap and refresh only if different
  loadData().then(data => {
    const sameModels = JSON.stringify(data.models) === JSON.stringify(FALLBACK_DATA.models);
    const sameProviders = JSON.stringify(data.providers) === JSON.stringify(FALLBACK_DATA.providers);

    if (!sameModels || !sameProviders) {
      const oldProvidersSet = new Set(ALL_PROVIDERS);
      applyData(data);
      reinitProviderPills(oldProvidersSet);
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
