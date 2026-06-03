# Per-Lesson Interactive Practice — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "▶ Practice this lesson" button to every lesson that opens a `practice.html?id=<lesson>` page and runs an interleaved session of seven auto-generated activities (recall, listening, matching, cloze, jyutping reordering, tone discrimination, shadowing), with per-lesson progress and opt-in add-to-deck.

**Architecture:** Pure pedagogy logic in `window.PracticeLogic` (`js/practice-logic.js`, Node-unit-tested like `data-utils.js`). A thin UI controller `js/practice.js` builds a session from a lesson's existing data and renders it. Progress lives in `window.Store` (`data.practice[lessonId]`). No backend, no build step, no new audio — reuses `window.speakCantonese` and `window.AUDIO_MANIFEST`.

**Tech Stack:** Static site — vanilla ES5 JS (IIFE + `window.*` globals), plain HTML/CSS, localStorage. Tests run with `node` using the `global.window = {}` + `eval(fs.readFileSync(...))` harness from `scripts/test_deck.js`.

**Conventions for every commit in this plan:**
- Commits must be **signed** (controller already configured: `commit.gpgsign=true`, `gpg.ssh.allowedSignersFile` set so the hook accepts the signature) and authored as `Claude <noreply@anthropic.com>`.
- Every commit message must end with a blank line then the trailer:
  `https://claude.ai/code/session_01ThxzpE2pDhg6bLW1bE1j41`
- Do **not** put any model identifier in commits or code.

**Spec:** `docs/superpowers/specs/2026-06-03-lesson-practice-activities-design.md`

---

## File Structure

**New files**
- `js/practice-logic.js` — pure, DOM-free logic; `window.PracticeLogic`. One responsibility: turn lesson data into a scored session.
- `js/practice.js` — UI controller; reads `?id=`, renders/wires each activity, writes progress. One responsibility: run the session in the DOM.
- `practice.html` — the practice page (mirrors `flashcards.html`); `#practice-page` mount + script includes.
- `scripts/test_practice.js` — Node tests for `practice-logic.js`.
- `scripts/test_practice_store.js` — Node tests for the new Store practice functions.

**Modified files**
- `js/data-utils.js` — add `recordPractice`, `getPracticeStats`; preserve `practice` in `reset()`.
- `js/lesson.js` — add the Practice section/button + stats line.
- `js/lessons.js` — practice badge on each lesson row.
- `js/dashboard.js` — populate a new "Lessons practised" stat.
- `index.html` — add the "Lessons practised" stat tile.
- `css/style.css` — practice screen styles.

---

## Task 1: Store — per-lesson practice progress

**Files:**
- Modify: `js/data-utils.js` (add functions near the deck section ~line 168-207; update `reset()` ~line 124)
- Test: `scripts/test_practice_store.js` (create)

- [ ] **Step 1: Write the failing test**

Create `scripts/test_practice_store.js`:

```js
/* Node test for Store per-lesson practice progress.  Run: node scripts/test_practice_store.js */
var fs = require("fs");
var store = {};
global.localStorage = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
  setItem: function (k, v) { store[k] = String(v); },
};
global.window = {};
eval(fs.readFileSync(__dirname + "/../js/data-utils.js", "utf8"));
var S = global.window.Store;

var failed = 0;
function check(name, cond) { console.log((cond ? "PASS " : "FAIL ") + name); if (!cond) failed++; }

check("no stats initially", S.getPracticeStats("greetings") === null);
S.recordPractice("greetings", 80);
check("first record: best 80, times 1", S.getPracticeStats("greetings").best === 80 && S.getPracticeStats("greetings").times === 1);
S.recordPractice("greetings", 60);
check("lower score keeps best, bumps times", S.getPracticeStats("greetings").best === 80 && S.getPracticeStats("greetings").times === 2);
S.recordPractice("greetings", 90);
check("higher score raises best", S.getPracticeStats("greetings").best === 90 && S.getPracticeStats("greetings").times === 3);
S.recordPractice("greetings", 83.4);
check("pct is rounded", S.getPracticeStats("greetings").best === 90 && S.getPracticeStats("greetings").times === 4);
S.rate("詩", "good");
S.reset();
check("reset clears srs", S.getState("詩") === null);
check("reset preserves practice", S.getPracticeStats("greetings") && S.getPracticeStats("greetings").best === 90);

console.log(failed ? ("\n" + failed + " failed") : "\nAll passed");
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test_practice_store.js`
Expected: FAIL — `TypeError: S.getPracticeStats is not a function` (or assertion failures).

