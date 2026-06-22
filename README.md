# LLM Model Analysis Dashboard

An interactive, high-performance, single-page web application to compare Large Language Models (LLMs) across pricing, performance benchmarks, and value-for-money trade-offs in real-time.

### [View Page](https://isr431.github.io/model-analysis)

---

## Features

*   **Dynamic Value Score Slider ($P$)**: Adjust the cost-sensitivity slider ($P$) to dynamically recalculate and rank models by value. The app computes value using the formula:
    $$\text{Value} = \frac{\text{Performance}}{\text{Blended Cost}^P}$$
*   **Dual-Theme System**: A modern glassmorphism design system supporting both **Dark Mode** (default) and **Light Mode**, with automatic system preference detection and localStorage persistence.
*   **Interactive Visualizations (Chart.js)**:
    *   **Cost vs. Performance Scatter Plot**: Visually maps models to identify outliers (high-performance at low cost). Clicking points highlights the model across the dashboard.
    *   **Horizontally Sorted Bar Chart**: Allows sorting and viewing all models by Value, Performance, Blended Cost, LiveBench, or Artificial Analysis Score.
*   **Multi-Dimensional Filtering & Search**:
    *   Search by model name or provider.
    *   Filter by specific providers using dynamic pills.
    *   Adjust price range limits (dynamically bounded on load).
    *   Set a minimum performance threshold.
*   **Mobile-Responsive Design**: Layout reflows elegantly for smaller viewports, featuring a responsive comparison table with **sticky columns** (Provider and Model name remain visible while scrolling horizontally).
*   **Instant-Paint Architecture**: Renders immediately on load using pre-compiled fallback data, then triggers a background fetch to `data.json` for silent client-side updates (eliminating loading spinners).

---

## How It Works and Formulas

### 1. Blended Cost
Calculates the cost of typical model interactions based on a standard **37:1 input-to-output token ratio** (modeled as 95.73% input tokens and 4.27% output tokens):
$$\text{Blended Cost} = 0.9573 \times \text{Input Price} + 0.0427 \times \text{Output Price}$$

### 2. Performance Score
Combines **LiveBench** and **Artificial Analysis Score** by min-max normalizing both metrics across all models in the active dataset, scaling each to a 0–100 range, and averaging them equally:
$$\text{Performance} = 0.5 \times \text{Normalized}(\text{LiveBench}) \times 100 + 0.5 \times \text{Normalized}(\text{AA Score}) \times 100$$

*(Where LiveBench and AA Score are min-max normalized relative to all models in the active dataset)*

### 3. Value Score
Balances capability against cost based on the user's Cost Sensitivity parameter ($P$):
$$\text{Value} = \frac{\text{Performance}}{\text{Blended Cost}^P}$$
*   When $P = 0$, the Value Score is equivalent to the Performance Score (cost is ignored).
*   Higher $P$ values heavily penalize more expensive models.

---

## Tech Stack

*   **HTML5**: Pure, semantic structure.
*   **CSS3**: Vanilla CSS with custom property tokens, glassmorphism theme components, transition variables, and responsive media queries.
*   **JavaScript (ES6+)**: Event handling, asynchronous data loading, data schema validation, and rendering logic.
*   **Chart.js v4**: Responsive charts loaded via CDN.

---

## Running Locally

Because the application fetches model data from an external `data.json` file, modern browsers block these requests when files are opened directly via the `file://` protocol. A simple local HTTP server is required.

1.  Clone this repository to your local machine.
2.  Open your terminal in the project directory.
3.  Start a local development server using Python:
    ```bash
    python3 -m http.server
    ```
4.  Open your web browser and navigate to:
    [http://localhost:8000](http://localhost:8000)

---

## Updating or Adding Model Data

The application utilizes a single source of truth (`data.json`) for its database. To add new models or update prices:

1.  Open `data.json`.
2.  Append your new model to the `models` array:
    ```json
    {
      "provider": "Anthropic",
      "model": "Claude 4.0 Sonnet",
      "inputPrice": 3.0,
      "outputPrice": 15.0,
      "livebench": 81.25,
      "aaScore": 58
    }
    ```
3.  If the provider is new, add its name and hex color to the `providers` object:
    ```json
    "providers": {
      "Anthropic": { "color": "#fbbf24" }
    }
    ```
4.  *(Optional but Recommended)*: Update the `FALLBACK_DATA` constant at the top of `app.js` to match your changes, guaranteeing that users running the app offline or on slower networks get the updated data on the very first frame.
5.  Commit and push to your main branch. GitHub Pages will auto-deploy the changes in seconds!

---

## AI Model Assistant Chatbot

The dashboard features an integrated **AI Model Assistant** that helps you query and analyze models using natural language. 

### Features & Capabilities
*   **Settings Awareness**: The assistant can check your current Cost Sensitivity ($P$), Price Range, and other active filters.
*   **Live Leaderboard Queries**: Retrieve current ranks, model specifications, and cost details directly from the active dashboard.
*   **Deep Reasoning Support**: Toggles reasoning effort levels (High, Medium, Low, Minimal, None) for compatible LLMs to view their step-by-step thinking process.
*   **Secure API Key Storage**: Integrates with [OpenRouter.ai](https://openrouter.ai/). Your API key is stored securely in your browser's local storage (`localStorage`) and never leaves your client.

### How to Use
1.  Click the floating **AI** chat bubble in the bottom-right corner.
2.  Click the **Settings (Gear)** icon in the chat header to enter your OpenRouter API key.
3.  Choose your desired model (e.g., Gemini 3.5 Flash, DeepSeek V4 Pro, or GLM 5.2) and reasoning effort.
4.  Type your question (e.g., *"What is the cheapest model currently matching my filters?"* or *"Compare Gemini 3.5 Flash and DeepSeek V4 Pro"*).

---

## License

This project is open-source and available under the [MIT License](LICENSE).
