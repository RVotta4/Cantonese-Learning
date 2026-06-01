/* ===========================================================
   Cantonese Learning — dashboard (Phase 4)
   Fills the dashboard with real numbers and personalisation:
   stats, streak, continue-where-you-left-off, level progress,
   and a Word of the Day.
   =========================================================== */

(function () {
  "use strict";
  if (!window.Vocab || !window.Store || !window.LESSONS) return;

  var all = window.Vocab.all();
  var lessons = window.LESSONS.slice().sort(function (a, b) {
    return (a.level - b.level) || ((a.order || 0) - (b.order || 0));
  });

  // ---------- Stats row ----------
  var due = window.Store.dueCards(all).length;
  var fresh = window.Store.newCards(all).length;
  var known = window.Store.knownCount(all);
  var doneLessons = window.Store.completedCount();

  set("cards-due", due > 0 ? due : (fresh > 0 ? fresh + " new" : "0"));
  set("lessons-done", doneLessons);
  set("streak", window.Store.getStreak());
  if (known > 0) set("words-known", known);

  // ---------- Continue where you left off ----------
  updateContinue();

  // ---------- Level progress bars ----------
  document.querySelectorAll(".level-card[data-level]").forEach(function (card) {
    var lvl = +card.getAttribute("data-level");
    var inLevel = lessons.filter(function (l) { return l.level === lvl; });
    if (!inLevel.length) return; // no lessons yet (e.g. Level 3) — leave as-is
    var doneN = inLevel.filter(function (l) { return window.Store.isLessonComplete(l.id); }).length;
    var pct = Math.round((doneN / inLevel.length) * 100);
    var bar = card.querySelector(".progress-bar");
    var meta = card.querySelector(".level-meta");
    if (bar) bar.style.width = pct + "%";
    if (meta) meta.textContent = doneN + " / " + inLevel.length + " lessons" +
      (card.classList.contains("current") ? " · you are here" : "");
  });

  // ---------- Word of the Day ----------
  setupWordOfTheDay();

  // ---------- helpers ----------
  function updateContinue() {
    // Prefer the next not-yet-completed lesson; else the last one visited.
    var nextLesson = lessons.filter(function (l) { return !window.Store.isLessonComplete(l.id); })[0];
    var lastId = window.Store.getLastLesson();
    var target = nextLesson;
    var kicker = "Up next";

    if (!target && lastId) {
      target = lessons.filter(function (l) { return l.id === lastId; })[0];
      kicker = "Revisit";
    }
    if (!target) target = lessons[lessons.length - 1]; // all done — offer the last
    if (!target) return;

    // If they've completed everything, celebrate.
    var allDone = lessons.every(function (l) { return window.Store.isLessonComplete(l.id); });
    if (allDone) kicker = "🎉 All lessons complete";

    var card = document.getElementById("continue-card");
    if (card) card.setAttribute("href", "lesson.html?id=" + encodeURIComponent(target.id));
    setText("continue-kicker", kicker);
    setText("continue-title", target.title);
    setText("continue-sub", (target.subtitle || "") + (target.minutes ? " · " + target.minutes + " min" : ""));
  }

  function setupWordOfTheDay() {
    // Use real vocabulary, not the tone-drill examples.
    var pool = all.filter(function (v) { return v.lessonId !== "tones-jyutping"; });
    if (!pool.length) pool = all;
    if (!pool.length) return;
    // Deterministic: same word for the whole day, changes each day.
    var now = new Date();
    var dayNumber = Math.floor(
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / window.Store.DAY
    );
    var word = pool[dayNumber % pool.length];

    setText("wotd-char", word.hanzi);
    setText("wotd-jyutping", word.jyutping);
    setText("wotd-meaning", word.english);
    setText("wotd-from", "from “" + word.lessonTitle + "” · tap to browse vocabulary →");

    var card = document.getElementById("wotd-card");
    if (card) card.setAttribute("href", "vocabulary.html");

    var audio = document.getElementById("wotd-audio");
    if (audio) audio.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.speakCantonese) window.speakCantonese(word.hanzi);
    });
  }

  function set(key, val) {
    var el = document.querySelector('[data-stat="' + key + '"]');
    if (el) el.textContent = val;
  }
  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }
})();