- [ ] **Step 3: Add the Store functions**

In `js/data-utils.js`, change `reset` (line ~124) from:

```js
  function reset() { var d = load(); save({ srs: {}, fcMode: d.fcMode, deck: d.deck }); }
```

to:

```js
  function reset() { var d = load(); save({ srs: {}, fcMode: d.fcMode, deck: d.deck, practice: d.practice }); }
```

Then add these functions right before the `window.Store = {` block (after `deckCount`, ~line 182):

```js
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
```

Add both to the `window.Store = { ... }` export object (after `deckCount: deckCount`):

```js
    deckCount: deckCount,
    recordPractice: recordPractice,
    getPracticeStats: getPracticeStats
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test_practice_store.js`
Expected: `All passed`

- [ ] **Step 5: Confirm existing Store tests still pass**

Run: `node scripts/test_deck.js`
Expected: `All passed`

- [ ] **Step 6: Commit** (remember the signed commit + trailer)

```bash
git add js/data-utils.js scripts/test_practice_store.js
git commit -m "Store: per-lesson practice progress (best/times/last)"
```

---

## Task 2: practice-logic.js — pure session logic + tests

**Files:**
- Create: `js/practice-logic.js`
- Test: `scripts/test_practice.js` (create)

- [ ] **Step 1: Write the failing test**

Create `scripts/test_practice.js`:

