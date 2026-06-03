# Design: Word Bank, Flashcard Decks, Audio Quality & Comprehensible-Input Stories

**Date:** 2026-06-03
**Status:** Approved design, pending spec review
**Branch:** `claude/eager-hawking-Kp0X6`

## Summary

Three user-requested improvements to the Cantonese Learning site, built in the
project's existing static-site style (plain HTML/CSS/JS, `data/*.js` as the
single source of truth, localStorage progress, pre-generated edge-tts audio):

1. **Flashcard decks** — stop forcing *every* lesson word into review. Add a
   personal deck the user fills with "+ Add to deck" buttons, the way
   CantoneseClass101 works. Flashcards review only the deck.
2. **Audio quality** — slow speech down for clarity and fix tone-2 (mid-rising)
   words that don't rise, focusing on isolated single characters.
3. **Comprehensible-input stories + podcast** — five short themed stories built
   from the user's own CantoneseClass101 word bank, plus a "podcast breakdown"
   player that walks through a story sentence-by-sentence, word-by-word.

The user's 321-word CantoneseClass101 "My Word Bank" export underpins all three:
it is decoded (see `scripts/decode_wordbank.py` →
`docs/superpowers/specs/2026-06-03-wordbank-source.json`) and becomes a
first-class dataset, `data/wordbank.js`.

## Goals

- Flashcard review is opt-in per word; the deck starts empty.
- The 321 word-bank words are browsable, searchable, audio-enabled, and
  addable to the deck.
- Cantonese audio is noticeably clearer (slower) and tone-2 single characters
  read with a rising contour; any remaining wrong word is a one-line fix.
- The user can read/listen to five comprehensible-input stories made from their
  own vocabulary, and play a guided "podcast" breakdown of any story.

## Non-goals

- No backend, accounts, or build step — it stays a static site.
- No spaced-repetition algorithm changes (the existing SM-2-style scheduler in
  `data-utils.js` is reused as-is).
- No attempt to perfectly verify audio tone by ear inside the sandbox (audio
  generation needs internet and runs in GitHub Actions); tone fixes ship as
  tunable mechanisms validated by the user.
- No downloadable podcast MP3 (see Decisions).

## Decisions (resolved during brainstorming)

| Decision | Choice |
|----------|--------|
| Word-bank role | First-class: browsable **Word Bank** page + deck source + story source |
| Deck start state | **Empty**; user adds words explicitly |
| Deck storage | Store the **full word object** per entry (self-contained, dataset-independent) |
| Tone fix approach | **Slow down + per-word override table + context-synth for single characters** |
| Known bad words | None supplied yet; seed likely culprits, user validates later |
| Story style | **5 short themed stories** + **podcast breakdown** player |
| Podcast implementation | **Client-side scripted player** sequencing existing clips (no pre-rendered file) |

## Architecture overview

```
data/wordbank.js      window.WORDBANK = [{hanzi,jyutping,english,topic}, ...]  (NEW)
data/lessons.js       window.LESSONS   (unchanged)
data/stories.js       window.STORIES   (+5 custom stories)
audio/manifest.js     phrase -> mp3 key (regenerated to include wordbank+stories)

js/data-utils.js      window.Vocab (+ wordbank) ; window.Store (+ deck API)
js/deck-ui.js         window.Deck — shared "+ Add / ✓ Added" button helper      (NEW)
js/flashcards.js      card pool = Store.deckList()  (was Vocab.all())
js/wordbank.js        Word Bank page controller                                  (NEW)
js/vocab.js           + add-to-deck buttons
js/lesson.js          + add-to-deck buttons, + "Add all" per vocab section
js/story.js           + add-to-deck on story words, + "Podcast breakdown" player
js/stories.js         (list — unchanged; custom stories already grouped)
js/dashboard.js       stats reflect the deck

wordbank.html         Word Bank page                                            (NEW)
*.html                nav gains a "Word Bank" link

scripts/generate_audio.py   + slower rate, + overrides, + single-char context, + --force
scripts/decode_wordbank.py  PDF -> JSON decoder                                  (NEW, done)
.github/workflows/generate-audio.yml   + force input, + wordbank.js trigger
```

## Component design

### A. Word-bank dataset — `data/wordbank.js`

- Generated from `2026-06-03-wordbank-source.json`, hand-cleaned for ~25
  column-flow artifacts where one row's English absorbed the next word (e.g.
  `咁 / gam3 / "so ⾼ gou1 high"` should be `咁 / gam3 / "so"` plus a separate
  `高 / gou1 / "high"`). These are identified by an English field containing CJK
  or a stray jyutping token.
