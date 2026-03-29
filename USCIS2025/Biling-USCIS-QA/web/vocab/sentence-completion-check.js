// sentence-completion-check.js
// USCIS Naturalization Test - Sentence Completion and Writing Practice

// ─── DATA ────────────────────────────────────────────────────────────────────
// Each item:
//   sentence: full correct sentence (used for TTS and answer checking)
//   template: display string; use {BLANK} where the blank goes
//   options: array of strings; first item is always the correct answer (shuffled on render)
//   endsWithAbbrev: true if sentence ends with an abbreviation period (e.g. D.C.)

const SENTENCES = [
    {
        sentence: "Washington was the Father of Our Country.",
        template: "{BLANK} was the Father of Our Country.",
        options: ["Washington", "Adams", "Lincoln", "Congress"]
    },
    {
        sentence: "Washington was the first President of the United States.",
        template: "Washington was the first {BLANK} of the United States.",
        options: ["President", "capital", "citizen", "Congress"]
    },
    {
        sentence: "Washington is on the dollar bill.",
        template: "Washington is on the {BLANK} bill.",
        options: ["dollar", "fifty", "first", "one hundred"]
    },
    {
        sentence: "Adams lived in the White House.",
        template: "Adams lived in the {BLANK}.",
        options: ["White House", "Congress", "New York City", "Canada"]
    },
    {
        sentence: "Adams was the second President.",
        template: "Adams was the {BLANK} President.",
        options: ["second", "one hundred", "first", "Civil War"]
    },
    {
        sentence: "Lincoln was President during the Civil War.",
        template: "{BLANK} was President during the Civil War.",
        options: ["Lincoln", "Adams", "Washington", "Delaware"]
    },
    {
        sentence: "Citizens have the right to vote.",
        template: "Citizens have the right to {BLANK}.",
        options: ["vote", "states", "taxes", "Congress"]
    },
    {
        sentence: "One right of citizens is freedom of speech.",
        template: "One right of citizens is freedom of {BLANK}.",
        options: ["speech", "capital", "flag", "state"]
    },
    {
        sentence: "Citizens can pay taxes.",
        template: "Citizens can pay {BLANK}.",
        options: ["taxes", "most", "right", "vote"]
    },
    {
        sentence: "People come to the United States to be free.",
        template: "People come to the United States to be {BLANK}.",
        options: ["free", "right", "President", "most"]
    },
    {
        sentence: "American Indians lived in the United States first.",
        template: "{BLANK} lived in the United States first.",
        options: ["American Indians", "Senators", "citizens", "Congress"]
    },
    {
        sentence: "Citizens can elect the President.",
        template: "Citizens can {BLANK} the President.",
        options: ["elect", "vote", "pay", "meets"]
    },
    {
        sentence: "The President lives in the White House.",
        template: "The {BLANK} lives in the White House.",
        options: ["President", "Senators", "Congress", "people"]
    },
    {
        sentence: "The President meets with Congress.",
        template: "The President meets with {BLANK}.",
        options: ["Congress", "taxes", "states", "White House"]
    },
    {
        sentence: "We elect the President in November.",
        template: "We elect the President in {BLANK}.",
        options: ["November", "June", "October", "February"]
    },
    {
        sentence: "Washington, D.C. is the capital of the United States.",
        template: "Washington, D.C. is the {BLANK} of the United States.",
        options: ["capital", "White House", "north", "largest"],
        endsWithAbbrev: true
    },
    {
        sentence: "Canada is north of the United States.",
        template: "{BLANK} is north of the United States.",
        options: ["Canada", "Mexico", "New York City", "White House"]
    },
    {
        sentence: "Mexico is south of the United States.",
        template: "Mexico is {BLANK} of the United States.",
        options: ["south", "north", "largest", "second"]
    },
    {
        sentence: "Alaska is the largest state.",
        template: "Alaska is the {BLANK} state.",
        options: ["largest", "first", "fifty", "second"]
    },
    {
        sentence: "Delaware was the first state.",
        template: "Delaware was the {BLANK} state.",
        options: ["first", "second", "taxes", "one hundred"]
    },
    {
        sentence: "Congress meets in the capital, Washington, D.C.",
        template: "Congress meets in the {BLANK}, Washington, D.C.",
        options: ["capital", "New York City", "White House", "July"],
        endsWithAbbrev: true
    },
    {
        sentence: "Congress has one hundred Senators.",
        template: "Congress has one hundred {BLANK}.",
        options: ["Senators", "rights", "states", "taxes"]
    },
    {
        sentence: "The United States has fifty states.",
        template: "The United States has {BLANK} states.",
        options: ["fifty", "north", "south", "one hundred"]
    },
    {
        sentence: "Flag Day is in June.",
        template: "Flag Day is in {BLANK}.",
        options: ["June", "July", "November", "October"]
    },
    {
        sentence: "Independence Day is in July.",
        template: "Independence Day is in {BLANK}.",
        options: ["July", "February", "June", "November"]
    },
    {
        sentence: "Labor Day is in September.",
        template: "Labor Day is in {BLANK}.",
        options: ["September", "July", "June", "October"]
    },
    {
        sentence: "Columbus Day is in October.",
        template: "Columbus Day is in {BLANK}.",
        options: ["October", "September", "May", "July"]
    },
    {
        sentence: "Thanksgiving is in November.",
        template: "Thanksgiving is in {BLANK}.",
        options: ["November", "February", "October", "July"]
    },
    {
        sentence: "Memorial Day is in May.",
        template: "Memorial Day is in {BLANK}.",
        options: ["May", "October", "July", "February"]
    },
    {
        sentence: "Presidents' Day is in February.",
        template: "Presidents' Day is in {BLANK}.",
        options: ["February", "June", "July", "November"]
    },
    {
        sentence: "The flag of the United States is red, white, and blue.",
        template: "The flag of the United States is red, white, and {BLANK}.",
        options: ["blue", "green", "black", "gold"]
    }
];