```js
/* Node tests for window.PracticeLogic.  Run: node scripts/test_practice.js */
var fs = require("fs");
global.window = {};
eval(fs.readFileSync(__dirname + "/../js/practice-logic.js", "utf8"));
var P = global.window.PracticeLogic;

var failed = 0;
function check(name, cond) { console.log((cond ? "PASS " : "FAIL ") + name); if (!cond) failed++; }
function sameSet(a, b) { return a.slice().sort().join("|") === b.slice().sort().join("|"); }

// --- primitives ---
check("tokenize splits on spaces", sameSet(P.tokenizeJyutping("nei5 hou2 maa3"), ["nei5", "hou2", "maa3"]));
check("tokenize empty -> []", P.tokenizeJyutping("   ").length === 0);
check("isSingleSyllable true", P.isSingleSyllable("si1") === true);
check("isSingleSyllable false (space)", P.isSingleSyllable("nei5 hou2") === false);
check("isSingleSyllable false (empty)", P.isSingleSyllable("") === false);
check("toneOf single", P.toneOf("maa5") === 5);
check("toneOf multi -> null", P.toneOf("nei5 hou2") === null);
check("syllableKey strips tone + lowercases", P.syllableKey("MAA5") === "maa");

// --- shuffle ---
var arr = [1, 2, 3, 4, 5];
var sh = P.shuffle(arr);
check("shuffle keeps elements", sameSet(sh.map(String), arr.map(String)) && sh.length === 5);
check("shuffle does not mutate input", arr.join(",") === "1,2,3,4,5");

// --- distractors / options ---
var pool = [{ english: "hello" }, { english: "bye" }, { english: "yes" }, { english: "bye" }];
var ds = P.pickDistractors("hello", "english", pool, 2);
check("distractors count", ds.length === 2);
check("distractors exclude answer", ds.indexOf("hello") === -1);
check("distractors unique", ds.length === (ds[0] === ds[1] ? 1 : 2) && ds[0] !== ds[1]);
check("distractors degrade gracefully", P.pickDistractors("hello", "english", [{ english: "hello" }], 3).length === 0);
var opts = P.optionsWith("hello", "english", pool, 3);
check("optionsWith includes answer", opts.indexOf("hello") > -1);
check("optionsWith size <= n+1", opts.length <= 4 && opts.length >= 2);

// --- tone pairs ---
var tp = P.mineTonePairs([
  { hanzi: "詩", jyutping: "si1" }, { hanzi: "史", jyutping: "si2" },
  { hanzi: "媽", jyutping: "maa1" }, { hanzi: "你好", jyutping: "nei5 hou2" }
]);
check("tone pair found for si", !!tp.si && tp.si.length === 2);
check("no pair for single-tone maa", !tp.maa);
check("multi-syllable ignored", !tp["nei hou"]);
var tp2 = P.mineTonePairs([{ hanzi: "媽", jyutping: "maa1" }, { hanzi: "馬", jyutping: "maa5" }]);
check("maa1/maa5 pair found", !!tp2.maa && tp2.maa.length === 2);

// --- buildSession ---
var lesson = {
  id: "t",
  vocab: [
    { hanzi: "詩", jyutping: "si1", english: "poem" },
    { hanzi: "你好", jyutping: "nei5 hou2", english: "hello" },
    { hanzi: "多謝", jyutping: "do1 ze6", english: "thank you" },
    { hanzi: "早晨", jyutping: "zou2 san4", english: "good morning" }
  ],
  examples: [{ hanzi: "你好嗎？", jyutping: "nei5 hou2 maa3", english: "How are you?" }]
};
function typesOf(s) { return s.map(function (t) { return t.type; }); }
var full = P.buildSession(lesson, { cap: 100, pool: [], hasAudio: function (h) { return h === "詩"; }, tonePairs: P.mineTonePairs(lesson.vocab) });
var types = typesOf(full);
["recall", "listening", "matching", "cloze", "reorder", "tone", "shadow"].forEach(function (t) {
  check("session includes " + t, types.indexOf(t) > -1);
});
var capped = P.buildSession(lesson, { cap: 3, pool: [], hasAudio: function () { return false; }, tonePairs: {} });
check("cap respected", capped.length === 3);
check("interleaved (first two differ)", capped[0].type !== capped[1].type);
var noAudio = P.buildSession(lesson, { cap: 100, pool: [], hasAudio: function () { return false; }, tonePairs: {} });
check("no tone tasks without audio", typesOf(noAudio).indexOf("tone") === -1);
var cloze = full.filter(function (t) { return t.type === "cloze"; })[0];
check("cloze target appears in sentence", cloze && cloze.sentence.hanzi.indexOf(cloze.target.hanzi) > -1);
var reorder = full.filter(function (t) { return t.type === "reorder"; })[0];
check("reorder has >=3 tokens", reorder && reorder.tokens.length >= 3);
var tiny = P.buildSession({ id: "x", vocab: [{ hanzi: "狗", jyutping: "gau2", english: "dog" }], examples: [] },
  { cap: 100, pool: [], hasAudio: function () { return false; }, tonePairs: {} });
check("tiny lesson still yields tasks", tiny.length >= 1);
check("tiny lesson has no cloze/reorder/matching", ["cloze", "reorder", "matching"].every(function (t) { return typesOf(tiny).indexOf(t) === -1; }));

// --- scoreSession ---
var W1 = { hanzi: "A" }, W2 = { hanzi: "B" };
var sc = P.scoreSession([
  { type: "listening", correct: true, word: W1 },
  { type: "cloze", correct: false, word: W2 },
  { type: "shadow", correct: null, word: null },
  { type: "tone", correct: false, word: W2 }
]);
check("score total excludes unscored", sc.total === 3);
check("score correct count", sc.correct === 1);
check("score pct rounded", sc.pct === 33);
check("missed words deduped", sc.missedWords.length === 1 && sc.missedWords[0].hanzi === "B");

console.log(failed ? ("\n" + failed + " failed") : "\nAll passed");
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test_practice.js`
Expected: FAIL — `TypeError: Cannot read properties of undefined` (PracticeLogic not defined yet).

- [ ] **Step 3: Write the implementation**

Create `js/practice-logic.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test_practice.js`
Expected: `All passed`

- [ ] **Step 5: Syntax-check the module**

Run: `node --check js/practice-logic.js`
Expected: no output (exit 0).

- [ ] **Step 6: Commit**

```bash
git add js/practice-logic.js scripts/test_practice.js
git commit -m "Add pure practice-session logic (PracticeLogic) with tests"
```

---

## Task 3: practice.js — the session UI controller

**Files:**
- Create: `js/practice.js`

There is no headless DOM test; verify with `node --check` and the manual smoke test in Task 9.

- [ ] **Step 1: Write the controller**

Create `js/practice.js`:

```js
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
    var reveal = "Tones: 1 high · 2 mid-rising · 3 mid · 4 low-falling · 5 low-rising · 6 low";
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
```

- [ ] **Step 2: Syntax-check**

