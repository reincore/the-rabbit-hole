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
const charCounter = document.getElementById('char-counter');

// ─── State ───────────────────────────────────────────────────────────────────
let apiKey = localStorage.getItem('rabbit_hole_api_key') || '';
const MAX_INPUT_LENGTH = 1000;

// ─── UUID Fallback ────────────────────────────────────────────────────────────
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
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

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────
userInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    handleGenerate();
  }
});

apiKeyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveSettingsBtn.click();
  }
});

// ─── Character Counter ────────────────────────────────────────────────────────
function updateCharCounter() {
  const len = userInput.value.length;
  charCounter.textContent = `${len} / ${MAX_INPUT_LENGTH}`;
  charCounter.classList.toggle('char-counter-warn', len > MAX_INPUT_LENGTH * 0.9);
  charCounter.classList.toggle('char-counter-over', len >= MAX_INPUT_LENGTH);
}

userInput.addEventListener('input', updateCharCounter);

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
  guideToggle.setAttribute('aria-expanded', guideSection.classList.contains('expanded'));
});

historyToggle.addEventListener('click', () => {
  historyPanel.classList.toggle('expanded');
  historyToggle.setAttribute('aria-expanded', historyPanel.classList.contains('expanded'));
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
      title: { type: "STRING", description: "Short, catchy title — like a headline that makes you want to read more" },
      coreConcept: { type: "STRING", description: "1–2 sentences explaining what this idea is about" },
      whyItMatters: { type: "STRING", description: "1–2 sentences connecting this back to the user's input. Start with 'You know how...' or 'Remember when...' to ground it." },
      theSurprise: { type: "STRING", description: "One punchy sentence that makes someone stop and say 'wait, really?!'" },
      deepDiveQuery: { type: "STRING", description: "A Google search query string (NOT a URL) for exploring this further" },
      serendipityScore: { type: "INTEGER", description: "1–10 score: how unlikely the user was to find this on their own" },
      distance: { type: "STRING", enum: ["LOW", "MEDIUM", "HIGH"], description: "How far this idea is from the user's original topic" }
    },
    required: ["title", "coreConcept", "whyItMatters", "theSurprise", "deepDiveQuery", "serendipityScore", "distance"]
  }
};

