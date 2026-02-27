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

// State
let apiKey = localStorage.getItem('antigravity_api_key') || '';

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
    localStorage.setItem('antigravity_api_key', apiKey);
    settingsModal.classList.add('hidden');
  } else {
    alert('Please enter a valid API key');
  }
});

generateBtn.addEventListener('click', handleGenerate);

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

  statusText.textContent = 'Engaging Antigravity engine... mapping knowledge voids...';

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

  const systemInstruction = `You are ANTIGRAVITY — an Intellectual Boundary Expansion Engine.
Your sole purpose is to escape the user's knowledge gravity well: the invisible pull that keeps them circling what they already know. You do not answer questions. You generate curiosity vectors — pathways into intellectual territory the user has never visited.

You return exactly 3 Curiosity Vectors in this format:
### ⟁ VECTOR [N]: [Title]
**Escape Velocity:** [LOW / MEDIUM / HIGH]
**Collision Point:** [Text]
**The Hook:** [Text]
**First Step:** [Text]
**Serendipity Score:** [1-10]

Never summarize what the user already said back to them. Never provide a balanced, encyclopedic overview. Connect unrelated fields. The goal is serendipity and expanding intellectual horizons.`;

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

      const velocityMatch = block.match(/\*\*Escape Velocity:\*\*\s*(LOW|MEDIUM|HIGH)/i);
      const collisionMatch = block.match(/\*\*Collision Point:\*\*\s*([\s\S]*?)(?=\*\*The Hook:)/i);
      const hookMatch = block.match(/\*\*The Hook:\*\*\s*([\s\S]*?)(?=\*\*First Step:)/i);
      const stepMatch = block.match(/\*\*First Step:\*\*\s*([\s\S]*?)(?=\*\*Serendipity Score:)/i);
      const scoreMatch = block.match(/\*\*Serendipity Score:\*\*\s*(\d+)/i);

      vectors.push({
        title: title,
        velocity: velocityMatch ? velocityMatch[1].toUpperCase() : 'MEDIUM',
        collision: collisionMatch ? collisionMatch[1].trim() : 'Unknown path',
        hook: hookMatch ? hookMatch[1].trim() : '...',
        step: stepMatch ? stepMatch[1].trim() : 'Explore.',
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

    card.innerHTML = `
      <div class="vector-header">
        <h3 class="vector-title">${v.title}</h3>
        <span class="velocity-badge">${v.velocity} VELOCITY</span>
      </div>
      <div class="vector-body">
        <div class="domain-collision">${v.collision}</div>
        <div class="hook">${v.hook}</div>
        <div class="action-step">
          <strong>First Step</strong>
          <p>${v.step}</p>
        </div>
        <div class="serendipity">
          <span>Serendipity Score: ${v.score}/10</span>
          <div class="score-bar">
            <div class="score-fill" style="width: ${(parseInt(v.score) / 10) * 100}%"></div>
          </div>
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