Run: `node --check js/practice.js`
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add js/practice.js
git commit -m "Add practice session UI controller"
```

---

## Task 4: practice.html page

**Files:**
- Create: `practice.html`

- [ ] **Step 1: Create the page**

Create `practice.html` (mirrors `flashcards.html`; "Lessons" nav active; includes `data/wordbank.js` + `js/practice-logic.js` + `js/practice.js`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cantonese Learning — Practice</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="site-header">
    <div class="container nav-inner">
      <a class="brand" href="index.html">
        <span class="brand-mark">粵</span>
        <span class="brand-text">Cantonese<span class="brand-text-accent">Learning</span></span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        <a href="index.html">Dashboard</a>
        <a href="lessons.html" class="active">Lessons</a>
        <a href="stories.html">Stories</a>
        <a href="vocabulary.html">Vocabulary</a>
        <a href="wordbank.html">Word Bank</a>
        <a href="flashcards.html">Flashcards</a>
      </nav>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main class="container main-content lesson-page">
    <div id="practice-page"><p class="muted">Loading practice…</p></div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>Made for Robbie · Cantonese Learning · <span id="year"></span></p>
    </div>
  </footer>

  <script src="data/lessons.js"></script>
  <script src="data/wordbank.js"></script>
  <script src="audio/manifest.js"></script>
  <script src="js/data-utils.js"></script>
  <script src="js/main.js"></script>
  <script src="js/practice-logic.js"></script>
  <script src="js/practice.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify includes are present**

Run: `grep -c "practice-logic.js\|practice.js\|data/wordbank.js" practice.html`
Expected: `3`

- [ ] **Step 3: Commit**

```bash
git add practice.html
git commit -m "Add practice page"
```

---

## Task 5: Wire the Practice button into the lesson page

**Files:**
- Modify: `js/lesson.js` (insert before the mark-complete bar, ~line 125)

- [ ] **Step 1: Add the Practice section**

In `js/lesson.js`, find this line (~125):

```js
  // ----- Mark-complete bar -----
  html += '<div class="complete-bar" id="complete-bar"></div>';
```

Insert immediately **before** it:

```js
  // ----- Practice -----
  var pstats = window.Store ? window.Store.getPracticeStats(lesson.id) : null;
  html += '<section class="lesson-section lesson-practice">';
  html += '<h2 class="lesson-section-title">Practice</h2>';
  html += '<p class="muted">Active recall, listening, matching, cloze, tone and speaking drills built from this lesson.</p>';
  html += '<a class="btn btn-primary" href="practice.html?id=' + encodeURIComponent(lesson.id) + '">▶ Practice this lesson</a>';
  if (pstats) html += '<p class="practice-stats muted">Best ' + pstats.best + '% · practised ' + pstats.times + '×</p>';
  html += '</section>';

```

- [ ] **Step 2: Syntax-check**

Run: `node --check js/lesson.js`
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add js/lesson.js
git commit -m "Add Practice section to the lesson page"
```

---

## Task 6: Practice badge on the lessons list

**Files:**
- Modify: `js/lessons.js` (~line 35-47)

- [ ] **Step 1: Add the badge**

In `js/lessons.js`, find:

```js
      var done = window.Store && window.Store.isLessonComplete(l.id);
      html +=
```

Replace those two lines with:

```js
      var done = window.Store && window.Store.isLessonComplete(l.id);
      var pstats = window.Store ? window.Store.getPracticeStats(l.id) : null;
      html +=
```

Then, in the same template, find the closing of the meta span:

```js
          '<span class="lesson-meta">' +
            (done ? 'Completed' : (l.minutes ? l.minutes + ' min' : '')) +
          '</span>' +
          '<span class="lesson-go">→</span>' +
```

Replace with (adds the badge between meta and the arrow):

```js
          '<span class="lesson-meta">' +
            (done ? 'Completed' : (l.minutes ? l.minutes + ' min' : '')) +
          '</span>' +
          (pstats ? '<span class="lesson-practice-badge" title="Best practice score">🎯 ' + pstats.best + '%</span>' : '') +
          '<span class="lesson-go">→</span>' +
```

- [ ] **Step 2: Syntax-check**

Run: `node --check js/lessons.js`
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add js/lessons.js
git commit -m "Show practice score badge on the lessons list"
```

---

## Task 7: Dashboard "Lessons practised" stat

**Files:**
- Modify: `index.html` (stats-row, ~line 60-63)
- Modify: `js/dashboard.js` (~line 24-27)

- [ ] **Step 1: Add the stat tile**

In `index.html`, find the last stat card:

```html
      <div class="stat-card">
        <span class="stat-num" data-stat="cards-due">—</span>
        <span class="stat-label">Cards due today</span>
      </div>
```

Insert immediately **after** it (still inside `.stats-row`):

```html
      <div class="stat-card">
        <span class="stat-num" data-stat="lessons-practised">0</span>
        <span class="stat-label">Lessons practised</span>
      </div>
