/* ===========================================================
   Cantonese Learning — single story reader
   Jyutping-first: each line shows jyutping (lead) + 漢字
   (secondary) + audio; English is hidden until you tap the
   line. "Play whole story" plays every line in sequence.
   =========================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("story-view");
  if (!mount || !window.STORIES) return;

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var story = window.STORIES.filter(function (s) { return s.id === id; })[0];

  if (!story) {
    mount.innerHTML =
      '<div class="placeholder-card"><h2>Story not found</h2>' +
      '<p class="muted">We couldn\'t find that story.</p>' +
      '<a class="btn btn-primary" href="stories.html">Back to all stories</a></div>';
    document.title = "Story not found — Cantonese Learning";
    return;
  }

  document.title = story.title + " — Cantonese Learning";
  if (window.Store) window.Store.recordActivity();

  var showAll = false;
  var revealed = {};
  var playToken = 0;

  render();

  function render() {
    var html = "";
    html += '<div class="lesson-head">';
    html += '<a class="back-link" href="stories.html">← All stories</a>';
    html += '<span class="level-tag">Story · Level ' + story.level + '</span>';
    html += '<h1>' + escapeHtml(story.title) + '</h1>';
    if (story.titleJyutping) html += '<p class="lesson-subtitle">' + escapeHtml(story.titleJyutping) + '</p>';
    if (story.blurb) html += '<p class="lesson-intro">' + escapeHtml(story.blurb) + '</p>';
    html += '</div>';

    html += '<div class="story-controls">';
    html += '<button class="btn btn-primary" id="play-all">▶ Play whole story</button>';
    html += '<button class="btn btn-ghost-dark" id="toggle-all">' +
            (showAll ? "Hide translations" : "Show all translations") + '</button>';
    html += '</div>';

    html += '<div class="story-body">';
    story.sentences.forEach(function (s, i) {
      var show = showAll || revealed[i];
      html +=
        '<div class="story-line' + (show ? ' revealed' : '') + '" data-i="' + i + '">' +
          '<div class="story-line-top">' +
            '<button class="audio-btn story-audio" data-i="' + i + '" aria-label="Play audio">🔊</button>' +
            '<div class="story-line-text">' +
              '<span class="story-jyut">' + escapeHtml(s.jyutping) + '</span>' +
              '<span class="story-hanzi" lang="yue">' + highlight(s.hanzi) + '</span>' +
            '</div>' +
          '</div>' +
          '<p class="story-english">' + escapeHtml(s.english) + '</p>' +
        '</div>';
    });
    html += '</div>';

    if (story.words && story.words.length) {
      html += '<section class="lesson-section"><h2 class="lesson-section-title">Words in this story</h2>';
      html += '<div class="vocab-grid">';
      story.words.forEach(function (w) {
        html +=
          '<div class="vocab-card">' +
            '<div class="vocab-top">' +
              '<span class="hanzi" lang="yue">' + escapeHtml(w.hanzi) + '</span>' +
              '<button class="audio-btn" data-word="' + escapeAttr(w.hanzi) + '" aria-label="Play audio">🔊</button>' +
            '</div>' +
            '<span class="jyutping">' + escapeHtml(w.jyutping) + '</span>' +
            '<span class="english">' + escapeHtml(w.english) + '</span>' +
            (window.Deck ? window.Deck.button({ hanzi: w.hanzi, jyutping: w.jyutping, english: w.english, source: "story" }) : "") +
          '</div>';
      });
      html += '</div></section>';
    }

    mount.innerHTML = html;
    wire();
  }

  function wire() {
    document.getElementById("toggle-all").addEventListener("click", function () {
      showAll = !showAll;
      render();
    });
    document.getElementById("play-all").addEventListener("click", playAll);

    mount.querySelectorAll(".story-line").forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (e.target.closest(".audio-btn")) return;
        var i = +el.getAttribute("data-i");
        revealed[i] = !revealed[i];
        el.classList.toggle("revealed", !!revealed[i]);
      });
    });
    mount.querySelectorAll(".story-audio").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = +b.getAttribute("data-i");
        if (window.speakCantonese) window.speakCantonese(story.sentences[i].hanzi);
      });
    });
    mount.querySelectorAll("[data-word]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (window.speakCantonese) window.speakCantonese(b.getAttribute("data-word"));
      });
    });
    if (window.Deck) window.Deck.mount(mount);
  }

  function playAll() {
    playToken++;
    var token = playToken;
    var i = 0;
    function step() {
      if (token !== playToken || i >= story.sentences.length) return;
      var idx = i++;
      mount.querySelectorAll(".story-line.playing").forEach(function (e) { e.classList.remove("playing"); });
      var line = mount.querySelector('.story-line[data-i="' + idx + '"]');
      if (line) {
        line.classList.add("playing");
        line.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      var advanced = false;
      function advance() { if (advanced || token !== playToken) return; advanced = true; step(); }
      var res = window.speakCantonese ? window.speakCantonese(story.sentences[idx].hanzi, advance) : "unsupported";
      if (res === "unsupported") { advance(); return; }
      // Safety net so a missing 'ended' event can't stall the sequence.
      setTimeout(advance, 12000);
    }
    step();
  }

  // Wrap target words where they appear in the (escaped) 漢字 line.
  function highlight(hanzi) {
    var out = escapeHtml(hanzi);
    var words = (story.words || []).map(function (w) { return w.hanzi; })
      .filter(Boolean).sort(function (a, b) { return b.length - a.length; });
    words.forEach(function (w) {
      var ew = escapeHtml(w);
      out = out.split(ew).join('<mark class="story-kw">' + ew + '</mark>');
    });
    return out;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }
})();
