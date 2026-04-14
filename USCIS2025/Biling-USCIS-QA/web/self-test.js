// self-test.js — shared quiz logic for USCIS 2025 civics self-test pages
//
// Each chapter self-test HTML page must define these constants in a <script>
// block BEFORE loading this file:
//
//   const CURRENT_CHAPTER = 3;       // integer or addendum letter string e.g. "A"
//   const CHAPTER_LABEL   = "3";     // display label for UI
//   const CHAPTER_TITLE   = "The Executive Branch";  // English title

// ── Storage keys ──────────────────────────────────────────────────────────────

const STORAGE_RATINGS   = "civics_ratings";    // { "023": "got-it", "036": "needs-work", … }
const STORAGE_COMPLETED = "civics_completed";  // { "1": true, "2": true, "A": true, … }
const STORAGE_SESSION   = "civics_session";    // { chKey: { queue, index, sessionRatings } }

// ── Review pool size ──────────────────────────────────────────────────────────
// Grows modestly with chapter number so later sessions offer more review
// without becoming unwieldy. Addenda use a fixed count of 5.

function reviewCount() {
  const n = parseInt(CURRENT_CHAPTER, 10);
  if (isNaN(n)) return 5;                        // addendum
  return Math.min(5 + Math.floor((n - 1) / 3), 10); // 5 for ch1–3, up to 10 by ch12
}

// ── Audio path helpers ────────────────────────────────────────────────────────

function audioFilename(qNum, lang) {
  const n = parseInt(qNum, 10);
  const pad = n < 10 ? "0" + n : String(n);
  return lang + "_2025Q" + pad + ".mp3";
}

function audioFolder(qNum) {
  const n = parseInt(qNum, 10);
  if (n <= 15)  return "Q01-15/audio/";
  if (n <= 30)  return "Q16-30/audio/";
  if (n <= 45)  return "Q31-45/audio/";
  if (n <= 62)  return "Q46-62/audio/";
  if (n <= 72)  return "Q63-72/audio/";
  if (n <= 89)  return "Q73-89/audio/";
  if (n <= 99)  return "Q90-99/audio/";
  if (n <= 118) return "Q100-118/audio/";
  return "Q119-128/audio/";
}

function audioSrc(qNum, lang) {
  return audioFolder(qNum) + audioFilename(qNum, lang);
}

// ── Q&A page deep-link helper ─────────────────────────────────────────────────

function qaPageLink(qNum) {
  const n = parseInt(qNum, 10);
  const pad = n < 10 ? "0" + n : String(n);
  if (n <= 15)  return "Q01-15/Biling-USCIS-QA01-15.html#question-" + pad;
  if (n <= 30)  return "Q16-30/Biling-USCIS-QA16-30.html#question-" + pad;
  if (n <= 45)  return "Q31-45/Biling-USCIS-QA31-45.html#question-" + pad;
  if (n <= 62)  return "Q46-62/Biling-USCIS-QA46-62.html#question-" + pad;
  if (n <= 72)  return "Q63-72/Biling-USCIS-QA63-72.html#question-" + pad;
  if (n <= 89)  return "Q73-89/Biling-USCIS-QA73-89.html#question-" + pad;
  if (n <= 99)  return "Q90-99/Biling-USCIS-QA90-99.html#question-" + pad;
  if (n <= 118) return "Q100-118/Biling-USCIS-QA100-118.html#question-" + pad;
  return "Q119-128/Biling-USCIS-QA119-128.html#question-" + pad;
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function getRatings() {
  try { return JSON.parse(localStorage.getItem(STORAGE_RATINGS)) || {}; }
  catch (e) { return {}; }
}

function saveRating(qNum, rating) {
  const r = getRatings();
  r[String(qNum)] = rating;
  try { localStorage.setItem(STORAGE_RATINGS, JSON.stringify(r)); }
  catch (e) { /* incognito or storage full */ }
}

function getCompleted() {
  try { return JSON.parse(localStorage.getItem(STORAGE_COMPLETED)) || {}; }
  catch (e) { return {}; }
}

function markChapterComplete(chKey) {
  const c = getCompleted();
  c[String(chKey)] = true;
  try { localStorage.setItem(STORAGE_COMPLETED, JSON.stringify(c)); }
  catch (e) { /* incognito */ }
}

// ── Session save/restore ──────────────────────────────────────────────────────

function saveSession() {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_SESSION)) || {};
    all[String(CURRENT_CHAPTER)] = {
      queue:          queue,
      index:          currentIndex,
      sessionRatings: sessionRatings
    };
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(all));
  } catch (e) { /* incognito or storage full */ }
}

