/* part9-speak.js — Web Speech API read-aloud for N-400 Part 9 pages */

(function () {
  'use strict';

  var currentBtn = null;
  var synth = window.speechSynthesis;

  /* Build and return a speak button element.
     text  : string to speak
     label : visible button label (optional, defaults to "🔊 Listen")
  */
  function makeSpeakBtn(text, label) {
    var btn = document.createElement('button');
    btn.className = 'speak-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Read aloud: ' + text.substring(0, 60));
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>' +
        '<path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>' +
      '</svg>' +
      (label || '&#x1F50A;&#xFE0E; Listen');

    btn.addEventListener('click', function () {
      if (synth.speaking) {
        synth.cancel();
        if (currentBtn === btn) {
          currentBtn.classList.remove('speaking');
          currentBtn = null;
          return;
        }
      }
      if (currentBtn) {
        currentBtn.classList.remove('speaking');
        currentBtn = null;
      }
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.88;   /* slightly slower for ESL listeners */
      utter.onend = function () {
        btn.classList.remove('speaking');
        if (currentBtn === btn) currentBtn = null;
      };
      utter.onerror = function () {
        btn.classList.remove('speaking');
        if (currentBtn === btn) currentBtn = null;
      };
      btn.classList.add('speaking');
      currentBtn = btn;
      synth.speak(utter);
    });

    return btn;
  }

  /* Public API */
  window.Part9Speak = { makeSpeakBtn: makeSpeakBtn };
})();
