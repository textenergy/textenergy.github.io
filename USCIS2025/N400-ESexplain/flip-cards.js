/* flip-cards.js — shared logic for flip card interactive pages */

(function () {
  'use strict';

  let currentLang = 'en';

  /* ── Card generation ──────────────────────────────────────── */
  function buildCards(data, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    data.forEach(function (item) {
      const card = document.createElement('div');
      card.className = 'flip-card';
      card.dataset.id = item.id;

      card.innerHTML =
        '<div class="flip-card-inner">' +
          '<div class="flip-card-front" style="background-color:' + item.color + '">' +
            '<span class="card-label" data-en="' + escAttr(item.labelEN) + '" data-es="' + escAttr(item.labelES) + '">' +
              item.labelEN +
            '</span>' +
          '</div>' +
          '<div class="flip-card-back" style="background-color:' + item.tint + '">' +
            '<div class="back-title" data-en="' + escAttr(item.labelEN) + '" data-es="' + escAttr(item.labelES) + '">' +
              item.labelEN +
            '</div>' +
            '<div class="back-def" data-en="' + escAttr(item.defEN) + '" data-es="' + escAttr(item.defES) + '">' +
              item.defEN +
            '</div>' +
          '</div>' +
        '</div>';

      card.addEventListener('click', function () {
        card.classList.toggle('flipped');
      });

      grid.appendChild(card);
    });
  }

  /* ── Language toggle ──────────────────────────────────────── */
  function setLang(lang) {
    currentLang = lang;

    // Update all data-en / data-es elements
    document.querySelectorAll('[data-en][data-es]').forEach(function (el) {
      el.textContent = el.dataset[lang];
    });

    // Update instruction text
    var instr = document.querySelector('.instruction');
    if (instr) {
      instr.textContent = lang === 'en'
        ? 'Click a card to read the definition. Click again to flip back.'
        : 'Haga clic en una tarjeta para leer la definición. Haga clic de nuevo para voltearla.';
    }

    // Update toggle button states
    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function initLangToggle() {
    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.dataset.lang);
      });
    });
  }

  /* ── Utility ──────────────────────────────────────────────── */
  function escAttr(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ── Public API ───────────────────────────────────────────── */
  window.FlipCards = {
    init: function (data, containerId) {
      buildCards(data, containerId);
      initLangToggle();
    }
  };

}());
