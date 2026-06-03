# Word Bank, Decks, Audio & Stories — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user build their own flashcard deck (review only words they add), make the pre-generated audio slower and tone-2-aware, and add five comprehensible-input stories (from the user's CantoneseClass101 word bank) plus a "podcast breakdown" player.

**Architecture:** Content lives in `data/*.js` files that assign globals (`window.LESSONS`, `window.STORIES`, new `window.WORDBANK`). Page logic is per-page vanilla ES5 JS reading those globals into a mount element. Progress + the new deck live in `localStorage` via `window.Store`. Audio plays through `window.speakCantonese()` (pre-generated MP3 → online TTS → local TTS); MP3s are produced by a GitHub Action running `scripts/generate_audio.py` (`edge-tts`, voice `zh-HK-HiuMaanNeural`). No build step, no runtime dependencies.

**Tech Stack:** HTML5, CSS3, ES5 vanilla JS, Python 3 (`edge-tts`) for audio, GitHub Actions. Tests: Python assert-runner scripts (`python3 scripts/test_*.py`, matching `scripts/test_extract.py`) for pure Python logic; a dependency-free Node script (`node scripts/test_*.js`, Node 22 available) for the pure `Store` deck logic; documented manual browser checks for DOM/UI (the project's "just open the file" convention).

**Branch:** `claude/eager-hawking-Kp0X6`. Commit after each task; push at the end (or when asked).

**Spec:** `docs/superpowers/specs/2026-06-03-wordbank-decks-audio-stories-design.md`
**Decoded source data (already committed):** `docs/superpowers/specs/2026-06-03-wordbank-source.json` (321 words), produced by `scripts/decode_wordbank.py`.

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `scripts/build_wordbank.py` | Clean source JSON → `data/wordbank.js`; topic tagging | Create |
| `scripts/test_build_wordbank.py` | Unit tests for cleaning/topic helpers | Create |
| `data/wordbank.js` | `window.WORDBANK` dataset | Create (generated) |
| `scripts/audio_text.py` | `OVERRIDES` + `spoken_text()` (pure, testable) | Create |
| `scripts/test_audio_text.py` | Unit tests for `spoken_text()` | Create |
| `scripts/generate_audio.py` | Slower rate, `spoken_text`, `--force`, read wordbank.js | Modify |
| `.github/workflows/generate-audio.yml` | `force` input + wordbank.js trigger | Modify |
| `js/data-utils.js` | `Vocab.wordbank()` + `Store` deck API | Modify |
| `scripts/test_deck.js` | Node test for `Store` deck API | Create |
| `js/deck-ui.js` | Shared `+ Add / ✓ Added` button (`window.Deck`) | Create |
| `js/wordbank.js` | Word Bank page controller | Create |
| `wordbank.html` | Word Bank page | Create |
| `js/flashcards.js` | Card pool = `Store.deckList()` + empty state | Modify |
| `js/vocab.js` | Add-to-deck button on cards | Modify |
| `js/lesson.js` | Add-to-deck buttons + "Add all" per vocab section | Modify |
| `js/story.js` | Add-to-deck on story words + podcast breakdown player | Modify |
| `js/dashboard.js` | Stats from the deck | Modify |
| `data/stories.js` | +5 custom comprehensible-input stories | Modify |
| `css/style.css` | Deck button, podcast player, Word Bank styles | Append |
| `index.html`, `lessons.html`, `lesson.html`, `stories.html`, `story.html`, `vocabulary.html`, `flashcards.html`, `wordbank.html` | Add "Word Bank" nav link | Modify |

---

## PHASE 1 — Word Bank dataset & page

### Task 1: Word-bank build script + tests → `data/wordbank.js`

The decoded source has 25 "column-flow" artifact rows in two shapes:
- **A — split jyutping:** the row's `english` *starts with* leftover jyutping syllables (e.g. `先生 | sin1 | "saang1 sir/ mister"` → `jyutping "sin1 saang1"`, `english "sir / mister"`).
- **B — absorbed next word:** clean English, then a CJK char + another word's data (e.g. `熱 | jit6 | "hot ⾼ gou1 tall"` → keep `熱/jit6/"hot"`, drop the trailing 高). High-value dropped words are re-added via `EXTRA_WORDS`.

**Files:**
- Create: `scripts/build_wordbank.py`
- Create: `scripts/test_build_wordbank.py`
- Output: `data/wordbank.js`

- [ ] **Step 1: Write `scripts/build_wordbank.py`**

```python
#!/usr/bin/env python3
"""Build data/wordbank.js from the decoded word-bank source JSON.

Cleans the ~25 PDF column-flow artifacts (see plan Task 1), tags each word with
a coarse topic for the Word Bank page, appends a few high-value words that were
absorbed into other rows, and emits `window.WORDBANK = [...]`.

Usage:  python3 scripts/build_wordbank.py
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "docs", "superpowers", "specs", "2026-06-03-wordbank-source.json")
OUT = os.path.join(ROOT, "data", "wordbank.js")

_JYUT_TOKEN = re.compile(r"^((?:[a-z]+[1-6]\s+)+)", re.IGNORECASE)
_CJK = re.compile(r"[一-鿿]")

# Topics: first matching keyword (substring, case-insensitive) wins; else General.
TOPICS = [
    ("Money & banking", ["bank", "money", "cash", "account", "interest", "bill",
        "credit", "discount", "sale", "dollar", "pay", "save", "expensive",
        "cheap", "change", "counter", "receipt", "invoice"]),
    ("Food & dining", ["eat", "drink", "tea", "coffee", "beer", "wine", "juice",
        "water", "restaurant", "meal", "delicious", "tasty", "dessert", "soup",
        "food", "dish", "porridge", "goose", "treat", "hungry", "thirsty"]),
    ("Family & people", ["brother", "sister", "father", "mother", "wife",
        "husband", "family", "boyfriend", "girlfriend", "people", "person",
        "miss", "mister", "sir", "handsome", "pretty girl"]),
    ("Jobs", ["teacher", "student", "doctor", "lawyer", "engineer", "actor",
        "director", "work"]),
    ("Weather", ["rain", "humid", "sunny", "muggy", "stuffy", "weather"]),
    ("Transport & travel", ["taxi", "bus", "subway", "airplane", "car",
        "minibus", "traffic", "arrive", "joyride", "rush"]),
    ("Home & hotel", ["room", "hotel", "apartment", "rent", "lobby", "suite",
        "home", "to book", "check out", "square feet"]),
    ("TV & movies", ["movie", "film", "tv", "television", "concert",
        "advertisement", "commercial", "play", "show", "series", "watch"]),
    ("Colours", ["colour", "color", "blue", "green", "white", "yellow",
        "black", "red"]),
    ("Shopping", ["shopping", "mall", "buy", "sell", "bargain", "tips", "swipe"]),
    ("Communication", ["phone", "message", "internet", "online", "call",
        "dial", "number", "text", "get through"]),
    ("Numbers & time", ["one", "two", "three", "four", "five", "six", "seven",
        "eight", "nine", "ten", "twenty", "thirty", "forty", "fifty", "sixty",
        "seventy", "eighty", "ninety", "hundred", "thousand", "zero", "today",
        "tomorrow", "yesterday", "morning", "night", "evening", "noon",
        "afternoon", "week", "monday", "tuesday", "saturday", "sunday", "hour",
        "when", "now", "late", "early", "time"]),
]

# High-value words absorbed into Pattern-B rows, re-added as their own entries.
EXTRA_WORDS = [
    {"hanzi": "高", "jyutping": "gou1", "english": "high / tall"},
    {"hanzi": "白色", "jyutping": "baak6 sik1", "english": "white"},
    {"hanzi": "黃色", "jyutping": "wong4 sik1", "english": "yellow"},
    {"hanzi": "黑色", "jyutping": "haak1 sik1", "english": "black"},
    {"hanzi": "人", "jyutping": "jan4", "english": "people / person"},
    {"hanzi": "食", "jyutping": "sik6", "english": "to eat"},
    {"hanzi": "水", "jyutping": "seoi2", "english": "water"},
    {"hanzi": "車", "jyutping": "ce1", "english": "car"},
    {"hanzi": "白日", "jyutping": "baak6 jat6", "english": "day"},
    {"hanzi": "走", "jyutping": "zau2", "english": "to leave / to walk"},
    {"hanzi": "八", "jyutping": "baat3", "english": "eight (8)"},
    {"hanzi": "十", "jyutping": "sap6", "english": "ten (10)"},
    {"hanzi": "二十", "jyutping": "ji6 sap6", "english": "twenty (20)"},
    {"hanzi": "八十", "jyutping": "baat3 sap6", "english": "eighty (80)"},
    {"hanzi": "十一", "jyutping": "sap6 jat1", "english": "eleven (11)"},
    {"hanzi": "十二", "jyutping": "sap6 ji6", "english": "twelve (12)"},
]


def fix_row(row):
    """Apply Pattern A/B cleanup to one decoded row; return a clean row."""
    hanzi = row["hanzi"]
    jyut = row["jyutping"].strip()
    eng = row["english"].strip()
    m = _JYUT_TOKEN.match(eng)
    if m:  # Pattern A: leading jyutping syllables belong to the word
        jyut = (jyut + " " + m.group(1).strip()).strip()
        eng = eng[m.end():].strip()
    cjk = _CJK.search(eng)
    if cjk:  # Pattern B: truncate at the absorbed following word
        eng = eng[: cjk.start()].strip()
    eng = re.sub(r"\s*/\s*", " / ", eng)          # tidy "a/ b" -> "a / b"
    eng = re.sub(r"\s+", " ", eng).strip(" ;,/")
    return {"hanzi": hanzi, "jyutping": jyut, "english": eng}


def topic_for(english):
    low = english.lower()
    for name, keys in TOPICS:
        if any(k in low for k in keys):
            return name
    return "General"


def build(rows):
    out, seen = [], set()
    for r in list(rows) + EXTRA_WORDS:
        r = fix_row(r) if "topic" not in r else r
        if not r["hanzi"] or r["hanzi"] in seen:
            continue
        seen.add(r["hanzi"])
        r["topic"] = topic_for(r["english"])
        out.append(r)
    return out


def main():
    rows = json.load(open(SRC, encoding="utf-8"))
    words = build(rows)
    body = json.dumps(words, ensure_ascii=False, indent=2)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* ===========================================================\n")
        f.write("   Cantonese Learning — word bank\n\n")
        f.write("   The user's saved CantoneseClass101 'My Word Bank' export,\n")
        f.write("   decoded and cleaned. Generated by scripts/build_wordbank.py\n")
        f.write("   from docs/superpowers/specs/2026-06-03-wordbank-source.json.\n")
        f.write("   =========================================================== */\n\n")
        f.write("window.WORDBANK = " + body + ";\n")
    print("Wrote %d words -> %s" % (len(words), OUT))


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Write `scripts/test_build_wordbank.py`**

```python
"""Unit tests for scripts/build_wordbank.py.  Run: python3 scripts/test_build_wordbank.py"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_wordbank import fix_row, topic_for, build


def test_pattern_a_moves_leading_jyutping():
    r = fix_row({"hanzi": "先生", "jyutping": "sin1", "english": "saang1 sir/ mister"})
    assert r["jyutping"] == "sin1 saang1", r
    assert r["english"] == "sir / mister", r


def test_pattern_a_multi_token():
    r = fix_row({"hanzi": "冇問題", "jyutping": "mou5", "english": "man6 tai4 no problem"})
    assert r["jyutping"] == "mou5 man6 tai4", r
    assert r["english"] == "no problem", r


def test_pattern_b_truncates_at_cjk():
    r = fix_row({"hanzi": "熱", "jyutping": "jit6", "english": "hot ⾼ gou1 tall"})
    assert r["jyutping"] == "jit6", r
    assert r["english"] == "hot", r


def test_clean_row_unchanged():
    r = fix_row({"hanzi": "現金", "jyutping": "jin6 gam1", "english": "cash"})
    assert r == {"hanzi": "現金", "jyutping": "jin6 gam1", "english": "cash"}, r


def test_topics():
    assert topic_for("bank") == "Money & banking"
    assert topic_for("doctor") == "Jobs"
    assert topic_for("to rain") == "Weather"
    assert topic_for("xyzzy") == "General"


def test_build_dedupes_and_has_no_cjk_in_english():
    rows = [{"hanzi": "熱", "jyutping": "jit6", "english": "hot ⾼ gou1 tall"},
            {"hanzi": "熱", "jyutping": "jit6", "english": "hot"}]
    out = build(rows)
    hanzis = [w["hanzi"] for w in out]
    assert hanzis.count("熱") == 1, hanzis
    assert all(not any("一" <= c <= "鿿" for c in w["english"]) for w in out)
    assert all("topic" in w for w in out)


def _run():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    failed = 0
    for t in tests:
        try:
            t(); print("PASS", t.__name__)
        except Exception as e:
            failed += 1; print("FAIL", t.__name__, "-", e)
    print("\n%d test(s) failed" % failed if failed else "\nAll %d tests passed" % len(tests))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    _run()
```

- [ ] **Step 3: Run tests, expect FAIL then PASS after Step 1 exists**

Run: `python3 scripts/test_build_wordbank.py`
Expected: `All 6 tests passed`

- [ ] **Step 4: Generate `data/wordbank.js`**

Run: `python3 scripts/build_wordbank.py`
Expected: `Wrote 33x words -> .../data/wordbank.js` (≈330). Then verify no CJK leaked into English:
Run: `python3 -c "import re,io; t=open('data/wordbank.js',encoding='utf-8').read(); body=t[t.index('['):t.rindex(']')+1]; import json; d=json.loads(body); print(len(d),'words'); assert all(not re.search(r'[一-鿿]', w['english']) for w in d); print('clean OK')"`
Expected: prints count + `clean OK`.

- [ ] **Step 5: Commit**

```bash
git add scripts/build_wordbank.py scripts/test_build_wordbank.py data/wordbank.js
git commit -m "Add word-bank dataset built from decoded CantoneseClass101 export"
```

### Task 2: `Vocab.wordbank()` accessor

**Files:** Modify `js/data-utils.js` (the `window.Vocab` block near line 36).

- [ ] **Step 1: Add a wordbank accessor.** Replace `window.Vocab = { all: getAllVocab };` with:

```js
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
```

- [ ] **Step 2: Verify (Node smoke test).**

Run:
```bash
node -e "global.window={WORDBANK:[{hanzi:'現金',jyutping:'jin6 gam1',english:'cash',topic:'Money & banking'}]};global.localStorage={getItem:function(){return null},setItem:function(){}};require('./js/data-utils.js');var w=window.Vocab.wordbank();console.log(JSON.stringify(w[0]));"
```
Expected: prints the mapped object with `"source":"wordbank"`.

- [ ] **Step 3: Commit**

```bash
git add js/data-utils.js
git commit -m "Expose Vocab.wordbank() for the word-bank dataset"
```

### Task 3: Word Bank page (`wordbank.html` + `js/wordbank.js`)

Mirror the existing Vocabulary page (`vocabulary.html` / `js/vocab.js`) but read `Vocab.wordbank()`, filter by **topic**, and show a deck button (wired in Task 7).

**Files:** Create `wordbank.html`, `js/wordbank.js`.

- [ ] **Step 1: Create `wordbank.html`** — copy `vocabulary.html`, then: change `<title>`/heading to "Word Bank", set the active nav link to Word Bank, give the mount `id="wordbank-page"`, and load scripts in this order before `</body>`:

```html
  <script src="data/wordbank.js"></script>
  <script src="audio/manifest.js"></script>
  <script src="js/data-utils.js"></script>
  <script src="js/main.js"></script>
  <script src="js/deck-ui.js"></script>
  <script src="js/wordbank.js"></script>
```

(Use the same page shell — header/nav/footer — as `vocabulary.html`. The mount element is `<section id="wordbank-page" class="..."></section>` in place of `vocab-page`.)

- [ ] **Step 2: Create `js/wordbank.js`** (adapted from `js/vocab.js`, topic filter instead of lesson filter):

```js
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
```

- [ ] **Step 3: Manual verify.** `python3 -m http.server 8000`, open `http://localhost:8000/wordbank.html`. Expect: words list, search works, topic dropdown filters, 🔊 plays (online voice fallback is fine pre-regeneration). Deck buttons appear after Task 6/7 (a `window.Deck` guard means no error before then).

- [ ] **Step 4: Commit**

```bash
git add wordbank.html js/wordbank.js
git commit -m "Add Word Bank page (search + topic filter)"
```

### Task 4: Add "Word Bank" to the nav on every page

**Files:** Modify the `<nav class="main-nav">` block in all 8 HTML files.

- [ ] **Step 1: Insert the link** after the `vocabulary.html` link in each file's nav:

```html
        <a href="wordbank.html">Word Bank</a>
```

Files: `index.html`, `lessons.html`, `lesson.html`, `stories.html`, `story.html`, `vocabulary.html`, `flashcards.html`, `wordbank.html` (mark Word Bank `class="active"` only in `wordbank.html`).

- [ ] **Step 2: Verify** every page shows the new link and it points to `wordbank.html`.

Run: `grep -L 'wordbank.html' index.html lessons.html lesson.html stories.html story.html vocabulary.html flashcards.html wordbank.html`
Expected: prints nothing (every file contains the link).

- [ ] **Step 3: Commit**

```bash
git add *.html
git commit -m "Add Word Bank to site navigation"
```

---

## PHASE 2 — Flashcard decks

### Task 5: `Store` deck API (+ Node test)

**Files:** Modify `js/data-utils.js`; Create `scripts/test_deck.js`.

- [ ] **Step 1: Write the failing Node test `scripts/test_deck.js`**

```js
/* Node test for the Store deck API.  Run: node scripts/test_deck.js  */
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

var w = { hanzi: "現金", jyutping: "jin6 gam1", english: "cash", source: "wordbank" };
check("empty deck", S.deckList().length === 0 && S.deckCount() === 0);
S.addToDeck(w);
check("add one", S.deckCount() === 1 && S.inDeck("現金"));
check("stores full object", S.deckList()[0].english === "cash");
S.addToDeck(w);
check("idempotent add", S.deckCount() === 1);
S.removeFromDeck("現金");
check("remove", S.deckCount() === 0 && !S.inDeck("現金"));
S.addToDeck(w);
S.reset();
check("reset keeps deck", S.deckCount() === 1);

console.log(failed ? ("\n" + failed + " failed") : "\nAll passed");
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run it, expect FAIL** (`S.addToDeck is not a function`).

Run: `node scripts/test_deck.js`
Expected: failures (deck API not implemented yet).

- [ ] **Step 3: Implement the deck API in `js/data-utils.js`.** Add these functions before the `window.Store = {` literal:

```js
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
```

Then add them to the exported `window.Store` object literal:

```js
    addToDeck: addToDeck,
    removeFromDeck: removeFromDeck,
    inDeck: inDeck,
    deckList: deckList,
    deckCount: deckCount,
```

And update `reset()` to preserve the deck:

```js
  function reset() { var d = load(); save({ srs: {}, fcMode: d.fcMode, deck: d.deck }); }
```

- [ ] **Step 4: Run the test, expect PASS**

Run: `node scripts/test_deck.js`
Expected: `All passed`

- [ ] **Step 5: Commit**

```bash
git add js/data-utils.js scripts/test_deck.js
git commit -m "Add localStorage flashcard deck API to Store"
```

### Task 6: Shared add-to-deck button (`js/deck-ui.js`)

**Files:** Create `js/deck-ui.js`; append styles to `css/style.css`.

- [ ] **Step 1: Create `js/deck-ui.js`**

```js
/* ===========================================================
   Cantonese Learning — shared "+ Add to deck" button.
   window.Deck.button(word) -> HTML; window.Deck.mount(root) wires clicks.
   =========================================================== */
(function () {
  "use strict";
  if (!window.Store) return;

  function attrs(word) {
    return 'data-deck-hanzi="' + esc(word.hanzi) + '"' +
      ' data-deck-jyutping="' + esc(word.jyutping) + '"' +
      ' data-deck-english="' + esc(word.english) + '"' +
      ' data-deck-source="' + esc(word.source || "lesson") + '"' +
      (word.lessonId ? ' data-deck-lesson-id="' + esc(word.lessonId) + '"' : "") +
      (word.lessonTitle ? ' data-deck-lesson-title="' + esc(word.lessonTitle) + '"' : "");
  }
  function label(inDeck) { return inDeck ? "✓ In deck" : "+ Add to deck"; }

  function button(word) {
    var inDeck = window.Store.inDeck(word.hanzi);
    return '<button type="button" class="deck-btn' + (inDeck ? " in-deck" : "") + '" ' +
      attrs(word) + ' aria-pressed="' + inDeck + '">' + label(inDeck) + '</button>';
  }
  function wordFrom(btn) {
    return {
      hanzi: btn.getAttribute("data-deck-hanzi"),
      jyutping: btn.getAttribute("data-deck-jyutping"),
      english: btn.getAttribute("data-deck-english"),
      source: btn.getAttribute("data-deck-source"),
      lessonId: btn.getAttribute("data-deck-lesson-id") || undefined,
      lessonTitle: btn.getAttribute("data-deck-lesson-title") || undefined
    };
  }
  function paint(btn, inDeck) {
    btn.classList.toggle("in-deck", inDeck);
    btn.setAttribute("aria-pressed", String(inDeck));
    btn.textContent = label(inDeck);
  }
  function mount(root) {
    root = root || document;
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".deck-btn");
      if (!btn) return;
      e.preventDefault();
      var w = wordFrom(btn);
      if (btn.hasAttribute("data-deck-all")) return; // handled by addAll
      if (window.Store.inDeck(w.hanzi)) { window.Store.removeFromDeck(w.hanzi); paint(btn, false); }
      else { window.Store.addToDeck(w); window.Store.recordActivity(); paint(btn, true); }
    });
  }
  // Add every word in a list at once; refresh any visible buttons.
  function addAll(words, root) {
    words.forEach(function (w) { window.Store.addToDeck(w); });
    window.Store.recordActivity();
    (root || document).querySelectorAll(".deck-btn").forEach(function (b) {
      paint(b, window.Store.inDeck(b.getAttribute("data-deck-hanzi")));
    });
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  window.Deck = { button: button, mount: mount, addAll: addAll };
})();
```

- [ ] **Step 2: Append deck button styles to `css/style.css`**

```css
/* ----- Add-to-deck button ----- */
.deck-btn {
  margin-top: .5rem; width: 100%; padding: .4rem .6rem;
  font: inherit; font-size: .85rem; cursor: pointer;
  border: 1px solid var(--red); border-radius: 8px;
  background: #fff; color: var(--red); transition: background .15s, color .15s;
}
.deck-btn:hover { background: var(--red); color: #fff; }
.deck-btn.in-deck { background: var(--red); color: #fff; border-color: var(--red); }
.deck-add-all { margin: .25rem 0 1rem; }
```

(`--red` is the project's primary accent, defined in the `:root` block at the top of `css/style.css`.)

- [ ] **Step 3: Node smoke test for `Deck.button` HTML**

Run:
```bash
node -e "global.window={};global.localStorage={getItem:function(){return null},setItem:function(){}};require('./js/data-utils.js');global.document={};require('./js/deck-ui.js');console.log(window.Deck.button({hanzi:'現金',jyutping:'jin6 gam1',english:'cash',source:'wordbank'}));"
```
Expected: prints a `<button class="deck-btn" ...>+ Add to deck</button>` string.

- [ ] **Step 4: Commit**

```bash
git add js/deck-ui.js css/style.css
git commit -m "Add shared add-to-deck button component"
```

### Task 7: Wire add-to-deck into Word Bank, Vocabulary, Lessons, Stories

**Files:** Modify `js/vocab.js`, `js/lesson.js`, `js/story.js`; ensure `js/deck-ui.js` is loaded by `vocabulary.html`, `lesson.html`, `story.html` (and already by `wordbank.html`).

- [ ] **Step 1: Load `deck-ui.js`** in `vocabulary.html`, `lesson.html`, `story.html` — add `<script src="js/deck-ui.js"></script>` after `js/data-utils.js` and before the page script.

- [ ] **Step 2: Vocabulary cards.** In `js/vocab.js` `render()`, append a deck button to each card (mirrors Task 3) by adding before the closing `</div>` of `.vocab-card`:

```js
        (window.Deck ? window.Deck.button({ hanzi: v.hanzi, jyutping: v.jyutping, english: v.english, source: "lesson", lessonId: v.lessonId, lessonTitle: v.lessonTitle }) : "") +
```

After `render()` is first called, wire clicks once: `if (window.Deck) window.Deck.mount(resultsEl);`

- [ ] **Step 3: Lesson vocab section.** In `js/lesson.js` Vocabulary section loop, add a deck button inside each `.vocab-card`:

```js
          (window.Deck ? window.Deck.button({ hanzi: v.hanzi, jyutping: v.jyutping, english: v.english, source: "lesson", lessonId: lesson.id, lessonTitle: lesson.title }) : "") +
```

Add an **"Add all"** button at the end of the Vocabulary section header:

```js
    html += '<button type="button" class="btn btn-ghost-dark deck-add-all" id="deck-add-all">+ Add all to deck</button>';
```

After `mount.innerHTML = html;`, wire it:

```js
  if (window.Deck) {
    window.Deck.mount(mount);
    var addAllBtn = document.getElementById("deck-add-all");
    if (addAllBtn) addAllBtn.addEventListener("click", function () {
      window.Deck.addAll((lesson.vocab || []).map(function (v) {
        return { hanzi: v.hanzi, jyutping: v.jyutping, english: v.english, source: "lesson", lessonId: lesson.id, lessonTitle: lesson.title };
      }), mount);
    });
  }
```

- [ ] **Step 4: Story words.** In `js/story.js` "Words in this story" loop, add inside each `.vocab-card`:

```js
            (window.Deck ? window.Deck.button({ hanzi: w.hanzi, jyutping: w.jyutping, english: w.english, source: "story" }) : "") +
```

In `wire()`, add `if (window.Deck) window.Deck.mount(mount);`

- [ ] **Step 5: Manual verify.** Serve locally; on a lesson page, click "+ Add to deck" on a word → becomes "✓ In deck"; reload → still "✓ In deck" (persisted). "Add all" marks every word. Same on Vocabulary, Word Bank, a story.

- [ ] **Step 6: Commit**

```bash
git add vocabulary.html lesson.html story.html js/vocab.js js/lesson.js js/story.js
git commit -m "Wire add-to-deck buttons across lessons, vocab, word bank, stories"
```

### Task 8: Flashcards review only the deck

**Files:** Modify `js/flashcards.js`; ensure `flashcards.html` does NOT need wordbank (deck is self-contained), but loading order already has data-utils.

- [ ] **Step 1: Swap the card pool.** In `js/flashcards.js`, change `var all = window.Vocab.all();` to:

```js
  var all = window.Store.deckList();
```

- [ ] **Step 2: Empty-deck state.** In `showStart()`, when `all.length === 0`, replace the start card body with a friendly empty state:

```js
    if (!all.length) {
      mount.innerHTML =
        '<div class="fc-start">' +
          '<p class="fc-caught-up">🗂️ Your deck is empty.</p>' +
          '<p class="muted">Add words from a lesson, the Word Bank, or Vocabulary, then come back to review them here.</p>' +
          '<div class="hero-cta">' +
            '<a class="btn btn-primary" href="wordbank.html">Open Word Bank</a> ' +
            '<a class="btn btn-ghost-dark" href="lessons.html">Browse lessons</a>' +
          '</div>' +
        '</div>';
      return;
    }
```

(place this guard at the very top of `showStart()`).

- [ ] **Step 3: Manual verify.** With an empty deck, `flashcards.html` shows the empty state. Add a few words via a lesson, return to flashcards → those exact words (and only those) appear in the session; SRS rating still works; "Words learned" counts deck graduates.

- [ ] **Step 4: Commit**

```bash
git add js/flashcards.js
git commit -m "Flashcards review only the chosen deck, with an empty-deck state"
```

### Task 9: Dashboard stats reflect the deck

**Files:** Modify `js/dashboard.js`.

- [ ] **Step 1: Use the deck for review stats.** In `js/dashboard.js`, after `var all = window.Vocab.all();` add:

```js
  var deck = window.Store.deckList();
```

Change the stats block to compute due/new/known over the deck:

```js
  var due = window.Store.dueCards(deck).length;
  var fresh = window.Store.newCards(deck).length;
  var known = window.Store.knownCount(deck);
```

Leave Word of the Day reading from `all` (or switch its `pool` to `window.Vocab.wordbank()` if non-empty). Keep `doneLessons`, streak, level bars unchanged.

- [ ] **Step 2: Manual verify.** Empty deck → "Cards due" shows `0`; add words and rate some → counts reflect the deck.

- [ ] **Step 3: Commit**

```bash
git add js/dashboard.js
git commit -m "Dashboard review stats reflect the flashcard deck"
```

---

## PHASE 3 — Audio: slower + tone-2 aware

### Task 10: `audio_text.py` (`OVERRIDES` + `spoken_text`) + tests

**Files:** Create `scripts/audio_text.py`, `scripts/test_audio_text.py`.

- [ ] **Step 1: Write `scripts/audio_text.py`**

```python
"""Pure helpers deciding the exact text fed to TTS for a display phrase.

Kept dependency-free (no edge-tts, no network) so it can be unit-tested.
`spoken_text(hanzi)` returns what to synthesize; the MP3 is still keyed by the
original `hanzi`, so the on-screen word never changes.
"""

# Per-word corrections. Map a display phrase -> the exact text to synthesize.
# Seed with confirmed-wrong words over time (none confirmed yet). Example forms:
#   "詩": "詩，",            # add context/punctuation
#   "史": "歷史"[1:],        # or a same-tone neighbour
OVERRIDES = {}


def spoken_text(hanzi):
    """Return the text to synthesize for a given display phrase."""
    if hanzi in OVERRIDES:
        return OVERRIDES[hanzi]
    # Single characters are most prone to a flattened tone-2 (mid-rising) contour
    # because the engine applies an utterance-final fall. A trailing ideographic
    # comma makes the syllable non-final (continuation) without adding a spoken
    # syllable, preserving the rise. Tunable: remove a char here or add an
    # OVERRIDE if a specific word still sounds wrong.
    if len(hanzi) == 1:
        return hanzi + "，"
    return hanzi
```

- [ ] **Step 2: Write `scripts/test_audio_text.py`**

```python
"""Unit tests for scripts/audio_text.py.  Run: python3 scripts/test_audio_text.py"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audio_text
from audio_text import spoken_text


def test_multichar_unchanged():
    assert spoken_text("現金") == "現金"
    assert spoken_text("唔該晒") == "唔該晒"


def test_single_char_gets_continuation_comma():
    assert spoken_text("史") == "史，"
    assert spoken_text("折") == "折，"


def test_override_wins():
    audio_text.OVERRIDES["詩"] = "詩詩"
    try:
        assert spoken_text("詩") == "詩詩"
    finally:
        del audio_text.OVERRIDES["詩"]


def _run():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    failed = 0
    for t in tests:
        try:
            t(); print("PASS", t.__name__)
        except Exception as e:
            failed += 1; print("FAIL", t.__name__, "-", e)
    print("\n%d test(s) failed" % failed if failed else "\nAll %d tests passed" % len(tests))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    _run()
```

- [ ] **Step 3: Run tests**

Run: `python3 scripts/test_audio_text.py`
Expected: `All 3 tests passed`

- [ ] **Step 4: Commit**

```bash
git add scripts/audio_text.py scripts/test_audio_text.py
git commit -m "Add tunable spoken-text helper for tone-2/single-char audio"
```

### Task 11: Wire slower rate, overrides, `--force`, and wordbank into the generator

**Files:** Modify `scripts/generate_audio.py`.

- [ ] **Step 1: Add wordbank to the data files.** In `DATA_FILES`, add `data/wordbank.js`:

```python
DATA_FILES = [
    os.path.join(ROOT, "data", "lessons.js"),
    os.path.join(ROOT, "data", "stories.js"),
    os.path.join(ROOT, "data", "wordbank.js"),
]
```

- [ ] **Step 2: Import the helper and set a rate.** Near the other imports:

```python
from audio_text import spoken_text
```

Add a constant near `VOICE`:

```python
RATE = "-15%"   # slower for clarity (and gives tone-2's rise room)
```

- [ ] **Step 3: Synthesize the spoken form at the slower rate.** In `synth()`, change the save line:

```python
            await edge_tts.Communicate(spoken_text(text), VOICE, rate=RATE).save(path)
```

(`text` stays the manifest/display key; only what's spoken changes.)

- [ ] **Step 4: Add `--force`.** In `run()`, accept and thread a force flag; change the skip check `if has_audio(key):` to `if has_audio(key) and not force:`. Update `__main__`:

```python
if __name__ == "__main__":
    args = sys.argv[1:]
    sys.exit(asyncio.run(run("--dry-run" in args, force="--force" in args)))
```

and the signature `async def run(dry_run, force=False):`. The `load_phrases()` first-file requirement still points at `DATA_FILES[0]` (lessons.js) — unchanged.

- [ ] **Step 5: Verify dry-run still lists phrases (no network).**

Run: `python3 scripts/generate_audio.py --dry-run`
Expected: prints `Found N unique phrases…` where N grew by the word-bank + story words, then the dry-run notice. (No audio written.)

- [ ] **Step 6: Commit**

```bash
git add scripts/generate_audio.py
git commit -m "Generate slower, tone-aware audio; add --force and word-bank phrases"
```

### Task 12: Workflow — `force` input + word-bank trigger

**Files:** Modify `.github/workflows/generate-audio.yml`.

- [ ] **Step 1: Add a `force` input and word-bank path.** Replace the `on:` block:

```yaml
on:
  workflow_dispatch:
    inputs:
      force:
        description: "Regenerate ALL audio (use after changing rate/overrides)"
        type: boolean
        default: false
  push:
    branches: [main]
    paths:
      - data/lessons.js
      - data/stories.js
      - data/wordbank.js
```

- [ ] **Step 2: Pass the flag to the script.** Replace the generate step:

```yaml
      - name: Generate audio
        run: python3 scripts/generate_audio.py ${{ (github.event_name == 'workflow_dispatch' && inputs.force) && '--force' || '' }}
```

- [ ] **Step 3: Validate YAML.**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/generate-audio.yml')); print('yaml OK')"`
Expected: `yaml OK` (if PyYAML is missing, visually confirm indentation instead).

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/generate-audio.yml
git commit -m "Audio workflow: force-regenerate input and word-bank trigger"
```

---

## PHASE 4 — Comprehensible-input stories + podcast breakdown

### Task 13: Add five custom stories built from the word bank

Author five `category: "custom"` stories in `data/stories.js`, starring **Robbie**, reusing word-bank vocabulary, written as comprehensible input: short sentences (5–8 lines), high repetition, mostly familiar words. **Cross-check every jyutping** against `data/wordbank.js` / `data/lessons.js` for the words used; for any new connective word, follow the jyutping already used elsewhere in the data.

**Files:** Modify `data/stories.js` (append to the `window.STORIES` array).

- [ ] **Step 1: Add the first story as the concrete template.** Append inside the array:

```js
  ,{
    id: "robbie-at-the-bank",
    level: 2,
    category: "custom",
    title: "Robbie at the Bank",
    titleJyutping: "ngo5 heoi3 ngan4 hong4",
    blurb: "Robbie opens an account, saves some cash, and asks about interest.",
    minutes: 2,
    words: [
      { hanzi: "銀行", jyutping: "ngan4 hong4", english: "bank" },
      { hanzi: "開戶", jyutping: "hoi1 wu6", english: "to open an account" },
      { hanzi: "存錢", jyutping: "cyun4 cin2", english: "to save money" },
      { hanzi: "現金", jyutping: "jin6 gam1", english: "cash" },
      { hanzi: "利息", jyutping: "lei6 sik1", english: "interest" }
    ],
    sentences: [
      { hanzi: "今日我去銀行。", jyutping: "gam1 jat6 ngo5 heoi3 ngan4 hong4.", english: "Today I go to the bank." },
      { hanzi: "我想開戶。", jyutping: "ngo5 soeng2 hoi1 wu6.", english: "I want to open an account." },
      { hanzi: "我有好多現金。", jyutping: "ngo5 jau5 hou2 do1 jin6 gam1.", english: "I have a lot of cash." },
      { hanzi: "我想存錢。", jyutping: "ngo5 soeng2 cyun4 cin2.", english: "I want to save money." },
      { hanzi: "請問有冇利息呀？", jyutping: "cing2 man6 jau5 mou5 lei6 sik1 aa3?", english: "May I ask, is there interest?" },
      { hanzi: "多謝，唔該晒！", jyutping: "do1 ze6, m4 goi1 saai3!", english: "Thanks, thank you very much!" }
    ]
  }
```

- [ ] **Step 2: Add the remaining four stories** following the same shape and constraints. Use these exact word sets (jyutping/english as in `data/wordbank.js`); write 5–7 short sentences each, first-person as Robbie:

  - `robbie-checks-in` — **"Robbie Checks In"** (`titleJyutping: "zyu6 zau2 dim3"`): 訂 (deng6, to book), 標準房 (biu1 zeon2 fong2, standard room), 雙人房 (soeng1 jan4 fong2, double room), 退房 (teoi3 fong2, to check out), 房 (fong2, room). Arc: books a room → asks single vs double → asks the room size → checkout time.
  - `robbie-pays-the-bill` — **"Dinner & the Bill"** (`titleJyutping: "maai4 daan1"`): 餐廳 (caan1 teng1, restaurant), 好食 (hou2 sik6, delicious), 唔該 (m4 goi1, please/excuse me), 埋單 (maai4 daan1, to pay the bill), 貴 (gwai3, expensive). Arc: at a restaurant → food is delicious → asks for the bill → it's a bit expensive → pays.
  - `robbie-rainy-saturday` — **"A Rainy Saturday"** (`titleJyutping: "lok6 jyu5 ge3 sing1 kei4 luk6"`): 今日 (gam1 jat6, today), 落雨 (lok6 jyu5, to rain), 焗 (guk6, humid/stuffy), 得閒 (dak1 haan4, free/available), 電影 (din6 jing2, movie). Arc: today it rains → it's humid → Robbie is free → stays home → watches a movie.
  - `robbie-family-jobs` — **"My Family & Their Jobs"** (`titleJyutping: "ngo5 ge3 gaa1 jan4"`): 爸爸 (baa4 baa1, father), 媽媽 (maa4 maa1, mother), 老師 (lou5 si1, teacher), 醫生 (ji1 sang1, doctor), 律師 (leot6 si1, lawyer). Arc: introduces dad (a teacher) → mum (a doctor) → older brother 大佬 (daai6 lou2) is a lawyer → loves his family.

- [ ] **Step 3: Validate the data file parses and audio extraction grows.**

Run: `node -e "global.window={};require('./data/stories.js');var s=window.STORIES;console.log(s.length,'stories');s.forEach(function(x){x.sentences.forEach(function(l){if(!l.hanzi||!l.jyutping||!l.english)throw new Error('missing field in '+x.id)})});console.log('stories OK')"`
Expected: prints story count (10) and `stories OK`.

Run: `python3 scripts/generate_audio.py --dry-run`
Expected: phrase count grew by the new sentences/words.

- [ ] **Step 4: Manual verify.** Serve locally; `stories.html` shows the five new stories under **"Your stories"**; each opens, highlights its words, and "Play whole story" sequences (online voice until regeneration).

- [ ] **Step 5: Commit**

```bash
git add data/stories.js
git commit -m "Add five comprehensible-input stories from the word bank"
```

### Task 14: Podcast breakdown player

A scripted, cancelable player on the story page that, per sentence: plays the line → reveals English → plays each target word in turn → replays the line. Reuses the existing `playToken` cancellation and `speakCantonese(text, onEnd)` callback.

**Files:** Modify `js/story.js`; append CSS to `css/style.css`.

- [ ] **Step 1: Add the button.** In `render()` `.story-controls`, after the "Play whole story" button:

```js
    html += '<button class="btn btn-ghost-dark" id="play-podcast">🎧 Podcast breakdown</button>';
```

- [ ] **Step 2: Wire it.** In `wire()`:

```js
    var pod = document.getElementById("play-podcast");
    if (pod) pod.addEventListener("click", playPodcast);
```

- [ ] **Step 3: Implement the player.** Add to `js/story.js` (after `playAll`):

```js
  // Guided breakdown: line -> English -> each target word -> line again.
  function playPodcast() {
    playToken++;
    var token = playToken;
    var i = 0;
    function speak(text, done) {
      if (token !== playToken) return;
      var res = window.speakCantonese ? window.speakCantonese(text, done) : "unsupported";
      if (res === "unsupported") { setTimeout(done, 300); return; }
      setTimeout(function () { if (token === playToken) done(); }, 12000); // safety net
    }
    function wordsIn(sentence) {
      return (story.words || []).filter(function (w) {
        return w.hanzi && sentence.hanzi.indexOf(w.hanzi) > -1;
      });
    }
    function stepSentence() {
      if (token !== playToken || i >= story.sentences.length) return;
      var idx = i++;
      var s = story.sentences[idx];
      mount.querySelectorAll(".story-line.playing").forEach(function (e) { e.classList.remove("playing"); });
      var line = mount.querySelector('.story-line[data-i="' + idx + '"]');
      if (line) { line.classList.add("playing"); line.classList.add("revealed"); revealed[idx] = true; line.scrollIntoView({ block: "center", behavior: "smooth" }); }
      speak(s.hanzi, function () {                 // 1) full line
        var ws = wordsIn(s), k = 0;
        function nextWord() {
          if (token !== playToken) return;
          if (k >= ws.length) { speak(s.hanzi, stepSentence); return; } // 3) replay line, advance
          speak(ws[k++].hanzi, nextWord);          // 2) each target word
        }
        nextWord();
      });
    }
    stepSentence();
  }
```

- [ ] **Step 4: Stop the podcast when other controls run.** Confirm `playAll()` and `toggle-all`/`render()` already bump or reset `playToken` (they do via `playToken++` in `playAll`; `render()` re-binds). No extra code needed; pressing "Play whole story" cancels the podcast because both share `playToken`.

- [ ] **Step 5: Highlight styling.** Append to `css/style.css`:

```css
/* ----- Podcast breakdown ----- */
.story-line.playing { background: #fff7e6; border-radius: 10px; }   /* light tint of --gold */
#play-podcast { margin-left: .5rem; }
```

- [ ] **Step 6: Manual verify.** Open a custom story → "🎧 Podcast breakdown": it walks line → words → line, scrolls/highlights, reveals English; pressing "Play whole story" or leaving the page stops it cleanly.

- [ ] **Step 7: Commit**

```bash
git add js/story.js css/style.css
git commit -m "Add podcast breakdown player to the story reader"
```

---

## Final verification & handoff

- [ ] **Run all automated tests**

```bash
python3 scripts/test_extract.py && python3 scripts/test_build_wordbank.py && python3 scripts/test_audio_text.py && node scripts/test_deck.js
```
Expected: every suite prints all-passed.

- [ ] **Full manual smoke** (serve with `python3 -m http.server 8000`): nav has Word Bank on every page; Word Bank search/filter; add words → flashcards review only those; empty-deck state; dashboard "Cards due" reflects deck; five new stories appear and play; podcast breakdown works.

- [ ] **Push the branch**

```bash
git push -u origin claude/eager-hawking-Kp0X6
```

- [ ] **Tell the user to trigger audio.** Open the repo's **Actions → "Generate Cantonese audio" → Run workflow** with **force: true** to produce the slower MP3s + new word/story audio (it can't run in the sandbox — needs internet to Microsoft's TTS). Until then, playback uses the online Cantonese voice fallback.

---

## Self-review notes (spec coverage)

- Word bank → `data/wordbank.js` (Task 1), `Vocab.wordbank()` (2), page (3), nav (4). ✓
- Decks → Store API (5), shared button (6), wiring (7), flashcards pool (8), dashboard (9). ✓
- Audio → spoken_text/overrides + single-char nudge (10), slower rate + force + wordbank (11), workflow (12). ✓
- Stories + podcast → five stories (13), breakdown player (14). ✓
- Operational note (force-run the Action) carried into Task 11/12 and final handoff. ✓
