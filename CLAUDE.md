# LLM Model Analysis Developer Guidelines (CLAUDE.md)

This file contains key commands, coding conventions, and architectural details for the LLM Model Analysis interactive web application.

## Project Overview
An interactive, single-page web app for comparing Large Language Models (LLMs) across multiple providers. It visualizes model ranking, value score, and performance-to-cost trade-offs in real-time, based on parameters like Cost Sensitivity (P), Search, Price Range, and Min Performance.

## Tech Stack
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Libraries (via CDN)**:
  - Chart.js v4 (`https://cdn.jsdelivr.net/npm/chart.js`)
  - Google Fonts (Inter)
- **Architecture**: Multi-file static site with no build step
- **Hosting**: GitHub Pages

## File Structure
```
model-analysis/
├── index.html      # HTML structure only (no inline CSS or JS)
├── styles.css      # All styling (design tokens, components, responsive)
├── app.js          # All application logic (data loading, computation, UI)
├── data.json       # External data source (models + provider config)
└── CLAUDE.md       # This file — developer guidelines
```

### File Responsibilities
- **`index.html`**: Pure HTML structure. Links to `styles.css` and `app.js` (both via `defer`). Contains no inline styles or scripts.
- **`styles.css`**: Complete design system — CSS variables, glassmorphism theme, all component styles, responsive breakpoints.
- **`app.js`**: All JavaScript logic — data loading (with fallback), computation, Chart.js initialization, UI updates, event listeners.
- **`data.json`**: The single source of truth for model data and provider configuration. Edited directly to add/update models.

## Key Commands
- **Local Dev**: `python3 -m http.server` (required — `fetch()` does not work over `file://`)
- **Preview**: Open `http://localhost:8000` in a browser
- **Deploy**: Push to GitHub → GitHub Pages auto-deploys from the main branch
- **Build/Test**: No build step or test scripts. Validate via browser console and manual inspection.

## How to Add a New Model

1. Open `data.json`
2. Append a new object to the `models` array:
   ```json
   {
     "provider": "ProviderName",
     "model": "Model Name",
     "inputPrice": 1.0,
     "outputPrice": 5.0,
     "livebench": 75.0,
     "aaScore": 45
   }
   ```
3. If the provider is **new** (not already in the `providers` object), also add it:
   ```json
   "ProviderName": { "color": "#hexcolor" }
   ```
4. Commit and push. The site will update automatically.

**Note**: All derived fields (blended cost, performance, value) are computed at runtime — only store raw data.

## How to Update the Fallback Data

When you update `data.json`, also update the `FALLBACK_DATA` constant in `app.js` to match. This ensures instant rendering even if the JSON fetch fails. The app will still work without updating the fallback, but users may briefly see stale data.

## Data Loading Flow
1. **Instant render**: App loads `FALLBACK_DATA` (embedded in `app.js`) and renders immediately
2. **Background fetch**: `fetch('./data.json')` runs asynchronously
3. **Validation**: Fetched data is schema-validated (non-empty models array, required fields, correct types)
4. **Silent swap**: If valid and different from fallback, data is swapped in and the UI refreshes seamlessly
5. **Graceful fallback**: If fetch fails (network error, `file://` protocol, malformed JSON), the app continues with fallback data

## Critical Calculations & Formulas
- **Blended Cost**: `0.9573 × Input Price + 0.0427 × Output Price` (models a 37:1 input-to-output token ratio).
- **Performance**: `0.5 × Normalized(LiveBench) × 100 + 0.5 × Normalized(Artificial Analysis) × 100` (min-max normalized across all models, scaled to 0-100).
- **Value**: `Performance / Blended Cost^P` (where P represents the cost-sensitivity slider parameter).

## Coding & UI/UX Conventions
- **Glassmorphism Design System**: Follow the CSS variables (e.g., `--bg-primary`, `--glass-bg`). In Light Theme (`data-theme="light"`), the colors swap to slate/white variables while preserving spacing and structure.
- **Theme Toggle**: Switch themes via `setTheme()`. Chart scales, grids, ticks, and tooltips are dynamically updated via `updateChartColors(theme)` as Canvas elements do not parse CSS themes directly. Theme defaults to `prefers-color-scheme` and persists in `localStorage`.
- **Skeleton Shimmer / Pulse**: Use `.skeleton-element` with the `.pulse` animation for elements loading in the background. A minimum loading timer of 600ms is used in `init()` to display skeletons smoothly and prevent visual flickering.
- **Bidirectional Highlighting**:
  - Highlights sync across views via `toggleHighlight(modelName)` and `updateHighlights()`.
  - Clicks on scatter chart points, rank bar elements, table rows, and leaderboard rows all trigger this central highlight state.
  - Active highlights dim non-selected models to focus attention on the clicked model.
- **Dynamic Slider Bounds**: The price range slider max is computed from the data on load. Adding expensive models will automatically expand the slider range.
- **Dual Slider & Overlap Fix**: 
  - The range highlight between the thumbs is updated dynamically via `updatePriceRangeSliderHighlight()`.
  - To prevent thumbs from blocking each other when overlapping, container-level `mousedown` and `touchstart` events calculate which thumb is closer and assign it a higher `z-index` before dragging starts.
- **Scatter Chart Mapping**:
  - Uses `type: 'category'` for the X-axis (`scales.x`) to space blended costs equally.
  - Dynamic category labels are recalculated in `updateScatterChart(filtered)` using unique sorted string values.
  - The dataset point coordinates map to the string label on the X-axis, while preserving raw numeric values as `blended` for high-precision tooltips.
- **Robustness**: Always check for empty arrays (e.g., `filtered.length === 0`) in UI rendering functions (like `updateTable` and `updateLeaderboard`) to prevent NaN or division-by-zero, and render the custom `.reset-btn` matching the theme.
- **Script Loading**: Both the Chart.js CDN and `app.js` use `defer` to ensure correct execution order without blocking HTML parsing.
