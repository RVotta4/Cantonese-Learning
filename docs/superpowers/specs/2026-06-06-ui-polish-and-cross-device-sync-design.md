# Design: UI Polish + Cross-Device Progress Sync

**Date:** 2026-06-06
**Status:** Approved design, pending spec review
**Branch:** `claude/hopeful-bardeen-6Y1wF`

## Summary

A single additive "small upgrade" with two parts, shipped together:

1. **UI / UX** — make the app less plain, more motivating, and more
   self-directing, without changing the existing look-and-feel or content.
   Adds a dashboard **"Today" panel** (daily goal ring + prioritised next
   steps), **motivation** features (prominent streak, achievement badges,
   celebration moments, an active-days heatmap), and **visual polish**
   (dark mode + small refinements).
2. **Cross-device sync** — the whole progress blob (today stored only in
   `localStorage`) is mirrored to **one private GitHub Gist** the user owns,
   so progress follows them between laptop and phone. A new **Settings page**
   hosts sync setup, the theme toggle, manual **Export / Import** backup, the
   daily-goal control, and reset.

No backend server, no framework, no rewrite. It stays a static site of plain
HTML pages including `data/*.js` (globals) + `js/*.js` (IIFEs assigning
`window.*`), with `localStorage` for state and `window.speakCantonese` for
audio. The existing `window.Store` API is preserved; new behaviour is added
around it in small, independently testable modules.

## Goals

- The dashboard opens with a clear answer to **"what do I do next?"**: a daily
  goal ring plus a short, prioritised list of next actions that deep-link into
  review / lessons / stories.
- The app feels **rewarding to return to**: a prominent streak, a small set of
  achievement badges earned from data already tracked, light celebration
  moments (confetti + toast) on meaningful wins, and a 12-week activity heatmap.
- **Dark mode** that is remembered per device and applies with no flash.
- **Progress syncs across devices** automatically once connected, behind a
  single secret (a GitHub token), via an **additive merge** so no accumulated
  progress is ever lost to an overwrite.
- A **manual Export / Import** backup exists independent of cloud sync.
- Pure logic (merge, streak, achievements, daily goal) is isolated in
  `window`-assigned modules with Node unit tests, mirroring `data-utils.js` /
  `scripts/test_deck.js`.

## Non-goals

- **No backend, server, or build step** — it stays a static site.
- **No multi-user accounts, passwords, or auth system.** Because the site is
  public (GitHub Pages), no secret can be embedded in the code; the "login" is
  simply "this is me," established by a personal token the user pastes per
  device. One user, by design.
- **No third-party sync service** (the user chose Gist over a type-a-code
  store). No Firebase / Supabase / Pantry / JSONBin.
- **No real-time / multi-writer collaboration.** Sync is pull-merge-push with a
  conflict-free merge; it is not a live CRDT or websocket sync.
- **No new language content, lessons, or audio.** This upgrade is UI + sync only.
- **No new SRS scheduler.** The existing SM-2 deck is unchanged.

## Decisions (resolved during brainstorming)

