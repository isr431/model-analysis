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
  "inputPrice": 0.039,
  "outputPrice": 0.18,
  "livebench": 46.09,
  "aaScore": 24,
  "open": true
}
```

`open` marks whether the model's weights are publicly released (`true`) or closed/proprietary (`false`). It powers the "Open" badge and the Source filter (All / Open / Closed).

If you're adding a new provider, also add its color to the `providers` object.

## AI Assistant

The dashboard includes a built-in AI assistant powered by OpenRouter.

### What it can do

- Answer questions about the current leaderboard
- Compare models in the active dataset
- Read your current filters and settings
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

A weighted cost estimate based on a 37:1 input-to-output token ratio.

$$
\text{Blended Cost} = (0.9573 \times \text{Input Price}) + (0.0427 \times \text{Output Price})
$$

### Performance

Performance is the average of the normalized LiveBench and Artificial Analysis scores.

$$
\text{Performance} = \frac{\text{Normalized(LiveBench)} + \text{Normalized(AA Score)}}{2} \times 100
$$

### Value

Value balances performance against cost.

$$
\text{Value} = \frac{\text{Performance}}{\text{Blended Cost}^P}
$$

- **$P = 0$** → rankings are based only on performance.
- Higher values of **$P$** place more weight on cost.

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
