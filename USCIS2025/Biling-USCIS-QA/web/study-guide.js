// Study Guide JavaScript Functions

// Toggle Spanish Content Visibility (legacy function, kept for backwards compatibility)
function toggleSpanish() {
    const spanishColumns = document.querySelectorAll('.spanish-column');
    const contentRows = document.querySelectorAll('.content-row');
    
    spanishColumns.forEach(col => {
        col.classList.toggle('hidden');
    });
    
    contentRows.forEach(row => {
        if (spanishColumns[0].classList.contains('hidden')) {
            row.classList.add('full-width');
        } else {
            row.classList.remove('full-width');
        }
    });
}

// Initialize all interactive features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Explanation Popup Positioning - using event delegation to work with cloned elements
    document.body.addEventListener('mouseenter', function(e) {
        if (!e.target.classList.contains('explan')) return;
        
        const popupId = e.target.getAttribute('data-popup');
        if (!popupId) return;
        
        const popup = document.getElementById(popupId);
        if (!popup) return;
        
        popup.classList.add('visible');
        positionPopup(popup, e);
        
        // Store reference for mousemove and mouseleave
        e.target._activePopup = popup;
    }, true);
    
    document.body.addEventListener('mousemove', function(e) {
        if (!e.target.classList.contains('explan')) return;
        if (!e.target._activePopup) return;
        
        positionPopup(e.target._activePopup, e);
    }, true);
    
    document.body.addEventListener('mouseleave', function(e) {
        if (!e.target.classList.contains('explan')) return;
        
        const popup = e.target._activePopup || (() => {
            const popupId = e.target.getAttribute('data-popup');
            return popupId ? document.getElementById(popupId) : null;
        })();
        
        if (popup) popup.classList.remove('visible');
        if (e.target._activePopup) delete e.target._activePopup;
    }, true);
    
    function positionPopup(popup, e) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const popupRect = popup.getBoundingClientRect();
        
        let left = e.clientX + 10;
        let top = e.clientY + 10;
        
        // Adjust if popup would go off right edge
        if (left + popupRect.width > viewportWidth - 10) {
            left = e.clientX - popupRect.width - 10;
        }
        
        // Adjust if popup would go off bottom edge
        if (top + popupRect.height > viewportHeight - 10) {
            top = e.clientY - popupRect.height - 10;
        }
        
        // Ensure popup doesn't go off left edge
        if (left < 10) {
            left = 10;
        }
        
        // Ensure popup doesn't go off top edge
        if (top < 10) {
            top = 10;
        }
        
        popup.style.left = left + 'px';
        popup.style.top = top + 'px';
    }
    
    // Section Accordion Functionality for H2 headings
    document.querySelectorAll('h2').forEach(heading => {
        heading.addEventListener('click', function(e) {
            const nextElement = this.nextElementSibling;
            
            // If next element is an H3, toggle all content-rows until next H2
            if (nextElement && nextElement.tagName === 'H3') {
                let currentElement = nextElement;
                while (currentElement && currentElement.tagName !== 'H2') {
                    if (currentElement.classList && currentElement.classList.contains('content-row')) {
                        currentElement.classList.toggle('collapsed');
                    }
                    currentElement = currentElement.nextElementSibling;
                }
            }
            // Otherwise toggle just the next content-row
            else if (nextElement && nextElement.classList.contains('content-row')) {
                nextElement.classList.toggle('collapsed');
            }
        });
    });
    
    // Section Accordion Functionality for H3 headings
    document.querySelectorAll('h3').forEach(heading => {
        heading.addEventListener('click', function(e) {
            e.stopPropagation();
            const contentRow = this.nextElementSibling;
            if (contentRow && contentRow.classList.contains('content-row')) {
                contentRow.classList.toggle('collapsed');
            }
        });
    });

    // Spanish Translation Toggle Functionality
    document.querySelectorAll('.content-row').forEach(contentRow => {
        const englishColumn = contentRow.querySelector('.english-column');
        const spanishColumn = contentRow.querySelector('.spanish-column');
        
        if (!englishColumn || !spanishColumn) return;
        
        // Get all translatable elements
        const englishElements = Array.from(englishColumn.querySelectorAll('p, ul, ol'))
            .filter(el => !el.classList.contains('page-ref') && !el.classList.contains('caption'));
        const spanishElements = Array.from(spanishColumn.querySelectorAll('p, ul, ol'))
            .filter(el => !el.classList.contains('page-ref') && !el.classList.contains('caption'));
        
        // Add click handlers to English elements (for Spanish toggle)
        englishElements.forEach((englishEl, index) => {
            if (index >= spanishElements.length) return;
            
            const spanishEl = spanishElements[index];
            
            englishEl.addEventListener('click', function(e) {
                // Don't toggle Spanish if clicking on an explanation element
                if (e.target.classList.contains('explan') || e.target.closest('.explan')) {
                    return;
                }
                // Don't toggle Spanish if clicking on a question reference superscript
                if (e.target.classList.contains('q-ref') || e.target.closest('.q-ref')) {
                    return;
                }
                
                e.stopPropagation();
                
                // If Spanish is already showing after this element, hide it
                const nextSibling = this.nextElementSibling;
                if (nextSibling && nextSibling.classList.contains('spanish-translation-inline')) {
                    nextSibling.remove();
                    return;
                }
                
                // Create a clone of the Spanish element to insert
                const spanishClone = spanishEl.cloneNode(true);
                spanishClone.classList.add('show', 'spanish-translation-inline');
                
                // Add click handler to hide the clone
                spanishClone.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.remove();
                });
                
                // Insert the clone after the English element
                this.parentNode.insertBefore(spanishClone, this.nextSibling);
            });
        });
    });
});

// Question/Answer popup (.qpop) functionality

// Create a single shared overlay element
const qpopOverlay = document.createElement('div');
qpopOverlay.classList.add('qpop-overlay');
document.body.appendChild(qpopOverlay);

function openQpop(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;

    // Inject header (red X) and footer (Close button) if not already present
    if (!popup.querySelector('.qpop-header')) {
        const header = document.createElement('div');
        header.className = 'qpop-header';
        header.innerHTML = '<button class="qpop-close-x" aria-label="Close">&#x2715;</button>';
        popup.insertBefore(header, popup.firstChild);
        header.querySelector('.qpop-close-x').addEventListener('click', function() {
            closeQpop(popup);
        });
    }

    if (!popup.querySelector('.qpop-footer')) {
        const footer = document.createElement('div');
        footer.className = 'qpop-footer';
        footer.innerHTML = '<button class="qpop-close-btn">Close / Cerrar</button>';
        popup.appendChild(footer);
        footer.querySelector('.qpop-close-btn').addEventListener('click', function() {
            closeQpop(popup);
        });
    }

    popup.classList.add('visible');
    qpopOverlay.classList.add('visible');

    // Dismiss on overlay click
    qpopOverlay.onclick = function() {
        closeQpop(popup);
    };

    // Dismiss on Escape key
    document.addEventListener('keydown', qpopEscHandler);
}

function closeQpop(popup) {
    popup.querySelectorAll('audio').forEach(function(audio) {
        audio.pause();
        audio.currentTime = 0;
    });
    popup.classList.remove('visible');
    qpopOverlay.classList.remove('visible');
    document.removeEventListener('keydown', qpopEscHandler);
}

function qpopEscHandler(e) {
    if (e.key === 'Escape') {
        const visiblePop = document.querySelector('.qpop.visible');
        if (visiblePop) closeQpop(visiblePop);
    }
}
