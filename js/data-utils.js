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

  // Word-bank words (the user's saved CantoneseClass101 export), shaped like vocab.
  function getWordbank() {
    return (window.WORDBANK || []).map(function (v) {
      return {
        id: v.hanzi, hanzi: v.hanzi, jyutping: v.jyutping,
        english: v.english, topic: v.topic || "General", source: "wordbank"
      };
    });
  }

  window.Vocab = { all: getAllVocab, wordbank: getWordbank };

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

  function reset() { var d = load(); save({ srs: {}, fcMode: d.fcMode, deck: d.deck, practice: d.practice }); }

  function getFcMode() { return load().fcMode || null; }
  function setFcMode(m) { var d = load(); d.fcMode = m; save(d); }

  // ---------- Lesson completion ----------
  function markLessonComplete(id) {
    var d = load(); d.completed = d.completed || {}; d.completed[id] = true; save(d);
  }
  function unmarkLessonComplete(id) {
    var d = load(); if (d.completed) { delete d.completed[id]; save(d); }
  }
  function isLessonComplete(id) { return !!(load().completed || {})[id]; }
  function completedCount() { return Object.keys(load().completed || {}).length; }

  function setLastLesson(id) { var d = load(); d.lastLesson = id; save(d); }
  function getLastLesson() { return load().lastLesson || null; }

  // ---------- Daily streak ----------
  function dateStr(d) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function todayStr() { return dateStr(new Date()); }
  function yesterdayStr() { var y = new Date(); y.setDate(y.getDate() - 1); return dateStr(y); }

  // Call when the user does something meaningful (study/lesson/review).
  function recordActivity() {
    var d = load();
    var today = todayStr();
    if (d.lastActive !== today) {
      d.streak = (d.lastActive === yesterdayStr()) ? (d.streak || 0) + 1 : 1;
      d.lastActive = today;
      save(d);
    }
    return d.streak || 0;
  }
  // Read streak without recording; returns 0 if it has lapsed.
  function getStreak() {
    var d = load();
    if (!d.lastActive) return 0;
    if (d.lastActive === todayStr() || d.lastActive === yesterdayStr()) return d.streak || 0;
    return 0;
  }

  // ---------- Flashcard deck (words the user chose to review) ----------
  function addToDeck(word) {
    if (!word || !word.hanzi) return;
    var d = load(); d.deck = d.deck || {};
    d.deck[word.hanzi] = {
      hanzi: word.hanzi, jyutping: word.jyutping, english: word.english,
      source: word.source || "lesson",
      lessonId: word.lessonId, lessonTitle: word.lessonTitle
    };
    save(d);
  }
  function removeFromDeck(id) { var d = load(); if (d.deck) { delete d.deck[id]; save(d); } }
  function inDeck(id) { return !!(load().deck || {})[id]; }
  function deckList() { var deck = load().deck || {}; return Object.keys(deck).map(function (k) { return deck[k]; }); }
  function deckCount() { return Object.keys(load().deck || {}).length; }

  // ---------- Per-lesson practice progress ----------
  function recordPractice(lessonId, pct) {
    if (!lessonId) return null;
    var d = load();
    d.practice = d.practice || {};
    var p = d.practice[lessonId] || { best: 0, times: 0, last: 0 };
    p.best = Math.max(p.best || 0, Math.round(pct || 0));
    p.times = (p.times || 0) + 1;
    p.last = Date.now();
    d.practice[lessonId] = p;
    save(d);
    recordActivity();
    return p;
  }
  function getPracticeStats(lessonId) { return (load().practice || {})[lessonId] || null; }

  window.Store = {
    getState: getState,
    rate: rate,
    dueCards: dueCards,
    newCards: newCards,
    knownCount: knownCount,
    reset: reset,
    getFcMode: getFcMode,
    setFcMode: setFcMode,
    markLessonComplete: markLessonComplete,
    unmarkLessonComplete: unmarkLessonComplete,
    isLessonComplete: isLessonComplete,
    completedCount: completedCount,
    setLastLesson: setLastLesson,
    getLastLesson: getLastLesson,
    recordActivity: recordActivity,
    getStreak: getStreak,
    DAY: DAY,
    addToDeck: addToDeck,
    removeFromDeck: removeFromDeck,
    inDeck: inDeck,
    deckList: deckList,
    deckCount: deckCount,
    recordPractice: recordPractice,
    getPracticeStats: getPracticeStats
  };
})();
