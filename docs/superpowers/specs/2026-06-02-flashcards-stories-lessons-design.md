# Design — Flashcards rework, Stories, and more Beginner lessons

Date: 2026-06-02
Status: Approved (brainstorming)

## Goal

Add three features to the personal Cantonese learning app, staying entirely
within the existing architecture: static HTML/CSS/vanilla JS, content stored as
`window.*` global data files, audio via the `edge-tts` GitHub Action with an
online/local text-to-speech fallback. No build step, no backend, no new runtime
dependencies. All Cantonese content is hand-authored as data (no runtime LLM, no
machine-generated romanisation).

1. **Flashcards** — jyutping-first cards, with a reversible/mixed direction.
2. **Stories** — a HelloChinese-style reading+listening section, seeded with
   beginner stories now, extensible with custom word-driven stories later.
3. **Lessons** — grow the beginner section from 11 to ~50 lessons.

## Non-goals

- No runtime AI/LLM, no server, no accounts, no cross-device sync.
- No auto-generated jyutping; content stays hand-authored.
- Not polishing the existing 11 lessons (deferred by the user).
- Custom (user-word) stories are *enabled* by the engine but authored later, on
  request. This spec only seeds beginner stories.

## Feature 1 — Flashcards (reversible, jyutping-first)

Files: `js/flashcards.js` (logic), `css/style.css` (faces). No data changes.

- **Start screen** gains a direction selector, persisted in `localStorage`
  (`cantoLearning.v1.fcMode`):
  - `recog` — **Jyutping + 漢字 → English** (default)
  - `prod` — **English → Jyutping + 漢字**
  - `mixed` — direction chosen at random per card when the queue is built
- **Card faces:**
  - Recognition: front = jyutping (large) + 漢字 (secondary) + 🔊 + "Tap to
    reveal"; back = English (+ lesson source).
  - Production: front = English + "Tap to reveal"; back = jyutping + 漢字 + 🔊
    (+ lesson source).
- 🔊 always speaks the Cantonese (`hanzi`); audio auto-plays when the answer is
  revealed, in both directions.
- **Unchanged:** the SM-2 scheduler and card identity (keyed on `hanzi`), so
  spaced-repetition progress is shared across all directions.

## Feature 2 — Stories

Files: `data/stories.js` (new content), `stories.html` + `js/stories.js`
(library), `story.html` + `js/story.js` (reader), `css/style.css` (styles).

### Data shape (`window.STORIES`)

```js
{
  id: "the-morning-greeting",
  level: 1,
  category: "beginner",          // "beginner" | "custom"
  title: "A Morning Greeting",
  titleJyutping: "...",          // optional
  blurb: "Two friends meet in the morning.",
  minutes: 2,
  words: [ { hanzi, jyutping, english } ],      // target/highlight words
  sentences: [ { hanzi, jyutping, english } ]   // the story, line by line
}
```

### Reader behaviour (jyutping-first)

- Each sentence shows jyutping (primary) + 漢字 (smaller, secondary) + a 🔊
  button. The English translation is hidden until the user taps that line.
- Controls: **Play whole story** (plays each sentence's audio in sequence) and a
  **Show all translations** toggle.
- A **"Words in this story"** panel lists the target words with audio; those
  words are highlighted where they appear in the 漢字 line.
- Target words are **not** auto-added to the flashcard deck (deck stays
  lesson-driven).
- Opening a story calls `Store.recordActivity()` for streaks.

### Library (`stories.html`)

Lists stories grouped by category (Beginner stories / Your stories), each row
linking to `story.html?id=`.

### Audio pipeline

- `scripts/extract_phrases.py` already matches any `hanzi: "..."`. Extend
  `scripts/generate_audio.py` `load_phrases()` to read **both** `data/lessons.js`
  and `data/stories.js`.
- Add `data/stories.js` to the trigger `paths` in
  `.github/workflows/generate-audio.yml`.
- On the feature branch, sentence/word audio plays via the existing online/local
  TTS fallback. High-quality MP3s are generated on merge to `main`, identical to
  how lessons work today.

### Seed content

~5 beginner stories built from common words already taught (greetings, family,
numbers, food, daily routine).

## Feature 3 — Lessons (grow beginner section to ~50)

File: `data/lessons.js` (append ~40 lesson objects). No renderer changes — the
existing library, lesson, vocabulary, and flashcard code all read
`window.LESSONS`.

- **Lighter depth** per lesson: `intro` + 6–8 `vocab` + ~3 `examples`;
  `dialogue`/`notes` only where they fall out naturally.
- Continue the existing `order` numbering within each level.
- **Topics (approved):**
  - Level 1 (Absolute Beginner, +4): pronouns & this/that; basic question words
    (what/who/where); "to have" 有/冇; this/that & measure word 個.
  - Level 2 (Beginner, +36): colours; months & dates; weather; body parts;
    feelings; common verbs; common adjectives; clothing; shopping & bargaining;
    café & drinks; fruit; vegetables; meat & seafood; in the kitchen; house &
    rooms; furniture; transport types; asking the way (buildings); phone &
    messaging; occupations; school & study; sports; music & TV; animals & pets;
    daily routine; time words (yesterday/today/tomorrow); making plans &
    invitations; at the doctor; pharmacy; bank & post office; hotel; airport &
    travel; describing people; personality; measure words; festivals (Lunar New
    Year); emergencies & asking for help.
- New vocab flows automatically into the Vocabulary page and Flashcards.

## Cross-cutting

- **Navigation:** add a **Stories** link to the header nav on every page
  (`index.html`, `lessons.html`, `lesson.html`, `vocabulary.html`,
  `flashcards.html`, plus the new `stories.html`/`story.html`). Add a small
  Stories card/section to the dashboard.
- **Storage:** `cantoLearning.v1` gains one optional `fcMode` key. No other
  schema change; existing progress is untouched.

## Testing

No JS test framework exists in the project, so:

- Extend `scripts/test_extract.py` to assert story phrases are extracted from
  `data/stories.js` content.
- `node --check` every changed JS/data file for syntax validity.
- Run `python3 scripts/generate_audio.py --dry-run` to confirm lesson + story
  phrases parse and key correctly.
- Manual walkthrough of the flashcard direction modes and the story reader.
- Caveat: authored jyutping is hand-checked, not machine-verified.

## Risks

- **Content accuracy:** ~40 lessons + ~5 stories of hand-authored Cantonese is
  large; jyutping/translation errors are possible. Mitigation: stick to common,
  textbook-standard vocabulary; user will refine later.
- **Audio latency on branch:** until merged to `main`, new phrases use the
  online TTS fallback (needs internet). Acceptable and consistent with current
  behaviour.
