import './style.css'

// ─── DOM Elements ────────────────────────────────────────────────────────────
const apiKeyInput = document.getElementById('main-api-key');
const saveSettingsBtn = document.getElementById('save-key-btn');
const apiStatusText = document.getElementById('api-status-text');
const generateBtn = document.getElementById('generate-btn');
const surpriseBtn = document.getElementById('surprise-btn');
const userInput = document.getElementById('user-input');
const modeSelect = document.getElementById('mode-select');
const inputSubtitle = document.getElementById('input-subtitle');
const resultsArea = document.getElementById('results-area');
const statusContainer = document.getElementById('status-container');
const statusText = document.getElementById('status-text');
const vectorsGrid = document.getElementById('vectors-grid');
const guideToggle = document.getElementById('guide-toggle');
const guideSection = document.querySelector('.guide-section');
const historyPanel = document.getElementById('history-panel');
const historyToggle = document.getElementById('history-toggle');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const toastContainer = document.getElementById('toast-container');

// ─── State ───────────────────────────────────────────────────────────────────
let apiKey = localStorage.getItem('rabbit_hole_api_key') || '';
const HISTORY_KEY = 'rabbit_hole_history';

// ─── Initialize ──────────────────────────────────────────────────────────────
function updateApiKeyUI() {
  if (apiKey) {
    apiKeyInput.value = apiKey;
    apiStatusText.textContent = 'API Key Set';
    apiStatusText.className = 'status-set';
  } else {
    apiStatusText.textContent = 'Missing — You need a key to explore.';
    apiStatusText.className = 'status-missing';
  }
}
updateApiKeyUI();

// ─── Dynamic Placeholders (Task 3.1) ─────────────────────────────────────────
const PLACEHOLDERS = {
  standard: "e.g., I've been studying artificial neural networks and how they match the brain's visual cortex...",
  deep_wilderness: "e.g., philosophy of science, stoic ethics, the history of zero...",
  collision: "e.g., Byzantine architecture / competitive powerlifting"
};

const SUBTITLES = {
  standard: "Drop a topic or idea and see how deep it goes...",
  deep_wilderness: "Enter any concept, and prepare to go as far outside your comfort zone as possible.",
  collision: "Drop two unrelated ideas separated by a slash (e.g., music / botany) to find where they collide."
};

modeSelect.addEventListener('change', () => {
  const mode = modeSelect.value;
  userInput.placeholder = PLACEHOLDERS[mode] || PLACEHOLDERS.standard;
  if (inputSubtitle) {
    inputSubtitle.textContent = SUBTITLES[mode] || SUBTITLES.standard;
  }
});

// ─── Event Listeners ─────────────────────────────────────────────────────────
saveSettingsBtn.addEventListener('click', () => {
  const newKey = apiKeyInput.value.trim();
  if (newKey) {
    apiKey = newKey;
    localStorage.setItem('rabbit_hole_api_key', apiKey);
    updateApiKeyUI();
    showToast('API key saved successfully');
  } else {
    showToast('Please enter a valid API key', 'error');
  }
});

generateBtn.addEventListener('click', handleGenerate);

// ─── Surprise Me ─────────────────────────────────────────────────────────────
const RANDOM_TOPICS = [
  "The way ant colonies self-organize without a leader",
  "How sourdough fermentation works at the microbial level",
  "The philosophy of boredom and why modern life avoids it",
  "How medieval monks preserved knowledge before the printing press",
  "The physics of why ice is slippery",
  "Color perception and why we can't fully describe color to each other",
  "How the stock market flash crashes happen and recover instantly",
  "The linguistics of how new words enter a language",
  "Why some songs get stuck in your head and others don't",
  "How concrete hardens and why ancient Roman concrete outlasts ours",
  "The evolution of human laughter",
  "Why maps are always wrong and what we sacrifice in every projection",
  "The psychology of why we procrastinate even on things we love",
  "How birds navigate thousands of miles without GPS",
  "The strange economics of free-to-play video games",
  "Why some languages have no word for certain colors",
  "How sleep deprivation physically changes your brain",
  "The mathematics behind fair voting systems",
  "Why spicy food feels like pain and why we still eat it",
  "The history of silence as a compositional tool in music",
  "How coral reefs communicate stress to each other",
  "The role of forgetting in human memory and creativity",
  "How zero was invented and why it was controversial",
  "The psychology of crowds and why individual judgment disappears in them",
  "Why the sky is blue but sunsets are orange"
];

