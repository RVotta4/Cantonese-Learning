# Lesson Content Enrichment (Pilot Phase) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the content validator and author the 3 pilot lessons (`pronouns-basics`, `colours`, `weather`) with dialogues + grammar/usage notes + a cultural note each, ready for the user's review before bulk authoring.

**Architecture:** Pure data work in `data/lessons.js` (the single source of truth). A new Node script `scripts/test_lessons_content.js` validates the *well-formedness* of whatever dialogue/notes content exists, so the suite stays green as lessons are enriched. The renderer (`js/lesson.js`) already displays Dialogue and "Grammar & Notes" sections — no UI work.

**Tech Stack:** Vanilla ES5 JS, Node for tests (load `data/lessons.js` via a `window` global + `eval`, the established pattern). No build step.

**Scope of THIS plan:** validator + 3 pilot lessons, ending at the user-review gate. The remaining ~38 lessons and the coverage assertion (Part B) get their own bulk plan written *after* pilot feedback — this honors the approved pilot-first process and keeps every step in this plan fully specified (no premature/placeholder content). Spec: `docs/superpowers/specs/2026-06-04-lesson-content-enrichment-design.md`.

**Note on counts:** 41 thin lessons need dialogue+notes; `tones-jyutping` already has notes and is intentionally dialogue-free, so it needs no work.

---

## File Structure

- **Create** `scripts/test_lessons_content.js` — content validator (Part A well-formedness). One responsibility: assert that any authored dialogue/notes are structurally valid, jyutping is well-formed, dialogues are grounded in vocab, and no Mandarin-slip characters appear in dialogue hanzi.
- **Modify** `data/lessons.js` — populate `dialogue` and add `notes` for the 3 pilot lesson objects only. No schema change.

---

## Task 1: Content validator

**Files:**
- Create: `scripts/test_lessons_content.js`

- [ ] **Step 1: Create the validator file**

Create `scripts/test_lessons_content.js` with EXACTLY this content:

