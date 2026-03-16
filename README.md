# The Rabbit Hole 🕳️🐇

*A serendipity engine — drop in any idea, and see how deep it goes.*

### **[🔗 Live Demo → reincore.github.io/the-rabbit-hole](https://reincore.github.io/the-rabbit-hole/)**

![The Rabbit Hole Demo](public/rabbit_hole_demo.webp)

## What Is This?

You know how you always end up reading the same kinds of things? The Rabbit Hole breaks that loop. Drop in any idea — a topic, a half-formed thought, a question you've been sitting with — and it finds three surprising directions you'd never have gone on your own. Not answers. New questions.

## The Three Modes

### ⚡ Standard Descent
The default. Enter any concept, idea, or half-formed thought. The engine returns 3 results — each an unexpected connection to a completely different field. Good for broadening your mental map without leaving your chair.

### 🌀 Deep Wilderness
Maximum serendipity. Results share *zero vocabulary* with your input and must score 8+ on the serendipity scale. For the intellectually fearless — results will feel alien, and that's the point.

### 💥 Collision
Feed two completely unrelated fields separated by `/`:

> `Byzantine architecture / competitive powerlifting`

The engine finds ideas that exist *exclusively at their intersection* — concepts that could not have emerged from either field alone. The weirder the pairing, the better.

## How It Works

1. **Choose Your Entry Point** — Type any idea or topic. In Collision, enter two separated by a `/`.
2. **Set Your Descent Depth** — Standard Descent, Deep Wilderness, or Collision.
3. **Enter the Rabbit Hole** — Or hit **Surprise Me** to let the app pick a random starting point and go automatically.
4. **Read Your Cards** — Each result shows:
   - **Concept** — What the new territory is.
   - **Bridge** — The connection back to your original idea.
   - **Twist** — The mind-bending fact that makes you want to know more.
5. **Dive In** — Click "Deep dive →" to start exploring via Google.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.19+ or v22.12+)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) — free tier is plenty

### Installation

```bash
git clone https://github.com/reincore/the-rabbit-hole.git
cd the-rabbit-hole
npm install
npm run dev
```

Open the provided `localhost` URL. The **API key input** is displayed at the top of the page — paste your key there, hit Save, and you're in. Your key is stored locally and never leaves your device (except to Google's Gemini API directly).

## Privacy & Security

Your Gemini API key is stored exclusively in your browser's `localStorage` and is **never transmitted to any server other than Google's Gemini API**.

> [!NOTE]
> Your API key is visible in the browser's Network tab during API calls — this is inherent to any client-side API call. We recommend restricting your key to the Gemini API in [Google AI Studio](https://aistudio.google.com/app/apikey) and setting appropriate quota limits.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build | [Vite](https://vitejs.dev/) |
| Language | JavaScript (ES6+) |
| UI | HTML5 / CSS3 — custom dark-mode glassmorphism |
| Icons | [Lucide](https://lucide.dev/) |
| AI | [Google Gemini 2.5 Flash](https://ai.google.dev/) |
| Deploy | GitHub Pages (automated CI/CD via GitHub Actions) |

## Roadmap

### Done
- [x] **Three descent modes** — Standard, Deep Wilderness, Collision
- [x] **Dynamic input placeholders & subtitles** — context-aware per mode
- [x] **Structured AI output** — Gemini JSON mode for reliable, typed responses
- [x] **Improved error handling** — graceful messages for invalid keys, quota limits, network failures
- [x] **Saved history** — recent searches persisted to `localStorage` with a collapsible panel
- [x] **Shareable results** — concept + mode encoded to URL params for replayable generations
- [x] **Surprise Me** — one-click random topic discovery with auto-generation
- [x] **Inline API key** — always-visible key input with status indicator and link to obtain one
- [x] **Auto-scroll** — page guides the eye to the loader and then to results automatically
- [x] **Mobile performance** — disabled expensive CSS animations and mask calculations on small screens
- [x] **Narrative UX** — consistent "rabbit hole descent" language throughout, no jargon

### Ideas for the Future
- [ ] **Serendipity verification** — use embedding-based semantic distance to validate how unexpected each result truly is
- [ ] **Export results** — save a session as a shareable image or PDF
- [ ] **Keyboard-first flow** — tab-navigation and keyboard shortcut to trigger generation
- [ ] **Domain filters** — opt into (or out of) specific fields like Science, Arts, History for more directed rabbit holes
- [ ] **Chained descents** — click a result to use it as the new starting point and keep going deeper
- [ ] **Multi-language support** — generate results in the user's language

## License

[MIT](LICENSE)
