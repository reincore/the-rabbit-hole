# Antigravity Engine

**Antigravity** is an Intellectual Boundary Expansion Engine. Its sole purpose is to help you escape your knowledge gravity well—the invisible pull that keeps you circling what you already know. 

It does not answer questions. It generates **Curiosity Vectors**: pathways into intellectual territory you have never visited.

![Antigravity Demo](public/vite.svg) *// TODO: Add actual screenshot*

## Overview

The engine takes your current knowledge, interests, or notes, and finds the most *surprising* adjacent territories, prioritizing cross-domain collisions, historical blind spots, and counterintuitive inversions.

Built with **Vite**, **Vanilla JS**, and the **Google Gemini API**, it provides a highly premium, dark-mode, glassmorphic UI to explore new concepts.

## Features

- **Standard Mode:** Returns 3 Curiosity Vectors based on your input to escape your conceptual boundaries.
- **Stranger Danger Mode:** Extreme serendipity. Vectors share zero vocabulary with your input and have a Serendipity Score of 8+.
- **Collision Mode:** Takes two unrelated fields you provide and finds vectors at their intersection.
- **Local API Key Storage:** Your Gemini API Key is stored securely in your browser's local storage.

## Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided `localhost` URL in your browser.
5. Click the Settings icon (gear) in the top right to input your Gemini API key.
6. Enter a topic and initiate your escape sequence!

## Technology Stack

- Vite
- HTML5 / CSS3 (Vanilla, custom UI framework)
- JavaScript (ES6+)
- Lucide Icons
- Google Gemini API

## License

MIT