// ─── HINTS ───────────────────────────────────────────────────────────────────
// Analyze student input vs correct sentence; return array of hint objects
function analyzeAnswer(student, correct) {
    const hints = [];

    // Capitalization: first character
    if (student.length > 0 && student[0] !== correct[0]) {
        if (student[0].toLowerCase() === correct[0].toLowerCase()) {
            hints.push({
                en: "Check the capitalization of the first word.",
                es: "Revisa el uso de mayúsculas en la primera palabra."
            });
        }
    }

    // End punctuation
    const correctEnd = correct[correct.length - 1];
    const studentEnd = student.length > 0 ? student[student.length - 1] : "";
    if (studentEnd !== correctEnd) {
        hints.push({
            en: "Check the punctuation at the end of the sentence.",
            es: "Revisa la puntuación al final de la oración."
        });
    }

    // Internal capitalization differences (e.g. White House, Congress)
    const cWords = tokenizeWords(correct);
    const sWords = tokenizeWords(student);
    let capsIssue = false;
    for (let i = 0; i < Math.min(cWords.length, sWords.length); i++) {
        const cw = cWords[i].text;
        const sw = sWords[i].text;
        if (cw.toLowerCase() === sw.toLowerCase() && cw !== sw && !capsIssue) {
            capsIssue = true;
        }
    }
    if (capsIssue) {
        hints.push({
            en: "Check the capitalization of words inside the sentence.",
            es: "Revisa las mayúsculas dentro de la oración."
        });
    }

    // Spelling: words present but spelled differently (not just caps)
    let spellIssue = false;
    for (let i = 0; i < Math.min(cWords.length, sWords.length); i++) {
        const cw = cWords[i].text;
        const sw = sWords[i].text;
        if (cw.toLowerCase() !== sw.toLowerCase() && !spellIssue) {
            spellIssue = true;
        }
    }
    if (sWords.length !== cWords.length) spellIssue = true;
    if (spellIssue) {
        hints.push({
            en: "Check the spelling of the words.",
            es: "Revisa la ortografía de las palabras."
        });
    }

    return hints;
}

// ─── WORD TOKENIZER ──────────────────────────────────────────────────────────
// Splits a sentence into tokens preserving punctuation attached to words.
// Returns array of {text, trailing} objects.
function tokenizeWords(str) {
    // Split on spaces, keep each token
    return str.trim().split(/\s+/).map(w => ({ text: w }));
}

