/* practice-saying.js
   Shared logic for Name and Address spelling/saying practice pages
   ------------------------------------------------------------------ */

'use strict';

/* ── TTS helpers ──────────────────────────────────────────────────── */

/**
 * Speak a single utterance. Returns a Promise that resolves when done.
 * @param {string} text
 * @param {string} [lang='en-US']
 */
function speakOne(text, lang = 'en-US') {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.88;
    utt.onend  = () => resolve();
    utt.onerror = () => resolve();
    window.speechSynthesis.speak(utt);
  });
}

/**
 * Speak a sequence of phrases with a pause between each.
 * @param {Array<{text:string, lang?:string}>} items
 * @param {number} [pauseMs=600]
 */
async function speakSequence(items, pauseMs = 600) {
  for (let i = 0; i < items.length; i++) {
    const { text, lang } = items[i];
    if (!text || !text.trim()) continue;
    await speakOne(text, lang || 'en-US');
    if (i < items.length - 1) {
      await delay(pauseMs);
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── Letter spelling helpers ──────────────────────────────────────── */

/**
 * Convert a string to a TTS-friendly spelling string.
 * Spaces become the word "space", hyphens become "hyphen".
 * Letters are separated by commas so TTS pauses slightly between them.
 * @param {string} str
 * @returns {string}  e.g. "R, O, M, E, R, O"
 */
function spellOut(str) {
  return str
    .toUpperCase()
    .split('')
    .map(ch => {
      if (ch === ' ')  return 'space';
      if (ch === '-')  return 'hyphen';
      return ch;
    })
    .join(', ');
}

/**
 * Convert a digit string to a sequence of digit names.
 * "78201" → "7, 8, 2, 0, 1"
 */
function spellDigits(str) {
  return str.split('').map(ch => {
    if (ch === ' ') return 'space';
    return ch;
  }).join(', ');
}

/* ── Display bar logic ────────────────────────────────────────────── */

const PLACEHOLDER = {
  name:    '(tap keys or type above)',
  address: '(tap keys or type above)',
};

/**
 * Sync a display bar element with a string value.
 * @param {HTMLElement} el   .display-bar element
 * @param {string}      val  current accumulated value
 * @param {string}      [placeholder]
 */
function updateDisplayBar(el, val, placeholder) {
  if (!val) {
    el.textContent = placeholder || PLACEHOLDER.name;
    el.classList.add('empty');
  } else {
    el.textContent = val;
    el.classList.remove('empty');
  }
}

/* ── Panel builder: name panel ────────────────────────────────────── */

/**
 * Wire up a name practice panel.
 *
 * Expected HTML structure (data-panel="family|given|middle"):
 *   .practice-panel[data-panel]
 *     .panel-body
 *       .name-input-row > input.name-input
 *       (.suffix-wrap > select.suffix-select)   ← family only
 *       .display-bar
 *       .key-grid                                ← populated by this fn
 *       .action-row
 *         button.btn-speak[data-speak]
 *         button.btn-clear[data-clear]
 *       .speaking-status
 *
 * @param {HTMLElement} panel
 */
function initNamePanel(panel) {
  const role     = panel.dataset.panel; // 'family' | 'given' | 'middle'
  const input    = panel.querySelector('.name-input');
  const display  = panel.querySelector('.display-bar');
  const grid     = panel.querySelector('.key-grid');
  const speakBtn = panel.querySelector('.btn-speak');
  const clearBtn = panel.querySelector('.btn-clear');
  const status   = panel.querySelector('.speaking-status');
  const suffix   = panel.querySelector('.suffix-select'); // may be null

  let value = '';

  // Build key grid: A–Z, then special keys
  buildLetterGrid(grid, (ch) => appendChar(ch));

  // Keyboard input: sync from text field
  if (input) {
    input.addEventListener('input', () => {
      value = sanitizeNameInput(input.value);
      input.value = value;               // reflect sanitised value back
      updateDisplayBar(display, value);
    });
  }

  function appendChar(ch) {
    value += ch;
    if (input) input.value = value;
    updateDisplayBar(display, value);
  }

  function sanitizeNameInput(val) {
    // Allow letters, spaces, hyphens only
    return val.replace(/[^A-Za-záéíóúüñÁÉÍÓÚÜÑ '\-]/g, '').toUpperCase();
  }

  clearBtn.addEventListener('click', () => {
    value = '';
    if (input) input.value = '';
    updateDisplayBar(display, '', PLACEHOLDER.name);
    if (suffix) suffix.value = '';
    setStatus('');
    window.speechSynthesis && window.speechSynthesis.cancel();
  });

  speakBtn.addEventListener('click', async () => {
    if (!value && !(suffix && suffix.value)) return;
    speakBtn.disabled = true;
    setStatus('🔊 Speaking…');

    const spelled   = value ? spellOut(value) : '';
    const suffixVal = suffix ? suffix.value : '';

    let phrase = '';
    if (role === 'family') {
      phrase = spelled
        ? `My last name is spelled: ${spelled}${suffixVal ? ', ' + suffixVal : ''}`
        : '';
    } else if (role === 'given') {
      phrase = spelled ? `My first name is spelled: ${spelled}` : '';
    } else {
      phrase = spelled ? `My middle name is spelled: ${spelled}` : '';
    }

    if (phrase) {
      await speakOne(phrase);
    }

    setStatus('');
    speakBtn.disabled = false;
  });

  // Initialise display
  updateDisplayBar(display, '', PLACEHOLDER.name);

  function setStatus(msg) {
    if (status) status.textContent = msg;
  }
}

/* ── Panel builder: address panel ─────────────────────────────────── */

/**
 * Wire up the address page panels.
 * Called once on DOMContentLoaded in practice-saying-addresses.html.
 */
function initAddressPage() {
  // Street number + name
  initAddressPanel(
    document.getElementById('panel-street'),
    { digits: false, label: 'street-name', alphaNum: false }
  );
  // Apt/Ste/Flr: alphanumeric
  initAddressPanel(
    document.getElementById('panel-apt'),
    { digits: true, label: 'apt', alphaNum: true }
  );
  // City
  initAddressPanel(
    document.getElementById('panel-city'),
    { digits: false, label: 'city', alphaNum: false }
  );
  // ZIP: digits only
  initZipPanel(document.getElementById('panel-zip'));

  // State: dropdown, no grid
  initStatePanel(document.getElementById('panel-state'));

  // Read street address button (chains street + apt)
  const btnStreet = document.getElementById('btn-read-street');
  if (btnStreet) {
    btnStreet.addEventListener('click', () => readStreetAddress());
  }
  // Read rest button (chains city + state + zip)
  const btnRest = document.getElementById('btn-read-rest');
  if (btnRest) {
    btnRest.addEventListener('click', () => readRestAddress());
  }
}

/* Individual address panel */
function initAddressPanel(panel, opts) {
  if (!panel) return;
  const input    = panel.querySelector('.name-input');
  const display  = panel.querySelector('.display-bar');
  const grid     = panel.querySelector('.key-grid');
  const speakBtn = panel.querySelector('.btn-speak');
  const clearBtn = panel.querySelector('.btn-clear');
  const status   = panel.querySelector('.speaking-status');

  let value = '';

  if (grid) {
    if (opts.alphaNum) {
      buildAlphaNumGrid(grid, ch => appendChar(ch));
    } else if (opts.label === 'city') {
      buildLetterGrid(grid, ch => appendChar(ch));
    } else {
      // street: letters + digits + space
      buildStreetGrid(grid, ch => appendChar(ch));
    }
  }

  if (input) {
    input.addEventListener('input', () => {
      value = sanitizeAddress(input.value, opts);
      input.value = value;
      updateDisplayBar(display, value);
    });
  }

  function appendChar(ch) {
    value += ch;
    if (input) input.value = value;
    updateDisplayBar(display, value);
  }

  function sanitizeAddress(val, opts) {
    if (opts.alphaNum) return val.replace(/[^A-Za-z0-9 \-]/g, '').toUpperCase();
    return val.replace(/[^A-Za-z0-9 \-]/g, '').toUpperCase();
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      value = '';
      if (input) input.value = '';
      updateDisplayBar(display, '', PLACEHOLDER.address);
      if (status) status.textContent = '';
      window.speechSynthesis && window.speechSynthesis.cancel();
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', async () => {
      if (!value) return;
      speakBtn.disabled = true;
      if (status) status.textContent = '🔊 Speaking…';
      const phrase = buildAddressPhrase(opts.label, value);
      await speakOne(phrase);
      if (status) status.textContent = '';
      speakBtn.disabled = false;
    });
  }

  // Store value getter on element for chained read-all
  panel._getValue = () => value;

  updateDisplayBar(display, '', PLACEHOLDER.address);
}

/* ZIP panel: digits only */
function initZipPanel(panel) {
  if (!panel) return;
  const input    = panel.querySelector('.name-input');
  const display  = panel.querySelector('.display-bar');
  const grid     = panel.querySelector('.key-grid');
  const speakBtn = panel.querySelector('.btn-speak');
  const clearBtn = panel.querySelector('.btn-clear');
  const status   = panel.querySelector('.speaking-status');

  let value = '';

  if (grid) buildNumGrid(grid, ch => appendChar(ch));

  if (input) {
    input.addEventListener('input', () => {
      value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
      input.value = value;
      updateDisplayBar(display, value);
    });
  }

  function appendChar(ch) {
    if (value.length >= 10) return;
    value += ch;
    if (input) input.value = value;
    updateDisplayBar(display, value);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      value = '';
      if (input) input.value = '';
      updateDisplayBar(display, '', PLACEHOLDER.address);
      if (status) status.textContent = '';
    });
  }

  if (speakBtn) {
    speakBtn.addEventListener('click', async () => {
      if (!value) return;
      speakBtn.disabled = true;
      if (status) status.textContent = '🔊 Speaking…';
      await speakOne(`My zip code is: ${spellDigits(value)}`);
      if (status) status.textContent = '';
      speakBtn.disabled = false;
    });
  }

  panel._getValue = () => value;
  updateDisplayBar(display, '', PLACEHOLDER.address);
}

/* State dropdown panel */
function initStatePanel(panel) {
  if (!panel) return;
  const sel      = panel.querySelector('.state-select');
  const speakBtn = panel.querySelector('.btn-speak');
  const status   = panel.querySelector('.speaking-status');

  if (speakBtn && sel) {
    speakBtn.addEventListener('click', async () => {
      if (!sel.value) return;
      speakBtn.disabled = true;
      if (status) status.textContent = '🔊 Speaking…';
      await speakOne(`The state is: ${sel.value}`);
      if (status) status.textContent = '';
      speakBtn.disabled = false;
    });
  }

  panel._getValue = () => (sel ? sel.value : '');
}

/* Build phrase for individual field speak buttons */
function buildAddressPhrase(label, value) {
  if (label === 'street-name') {
    return `The street address is: ${spellOut(value)}`;
  }
  if (label === 'apt') {
    return `Apartment ${spellOut(value)}`;
  }
  if (label === 'city') {
    return `The city is: ${value}`;
  }
  return value;
}

/* Chained read: street address block */
async function readStreetAddress() {
  const btn     = document.getElementById('btn-read-street');
  const status  = document.getElementById('status-street-all');
  const pStreet = document.getElementById('panel-street');
  const pApt    = document.getElementById('panel-apt');

  const street = pStreet ? pStreet._getValue() : '';
  const apt    = pApt    ? pApt._getValue()    : '';

  if (!street) return;

  if (btn) btn.disabled = true;
  if (status) status.textContent = '🔊 Speaking…';

  const items = [];
  let streetPhrase = `The street address is: ${spellOut(street)}`;
  if (apt) streetPhrase += `, Apartment ${spellOut(apt)}`;
  items.push({ text: streetPhrase });

  await speakSequence(items);

  if (status) status.textContent = '';
  if (btn) btn.disabled = false;
}

/* Chained read: city / state / zip */
async function readRestAddress() {
  const btn    = document.getElementById('btn-read-rest');
  const status = document.getElementById('status-rest-all');
  const pCity  = document.getElementById('panel-city');
  const pState = document.getElementById('panel-state');
  const pZip   = document.getElementById('panel-zip');

  const city  = pCity  ? pCity._getValue()  : '';
  const state = pState ? pState._getValue() : '';
  const zip   = pZip   ? pZip._getValue()   : '';

  if (!city && !state && !zip) return;

  if (btn) btn.disabled = true;
  if (status) status.textContent = '🔊 Speaking…';

  const items = [];
  if (city && state) {
    items.push({ text: `The city and state are: ${city}, ${state}` });
  } else if (city) {
    items.push({ text: `The city is: ${city}` });
  } else if (state) {
    items.push({ text: `The state is: ${state}` });
  }
  if (zip) {
    items.push({ text: `The zip code is: ${spellDigits(zip)}` });
  }

  await speakSequence(items, 700);

  if (status) status.textContent = '';
  if (btn) btn.disabled = false;
}

/* ── Grid builders ────────────────────────────────────────────────── */

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DIGITS  = '0123456789'.split('');

function buildLetterGrid(container, onKey) {
  container.innerHTML = '';
  LETTERS.forEach(ch => {
    container.appendChild(makeKey(ch, ch, onKey));
  });
  container.appendChild(makeDivider());
  container.appendChild(makeSpecialKey('HYPHEN', '-', onKey));
  container.appendChild(makeSpecialKey('SPACE',  ' ', onKey));
  container.appendChild(makeBackspaceKey(container, onKey));
}

function buildStreetGrid(container, onKey) {
  container.innerHTML = '';
  DIGITS.forEach(ch => {
    container.appendChild(makeKey(ch, ch, onKey, 'num'));
  });
  container.appendChild(makeDivider());
  LETTERS.forEach(ch => {
    container.appendChild(makeKey(ch, ch, onKey));
  });
  container.appendChild(makeDivider());
  container.appendChild(makeSpecialKey('SPACE', ' ', onKey));
  container.appendChild(makeBackspaceKey(container, onKey));
}

function buildAlphaNumGrid(container, onKey) {
  container.innerHTML = '';
  DIGITS.forEach(ch => {
    container.appendChild(makeKey(ch, ch, onKey, 'num'));
  });
  container.appendChild(makeDivider());
  LETTERS.forEach(ch => {
    container.appendChild(makeKey(ch, ch, onKey));
  });
  container.appendChild(makeDivider());
  container.appendChild(makeSpecialKey('HYPHEN', '-', onKey));
  container.appendChild(makeBackspaceKey(container, onKey));
}

function buildNumGrid(container, onKey) {
  container.innerHTML = '';
  DIGITS.forEach(ch => {
    container.appendChild(makeKey(ch, ch, onKey, 'num'));
  });
  container.appendChild(makeDivider());
  container.appendChild(makeBackspaceKey(container, onKey));
}

function makeKey(label, value, onKey, extraClass) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'key' + (extraClass ? ' ' + extraClass : '');
  btn.textContent = label;
  btn.setAttribute('aria-label', label);
  btn.addEventListener('click', () => {
    onKey(value);
    // Speak the letter/digit immediately
    speakOne(letterName(value));
  });
  return btn;
}

