/* ===========================================================
   Cantonese Learning — flashcards (Phase 3)
   Spaced-repetition review. Shows due cards plus a few new ones,
   you flip and rate each, and progress saves to localStorage.
   =========================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("flashcards-page");
  if (!mount || !window.Vocab || !window.Store) return;

  var NEW_PER_SESSION = 10;
  var all = window.Vocab.all();

  var queue = [];      // cards remaining this session
  var current = null;  // card being shown
  var flipped = false;
  var done = 0;

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
        (due.length || fresh.length
          ? '<button class="btn btn-primary fc-start-btn" id="fc-start">Start session →</button>'
          : '<p class="fc-caught-up">🎉 You\'re all caught up! Come back later for more reviews.</p>' +
            '<a class="btn btn-ghost-dark" href="vocabulary.html">Browse vocabulary</a>'
        ) +
        '<p class="muted fc-note">' + all.length + ' words available · progress is saved in this browser.</p>' +
        (known ? '<button class="fc-reset" id="fc-reset">Reset all progress</button>' : '') +
      '</div>';

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

  function buildQueue(due, fresh) {
    queue = shuffle(due.slice());
    queue = queue.concat(fresh.slice(0, NEW_PER_SESSION));
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
    var state = window.Store.getState(current.id);
    var isNew = !state;

    mount.innerHTML =
      '<div class="fc-progressbar"><div class="fc-progress-fill" style="width:' +
        Math.round((done / total) * 100) + '%"></div></div>' +
      '<p class="fc-counter">' + (done + 1) + ' / ' + total +
        (isNew ? ' · <span class="fc-newtag">new</span>' : '') + '</p>' +
      '<div class="flashcard' + (flipped ? ' flipped' : '') + '" id="flashcard">' +
        '<div class="fc-face fc-front">' +
          '<span class="fc-hanzi" lang="yue">' + escapeHtml(current.hanzi) + '</span>' +
          '<button class="audio-btn fc-audio" data-text="' + escapeAttr(current.hanzi) + '" aria-label="Play audio">🔊</button>' +
          '<span class="fc-hint">Tap to reveal</span>' +
        '</div>' +
        '<div class="fc-face fc-back">' +
          '<span class="fc-jyutping">' + escapeHtml(current.jyutping) + '</span>' +
          '<span class="fc-english">' + escapeHtml(current.english) + '</span>' +
          '<span class="fc-lesson muted">from “' + escapeHtml(current.lessonTitle) + '”</span>' +
        '</div>' +
      '</div>' +
      (flipped ? ratingBar() : '<button class="btn btn-primary fc-flip" id="fc-flip">Show answer</button>');

    var card = document.getElementById("flashcard");
    card.addEventListener("click", function (e) {
      if (e.target.closest(".audio-btn")) return; // don't flip on audio tap
      if (!flipped) flip();
    });
    var flipBtn = document.getElementById("fc-flip");
    if (flipBtn) flipBtn.addEventListener("click", flip);

    var audioBtn = card.querySelector(".audio-btn");
    if (audioBtn) audioBtn.addEventListener("click", function () {
      if (window.speakCantonese) window.speakCantonese(current.hanzi);
    });

    // Auto-play audio when answer is revealed.
    if (flipped && window.speakCantonese) window.speakCantonese(current.hanzi);

    mount.querySelectorAll("[data-rate]").forEach(function (b) {
      b.addEventListener("click", function () { rateCurrent(b.getAttribute("data-rate")); });
    });
  }

  function flip() { flipped = true; renderCard(); }

  function rateCurrent(rating) {
    window.Store.rate(current.id, rating);
    window.Store.recordActivity();
    // "Again" puts the card back near the end of this session too.
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
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }
})();
