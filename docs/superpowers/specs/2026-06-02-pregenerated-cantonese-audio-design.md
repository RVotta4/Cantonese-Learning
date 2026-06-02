# Pre-generated Cantonese Audio — Design

**Date:** 2026-06-02
**Status:** Approved (design)
**Topic:** Make the speech/playback part of the app reliable and high quality.

## Problem

The app's "speech" is playback-only (text-to-speech). `js/main.js` exposes
`speakCantonese(text)`, which:

1. Tries a **local browser Cantonese voice** (instant, offline) — but Chrome on
   Windows and many devices have no `zh-HK` voice, so it's silent.
2. Falls back to **Google Translate's unofficial TTS endpoint**
   (`translate_tts?tl=yue`) — frequently blocked, rate-limited, or bot-detected,
   so it's flaky.

Reported pain points, in priority order:

- **Often silent / unreliable** — the 🔊 button regularly produces no sound.
- **Poor voice quality** — when it does play, it can sound robotic or wrong.

For a static GitHub Pages site with no backend, any *runtime* TTS approach has a
low quality ceiling and cannot guarantee sound, because it depends on a voice or
host that may not be available.

## Goal

Make 🔊 playback **reliable on every device/browser** and **consistently
high quality**, while staying a pure static site (no backend, no secrets in
client code).

Non-goals (YAGNI — explicitly out of scope for this spec): slow / per-syllable
playback, repeat controls, or other "learning controls." The chosen approach
makes those easy to add later, but they are not built here.

## Approach

**Pre-generate audio at build time and serve static MP3s.** All speakable text
lives in `data/lessons.js` — a fixed, finite set of **~173 unique `hanzi`
phrases** across 11 lessons (the same data backs the lesson, vocabulary,
flashcard, and dashboard pages). We synthesize one high-quality Cantonese MP3
per phrase ahead of time, commit them, and play the static file at click time.
The existing live TTS is kept **only as a fallback** for any phrase that lacks a
file, so behavior degrades gracefully and never regresses.

- **TTS engine:** `edge-tts` (Python), voice `zh-HK-HiuMaanNeural` — natural
  Cantonese, free, no API key.
- **Where generation runs:** **GitHub Actions.** Generation cannot run in the
  Claude sandbox (its network allowlist blocks the Microsoft TTS host with a
  403). CI runners have open network.

### Why not the alternatives

- **Runtime cloud TTS (Azure/Google):** a static site cannot hide an API key,
  and there is no backend to proxy it. Rejected.
- **Improve client-side TTS only:** cheapest, but cannot fix "often silent"
  (no voice guarantee) and keeps a low quality ceiling. Rejected as primary;
  retained as the fallback path.

## Components

### 1. Generator — `scripts/generate_audio.py`

- Reads `data/lessons.js`, extracts every unique `hanzi` string value.
  - Extraction is a pure function over the file text (regex over
    `hanzi: "..."`, handling escaped quotes), so it can be unit-tested without
    network or edge-tts.
- For each phrase, computes a stable key = **SHA-1 of the exact UTF-8 text,
  first 16 hex chars**; the MP3 is `audio/<key>.mp3`. Hashing dedupes repeated
  phrases and avoids Unicode filenames. Only the generator hashes — the manifest
  maps phrase → key directly, so the client never needs to compute a hash.
- **Incremental:** skips phrases whose MP3 already exists → fast re-runs and
  small diffs.
- Writes `audio/manifest.js` assigning `window.AUDIO_MANIFEST = { "<phrase>":
  "<hash>", ... }`.
- Retries a phrase a couple of times on transient failure; on persistent
  failure it skips that phrase (writes **no** manifest entry, so the client
  falls back) and the script exits non-zero so CI surfaces the problem.
- Self-check before exit: every manifest entry must have a real file on disk.
- Prints a summary: total phrases, generated, skipped (already present),
  failed.