surpriseBtn.addEventListener('click', () => {
  const topic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
  userInput.value = topic;
  // Reset to standard mode for best surprise
  modeSelect.value = 'standard';
  if (inputSubtitle) inputSubtitle.textContent = SUBTITLES.standard;
  userInput.placeholder = PLACEHOLDERS.standard;
  handleGenerate();
});

guideToggle.addEventListener('click', () => {
  guideSection.classList.toggle('expanded');
});

historyToggle.addEventListener('click', () => {
  historyPanel.classList.toggle('expanded');
});

clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
  showToast('History cleared');
});

// ─── Toast Notifications ─────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ─── Error State UI (Task 3.4) ───────────────────────────────────────────────
function classifyError(error, response) {
  if (!apiKey) {
    return {
      icon: '🔑',
      title: 'No API Key',
      message: 'No API key configured. Scroll up to add your Gemini key.',
      action: { label: 'Enter API Key', handler: () => { apiKeyInput.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }
    };
  }
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      icon: '📡',
      title: 'Network Error',
      message: "Can't reach Google's servers. Check your internet connection and try again.",
      action: null
    };
  }
  if (response && response.status === 400) {
    return {
      icon: '🔐',
      title: 'Invalid API Key',
      message: 'Your API key was rejected by Google. Double-check it at the top.',
      action: { label: 'Enter API Key', handler: () => { apiKeyInput.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }
    };
  }
  if (response && response.status === 429) {
    return {
      icon: '⏳',
      title: 'Quota Exceeded',
      message: "You've hit your API quota limit. Wait a few minutes or check your quota in Google AI Studio.",
      action: null
    };
  }
  if (error.message.includes('parse') || error.message.includes('JSON') || error.message.includes('unexpected')) {
    return {
      icon: '⚠️',
      title: 'Unexpected Response',
      message: 'The AI returned an unexpected response. Try a different input or try again.',
      action: null
    };
  }
  return {
    icon: '❌',
    title: 'Something Went Wrong',
    message: error.message || 'An unknown error occurred.',
    action: null
  };
}

function showError(errorInfo) {
  vectorsGrid.innerHTML = '';
  statusContainer.classList.add('hidden');

  const errorCard = document.createElement('div');
  errorCard.className = 'error-card glass-panel';
  errorCard.innerHTML = `
    <div class="error-card-inner">
      <span class="error-icon">${errorInfo.icon}</span>
      <div class="error-content">
        <h3 class="error-title">${errorInfo.title}</h3>
        <p class="error-message">${errorInfo.message}</p>
        ${errorInfo.action ? `<button class="error-action-btn primary-btn">${errorInfo.action.label}</button>` : ''}
      </div>
    </div>
  `;

  if (errorInfo.action) {
    errorCard.querySelector('.error-action-btn').addEventListener('click', errorInfo.action.handler);
  }

  vectorsGrid.appendChild(errorCard);
}

// ─── Prompt Architecture (Task 2) ────────────────────────────────────────────
const RESPONSE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      title: { type: "STRING", description: "Short, catchy vector title — like a headline that makes you click" },
      coreConcept: { type: "STRING", description: "1–2 sentence explanation of what this new intellectual territory is" },
      whyItMatters: { type: "STRING", description: "1–2 sentences connecting this back to the user's input. Start with 'You know how...' or 'Remember when...' to ground it." },
      theSurprise: { type: "STRING", description: "One punchy, mind-blowing sentence — the hook that makes someone say 'wait, really?!'" },
      deepDiveQuery: { type: "STRING", description: "A well-formed Google search query string (NOT a URL) for exploring this vector further" },
      serendipityScore: { type: "INTEGER", description: "1–10 score: how unlikely the user was to discover this on their own" },
      distance: { type: "STRING", enum: ["LOW", "MEDIUM", "HIGH"], description: "Conceptual distance from the user's input" }
    },
    required: ["title", "coreConcept", "whyItMatters", "theSurprise", "deepDiveQuery", "serendipityScore", "distance"]
  }
};

