// Global and per-question Spanish visibility toggles
document.addEventListener('DOMContentLoaded', function() {
    // Global toggle functionality
    const spanishHidden = localStorage.getItem('hideSpanish') === 'true';
    
    if (spanishHidden) {
        document.querySelectorAll('.spanish-question').forEach(function(el) {
            el.classList.add('hidden');
        });
        updateToggleButton(true);
    }
    
    const toggleBtn = document.getElementById('toggle-spanish');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const firstQuestion = document.querySelector('.spanish-question');
            const isHidden = firstQuestion ? firstQuestion.classList.contains('hidden') : false;
            
            document.querySelectorAll('.spanish-question').forEach(function(el) {
                el.classList.toggle('hidden');
            });
            
            localStorage.setItem('hideSpanish', !isHidden);
            updateToggleButton(!isHidden);
        });
    }
    
    // Per-question toggle functionality
    document.querySelectorAll('.toggle-question-spanish').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const spanishDiv = btn.closest('.spanish-question');
            const content = spanishDiv.querySelector('.spanish-content');
            content.classList.toggle('hidden');
            
            const isHidden = content.classList.contains('hidden');
            btn.textContent = isHidden ? 'Mostrar/Show' : 'Ocultar/Hide';
        });
    });
});

function updateToggleButton(isHidden) {
    const toggleBtn = document.getElementById('toggle-spanish');
    if (toggleBtn) {
        toggleBtn.textContent = isHidden ? 'Mostrar todo español/Show all Spanish' : 'Ocultar todo español/Hide all Spanish';
    }
}