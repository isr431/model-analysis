# LLM Model Analysis Dashboard

Compare LLMs by price, benchmark performance, and overall value.

Dashboard: [https://modelanalysis.xyz](https://modelanalysis.xyz)

## Features

### Value-Based Rankings

Adjust the cost sensitivity slider (**$P$**) to see how rankings change as price becomes more or less important.

$$
\text{Value} = \frac{\text{Performance}}{\text{Blended Cost}^P}
$$

### Charts and Comparisons

- Cost vs. performance scatter plot
- Pareto frontier highlighting efficient models
- Radar chart for side-by-side model comparisons
- Sortable rankings by value, performance, cost, LiveBench, or Artificial Analysis score

### Search and Filtering

- Search by model or provider
- Filter providers
- Set price limits
- Set a minimum performance threshold
- Restrict to models with both benchmark scores published

### Themes

- Dark and light modes (Monospaced Terminal / IDE styling)
- Automatic system theme preference detection (defaults to dark mode if no preference is found)
- Preference saved locally in your browser when explicitly toggled

## Tech Stack

- HTML
- CSS
- JavaScript
- Chart.js

## Running Locally

The dashboard loads data from `data.json`, so it must be served through a local web server.

```bash
git clone https://github.com/isr431/model-analysis.git
cd model-analysis
python3 -m http.server
```

Then open:

```text
http://localhost:8000
```

## Updating Model Data

Model data lives in `data.json`.

Add a model:

```json
{
  "provider": "OpenAI",
  "model": "gpt-oss-120b",
  "inputPrice": 0.037,
  "outputPrice": 0.17,
  "cachePrice": 0.0037,
  "livebench": 46.09,
  "aaScore": 24,
  "open": true
}
```

`cachePrice` is the input cache-read price per 1M tokens. Set it to `null` when the provider publishes no cache-read price — the dashboard shows `—`, and such models sort last on the Cache column in both directions rather than reading as free.

`open` marks whether the model's weights are publicly released (`true`) or closed/proprietary (`false`). It powers the "Open" badge and the Source filter (All / Open / Closed).

If a model is listed on only one of the two leaderboards, set the other score to `null`:

```json
{
  "provider": "Z.ai",
  "model": "GLM 5.3 Air",
  "inputPrice": 0.6,
  "outputPrice": 2.2,
  "cachePrice": null,
  "livebench": null,
  "aaScore": 49,
  "open": true
}
```

The missing score is estimated at runtime (see [Partial benchmark coverage](#partial-benchmark-coverage)) and marked `EST` in the dashboard. A model must have at least one of the two scores.

If you're adding a new provider, also add its color to the `providers` object.

### After any edit, run the sync script

`data.json` is not the only place the data lives — `app.js` holds a `FALLBACK_DATA` copy so the page renders before `data.json` loads, and `index.html` carries a `?v=` cache-bust token that has to change whenever `app.js` does. One command keeps all three in step:

```bash
node scripts/update-prices.mjs           # show what would change, write nothing
node scripts/update-prices.mjs --write   # apply it
node scripts/update-prices.mjs --sync-only   # skip OpenRouter, just mirror data.json
```

So the workflow for adding a model is: append the entry to `data.json` **without** prices, run the script, and let it fill them in. It refuses to write a model it couldn't find a price for.

Prices (`inputPrice`, `outputPrice`, `cachePrice`) come from the [OpenRouter models API](https://openrouter.ai/api/v1/models). Benchmark scores stay hand-curated. The script matches models by name; two optional per-model keys in `data.json` override that:

- `"openrouterId": "qwen/qwen3.8-flash"` — pin the OpenRouter entry when the name doesn't match, or matches the wrong variant.
- `"priceLock": true` — keep hand-set prices for this model. Useful when OpenRouter surfaces a dynamic third-party routed price rather than the provider's list price.

Both are stripped before the data reaches the app, so they never appear in `FALLBACK_DATA`.

`.github/workflows/update-prices.yml` runs the script every Monday and pushes to `main`. It commits nothing when nothing changed.

## AI Assistant

The dashboard includes a built-in AI assistant powered by OpenRouter.

### What it can do

- Answer questions about the current leaderboard
- Search, filter, and rank models by price, performance, value, or open weights
- Compare models in the active dataset
- Read your current filters and settings, and explain why a model is filtered out
- Apply filters for you — "show me only open models under $1" updates the dashboard
- Show pricing and benchmark information
- Support different reasoning levels for compatible models

### Setup

1. Open the chat panel using the floating chat assistant button.
2. Click the **Settings** icon.
3. Enter your OpenRouter API key.
4. Choose a model and start asking questions.

Your API key is stored locally in your browser and is only sent to OpenRouter.

## Methodology

### Blended Cost

A weighted cost estimate based on a 22.4:1 input-to-output token ratio.

$$
\text{Blended Cost} = (0.9573 \times \text{Input Price}) + (0.0427 \times \text{Output Price})
$$

### Performance

Performance is a weighted blend of the normalized LiveBench and Artificial Analysis scores.

$$
\text{Performance} = \left( w_{\text{LB}} \cdot \frac{\text{LiveBench}}{\max(\text{LiveBench})} + w_{\text{AA}} \cdot \frac{\text{AA Score}}{\max(\text{AA Score})} \right) \times 100
$$

Normalizing by each benchmark's maximum pins the top of both scales to 1, but it leaves their *spreads* untouched — and spread, not the ceiling, decides how much a benchmark actually moves the composite. Artificial Analysis ranges over a much wider slice of its scale than LiveBench does (roughly 1.9× the spread on current data), so an even 50/50 split would in practice give AA about two-thirds of the influence.

The weights correct for this by scaling each benchmark inversely to its spread:

$$
w_{\text{LB}} = \frac{\sigma_{\text{AA}}}{\sigma_{\text{LB}} + \sigma_{\text{AA}}}, \qquad w_{\text{AA}} = \frac{\sigma_{\text{LB}}}{\sigma_{\text{LB}} + \sigma_{\text{AA}}}
$$

where $\sigma$ is the standard deviation of the normalized scores. On current data this gives roughly $w_{\text{LB}} = 0.66$ and $w_{\text{AA}} = 0.34$, which is what an even contribution actually looks like. The weights are recomputed from the loaded dataset rather than hard-coded, so they stay correct as models are added. The live values are shown in the score formula panel.

### Partial benchmark coverage

Some models are published on only one of the two leaderboards. Rather than drop them or score them on a single benchmark, the missing score is estimated by least-squares regression against the benchmark the model does have, fitted on the models that report both:

$$
\hat{x}_{\text{missing}} = a + b \cdot x_{\text{present}}
$$

Scoring a partial model on its available benchmark alone looks simpler but is biased. Doing so implicitly assumes the two normalized scores are equal, and they are not: Artificial Analysis spans roughly twice LiveBench's normalized range, so equating them inflates any model below the top of the scale.

Leave-one-out cross-validation across the dataset — hide one benchmark, predict it, compare the resulting Performance score against the truth — puts the gap at:

| Method | Missing AA | Missing LiveBench |
|---|---|---|
| Available score alone | 2.59 mean error (6.64 max) | 5.22 mean error (13.38 max) |
| Regression estimate | **1.25 mean error (3.95 max)** | **1.31 mean error (3.92 max)** |

The estimate is viable because the two benchmarks correlate closely ($r = 0.91$, $R^2 = 0.83$ on current data). Both the regression and the spread weights above are fitted **only on models that report both scores**, so an estimate can never feed back into the numbers that produced it — which also means adding a partial model leaves every existing model's score untouched.

Estimated models are flagged with an `EST` badge, their estimated cell is shown in muted italics as `~72.93`, they are never awarded a "best" highlight in the comparison view, and the Benchmark Data filter (All / Complete Only) hides them entirely. With fewer than 5 complete models to fit against, the app falls back to the single-benchmark estimate rather than failing.

### Value

Value balances performance against cost.

$$
\text{Value} = \frac{\text{Performance}}{\left(\dfrac{\text{Blended Cost}}{\text{Min Blended Cost}}\right)^{P}}
$$

- **$P = 0$** → rankings are based only on performance.
- Higher values of **$P$** place more weight on cost.

Cost is measured relative to the cheapest model in the dataset rather than in raw dollars. Dividing by a raw cost is unbounded: below $1/M the denominator drops under 1 and inflates Value past the 100 that Performance is capped at. Anchoring the denominator means the cheapest model divides by exactly 1 and every other model divides by more, so $\text{Value} \le \text{Performance} \le 100$ holds for any dataset and any $P$ — the cheapest model sets the bar for cost the same way the top scorer sets it for each benchmark. The anchor is recomputed from the loaded data, so a new cheapest model simply re-anchors the scale; because it is a constant rescale, it never reorders the rankings.

### Cost Efficiency (Radar Chart)

To compare costs across a wide price range (e.g. from cheap open-weights models to expensive reasoning models) without linear price compression, the radar chart uses a globally anchored logarithmic scale:

$$
\text{Cost Efficiency} = \left( \frac{\log_{10}(\text{Global Max Cost}) - \log_{10}(\text{Model Cost})}{\log_{10}(\text{Global Max Cost}) - \log_{10}(\text{Global Min Cost})} \right) \times 100
$$

- A floor of **$0.01$** is enforced on model costs to handle free models safely.
- Global min/max values are computed across all models in the database to keep the comparison shape stable when filters are applied.

### Pareto Frontier

Models on the Pareto frontier are not beaten by another model on both price and performance at the same time.

## License

Released under the MIT License.
