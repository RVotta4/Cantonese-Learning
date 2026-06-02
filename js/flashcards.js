/* ===========================================================
   Cantonese Learning — flashcards
   Spaced-repetition review with a choosable card direction:
     recog  Jyutping + 漢字  → English   (default)
     prod   English          → Jyutping + 漢字
     mixed  random direction per card
   Card identity is still the 漢字, so progress is shared
   across directions. Progress saves to localStorage.
   =========================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("flashcards-page");
  if (!mount || !window.Vocab || !window.Store) return;

  var NEW_PER_SESSION = 10;
  var all = window.Vocab.all();

  var MODES = {
    recog: "Jyutping + 漢字 → English",
    prod: "English → Jyutping + 漢字",
    mixed: "Mixed"
  };

  var queue = [];
  var current = null;
  var flipped = false;
  var done = 0;
  var mode = window.Store.getFcMode() || "recog";

  showStart();

  // ---------- Screens ----------
  function showStart() {
    var due = window.Store.dueCards(all);
    var fresh = window.Store.newCards(all);
    var known = window.Store.knownCount(all);

    mount.innerHTML =
      '<div class="fc-start">' +
        '<div class="fc-stats">' +
          stat(due.length, "Due for review") +
          stat(Math.min(fresh.length, NEW_PER_SESSION), "New to learn") +
          stat(known, "Words learned") +
        '</div>' +
        modeSelector() +
        (due.length || fresh.length
          ? '<button class="btn btn-primary fc-start-btn" id="fc-start">Start session →</button>'
          : '<p class="fc-caught-up">🎉 You\'re all caught up! Come back later for more reviews.</p>' +
            '<a class="btn btn-ghost-dark" href="vocabulary.html">Browse vocabulary</a>'
        ) +
        '<p class="muted fc-note">' + all.length + ' words available · progress is saved in this browser.</p>' +
        (known ? '<button class="fc-reset" id="fc-reset">Reset all progress</button>' : '') +
      '</div>';

    mount.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () {
        mode = b.getAttribute("data-mode");
        window.Store.setFcMode(mode);
        showStart();
      });
    });

    var startBtn = document.getElementById("fc-start");
    if (startBtn) startBtn.addEventListener("click", function () {
      buildQueue(due, fresh);
      next();
    });
    var resetBtn = document.getElementById("fc-reset");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      if (confirm("Reset all flashcard progress? This can't be undone.")) {
        window.Store.reset();
        showStart();
      }
    });
  }

  function modeSelector() {
    var html = '<div class="fc-modes" role="group" aria-label="Card direction">';
    Object.keys(MODES).forEach(function (key) {
      html += '<button class="fc-mode' + (mode === key ? ' active' : '') +
        '" data-mode="' + key + '">' + escapeHtml(MODES[key]) + '</button>';
    });
    return html + '</div>';
  }

  function buildQueue(due, fresh) {
    queue = shuffle(due.slice());
    queue = queue.concat(fresh.slice(0, NEW_PER_SESSION));
    queue.forEach(function (c) {
      c._dir = (mode === "mixed") ? (Math.random() < 0.5 ? "recog" : "prod") : mode;
    });
    done = 0;
  }

  function next() {
    flipped = false;
    if (!queue.length) { showDone(); return; }
    current = queue.shift();
    renderCard();
  }

  function renderCard() {
    var total = done + queue.length + 1;
    var isNew = !window.Store.getState(current.id);
    var dir = current._dir || "recog";

    mount.innerHTML =
      '<div class="fc-progressbar"><div class="fc-progress-fill" style="width:' +
        Math.round((done / total) * 100) + '%"></div></div>' +
      '<p class="fc-counter">' + (done + 1) + ' / ' + total +
        (isNew ? ' · <span class="fc-newtag">new</span>' : '') + '</p>' +
      '<div class="flashcard' + (flipped ? ' flipped' : '') + '" id="flashcard">' +
        '<div class="fc-face fc-front">' + faceFront(dir) + '</div>' +
        '<div class="fc-face fc-back">' + faceBack(dir) + '</div>' +
      '</div>' +
      (flipped ? ratingBar() : '<button class="btn btn-primary fc-flip" id="fc-flip">Show answer</button>');

    var card = document.getElementById("flashcard");
    card.addEventListener("click", function (e) {
      if (e.target.closest(".audio-btn")) return;
      if (!flipped) flip();
    });
    var flipBtn = document.getElementById("fc-flip");
    if (flipBtn) flipBtn.addEventListener("click", flip);

    mount.querySelectorAll(".audio-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        if (window.speakCantonese) window.speakCantonese(current.hanzi);
      });
    });

    // Auto-play the Cantonese when the answer is revealed.
    if (flipped && window.speakCantonese) window.speakCantonese(current.hanzi);

    mount.querySelectorAll("[data-rate]").forEach(function (b) {
      b.addEventListener("click", function () { rateCurrent(b.getAttribute("data-rate")); });
    });
  }

  // Cantonese side: jyutping (lead) + 漢字 (secondary) + audio.
  function cantoneseBlock() {
    return '<span class="fc-jyutping">' + escapeHtml(current.jyutping) + '</span>' +
           '<span class="fc-hanzi-sub" lang="yue">' + escapeHtml(current.hanzi) + '</span>' +
           '<button class="audio-btn fc-audio" aria-label="Play audio">🔊</button>';
  }
  function lessonTag() {
    return '<span class="fc-lesson muted">from "' + escapeHtml(current.lessonTitle) + '"</span>';
  }

  function faceFront(dir) {
    if (dir === "prod") {
      return '<span class="fc-english fc-prompt">' + escapeHtml(current.english) + '</span>' +
             '<span class="fc-hint">Tap to reveal</span>';
    }
    return cantoneseBlock() + '<span class="fc-hint">Tap to reveal</span>';
  }
  function faceBack(dir) {
    if (dir === "prod") return cantoneseBlock() + lessonTag();
    return '<span class="fc-english">' + escapeHtml(current.english) + '</span>' + lessonTag();
  }

  function flip() { flipped = true; renderCard(); }

  function rateCurrent(rating) {
    window.Store.rate(current.id, rating);
    window.Store.recordActivity();
    if (rating === "again") queue.push(current);
    done++;
    next();
  }

  function showDone() {
    var known = window.Store.knownCount(all);
    mount.innerHTML =
      '<div class="fc-start">' +
        '<p class="fc-caught-up">✅ Session complete! You reviewed ' + done + ' card' + (done === 1 ? '' : 's') + '.</p>' +
        '<div class="fc-stats">' + stat(known, "Words learned") + '</div>' +
        '<button class="btn btn-primary" id="fc-again">Review more</button> ' +
        '<a class="btn btn-ghost-dark" href="index.html">Back to dashboard</a>' +
      '</div>';
    var again = document.getElementById("fc-again");
    if (again) again.addEventListener("click", showStart);
  }

  // ---------- bits ----------
  function ratingBar() {
    return '<div class="fc-rating">' +
      '<button class="fc-rate fc-again" data-rate="again">Again</button>' +
      '<button class="fc-rate fc-hard" data-rate="hard">Hard</button>' +
      '<button class="fc-rate fc-good" data-rate="good">Good</button>' +
      '<button class="fc-rate fc-easy" data-rate="easy">Easy</button>' +
    '</div>';
  }
  function stat(num, label) {
    return '<div class="fc-stat"><span class="fc-stat-num">' + num + '</span>' +
           '<span class="fc-stat-label">' + label + '</span></div>';
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
})();
