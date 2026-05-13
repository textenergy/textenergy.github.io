// sentence-writing-practice.js
// USCIS Naturalization — Sentence Listening and Writing Practice

// ─── SENTENCE DATA ───────────────────────────────────────────────────────────
const SENTENCES = {
    "01": "Presidents' Day is in February.",
    "02": "Memorial Day is in May.",
    "03": "Flag Day is in June.",
    "04": "Independence Day is in July.",
    "05": "Labor Day is in September.",
    "06": "Columbus Day is in October.",
    "07": "Thanksgiving is in November.",
    "08": "The American flag is red, white, and blue.",
    "09": "The United States flag is red, white, and blue.",
    "10": "Washington was the first president.",
    "11": "President Washington is the Father of Our Country.",
    "12": "President Washington is on the dollar bill.",
    "13": "Adams was the second president.",
    "14": "Lincoln was the President during the Civil War.",
    "15": "Alaska is the largest state.",
    "16": "California has the most people.",
    "17": "California is the state that has the most people.",
    "18": "Canada is to the north of the United States.",
    "19": "Delaware was the first state.",
    "20": "Delaware was one of the first states of the United States.",
    "21": "Mexico is to the south of the United States.",
    "22": "New York City was the first capital.",
    "23": "New York City is the largest city.",
    "24": "New York City has the most people.",
    "25": "The capital of the United States is Washington, D.C.",
    "26": "The White House is in Washington, D.C.",
    "27": "Congress meets in Washington, D.C.",
    "28": "The President lives in Washington, D.C.",
    "29": "The United States has 100 Senators.",
    "30": "Senators meet in Congress.",
    "31": "Citizens elect Congress.",
    "32": "The people elect Congress.",
    "33": "The President lives in the White House.",
    "34": "The United States has 50 states.",
    "35": "The United States has fifty states.",
    "36": "People want to vote.",
    "37": "Citizens can vote.",
    "38": "Citizens have the right to vote.",
    "39": "United States citizens have the right to vote.",
    "40": "We vote for the president in November.",
    "41": "People vote for the President in November.",
    "42": "People want to be free.",
    "43": "People come to the United States to be free.",
    "44": "Freedom of speech is one right.",
    "45": "People want freedom of speech.",
    "46": "People come to the United States for freedom of speech.",
    "47": "People in the United States have the right to freedom of speech.",
    "48": "We pay taxes.",
    "49": "Citizens have to pay taxes.",
    "50": "Most people in the United States have to pay taxes.",
    "51": "American Indians lived here first.",
    "52": "American Indians lived in the United States first.",
    "53": "Lincoln was the President during the Civil War."
};

// ─── TTS ─────────────────────────────────────────────────────────────────────
function speakSentence(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.88;
    window.speechSynthesis.speak(utt);
}

// ─── UTILITIES ───────────────────────────────────────────────────────────────
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function tokenizeWords(str) {
    return str.trim().split(/\s+/).map(w => ({ text: w }));
}

function buildHighlightHTML(student, correct) {
    const cTokens = tokenizeWords(correct);
    const sTokens = tokenizeWords(student);
    const maxLen = Math.max(cTokens.length, sTokens.length);
    let html = "";
    for (let i = 0; i < maxLen; i++) {
        const cWord = cTokens[i] ? cTokens[i].text : "";
        const sWord = sTokens[i] ? sTokens[i].text : "___";
        if (sWord === cWord) {
            html += '<span class="word-correct">' + escapeHTML(sWord) + '</span> ';
        } else {
            html += '<span class="word-wrong">' + escapeHTML(sWord) + '</span> ';
        }
    }
    return html.trim();
}

// ─── STATE ───────────────────────────────────────────────────────────────────
const attempts = {};

// ─── CHECK ───────────────────────────────────────────────────────────────────
function handleCheck(num) {
    const sentence  = SENTENCES[num];
    const input     = document.getElementById("input-ss" + num);
    const msgEl     = document.getElementById("msg-ss" + num);
    const checkBtn  = document.getElementById("check-ss" + num);
    const revealBtn = document.getElementById("reveal-ss" + num);

    if (!attempts[num]) attempts[num] = 0;
    attempts[num]++;

    const student = input.value;

    if (student === sentence) {
        msgEl.innerHTML = '<span class="feedback-correct">&#10003; Correct!</span>';
        input.disabled  = true;
        checkBtn.disabled = true;
        if (revealBtn) revealBtn.style.display = "none";
        document.getElementById("ss" + num).classList.add("completed");
    } else {
        msgEl.innerHTML = buildHighlightHTML(student, sentence);
        if (revealBtn && attempts[num] >= 3) {
            revealBtn.style.display = "inline-block";
        }
    }
}

// ─── REVEAL ──────────────────────────────────────────────────────────────────
function handleReveal(num) {
    const sentence  = SENTENCES[num];
    const msgEl     = document.getElementById("msg-ss" + num);
    const input     = document.getElementById("input-ss" + num);
    const checkBtn  = document.getElementById("check-ss" + num);
    const revealBtn = document.getElementById("reveal-ss" + num);

    msgEl.innerHTML =
        '<div class="revealed-answer"><strong>Correct sentence:</strong> ' + escapeHTML(sentence) + '</div>';
    input.value    = "";
    input.disabled = false;
    checkBtn.disabled = false;
    attempts[num]  = 0;
    if (revealBtn) revealBtn.style.display = "none";
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".speak-btn[data-num]").forEach(function(btn) {
        var num = btn.dataset.num;
        btn.addEventListener("click", function() { speakSentence(SENTENCES[num]); });
    });

    document.querySelectorAll(".check-btn[data-num]").forEach(function(btn) {
        var num = btn.dataset.num;
        btn.addEventListener("click", function() { handleCheck(num); });
    });

    document.querySelectorAll(".reveal-btn[data-num]").forEach(function(btn) {
        var num = btn.dataset.num;
        btn.addEventListener("click", function() { handleReveal(num); });
    });

    document.querySelectorAll(".writing-input[data-num]").forEach(function(input) {
        var num = input.dataset.num;
        input.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                var checkBtn = document.getElementById("check-ss" + num);
                if (checkBtn && !checkBtn.disabled) handleCheck(num);
            }
        });
    });
});