const SYSTEM_PROMPTS = {
  standard: `You are THE RABBIT HOLE — you help people stumble onto ideas they would never find on their own.

Take the user's topic and return exactly 3 surprising connections to completely different fields.

RULES:
- Each connection must come from a DIFFERENT field than the input (e.g., if the input is about biology, pull from art, economics, materials science — not other biology topics).
- Write in short, clear sentences. No jargon. Every line should feel like a fascinating fact shared between friends.
- The "whyItMatters" field must start with "You know how..." or "Remember when..." to tie it back to something the user already knows.
- The "theSurprise" must be one sentence that makes someone stop and say "wait, really?!"
- The "deepDiveQuery" must be a Google search query string (NOT a URL) — specific enough to surface good results.
- Never use these words: "paradigm", "synergy", "convergence", "juxtaposition", "intersection", "nexus", "interplay".
- Return exactly 3 results as a JSON array. No extra text, no markdown — pure JSON.`,

  deep_wilderness: `You are THE RABBIT HOLE in DEEP WILDERNESS mode — go as far from the user's topic as possible.

Return exactly 3 discoveries that have almost nothing to do with what the user typed in.

RULES:
1. NO SHARED WORDS: None of your output — title, coreConcept, whyItMatters, theSurprise — may use any word that appears in or relates to the user's input. If the input is "neural networks", you may not use "neural", "network", "neuron", "net", "brain", or "connected" anywhere in your response.
2. NO SHARED FIELDS: Every discovery must come from a completely different field than the input. If the input is about computer science, nothing can come from technology, software, or engineering.
3. NO FAMILIAR SHORTCUTS: Don't lean on well-known comparisons. "The brain is like a computer" is off-limits. Find something genuinely unexpected.
4. SCORE CHECK: Every result must have a serendipityScore of 8 or higher. If something scores below 8, throw it out and find something better.
5. THE 3-CLICK TEST: Before you lock in any result, ask yourself: "Could someone reading about this topic stumble onto this within 3 clicks?" If yes, it's too easy — replace it.

STYLE:
- Write like you're texting a friend, not writing a research paper.
- The "theSurprise" should genuinely catch the reader off guard — something that makes them rethink what they thought they knew.
- The "deepDiveQuery" must be a Google search query string (NOT a URL).
- Never use: "paradigm", "synergy", "convergence", "juxtaposition", "intersection", "nexus", "interplay".
- Return exactly 3 results as a JSON array. No extra text.`,

  collision: `You are THE RABBIT HOLE in COLLISION MODE — smash two unrelated fields together and find what sparks.

The user will give you two fields. Find exactly 3 ideas that only make sense when you hold BOTH fields in your head at once — things that an expert in either field alone would never come up with.

RULES:
1. BOTH FIELDS REQUIRED: Each idea must genuinely need both inputs to work. If you drop one field and the idea still stands on its own, throw it out and find something better.
2. NO CHEAP MASHUPS: Don't just borrow a fact from each field and glue them together. The idea should feel like something new that only appears when the two fields meet. An expert in Field A should find it surprising. An expert in Field B should find it surprising. But someone thinking about both should feel it click.
3. THE SURPRISE TEST: Before you lock in any idea, ask: "If I showed this to 100 experts in Field A and 100 experts in Field B separately, would most of them predict this?" If more than 5 would, it's too obvious — replace it.

STYLE:
- Short, clear sentences. No jargon.
- The "whyItMatters" must explain why you need BOTH fields to get to this idea.
- The "theSurprise" should capture the moment the two things click together — that feeling of "oh, these are the same thing."
- The "deepDiveQuery" must be a Google search query string (NOT a URL).
- Never use: "paradigm", "synergy", "convergence", "juxtaposition", "intersection", "nexus", "interplay".
- Return exactly 3 results as a JSON array. No extra text.`
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
    return `Two fields: "${parts[0]}" + "${parts[1]}"\n\nFind 3 ideas that only exist because both of these fields are in the room together. Each one should be impossible to reach from either field on its own.`;
  }
  if (mode === 'deep_wilderness') {
    return `My topic: "${query}"\n\nFind 3 ideas as far from this as possible. Each must score 8 or higher, use none of the same words as my topic, and come from a completely unrelated field. The further and stranger, the better.`;
  }
  return `My topic: "${query}"\n\nFind 3 surprising connections to completely different fields. Each one must come from somewhere totally unrelated to this.`;
}

// ─── Core Logic ──────────────────────────────────────────────────────────────
async function handleGenerate() {
  const query = userInput.value.trim();
  if (!query) {
    showError(classifyError(new Error('empty_input')));
    resultsArea.classList.remove('hidden');
    return;
  }
  if (query.length > MAX_INPUT_LENGTH) {
    showToast(`Input too long — keep it under ${MAX_INPUT_LENGTH} characters`, 'error');
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
    id: generateId(),
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
    const wrapper = document.createElement('div');
    wrapper.className = 'history-item-wrapper';

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
      if (inputSubtitle) inputSubtitle.textContent = SUBTITLES[item.mode] || SUBTITLES.standard;
      renderVectors(item.vectors);
      resultsArea.classList.remove('hidden');
      statusContainer.classList.add('hidden');
      updateShareURL(item.query, item.mode);
      updateCharCounter();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'history-item-delete';
    deleteBtn.setAttribute('aria-label', 'Delete this history entry');
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteHistoryItem(item.id);
    });

    wrapper.appendChild(el);
    wrapper.appendChild(deleteBtn);
    historyList.appendChild(wrapper);
  });
}

function deleteHistoryItem(id) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  renderHistory();
  showToast('Entry removed');
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
