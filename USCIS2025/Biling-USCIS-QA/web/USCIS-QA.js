// Generic global and per-question translation visibility toggles
// Language-agnostic: labels come from data-* attributes set by XSLT/ui-strings.xml
// Works for any lang code (es, pt, ht, ar, zh, ko, tl, vi, ...) with no JS changes.
document.addEventListener('DOMContentLoaded', function() {
    const globalBtn = document.getElementById('toggle-translation');
    const storageKey = globalBtn ? 'hideTranslation_' + globalBtn.dataset.lang : null;
    const translationHidden = storageKey ? localStorage.getItem(storageKey) === 'true' : false;

    if (translationHidden) {
        document.querySelectorAll('.translation-question').forEach(function(el) {
            el.classList.add('hidden');
        });
        updateToggleButton(globalBtn, true);
    }

    if (globalBtn) {
        globalBtn.addEventListener('click', function() {
            const firstQuestion = document.querySelector('.translation-question');
            const isHidden = firstQuestion ? firstQuestion.classList.contains('hidden') : false;

            document.querySelectorAll('.translation-question').forEach(function(el) {
                el.classList.toggle('hidden');
            });

            localStorage.setItem(storageKey, !isHidden);
            updateToggleButton(globalBtn, !isHidden);
        });
    }

    document.querySelectorAll('.toggle-question-translation').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const translationDiv = btn.closest('.translation-question');
            const content = translationDiv.querySelector('.translation-content');
            content.classList.toggle('hidden');

            const isHidden = content.classList.contains('hidden');
            btn.textContent = isHidden ? btn.dataset.showLabel : btn.dataset.hideLabel;
        });
    });
});

function updateToggleButton(btn, isHidden) {
    if (btn) {
        btn.textContent = isHidden ? btn.dataset.showLabel : btn.dataset.hideLabel;
    }
}
