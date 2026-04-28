/* interview-scenarios.js
   Shared interactivity for N-400 Interview Scenario Practice pages
   ----------------------------------------------------------------- */

/* ── Text-to-Speech ─────────────────────────────────────────────── */

/**
 * speak(elementId, lang)
 * Reads the text content of the element with the given id.
 * lang should be 'en-US' for English content.
 * Rate 0.88 for ESL listeners, consistent with other site TTS.
 */
function speak(elementId, lang) {
  if (!window.speechSynthesis) return;
  const el = document.getElementById(elementId);
  if (!el) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(el.innerText || el.textContent);
  utt.lang = lang;
  utt.rate = 0.88;
  window.speechSynthesis.speak(utt);
}

/* ── Show / Hide Spanish scenario paragraph ─────────────────────── */

/**
 * toggleEs(btn, targetId)
 * Toggles visibility of a Spanish paragraph and updates button label.
 */
function toggleEs(btn, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const visible = el.classList.toggle('visible');
  btn.textContent = visible ? 'Ocultar español / Hide Spanish' : 'Mostrar / Hide Spanish';
}

/* ── Show feedback after answer selection ───────────────────────── */

/**
 * showFeedback(questionId, selectedValue)
 * Hides all feedback panels for this question, then shows the one
 * matching the selected radio value.
 * questionId: e.g. 'qa1', 'qb1', 'qb2'
 * selectedValue: 'a', 'b', or 'c'
 */
function showFeedback(questionId, selectedValue) {
  // Hide all three feedback panels for this question
  ['a', 'b', 'c'].forEach(function(v) {
    const fb = document.getElementById(questionId + '-fb-' + v);
    if (fb) fb.classList.remove('visible');
  });

  // Show the selected one
  const target = document.getElementById(questionId + '-fb-' + selectedValue);
  if (target) {
    target.classList.add('visible');
    // Scroll feedback into view smoothly if it's off-screen
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ── Reset a scenario ───────────────────────────────────────────── */

/**
 * resetScenario(scenarioId)
 * Clears all radio selections and hides all feedback panels
 * within the scenario block. Also hides the Spanish paragraph
 * and resets its toggle button label.
 */
function resetScenario(scenarioId) {
  const scenario = document.getElementById(scenarioId);
  if (!scenario) return;

  // Clear radio buttons
  scenario.querySelectorAll('input[type="radio"]').forEach(function(r) {
    r.checked = false;
  });

  // Hide all feedback panels
  scenario.querySelectorAll('.feedback').forEach(function(fb) {
    fb.classList.remove('visible');
  });

  // Hide Spanish paragraph and reset toggle button label
  scenario.querySelectorAll('.scenario-text-es').forEach(function(es) {
    es.classList.remove('visible');
  });
  scenario.querySelectorAll('.toggle-es-btn').forEach(function(btn) {
    btn.textContent = 'Mostrar / Hide Spanish';
  });

  // Cancel any ongoing speech
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