function loadSession() {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_SESSION)) || {};
    return all[String(CURRENT_CHAPTER)] || null;
  } catch (e) { return null; }
}

function clearSession() {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_SESSION)) || {};
    delete all[String(CURRENT_CHAPTER)];
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(all));
  } catch (e) { /* incognito */ }
}

// ── Review pool builder ───────────────────────────────────────────────────────
// Pool = questions from completed chapters, excluding:
//   - questions in the current chapter (learner already seeing those)
//   - multi-chapter questions (avoid duplicating cross-chapter content)
// Selection is weighted: "needs-work" questions are 3× more likely to appear.

function buildReviewPool() {
  const completed  = getCompleted();
  const ratings    = getRatings();
  const currentSet = new Set(CHAPTER_QUESTIONS[CURRENT_CHAPTER].map(Number));

  const weighted = [];

  for (const [chKey, qs] of Object.entries(CHAPTER_QUESTIONS)) {
    // Only draw from chapters the learner has completed
    if (!completed[String(chKey)]) continue;
    // Skip the current chapter
    if (String(chKey) === String(CURRENT_CHAPTER)) continue;

    for (const q of qs) {
      const n = Number(q);
      // Exclude questions that appear in the current chapter
      if (currentSet.has(n)) continue;
      // Exclude questions that appear in multiple chapters
      if (MULTI_CHAPTER_QUESTIONS.has(n)) continue;
      // Only include questions that exist in CIVICS_QUESTIONS data
      const key = String(n).padStart(3, "0");
      if (!CIVICS_QUESTIONS[key]) continue;

      const rating = ratings[String(n)] || ratings[key] || null;
      const weight = rating === "needs-work" ? 3 : 1;
      for (let i = 0; i < weight; i++) weighted.push(n);
    }
  }

  return weighted;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick up to `count` unique items from the weighted pool.
function sampleWeighted(weightedPool, count) {
  const shuffled = shuffle(weightedPool);
  const seen = new Set();
  const result = [];
  for (const q of shuffled) {
    if (!seen.has(q)) {
      seen.add(q);
      result.push(q);
      if (result.length >= count) break;
    }
  }
  return result;
}

// ── Queue builder ─────────────────────────────────────────────────────────────

function buildQueue() {
  const chapterNums = CHAPTER_QUESTIONS[CURRENT_CHAPTER].map(Number);
  const reviewPool  = buildReviewPool();
  const reviewPick  = sampleWeighted(reviewPool, reviewCount());

  return [
    ...chapterNums.map(q => ({ qNum: q, phase: "chapter" })),
    ...reviewPick.map(q => ({ qNum: q, phase: "review"  }))
  ];
}

// ── State ─────────────────────────────────────────────────────────────────────

let queue          = [];
let currentIndex   = 0;
let sessionRatings = {};   // { qNum: "got-it"|"needs-work" } — all questions this session
let esVisible      = false;

// ── DOM refs ──────────────────────────────────────────────────────────────────

const screenStart   = document.getElementById("screen-start");
const screenQuiz    = document.getElementById("screen-quiz");
const screenResults = document.getElementById("screen-results");

const progressFill  = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const phaseBadge    = document.getElementById("phase-badge");
const reviewHeading = document.getElementById("review-heading");

const qNumEl        = document.getElementById("q-num");
const qTextEn       = document.getElementById("q-text-en");
const qTextEs       = document.getElementById("q-text-es");
const starredNote   = document.getElementById("starred-note");
const toggleEsBtn   = document.getElementById("toggle-es-btn");
const esSection     = document.getElementById("es-section");
const esAnswersSect = document.getElementById("es-answers-section");

const revealBtn     = document.getElementById("reveal-btn");
const answerPanel   = document.getElementById("answer-panel");
const multiNote     = document.getElementById("multi-note");
const answerListEn  = document.getElementById("answer-list-en");
const answerListEs  = document.getElementById("answer-list-es");
const variableNote  = document.getElementById("variable-note");
const audioRow      = document.getElementById("audio-row");
const audioEn       = document.getElementById("audio-en");
const ttsRow        = document.getElementById("tts-row");
const ttsBtn        = document.getElementById("tts-btn");

const btnGotIt      = document.getElementById("btn-got-it");
const btnNeedsWork  = document.getElementById("btn-needs-work");

const chCount       = document.getElementById("ch-count");
const reviewCountEl = document.getElementById("review-count");

const resGotIt      = document.getElementById("res-got-it");
const needsWorkSect = document.getElementById("needs-work-section");
const needsWorkUl   = document.getElementById("needs-work-ul");
const restartBtn    = document.getElementById("restart-btn");

// ── Init ──────────────────────────────────────────────────────────────────────

const savedSession = loadSession();

if (savedSession && savedSession.queue && savedSession.index < savedSession.queue.length) {
  // Restore session state
  queue          = savedSession.queue;
  currentIndex   = savedSession.index;
  sessionRatings = savedSession.sessionRatings || {};

  const chapterQNums = CHAPTER_QUESTIONS[CURRENT_CHAPTER];
  const answeredSet  = new Set(Object.keys(sessionRatings).map(Number));
  const nextQ        = queue[currentIndex].qNum;
  const inReview     = queue[currentIndex].phase === "review";

  const startDiv = document.getElementById("screen-start");
  startDiv.innerHTML = "";

  const resumeMsg = document.createElement("p");
  resumeMsg.className = "resume-message";
  if (inReview) {
    resumeMsg.innerHTML =
      "All chapter questions complete — Quick Review remaining." +
      "<br><em>Todas las preguntas del capítulo completadas — Repaso rápido pendiente.</em>";
  } else {
    resumeMsg.innerHTML =
      "You left off at Question " + nextQ + "." +
      "<br><em>Dejó de responder en la Pregunta " + nextQ + ".</em>";
  }
  startDiv.appendChild(resumeMsg);

  // Question strip — always show for chapter questions
  const strip = document.createElement("div");
  strip.className = "q-strip";
  chapterQNums.forEach(function(n) {
    const chip = document.createElement("span");
    chip.className = "q-chip";
    chip.textContent = n;
    if (answeredSet.has(n)) {
      chip.classList.add("q-chip-done");
      if (sessionRatings[n] === "needs-work") {
        chip.classList.add("q-chip-needs-work");
      }
    } else if (!inReview && n === nextQ) {
      chip.classList.add("q-chip-next");
    }
    strip.appendChild(chip);
  });
  startDiv.appendChild(strip);

  if (inReview) {
    const reviewNote = document.createElement("p");
    reviewNote.className = "resume-review-note";
    reviewNote.innerHTML =
      "Quick Review questions from earlier chapters are also waiting." +
      "<br><em>Las preguntas de repaso de capítulos anteriores también están pendientes.</em>";
    startDiv.appendChild(reviewNote);
  }

  const btnRow = document.createElement("div");
  btnRow.className = "resume-btn-row";

  const resumeBtn = document.createElement("button");
  resumeBtn.className = "btn-primary";
  resumeBtn.textContent = "Resume / Continuar";
  resumeBtn.addEventListener("click", resumeQuiz);

  const restartFreshBtn = document.createElement("button");
  restartFreshBtn.className = "btn-secondary";
  restartFreshBtn.textContent = "Start over / Comenzar de nuevo";
  restartFreshBtn.addEventListener("click", function() {
    clearSession();
    location.reload();
  });

  btnRow.appendChild(resumeBtn);
  btnRow.appendChild(restartFreshBtn);
  startDiv.appendChild(btnRow);

  screenStart.classList.add("active");

} else {
  // Normal start
  chCount.textContent       = CHAPTER_QUESTIONS[CURRENT_CHAPTER].length;
  reviewCountEl.textContent = reviewCount();

  // If chapter previously completed, show completion note and needs-work chip strip
  const completed = getCompleted();
  if (completed[String(CURRENT_CHAPTER)]) {
    const ratings      = getRatings();
    const chapterQNums = CHAPTER_QUESTIONS[CURRENT_CHAPTER];
    const needsWorkNums = chapterQNums.filter(function(n) {
      const key = String(n).padStart(3, "0");
      return ratings[String(n)] === "needs-work" || ratings[key] === "needs-work";
    });

    const startDiv  = document.getElementById("screen-start");
    const startBtn  = document.getElementById("start-btn");

    const doneMsg = document.createElement("p");
    doneMsg.className = "resume-message";
    doneMsg.innerHTML =
      "You have completed this chapter\u2019s self-test." +
      "<br><em>Ha completado el examen de pr\u00e1ctica de este cap\u00edtulo.</em>";
    startDiv.insertBefore(doneMsg, startDiv.firstChild);

    if (needsWorkNums.length > 0) {
      const strip = document.createElement("div");
      strip.className = "q-strip";

      const label = document.createElement("p");
      label.className = "strip-label";
      label.innerHTML =
        "Questions needing practice:" +
        "<br><em>Preguntas que necesitan pr\u00e1ctica:</em>";
      startDiv.insertBefore(label, startBtn);

      needsWorkNums.forEach(function(n) {
        const chip = document.createElement("a");
        chip.className = "q-chip q-chip-done q-chip-needs-work";
        chip.textContent = n;
        chip.href = qaPageLink(n);
        chip.target = "_blank";
        chip.title = "Review question " + n;
        strip.appendChild(chip);
      });
      startDiv.insertBefore(strip, startBtn);
    }
  }

  document.getElementById("start-btn").addEventListener("click", startQuiz);
}
revealBtn.addEventListener("click", revealAnswers);
btnGotIt.addEventListener("click",     () => recordRating("got-it"));
btnNeedsWork.addEventListener("click", () => recordRating("needs-work"));
restartBtn.addEventListener("click", () => { clearSession(); location.reload(); });

ttsBtn.addEventListener("click", () => {
  const q = CIVICS_QUESTIONS[padKey(queue[currentIndex].qNum)];
  speakText(q.en, "en-US");
});

function speakText(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 0.88;
  window.speechSynthesis.speak(utt);
}

toggleEsBtn.addEventListener("click", () => {
  esVisible = !esVisible;
  toggleEsBtn.textContent = esVisible
    ? "Ocultar español / Hide Spanish"
    : "Mostrar español / Show Spanish";
  document.querySelectorAll(".es-section").forEach(el =>
    el.classList.toggle("visible", esVisible)
  );
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function padKey(qNum) {
  return String(qNum).padStart(3, "0");
}

function showScreen(id) {
  [screenStart, screenQuiz, screenResults].forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ── Quiz flow ─────────────────────────────────────────────────────────────────

function startQuiz() {
  clearSession();
  queue          = buildQueue();
  currentIndex   = 0;
  sessionRatings = {};
  showScreen("screen-quiz");
  renderQuestion();
}

function resumeQuiz() {
  showScreen("screen-quiz");
  renderQuestion();
}

function renderQuestion() {
  const { qNum, phase } = queue[currentIndex];
  const key = padKey(qNum);
  const q   = CIVICS_QUESTIONS[key];

  // Progress
  const total = queue.length;
  progressFill.style.width  = (currentIndex / total * 100) + "%";
  progressLabel.textContent =
    "Question " + (currentIndex + 1) + " of " + total +
    (phase === "review" ? " — Quick Review / Repaso rápido" : "");

  // Phase badge
  phaseBadge.textContent = phase === "review"
    ? "Quick Review / Repaso rápido"
    : "Chapter " + CHAPTER_LABEL;
  phaseBadge.className = "phase-badge " + phase;

  // Review section heading — show only at the first review question
  const isFirstReview = phase === "review" &&
    (currentIndex === 0 || queue[currentIndex - 1].phase === "chapter");
  reviewHeading.classList.toggle("hidden", !isFirstReview);

  // Question text
  qNumEl.textContent  = "Question " + qNum;
  qTextEn.textContent = q.en;
  qTextEs.textContent = q.es || "";
  starredNote.classList.toggle("hidden", !q.starred);

  // Reset Spanish visibility
  esVisible = false;
  toggleEsBtn.textContent = "Mostrar español / Show Spanish";
  document.querySelectorAll(".es-section").forEach(el => el.classList.remove("visible"));

  // Reset answer panel
  answerPanel.style.display = "none";
  answerPanel.classList.remove("visible");
  revealBtn.classList.remove("hidden");

  if (audioEn) { audioEn.pause(); audioEn.currentTime = 0; }
}

function revealAnswers() {
  const { qNum } = queue[currentIndex];
  const key = padKey(qNum);
  const q   = CIVICS_QUESTIONS[key];

  revealBtn.classList.add("hidden");
  answerPanel.style.display = "block";
  answerPanel.classList.add("visible");

  // Multi-answer note
  if (q.note_en) {
    multiNote.textContent = q.note_en + " / " + (q.note_es || "");
    multiNote.classList.remove("hidden");
  } else {
    multiNote.classList.add("hidden");
  }

  // Answer lists vs variable note
  answerListEn.innerHTML = "";
  answerListEs.innerHTML = "";

  if (q.variable) {
    answerListEn.style.display = "none";
    answerListEs.style.display = "none";
    variableNote.classList.remove("hidden");
    variableNote.innerHTML =
      "Practice your answer out loud. Your answer depends on your state, and the current " +
      "holders of government offices. You must memorize these answers.<br>" +
      "<em>Practica tu respuesta en voz alta. Tu respuesta depende de tu estado y de los " +
      "actuales titulares de cargos gubernamentales. Debes memorizar estas respuestas.</em>";
  } else {
    answerListEn.style.display = "";
    answerListEs.style.display = "";
    variableNote.classList.add("hidden");
    (q.answers_en || []).forEach(a => {
      const li = document.createElement("li"); li.textContent = a; answerListEn.appendChild(li);
    });
    (q.answers_es || []).forEach(a => {
      const li = document.createElement("li"); li.textContent = a; answerListEs.appendChild(li);
    });
  }

  esAnswersSect.classList.toggle("visible", esVisible);

  // Audio or TTS
  if (q.variable) {
    audioRow.classList.add("hidden");
    ttsRow.classList.remove("hidden");
  } else {
    audioRow.classList.remove("hidden");
    ttsRow.classList.add("hidden");
    audioEn.innerHTML =
      '<source src="' + audioSrc(qNum, "EN") + '" type="audio/mpeg">' +
      'Your browser does not support audio playback.';
    audioEn.load();
  }
}

function recordRating(rating) {
  const { qNum } = queue[currentIndex];
  sessionRatings[qNum] = rating;
  saveRating(qNum, rating);
  currentIndex++;
  saveSession();
  if (currentIndex < queue.length) {
    renderQuestion();
  } else {
    clearSession();
    markChapterComplete(CURRENT_CHAPTER);
    showResults();
  }
}

// ── Results ───────────────────────────────────────────────────────────────────

function showResults() {
  showScreen("screen-results");

  let chGotIt = 0, chNeedsWork = 0;
  let revGotIt = 0, revNeedsWork = 0;
  const chapterNeedsWork = [];
  const reviewNeedsWork  = [];

  for (const { qNum, phase } of queue) {
    const r = sessionRatings[qNum];
    if (phase === "chapter") {
      if (r === "got-it")          { chGotIt++;    }
      else if (r === "needs-work") { chNeedsWork++; chapterNeedsWork.push(qNum); }
    } else {
      if (r === "got-it")          { revGotIt++;   }
      else if (r === "needs-work") { revNeedsWork++; reviewNeedsWork.push(qNum); }
    }
  }

  // Chapter summary line
  resGotIt.textContent = chGotIt;
  const chLine = document.getElementById("res-chapter-line");
  if (chNeedsWork > 0) {
    chLine.innerHTML =
      '<span class="big-num">' + chGotIt + '</span> ✓ Got it &nbsp;|&nbsp; ' +
      '<span class="big-num">' + chNeedsWork + '</span> ~ Need practice';
  } else {
    chLine.innerHTML = '<span class="big-num">' + chGotIt + '</span> ✓ Got it';
  }

  // Review summary row — only shown if review questions were presented
  const reviewTotal = revGotIt + revNeedsWork;
  const revRow  = document.getElementById("res-review-row");
  const revLine = document.getElementById("res-review-line");
  if (reviewTotal > 0) {
    revRow.style.display = "block";
    if (revNeedsWork > 0) {
      revLine.innerHTML =
        '<span class="big-num">' + revGotIt + '</span> ✓ Got it &nbsp;|&nbsp; ' +
        '<span class="big-num">' + revNeedsWork + '</span> ~ Need practice';
    } else {
      revLine.innerHTML = '<span class="big-num">' + revGotIt + '</span> ✓ Got it';
    }
  } else {
    revRow.style.display = "none";
  }

  // Needs-work detail list — only shown when something needs work
  const allNeedsWork = [...chapterNeedsWork, ...reviewNeedsWork];
  if (allNeedsWork.length > 0) {
    needsWorkSect.style.display = "block";
    needsWorkUl.innerHTML = "";
    // Remove any previously inserted chapter link
    const existingLink = needsWorkSect.querySelector("p.chapter-link");
    if (existingLink) existingLink.remove();

    // Chapter link above the list
    const chapterFile = (typeof CURRENT_CHAPTER === "string" && isNaN(CURRENT_CHAPTER))
      ? "addendum" + CURRENT_CHAPTER + "_bilingual.html"
      : "chapter" + String(CURRENT_CHAPTER).padStart(2, "0") + "_bilingual.html";
    const chapterLink = document.createElement("p");
    chapterLink.className = "chapter-link";
    chapterLink.innerHTML = '<a href="' + chapterFile + '">Chapter ' + CHAPTER_LABEL +
      ' \u2014 ' + CHAPTER_TITLE + '</a>';
    needsWorkSect.insertBefore(chapterLink, needsWorkUl);

    if (chapterNeedsWork.length > 0) {
      chapterNeedsWork.forEach(function(num) { appendNeedsWorkItem(num); });
    }
    if (reviewNeedsWork.length > 0) {
      const hdr = document.createElement("li");
      hdr.style.cssText = "font-weight:bold; background:none; padding-top:8px;";
      hdr.textContent   = "Quick Review questions";
      needsWorkUl.appendChild(hdr);
      reviewNeedsWork.forEach(num => appendNeedsWorkItem(num));
    }
  } else {
    needsWorkSect.style.display = "none";
  }
}

function appendNeedsWorkItem(qNum) {
  const key = padKey(qNum);
  const q   = CIVICS_QUESTIONS[key];
  if (!q) return;
  const li = document.createElement("li");
  li.innerHTML =
    "<strong>Q" + qNum + ":</strong> " + q.en +
    ' <a href="' + qaPageLink(qNum) + '" target="_blank">→ Review question / Revise la pregunta</a>';
  needsWorkUl.appendChild(li);
}
