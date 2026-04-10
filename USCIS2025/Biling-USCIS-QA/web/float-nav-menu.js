/* nav-menu.js — floating chapter navigation FAB, shared across all site pages */

(function () {
    'use strict';

    /* ── Nav data ────────────────────────────────────────────── */
    const NAV_ITEMS = [
        { label: 'Ch. 1: U.S. Constitution',              study: 'chapter01_bilingual.html',  test: 'chapter01-self-test.html' },
        { label: 'Ch. 2: Legislative Branch',             study: 'chapter02_bilingual.html',  test: 'chapter02-self-test.html' },
        { label: 'Ch. 3: Executive Branch',               study: 'chapter03_bilingual.html',  test: 'chapter03-self-test.html' },
        { label: 'Ch. 4: Judicial Branch',                study: 'chapter04_bilingual.html',  test: 'chapter04-self-test.html' },
        { label: 'Ch. 5: Rights and Responsibilities',    study: 'chapter05_bilingual.html',  test: 'chapter05-self-test.html' },
        { label: 'Ch. 6: U.S. Geography',                 study: 'chapter06_bilingual.html',  test: 'chapter06-self-test.html' },
        { label: 'Ch. 7: Early American History',         study: 'chapter07_bilingual.html',  test: 'chapter07-self-test.html' },
        { label: 'Ch. 8: Revolutionary War, Independence',study: 'chapter08_bilingual.html',  test: 'chapter08-self-test.html' },
        { label: 'Ch. 9: New Government and Expansion',   study: 'chapter09_bilingual.html',  test: 'chapter09-self-test.html' },
        { label: 'Ch. 10: Civil War',                     study: 'chapter10_bilingual.html',  test: 'chapter10-self-test.html' },
        { label: 'Ch. 11: American History 1900–2001',    study: 'chapter11_bilingual.html',  test: 'chapter11-self-test.html' },
        { label: 'Ch. 12: Symbols and Holidays',          study: 'chapter12_bilingual.html',  test: 'chapter12-self-test.html' },
        { divider: 'Addenda' },
        { label: 'A: Important Women 19th Cen.',          study: 'addendumA_bilingual.html',  test: 'addendumA-self-test.html' },
        { label: 'B: Wars 1950s\u20132020s',              study: 'addendumB_bilingual.html',  test: 'addendumB-self-test.html' },
        { label: 'C: Innovation in US',                   study: 'addendumC_bilingual.html',  test: 'addendumC-self-test.html' },
        { divider: 'Reference' },
        { label: 'Topical Index',                         index: 'Crossref-standards-quiz-questions.html' },
    ];

    /* ── Detect current page ─────────────────────────────────── */
    // Pages may set window.NAV_CURRENT_PAGE to their own filename,
    // e.g.  <script>window.NAV_CURRENT_PAGE = 'chapter03_bilingual.html';</script>
    // Fallback: derive from location.pathname.
    function currentPage() {
        if (window.NAV_CURRENT_PAGE) return window.NAV_CURRENT_PAGE;
        const parts = window.location.pathname.split('/');
        return parts[parts.length - 1] || '';
    }

    /* ── Build DOM ───────────────────────────────────────────── */
    function buildNav() {
        const cur = currentPage();

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'nav-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');

        // Panel
        const panel = document.createElement('div');
        panel.id = 'nav-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Chapter navigation');

        // Panel header
        const header = document.createElement('div');
        header.id = 'nav-panel-header';
        header.innerHTML = 'Go to chapter\u2026 / Ir al cap\u00edtulo\u2026';
        const closeBtn = document.createElement('button');
        closeBtn.id = 'nav-panel-close';
        closeBtn.setAttribute('aria-label', 'Close navigation');
        closeBtn.textContent = '\u00d7';
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // Column headers
        const colHeaders = document.createElement('div');
        colHeaders.className = 'nav-col-headers';
        colHeaders.innerHTML = '<span></span><span>Study</span><span>Self-test</span>';
        panel.appendChild(colHeaders);

        // Rows
        NAV_ITEMS.forEach(function (item) {
            if (item.divider) {
                const div = document.createElement('div');
                div.className = 'nav-divider';
                div.textContent = item.divider;
                panel.appendChild(div);
                return;
            }

            const row = document.createElement('div');
            row.className = 'nav-row';

            const label = document.createElement('span');
            label.className = 'nav-row-label';
            label.textContent = item.label;
            row.appendChild(label);

            if (item.index) {
                // Topical index — single wide link
                const a = document.createElement('a');
                a.href = item.index;
                a.className = 'index-link';
                a.textContent = 'Open / Abrir';
                if (item.index === cur) {
                    a.className += ' current-link';
                    row.classList.add('current-page');
                    a.textContent = 'Current page';
                }
                row.appendChild(a);
            } else {
                // Study link
                const aStudy = document.createElement('a');
                aStudy.href = item.study;
                aStudy.textContent = 'Study';
                if (item.study === cur) {
                    aStudy.className = 'current-link';
                    aStudy.textContent = '\u25cf\u00a0Here';
                    row.classList.add('current-page');
                }

                // Self-test link
                const aTest = document.createElement('a');
                aTest.href = item.test;
                aTest.className = 'self-test-link';
                aTest.textContent = 'Self-test';
                if (item.test === cur) {
                    aTest.className = 'self-test-link current-link';
                    aTest.textContent = '\u25cf\u00a0Here';
                    row.classList.add('current-page');
                }

                row.appendChild(aStudy);
                row.appendChild(aTest);
            }

            panel.appendChild(row);
        });

        // FAB button
        const fab = document.createElement('button');
        fab.id = 'nav-fab';
        fab.setAttribute('aria-label', 'Open chapter navigation');
        fab.setAttribute('aria-expanded', 'false');
        fab.setAttribute('aria-controls', 'nav-panel');
        fab.innerHTML = '&#9776;'; // ☰

        document.body.appendChild(backdrop);
        document.body.appendChild(panel);
        document.body.appendChild(fab);

        /* ── Behaviour ───────────────────────────────────────── */
        function openNav() {
            panel.classList.add('open');
            backdrop.classList.add('open');
            fab.setAttribute('aria-expanded', 'true');
            fab.setAttribute('aria-label', 'Close chapter navigation');
            closeBtn.focus();
        }

        function closeNav() {
            panel.classList.remove('open');
            backdrop.classList.remove('open');
            fab.setAttribute('aria-expanded', 'false');
            fab.setAttribute('aria-label', 'Open chapter navigation');
            fab.focus();
        }

        fab.addEventListener('click', function () {
            panel.classList.contains('open') ? closeNav() : openNav();
        });

        closeBtn.addEventListener('click', closeNav);
        backdrop.addEventListener('click', closeNav);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('open')) closeNav();
        });
    }

    /* ── Init ────────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildNav);
    } else {
        buildNav();
    }
}());