const SYSTEM_PROMPTS = {
  standard: `You are THE RABBIT HOLE — a serendipity engine that helps people discover ideas they would never find on their own.

Your job: take the user's input concept and return exactly 3 "Curiosity Vectors" — surprising connections to completely different fields the user has never considered.

RULES:
- Each vector must cross into a DIFFERENT domain from the input (e.g., if the input is about biology, vectors should pull from art, economics, materials science — not other biology topics).
- Write in SHORT, CLEAR sentences. No academic jargon. Every line should feel like a fascinating fact shared over coffee.
- The "whyItMatters" field must start with "You know how..." or "Remember when..." to anchor it to the user's existing knowledge.
- The "theSurprise" must be a single sentence that would make someone stop scrolling and say "wait, really?!"
- The "deepDiveQuery" must be a well-formed Google search query string (NOT a URL) — specific enough to surface relevant results.
- Never use these words: "paradigm", "synergy", "convergence", "juxtaposition", "intersection", "nexus", "interplay".
- Return exactly 3 vectors as a JSON array. No extra text, no markdown — pure JSON.`,

  deep_wilderness: `You are THE RABBIT HOLE operating in DEEP WILDERNESS mode — maximum serendipity, zero comfort zone.

Your job: return exactly 3 Curiosity Vectors that are as conceptually distant as possible from the user's input.

HARD CONSTRAINTS:
1. ZERO VOCABULARY OVERLAP: No vector title, coreConcept, whyItMatters, or theSurprise may share any root word with the user's input. If the input is "neural networks", you may not use "neural", "network", "neuron", "net", "brain", or "connected" in any output field.
2. ZERO DOMAIN OVERLAP: No vector may come from the same field, discipline, or industry as the input. If the input is about computer science, no vector may come from technology, software, or engineering.
3. NO COMMON ANALOGIES: Reject any vector where the connection relies on a well-known analogy or metaphor (e.g., "the brain is like a computer" is BANNED).
4. SERENDIPITY FLOOR: Every vector MUST have a serendipityScore of 8 or higher. If a vector scores below 8, discard it and generate a replacement.
5. SELF-CHECK: Before finalizing each vector, mentally verify: "Could a person studying the input topic have stumbled on this within 3 clicks?" If yes, discard it.

STYLE:
- Write like you're texting a curious friend, not writing a thesis.
- The "theSurprise" must induce genuine cognitive dissonance — the reader should feel their mental model shift.
- The "deepDiveQuery" must be a well-formed Google search query string (NOT a URL).
- Never use: "paradigm", "synergy", "convergence", "juxtaposition", "intersection", "nexus", "interplay".
- Return exactly 3 vectors as a JSON array. No extra text.`,

  collision: `You are THE RABBIT HOLE operating in COLLISION MODE — the particle accelerator of ideas.

The user will provide two unrelated fields. Your job: find exactly 3 Curiosity Vectors that exist EXCLUSIVELY at the intersection of both fields — ideas that could NOT have been predicted by an expert in either field individually.

HARD CONSTRAINTS:
1. GENUINE INTERSECTION ONLY: Each vector must require knowledge of BOTH input fields to make sense. If you remove either field and the vector still works, discard it.
2. EMERGENT NOVELTY: The output concept must be something that only becomes visible when both input concepts are held in mind simultaneously. A domain expert in Field A should find it surprising; a domain expert in Field B should find it surprising; but someone thinking about BOTH should feel the click of recognition.
3. NO SURFACE-LEVEL MASHUPS: Do not simply alternate facts from each field. The vector must represent a genuine conceptual collision — a new idea born from the impact.
4. UNPREDICTABILITY TEST: Before finalizing each vector, ask: "Would a panel of 100 experts in Field A and 100 experts in Field B independently predict this connection?" If more than 5 would, discard it.

STYLE:
- Write in SHORT, CLEAR sentences. No academic jargon.
- The "whyItMatters" must explain why BOTH fields are necessary for this insight.
- The "theSurprise" must make the reader feel the collision — the moment two unrelated things snap together.
- The "deepDiveQuery" must be a well-formed Google search query string (NOT a URL).
- Never use: "paradigm", "synergy", "convergence", "juxtaposition", "intersection", "nexus", "interplay".
- Return exactly 3 vectors as a JSON array. No extra text.`
};

const MODE_TEMPERATURES = {
  standard: 0.9,
  deep_wilderness: 1.2,
  collision: 1.0
};