// ─── SHUFFLE ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── BUILD SENTENCE DISPLAY ──────────────────────────────────────────────────
function buildSentenceHTML(template) {
    return template.replace('{BLANK}',
        '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
}

// ─── WORD-LEVEL HIGHLIGHT ────────────────────────────────────────────────────
// Compare student answer to correct sentence word by word.
// Returns HTML string with correct words in green, wrong words in red.
function buildHighlightHTML(student, correct) {
    const cTokens = tokenizeWords(correct);
    const sTokens = tokenizeWords(student);
    const maxLen = Math.max(cTokens.length, sTokens.length);
    let html = "";
    for (let i = 0; i < maxLen; i++) {
        const cWord = cTokens[i] ? cTokens[i].text : "";
        const sWord = sTokens[i] ? sTokens[i].text : "___";
        if (sWord === cWord) {
            html += `<span class="word-correct">${escapeHTML(sWord)}</span> `;
        } else {
            html += `<span class="word-wrong">${escapeHTML(sWord)}</span> `;
        }
    }
    return html.trim();
}

function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ─── TTS ─────────────────────────────────────────────────────────────────────
function speakSentence(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.88;
    window.speechSynthesis.speak(utt);
}

// ─── SPANISH TOGGLE ──────────────────────────────────────────────────────────
let spanishVisible = false;

function toggleSpanish() {
    spanishVisible = !spanishVisible;
    document.querySelectorAll('.spanish-text').forEach(el => {
        el.style.display = spanishVisible ? 'block' : 'none';
    });
    document.getElementById('toggle-spanish').textContent =
        spanishVisible ? 'Hide Spanish / Ocultar español' : 'Show Spanish / Mostrar español';
}

// ─── RENDER ALL ITEMS ────────────────────────────────────────────────────────
function renderAll() {
    const container = document.getElementById('sentences-container');
    container.innerHTML = '';

    SENTENCES.forEach((item, idx) => {
        const shuffledOptions = shuffle(item.options);
        const div = document.createElement('div');
        div.className = 'sentence-item';
        div.id = `item-${idx}`;

        // Sentence number
        const numDiv = document.createElement('div');
        numDiv.className = 'sentence-number';
        numDiv.textContent = `${idx + 1} of ${SENTENCES.length}`;
        div.appendChild(numDiv);

        // Sentence display with blank
        const sentDiv = document.createElement('div');
        sentDiv.className = 'sentence-display';
        sentDiv.innerHTML = buildSentenceHTML(item.template);
        div.appendChild(sentDiv);

        // Multiple choice options
        const mcDiv = document.createElement('div');
        mcDiv.className = 'mc-options';
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'mc-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleMC(idx, opt, item.options[0], div));
            mcDiv.appendChild(btn);
        });
        div.appendChild(mcDiv);

        // Writing prompt (shown after correct MC, hidden initially)
        const promptDiv = document.createElement('div');
        promptDiv.className = 'writing-prompt';
        promptDiv.id = `prompt-${idx}`;
        promptDiv.style.display = 'none';
        promptDiv.innerHTML = `
            <span class="writing-prompt-text">Practice listening to and writing this sentence?</span>
            <button class="prompt-yes-btn" id="prompt-yes-${idx}">Yes</button>
            <button class="prompt-no-btn" id="prompt-no-${idx}">No</button>
        `;
        div.appendChild(promptDiv);

        // Writing section (hidden until Yes clicked)
        const writeDiv = document.createElement('div');
        writeDiv.className = 'writing-section';
        writeDiv.id = `write-${idx}`;
        writeDiv.innerHTML = `
            <div class="writing-label">
                <strong>Listen and write the sentence you hear.</strong>
                <span class="spanish-text"><em>Escucha y escribe la oración que oyes.</em></span>
            </div>
            <button class="speak-btn" id="speak-${idx}">&#9654; Play sentence / Reproducir</button>
            <input type="text" class="writing-input" id="input-${idx}"
                placeholder="Type the sentence here..." autocomplete="off" autocorrect="off"
                autocapitalize="off" spellcheck="false" />
            <div class="action-row">
                <button class="check-btn" id="check-${idx}">Check my answer / Verificar</button>
                <button class="hint-btn" id="hint-${idx}">Hint / Ayuda</button>
                <button class="reveal-btn" id="reveal-${idx}">Show answer / Ver respuesta</button>
            </div>
            <div class="feedback-msg" id="msg-${idx}"></div>
        `;
        div.appendChild(writeDiv);

        container.appendChild(div);

        // Bind writing phase events
        document.getElementById(`speak-${idx}`)
            .addEventListener('click', () => speakSentence(item.sentence));
        document.getElementById(`check-${idx}`)
            .addEventListener('click', () => handleCheck(idx, item));
        document.getElementById(`hint-${idx}`)
            .addEventListener('click', () => handleHint(idx, item));
        document.getElementById(`reveal-${idx}`)
            .addEventListener('click', () => handleReveal(idx, item));

        // Bind prompt yes/no
        document.getElementById(`prompt-yes-${idx}`)
            .addEventListener('click', () => handlePromptYes(idx, item));
        document.getElementById(`prompt-no-${idx}`)
            .addEventListener('click', () => handlePromptNo(idx));
    });
}