```

- [ ] **Step 2: Populate it in dashboard.js**

In `js/dashboard.js`, find:

```js
  set("cards-due", due > 0 ? due : (fresh > 0 ? fresh + " new" : "0"));
  set("lessons-done", doneLessons);
```

Insert after those lines:

```js
  set("lessons-practised", lessons.filter(function (l) { return window.Store.getPracticeStats(l.id); }).length);
```

(`lessons` is already defined at the top of `dashboard.js` as the sorted `window.LESSONS`.)

- [ ] **Step 3: Syntax-check**

Run: `node --check js/dashboard.js`
Expected: no output (exit 0).

- [ ] **Step 4: Commit**

```bash
git add index.html js/dashboard.js
git commit -m "Dashboard: show lessons-practised count"
```

---

## Task 8: Practice screen styles

**Files:**
- Modify: `css/style.css` (append at end)

- [ ] **Step 1: Append the styles**

Append to `css/style.css`:

```css
/* ===== Per-lesson practice ===== */
.lesson-practice .btn { margin-top: 6px; }
.practice-stats { margin-top: 10px; }
.lesson-practice-badge { color: var(--red); font-weight: 600; font-size: .82rem; margin-right: 10px; white-space: nowrap; }

.practice { max-width: 640px; margin: 0 auto; }
.practice .back-link { display: inline-block; margin-bottom: 14px; }
.pr-card { background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  box-shadow: var(--shadow-sm); padding: 22px; text-align: center; }
.pr-instr { margin: 0 0 14px; }
.pr-prompt { font-size: 1.6rem; font-weight: 700; margin: 6px 0 18px; }
.pr-prompt.english { color: var(--ink); }
.pr-reveal-answer { margin: 8px 0 16px; }
.pr-reveal-answer .jyutping { display: block; color: var(--red); font-size: 1.3rem; font-weight: 600; }
.pr-reveal-answer .hanzi { display: block; font-size: 2rem; margin: 4px 0; }
.pr-selfgrade { margin-top: 12px; }

.pr-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
.pr-option { padding: 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--paper);
  font: inherit; font-size: 1.05rem; cursor: pointer; transition: transform .08s, border-color .15s, background .15s; }