- Shape mirrors lesson vocab so existing components reuse cleanly:
  ```js
  window.WORDBANK = [
    { hanzi: "現金", jyutping: "jin6 gam1", english: "cash", topic: "Money & banking" },
    ...
  ];
  ```
- `topic` is derived from the PDF's page clustering (Money & banking, TV &
  movies, Hotel & rooms, Greetings, Numbers, Food & dining, Family, Time &
  days, Weather, Jobs, etc.) so the Word Bank page can group/filter.

### B. Shared data + store — `js/data-utils.js`

**Vocab:** `window.Vocab.all()` keeps returning lesson vocab. Add
`window.Vocab.wordbank()` returning the word-bank entries (shaped like vocab,
with `source: "wordbank"`), so pages and the deck can use a uniform record.

**Store deck API** (new, persisted in the existing `cantoLearning.v1` blob under
`data.deck`, keyed by hanzi):

```js
Store.addToDeck(word)     // word = {hanzi,jyutping,english,source,...}; idempotent
Store.removeFromDeck(id)  // id = hanzi
Store.inDeck(id)          // boolean
Store.deckList()          // array of stored word objects (the flashcard pool)
Store.deckCount()         // number
```

`reset()` preserves the deck unless explicitly clearing it; SRS state keyed by
hanzi continues to work because deck ids are hanzi.

### C. Add-to-deck UI — `js/deck-ui.js` (shared)

A tiny module so the toggle is identical everywhere and not copy-pasted:

```js
Deck.button(word)   // -> HTML string for a "+ Add" / "✓ Added" toggle (data-deck attr)
Deck.mount(root)    // delegated click handler: toggles Store deck + button label
```

Used by: lesson vocab cards, vocabulary cards, Word Bank cards, story word
cards. Each vocab section also gets an **"Add all"** button that adds every word
in that section/topic.

### D. Flashcards — `js/flashcards.js`

- `var all = window.Store.deckList();` replaces `window.Vocab.all();`.
- Empty-deck start screen: "Your deck is empty. Add words from a lesson, the
  Word Bank, or Vocabulary to start reviewing," with links to those pages.
- Everything else (modes, SRS scheduling, due/new/known counts) is unchanged but
  now computed over the deck.

### E. Word Bank page — `wordbank.html` + `js/wordbank.js`

- Mirrors `vocabulary.html` / `vocab.js`: search box, **topic** filter, count,
  responsive `vocab-grid`.
