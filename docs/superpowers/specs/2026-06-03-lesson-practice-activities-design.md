# Design: Per-Lesson Interactive Practice

**Date:** 2026-06-03
**Status:** Approved design, pending spec review
**Branch:** `claude/eager-hawking-Kp0X6`

## Summary

The 52 lessons currently teach passively: each is Dialogue → Vocabulary →
Example Sentences → Grammar Notes, all read-only. This sub-project adds **active
practice** to every lesson without changing the reading content. Each lesson
gains a **"▶ Practice this lesson"** button that opens a new
`practice.html?id=<lesson.id>` page and runs an interleaved session of interactive
activities generated entirely from that lesson's *existing, already-vetted*
data (`hanzi / jyutping / english` + pre-generated audio). No backend, no build
step, no new authored content — so it applies to all 52 lessons at once.

This is **sub-project 1 of 2**. Content enrichment (opening dialogues for the 42
lessons that lack one, deeper grammar/usage notes, cultural context) is a
separate later cycle with its own spec, plan, and review gate — explicitly out
of scope here.

The activities are grounded in the strongest evidence for efficient learning
beyond passive reading: **retrieval practice**, the **generation effect**,
**interleaving**, **dual coding**, and — Cantonese-specific — **tone-perception
training** with minimal pairs.

## Goals

- Every lesson offers an interactive practice session built from its own data.
- The session interleaves seven activity types: self-test recall,
  listening→meaning, matching, cloze, sentence reordering, tone discrimination,
  and shadowing/anticipation.
- All inputs are tap/select (no typed answers).
- Per-lesson practice progress (best score, times practised, last practised) is
  stored and surfaced on the lessons list and dashboard.
- Missed words can be added to the SRS deck with one tap from the results
  screen — never automatically.
- Pure pedagogy logic is isolated in a `window`-assigned module with Node unit
  tests, mirroring `data-utils.js` / `scripts/test_deck.js`.

## Non-goals

- No backend, accounts, or build step — it stays a static site.
- No automatic pronunciation or tone-*production* scoring (no mic/ML). Shadowing
  is self-rated against the native audio.
- No free-response or conversation grading. Every graded activity is closed-form.
- No typed-answer checking (typed jyutping is too brittle to grade fairly).
- No new spaced-repetition scheduler for practice — the existing SM-2 deck still
  owns spacing; practice is on-demand.
- No new authored language content and **no new audio** — practice reuses the
  clips that already exist for lesson vocab/examples.
- No changes to lesson reading content (that is sub-project 2).

## Decisions (resolved during brainstorming)

| Decision | Choice |
|----------|--------|
| Overall thrust | Both interactive practice **and** content enrichment; practice built **first** |
| Practice placement | **Per-lesson Practice stage**: button on the lesson page → dedicated `practice.html` |
| Activities included | **All seven** (recall, listening, matching, cloze, reorder, tone, shadowing) |
| Input modality | **Tap/select only** — no typing |
| Progress vs deck | **Separate per-lesson progress + opt-in "add missed to deck"**; never auto-adds |
| Tone-pair data | **Auto-mined** from existing vocab + Word Bank; plain "which tone?" needs no pairs |
| Audio for tone drill | **Pre-generated MP3 only** (via `AUDIO_MANIFEST`); skip words without a clip |
| Content enrichment | **Deferred to sub-project 2** (dialogues for 42 lessons + deeper notes + culture) |

## Architecture overview

Follows the existing static-site pattern: plain HTML pages that include
`data/*.js` (globals) + `js/*.js` (IIFEs assigning `window.*`), localStorage for
state, `window.speakCantonese` for audio.

### New files

- **`practice.html`** — the practice page (mirrors `flashcards.html`): a
  `#practice-page` mount plus the standard script includes.
