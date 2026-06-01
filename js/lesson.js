/* ===========================================================
   Cantonese Learning — single lesson page (Phase 2)
   Reads the ?id= from the URL, finds the lesson in
   window.LESSONS, and renders it (dialogue, vocab, notes).
   =========================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("lesson-view");
  if (!mount || !window.LESSONS) return;

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var lesson = window.LESSONS.filter(function (l) { return l.id === id; })[0];

  if (!lesson) {
    mount.innerHTML =
      '<div class="placeholder-card">' +
      '<h2>Lesson not found</h2>' +
      '<p class="muted">We couldn\'t find that lesson.</p>' +
      '<a class="btn btn-primary" href="lessons.html">Back to all lessons</a>' +
      '</div>';
    document.title = "Lesson not found — Cantonese Learning";
    return;
  }

  document.title = lesson.title + " — Cantonese Learning";

  var spk = ttsSupported();
  var html = "";

  // ----- Header -----
  html += '<div class="lesson-head">';
  html += '<a class="back-link" href="lessons.html">← All lessons</a>';
  html += '<span class="level-tag">Level ' + lesson.level + ' · ' + escapeHtml(lesson.levelName) + '</span>';
  html += '<h1>' + escapeHtml(lesson.title) + '</h1>';
  if (lesson.subtitle) html += '<p class="lesson-subtitle">' + escapeHtml(lesson.subtitle) + '</p>';
  if (lesson.intro) html += '<p class="lesson-intro">' + escapeHtml(lesson.intro) + '</p>';
  html += '</div>';

  // ----- Dialogue -----
  if (lesson.dialogue && lesson.dialogue.length) {
    html += '<section class="lesson-section">';
    html += '<h2 class="lesson-section-title">Dialogue</h2>';
    html += '<div class="dialogue">';
    lesson.dialogue.forEach(function (line) {
      html +=
        '<div class="dialogue-line">' +
          '<span class="dialogue-speaker">' + escapeHtml(line.speaker || "") + '</span>' +
          '<div class="dialogue-body">' +
            '<div class="dialogue-top">' +
              '<span class="hanzi" lang="yue">' + escapeHtml(line.hanzi) + '</span>' +
              audioBtn(line.hanzi) +
            '</div>' +
            '<span class="jyutping">' + escapeHtml(line.jyutping) + '</span>' +
            '<span class="english">' + escapeHtml(line.english) + '</span>' +
          '</div>' +
        '</div>';
    });
    html += '</div></section>';
  }

  // ----- Vocabulary -----
  if (lesson.vocab && lesson.vocab.length) {
    html += '<section class="lesson-section">';
    html += '<h2 class="lesson-section-title">Vocabulary</h2>';
    html += '<div class="vocab-grid">';
    lesson.vocab.forEach(function (v) {
      html +=
        '<div class="vocab-card">' +
          '<div class="vocab-top">' +
            '<span class="hanzi" lang="yue">' + escapeHtml(v.hanzi) + '</span>' +
            audioBtn(v.hanzi) +
          '</div>' +
          '<span class="jyutping">' + escapeHtml(v.jyutping) + '</span>' +
          '<span class="english">' + escapeHtml(v.english) + '</span>' +
        '</div>';
    });
    html += '</div></section>';
  }

  // ----- Notes -----
  if (lesson.notes && lesson.notes.length) {
    html += '<section class="lesson-section">';
    html += '<h2 class="lesson-section-title">Grammar & Notes</h2>';
    lesson.notes.forEach(function (n) {
      html +=
        '<div class="note-card">' +
          '<h3>' + escapeHtml(n.title) + '</h3>' +
          '<p>' + escapeHtml(n.body) + '</p>' +
        '</div>';
    });
    html += '</section>';
  }

  // ----- Footer nav (prev / next within whole list) -----
  html += buildPrevNext(lesson);

  mount.innerHTML = html;

  // Wire up audio buttons.
  if (spk) {
    mount.addEventListener("click", function (e) {
      var btn = e.target.closest(".audio-btn");
      if (!btn) return;
      window.speakCantonese(btn.getAttribute("data-text"));
    });
  }

  // ---------- helpers ----------
  function audioBtn(text) {
    if (!spk) return "";
    return '<button class="audio-btn" data-text="' + escapeAttr(text) +
           '" aria-label="Play audio" title="Play audio">🔊</button>';
  }

  function buildPrevNext(current) {
    var all = window.LESSONS.slice().sort(function (a, b) {
      return (a.level - b.level) || ((a.order || 0) - (b.order || 0));
    });
    var idx = all.findIndex(function (l) { return l.id === current.id; });
    var prev = all[idx - 1], next = all[idx + 1];
    var out = '<nav class="lesson-nav">';
    out += prev
      ? '<a class="btn btn-ghost-dark" href="lesson.html?id=' + encodeURIComponent(prev.id) + '">← ' + escapeHtml(prev.title) + '</a>'
      : '<span></span>';
    out += next
      ? '<a class="btn btn-primary" href="lesson.html?id=' + encodeURIComponent(next.id) + '">' + escapeHtml(next.title) + ' →</a>'
      : '<a class="btn btn-primary" href="lessons.html">Finish · all lessons</a>';
    out += '</nav>';
    return out;
  }

  function ttsSupported() { return "speechSynthesis" in window; }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }
})();