- Each card: hanzi + 🔊 audio + jyutping + English + a `Deck.button`.
- Per-topic **"Add all"** control.
- Linked from main nav (added to every page's `<nav class="main-nav">`).

### F. Audio — `scripts/generate_audio.py` & workflow

1. **Slower, clearer:** synthesize with `edge_tts.Communicate(text, VOICE,
   rate=RATE)` where `RATE = "-15%"`.
2. **Per-word overrides:** `OVERRIDES = { hanzi: "spoken text" }`. When a word
   is mis-read, synthesize `OVERRIDES[hanzi]` but key the MP3/manifest by the
   original hanzi, so the on-screen word never changes. This is the universal
   escape hatch for any wrong word.
3. **Single-character tone safeguard:** isolated single characters are where
   edge-tts most often flattens a tone-2 rise (utterance-final declarative
   fall). For 1-character words *not already in `OVERRIDES`*, synthesize with a
   prosodic nudge that avoids the terminal fall — default: append a trailing
   `，` so the syllable is rendered with a continuation (non-falling) contour,
   adding no extra spoken syllable. Implemented as a single
   `spoken_text(word)` helper so the tactic is centralized and tunable; if a
   character is still wrong it escalates to `OVERRIDES` (e.g. a same-tone
   compound, or the `zh-HK-WanLungNeural` voice).
4. **Force regenerate:** add `--force` to ignore the "skip existing" check so the
   ~560 existing files are replaced with the slower versions. Read
   `data/wordbank.js` in addition to lessons/stories so word-bank audio exists.
5. **Workflow:** `generate-audio.yml` gains a `workflow_dispatch` `force` input
   (passed through as `--force`) and adds `data/wordbank.js` to its push paths.

> Honesty note: tone correctness can't be verified inside the sandbox. The
> slowdown is a certain clarity win; the single-char nudge and overrides are
> best-effort and easy to tune per word once the user listens. 90 of the 321
> word-bank words are single characters, so the safeguard has broad reach.

### G. Stories — `data/stories.js`

Five new `category: "custom"` stories (surface under **"Your stories"** via the
existing `js/stories.js` grouping), each starring **Robbie**, each reusing
word-bank vocabulary, written as comprehensible input (short sentences, high
repetition, mostly familiar words, 5–8 lines):

1. **At the Bank** — 開戶, 存錢, 攞錢, 現金, 信用卡, 利息, 銀行, 至少
2. **Checking into a Hotel** — 訂, 標準房, 雙人房, 退房, 房, 幾大, 呎
3. **Dinner & the Bill** — 餐廳, 好食, 點, 唔該, 埋單, 單, 貴, 平
4. **A Rainy Saturday** — 今日, 落雨, 焗, 熱, 得閒, 睇電影, 電視節目
5. **My Family & Their Jobs** — 爸爸, 媽媽, 大佬, 細妹, 老師, 醫生, 律師, 工程師

Each story's `sentences[]` provide hanzi/jyutping/english; new sentence audio is
auto-generated by the pipeline.

### H. Podcast breakdown — `js/story.js`

A new **"▶ Podcast breakdown"** button beside "Play whole story." It runs a
scripted, cancelable auto-player. For each sentence:

1. Highlight the line, play the full **sentence** audio (slow).
2. Reveal the English caption.
3. For each target **word** that appears in the line: highlight it, play the
   word's audio, surface its jyutping + English.
4. Replay the full sentence, then advance.

All Cantonese audio comes from existing per-sentence/per-word MP3s (already in
the pipeline). English is shown as captions and, if a local English voice
exists, optionally spoken via `speechSynthesis` for a true podcast feel. Reuses
the existing `playToken` cancellation pattern so navigating away or pressing
another control stops it cleanly.

### I. Dashboard — `js/dashboard.js`

- "Cards due today" and "Words known" read from the **deck**
  (`Store.deckList()`) instead of all vocab; with an empty deck they show `0`
  and a hint.
- Word of the Day may draw from `Vocab.wordbank()` so it reflects the user's own
  saved words.

## Data flow

1. User taps **+ Add to deck** on a word (lesson / Word Bank / vocab / story) →
   `Store.addToDeck(word)` stores the full object under `data.deck[hanzi]`.
2. **Flashcards** read `Store.deckList()` as the entire card pool; SRS schedules
   per hanzi as before.
3. **Audio**: `speakCantonese(hanzi)` plays `audio/<key>.mp3` from the manifest;
   the manifest now covers lessons + stories + word bank, regenerated slower.
4. **Stories/podcast**: `story.js` sequences `speakCantonese()` calls over the
   story's sentences and words.

## Operational note (must communicate to user)

Audio generation calls Microsoft's TTS servers, which the web sandbox can't
reach. After merge, run the **"Generate Cantonese audio"** GitHub Action with
`force: true` to produce the slower MP3s + new word/story audio. Until then,
playback falls back to the online Cantonese voice — nothing breaks, audio is
just at the old speed for already-generated phrases.

## Testing strategy

- `scripts/test_extract.py` style: extend phrase extraction tests if extraction
  logic changes; add a small test that `spoken_text()` leaves multi-char words
  untouched and nudges single characters.
- `decode_wordbank.py` is verified by the committed source JSON (321 unique
  words, all with jyutping).
- Manual/browser checks (documented in the plan): deck add/remove persists;
  flashcards review only the deck; empty-deck state; Word Bank search/filter;
  story podcast player sequences and cancels correctly; nav link present on all
  pages. JS is dependency-free and runs by opening the files, matching the
  project's "just open index.html" workflow.

## Risks & mitigations

- **Tone fix unverifiable here** → ship tunable mechanisms; user validates;
  one-line override per stubborn word.
- **Force-regen rewrites ~560 files** → large but expected one-time audio commit
  via Actions (the workflow already commits audio); keys are stable so only
  bytes change.
- **Word-bank cleanup** → the ~25 artifact rows are explicitly enumerated by a
  detection rule (English contains CJK / stray jyutping) and fixed during
  implementation.
- **Deck-based dashboard with empty deck** → explicit zero/hint states.

## Build order (for the implementation plan)

1. Foundation: `data/wordbank.js` (cleaned) + `Vocab.wordbank()` + nav link +
   `wordbank.html`/`js/wordbank.js`.
2. Decks: `Store` deck API + `js/deck-ui.js` + wire add buttons everywhere +
   `flashcards.js` pool swap + dashboard stats.
3. Audio: `generate_audio.py` (rate, overrides, single-char nudge, `--force`,
   read wordbank) + workflow input.
4. Stories + podcast: 5 custom stories + `story.js` breakdown player.
