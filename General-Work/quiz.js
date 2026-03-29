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
 *         questions: [{ sentence, keyword, options[], correctIndex }] }
 *     ];
 *     QuizEngine.init({ scenarios });
 *
 *   FORMAT B — flat question list (e.g. tools_quiz):
 *     const questions = [
 *       { eng, options[], correctIndex }
 *     ];
 *     QuizEngine.init({ questions });
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

  /* ── HELPERS ── */

  /*
   * Normalise a question into a common internal shape:
   *   { prompt, keyword, options[], correctIndex }
   *
   * Format A field names: sentence / keyword / options[] / correctIndex
   * Format B field names: eng / options[] / correctIndex
   *
   * options[] and correctIndex are already set by the generation script;
   * this function just unifies the field names.
   */
  function normalise(q) {
    return {
      prompt:       q.sentence || q.eng,
      keyword:      q.keyword  || null,
      options:      q.options,
      correctIndex: q.correctIndex
    };
  }

  function buildQuizData(questions) {
    return questions.map(normalise);
  }

  /* Strip HTML tags to get plain text for speech synthesis */
  function stripTags(html) {
    return html.replace(/<[^>]+>/g, '');
  }

  /* ── TEXT-TO-SPEECH ──
   * Uses the browser's built-in SpeechSynthesis API (no external service).
   * Falls back silently if the browser does not support it.
   */
  function speakText(htmlText) {
    if (!window.speechSynthesis) return;
    const plain = stripTags(htmlText);
    window.speechSynthesis.cancel();
    const utt   = new SpeechSynthesisUtterance(plain);
    utt.lang    = 'en-US';
    utt.rate    = 0.85;
    const btn   = document.getElementById('audio-btn');
    if (btn) {
      btn.classList.add('playing');
      utt.onend  = () => btn.classList.remove('playing');
      utt.onerror= () => btn.classList.remove('playing');
    }
    window.speechSynthesis.speak(utt);
  }

  /* ── RENDER ── */
  function render() {
    const q     = _quizData[_current];
    const total = _quizData.length;

    /* Progress */
    document.getElementById('q-number').textContent = `${_current + 1} / ${total}`;
    document.getElementById('progress-label').textContent =
      `Question ${_current + 1} of ${total} — Pregunta ${_current + 1} de ${total}`;
    document.getElementById('progress-fill').style.width =
      `${(_current / total) * 100}%`;

    /* English prompt (may contain <u> tags) */
    document.getElementById('eng-prompt').innerHTML = q.prompt;

    /* Audio button — create once, update onclick each render */
    const header   = document.querySelector('.card-header');
    let   audioBtn = document.getElementById('audio-btn');
    if (!audioBtn) {
      audioBtn           = document.createElement('button');
      audioBtn.id        = 'audio-btn';
      audioBtn.className = 'audio-btn';
      audioBtn.title     = 'Listen / Escuchar';
      header.appendChild(audioBtn);
    }
    audioBtn.textContent = '🔊';
    audioBtn.onclick     = () => speakText(q.prompt);

    /* Answer options */
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    const letters   = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, i) => {
      const btn       = document.createElement('button');
      btn.className   = 'option-btn';
      btn.innerHTML   = `<span class="letter">${letters[i]}</span> ${opt}`;
      btn.onclick     = () => selectAnswer(i);

      if (_answered[_current] !== null) {
        btn.disabled = true;
        if (i === q.correctIndex)             btn.classList.add('correct');
        else if (i === _answered[_current])   btn.classList.add('wrong');
      }
      container.appendChild(btn);
    });

    /* Feedback bar */
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

    /* Nav buttons */
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    btnPrev.disabled   = _current === 0;
    btnNext.disabled   = _answered[_current] === null;
    btnNext.innerHTML  = _current === total - 1
      ? 'Finish<br><em>Terminar</em>'
      : 'Next →<br><em>Siguiente</em>';
  }

  /* ── USER INTERACTIONS ── */

  function selectAnswer(idx) {
    if (_answered[_current] !== null) return;
    _answered[_current] = idx;
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

    /* Update selector button states */
    document.querySelectorAll('.scenario-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });

    /* Set narrative text */
    document.getElementById('narrative-text').innerHTML =
      _scenarios[idx].narrative;

    /* Load pre-baked question data and reset state */
    _quizData  = buildQuizData(_scenarios[idx].questions);
    _answered  = new Array(_quizData.length).fill(null);
    _current   = 0;

    document.getElementById('end-screen').style.display = 'none';
    setQuizVisible(true);
    render();
  }

  /* Restart: reload the current scenario or flat list from the baked data */
  function restart() {
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
   *   config.scenarios  — array of scenario objects (Format A)
   *   config.questions  — array of flat question objects (Format B)
   * Exactly one of the two must be provided.
   */
  function init(config) {
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

    /* Wire nav buttons */
    document.getElementById('btn-next').onclick = goNext;
    document.getElementById('btn-prev').onclick = goPrev;

    /* Expose restart and loadScenario for inline onclick attributes in HTML */
    window.restartQuiz   = restart;
    window.loadScenario  = loadScenario;

    if (_hasScenarios) {
      loadScenario(0);
    } else {
      _quizData = buildQuizData(_flatQuestions);
      _answered = new Array(_quizData.length).fill(null);
      _current  = 0;
      render();
    }
  }

  return { init };

})();


/* ══════════════════════════════════════════════════════════════════════════
 * STUB MODULES — fill in or replace with separate .js files as needed
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Each stub is a self-contained IIFE that exposes a single init() method.
 * When developed, move to its own file (e.g. drag-drop.js) and load with
 * a separate <script src="..."> tag in the HTML pages that use it.
 */

/* ── STUB: DragDrop ─────────────────────────────────────────────────────── */
/*
const DragDrop = (() => {
  function init(config) {
    // config.pairs: array of { term, translation } objects
    // TODO: render draggable term tiles and drop-target zones,
    //       handle dragstart / dragover / drop events,
    //       show correct/wrong state on drop.
  }
  return { init };
})();
*/

/* ── STUB: Flashcard ────────────────────────────────────────────────────── */
/*
const Flashcard = (() => {
  function init(config) {
    // config.cards: array of { front, back } objects
    // TODO: render .flashcard elements with .flashcard-front / .flashcard-back,
    //       toggle .flipped class on click to trigger CSS 3D rotation,
    //       provide next/prev navigation.
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
    // TODO: overlay absolutely-positioned click targets on the image,
    //       show label popups or fill-in fields on click,
    //       score and give feedback.
  }
  return { init };
})();
*/

/* ── STUB: AudioPlayer ──────────────────────────────────────────────────── */
/*
const AudioPlayer = (() => {
  function init(config) {
    // config.audioDir: relative path to the audio subfolder
    //   e.g. 'audio/' resolves to Dairy/audio/ when called from Dairy/dairy_quiz.html
    // config.files: array of { id, filename, label } objects
    // TODO: create <audio> elements pointing to audioDir + filename,
    //       wire play/pause buttons,
    //       integrate with quiz engine so audio plays on question load.
  }
  return { init };
})();
*/
