# Lesson Content Enrichment — Design Spec

- **Date:** 2026-06-04
- **Status:** Approved (brainstorm complete)
- **Branch:** `claude/eager-hawking-Kp0X6`
- **Sub-project:** 2 of 2 (follows the per-lesson practice feature)

## Goal

Bring the 42 "thin" lessons up to the depth of the 10 "rich" lessons by authoring an
opening **dialogue**, **grammar/usage notes**, and **cultural context** for each. This
improves the reading/listening content and — because the practice session builder already
draws on `lesson.dialogue` — automatically deepens the practice sessions for those lessons.

## Current state (grounded in the data)

- All lessons live in `data/lessons.js` — the single source of truth (a JS file, not JSON,
  so it works online and when opened locally). **52 lessons total.**
- Per-lesson schema: `id, level, levelName, order, title, subtitle, minutes, intro,
  dialogue[], vocab[], examples[], notes[]`.
  - `dialogue` item: `{ speaker, hanzi, jyutping, english }`
  - `notes` item: `{ title, body }`
- **10 "rich" lessons** have a non-empty `dialogue` + `notes`. **42 "thin" lessons** have
  `dialogue: []` and no `notes`, but all have solid `vocab` and `examples`.
- The renderer `js/lesson.js` **already renders** a "Dialogue" section and a
  "Grammar & Notes" section (from `notes`). **No UI or CSS work is required** — this is a
  pure content/data project.
- `js/practice-logic.js#buildSession` already consumes `lesson.dialogue` (for cloze and
  reorder tasks), so authoring dialogues directly enriches practice.
- Audio: the GitHub Action "Generate Cantonese audio" generates MP3s for hanzi found in the
  data when `data/*.js` changes land on `main`. New dialogue lines get audio automatically
  on merge. Notes are English prose and need no audio.

## Scope

For each **thin** lesson:

- **dialogue:** 3–4 turns of natural Hong Kong spoken Cantonese, grounded mainly in the
  lesson's own vocab.
- **notes:** 1–3 grammar/usage cards (`{title, body}`).
- **culture:** where it genuinely adds value, one additional note card whose title begins
  `Culture — `, folded into the existing Notes section (no UI change).

**Special case:** `tones-jyutping` (the pronunciation-foundation lesson) stays
**dialogue-free** — it receives notes only. So **41 lessons gain dialogues; all 42 gain
notes.**

The 10 existing rich lessons are **left untouched**.

## Content model & per-lesson requirements

No schema change, no new fields, no UI/CSS change. Each authored item must satisfy:

- **dialogue line:** non-empty `speaker` (e.g. `"A"`/`"B"`, or a name), `hanzi` (traditional),
  `jyutping` (lowercase, tone-numbered, space-separated syllables), `english` (natural).
- **vocab grounding:** each dialogue must reference **≥ 1** of its lesson's vocab `hanzi`
  (most lines should); this keeps difficulty on-level and ensures audio/practice overlap.
- **note:** non-empty `title` and `body`; body 1–3 sentences, concrete and tied to the lesson.
- **culture note (optional):** `title` starts with `Culture — `; HK-specific where possible.

## Authoring standards (style guide — to be finalized from pilot feedback)

- **Dialect:** Hong Kong spoken Cantonese, **traditional characters**. Use colloquial forms,
  not Mandarin: 係 (not 是), 喺 (location), 佢, 哋, 嘅 (not 的), 唔 (not 不), 冇 (not 沒),
  咩 / 乜, 點解; sentence-final particles 呀 / 啦 / 喎 / 㗎 / 呢 / 咩.
- **Jyutping:** lowercase letters + a tone number 1–6 per syllable, syllables separated by
  spaces, conceptually aligned with the hanzi. Proper nouns (e.g. "Robbie") may appear
  verbatim, untoned.
- **English:** idiomatic, not word-for-word; match the friendly tone of existing lessons.
- **Difficulty:** stay within the lesson's level; prefer the lesson's own vocab plus a few
  already-introduced words; avoid piling on new vocabulary.
- **Length:** dialogue 3–4 turns (max ~6); notes 1–3 cards including any culture card.
- **Voice:** one consistent authorial voice. The learner is a beginner named Robbie; rich
  lessons sometimes use "Robbie" as speaker A — fine to continue.

## Validation

New `scripts/test_lessons_content.js` (Node, no DOM — loads `data/lessons.js` by defining a
`window` global and `eval`-ing the file, the same pattern as the existing Node tests). It has
two parts:

