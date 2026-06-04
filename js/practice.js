/* ===========================================================
   Cantonese Learning — per-lesson practice session UI.
   Reads ?id=<lesson>, builds an interleaved session from the
   lesson's own data via window.PracticeLogic, runs it, and
   records per-lesson progress in window.Store.
   =========================================================== */
(function () {
  "use strict";

  var mount = document.getElementById("practice-page");
  if (!mount || !window.LESSONS || !window.PracticeLogic || !window.Store) return;
  var PL = window.PracticeLogic;

  var params = new URLSearchParams(window.location.search);
  var lessonId = params.get("id");
  var lesson = window.LESSONS.filter(function (l) { return l.id === lessonId; })[0];

  if (!lesson) {
    mount.innerHTML =
      '<div class="placeholder-card"><h2>Practice not found</h2>' +
      '<p class="muted">We couldn\'t find that lesson.</p>' +
      '<a class="btn btn-primary" href="lessons.html">Back to all lessons</a></div>';
    document.title = "Practice not found — Cantonese Learning";
    return;
  }
  document.title = "Practice · " + lesson.title + " — Cantonese Learning";
  window.Store.recordActivity();

  var pool = window.Vocab ? window.Vocab.all().concat(window.Vocab.wordbank()) : [];
  var tonePairs = PL.mineTonePairs(pool);
  function hasAudio(h) {
    return !!(window.AUDIO_MANIFEST && Object.prototype.hasOwnProperty.call(window.AUDIO_MANIFEST, h));
  }

  var session = [], idx = 0, results = [], answered = false;

  start();

  function start() {
    session = PL.buildSession(lesson, { pool: pool, tonePairs: tonePairs, hasAudio: hasAudio, cap: 14 });
    idx = 0; results = [];
    if (!session.length) {
      mount.innerHTML =
        '<div class="placeholder-card"><h2>Not enough to practise yet</h2>' +
        '<p class="muted">This lesson doesn\'t have enough vocabulary or sentences for a practice session yet. Read the lesson first.</p>' +
        '<a class="btn btn-primary" href="lesson.html?id=' + encodeURIComponent(lesson.id) + '">Back to the lesson</a></div>';
      return;
    }
    renderTask();
  }

  function renderTask() {
    if (idx >= session.length) { renderResults(); return; }
    answered = false;
    var task = session[idx];
    var html = '<div class="practice">';
    html += '<a class="back-link" href="lesson.html?id=' + encodeURIComponent(lesson.id) + '">← ' + escapeHtml(lesson.title) + '</a>';
    html += '<div class="fc-progressbar"><div class="fc-progress-fill" style="width:' + Math.round((idx / session.length) * 100) + '%"></div></div>';
    html += '<p class="fc-counter">' + (idx + 1) + ' / ' + session.length + ' · ' + typeLabel(task.type) + '</p>';
    html += '<div class="pr-body">' + bodyFor(task) + '</div>';
    html += '<div class="pr-feedback" id="pr-feedback"></div>';
    html += '<button class="btn btn-primary pr-next" id="pr-next" style="display:none">Next →</button>';
    html += '</div>';
    mount.innerHTML = html;
    var next = document.getElementById("pr-next");
    next.addEventListener("click", function () { idx++; renderTask(); });
    wireFor(task);
  }

  function bodyFor(task) {
    switch (task.type) {
      case "recall": return recallBody(task);
      case "listening": return listeningBody(task);
      case "matching": return matchingBody(task);
      case "cloze": return clozeBody(task);
      case "reorder": return reorderBody(task);
      case "tone": return toneBody(task);
      case "shadow": return shadowBody(task);
    }
    return "";
  }
  function wireFor(task) {
    switch (task.type) {
      case "recall": return wireRecall(task);
      case "listening": return wireListening(task);
      case "matching": return wireMatching(task);
      case "cloze": return wireCloze(task);
      case "reorder": return wireReorder(task);
      case "tone": return wireTone(task);
      case "shadow": return wireShadow(task);
    }
  }
  function typeLabel(t) {
    return { recall: "Recall", listening: "Listening", matching: "Matching",
             cloze: "Fill the blank", reorder: "Reorder", tone: "Which tone?", shadow: "Say it" }[t] || "";
  }

  function finish(correct, word, msg) {
    if (answered) return;
    answered = true;
    results.push({ type: session[idx].type, correct: correct, word: word || null });
    var fb = document.getElementById("pr-feedback");
    if (fb) {
      fb.className = "pr-feedback " + (correct === true ? "ok" : correct === false ? "no" : "neutral");
      fb.innerHTML = msg || (correct === true ? "✓ Correct" : correct === false ? "✗ Not quite" : "");
    }
    var next = document.getElementById("pr-next");
    if (next) { next.style.display = ""; if (idx + 1 >= session.length) next.textContent = "See results →"; }
  }

  // ---- recall ----
  function recallBody(task) {
    var w = task.word;
    return '<div class="pr-card pr-recall">' +
      '<p class="pr-prompt english">' + escapeHtml(w.english) + '</p>' +
      '<div class="pr-reveal-answer" id="pr-answer" hidden>' +
        '<span class="jyutping">' + escapeHtml(w.jyutping) + '</span>' +
        '<span class="hanzi" lang="yue">' + escapeHtml(w.hanzi) + '</span>' +
        '<button class="audio-btn" id="pr-audio" aria-label="Play audio">🔊</button>' +
      '</div>' +
      '<button class="btn btn-primary" id="pr-reveal">Show answer</button>' +
      '<div class="pr-selfgrade" id="pr-selfgrade" hidden>' +
        '<button class="btn btn-ghost-dark" data-grade="no">Missed it</button> ' +
        '<button class="btn btn-primary" data-grade="yes">Got it</button>' +
      '</div></div>';
  }
  function wireRecall(task) {
    var reveal = document.getElementById("pr-reveal");
    reveal.addEventListener("click", function () {
      document.getElementById("pr-answer").hidden = false;
      document.getElementById("pr-selfgrade").hidden = false;
      reveal.style.display = "none";
      play(task.word.hanzi);
    });
    bindAudio(task.word.hanzi);
    mount.querySelectorAll("#pr-selfgrade [data-grade]").forEach(function (b) {
      b.addEventListener("click", function () { finish(b.getAttribute("data-grade") === "yes", task.word); });
    });
  }

  // ---- shared multiple choice ----
  function choiceButtons(options) {
    return '<div class="pr-options">' + options.map(function (opt) {
      return '<button class="pr-option" data-val="' + escapeAttr(opt) + '">' + escapeHtml(opt) + '</button>';
    }).join("") + '</div>';
  }
  function wireChoiceButtons(answerVal, word, revealMsg) {
    mount.querySelectorAll(".pr-option").forEach(function (b) {
      b.addEventListener("click", function () {
        if (answered) return;
        var correct = b.getAttribute("data-val") === answerVal;
        mount.querySelectorAll(".pr-option").forEach(function (x) {
          x.disabled = true;
          if (x.getAttribute("data-val") === answerVal) x.classList.add("correct");
        });
        if (!correct) b.classList.add("wrong");
        finish(correct, word, revealMsg);
      });
    });
  }

  // ---- listening ----
  function listeningBody(task) {
    return '<div class="pr-card">' +
      '<p class="pr-instr muted">Listen, then choose the meaning.</p>' +
      '<button class="audio-btn pr-bigaudio" id="pr-audio" aria-label="Play audio">🔊</button>' +
      choiceButtons(task.options) + '</div>';
  }
  function wireListening(task) {
    bindAudio(task.word.hanzi);
    play(task.word.hanzi);
    wireChoiceButtons(task.word.english, task.word);
  }

  // ---- cloze ----
  function clozeBody(task) {
    var blanked = task.sentence.hanzi.split(task.target.hanzi).join('<span class="pr-blank">＿＿</span>');
    return '<div class="pr-card">' +
      '<p class="pr-instr muted">Choose the missing word.</p>' +
      '<p class="pr-sentence hanzi" lang="yue">' + blanked + '</p>' +
      '<p class="pr-sentence-en muted">' + escapeHtml(task.sentence.english) + '</p>' +
      choiceButtons(task.options) + '</div>';
  }
  function wireCloze(task) { wireChoiceButtons(task.target.hanzi, task.target); }

  // ---- tone ----
  function toneBody(task) {
    var btns = "";
    for (var t = 1; t <= 6; t++) btns += '<button class="pr-option pr-tone" data-val="' + t + '">' + t + '</button>';
    return '<div class="pr-card">' +
      '<p class="pr-instr muted">Listen — which tone (1–6) did you hear?</p>' +
      '<button class="audio-btn pr-bigaudio" id="pr-audio" aria-label="Play audio">🔊</button>' +
      '<span class="pr-tone-syllable">' + escapeHtml(stripTone(task.word.jyutping)) + ' ?</span>' +
      '<div class="pr-options pr-tone-row">' + btns + '</div></div>';
  }
  function wireTone(task) {
    bindAudio(task.word.hanzi);
    play(task.word.hanzi);
    var ans = String(task.tone);
    mount.querySelectorAll(".pr-tone").forEach(function (b) {
      b.addEventListener("click", function () {
        if (answered) return;
        var correct = b.getAttribute("data-val") === ans;
        mount.querySelectorAll(".pr-tone").forEach(function (x) {
          x.disabled = true;
          if (x.getAttribute("data-val") === ans) x.classList.add("correct");
        });
        if (!correct) b.classList.add("wrong");
        finish(correct, task.word, (correct ? "✓ " : "✗ ") + escapeHtml(task.word.jyutping) + " — " + escapeHtml(task.word.english));
      });
    });
  }
  function stripTone(j) { return String(j == null ? "" : j).replace(/[1-6]$/, ""); }

  // ---- reorder ----
  function reorderBody(task) {
    var bank = PL.shuffle(task.tokens).map(function (tok) {
      return '<button class="pr-chip" data-tok="' + escapeAttr(tok) + '">' + escapeHtml(tok) + '</button>';
    }).join("");
    return '<div class="pr-card">' +
      '<p class="pr-instr muted">Tap the words in order to rebuild the sentence.</p>' +
      '<p class="pr-sentence-en muted">' + escapeHtml(task.sentence.english) + '</p>' +
      '<div class="pr-build" id="pr-build" aria-label="Your sentence"></div>' +
      '<div class="pr-bank" id="pr-bank">' + bank + '</div>' +
      '<button class="btn btn-primary" id="pr-check" disabled>Check</button></div>';
  }
  function wireReorder(task) {
    var build = document.getElementById("pr-build");
    var check = document.getElementById("pr-check");
    var chosen = [];
    function refresh() { check.disabled = chosen.length !== task.tokens.length; }
    mount.querySelectorAll("#pr-bank .pr-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        if (answered || chip.disabled) return;
        chip.disabled = true; chip.classList.add("used");
        var tok = chip.getAttribute("data-tok");
        chosen.push(tok);
        var b = document.createElement("button");
        b.className = "pr-chip"; b.textContent = tok;
        b.addEventListener("click", function () {
          if (answered) return;
          build.removeChild(b);
          chip.disabled = false; chip.classList.remove("used");
          var k = chosen.indexOf(tok); if (k > -1) chosen.splice(k, 1);
          refresh();
        });
        build.appendChild(b);
        refresh();
      });
    });
    check.addEventListener("click", function () {
      if (answered) return;
      var correct = chosen.join(" ") === task.tokens.join(" ");
      check.disabled = true;
      finish(correct, null, (correct ? "✓ " : "✗ It was: ") + escapeHtml(task.sentence.jyutping));
      if (correct) play(task.sentence.hanzi);
    });
  }

  // ---- matching ----
  function matchingBody(task) {
    var left = PL.shuffle(task.words).map(function (w) {
      return '<button class="pr-chip pr-match-l" data-key="' + escapeAttr(w.hanzi) + '" lang="yue">' + escapeHtml(w.hanzi) + '</button>';
    }).join("");
    var right = PL.shuffle(task.words).map(function (w) {
      return '<button class="pr-chip pr-match-r" data-key="' + escapeAttr(w.hanzi) + '">' + escapeHtml(w.english) + '</button>';
    }).join("");
    return '<div class="pr-card">' +
      '<p class="pr-instr muted">Tap a word, then its meaning.</p>' +
      '<div class="pr-match"><div class="pr-col">' + left + '</div><div class="pr-col">' + right + '</div></div></div>';
  }
  function wireMatching(task) {
    var total = task.words.length, done = 0, mistakes = 0, selL = null, selR = null;
    function clearSel() {
      if (selL) selL.classList.remove("selected");
      if (selR) selR.classList.remove("selected");
      selL = selR = null;
    }
    function tryMatch() {
      if (!selL || !selR) return;
      if (selL.getAttribute("data-key") === selR.getAttribute("data-key")) {
        var key = selL.getAttribute("data-key");
        selL.classList.add("matched"); selR.classList.add("matched");
        selL.disabled = true; selR.disabled = true;
        play(key); clearSel(); done++;
        if (done === total) finish(mistakes === 0, null, mistakes === 0 ? "✓ All matched" : "✗ " + mistakes + " slip(s)");
      } else {
        mistakes++;
        var a = selL, b = selR;
        a.classList.add("wrong"); b.classList.add("wrong");
        setTimeout(function () { a.classList.remove("wrong"); b.classList.remove("wrong"); }, 500);
        clearSel();
      }
    }
    mount.querySelectorAll(".pr-match-l").forEach(function (el) {
      el.addEventListener("click", function () {
        if (answered || el.classList.contains("matched")) return;
        if (selL) selL.classList.remove("selected");
        selL = el; el.classList.add("selected"); tryMatch();
      });
    });
    mount.querySelectorAll(".pr-match-r").forEach(function (el) {
      el.addEventListener("click", function () {
        if (answered || el.classList.contains("matched")) return;
        if (selR) selR.classList.remove("selected");
        selR = el; el.classList.add("selected"); tryMatch();
      });
    });
  }

  // ---- shadow ----
  function shadowBody(task) {
    var w = task.word;
    return '<div class="pr-card pr-shadow">' +
      '<p class="pr-instr muted">Say it aloud in Cantonese, then reveal and compare.</p>' +
      '<p class="pr-prompt english">' + escapeHtml(w.english) + '</p>' +
      '<div class="pr-reveal-answer" id="pr-answer" hidden>' +
        '<span class="jyutping">' + escapeHtml(w.jyutping) + '</span>' +
        '<span class="hanzi" lang="yue">' + escapeHtml(w.hanzi) + '</span>' +
        '<button class="audio-btn" id="pr-audio" aria-label="Play audio">🔊</button>' +
      '</div>' +
      '<button class="btn btn-primary" id="pr-reveal">Reveal & play</button></div>';
  }
  function wireShadow(task) {
    var reveal = document.getElementById("pr-reveal");
    reveal.addEventListener("click", function () {
      document.getElementById("pr-answer").hidden = false;
      reveal.style.display = "none";
      play(task.word.hanzi);
      finish(null, null, "Compare your tones to the audio.");
    });
    bindAudio(task.word.hanzi);
  }

  // ---- results ----
  function renderResults() {
    var s = PL.scoreSession(results);
    window.Store.recordPractice(lesson.id, s.pct);
    var html = '<div class="practice pr-results">';
    html += '<p class="fc-caught-up">✅ Practice complete!</p>';
    html += '<div class="fc-stats">' + stat(s.pct + "%", "Score") + stat(s.correct + " / " + s.total, "Correct") + '</div>';
    if (s.missedWords.length) {
      html += '<h3 class="pr-missed-title">Words to review</h3><div class="pr-missed vocab-grid">';
      s.missedWords.forEach(function (w) {
        html += '<div class="vocab-card">' +
          '<div class="vocab-top"><span class="hanzi" lang="yue">' + escapeHtml(w.hanzi) + '</span>' +
          '<button class="audio-btn" data-audio="' + escapeAttr(w.hanzi) + '" aria-label="Play audio">🔊</button></div>' +
          '<span class="jyutping">' + escapeHtml(w.jyutping) + '</span>' +
          '<span class="english">' + escapeHtml(w.english) + '</span>' +
          '<button class="deck-btn pr-add" data-hanzi="' + escapeAttr(w.hanzi) + '">+ Add to deck</button>' +
          '</div>';
      });
      html += '</div>';
    }
    html += '<div class="pr-results-cta">' +
      '<button class="btn btn-primary" id="pr-again">Practice again</button> ' +
      '<a class="btn btn-ghost-dark" href="lesson.html?id=' + encodeURIComponent(lesson.id) + '">Back to lesson</a></div></div>';
    mount.innerHTML = html;

    document.getElementById("pr-again").addEventListener("click", start);
    mount.querySelectorAll("[data-audio]").forEach(function (b) {
      b.addEventListener("click", function () { play(b.getAttribute("data-audio")); });
    });
    var byHanzi = {};
    s.missedWords.forEach(function (w) { byHanzi[w.hanzi] = w; });
    mount.querySelectorAll(".pr-add").forEach(function (b) {
      b.addEventListener("click", function () {
        var w = byHanzi[b.getAttribute("data-hanzi")];
        if (!w) return;
        window.Store.addToDeck({ hanzi: w.hanzi, jyutping: w.jyutping, english: w.english,
          source: w.source || "lesson", lessonId: lesson.id, lessonTitle: lesson.title });
        b.textContent = "✓ In deck"; b.classList.add("in-deck"); b.disabled = true;
      });
    });
  }

  // ---- helpers ----
  function bindAudio(text) {
    var a = document.getElementById("pr-audio");
    if (a) a.addEventListener("click", function () { play(text); });
  }
  function play(text) { if (window.speakCantonese) window.speakCantonese(text); }
  function stat(num, label) {
    return '<div class="fc-stat"><span class="fc-stat-num">' + num + '</span><span class="fc-stat-label">' + label + '</span></div>';
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }
})();