// ─── MULTIPLE CHOICE HANDLER ─────────────────────────────────────────────────
function handleMC(idx, chosen, correct, itemDiv) {
    const mcDiv = itemDiv.querySelector('.mc-options');
    const btns = mcDiv.querySelectorAll('.mc-btn');

    if (chosen !== correct) {
        // Wrong: highlight only the chosen button red, disable it, keep others available
        btns.forEach(btn => {
            if (btn.textContent === chosen) {
                btn.classList.add('incorrect');
                btn.disabled = true;
            }
        });
        return;
    }

    // Correct: disable all MC buttons, highlight chosen green, show writing prompt
    btns.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === chosen) btn.classList.add('correct');
    });
    document.getElementById(`prompt-${idx}`).style.display = 'block';
}

// ─── PROMPT YES HANDLER ───────────────────────────────────────────────────────
function handlePromptYes(idx, item) {
    const itemDiv = document.getElementById(`item-${idx}`);
    // Hide sentence, MC options, and prompt
    itemDiv.querySelector('.sentence-display').style.display = 'none';
    itemDiv.querySelector('.mc-options').style.display = 'none';
    document.getElementById(`prompt-${idx}`).style.display = 'none';
    // Show writing section
    const writeDiv = document.getElementById(`write-${idx}`);
    writeDiv.style.display = 'block';
    writeDiv.querySelectorAll('.spanish-text').forEach(el => {
        el.style.display = spanishVisible ? 'block' : 'none';
    });
    speakSentence(item.sentence);
}

// ─── PROMPT NO HANDLER ────────────────────────────────────────────────────────
function handlePromptNo(idx) {
    // Hide the yes/no prompt, replace with a small "Practice writing" link
    const promptDiv = document.getElementById(`prompt-${idx}`);
    promptDiv.innerHTML = `<button class="practice-later-btn" id="practice-later-${idx}">Practice writing this sentence</button>`;
    // Bind the later button — need item reference
    document.getElementById(`practice-later-${idx}`)
        .addEventListener('click', () => handlePromptYes(idx, SENTENCES[idx]));
}

// ─── WRITING CHECK HANDLER ───────────────────────────────────────────────────
// Track attempt counts per item
const attempts = {};

function handleCheck(idx, item) {
    const input = document.getElementById(`input-${idx}`);
    const msgEl = document.getElementById(`msg-${idx}`);
    const hintBtn = document.getElementById(`hint-${idx}`);
    const revealBtn = document.getElementById(`reveal-${idx}`);

    if (!attempts[idx]) attempts[idx] = 0;
    attempts[idx]++;

    const student = input.value;
    const correct = item.sentence;

    if (student === correct) {
        msgEl.innerHTML = '<span class="feedback-correct">&#10003; Correct!</span>';
        input.disabled = true;
        document.getElementById(`check-${idx}`).disabled = true;
        hintBtn.style.display = 'none';
        revealBtn.style.display = 'none';
        document.getElementById(`item-${idx}`).classList.add('completed');
    } else {
        msgEl.innerHTML = buildHighlightHTML(student, correct);
        if (attempts[idx] >= 1) {
            hintBtn.style.display = 'inline-block';
        }
        if (attempts[idx] >= 3) {
            revealBtn.style.display = 'inline-block';
        }
    }
}

// ─── HINT HANDLER ────────────────────────────────────────────────────────────
function handleHint(idx, item) {
    const input = document.getElementById(`input-${idx}`);
    const msgEl = document.getElementById(`msg-${idx}`);
    const hints = analyzeAnswer(input.value, item.sentence);

    if (hints.length === 0) {
        msgEl.innerHTML = '<span class="feedback-hint">Almost there — compare your answer carefully.</span>';
        return;
    }

    let html = '<div class="feedback-hint">';
    hints.forEach(h => {
        html += `<div>${escapeHTML(h.en)}<span class="spanish-text"><em>${escapeHTML(h.es)}</em></span></div>`;
    });
    html += '</div>';
    msgEl.innerHTML = html;

    // Apply Spanish visibility to newly added hint spans
    msgEl.querySelectorAll('.spanish-text').forEach(el => {
        el.style.display = spanishVisible ? 'block' : 'none';
    });
}

// ─── REVEAL HANDLER ──────────────────────────────────────────────────────────
function handleReveal(idx, item) {
    const msgEl = document.getElementById(`msg-${idx}`);
    msgEl.innerHTML = `<div class="revealed-answer"><strong>Correct sentence:</strong> ${escapeHTML(item.sentence)}</div>`;
    const input = document.getElementById(`input-${idx}`);
    input.value = '';
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    document.getElementById('toggle-spanish')
        .addEventListener('click', toggleSpanish);
});
