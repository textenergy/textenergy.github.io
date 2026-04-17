/*
 * quiz.js — Shared quiz engine for General-Work ESL quiz pages
 *
 * Used by:
 *   Dairy/dairy_quiz.html
 *   Landscaping/tools_quiz.html
 *   (add new topic subfolders as needed)
 *
 * Each HTML page defines its own data in a <script> block BEFORE loading
 * this file, then calls QuizEngine.init(config).
 *
 * Option order and correctIndex are baked into the HTML data at generation
 * time (see build_quiz_files.py). The engine does NO runtime shuffling.
 *
 * Two data formats are supported:
 *
 *   FORMAT A — scenario-based (e.g. dairy_quiz):
 *     const scenarios = [
 *       { title, narrative,
 *         questions: [{ sentence, keyword, options[], correctIndex,
 *                       tts_lang, answer_lang }] }
 *     ];
 *     QuizEngine.init({ scenarios });
 *
 *   FORMAT B — flat question list (e.g. tools_quiz):
 *     const questions = [
 *       { eng, options[], correctIndex, tts_lang, answer_lang }
 *     ];
 *     QuizEngine.init({ questions });
 *
 * TTS language fields use standard ISO language codes, e.g.:
 *   tts_lang    — language of the question sentence  (default: 'en-US')
 *   answer_lang — language of the answer options     (default: 'es-US')
 *
 * ── FUTURE INTERACTION MODULES (STUBS) ──────────────────────────────────────
 * DragDrop    — drag-and-drop matching exercises
 * Flashcard   — flip-card vocabulary review
 * ImageMap    — clickable image-map label exercises
 * AudioPlayer — <audio> element controller for .mp3 files
 * ────────────────────────────────────────────────────────────────────────────
 */