function makeSpecialKey(label, value, onKey) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'key wide special';
  btn.textContent = label;
  btn.addEventListener('click', () => onKey(value));
  return btn;
}

function makeBackspaceKey(container, onKey) {
  // Backspace needs access to the panel's value — handled via the panel
  // We emit a special sentinel that the panel function handles
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'key wide backspace';
  btn.textContent = '⌫ DELETE';
  btn.setAttribute('data-backspace', 'true');
  return btn;
}

function makeDivider() {
  const div = document.createElement('div');
  div.className = 'key-divider';
  return div;
}

/**
 * How TTS speaks each key when tapped.
 */
function letterName(ch) {
  if (ch === ' ') return 'space';
  if (ch === '-') return 'hyphen';
  return ch; // browser TTS reads single letters as letter names
}

/* ── Backspace wiring ─────────────────────────────────────────────── */
// Called by each panel initialiser after building the grid,
// passing in its own value reference via a closure callback.

/**
 * Wire backspace buttons in a grid to a callback.
 * @param {HTMLElement} grid
 * @param {Function}    onBackspace  called with no args; panel updates value
 */
function wireBackspace(grid, onBackspace) {
  grid.querySelectorAll('[data-backspace]').forEach(btn => {
    btn.addEventListener('click', onBackspace);
  });
}

/* ── US States + territories ──────────────────────────────────────── */

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado',
  'Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho',
  'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana',
  'Maine','Maryland','Massachusetts','Michigan','Minnesota',
  'Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York',
  'North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
  'Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington',
  'West Virginia','Wisconsin','Wyoming',
  // DC + territories
  'District of Columbia',
  'Puerto Rico','Guam','U.S. Virgin Islands',
  'American Samoa','Northern Mariana Islands',
];

/**
 * Populate a <select> element with US states + territories.
 * @param {HTMLSelectElement} sel
 */
function populateStateSelect(sel) {
  sel.innerHTML = '<option value="">— Select state or territory —</option>';
  US_STATES.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  });
}

/* ── Re-export for inline init scripts ───────────────────────────── */
window.PS = {
  initNamePanel,
  initAddressPage,
  populateStateSelect,
  wireBackspace,
  updateDisplayBar,
  speakOne,
};