function buildUserPrompt(query, mode) {
  if (mode === 'collision') {
    const parts = query.split('/').map(s => s.trim()).filter(Boolean);
    if (parts.length < 2) {
      throw new Error('COLLISION_FORMAT');
    }
    return `Collision input: "${parts[0]}" + "${parts[1]}"\n\nFind 3 vectors that exist ONLY at the collision point of these two fields. Each idea must be impossible to reach from either field alone.`;
  }
  if (mode === 'deep_wilderness') {
    return `Input concept: "${query}"\n\nGenerate 3 Deep Wilderness vectors. Each must score 8+ on serendipity, share ZERO vocabulary with my input, and come from a completely alien domain. Prioritize cognitive dissonance over comfort.`;
  }
  return `My current concept: "${query}"\n\nReturn 3 Curiosity Vectors that escape this concept's gravity well. Each vector must come from a different, unrelated domain.`;
}

// ─── Core Logic ──────────────────────────────────────────────────────────────
async function handleGenerate() {
  const query = userInput.value.trim();
  if (!query) {
    showError(classifyError(new Error('empty_input')));
    resultsArea.classList.remove('hidden');
    return;
  }
  if (!apiKey) {
    showError(classifyError(new Error('no_key')));
    resultsArea.classList.remove('hidden');
    return;
  }

  const mode = modeSelect.value;

  // Validate collision mode format
  if (mode === 'collision') {
    const parts = query.split('/').map(s => s.trim()).filter(Boolean);
    if (parts.length < 2) {
      resultsArea.classList.remove('hidden');
      showError({
        icon: '💥',
        title: 'Two Concepts Needed',
        message: 'Collision Mode needs two concepts separated by / — e.g., "origami / jazz".',
        action: null
      });
      return;
    }
  }

  // UI Loading State
  generateBtn.disabled = true;
  generateBtn.querySelector('.btn-text').textContent = 'Descending...';
  generateBtn.querySelector('.btn-icon').classList.add('hidden');
  generateBtn.querySelector('.btn-loader').classList.remove('hidden');

  resultsArea.classList.remove('hidden');
  statusContainer.classList.remove('hidden');
  vectorsGrid.innerHTML = '';

  statusText.textContent = 'Entering The Rabbit Hole... finding strange connections...';
  statusText.style.color = '';

  // Auto-scroll to status
  statusContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

  let lastResponse = null;

  try {
    const vectors = await fetchCuriosityVectors(query, mode, (resp) => { lastResponse = resp; });
    renderVectors(vectors);
    saveToHistory(query, mode, vectors);
    updateShareURL(query, mode);
    statusContainer.classList.add('hidden');

    // Auto-scroll to results grid with offset for header
    const headerOffset = 100;
    const elementPosition = vectorsGrid.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  } catch (error) {
    console.error(error);
    showError(classifyError(error, lastResponse));
  } finally {
    generateBtn.disabled = false;
    generateBtn.querySelector('.btn-text').textContent = 'Enter the Rabbit Hole';
    generateBtn.querySelector('.btn-icon').classList.remove('hidden');
    generateBtn.querySelector('.btn-loader').classList.add('hidden');
  }
}

