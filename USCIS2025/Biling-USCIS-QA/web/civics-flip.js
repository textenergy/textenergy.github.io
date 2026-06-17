/* civics-flip.js — flash card logic for civics Q&A flip card pages
   Data format expected in page-level script:
   var CIVICS_FLIP_DATA = [
     {
       num: 1,
       starred: false,
       question: "What is the form of government of the United States?",
       answers: ["Republic", "Constitution-based federal republic", "Representative democracy"],
       note: ""        // optional, e.g. "Answers will vary." or "Visit uscis.gov/citizenship/testupdates"
     },
     ...
   ];
   CivicsFlip.init(CIVICS_FLIP_DATA, 'card-grid');
*/

var CivicsFlip = (function () {

    function buildCard(item) {
        var starSpan = item.starred
            ? '<span class="starred" aria-label="65/20 special consideration question">&#9733;</span>'
            : '';

        var answerItems = item.answers.map(function (a) {
            return '<li>' + a + '</li>';
        }).join('');

        var noteHtml = item.note
            ? '<p class="a-note">' + item.note + '</p>'
            : '';

        var div = document.createElement('div');
        div.className = 'flip-card';
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.setAttribute('aria-label', 'Question ' + item.num + '. Click to reveal answer.');

        div.innerHTML =
            '<div class="card-face card-front">' +
              '<div class="q-num">Question ' + item.num + starSpan + '</div>' +
              '<p class="q-text">' + item.question + '</p>' +
            '</div>' +
            '<div class="card-face card-back" hidden>' +
              '<div class="a-label">Answer ' + item.num + starSpan + '</div>' +
              '<ul class="a-list">' + answerItems + '</ul>' +
              noteHtml +
            '</div>';

        function toggle() {
            var front = div.querySelector('.card-front');
            var back  = div.querySelector('.card-back');
            var showing = back.hasAttribute('hidden');
            if (showing) {
                front.setAttribute('hidden', '');
                back.removeAttribute('hidden');
                div.setAttribute('aria-label', 'Answer ' + item.num + ' shown. Click to flip back.');
            } else {
                back.setAttribute('hidden', '');
                front.removeAttribute('hidden');
                div.setAttribute('aria-label', 'Question ' + item.num + '. Click to reveal answer.');
            }
        }

        div.addEventListener('click', toggle);
        div.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });

        return div;
    }

    function init(data, containerId) {
        var grid = document.getElementById(containerId);
        if (!grid) { return; }
        data.forEach(function (item) {
            grid.appendChild(buildCard(item));
        });
    }

    return { init: init };
}());
