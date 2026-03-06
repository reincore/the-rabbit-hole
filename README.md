# The Rabbit Hole Engine 🕳️🐇

*An intellectual boundary expansion engine — escape your knowledge gravity well.*

### **[🔗 Live Demo → reincore.github.io/the-rabbit-hole](https://reincore.github.io/the-rabbit-hole/)**

![The Rabbit Hole Demo](public/rabbit_hole_demo.webp)

## What Is This?

You know how you always end up reading the same kinds of things? The Rabbit Hole breaks that loop. Drop in any idea, a topic, a half-formed thought, a rabbit you've been chasing, and it finds three surprising directions you'd never have gone on your own. Not answers. New questions.

## The Three Modes

### ⚡ Standard
The default escape route. Enter any concept, idea, or half-formed thought. The engine returns 3 Curiosity Vectors — unexpected connections to fields you've never considered. Good for broadening your mental map.

### 🌀 Deep Wilderness
Maximum serendipity. Vectors share *zero vocabulary* with your input and must score 8+ on the serendipity scale. This is for the intellectually fearless — the results will feel alien, and that's the point.

### 💥 Collision Mode
Feed the engine two completely unrelated fields separated by `/` — for example:

> `Byzantine architecture / competitive powerlifting`

The engine finds ideas that exist *exclusively at their intersection* — concepts that could not have emerged from either field alone. The weirder the pairing, the better.

## How It Works

1. **Enter Your Concept** — Type any idea, topic, or raw note into the input field. In Collision Mode, enter two concepts separated by a `/` delimiter (e.g., `origami / emergency medicine`).
2. **Select Your Mode** — Choose Standard, Deep Wilderness, or Collision Mode from the dropdown.
3. **Initiate Escape Sequence** — The engine's AI analyzes your input and calculates 3 highly unexpected conceptual jumps.
4. **Read Your Vectors** — Each card reveals:
   - **The Core Concept** — What the new territory is.
   - **Why It Matters** — The connection back to your original idea.
   - **The Surprise** — The mind-bending fact that makes you need to know more.
5. **Dive In** — Click the deep-dive link to start exploring your newly discovered intellectual territory via Google.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.19+ or v22.12+)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repo
git clone https://github.com/reincore/the-rabbit-hole.git
cd the-rabbit-hole

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open the provided `localhost` URL in your browser, click the **Settings icon (⚙️)** in the top right to enter your Gemini API key, and initiate your first escape sequence.

## Privacy & Security

The Rabbit Hole is a **BYOK (Bring Your Own Key)** application. Your Gemini API key is stored exclusively in your browser's `localStorage` and is **never transmitted to any server other than Google's Gemini API**.

> [!NOTE]
> Your API key *is* visible in the browser's Network tab during API calls — this is inherent to any client-side API call. We recommend using a key with appropriate quota limits and restricting it to the Gemini API in [Google AI Studio](https://aistudio.google.com/app/apikey).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | [Vite](https://vitejs.dev/) |
| Language | JavaScript (ES6+) |
| UI | HTML5 / CSS3 — custom dark-mode glassmorphism framework |
| Icons | [Lucide](https://lucide.dev/) |
| AI | [Google Gemini API](https://ai.google.dev/) |
| Deploy | GitHub Pages (automated CI/CD) |

## Roadmap

- [x] **Dynamic input placeholders** — context-aware placeholder text per mode
- [x] **Saved History** — persist recent generations to `localStorage` with a "Recent Dives" panel
- [x] **Shareable Vectors** — encode concept + mode into URL params for linkable, replayable generations
- [x] **Improved error handling** — graceful, specific UI for invalid keys, quota limits, and network failures
- [x] **Structured AI output** — migrated from free-text parsing to Gemini JSON mode for reliable, typed responses
- [ ] **Serendipity score verification** — validate surprise factor using embedding-based semantic distance
- [x] **Mobile polish** — responsive refinements for small screens and touch interactions

## License

[MIT](LICENSE)