async function fetchCuriosityVectors(query, mode, onResponse) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.standard;
  const userPrompt = buildUserPrompt(query, mode);
  const temperature = MODE_TEMPERATURES[mode] || 0.9;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [{
        parts: [{ text: userPrompt }]
      }],
      generationConfig: {
        temperature,
        response_mime_type: "application/json",
        response_schema: RESPONSE_SCHEMA
      }
    })
  });

  if (onResponse) onResponse(response);

  if (!response.ok) {
    let errMsg = 'Failed to fetch from Gemini';
    try {
      const err = await response.json();
      errMsg = err.error?.message || errMsg;
    } catch (_) { /* ignore parse error */ }
    const error = new Error(errMsg);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error('The AI returned an unexpected empty response.');
  }

  const text = data.candidates[0].content.parts[0].text;

  let vectors;
  try {
    vectors = JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse AI response as JSON.');
  }

  if (!Array.isArray(vectors) || vectors.length === 0) {
    throw new Error('The AI returned an unexpected response format.');
  }

  return vectors.slice(0, 3);
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function renderVectors(vectors) {
  vectorsGrid.innerHTML = '';

  vectors.forEach((v, index) => {
    const card = document.createElement('div');
    card.className = 'vector-card glass-panel';
    const dist = (v.distance || 'MEDIUM').toUpperCase();
    card.dataset.velocity = dist;
    card.style.animationDelay = `${index * 0.15}s`;
    card.style.animation = 'slideUp 0.5s ease backwards';

    const searchQuery = encodeURIComponent(v.deepDiveQuery || v.title);

    card.innerHTML = `
      <div class="vector-header">
        <h3 class="vector-title">${escapeHtml(v.title)}</h3>
      </div>
      <div class="vector-body">
        <div class="card-section core-section">
          <span class="section-label">Concept</span>
          <p class="section-content">${escapeHtml(v.coreConcept || '')}</p>
        </div>
        <div class="card-section why-section">
          <span class="section-label">Bridge</span>
          <p class="section-content">${escapeHtml(v.whyItMatters || '')}</p>
        </div>
        <div class="card-section surprise-section">
          <span class="section-label">Twist</span>
          <p class="section-content surprise-text">${escapeHtml(v.theSurprise || '')}</p>
        </div>
        <div class="card-footer">
          <div class="serendipity">
            <span>Serendipity: ${v.serendipityScore || 7}/10</span>
            <div class="score-bar">
              <div class="score-fill" style="width: ${(parseInt(v.serendipityScore || 7) / 10) * 100}%"></div>
            </div>
          </div>
          <a href="https://www.google.com/search?q=${searchQuery}" target="_blank" rel="noopener noreferrer" class="research-link">
            Deep dive →
          </a>
        </div>
      </div>
    `;
    vectorsGrid.appendChild(card);
  });

  // Copy Link button
  const copyRow = document.createElement('div');
  copyRow.className = 'copy-link-row';
  copyRow.innerHTML = `
    <button id="copy-link-btn" class="copy-link-btn" title="Copy shareable link">
      <i data-lucide="link" class="copy-link-icon"></i>
      <span>Copy shareable link</span>
    </button>
  `;
  vectorsGrid.appendChild(copyRow);
  copyRow.querySelector('#copy-link-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy link', 'error');
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Saved History (Task 3.2) ────────────────────────────────────────────────
function saveToHistory(query, mode, vectors) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  history.unshift({
    id: crypto.randomUUID(),
    query,
    mode,
    vectors,
    timestamp: Date.now()
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  historyList.innerHTML = '';

  if (history.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No recent dives yet. Start exploring!</p>';
    clearHistoryBtn.classList.add('hidden');
    return;
  }

  clearHistoryBtn.classList.remove('hidden');

  const modeLabels = {
    standard: 'Standard Descent',
    deep_wilderness: 'Deep Wilderness',
    collision: 'Collision'
  };

  history.forEach(item => {
    const el = document.createElement('button');
    el.className = 'history-item';
    const timeAgo = getTimeAgo(item.timestamp);
    el.innerHTML = `
      <div class="history-item-top">
        <span class="history-query">${escapeHtml(item.query.length > 60 ? item.query.slice(0, 60) + '…' : item.query)}</span>
        <span class="history-mode-badge">${modeLabels[item.mode] || item.mode}</span>
      </div>
      <span class="history-time">${timeAgo}</span>
    `;
    el.addEventListener('click', () => {
      userInput.value = item.query;
      modeSelect.value = item.mode;
      userInput.placeholder = PLACEHOLDERS[item.mode] || PLACEHOLDERS.standard;
      renderVectors(item.vectors);
      resultsArea.classList.remove('hidden');
      statusContainer.classList.add('hidden');
      updateShareURL(item.query, item.mode);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    historyList.appendChild(el);
  });
}

function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ─── Shareable Vectors (Task 3.3) ────────────────────────────────────────────
function updateShareURL(query, mode) {
  const url = new URL(window.location);
  url.searchParams.set('q', query);
  url.searchParams.set('mode', mode);
  history.replaceState(null, '', url);
}

function checkSharedParams() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const mode = params.get('mode');
  if (q) {
    userInput.value = q;
    if (mode && modeSelect.querySelector(`option[value="${mode}"]`)) {
      modeSelect.value = mode;
      userInput.placeholder = PLACEHOLDERS[mode] || PLACEHOLDERS.standard;
      if (inputSubtitle) {
        inputSubtitle.textContent = SUBTITLES[mode] || SUBTITLES.standard;
      }
    }
    handleGenerate();
  }
}

// ─── Initialization ──────────────────────────────────────────────────────────
renderHistory();
checkSharedParams();

// ─── Keyframes ───────────────────────────────────────────────────────────────
const styleObj = document.createElement('style');
styleObj.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleObj);