```js
/* ===========================================================
   Node content validator for data/lessons.js.
   Run: node scripts/test_lessons_content.js

   Part A — well-formedness. Runs on whatever dialogue / notes
   content exists, so it stays green as lessons are enriched.
   Part B (coverage: every non-excluded lesson actually has a
   dialogue + notes) is added in the bulk-authoring plan, once
   the content exists to satisfy it.
   =========================================================== */
var fs = require("fs");
global.window = {};
eval(fs.readFileSync(__dirname + "/../data/lessons.js", "utf8"));
var LESSONS = global.window.LESSONS;

var failed = 0;
function fail(msg) { console.log("FAIL " + msg); failed++; }

// Mandarin-only characters that signal a Mandarin slip or accidental
// simplified input. Deliberately conservative: characters with legitimate
// Cantonese uses (不 in 不過, 的 in 的士, 是 in 但是, 嗎 in 你好嗎) are NOT listed.
var MANDARIN = "喝這沒們这吗没们个".split("");

// A jyutping token is "Cantonese" if, after stripping surrounding
// punctuation, it has no uppercase letter (proper nouns like "Robbie"
// are tolerated). Returns the cleaned token, or null to ignore it.
function cantoneseToken(tok) {
  var clean = tok.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
  if (!clean) return null;
  if (/[A-Z]/.test(clean)) return null;
  return clean;
}

if (!Array.isArray(LESSONS)) {
  fail("window.LESSONS is not an array");
} else {
  LESSONS.forEach(function (l) {
    var id = l && l.id ? l.id : "(no id)";

    // vocab + examples exist on every lesson; dialogue + notes are optional
    // in Part A (the coverage gate enforces their presence later).
    ["vocab", "examples"].forEach(function (f) {
      if (!Array.isArray(l[f])) fail(id + ": " + f + " is not an array");
    });
    ["dialogue", "notes"].forEach(function (f) {
      if (l[f] != null && !Array.isArray(l[f])) fail(id + ": " + f + " is present but not an array");
    });

    var dialogue = Array.isArray(l.dialogue) ? l.dialogue : [];
    var vocab = Array.isArray(l.vocab) ? l.vocab : [];
    var notes = Array.isArray(l.notes) ? l.notes : [];

    dialogue.forEach(function (line, i) {
      ["speaker", "hanzi", "jyutping", "english"].forEach(function (k) {
        if (!line || typeof line[k] !== "string" || !line[k].length)
          fail(id + ": dialogue[" + i + "]." + k + " is missing or empty");
      });
      if (line && typeof line.jyutping === "string") {
        line.jyutping.trim().split(/\s+/).forEach(function (tok) {
          var c = cantoneseToken(tok);
          if (c && !/^[a-z]+[1-6]$/.test(c))
            fail(id + ": malformed jyutping token '" + tok + "' in dialogue[" + i + "]");
        });
      }
      if (line && typeof line.hanzi === "string") {
        MANDARIN.forEach(function (ch) {
          if (line.hanzi.indexOf(ch) > -1)
            fail(id + ": Mandarin character '" + ch + "' in dialogue[" + i + "] hanzi — use the Cantonese form");
        });
      }
    });

    if (dialogue.length) {
      var allHanzi = dialogue.map(function (d) { return d.hanzi || ""; }).join("");
      var grounded = vocab.some(function (v) { return v.hanzi && allHanzi.indexOf(v.hanzi) > -1; });
      if (!grounded) fail(id + ": dialogue does not use any of the lesson's vocab");
    }

    notes.forEach(function (n, i) {
      ["title", "body"].forEach(function (k) {
        if (!n || typeof n[k] !== "string" || !n[k].length)
          fail(id + ": notes[" + i + "]." + k + " is missing or empty");
      });
    });
  });

  if (!failed) console.log("PASS all " + LESSONS.length + " lessons well-formed (Part A)");
}

console.log(failed ? ("\n" + failed + " failed") : "\nAll passed");
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run it on current data — expect PASS**

Run: `node scripts/test_lessons_content.js`
Expected: ends with `PASS all 52 lessons well-formed (Part A)` then `All passed`. (Verified during planning: the validator is clean on the current data, including the 10 rich lessons' punctuation and the proper noun "Robbie".)

> If it instead flags an existing rich lesson, that's a check that's too strict — refine the validator (e.g. the Mandarin list or token rule); do **not** edit the existing lesson data.

- [ ] **Step 3: Confirm no regressions**

Run each and confirm the final line:
- `node scripts/test_deck.js` → `All passed`
- `node scripts/test_practice.js` → `All passed`
- `node scripts/test_practice_store.js` → `All passed`
- `node --check data/lessons.js` → no output (exit 0)

- [ ] **Step 4: Commit**

```bash
git add scripts/test_lessons_content.js
git commit -m "Add lesson content validator (well-formedness)"
```

---

## Task 2: Enrich `pronouns-basics`

**Files:**
- Modify: `data/lessons.js` (the `pronouns-basics` object)

- [ ] **Step 1: Populate the dialogue**

Replace this exact block:

```js
    intro: "Master these six pronouns and you can talk about anyone — add 哋 to make any of them plural.",
    dialogue: [],
```

with:

```js
    intro: "Master these six pronouns and you can talk about anyone — add 哋 to make any of them plural.",
    dialogue: [
      { speaker: "A", hanzi: "佢係邊個呀？", jyutping: "keoi5 hai6 bin1 go3 aa3?", english: "Who's that?" },
      { speaker: "B", hanzi: "佢係我朋友。", jyutping: "keoi5 hai6 ngo5 pang4 jau5.", english: "He's my friend." },
      { speaker: "A", hanzi: "你哋係唔係學生呀？", jyutping: "nei5 dei6 hai6 m4 hai6 hok6 saang1 aa3?", english: "Are you two students?" },
      { speaker: "B", hanzi: "係，我哋都係學生。", jyutping: "hai6, ngo5 dei6 dou1 hai6 hok6 saang1.", english: "Yes, we're both students." }
    ],
```

- [ ] **Step 2: Add the notes**

Replace this exact block:

```js
      { hanzi: "我哋鍾意飲茶。", jyutping: "ngo5 dei6 zung1 ji3 jam2 caa4.", english: "We like going for dim sum." }
    ]
  },