**A. Well-formedness (always enforced — must stay green from the pilot onward).**
For every lesson, and for whatever dialogue/notes content exists:
1. `dialogue`, `vocab`, `examples`, `notes` are arrays.
2. Every dialogue line has non-empty `speaker`, `hanzi`, `jyutping`, `english`.
3. Every note has non-empty `title` and `body`.
4. **Jyutping well-formedness:** every whitespace-separated token of a dialogue's `jyutping`
   that is "Cantonese" (i.e. not an ASCII/Latin proper noun and after stripping trailing
   punctuation `?!.,…`) matches `/^[a-z]+[1-6]$/`. Latin-letter tokens (proper nouns) are
   tolerated.
5. **Vocab grounding:** the concatenation of a dialogue's `hanzi` contains ≥ 1 of the
   lesson's vocab `hanzi` as a substring.
6. **Mandarinism lint (high-precision, dialogue `hanzi` only).** Dialogue hanzi contain none
   of a curated denylist of characters that are essentially never correct in beginner HK
   Cantonese and signal a Mandarin slip or accidental simplified input:
   `喝` (drink → 飲), `這` (this → 呢), `沒` (→ 冇/未), `們` (plural → 哋), and the
   simplified-only forms `这 吗 没 们 个`. On a hit, fail with the lesson id + offending
   character. The list is **deliberately conservative (precision over recall):** characters
   with legitimate Cantonese uses are **not** flagged — `不` (不過/不如), `的` (的士),
   `是` (但是/是日), `嗎` (你好嗎). The lint runs on **dialogue hanzi only**, not on notes
   bodies, which may intentionally discuss or contrast other forms. The pilot and human
   review remain the real safety net.

**B. Coverage (the completion gate — added in the final task, when content exists to satisfy
it).** Every lesson except the exclusion list has `dialogue.length ≥ 3`; every lesson has
`notes.length ≥ 1`. The exclusion list starts as `["tones-jyutping"]`; the pilot verifies the
10 existing rich lessons already meet `dialogue.length ≥ 3` (they are out of scope to modify),
and adds any that don't to the exclusion list rather than touching them.

Splitting it this way keeps the whole suite **green at every commit**: pilot and bulk commits
satisfy well-formedness (A); the coverage assertion (B) is introduced in the same final task
that completes coverage.

Also required: `node --check data/lessons.js`, and the existing suites
(`test_practice.js`, `test_practice_store.js`, `test_deck.js`, the two Python suites) stay green.

## Process / sequencing

1. **Pilot.** Author dialogue + notes (+culture) for **`pronouns-basics`** (L1 grammar),
   **`colours`** (L1 concrete vocab), and **`weather`** (L2 practical/small-talk). Add
   `scripts/test_lessons_content.js` with the well-formedness checks (A). Run it + `node --check`.
   **User reviews** the three lessons for accuracy and naturalness; feedback is folded back
   into the "Authoring standards" section above.
2. **Bulk.** Author the remaining ~38 thin lessons (plus notes for `tones-jyutping`) in level
   order, in small batches, validating well-formedness + `node --check` after each batch.
3. **Completion.** Add the coverage assertion (B) to the content test; run the full suite;
   **user spot-check**; then finish the branch (merge to `main`), which triggers the audio
   Action to generate MP3s for the new dialogue lines.

## Out of scope (YAGNI)

- No UI or CSS changes; no new lesson fields or schema migration.
- No changes to the 10 existing rich lessons.
- No audio-pipeline code (the existing Action handles new audio).
- No new app features.

## Risks & mitigations

- **Linguistic accuracy (primary risk).** An AI authoring Cantonese can introduce wrong
  tones, unnatural phrasing, or Mandarin-isms. Mitigated by: the pilot review gate, the
  Mandarinism lint, grounding dialogues in already-vetted lesson vocab, a final human
  spot-check, and the fact that the learner can flag issues live (content is data, easily fixed).
- **Large single-file edits.** `data/lessons.js` is ~1500 lines and grows. Mitigated by the
  structural test + `node --check` after every batch, and small batches.
- **Audio cost.** Only new dialogue hanzi generate audio; notes are English. The Action runs
  once on merge.

## Success criteria

- All 52 lessons render a Grammar & Notes section, and all except `tones-jyutping` render a
  Dialogue.
- `scripts/test_lessons_content.js` is green (well-formedness **and** coverage); all existing
  suites green; `node --check` clean.
- Pilot approved by the user; the full set spot-checked before merge.
