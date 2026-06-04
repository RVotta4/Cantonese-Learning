# Bulk lesson content enrichment — execution checklist

**Goal:** Author dialogue + notes for the remaining **38 lessons**, matching the
approved pilot style, then turn on the validator's Part B coverage gate.

**Spec:** `docs/superpowers/specs/2026-06-04-lesson-content-enrichment-design.md`
**Pilot (approved):** `pronouns-basics`, `colours`, `weather`.

**User decisions (this run):**
- Style approved: HK spoken register; a few comprehensible-input words beyond vocab OK; grammar + culture notes good.
- Cadence: **run straight through** — validated, committed batches; **push once at the end** (single audio-gen + deploy); user reviews the full set live with audio.

## Standards (from spec §Authoring standards)
- Each lesson: **dialogue 3–4 turns** (grounded in ≥1 of the lesson's own vocab hanzi) + **1–2 grammar notes**, plus a **`Culture — …` note where it adds value**.
- Traditional HK characters; colloquial forms (係/喺/佢/哋/嘅/唔/冇/咩/呀/啦/㗎…), never Mandarin.
- Jyutping lowercase + tone number per syllable; **reuse the lesson's vocab jyutping verbatim** where possible.
- Keep validator green at **every** commit (Part A always; Part B added last).

## Batches (commit per batch; keep `node scripts/test_lessons_content.js` green)
- [ ] **Batch 1 — L1 foundations (3):** question-words, to-have, this-that
- [ ] **Batch 2 — time + descriptors (6):** months-dates, time-words, body-parts, feelings, common-verbs, common-adjectives
- [ ] **Batch 3 — clothing/shopping/food (6):** clothing, shopping, cafe-drinks, fruit, vegetables, meat-seafood
- [ ] **Batch 4 — home + getting around (6):** kitchen, house-rooms, furniture, transport-types, asking-the-way, phone-messaging
- [ ] **Batch 5 — work/study/leisure (6):** occupations, school-study, sports, music-tv, animals-pets, daily-routine
- [ ] **Batch 6 — plans/health/services (6):** making-plans, at-the-doctor, pharmacy, bank-post, hotel, airport-travel
- [ ] **Batch 7 — people + misc (5):** describing-people, personality, measure-words, festivals-cny, emergencies

## Completion
- [ ] **Coverage gate:** add Part B to `scripts/test_lessons_content.js` — every lesson except `["tones-jyutping"]` has `dialogue.length ≥ 3`; every lesson has `notes.length ≥ 1`.
- [ ] Full suite green: content (A+B), deck, practice, practice-store, build_wordbank, audio_text, `node --check data/lessons.js`.
- [ ] Push `main` once → single audio-gen + Pages deploy. Present to user for live review.

## Notes
- `tones-jyutping` is intentionally **dialogue-free** and already has notes → only entry on the exclusion list; needs no further work.
- 10 original rich lessons are out of scope (left untouched); all already satisfy `dialogue ≥ 3`.