```

with:

```js
      { hanzi: "我哋鍾意飲茶。", jyutping: "ngo5 dei6 zung1 ji3 jam2 caa4.", english: "We like going for dim sum." }
    ],
    notes: [
      {
        title: "Plurals with 哋 (dei6)",
        body: "Add 哋 after a pronoun to make it plural: 我 (I) becomes 我哋 (we), 你 (you) becomes 你哋, and 佢 (he/she) becomes 佢哋 (they). The pronoun itself never changes — you just add 哋."
      },
      {
        title: "Yes/no questions with 係唔係",
        body: "To ask a yes/no question, say the verb in its positive-negative form: 你係唔係學生呀？ is literally \"you are-not-are student?\" Answer 係 (yes) or 唔係 (no)."
      },
      {
        title: "Culture — one word for he, she and it",
        body: "Spoken Cantonese doesn't mark gender on pronouns: 佢 (keoi5) covers he, she and it. Listeners rely on context, so you never have to choose a gender as you speak."
      }
    ]
  },
```

- [ ] **Step 3: Validate — expect PASS**

Run: `node scripts/test_lessons_content.js` → expect `All passed`.
Run: `node --check data/lessons.js` → no output (exit 0).

- [ ] **Step 4: Commit**

```bash
git add data/lessons.js
git commit -m "Enrich pronouns-basics lesson (dialogue + notes)"
```

---

## Task 3: Enrich `colours`

**Files:**
- Modify: `data/lessons.js` (the `colours` object)

- [ ] **Step 1: Populate the dialogue**

Replace this exact block:

```js
    intro: "Colours come up everywhere — clothes, food, directions. Here are the everyday ones.",
    dialogue: [],
```

with:

```js
    intro: "Colours come up everywhere — clothes, food, directions. Here are the everyday ones.",
    dialogue: [
      { speaker: "A", hanzi: "你鍾意咩顏色呀？", jyutping: "nei5 zung1 ji3 me1 ngaan4 sik1 aa3?", english: "What colour do you like?" },
      { speaker: "B", hanzi: "我鍾意藍色同綠色。你呢？", jyutping: "ngo5 zung1 ji3 laam4 sik1 tung4 luk6 sik1. nei5 ne1?", english: "I like blue and green. And you?" },
      { speaker: "A", hanzi: "我最鍾意紅色。", jyutping: "ngo5 zeoi3 zung1 ji3 hung4 sik1.", english: "I like red the most." },
      { speaker: "B", hanzi: "紅色好靚呀！", jyutping: "hung4 sik1 hou2 leng3 aa3!", english: "Red is really pretty!" }
    ],
```

- [ ] **Step 2: Add the notes**

Replace this exact block:

```js
      { hanzi: "天係藍色。", jyutping: "tin1 hai6 laam4 sik1.", english: "The sky is blue." }
    ]
  },
```

with:

```js
      { hanzi: "天係藍色。", jyutping: "tin1 hai6 laam4 sik1.", english: "The sky is blue." }
    ],
    notes: [
      {
        title: "Colour = base word + 色 (sik1)",
        body: "Most colour names are a base word plus 色 (sik1, \"colour\"): 紅 (red) → 紅色, 藍 (blue) → 藍色, 黑 (black) → 黑色. Using the full …色 form is always safe."
      },
      {
        title: "同 (tung4) — \"and\"",
        body: "Join two things with 同 (tung4): 藍色同綠色 = \"blue and green\". 同 links nouns; it isn't used to join whole sentences."
      },
      {
        title: "Culture — red for luck, white for mourning",
        body: "In Cantonese culture 紅色 (red) means luck and joy — it's the colour of lai-see (lucky money) packets and weddings. 白色 (white) is linked to funerals, so it's avoided for gifts and celebrations."
      }
    ]
  },
```

- [ ] **Step 3: Validate — expect PASS**

Run: `node scripts/test_lessons_content.js` → expect `All passed`.
Run: `node --check data/lessons.js` → no output (exit 0).

- [ ] **Step 4: Commit**

```bash
git add data/lessons.js
git commit -m "Enrich colours lesson (dialogue + notes)"
```

---

## Task 4: Enrich `weather`

**Files:**
- Modify: `data/lessons.js` (the `weather` object)

- [ ] **Step 1: Populate the dialogue**

Replace this exact block:

```js
    intro: "Hong Kong weather swings from hot to rainy — here are the words to describe it.",
    dialogue: [],
