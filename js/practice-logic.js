/* ===========================================================
   Cantonese Learning — practice activity logic (pure, no DOM).
   Exposed as window.PracticeLogic so it can be unit-tested in
   Node (scripts/test_practice.js). The UI controller
   (js/practice.js) builds on top of this.
   =========================================================== */
(function () {
  "use strict";

  function tokenizeJyutping(s) {
    return String(s == null ? "" : s).trim().split(/\s+/).filter(Boolean);
  }
  function isSingleSyllable(jyutping) {
    return /^[a-z]+[1-6]$/i.test(String(jyutping == null ? "" : jyutping).trim());
  }
  function toneOf(jyutping) {
    if (!isSingleSyllable(jyutping)) return null;
    return +String(jyutping).trim().slice(-1);
  }
  function syllableKey(jyutping) {
    return String(jyutping == null ? "" : jyutping).trim().toLowerCase().replace(/[1-6]$/, "");
  }
  function shuffle(a) {
    var arr = (a || []).slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function pickDistractors(answer, field, pool, n) {
    var seen = {}; seen[answer] = true;
    var out = [];
    var shuffled = shuffle(pool || []);
    for (var i = 0; i < shuffled.length && out.length < n; i++) {
      var val = shuffled[i] && shuffled[i][field];
      if (val == null || seen[val]) continue;
      seen[val] = true; out.push(val);
    }
    return out;
  }
  function optionsWith(answer, field, pool, n) {
    return shuffle([answer].concat(pickDistractors(answer, field, pool, n)));
  }
  function mineTonePairs(words) {
    var groups = {};
    (words || []).forEach(function (w) {
      if (!w || !isSingleSyllable(w.jyutping)) return;
      var key = syllableKey(w.jyutping);
      (groups[key] = groups[key] || []).push({ hanzi: w.hanzi, jyutping: w.jyutping, tone: toneOf(w.jyutping) });
    });
    var pairs = {};
    Object.keys(groups).forEach(function (k) {
      var tones = {};
      groups[k].forEach(function (e) { tones[e.tone] = true; });
      if (Object.keys(tones).length >= 2) pairs[k] = groups[k];
    });
    return pairs;
  }

  function hasText(o, f) { return o && typeof o[f] === "string" && o[f].length > 0; }

  function buildSession(lesson, opts) {
    opts = opts || {};
    var cap = opts.cap || 14;
    var hasAudio = opts.hasAudio || function () { return false; };
    var pool = (opts.pool || []).slice();
    var tonePairs = opts.tonePairs || {};

    var words = (lesson.vocab || []).filter(function (v) {
      return hasText(v, "hanzi") && hasText(v, "english") && hasText(v, "jyutping");
    });
    var distractors = words.concat(pool);
    var sentences = (lesson.examples || []).concat(lesson.dialogue || []).filter(function (s) {
      return hasText(s, "hanzi") && hasText(s, "english") && hasText(s, "jyutping");
    });

    var recall = shuffle(words).map(function (w) { return { type: "recall", word: w }; });
    var shadow = shuffle(words).map(function (w) { return { type: "shadow", word: w }; });

    var listening = [];
    shuffle(words).forEach(function (w) {
      var options = optionsWith(w.english, "english", distractors, 3);
      if (options.length >= 2) listening.push({ type: "listening", word: w, options: options });
    });

    var tone = shuffle(words.filter(function (w) {
      return isSingleSyllable(w.jyutping) && hasAudio(w.hanzi);
    })).map(function (w) {
      var key = syllableKey(w.jyutping), mine = toneOf(w.jyutping), neighbour = null;
      (tonePairs[key] || []).forEach(function (e) {
        if (!neighbour && e.tone !== mine && e.hanzi !== w.hanzi) neighbour = e;
      });
      return { type: "tone", word: w, tone: mine, neighbour: neighbour };
    });

    var cloze = [], reorder = [];
    shuffle(sentences).forEach(function (s) {
      var tokens = tokenizeJyutping(s.jyutping);
      if (tokens.length >= 3 && tokens.length <= 8) reorder.push({ type: "reorder", sentence: s, tokens: tokens });
      var target = null;
      for (var i = 0; i < words.length; i++) {
        if (words[i].hanzi && s.hanzi.indexOf(words[i].hanzi) > -1) { target = words[i]; break; }
      }
      if (target) {
        var options = optionsWith(target.hanzi, "hanzi", distractors, 3);
        if (options.length >= 2) cloze.push({ type: "cloze", sentence: s, target: target, options: options });
      }
    });

    var matching = [];
    if (words.length >= 3) {
      matching.push({ type: "matching", words: shuffle(words).slice(0, Math.min(6, words.length)) });
    }

    var buckets = [recall, listening, cloze, reorder, tone, matching, shadow];
    var order = [], added = true;
    while (added && order.length < cap) {
      added = false;
      for (var b = 0; b < buckets.length && order.length < cap; b++) {
        if (buckets[b].length) { order.push(buckets[b].shift()); added = true; }
      }
    }
    return order;
  }

  function scoreSession(results) {
    var correct = 0, total = 0, missed = [], seen = {};
    (results || []).forEach(function (r) {
      if (r.correct === true || r.correct === false) {
        total++;
        if (r.correct === true) correct++;
        else if (r.word && r.word.hanzi && !seen[r.word.hanzi]) { seen[r.word.hanzi] = true; missed.push(r.word); }
      }
    });
    return { correct: correct, total: total, pct: total ? Math.round((correct / total) * 100) : 0, missedWords: missed };
  }

  window.PracticeLogic = {
    tokenizeJyutping: tokenizeJyutping,
    isSingleSyllable: isSingleSyllable,
    toneOf: toneOf,
    syllableKey: syllableKey,
    shuffle: shuffle,
    pickDistractors: pickDistractors,
    optionsWith: optionsWith,
    mineTonePairs: mineTonePairs,
    buildSession: buildSession,
    scoreSession: scoreSession
  };
})();