### 2. Audio store — `audio/`

- ~173 small MP3s (~2–5 MB total), named `audio/<hash>.mp3`.
- `audio/manifest.js` — a JS global (not JSON loaded via `fetch`) to match the
  project's existing `data/lessons.js` pattern and to keep "just open
  `index.html`" working under `file://` (where `fetch` of a local file fails in
  some browsers).

### 3. Playback — `js/main.js`

- `speakCantonese(text)` gains a first step:
  1. If `window.AUDIO_MANIFEST` has `text`, play `audio/<file>.mp3` via an
     `<audio>` element; on any load/play error, fall through to the existing
     chain.
  2. Otherwise (or on error), use today's `speakOnline` → `speakLocal` chain,
     unchanged.
- `hasCantoneseVoice()` and the lesson-page voice hint are unchanged; they apply
  only to the fallback path.
- Each audio-playing page gets one `<script src="audio/manifest.js"></script>`
  before `js/main.js`: `index.html`, `lesson.html`, `vocabulary.html`,
  `flashcards.html`.

### 4. CI — `.github/workflows/generate-audio.yml`

- **Triggers:** push to `main` filtered to `paths: ['data/lessons.js']`, plus
  `workflow_dispatch` (a manual "Run workflow" button used for the initial full
  generation, since the first run isn't triggered by a content change).
- **Steps:** checkout → setup Python → `pip install edge-tts` → run the
  generator → if `audio/` changed, commit back with a `[skip ci]` message.
- **Permissions:** default `GITHUB_TOKEN` with `contents: write`.
- **Loop prevention:** the `paths` filter (only `data/lessons.js` triggers),
  the `[skip ci]` commit message, and a `concurrency` guard prevent the bot
  commit from re-triggering the workflow.

## Data flow

```
edit data/lessons.js
  -> push
  -> CI: extract hanzi phrases
  -> edge-tts synthesizes MISSING mp3s (zh-HK-HiuMaanNeural)
  -> writes audio/*.mp3 + audio/manifest.js
  -> commits back ([skip ci])
  -> GitHub Pages redeploys
  -> browser loads manifest.js; 🔊 plays static MP3; falls back to live TTS only if missing
```

## Error handling & degradation

- **Generator:** transient retry; persistent failure → skip phrase + non-zero
  exit. A skipped phrase simply has no manifest entry.
- **Client:** `<audio>` `onerror` → live TTS. Missing manifest entirely (e.g.,
  audio not generated yet) → exactly today's behavior. The feature can never
  make playback worse than it is now.

## Testing / verification

No automated test framework exists in the repo today. Plan:

- **Unit test** for the pure extraction function (`scripts/test_extract.py` or
  equivalent): asserts it finds all 173 `hanzi` values, handles escaped quotes,
  and dedupes. This is the only piece with real logic and needs no network.
- **Generator self-check:** manifest↔files consistency, run every invocation.
- **Manual smoke test** (documented): open a lesson, click 🔊, confirm in
  DevTools Network that an `audio/<hash>.mp3` is fetched and played.
- **`audio-test.html`** gains a small read-out of manifest coverage (how many
  phrases have files) for debugging.

## Files

- **New:** `scripts/generate_audio.py`, `scripts/test_extract.py`,
  `.github/workflows/generate-audio.yml`, `audio/` (generated MP3s +
  `manifest.js`).
- **Modified:** `js/main.js`; `index.html`, `lesson.html`, `vocabulary.html`,
  `flashcards.html` (add manifest include); `audio-test.html` (coverage
  read-out); `README.md` (rewrite the "Getting the audio to work" section).

## Constraint to remember

All code, the workflow, and the integration can be built and committed from the
Claude sandbox. The **actual MP3 bytes cannot be produced here** — the sandbox
network blocks the TTS host (403). The first batch of audio is generated by the
CI run (manual "Run workflow") or on a local machine, then committed by CI.
