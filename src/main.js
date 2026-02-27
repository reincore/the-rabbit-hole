import './style.css'

// DOM Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const apiKeyInput = document.getElementById('api-key');
const generateBtn = document.getElementById('generate-btn');
const userInput = document.getElementById('user-input');
const modeSelect = document.getElementById('mode-select');
const resultsArea = document.getElementById('results-area');
const statusContainer = document.getElementById('status-container');
const statusText = document.getElementById('status-text');
const vectorsGrid = document.getElementById('vectors-grid');
const guideToggle = document.getElementById('guide-toggle');
const guideSection = document.querySelector('.guide-section');

// State
let apiKey = localStorage.getItem('rabbit_hole_api_key') || '';

// Initialize
if (apiKey) {
  apiKeyInput.value = apiKey;
}

// Event Listeners
settingsBtn.addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

saveSettingsBtn.addEventListener('click', () => {
  const newKey = apiKeyInput.value.trim();
  if (newKey) {
    apiKey = newKey;
    localStorage.setItem('rabbit_hole_api_key', apiKey);
    settingsModal.classList.add('hidden');
  } else {
    alert('Please enter a valid API key');
  }
});

generateBtn.addEventListener('click', handleGenerate);

guideToggle.addEventListener('click', () => {
  guideSection.classList.toggle('expanded');
});

// Core Logic
async function handleGenerate() {
  const query = userInput.value.trim();
  if (!query) {
    alert('Please provide some input to launch from.');
    return;
  }
  if (!apiKey) {
    alert('Please configure your Gemini API Key in Settings first.');
    settingsModal.classList.remove('hidden');
    return;
  }

  const mode = modeSelect.value;

  // UI Loading State
  generateBtn.disabled = true;
  generateBtn.querySelector('.btn-text').textContent = 'Calculating...';
  generateBtn.querySelector('.btn-icon').classList.add('hidden');
  generateBtn.querySelector('.btn-loader').classList.remove('hidden');

  resultsArea.classList.remove('hidden');
  statusContainer.classList.remove('hidden');
  vectorsGrid.innerHTML = '';

  statusText.textContent = 'Entering The Rabbit Hole... mapping knowledge voids...';

  try {
    const vectors = await fetchCuriosityVectors(query, mode);
    renderVectors(vectors);
  } catch (error) {
    console.error(error);
    statusText.textContent = 'Error: ' + error.message;
    statusText.style.color = 'red';
  } finally {
    generateBtn.disabled = false;
    generateBtn.querySelector('.btn-text').textContent = 'Initiate Escape Sequence';
    generateBtn.querySelector('.btn-icon').classList.remove('hidden');
    generateBtn.querySelector('.btn-loader').classList.add('hidden');
    if (statusText.style.color !== 'red') {
      statusContainer.classList.add('hidden');
    }
  }
}