- **`js/practice-logic.js`** — pure, UI-free pedagogy logic assigned to
  `window.PracticeLogic`. Node-`eval`-able and unit-tested. Functions:
  - `tokenizeJyutping(s)` → array of space-delimited tokens.
  - `isSingleSyllable(jyutping)` → boolean (`/^[a-z]+[1-6]$/i`, no spaces).
  - `toneOf(jyutping)` → `1..6` or `null`; `syllableKey(jyutping)` → syllable
    without the trailing tone digit.
  - `pickDistractors(answer, field, pool, n)` → `n` distinct distractor values
    (prefers same-topic / similar length; never the answer).
  - `buildClozeOptions(sentenceWords, target, pool, n)` → option list incl. target.
  - `mineTonePairs(allWords)` → map `syllableKey → [{hanzi,jyutping,tone}]`,
    keeping only keys with ≥2 distinct tones.
  - `buildSession(lesson, opts)` → ordered, interleaved task list (see Session model).
  - `scoreSession(results)` → `{ correct, total, pct, missedWords }`.
- **`scripts/test_practice.js`** — Node tests for `practice-logic.js`, using the
  `global.window = {}` + `eval(fs.readFileSync(...))` harness from `test_deck.js`.

### Modified files

- **`js/data-utils.js`** — add to `window.Store`: `recordPractice(lessonId, pct)`
  and `getPracticeStats(lessonId)`. New persisted slice `data.practice =
  { [lessonId]: { best, times, last } }`. `reset()` (the flashcards "reset
  progress") is unchanged and leaves `practice` untouched.
- **`js/lesson.js`** — add a "Practice" section with the
  **"▶ Practice this lesson"** button linking to
  `practice.html?id=<lesson.id>`, plus a small "best score / last practised"
  line when stats exist.
- **`js/lessons.js`** — show a small practice badge (e.g. "Practised 80%") on
  each lesson card when stats exist.
- **`js/dashboard.js`** — reflect practice in the stats row (e.g. a
  "lessons practised" count) without disturbing existing tiles.
- **`css/style.css`** — styles for the practice screens (progress bar, option
  buttons, matching grid, token bank, tone buttons, results), reusing existing
  design tokens/classes where possible.

### Script includes (`practice.html`)

```
data/lessons.js
data/wordbank.js        (distractor top-up + tone-pair mining)
audio/manifest.js       (window.AUDIO_MANIFEST — "has MP3?" check)
js/data-utils.js        (window.Store, window.Vocab)
js/main.js              (window.speakCantonese, hasCantoneseVoice)
js/practice-logic.js    (window.PracticeLogic)
js/practice.js          (controller)
```

## Session model

`buildSession(lesson, opts)`:

1. **Source pools** — `words = lesson.vocab`; `sentences = lesson.examples`
   concat any `lesson.dialogue` lines (each has `hanzi/jyutping/english`).
2. **Candidate tasks** per type:
   - recall, listening, tone, shadowing → from `words`
   - cloze, reorder → from `sentences` with ≥3 jyutping tokens (reorder caps at
     ~8 tokens to stay tappable)
   - matching → one grouped task over a sample of ~6 `words`
   - tone → only `words` where `isSingleSyllable` **and**
     `AUDIO_MANIFEST[hanzi]` exists; adds a "which word?" variant when a mined
     same-syllable/different-tone neighbour exists
3. **Compose** — cap at **~12–16 tasks**, scaled down for small lessons. Pick by
   round-robin across types so types are **interleaved**, not blocked. A lesson
   with little content yields a shorter session; nothing is invented.
4. **Distractors** — drawn from the same lesson first, topped up from the Word
   Bank / other lessons when a small lesson lacks ≥4 options.

The controller (`practice.js`) renders one task at a time with a progress bar,
collects a per-task result, and ends on a **results screen**: score, the missed
words, **"+ Add missed words to deck"**, "Practice again", "Back to lesson".

## The seven activities

| # | Activity | Interaction | Grading | Audio |
|---|----------|-------------|---------|-------|
| 1 | Self-test recall | English (or audio) → flip → self-grade *Got it / Missed* | self-report | plays answer on reveal |
| 2 | Listening → meaning | hear word → pick English from 4 | correct/incorrect | required to play; TTS fallback OK |
| 3 | Matching | tap-to-pair hanzi ↔ jyutping ↔ english (~6 rows) | all pairs correct | optional on tap |
| 4 | Cloze | sentence with one word blanked → pick from 4 | correct/incorrect | plays full sentence |
| 5 | Sentence reorder | shuffled **jyutping** tokens → tap to rebuild order | exact token order | plays sentence on success |
| 6 | Tone discrimination | hear single-syllable word → tap tone 1–6 (or "which word?") | correct/incorrect | **MP3 only**; skip if none |
| 7 | Shadowing / anticipation | English prompt → say aloud → reveal + native audio → self-rate | not scored (participation) | plays native model |

**Missed-word collection:** word-bearing tasks (recall, listening, matching,
tone) and cloze (the blanked word) contribute their word to `missedWords` on a
wrong/"Missed" result. Reorder and shadowing do not add deck words (sentence /
self-rated).

## Tone-pair mining

`mineTonePairs(allWords)` scans `Vocab.all()` + `Vocab.wordbank()` for
`isSingleSyllable` entries, groups by `syllableKey`, and keeps groups spanning
≥2 distinct tones — yielding real, audio-backed minimal pairs (si1–si6,
maa1/maa5 already qualify). The "which tone (1–6)?" variant needs **no** pairs
(the tone is read from the jyutping), so tone practice works for any lesson with
single-syllable vocab that has audio; the "which word did you hear?" variant
appears only when a mined neighbour exists.

## Progress & deck integration

- **Storage:** `data.practice[lessonId] = { best: <0–100>, times: <int>,
  last: <ms> }`. `recordPractice(id, pct)` bumps `times`, raises `best`, sets
  `last`, and calls `recordActivity()` (feeds streak). `getPracticeStats(id)`
  returns the slice or `null`.
- **Surfacing:** lesson page shows "Best 80% · practised 3×"; lessons list shows
  a compact badge; dashboard shows a "lessons practised" count. On-demand only —
  no due/scheduling for practice.
- **Deck:** results screen lists missed words with a one-tap add using the
  existing `Store.addToDeck(word)` (full-object storage). Honors the curated,
  starts-empty deck — nothing is auto-added.

## Audio dependency

- "Has a real clip?" = `window.AUDIO_MANIFEST && AUDIO_MANIFEST[hanzi]`.
- Tone discrimination uses **only** words with a clip (browser TTS is unreliable
  for tones); words without one are excluded from tone tasks.
- Listening/cloze/reorder play via `speakCantonese`, which falls back to online
  then browser TTS — acceptable for meaning, not for tone judgement.
- Tone-drill quality further depends on the slower / tone-2-nudged audio the user
  regenerates via the GitHub Action (from the already-merged audio work); this
  design does not generate audio.

## Testing

- `scripts/test_practice.js` (Node) unit-tests `practice-logic.js`:
  tokenizeJyutping, isSingleSyllable/toneOf/syllableKey, pickDistractors
  (count, no-answer-leak, dedupe), buildClozeOptions, mineTonePairs (finds
  si/maa, excludes singletons), buildSession (interleaving, cap, graceful small
  lesson, tone tasks gated by manifest stub), scoreSession (pct + missedWords).
- Existing `test_deck.js`, `test_build_wordbank.py`, `test_audio_text.py` must
  still pass. `node --check` on new JS; manual browser smoke test noted as a
  follow-up the sandbox can't perform.

## Caveats & dependencies

- No pronunciation/tone-production scoring; shadowing is self-assessed.
- Typed input intentionally excluded.
- Hanzi word-segmentation avoided — reorder/cloze operate on jyutping tokens.
- Tone drill is only as good as the audio and is skipped where no MP3 exists.
- Browser smoke testing (click-through of each activity) is a manual step
  outside the sandbox.

## Out of scope (next cycle — sub-project 2: content enrichment)

- Opening dialogues for the 42 lessons that lack one (new Cantonese → pilot +
  review gate; build new lines preferentially from already-vetted words).
- Deeper grammar/usage notes and cultural-context notes across lessons.
- These get their own spec → plan → implementation with a correctness review.
