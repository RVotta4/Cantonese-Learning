/* ===========================================================
   Cantonese Learning — shared data + progress engine (Phase 3)

   - Flattens all lesson vocab into one list (window.Vocab)
   - Stores flashcard progress in localStorage (window.Store)
   A lightweight spaced-repetition scheduler keeps the tricky
   words coming back more often. No account or server needed.
   =========================================================== */

(function () {
  "use strict";

  // ---------- Aggregate vocabulary from all lessons ----------
  function getAllVocab() {
    var out = [];
    var seen = {};
    (window.LESSONS || []).forEach(function (lesson) {
      (lesson.vocab || []).forEach(function (v) {
        var id = v.hanzi; // the Cantonese word is the card's identity
        if (seen[id]) return; // dedupe words shared across lessons
        seen[id] = true;
        out.push({
          id: id,
          hanzi: v.hanzi,
          jyutping: v.jyutping,
          english: v.english,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          level: lesson.level
        });
      });
    });
    return out;
  }

  window.Vocab = { all: getAllVocab };

  // ---------- Progress store (localStorage) ----------
  var KEY = "cantoLearning.v1";
  var DAY = 86400000;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { srs: {} };
    } catch (e) {
      return { srs: {} };
    }
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  function getState(id) { return load().srs[id] || null; }

  // Simple SM-2-style scheduler. interval is in days.
  function schedule(card, rating) {
    var now = Date.now();
    card = card || { ease: 2.3, interval: 0, reps: 0, lapses: 0 };
    if (rating === "again") {
      card.reps = 0;
      card.lapses = (card.lapses || 0) + 1;
      card.ease = Math.max(1.3, (card.ease || 2.3) - 0.2);
      card.interval = 0;
      card.due = now + 60 * 1000; // see again in ~1 minute
    } else {
      if (rating === "hard") {
        card.ease = Math.max(1.3, (card.ease || 2.3) - 0.15);
        card.interval = card.interval ? card.interval * 1.2 : 1;
      } else if (rating === "easy") {
        card.ease = (card.ease || 2.3) + 0.15;
        card.interval = (card.interval ? card.interval * card.ease : 2) * 1.3;
      } else { // good
        card.interval = card.interval ? card.interval * (card.ease || 2.3) : 1;
      }
      card.reps = (card.reps || 0) + 1;
      card.due = now + Math.max(1, card.interval) * DAY;
    }
    card.last = now;
    return card;
  }

  function rate(id, rating) {
    var data = load();
    data.srs[id] = schedule(data.srs[id], rating);
    save(data);
    return data.srs[id];
  }

  // Cards previously studied and now due for review.
  function dueCards(vocab) {
    var srs = load().srs;
    var now = Date.now();
    return vocab.filter(function (v) {
      var s = srs[v.id];
      return s && s.due <= now;
    });
  }

  // Words never studied yet.
  function newCards(vocab) {
    var srs = load().srs;
    return vocab.filter(function (v) { return !srs[v.id]; });
  }

  // Words considered "learned" (graduated to >= 1 day interval).
  function knownCount(vocab) {
    var srs = load().srs;
    return vocab.reduce(function (n, v) {
      var s = srs[v.id];
      return n + (s && s.interval >= 1 ? 1 : 0);
    }, 0);
  }

  function reset() { save({ srs: {} }); }

  window.Store = {
    getState: getState,
    rate: rate,
    dueCards: dueCards,
    newCards: newCards,
    knownCount: knownCount,
    reset: reset,
    DAY: DAY
  };
})();