```

with:

```js
    intro: "Hong Kong weather swings from hot to rainy — here are the words to describe it.",
    dialogue: [
      { speaker: "A", hanzi: "今日天氣點呀？", jyutping: "gam1 jat6 tin1 hei3 dim2 aa3?", english: "How's the weather today?" },
      { speaker: "B", hanzi: "好熱！不過出面落雨。", jyutping: "hou2 jit6! bat1 gwo3 ceot1 min6 lok6 jyu5.", english: "Very hot! But it's raining outside." },
      { speaker: "A", hanzi: "咁聽日呢？", jyutping: "gam2 ting1 jat6 ne1?", english: "Then what about tomorrow?" },
      { speaker: "B", hanzi: "聽日天晴，冇咁熱。", jyutping: "ting1 jat6 tin1 cing4, mou5 gam3 jit6.", english: "Tomorrow it's sunny, not as hot." }
    ],
```

- [ ] **Step 2: Add the notes**

Replace this exact block:

```js
      { hanzi: "今日天氣好好。", jyutping: "gam1 jat6 tin1 hei3 hou2 hou2.", english: "The weather is very good today." }
    ]
  },
```

with:

```js
      { hanzi: "今日天氣好好。", jyutping: "gam1 jat6 tin1 hei3 hou2 hou2.", english: "The weather is very good today." }
    ],
    notes: [
      {
        title: "好 (hou2) = \"very\"",
        body: "Before an adjective, 好 means \"very\", not \"good\": 好熱 = \"very hot\", 好凍 = \"very cold\". So 今日好熱 is \"it's very hot today\"."
      },
      {
        title: "冇咁 (mou5 gam3) — \"not as…\"",
        body: "冇咁 + adjective means \"not as / not so …\": 冇咁熱 = \"not as hot\", 冇咁凍 = \"not as cold\". 冇 (mou5) is the everyday Cantonese word for \"not have / there isn't\"."
      },
      {
        title: "Culture — typhoons and the T8 signal",
        body: "Hong Kong summers bring typhoons. When the Observatory hoists the T8 signal (八號風球, baat3 hou6 fung1 kau4), schools and offices close — locals call an unexpected day off a \"typhoon holiday\"."
      }
    ]
  },
```

- [ ] **Step 3: Validate — expect PASS**

Run: `node scripts/test_lessons_content.js` → expect `All passed`.
Run: `node --check data/lessons.js` → no output (exit 0).

- [ ] **Step 4: Commit**

```bash
git add data/lessons.js
git commit -m "Enrich weather lesson (dialogue + notes)"
```

---

## Task 5: Pilot verification & review handoff

**Files:** none (verification checkpoint)

- [ ] **Step 1: Run the full suite — expect all green**

- `node scripts/test_lessons_content.js` → `All passed`
- `node scripts/test_deck.js` → `All passed`
- `node scripts/test_practice.js` → `All passed`
- `node scripts/test_practice_store.js` → `All passed`
- `python3 scripts/test_build_wordbank.py` → all tests passed
- `python3 scripts/test_audio_text.py` → all tests passed
- `node --check data/lessons.js` → no output

- [ ] **Step 2: Sanity-check the rendered content**

Confirm the three enriched objects each now have a 4-line `dialogue` and a 3-item `notes` array (the last note titled `Culture — …`):

Run: `node -e "var fs=require('fs');global.window={};eval(fs.readFileSync('data/lessons.js','utf8'));['pronouns-basics','colours','weather'].forEach(function(id){var l=window.LESSONS.filter(function(x){return x.id===id;})[0];console.log(id, 'dialogue='+l.dialogue.length, 'notes='+l.notes.length, '| last note:', l.notes[l.notes.length-1].title);});"`
Expected: each line shows `dialogue=4 notes=3` and a `Culture — …` last note.

- [ ] **Step 3: STOP — hand off for user pilot review**

Do not proceed to bulk authoring. Present the three lessons to the user for review of accuracy and naturalness (they can also open `lesson.html?id=pronouns-basics` etc. once pushed). Fold any feedback into the spec's "Authoring standards" section. The bulk-authoring plan (remaining ~38 lessons + the Part B coverage assertion) is written only after the user approves the pilot.

---

## Notes for the executor

- **Audio:** new dialogue hanzi will get MP3s automatically when this work later merges to `main` (the "Generate Cantonese audio" Action triggers on `data/*.js` changes). No audio work in this plan.
- **Do not** modify the 10 rich lessons or `tones-jyutping`.
- All commits are content/data; keep them small and per-lesson as above.
