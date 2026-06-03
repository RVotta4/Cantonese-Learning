/* ===========================================================
   Cantonese Learning — Word Bank page
   Searchable, topic-filterable list of the user's saved words.
   =========================================================== */
(function () {
  "use strict";
  var mount = document.getElementById("wordbank-page");
  if (!mount || !window.Vocab) return;

  var all = window.Vocab.wordbank();
  var topics = [];
  var seen = {};
  all.forEach(function (v) { if (!seen[v.topic]) { seen[v.topic] = true; topics.push(v.topic); } });
  topics.sort();

  mount.innerHTML =
    '<div class="vocab-controls">' +
      '<input type="search" id="wb-search" placeholder="Search character, jyutping or English…" autocomplete="off" />' +
      '<select id="wb-filter"><option value="">All topics</option>' +
        topics.map(function (t) { return '<option value="' + escapeAttr(t) + '">' + escapeHtml(t) + '</option>'; }).join("") +
      '</select>' +
    '</div>' +
    '<p class="vocab-count muted" id="wb-count"></p>' +
    '<div class="vocab-grid" id="wb-results"></div>';

  var searchEl = document.getElementById("wb-search");
  var filterEl = document.getElementById("wb-filter");
  var resultsEl = document.getElementById("wb-results");
  var countEl = document.getElementById("wb-count");

  function render() {
    var q = searchEl.value.trim().toLowerCase();
    var topic = filterEl.value;
    var list = all.filter(function (v) {
      if (topic && v.topic !== topic) return false;
      if (!q) return true;
      return v.hanzi.toLowerCase().indexOf(q) > -1 ||
             v.jyutping.toLowerCase().indexOf(q) > -1 ||
             v.english.toLowerCase().indexOf(q) > -1;
    });
    countEl.textContent = list.length + (list.length === 1 ? " word" : " words") +
      (q || topic ? " (filtered)" : " in total");
    resultsEl.innerHTML = list.length ? list.map(function (v) {
      return '<div class="vocab-card">' +
        '<div class="vocab-top">' +
          '<span class="hanzi" lang="yue">' + escapeHtml(v.hanzi) + '</span>' +
          '<button class="audio-btn" data-text="' + escapeAttr(v.hanzi) + '" aria-label="Play audio" title="Play audio">🔊</button>' +
        '</div>' +
        '<span class="jyutping">' + escapeHtml(v.jyutping) + '</span>' +
        '<span class="english">' + escapeHtml(v.english) + '</span>' +
        (window.Deck ? window.Deck.button(v) : "") +
      '</div>';
    }).join("") : '<p class="muted">No words match your search.</p>';
  }

  searchEl.addEventListener("input", render);
  filterEl.addEventListener("change", render);
  resultsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".audio-btn");
    if (btn && window.speakCantonese) window.speakCantonese(btn.getAttribute("data-text"));
  });
  if (window.Deck) window.Deck.mount(resultsEl);
  render();

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }
})();