.pr-option:hover:not(:disabled) { border-color: var(--red); transform: translateY(-1px); }
.pr-option:disabled { cursor: default; }
.pr-option.correct { background: #e6f5ea; border-color: #2e7d32; color: #1b5e20; }
.pr-option.wrong { background: #fdecec; border-color: var(--red); color: var(--red-dark); }

.pr-bigaudio { font-size: 1.6rem; width: 64px; height: 64px; border-radius: 50%; margin: 4px auto 6px; display: block; }
.pr-sentence { font-size: 1.7rem; margin: 10px 0 6px; }
.pr-sentence-en { margin: 0 0 8px; }
.pr-blank { display: inline-block; min-width: 1.6em; border-bottom: 3px solid var(--red); margin: 0 2px; }

.pr-tone-syllable { display: inline-block; color: var(--red); font-size: 1.5rem; font-weight: 700; margin: 4px 0; }
.pr-tone-row { grid-template-columns: repeat(6, 1fr); }
.pr-tone { font-size: 1.25rem; font-weight: 700; padding: 14px 0; }

.pr-bank, .pr-build { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.pr-build { min-height: 48px; padding: 8px; border: 1px dashed var(--line); border-radius: 12px; margin-bottom: 12px; }
.pr-chip { padding: 10px 14px; border: 1px solid var(--line); border-radius: 999px; background: var(--paper);
  font: inherit; font-size: 1.05rem; cursor: pointer; }
.pr-chip:hover:not(:disabled) { border-color: var(--red); }
.pr-chip.used { visibility: hidden; }
.pr-chip.selected { background: var(--red); color: #fff; border-color: var(--red); }
.pr-chip.matched { background: #e6f5ea; border-color: #2e7d32; color: #1b5e20; cursor: default; }
.pr-chip.wrong { background: #fdecec; border-color: var(--red); }

.pr-match { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pr-col { display: flex; flex-direction: column; gap: 8px; }
.pr-col .pr-chip { width: 100%; }

.pr-feedback { min-height: 24px; margin: 14px 0 6px; font-weight: 600; }
.pr-feedback.ok { color: #2e7d32; }
.pr-feedback.no { color: var(--red); }
.pr-feedback.neutral { color: var(--muted); font-weight: 500; }
.pr-next { display: block; width: 100%; margin-top: 6px; }

.pr-results { text-align: center; }
.pr-missed-title { margin: 22px 0 10px; }
.pr-results-cta { margin-top: 20px; }
```

- [ ] **Step 2: Verify the file still has balanced braces (quick sanity)**

Run: `node -e "var c=require('fs').readFileSync('css/style.css','utf8');var o=(c.match(/{/g)||[]).length,k=(c.match(/}/g)||[]).length;console.log(o===k?'braces OK '+o:'MISMATCH '+o+' vs '+k)"`
Expected: `braces OK <n>`

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Style the practice screens"
```

---

## Task 9: Full verification + manual smoke test

**Files:** none (verification only)

- [ ] **Step 1: Run all Node tests**

Run: `node scripts/test_practice.js && node scripts/test_practice_store.js && node scripts/test_deck.js`
Expected: three `All passed`.

- [ ] **Step 2: Run the Python tests (must still pass)**

Run: `python3 scripts/test_build_wordbank.py && python3 scripts/test_audio_text.py`
Expected: both report all tests passing.

- [ ] **Step 3: Syntax-check every touched JS file**

Run: `for f in js/practice-logic.js js/practice.js js/data-utils.js js/lesson.js js/lessons.js js/dashboard.js; do node --check "$f" && echo "ok $f"; done`
Expected: `ok` for all six.

- [ ] **Step 4: Manual smoke test (cannot run in the sandbox — record results)**

This static site has no headless UI test. When opened in a browser (or after the user opens it), verify:
1. Open `lesson.html?id=greetings` → a "Practice" section with "▶ Practice this lesson" appears above Mark-complete.
2. Click it → `practice.html?id=greetings` loads a session; the progress bar and counter show.
3. Step through a session and confirm each activity type works: recall (reveal + self-grade), listening (audio + choose), matching (tap pairs), cloze (blank + choose), reorder (tap to build + check), tone (audio + pick 1–6), shadow (reveal + play).
4. Results screen shows score; "Words to review" lists missed words; "+ Add to deck" adds one and shows "✓ In deck"; "Practice again" restarts; "Back to lesson" returns.
5. Reopen the lesson page → "Best X% · practised N×" line shows; lessons list shows the 🎯 badge; dashboard shows "Lessons practised".
6. Open `flashcards.html` → any words added from results are now in the deck.

- [ ] **Step 5: Commit verification note (optional) and finish**

If you keep a progress log, record the test outputs. Otherwise, the implementation is complete once Steps 1-3 pass and the manual checklist is confirmed.

```bash
git status   # should be clean if no further changes
```

---

## Self-Review

**1. Spec coverage:**
- Per-lesson Practice page + button → Tasks 3, 4, 5. ✅
- Seven activities interleaved, ~12–16 tasks → Task 2 (`buildSession`, cap 14) + Task 3 renderers. ✅
- Tap/select only → all renderers use buttons; no text inputs. ✅
- Per-lesson progress (best/times/last) + surfaced on lesson page, lessons list, dashboard → Tasks 1, 5, 6, 7. ✅
- Opt-in add-to-deck on missed words, never auto-add → Task 3 results screen via `Store.addToDeck`. ✅
- Tone-pair mining, "which tone" needs no pairs, MP3-only tone tasks → Task 2 `mineTonePairs` + `buildSession` audio gate; Task 3 `hasAudio`. ✅
- Pure logic isolated + Node tests; thin UI → Tasks 1, 2 tested; Task 3 UI. ✅
- No new audio/content; content enrichment deferred → nothing in plan authors Cantonese or audio. ✅
- Reset preserves practice → Task 1 Step 3. ✅

**2. Placeholder scan:** No "TBD/TODO/handle edge cases". Every code step has complete code; every command has expected output. ✅

**3. Type consistency:** `recordPractice`/`getPracticeStats` names match across Tasks 1, 3, 5, 6, 7. Task object fields (`type`, `word`, `options`, `sentence`, `target`, `tokens`, `tone`, `neighbour`, `words`) defined in `buildSession` (Task 2) and consumed identically in Task 3. `scoreSession` returns `{correct,total,pct,missedWords}` — consumed in Task 3 `renderResults`. CSS classes emitted by Task 3 (`pr-*`) are all defined in Task 8. Stat key `lessons-practised` matches between `index.html` and `dashboard.js` (Task 7). ✅

No gaps found.
