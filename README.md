# LLM Model Analysis Dashboard

Compare LLMs by price, benchmark performance, and overall value, scored for agentic coding.

Dashboard: [https://modelanalysis.xyz](https://modelanalysis.xyz)

## Features

- **Value rankings** with a cost-sensitivity slider (**$P$**) — watch the order change as price matters more or less
- **Charts** — a cost-vs-performance scatter with a Pareto frontier, and a radar chart for side-by-side comparison
- **Sortable table** by value, performance, cost, LiveBench, or Artificial Analysis score
- **Filters** — search, provider pills, price range, minimum performance, and open vs. closed weights
- **AI assistant** that reads the live dashboard and can apply filters for you
- **Dark and light themes**, following your system preference

Built with vanilla HTML, CSS, and JavaScript plus [Chart.js](https://www.chartjs.org/). No framework, no build step.

## Running locally

The dashboard fetches `data.json`, so it needs a web server rather than `file://`.

```bash
git clone https://github.com/isr431/model-analysis.git
cd model-analysis
python3 -m http.server
```

Open [http://localhost:8000](http://localhost:8000).

## Updating model data

Models live in `data.json`. A stored entry looks like:

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

Prices come from the [OpenRouter models API](https://openrouter.ai/api/v1/models); benchmark scores are hand-curated. So when adding a model, leave the three price fields out and let the sync script fill them in. It also updates the two other places the data is mirrored:

```bash
node scripts/update-prices.mjs           # show the diff
node scripts/update-prices.mjs --write   # apply it
```

Set `cachePrice` to `null` when it isn't published; every model needs both benchmark scores (`livebench` and `aaScore`). [AGENTS.md](AGENTS.md) has the full workflow.

## AI assistant

A built-in assistant, powered by OpenRouter, that answers questions about the current leaderboard, ranks and compares models, explains why a model is filtered out, and applies filters on request — "show me only open models under \$1".

Open the chat panel, click **Settings**, and enter your OpenRouter API key. The key is stored in your browser and is only ever sent to OpenRouter.

## Methodology

### Blended cost

$$
\text{Blended Cost} = (0.8946 \times \text{Cache Price}) + (0.0994 \times \text{Input Price}) + (0.0060 \times \text{Output Price})
$$

Weighted for **agentic coding**, where an agent re-sends its whole conversation every turn, so the tokens it reads dwarf the tokens it writes and nearly all of them hit the prompt cache. [Dosu](https://dosu.dev/blog/agent-budgets-pay-for-context-not-code) measured 198 context tokens read per output token for Claude Code and 134:1 for Codex across 112 sessions; these weights use 165:1 at a 90% cache-hit rate, with [cache reads billing at roughly a tenth of the input rate](https://code.claude.com/docs/en/prompt-caching).

A model with no published cache price pays full input price for re-reads rather than being treated as free.

### Performance

$$
\text{Performance} = \left( w_{\text{LB}} \cdot \frac{\text{LiveBench}}{\max(\text{LiveBench})} + w_{\text{AA}} \cdot \frac{\text{AA Score}}{\max(\text{AA Score})} \right) \times 100
$$

Normalizing by each benchmark's maximum pins both ceilings to 1 but leaves their *spreads* alone — and spread, not the ceiling, decides how much a benchmark moves the composite. Each weight therefore scales inversely to its benchmark's standard deviation, $w_{\text{LB}} = \sigma_{\text{AA}} / (\sigma_{\text{LB}} + \sigma_{\text{AA}})$, which comes out near 0.69/0.31 on current data. The weights are recomputed from the loaded dataset and shown in the score formula panel.

### Value

$$
\text{Value} = \frac{\text{Performance}}{\left(\dfrac{\text{Blended Cost}}{\text{Min Blended Cost}}\right)^{P}}
$$

$P = 0$ ranks on performance alone; higher $P$ weights cost more heavily. Cost is measured against the cheapest model rather than in raw dollars, so the cheapest divides by exactly 1 and $\text{Value} \le \text{Performance} \le 100$ holds for any dataset and any $P$. Re-anchoring is a constant rescale, so a new cheapest model never reorders the rankings.

### Cost efficiency (radar chart)

$$
\text{Cost Efficiency} = \left( \frac{\log_{10}(\text{Max Cost}) - \log_{10}(\text{Model Cost})}{\log_{10}(\text{Max Cost}) - \log_{10}(\text{Min Cost})} \right) \times 100
$$

Logarithmic, so a wide price range doesn't compress against the expensive end. Min and max are taken across every model rather than the filtered set, keeping the radar's shape stable as filters change. Costs are floored at \$0.01.

### Pareto frontier

A model sits on the frontier when no other model beats it on both price and performance at once.

## License

MIT.