| Decision | Choice |
|----------|--------|
| Overall thrust | Both UI polish **and** cross-device sync, shipped as one upgrade |
| UI focus areas | All three the user picked: visual polish, motivation, "what next" guidance |
| Sync backend | **GitHub Gist** (one private gist the user owns) — not Firebase, not a type-a-code store |
| "Login" model | **Personal access token pasted per device** (gist scope); no username/password, single user |
| Token storage | Separate, **never-synced** `localStorage` key; **never written into the gist** |
| Conflict handling | **Field-level conflict-free merge**; streak/heatmap recomputed from an `activeDays` source of truth |
| Theme scope | **Device-local** (a night-mode phone shouldn't force the laptop dark); not synced |
| Daily goal | **Synced** number (default 10 card reviews/day); measured by reviews completed today |
| Backup | **Export / Import** included regardless, as a safety net independent of sync |
| Out of scope | Backend, accounts, frameworks, new content/audio, real-time sync |

## Architecture overview

### New files

- **`js/progress-merge.js`** → `window.ProgressMerge` *(pure, unit-tested)*
  - `mergeProgress(a, b)` → conflict-free merged blob (see Merge strategy).
  - `recomputeStreak(activeDays, today)` → consecutive-day streak ending today
    or yesterday, computed from the `activeDays` map.
  - `mergeTombstoned(addsA, addsB, remsA, remsB)` → the present set for a
    deletable collection: an item survives iff its latest add time beats its
    latest remove time (used for `deck` and `completed`).
  - No DOM, no `localStorage`, no `fetch` — Node-`eval`-able.
- **`js/gamification.js`** → `window.Gamification` *(pure, unit-tested)*
  - `ACHIEVEMENTS` — ordered list of `{ id, label, icon, desc, test(summary) }`.
  - `summarize(store, vocab)` → `{ lessonsDone, wordsKnown, streak,
    cardsReviewedTotal, storiesRead, bestPractice, level1Done }`.
  - `evaluateAchievements(summary, unlocked)` → array of newly-earned ids.
  - `dailyGoalStatus(store, today)` → `{ target, done, met, pct }`
    (`done` = reviews completed today; `pct` capped at 100).
  - No DOM / I/O.
- **`js/sync.js`** → `window.Sync` (gist client + orchestration)
  - `config()` / `setConfig(patch)` over the non-synced `cantoLearning.sync`
    key `{ token, gistId, autoSync, lastSync }`.
  - `isEnabled()` → has a token.
  - `connect(token)` → validate token, find-or-create the gist, persist
    `gistId`; returns status.
  - `pull()` → GET gist → remote blob or `null`.
  - `push(blob)` → PATCH gist file (creates gist if needed).
  - `syncNow()` → `pull` → `mergeProgress(local, remote)` → save merged locally
    → `push(merged)` → update `lastSync`; returns `{ ok, when, error? }`.
  - `findGist()` → list user gists, match by filename/description so a fresh
    device discovers the existing gist from the token alone.
  - Listens for `cantoLearning:change` (below), debounces ~4s, then `syncNow()`.
  - Thin I/O wrapper around the pure `ProgressMerge`; degrades gracefully
    offline (keeps working locally, surfaces "not synced").
- **`js/theme.js`** → `window.Theme`
  - `get()` / `set('light'|'dark'|'system')` over device-local
    `cantoLearning.prefs.theme`; `apply()` sets `data-theme` on `<html>`;
    `toggle()` for the header button; honours `prefers-color-scheme` for
    `system`.
- **`js/celebrate.js`** → `window.Celebrate`
  - `toast(msg, opts)` — transient, accessible (`role="status"`), auto-dismiss.
  - `confetti(opts)` — self-contained ~canvas burst, **no external library**;
    a no-op under `prefers-reduced-motion`.
  - `goal()`, `streak(n)`, `achievements(defs)` — compose toast + confetti.
- **`js/today.js`** → renders the dashboard **Today panel** + **heatmap**
  - `renderToday(mountEl)` — goal ring (inline SVG) + prioritised next steps.
  - `renderHeatmap(mountEl)` — last ~12 weeks (84 days) shaded by that day's
    review count, from `activeDays` / `reviews`.
- **`settings.html`** — new page (mirrors the other sub-pages' shell).
- **`js/settings.js`** — Settings controller (theme, sync, daily goal,
  export/import, reset, achievements gallery).
- **`scripts/test_progress_merge.js`** — Node tests for `progress-merge.js`.
- **`scripts/test_gamification.js`** — Node tests for `gamification.js`.

### Modified files

- **`js/data-utils.js`** (`window.Store`) — additive only; existing methods and
  the `cantoLearning.v1` shape stay backward-compatible:
  - On `save()`, set `data.updatedAt = Date.now()` and dispatch a
    `cantoLearning:change` `CustomEvent` on `window` (the decoupling seam
    `sync.js` listens on). Guarded so it is inert outside a browser (tests).
  - `recordActivity()` now also records `data.activeDays[todayStr()] = true`
    and derives `streak` via `ProgressMerge.recomputeStreak`; `getStreak()`
    reads from `activeDays`. **Migration:** if `activeDays` is absent, seed it
    from any existing `lastActive` so current streaks survive.
  - `rate(id, rating)` increments `data.reviews[todayStr()]` (per-day review
    counter powering the goal ring and "cards reviewed" total) and calls
    `recordActivity()`.
  - **Tombstones for reversible collections** (so deletes survive a union
    sync): deck entries gain an `at` (added-ms); `completed[id]` stores the
    completion ms instead of `true`. Two tombstone maps are added:
    `deckRemoved[hanzi]=ms` and `completedRemoved[id]=ms`.
    `removeFromDeck`/`unmarkLessonComplete` write the tombstone (and delete the
    entry); `addToDeck`/`markLessonComplete` write a fresh `at`/ms (and clear
    any tombstone). Readers (`inDeck`, `isLessonComplete`, `deckList`,
    `*Count`) are unchanged in behaviour. **Migration:** legacy `completed[id]
    === true` is read as completed; deck entries without `at` are treated as
    added long ago — both still merge correctly.
  - New: `getDailyGoal()` / `setDailyGoal(n)` (default 10);
    `getReviewsToday()`; `getActiveDays()`; `getReviews()`;
    `markStoryRead(id)` / `getStoriesRead()` (a `storiesRead` set, union-merged);
    achievement persistence `getAchievements()` /
    `unlockAchievements(ids)` (stores `{ [id]: firstUnlockedMs }`).
  - `reset()` clears every progress collection — `srs`, `deck`, `completed`,
    `practice`, `reviews`, `activeDays`, `achievements`, `storiesRead`, and the
    tombstone maps — and bumps `updatedAt`. Device `prefs` (theme) and `sync`
    config live in separate keys and are untouched. If sync is connected, reset
    also overwrites the gist with the cleared blob (see Sync orchestration for
    the multi-device caveat).
- **`js/dashboard.js`** — mount the Today panel + heatmap at the top of `main`;
  surface the streak prominently; run achievement evaluation on load and fire a
  celebration for anything newly earned; keep existing tiles.
- **`js/flashcards.js`** / **`js/practice.js`** — after a session, evaluate
  achievements and celebrate the daily goal when it's first met that day
  (logic lives in `gamification.js` + `celebrate.js`; these just call it).
- **`js/lesson.js`** — on mark-complete, evaluate achievements + celebrate.
- **`js/story.js`** — call `Store.markStoryRead(id)` when a story is opened
  (enables the "read a story" achievement and the Today "read a story" step).
- **All HTML pages** — three mechanical edits each:
  1. a tiny **inline `<head>` snippet** that applies the saved theme before
     first paint (prevents a light→dark flash);
  2. a **Settings** link (gear) + a **theme toggle** button in the header nav;
  3. include `js/theme.js` and, on pages that include `js/data-utils.js`,
     also `js/sync.js` (so any page can pull on load and push on change).
- **`css/style.css`** — additions only:
  - `[data-theme="dark"]` overrides of the existing `:root` design tokens
    (the variable system already in place makes this localised).
  - Today panel + goal ring, achievement badges (locked/unlocked), heatmap
    grid, toast + confetti canvas, header theme/settings controls, Settings
    page layout. Reuse existing tokens/classes where possible.

### Script include order (pages using sync/gamification, e.g. `index.html`)

```
data/lessons.js
audio/manifest.js
js/data-utils.js        (window.Store, window.Vocab; dispatches change events)
js/progress-merge.js    (window.ProgressMerge)   ← before sync
js/sync.js              (window.Sync; listens for changes, pulls on load)
js/gamification.js      (window.Gamification)
js/celebrate.js         (window.Celebrate)
js/theme.js             (window.Theme)
js/main.js              (speakCantonese, nav, theme toggle wiring)
js/today.js             (dashboard only)
js/dashboard.js
```

The inline theme snippet runs in `<head>` first; `js/theme.js` only wires the
interactive toggle afterwards.

## Data model

The synced blob remains `cantoLearning.v1`; two **non-synced** sibling keys are
added. Only `cantoLearning.v1` is ever written to the gist.

```jsonc
// cantoLearning.v1  — synced (mirrored to the gist)
{
  "srs":        { "<hanzi>": { "ease","interval","reps","lapses","due","last" } },
  "completed":  { "<lessonId>": 1717689600000 },// ms completed at (was `true`; migrated)
  "deck":       { "<hanzi>": { "hanzi","jyutping","english","source","lessonId","lessonTitle","at": 1717689600000 } },
  "deckRemoved":      { "<hanzi>": 1717689600000 },   // NEW — tombstones for removed deck words
  "completedRemoved": { "<lessonId>": 1717689600000 },// NEW — tombstones for un-completed lessons
  "practice":   { "<lessonId>": { "best","times","last" } },
  "activeDays": { "YYYY-M-D": true },          // NEW — streak + heatmap source of truth
  "reviews":    { "YYYY-M-D": 12 },            // NEW — cards rated per day (goal ring + totals)
  "achievements": { "<id>": 1717689600000 },   // NEW — first-unlocked ms per achievement
  "storiesRead":  { "<storyId>": true },        // NEW — union set
  "dailyGoal":  10,                             // NEW — synced target (LWW by updatedAt)
  "fcMode":     "<string>",
  "lastLesson": "<lessonId>",
  "streak":     7,                              // derived/cached from activeDays
  "lastActive": "YYYY-M-D",                     // kept for back-compat/migration
  "updatedAt":  1717689600000                   // NEW — bumped on every save (LWW for scalars)
}

// cantoLearning.sync — NEVER synced, NEVER written to the gist
{ "token": "<github token>", "gistId": "<id>", "autoSync": true, "lastSync": 0 }

// cantoLearning.prefs — device-local, NEVER synced
{ "theme": "system" }
```

## Merge strategy (`mergeProgress(a, b)`)

Conflict-free and merge-idempotent so repeated syncs never drift, and two
devices combine rather than clobber:

| Field | Rule |
|-------|------|
| `srs[hanzi]` | keep the record with the greater `last` (tie → greater `due`) |
| `completed` / `completedRemoved` | tombstoned: lesson is complete iff latest complete-ms > latest remove-ms; keep both maps merged by `max` |
| `deck` / `deckRemoved` | tombstoned: word is in deck iff latest `at` > latest remove-ms; keep both maps merged by `max` |
| `practice[id]` | `best = max`, `times = max`, `last = max` (max, not sum → idempotent) |
| `activeDays` | union |
| `reviews[day]` | `max` per day |
| `achievements[id]` | keep **earliest** unlock ms (union with min) |
| `storiesRead` | union (no un-read action exists) |
| `streak`, `lastActive` | **ignored on merge** — recomputed from merged `activeDays` |
| `dailyGoal`, `fcMode`, `lastLesson` | from whichever blob has the greater `updatedAt` (last-write-wins) |
| `updatedAt` | `max(a, b)` |

`recomputeStreak(activeDays, today)` counts consecutive days back from `today`
(or `yesterday`, so a not-yet-active today doesn't break the streak), returning
0 if neither is present. This makes the streak tamper-resistant and
merge-stable: it is always a function of the day set, never an independently
mutated counter.

## Sync orchestration

- **Connect (per device):** Settings → paste token → `Sync.connect`:
  validate via the GitHub API, then `findGist()` (match a private gist whose
  file is `cantonese-learning-progress.json` / known description); if none,
  create it from the current local blob. Persist `gistId`.
- **On load (every page, if enabled):** `syncNow()` — pull, merge into local,
  save, push. Cheap and keeps devices convergent.
- **On change:** `data-utils.js` dispatches `cantoLearning:change` after each
  `save()`; `sync.js` debounces ~4s then `syncNow()` (so a burst of ratings is
  one round-trip). Debounce avoids hammering the API.
- **Gist shape:** one **private** gist, description
  `"Cantonese Learning — progress (auto-synced, do not edit)"`, single file
  `cantonese-learning-progress.json` containing the pretty-printed blob.
- **Auth & CORS:** GitHub's REST API is browser-callable with CORS; a token is
  sent as an `Authorization` header. A **classic** token with only the `gist`
  scope is used (fine-grained tokens don't cover gists); the exact creation
  steps are verified and written into the in-app Settings help + README at
  implementation time.
- **Failure modes:** network error → stay local, mark "not synced," retry on
  next change/load; `401` bad token → Settings shows "reconnect"; `404` gist →
  recreate; never block app use on sync.
- **Reset across devices:** reset clears this device and overwrites the gist
  with the empty blob. A *different* device still holding progress will, on its
  next sync, merge its data back and re-populate the gist (the merge is
  additive). For a full wipe, reset each device (or Disconnect first). Settings
  states this next to the Reset button.

## Security & privacy

- The token lives only in `cantoLearning.sync` (this device's `localStorage`),
  is **never** placed in `cantoLearning.v1`, and is therefore **never uploaded
  to the gist** or committed to the repo. Settings masks it.
- Scope is `gist` only, so a leaked token's blast radius is limited to the
  user's gists.
- XSS surface is low: the site loads no third-party JavaScript (audio is fetched
  as media, not script). This is the accepted "less private, guarded by one
  secret" model the user chose: anyone holding the token can read the progress
  gist — acceptable for a single-user learning tracker.
- A `Disconnect` action clears the token (and optionally deletes the gist).

## UI specifics

- **Today panel (dashboard top):** a **goal ring** (inline SVG arc) showing
  `reviewsToday / dailyGoal`, beside a prioritised **next steps** list:
  1. *Review* — "N cards due" (else "N new words"); shows "✓ Daily goal met!"
     once today's reviews ≥ target; links `flashcards.html`.
  2. *Continue* — next incomplete lesson (or "all lessons complete 🎉"); links
     `lesson.html?id=`.
  3. *Read a story* — links `stories.html`.
- **Streak** shown with 🔥 and the day count; milestone celebrations at 3 / 7 /
  30 days (fired once per milestone via the achievements path).
- **Achievements:** starter set, all derived from tracked data —
  first lesson; 25 / 100 / 250 words known; streak 3 / 7 / 30; Level 1 complete;
  100 cards reviewed (total); first story read; first 100% practice. Shown as a
  badge gallery (locked = greyed) on Settings, with a compact "recent badges"
  strip on the dashboard.
- **Heatmap:** 12-week grid, each cell shaded by that day's review count
  (0 = empty), with a hover/title showing the date and count.
- **Dark mode:** header sun/moon toggle cycling light ↔ dark (Settings also
  offers "match system"); applied flash-free via the inline `<head>` snippet.
- **Celebrations** respect `prefers-reduced-motion` (toast still shows; confetti
  is skipped).

## Testing

- **`scripts/test_progress_merge.js`** (Node, `global.window = {}` +
  `eval(fs.readFileSync(...))`, mirroring `test_deck.js`):
  - `mergeProgress`: srs newer-`last` wins; storiesRead union; practice max
    (idempotent under double-merge); reviews per-day max; achievements
    earliest-wins; scalars by `updatedAt`; merge is commutative on collections
    and idempotent.
  - **Tombstones** (`mergeTombstoned` via `mergeProgress`): a word removed on
    one device and untouched on the other stays **removed** after merge; a
    re-add (newer `at`) beats an older removal; an un-completed lesson stays
    un-completed; symmetric for `completed`.
  - `recomputeStreak`: consecutive run ending today; grace for "today not yet
    active but yesterday is"; gap breaks streak; empty → 0.
- **`scripts/test_gamification.js`** (Node):
  - `summarize` derives correct counts from a stub store/vocab.
  - `evaluateAchievements` returns only newly-crossed thresholds and never
    re-fires already-unlocked ids.
  - `dailyGoalStatus` computes `done`/`met`/`pct` (and caps `pct` at 100).
- All existing tests (`test_deck.js`, `test_practice*.js`,
  `test_lessons_content.js`, the Python suites) must still pass.
- `node --check` on every new/modified JS file.
- **Manual browser smoke test** (outside the sandbox, noted as a follow-up):
  theme toggle + no-flash; Today panel + ring; earn an achievement → confetti;
  connect a token on two browsers → progress converges; export/import restore;
  offline still usable.

## Caveats & dependencies

- Cross-device sync requires the user to create a GitHub **classic token**
  (`gist` scope) once and paste it on each device; exact click-path is verified
  and documented in-app + README at build time.
- Sync is **eventually consistent**, not real-time: changes made on two devices
  without an intervening sync merge on the next load/change (the merge is
  conflict-free, but the freshest scalar fields follow `updatedAt`).
- Confetti is a tiny self-contained canvas effect (no library) and is disabled
  under reduced-motion.
- Theme is intentionally per-device, so it does not appear in the gist.
- Browser smoke testing (multi-device sync, visual checks) is a manual step
  outside the sandbox.

## Out of scope (possible later cycles)

- A real backend with username/password accounts and multi-user support.
- A type-a-code / third-party sync option as an alternative to gists.
- Broader gamification (XP/levels, leaderboards), goal types beyond review
  count, or configurable achievement sets.
- Importing historical `activeDays` (pre-upgrade days can't be reconstructed;
  the heatmap fills from upgrade day forward, seeded only with the last known
  active day).