async function fetchCuriosityVectors(query, mode) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `You are THE RABBIT HOLE — an engine that helps people discover fascinating things they'd never find on their own.

Your job: take what someone is interested in and connect it to surprising, unrelated fields they've never explored. Don't summarize what they already know. Don't be encyclopedic. Be the friend who says "wait, you know what's wild?"

Write in SHORT, CLEAR sentences. No academic jargon. Every line should feel like a fascinating fact you'd share over coffee.

Return exactly 3 discovery cards in this format:
### ⟁ VECTOR [N]: [A short, catchy title — like a headline that makes you click]
**How Far Out:** [LOW / MEDIUM / HIGH]
**Why It Matters:** [One simple sentence connecting this to what the user already knows. Start with "You know how..." or "Remember when..." to ground it.]
**The Surprise:** [One punchy, mind-blowing sentence — the kind that makes someone say "wait, really?!" This is the hook. Make it irresistible.]
**Start Here:** [One specific, concrete action — a paper to read, a video to watch, or a simple experiment to try. Be specific, not vague.]
**Serendipity Score:** [1-10]

Rules:
- Never use words like "paradigm", "synergy", "convergence", "juxtaposition", or "intersection"
- Write like you're texting a curious friend, not writing a thesis
- The Surprise should make someone NEED to Google it
- Start Here must be a real, findable resource or doable action`;

  let userPrompt = `Input: "${query}"\n\n`;
  if (mode === 'stranger_danger') {
    userPrompt += `Mode: Stranger Danger Mode. All vectors must have Serendipity Score >= 8. No topic may share any vocabulary with the user's input. Provide the 3 Vectors strictly.`;
  } else if (mode === 'collision') {
    userPrompt += `Mode: Collision Mode. Treat the user's input as two or more unrelated fields. Find what exists at their intersection and build 3 vectors from that collision point only.`;
  } else {
    userPrompt += `Mode: Standard. Return 3 Curiosity vectors based on the input to escape their conceptual boundaries.`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [{
        parts: [{ text: userPrompt }]
      }],
      generationConfig: {
        temperature: 0.9,
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to fetch from Gemini');
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  return parseVectors(text);
}

function parseVectors(text) {
  const blocks = text.split(/###\s*⟁\s*VECTOR\s*\d+:/i).filter(b => b.trim().length > 0);
  const vectors = [];

  for (const block of blocks) {
    try {
      const titleMatch = block.match(/^(.*?)\n/);
      const title = titleMatch ? titleMatch[1].trim() : "Unknown Vector";

      const velocityMatch = block.match(/\*\*How Far Out:\*\*\s*(LOW|MEDIUM|HIGH)/i);
      const whyMatch = block.match(/\*\*Why It Matters:\*\*\s*([\s\S]*?)(?=\*\*The Surprise:)/i);
      const surpriseMatch = block.match(/\*\*The Surprise:\*\*\s*([\s\S]*?)(?=\*\*Start Here:)/i);
      const stepMatch = block.match(/\*\*Start Here:\*\*\s*([\s\S]*?)(?=\*\*Serendipity Score:)/i);
      const scoreMatch = block.match(/\*\*Serendipity Score:\*\*\s*(\d+)/i);

      vectors.push({
        title: title,
        velocity: velocityMatch ? velocityMatch[1].toUpperCase() : 'MEDIUM',
        why: whyMatch ? whyMatch[1].trim() : 'A surprising connection awaits.',
        surprise: surpriseMatch ? surpriseMatch[1].trim() : 'Something unexpected...',
        step: stepMatch ? stepMatch[1].trim() : 'Start exploring.',
        score: scoreMatch ? scoreMatch[1] : '7'
      });
    } catch (e) {
      console.error("Failed to parse block", block, e);
    }
  }

  if (vectors.length === 0) {
    throw new Error("Could not parse vectors. Format might be incorrect.");
  }

  return vectors.slice(0, 3);
}


function renderVectors(vectors) {
  vectors.forEach((v, index) => {
    const card = document.createElement('div');
    card.className = 'vector-card glass-panel';
    card.dataset.velocity = v.velocity;
    card.style.animationDelay = `${index * 0.15}s`;
    card.style.animation = 'slideUp 0.5s ease backwards';

    const velocityLabel = v.velocity === 'HIGH' ? '🚀 Way Out There'
      : v.velocity === 'MEDIUM' ? '🛰️ A Stretch'
        : '🔭 Nearby';

    const searchQuery = encodeURIComponent(v.title);

    card.innerHTML = `
      <div class="vector-header">
        <h3 class="vector-title">${v.title}</h3>
        <span class="velocity-badge" data-velocity="${v.velocity}">${velocityLabel}</span>
      </div>
      <div class="vector-body">
        <div class="card-section why-section">
          <span class="section-label">🔗 Why It Matters</span>
          <p class="section-content">${v.why}</p>
        </div>
        <div class="card-section surprise-section">
          <span class="section-label">✨ The Surprise</span>
          <p class="section-content surprise-text">${v.surprise}</p>
        </div>
        <div class="card-section action-step">
          <span class="section-label">🧭 Start Here</span>
          <p class="section-content">${v.step}</p>
        </div>
        <div class="card-footer">
          <div class="serendipity">
            <span>Serendipity: ${v.score}/10</span>
            <div class="score-bar">
              <div class="score-fill" style="width: ${(parseInt(v.score) / 10) * 100}%"></div>
            </div>
          </div>
          <a href="https://www.google.com/search?q=${searchQuery}" target="_blank" rel="noopener noreferrer" class="research-link">
            Google this →
          </a>
        </div>
      </div>
    `;
    vectorsGrid.appendChild(card);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

const styleObj = document.createElement('style');
styleObj.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleObj);