const QuizEngine = (() => {

  /* ── STATE ── */
  let _scenarios        = null;
  let _flatQuestions    = null;
  let _quizData         = [];
  let _answered         = [];
  let _current          = 0;
  let _currentScenario  = 0;
  let _hasScenarios     = false;
  let _slowMode         = false;  // false = 1.0 (normal), true = 0.65 (slow)
  let _quizId           = '';     // set from config.quizId in init(); used as localStorage key prefix

  /* ── HELPERS ── */

  /*
   * Normalise a question into a common internal shape:
   *   { prompt, keyword, options[], correctIndex, ttsLang, answerLang }
   *
   * Format A field names: sentence / keyword / options[] / correctIndex / tts_lang / answer_lang
   * Format B field names: eng / options[] / correctIndex / tts_lang / answer_lang
   *
   * options[] and correctIndex are already set by the generation script.
   * tts_lang and answer_lang default to 'en-US' and 'es-US' respectively
   * if not present in the data.
   */
  function normalise(q) {
    return {
      prompt:       q.sentence   || q.eng,
      keyword:      q.keyword    || null,
      options:      q.options,
      correctIndex: q.correctIndex,
      ttsLang:      q.tts_lang   || 'en-US',
      answerLang:   q.answer_lang || 'es-US'
    };
  }

  function buildQuizData(questions) {
    return questions.map(normalise);
  }

  /* Strip HTML tags to get plain text for speech synthesis */
  function stripTags(html) {
    return html.replace(/<[^>]+>/g, '');
  }

  /* ── LOCAL STORAGE ──
   * State is saved per quiz + scenario (or per quiz for flat quizzes).
   * Storage key format:  quizId + '-S' + scenarioIndex   e.g. 'DAIRY-001-S0'
   *                      quizId + '-flat'                e.g. 'TOOLS-001-flat'
   *
   * Saved object: { answered: [], current: number, completed: boolean, saved: timestamp }
   * State older than EXPIRY_DAYS days is discarded on load.
   */
  const EXPIRY_DAYS = 30;

  function storageKey(scenarioIdx) {
    return _quizId
      ? (_hasScenarios ? `${_quizId}-S${scenarioIdx}` : `${_quizId}-flat`)
      : null;
  }

  function saveState(scenarioIdx, completed) {
    const key = storageKey(scenarioIdx);
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify({
        answered:  _answered,
        current:   _current,
        completed: completed || false,
        saved:     Date.now()
      }));
    } catch (e) { /* storage full or unavailable — fail silently */ }
  }

  function loadState(scenarioIdx) {
    const key = storageKey(scenarioIdx);
    if (!key) return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const state = JSON.parse(raw);
      /* Discard if older than EXPIRY_DAYS */
      if (Date.now() - state.saved > EXPIRY_DAYS * 86400000) {
        localStorage.removeItem(key);
        return null;
      }
      /* Discard if answer array length doesn't match current question count
         (quiz content may have changed since state was saved) */
      if (!Array.isArray(state.answered) || state.answered.length !== _quizData.length) {
        localStorage.removeItem(key);
        return null;
      }
      return state;
    } catch (e) { return null; }
  }

  function clearState(scenarioIdx) {
    const key = storageKey(scenarioIdx);
    if (key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
  }

  /* ── TEXT-TO-SPEECH ──
   * Speaks text aloud using the browser's built-in SpeechSynthesis API.
   * lang:        ISO language code, e.g. 'en-US', 'es-US', 'fr-FR'
   * activateBtn: optional element to animate with .playing class while speaking
   * Rate:        English uses 1.0 normally, 0.65 in slow mode (_slowMode).
   *              All other languages always use 1.0.
   * Falls back silently if the browser does not support speech synthesis.
   */
  function speakText(htmlText, lang, activateBtn) {
    if (!window.speechSynthesis) return;
    const plain = stripTags(htmlText);
    window.speechSynthesis.cancel();
    const utt  = new SpeechSynthesisUtterance(plain);
    utt.lang   = lang || 'en-US';
    utt.rate   = (lang && lang.startsWith('en') && _slowMode) ? 0.65 : 1.0;
    if (activateBtn) {
      activateBtn.classList.add('playing');
      utt.onend  = () => activateBtn.classList.remove('playing');
      utt.onerror= () => activateBtn.classList.remove('playing');
    }
    window.speechSynthesis.speak(utt);
  }

  /* ── SLOW MODE TOGGLE ──
   * Appends a "Speed / Velocidad:" label and the SLOW sign button inline
   * into the existing <header> <p> tag, so it sits on the same line as
   * the instruction text without consuming extra vertical space.
   * Called once at init(). Persists across all questions and scenarios.
   *
   * Opacity states (reversed from typical disabled pattern):
   *   Default (slow OFF): full opacity — button looks available/inviting
   *   Active  (slow ON):  dimmed      — slow mode engaged, tap to return to normal
   */
  function buildSlowButton() {
    const p = document.querySelector('header p');
    if (!p) return;

    /* Label */
    const label = document.createElement('span');
    label.className   = 'rate-label';
    label.textContent = ' Speed / Velocidad: ';

    /* Button */
    const btn = document.createElement('button');
    btn.id        = 'slow-btn';
    btn.className = 'rate-btn';
    btn.setAttribute('aria-label', 'Slow / Despacio');
    btn.title     = 'Slow / Despacio';
    btn.innerHTML = `<img src="../slow-sign.svg" alt="SLOW" width="36" height="36">`;
    btn.onclick   = () => {
      _slowMode = !_slowMode;
      btn.classList.toggle('rate-btn--active', _slowMode);
      btn.title = _slowMode ? 'Normal' : 'Slow / Despacio';
      btn.setAttribute('aria-label', _slowMode ? 'Normal' : 'Slow / Despacio');
    };

    p.appendChild(label);
    p.appendChild(btn);
  }

  /* ── RENDER ── */
  function render() {
    const q     = _quizData[_current];
    const total = _quizData.length;

    /* Progress bar and label (these elements are static in the HTML) */
    document.getElementById('progress-label').textContent =
      `Question ${_current + 1} of ${total} — Pregunta ${_current + 1} de ${total}`;
    document.getElementById('progress-fill').style.width =
      `${(_current / total) * 100}%`;

    /* ── CARD HEADER ──
     * Layout: [ 🔊 ] [ Q-number ] [ sentence ]
     * The audio button is placed first (leftmost) so the tap target
     * appears before the text in both visual and DOM order.
     */
    const header = document.querySelector('.card-header');

    /* Clear and rebuild header contents each render so order is guaranteed */
    header.innerHTML = '';

    const audioBtn       = document.createElement('button');
    audioBtn.id          = 'audio-btn';
    audioBtn.className   = 'audio-btn';
    audioBtn.title       = 'Listen / Escuchar';
    audioBtn.textContent = '🔊';
    audioBtn.setAttribute('aria-label', 'Play question audio');
    audioBtn.onclick     = () => speakText(q.prompt, q.ttsLang, audioBtn);
    header.appendChild(audioBtn);

    const qNum       = document.createElement('span');
    qNum.id          = 'q-number';
    qNum.className   = 'q-number';
    qNum.textContent = `${_current + 1} / ${total}`;
    header.appendChild(qNum);

    const prompt     = document.createElement('span');
    prompt.id        = 'eng-prompt';
    prompt.className = 'eng-prompt';
    prompt.innerHTML = q.prompt;
    header.appendChild(prompt);

    /* ── ANSWER OPTIONS ──
     * Each option is an .option-row containing:
     *   [ 🔊 option-audio-btn ] [ option-btn (letter + text) ]
     * Tapping either element registers the answer selection.
     * Tapping 🔊 additionally plays the option text in answer_lang.
     */
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    const letters   = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, i) => {
      const row       = document.createElement('div');
      row.className   = 'option-row';

      /* Speaker button */
      const spk           = document.createElement('button');
      spk.className       = 'option-audio-btn';
      spk.textContent     = '🔊';
      spk.title           = 'Listen / Escuchar';
      spk.setAttribute('aria-label', `Play option ${letters[i]}`);
      /* Speaker button — always playable, even after an answer is selected.
       * Only registers a selection if the question is still unanswered. */
      spk.onclick = (e) => {
        e.stopPropagation();
        speakText(opt, q.answerLang, spk);
        if (_answered[_current] === null) selectAnswer(i);
      };

      /* Answer button */
      const btn       = document.createElement('button');
      btn.className   = 'option-btn';
      btn.innerHTML   = `<span class="letter">${letters[i]}</span> ${opt}`;
      btn.onclick     = () => selectAnswer(i);

      if (_answered[_current] !== null) {
        btn.disabled = true;
        /* spk remains enabled so the learner can replay any option after answering */
        if (i === q.correctIndex)             btn.classList.add('correct');
        else if (i === _answered[_current])   btn.classList.add('wrong');
      }

      row.appendChild(spk);
      row.appendChild(btn);
      container.appendChild(row);
    });

    /* ── FEEDBACK BAR ── */
    const fb = document.getElementById('feedback');
    if (_answered[_current] !== null) {
      const isCorrect = _answered[_current] === q.correctIndex;
      fb.className    = 'feedback show ' + (isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        fb.textContent = q.keyword
          ? `✓ Correct! / ¡Correcto! — "${q.keyword}" = ${q.options[q.correctIndex]}`
          : '✓ Correct! / ¡Correcto!';
      } else {
        fb.textContent = q.keyword
          ? `✗ ${q.options[_answered[_current]]} → "${q.keyword}" = ${q.options[q.correctIndex]}`
          : `✗ The correct answer is: ${q.options[q.correctIndex]}`;
      }
    } else {
      fb.className    = 'feedback';
      fb.textContent  = '';
    }

    /* ── NAV BUTTONS ── */
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    btnPrev.disabled  = _current === 0;
    btnNext.disabled  = _answered[_current] === null;
    btnNext.innerHTML = _current === total - 1
      ? 'Finish<br><em>Terminar</em>'
      : 'Next →<br><em>Siguiente</em>';
  }

  /* ── USER INTERACTIONS ── */

  function selectAnswer(idx) {
    if (_answered[_current] !== null) return;
    _answered[_current] = idx;
    saveState(_currentScenario, false);
    render();
  }

  function goNext() {
    if (_current < _quizData.length - 1) {
      _current++;
      render();
    } else {
      showEndScreen();
    }
  }

  function goPrev() {
    if (_current > 0) { _current--; render(); }
  }

  /* ── END SCREEN ── */
  function showEndScreen() {
    const score = _answered.filter((a, i) => a === _quizData[i].correctIndex).length;
    document.getElementById('end-score').innerHTML =
      `You got ${score} of ${_quizData.length} correct.<br>` +
      `<em>Obtuviste ${score} de ${_quizData.length} correctas.</em>`;

    /* Save completed state so returning learners land on the end screen,
       then clear after a short delay — next visit starts fresh */
    saveState(_currentScenario, true);

    setQuizVisible(false);
    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('progress-fill').style.width = '100%';
  }

  /* Toggle quiz elements on/off together */
  function setQuizVisible(visible) {
    const display = visible ? '' : 'none';
    document.getElementById('quiz-card').style.display            = display;
    document.querySelector('.nav-row').style.display              = display;
    document.getElementById('progress-bar-wrap').style.display    = display;
    document.getElementById('progress-label').style.display       = display;
    document.getElementById('feedback').style.display             = visible ? '' : 'none';
  }

  /* ── SCENARIO LOADER (Format A only) ── */
  function loadScenario(idx) {
    _currentScenario = idx;

    document.querySelectorAll('.scenario-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });

    document.getElementById('narrative-text').innerHTML =
      _scenarios[idx].narrative;

    _quizData = buildQuizData(_scenarios[idx].questions);

    const saved = loadState(idx);

    if (saved && saved.completed) {
      /* Quiz was completed — show end screen with saved score */
      _answered = saved.answered;
      _current  = _quizData.length - 1;
      const score = _answered.filter((a, i) => a === _quizData[i].correctIndex).length;
      document.getElementById('end-score').innerHTML =
        `You got ${score} of ${_quizData.length} correct.<br>` +
        `<em>Obtuviste ${score} de ${_quizData.length} correctas.</em>`;
      setQuizVisible(false);
      document.getElementById('end-screen').style.display = 'block';
      document.getElementById('progress-fill').style.width = '100%';
    } else if (saved) {
      /* Partial progress — resume at last unanswered question */
      _answered = saved.answered;
      _current  = saved.current;
      document.getElementById('end-screen').style.display = 'none';
      setQuizVisible(true);
      render();
    } else {
      /* No saved state — start fresh */
      _answered = new Array(_quizData.length).fill(null);
      _current  = 0;
      document.getElementById('end-screen').style.display = 'none';
      setQuizVisible(true);
      render();
    }
  }

  /* Restart: clear saved state and reload from the beginning */
  function restart() {
    clearState(_currentScenario);
    if (_hasScenarios) {
      loadScenario(_currentScenario);
    } else {
      _quizData  = buildQuizData(_flatQuestions);
      _answered  = new Array(_quizData.length).fill(null);
      _current   = 0;
      document.getElementById('end-screen').style.display = 'none';
      setQuizVisible(true);
      render();
    }
  }

  /* ── PUBLIC API ── */
  /*
   * init(config)
   *   config.quizId     — unique quiz identifier, e.g. 'DAIRY-001' (used as localStorage key prefix)
   *   config.scenarios  — array of scenario objects (Format A)
   *   config.questions  — array of flat question objects (Format B)
   * quizId and exactly one of scenarios/questions must be provided.
   */
  function init(config) {
    _quizId = config.quizId || '';

    if (config.scenarios) {
      _scenarios    = config.scenarios;
      _hasScenarios = true;
    } else if (config.questions) {
      _flatQuestions = config.questions;
      _hasScenarios  = false;
    } else {
      console.error('QuizEngine.init: supply either config.scenarios or config.questions');
      return;
    }

    document.getElementById('btn-next').onclick = goNext;
    document.getElementById('btn-prev').onclick = goPrev;

    window.restartQuiz  = restart;
    window.loadScenario = loadScenario;

    buildSlowButton();

    if (_hasScenarios) {
      loadScenario(0);
    } else {
      _quizData = buildQuizData(_flatQuestions);

      const saved = loadState(0);  /* flat quizzes use key suffix '-flat' */

      if (saved && saved.completed) {
        _answered = saved.answered;
        _current  = _quizData.length - 1;
        const score = _answered.filter((a, i) => a === _quizData[i].correctIndex).length;
        document.getElementById('end-score').innerHTML =
          `You got ${score} of ${_quizData.length} correct.<br>` +
          `<em>Obtuviste ${score} de ${_quizData.length} correctas.</em>`;
        setQuizVisible(false);
        document.getElementById('end-screen').style.display = 'block';
        document.getElementById('progress-fill').style.width = '100%';
      } else if (saved) {
        _answered = saved.answered;
        _current  = saved.current;
        render();
      } else {
        _answered = new Array(_quizData.length).fill(null);
        _current  = 0;
        render();
      }
    }
  }

  return { init };

})();


/* ══════════════════════════════════════════════════════════════════════════
 * STUB MODULES — fill in or replace with separate .js files as needed
 * ══════════════════════════════════════════════════════════════════════════
 */

/* ── STUB: DragDrop ─────────────────────────────────────────────────────── */
/*
const DragDrop = (() => {
  function init(config) {
    // config.pairs: array of { term, translation } objects
  }
  return { init };
})();
*/

/* ── STUB: Flashcard ────────────────────────────────────────────────────── */
/*
const Flashcard = (() => {
  function init(config) {
    // config.cards: array of { front, back } objects
  }
  return { init };
})();
*/

/* ── STUB: ImageMap ─────────────────────────────────────────────────────── */
/*
const ImageMap = (() => {
  function init(config) {
    // config.image: path to image file
    // config.targets: array of { id, x, y, width, height, label, answer }
  }
  return { init };
})();
*/

/* ── STUB: AudioPlayer ──────────────────────────────────────────────────── */
/*
const AudioPlayer = (() => {
  function init(config) {
    // config.audioDir: relative path to audio subfolder
    // config.files: array of { id, filename, label }
  }
  return { init };
})();
*/
