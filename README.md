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
  "cacheWritePrice": null,
  "livebench": 46.09,
  "aaScore": 24,
  "open": true
}
```

Prices come from the [OpenRouter models API](https://openrouter.ai/api/v1/models); benchmark scores are hand-curated. So when adding a model, leave the four price fields out and let the sync script fill them in. It also updates the two other places the data is mirrored:

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

The dashboard compares prices under a shared, adjustable workload:

$$
\text{Blended Cost} = \frac{R \left(h \times \text{Cache Read Price} + (1-h) \times \text{Cache Write Price}\right) + \text{Output Price}}{R+1}
$$

- **R** is input tokens per billable output token, including reasoning. Default: **165:1**.
- **h** is the fraction of input tokens served from cache. Default: **90%**.
- New context is assumed to be written to the short-duration cache. The write rate is the full price, not a surcharge added to input. Missing write pricing falls back to regular input pricing. A model without published cache-read pricing uses regular input pricing for all input.
- A 0% hit rate models no cache hits, with cache creation still charged where published; it does not switch caching off.

Both controls live in Filters, count together as one changed workload group, and reset with Reset Filters. Costs, value scores, price bounds, charts and assistant tools all use the selected workload.

The result is **estimated dollars per million combined tokens**, including repeated context reads, not measured cost per task. It includes the published short-duration write charge (for Gemini explicit caching, input plus five-minute storage), but excludes longer storage, long-context surcharges and tool fees. Gemini implicit caching can avoid that storage charge. Compare shows published read and write rates separately; an em dash means unavailable, not free.

The input/output default is informed by [Dosu's study](https://dosu.dev/blog/agent-budgets-pay-for-context-not-code): 112 sessions across two agent/model combinations on one repository, with input/output ratios of 198:1 and 134:1. The 90% hit rate is a scenario assumption, not a universal measured average. Vary these settings to see how dependent a comparison is on caching and token usage. Cache creation accounting follows the [OpenRouter pricing catalogue](https://openrouter.ai/api/v1/models) and [cache documentation](https://openrouter.ai/docs/guides/best-practices/prompt-caching).

### Performance

The relative benchmark index uses fixed raw-score spread calibration:

$$
\text{Performance} = 100 \times \frac{\text{LiveBench}/s_{LB} + \text{AA Score}/s_{AA}}{\max(\text{LiveBench})/s_{LB} + \max(\text{AA Score})/s_{AA}}
$$

The reference is the **26-model repository snapshot of September 5, 2026**, with sample standard deviations `sLB = 4.510893907658862` and `sAA = 6.997581999959261`. These constants live in `PERFORMANCE_CALIBRATION` in `app.js`. This is a dashboard calibration baseline, not a claimed benchmark release identifier.

A one-reference-standard-deviation improvement on either benchmark contributes equally. On the initial roster this exactly preserves the previous inverse-spread scores. Adding or removing models no longer refits the tradeoff between benchmarks. New maxima can rescale all scores equally to keep the 0–100 ceiling, but cannot reverse existing performance rankings. Filters do not alter calibration or maxima.

The modal expresses this same formula using max-normalized weights: `wLB = (lbMax/sLB) / (lbMax/sLB + aaMax/sAA)`, with the corresponding AA weight. Recalibrate deliberately when benchmark methodologies change; record the reference population and new spreads here and in the modal. Do not recalibrate on every roster edit.

This is an **overall benchmark index**, not a coding task success rate. Equal spread influence does not establish equal reliability or independence. Treat small score differences as near-ties. Benchmark values remain curated; their release and reasoning configuration should be verified together before updating them.

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
