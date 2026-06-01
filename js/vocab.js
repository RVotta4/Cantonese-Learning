/* ===========================================================
   Cantonese Learning — vocabulary page (Phase 3)
   Searchable, filterable list of every word from the lessons.
   =========================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("vocab-page");
  if (!mount || !window.Vocab) return;

  var all = window.Vocab.all();
  var spk = "speechSynthesis" in window || true; // audio buttons always shown

  // Build lesson filter options.
  var lessons = [];
  var seen = {};
  all.forEach(function (v) {
    if (!seen[v.lessonId]) { seen[v.lessonId] = true; lessons.push({ id: v.lessonId, title: v.lessonTitle }); }
  });

  mount.innerHTML =
    '<div class="vocab-controls">' +
      '<input type="search" id="vocab-search" placeholder="Search character, jyutping or English…" autocomplete="off" />' +
      '<select id="vocab-filter">' +
        '<option value="">All lessons</option>' +
        lessons.map(function (l) {
          return '<option value="' + escapeAttr(l.id) + '">' + escapeHtml(l.title) + '</option>';
        }).join("") +
      '</select>' +
    '</div>' +
    '<p class="vocab-count muted" id="vocab-count"></p>' +
    '<div class="vocab-grid" id="vocab-results"></div>';

  var searchEl = document.getElementById("vocab-search");
  var filterEl = document.getElementById("vocab-filter");
  var resultsEl = document.getElementById("vocab-results");
  var countEl = document.getElementById("vocab-count");

  function render() {
    var q = searchEl.value.trim().toLowerCase();
    var lessonId = filterEl.value;
    var list = all.filter(function (v) {
      if (lessonId && v.lessonId !== lessonId) return false;
      if (!q) return true;
      return (v.hanzi.toLowerCase().indexOf(q) > -1) ||
             (v.jyutping.toLowerCase().indexOf(q) > -1) ||
             (v.english.toLowerCase().indexOf(q) > -1);
    });

    countEl.textContent = list.length + (list.length === 1 ? " word" : " words") +
      (q || lessonId ? " (filtered)" : " in total");

    if (!list.length) {
      resultsEl.innerHTML = '<p class="muted">No words match your search.</p>';
      return;
    }

    resultsEl.innerHTML = list.map(function (v) {
      var known = window.Store && window.Store.getState(v.id) &&
                  window.Store.getState(v.id).interval >= 1;
      return '<div class="vocab-card">' +
        '<div class="vocab-top">' +
          '<span class="hanzi" lang="yue">' + escapeHtml(v.hanzi) + '</span>' +
          '<button class="audio-btn" data-text="' + escapeAttr(v.hanzi) + '" aria-label="Play audio" title="Play audio">🔊</button>' +
          (known ? '<span class="known-dot" title="Learned">●</span>' : '') +
        '</div>' +
        '<span class="jyutping">' + escapeHtml(v.jyutping) + '</span>' +
        '<span class="english">' + escapeHtml(v.english) + '</span>' +
        '<a class="vocab-lesson" href="lesson.html?id=' + encodeURIComponent(v.lessonId) + '">' + escapeHtml(v.lessonTitle) + '</a>' +
      '</div>';
    }).join("");
  }

  searchEl.addEventListener("input", render);
  filterEl.addEventListener("change", render);

  resultsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".audio-btn");
    if (btn && window.speakCantonese) window.speakCantonese(btn.getAttribute("data-text"));
  });

  render();

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }
})();
