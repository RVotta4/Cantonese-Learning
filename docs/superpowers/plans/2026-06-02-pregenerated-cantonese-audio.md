# Pre-generated Cantonese Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 🔊 playback reliable and high-quality by serving pre-generated Cantonese MP3s (committed to the repo, built by CI), with the existing live TTS kept only as a fallback.

**Architecture:** A dependency-free Python module extracts every unique `hanzi` phrase from `data/lessons.js`; a generator synthesizes one MP3 per phrase via `edge-tts` and writes a `window.AUDIO_MANIFEST` mapping. The browser's `speakCantonese()` plays the matching static MP3 first and falls back to today's live TTS on any miss/error. A GitHub Actions workflow runs the generator (the TTS host is blocked in the Claude sandbox).

**Tech Stack:** Static HTML/CSS/JS (no build step), Python 3.11 + `edge-tts` (voice `zh-HK-HiuMaanNeural`), GitHub Actions. Tests are plain-`assert` Python scripts run with `python3` (no framework); JS is syntax-checked with `node --check`.

**Spec:** `docs/superpowers/specs/2026-06-02-pregenerated-cantonese-audio-design.md`

---

## File Structure

- `scripts/extract_phrases.py` *(new)* — pure helpers: `extract_phrases(js_text)` and `phrase_key(text)`. No edge-tts, no network → unit-testable in isolation. (This is a decomposition beyond the spec's file list: the spec folds extraction into the generator, but splitting the pure logic into its own module is what makes `test_extract.py` dependency-free.)
- `scripts/test_extract.py` *(new)* — plain-`assert` unit tests for the module above. Run with `python3 scripts/test_extract.py`.
- `scripts/generate_audio.py` *(new)* — CLI generator: imports the module, synthesizes missing MP3s, writes `audio/manifest.js`, self-checks, prints a summary. `--dry-run` previews phrases with no network/writes.
- `audio/` *(new)* — generated `*.mp3` files + `manifest.js`. A committed stub `manifest.js` (`window.AUDIO_MANIFEST = {};`) keeps the site working before the first generation.
- `js/main.js` *(modify)* — `speakCantonese()` plays a manifest MP3 first, else falls back to the existing chain.
- `index.html`, `lesson.html`, `vocabulary.html`, `flashcards.html` *(modify)* — add `<script src="audio/manifest.js">` before `js/main.js`.
- `audio-test.html` *(modify)* — show pre-generated audio coverage + a sample-play button.
- `.github/workflows/generate-audio.yml` *(new)* — runs the generator and commits audio back.
- `README.md` *(modify)* — rewrite the "Getting the audio to work" section.

---

### Task 1: Phrase extraction module (pure, TDD)

**Files:**
- Create: `scripts/extract_phrases.py`
- Test: `scripts/test_extract.py`

- [ ] **Step 1: Write the failing test**

Create `scripts/test_extract.py`:

```python
"""Unit tests for scripts/extract_phrases.py.

Run with:  python3 scripts/test_extract.py
No test framework or network required.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_phrases import extract_phrases, phrase_key


def test_extracts_basic_hanzi():
    js = 'a = [{ hanzi: "你好", jyutping: "nei5 hou2" }];'
    assert extract_phrases(js) == ["你好"]


def test_dedupes_preserving_order():
    js = '{hanzi:"你好"} {hanzi:"早晨"} {hanzi:"你好"}'
    assert extract_phrases(js) == ["你好", "早晨"]


def test_handles_escaped_quote_in_value():
    js = r'{ hanzi: "說\"你好\"", english: "say hi" }'
    assert extract_phrases(js) == ['說"你好"']


def test_ignores_other_fields():
    js = '{ jyutping: "si1", english: "poem", hanzi: "詩" }'
    assert extract_phrases(js) == ["詩"]


def test_phrase_key_is_stable_16_hex():
    k = phrase_key("你好")
    assert k == "440ee0853ad1e99f", k   # sha1("你好")[:16]
    assert len(k) == 16


def test_real_data_has_173_phrases():
    here = os.path.dirname(os.path.abspath(__file__))
    data = os.path.join(here, "..", "data", "lessons.js")
    with open(data, encoding="utf-8") as f:
        phrases = extract_phrases(f.read())
    assert len(phrases) == 173, "expected 173 unique phrases, got %d" % len(phrases)


def _run():
    tests = [v for k, v in sorted(globals().items())
             if k.startswith("test_") and callable(v)]
    failed = 0
    for t in tests:
        try:
            t()
            print("PASS", t.__name__)
        except AssertionError as e:
            failed += 1
            print("FAIL", t.__name__, "-", e)
    if failed:
        print("\n%d test(s) failed" % failed)
        sys.exit(1)
    print("\nAll %d tests passed" % len(tests))


if __name__ == "__main__":
    _run()
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python3 scripts/test_extract.py`
Expected: FAIL — `ModuleNotFoundError: No module named 'extract_phrases'` (the module doesn't exist yet).

- [ ] **Step 3: Write the minimal implementation**

Create `scripts/extract_phrases.py`:

```python
"""Pure helpers for the audio generator.

Extract speakable phrases from data/lessons.js and turn a phrase into a
stable audio filename key. Dependency-free (no edge-tts, no network) so it
can be unit-tested in isolation by scripts/test_extract.py.
"""
import hashlib
import re

# Matches  hanzi: "..."  (the key is unquoted in data/lessons.js).
# The body allows backslash escapes like \" so escaped quotes don't end it.
_HANZI_RE = re.compile(r'hanzi\s*:\s*"((?:\\.|[^"\\])*)"')

# JS string escapes we might see in a captured value. Today's hanzi values
# are plain text, but unescaping keeps the manifest key byte-identical to the
# string the browser actually passes to speakCantonese().
_UNESCAPE = {'\\"': '"', "\\\\": "\\", "\\/": "/", "\\n": "\n", "\\t": "\t"}
_ESCAPE_RE = re.compile(r'\\["\\/nt]')


def _unescape(raw):
    return _ESCAPE_RE.sub(lambda m: _UNESCAPE[m.group(0)], raw)


def extract_phrases(js_text):
    """Return the unique hanzi phrases in first-seen order."""
    seen = []
    known = set()
    for m in _HANZI_RE.finditer(js_text):
        phrase = _unescape(m.group(1))
        if phrase and phrase not in known:
            known.add(phrase)
            seen.append(phrase)
    return seen


def phrase_key(text):
    """Stable audio filename stem: first 16 hex chars of SHA-1(UTF-8)."""
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:16]
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `python3 scripts/test_extract.py`
Expected: PASS — `All 6 tests passed`.

- [ ] **Step 5: Commit**

```bash
git add scripts/extract_phrases.py scripts/test_extract.py
git commit -m "Add phrase extraction module with tests"
```

---

### Task 2: Audio generator CLI

**Files:**
- Create: `scripts/generate_audio.py`

- [ ] **Step 1: Write the generator**

Create `scripts/generate_audio.py`:

```python
#!/usr/bin/env python3
"""Generate high-quality Cantonese MP3s for every phrase in data/lessons.js.

For each unique `hanzi` phrase, synthesize audio/<key>.mp3 with edge-tts
(voice zh-HK-HiuMaanNeural) and write audio/manifest.js mapping phrase -> key.
Existing, non-empty MP3s are skipped, so re-runs are fast and diffs small.

Generation needs open internet to Microsoft's TTS host, so it cannot run in
restricted sandboxes — use GitHub Actions or a local machine. --dry-run lists
the phrases with no network and no writes.

Usage:
    python3 scripts/generate_audio.py            # synthesize missing audio
    python3 scripts/generate_audio.py --dry-run  # list phrases, write nothing
"""
import asyncio
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from extract_phrases import extract_phrases, phrase_key

ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data", "lessons.js")
AUDIO_DIR = os.path.join(ROOT, "audio")
MANIFEST = os.path.join(AUDIO_DIR, "manifest.js")
VOICE = "zh-HK-HiuMaanNeural"
RETRIES = 3


def load_phrases():
    with open(DATA, encoding="utf-8") as f:
        return extract_phrases(f.read())


def mp3_path(key):
    return os.path.join(AUDIO_DIR, key + ".mp3")


def has_audio(key):
    p = mp3_path(key)
    return os.path.exists(p) and os.path.getsize(p) > 0


async def synth(text, key):
    """Synthesize one phrase. Return True on success (non-empty file)."""
    import edge_tts
    path = mp3_path(key)
    for attempt in range(1, RETRIES + 1):
        try:
            await edge_tts.Communicate(text, VOICE).save(path)
            if os.path.exists(path) and os.path.getsize(path) > 0:
                return True
            raise RuntimeError("empty file written")
        except Exception as e:  # report, clean up, retry
            print("  attempt %d/%d failed for %r: %s" % (attempt, RETRIES, text, e))
            if os.path.exists(path) and os.path.getsize(path) == 0:
                os.remove(path)
            if attempt < RETRIES:
                await asyncio.sleep(attempt)
    return False


def write_manifest(mapping):
    body = json.dumps(mapping, ensure_ascii=False, indent=2, sort_keys=True)
    with open(MANIFEST, "w", encoding="utf-8") as f:
        f.write("/* Auto-generated by scripts/generate_audio.py - do not edit. */\n")
        f.write("window.AUDIO_MANIFEST = " + body + ";\n")


async def run(dry_run):
    phrases = load_phrases()
    print("Found %d unique phrases in data/lessons.js" % len(phrases))

    if dry_run:
        for p in phrases[:5]:
            print("  -", p, "->", phrase_key(p) + ".mp3")
        print("(dry run: no audio generated, no files written)")
        return 0

    os.makedirs(AUDIO_DIR, exist_ok=True)
    mapping = {}
    generated = skipped = failed = 0
    for text in phrases:
        key = phrase_key(text)
        if has_audio(key):
            mapping[text] = key
            skipped += 1
            continue
        print("Generating:", text)
        if await synth(text, key):
            mapping[text] = key
            generated += 1
        else:
            failed += 1

    write_manifest(mapping)

    missing = [t for t, k in mapping.items() if not has_audio(k)]
    print("\nSummary: %d generated, %d already present, %d failed, %d in manifest"
          % (generated, skipped, failed, len(mapping)))
    if missing:
        print("ERROR: manifest references %d missing files" % len(missing))
        return 1
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(run("--dry-run" in sys.argv[1:])))
```

- [ ] **Step 2: Verify the dry-run path works (no network needed)**

Run: `python3 scripts/generate_audio.py --dry-run`
Expected: prints `Found 173 unique phrases in data/lessons.js`, lists 5 `phrase -> <key>.mp3` lines, then `(dry run: ...)`, exit code 0, and **no** files created under `audio/`.

- [ ] **Step 3: Commit**

```bash
git add scripts/generate_audio.py
git commit -m "Add edge-tts audio generator script"
```

---

### Task 3: Client playback — manifest stub + main.js integration

**Files:**
- Create: `audio/manifest.js`
- Modify: `js/main.js:89-98`

- [ ] **Step 1: Create the manifest stub**

Create `audio/manifest.js` (overwritten later by the generator; this keeps the page includes valid before the first generation):

```javascript
/* Auto-generated by scripts/generate_audio.py - do not edit. */
window.AUDIO_MANIFEST = {};
```

- [ ] **Step 2: Syntax-check the stub**

Run: `node --check audio/manifest.js`
Expected: no output, exit code 0.

- [ ] **Step 3: Rewrite `speakCantonese` in `js/main.js`**

Replace this exact block (currently `js/main.js:89-98`):

```javascript
  // Main entry point used by lesson/vocab/flashcard pages.
  // Prefers a real local Cantonese voice (instant, offline); otherwise plays
  // the online Cantonese voice.
  window.speakCantonese = function (text) {
    refreshVoices();
    if (pickVoice().isCantonese) {
      return speakLocal(text, false) ? "local" : speakOnline(text) && "online";
    }
    return speakOnline(text) ? "online" : "unsupported";
  };
```

with:

```javascript
  // Fallback chain (used when there's no pre-generated file): a real local
  // Cantonese voice first (instant, offline), otherwise the online voice.
  function fallbackSpeak(text) {
    refreshVoices();
    if (pickVoice().isCantonese) {
      return speakLocal(text, false) ? "local" : (speakOnline(text) && "online");
    }
    return speakOnline(text) ? "online" : "unsupported";
  }

  // Play a pre-generated MP3 if one exists for this exact phrase. Returns true
  // if a file was found and playback attempted; on load/play error it falls
  // back to the live TTS chain.
  function speakFile(text) {
    var manifest = window.AUDIO_MANIFEST;
    if (!manifest || !Object.prototype.hasOwnProperty.call(manifest, text)) {
      return false;
    }
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    var audio = new Audio("audio/" + manifest[text] + ".mp3");
    currentAudio = audio;
    var fellBack = false;
    function fb() { if (!fellBack) { fellBack = true; fallbackSpeak(text); } }
    audio.onerror = fb;
    audio.play().catch(fb);
    return true;
  }

  // Main entry point used by lesson/vocab/flashcard pages. Prefers a
  // pre-generated MP3 (reliable, high quality); otherwise uses live TTS.
  window.speakCantonese = function (text) {
    return speakFile(text) ? "file" : fallbackSpeak(text);
  };
```

(`currentAudio`, `refreshVoices`, `pickVoice`, `speakLocal`, and `speakOnline` are all already defined earlier in the same IIFE.)

- [ ] **Step 4: Syntax-check main.js**

Run: `node --check js/main.js`
Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add audio/manifest.js js/main.js
git commit -m "Play pre-generated audio first, fall back to live TTS"
```

---

### Task 4: Include the manifest on audio-playing pages

**Files:**
- Modify: `index.html`, `lesson.html`, `vocabulary.html`, `flashcards.html`

- [ ] **Step 1: Insert the manifest script tag on all four pages**

In **each** of `index.html`, `lesson.html`, `vocabulary.html`, `flashcards.html`, find this pair of lines:

```html
  <script src="data/lessons.js"></script>
  <script src="js/data-utils.js"></script>
```

and change it to:

```html
  <script src="data/lessons.js"></script>
  <script src="audio/manifest.js"></script>
  <script src="js/data-utils.js"></script>
```

- [ ] **Step 2: Verify all four pages include it**

Run: `grep -l 'audio/manifest.js' index.html lesson.html vocabulary.html flashcards.html`
Expected: all four filenames are listed.

- [ ] **Step 3: Commit**

```bash
git add index.html lesson.html vocabulary.html flashcards.html
git commit -m "Load audio manifest on audio-playing pages"
```

---

### Task 5: Audio-test coverage read-out

**Files:**
- Modify: `audio-test.html`

- [ ] **Step 1: Load lessons + manifest into the diagnostics page**

Find:

```html
  <footer class="site-footer"><div class="container"><p>Audio diagnostics · Cantonese Learning</p></div></footer>

  <script>
```

Replace with:

```html
  <footer class="site-footer"><div class="container"><p>Audio diagnostics · Cantonese Learning</p></div></footer>

  <script src="data/lessons.js"></script>
  <script src="audio/manifest.js"></script>
  <script>
```

- [ ] **Step 2: Add a coverage box and renumber the next section**

Find:

```html
    <div class="diag-box">
      <h2>4. What to tell me</h2>
```

Replace with:

```html
    <div class="diag-box">
      <h2>4. Pre-generated audio</h2>
      <p class="muted">High-quality MP3s committed under <code>audio/</code>. These play first; live TTS is only a fallback.</p>
      <p id="coverage">Checking…</p>
      <p><button class="btn btn-primary" id="play-sample">🔊 Play a pre-generated sample</button></p>
    </div>

    <div class="diag-box">
      <h2>5. What to tell me</h2>
```

- [ ] **Step 3: Add the coverage logic to the inline script**

Find (near the end of the inline `<script>`):

```javascript
  })();
  </script>
```

Replace with:

```javascript

    // ---- Pre-generated audio coverage ----
    function allPhrases() {
      var set = {};
      (window.LESSONS || []).forEach(function (l) {
        ["dialogue", "vocab", "examples"].forEach(function (k) {
          (l[k] || []).forEach(function (item) { if (item && item.hanzi) set[item.hanzi] = 1; });
        });
      });
      return Object.keys(set);
    }
    var manifest = window.AUDIO_MANIFEST || {};
    var manifestKeys = Object.keys(manifest);
    var totalPhrases = allPhrases().length;
    var covEl = document.getElementById("coverage");
    if (covEl) {
      covEl.innerHTML = manifestKeys.length
        ? "✅ <strong>" + manifestKeys.length + "</strong> phrases have pre-generated audio (of " + totalPhrases + " total)."
        : "⚠️ No pre-generated audio yet (manifest empty). Run the “Generate Cantonese audio” GitHub Action.";
    }
    var sampleBtn = document.getElementById("play-sample");
    if (sampleBtn) {
      sampleBtn.addEventListener("click", function () {
        if (!manifestKeys.length) { statusEl.textContent = "No pre-generated audio to play."; return; }
        var first = manifestKeys[0];
        statusEl.textContent = "▶ playing pre-generated: " + first;
        var a = new Audio("audio/" + manifest[first] + ".mp3");
        a.onerror = function () { statusEl.textContent = "❌ failed to load audio/" + manifest[first] + ".mp3"; };
        a.play().catch(function (e) { statusEl.textContent = "❌ " + (e && e.message ? e.message : e); });
      });
    }
  })();
  </script>
```

(`statusEl` is defined at the top of the same IIFE.)

- [ ] **Step 4: Verify the additions are present**

Run: `grep -q 'id="coverage"' audio-test.html && grep -q allPhrases audio-test.html && grep -q play-sample audio-test.html && echo present`
Expected: `present`.

- [ ] **Step 5: Commit**

```bash
git add audio-test.html
git commit -m "Show pre-generated audio coverage on diagnostics page"
```

---

### Task 6: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/generate-audio.yml`

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/generate-audio.yml`:

```yaml
name: Generate Cantonese audio

on:
  workflow_dispatch:
  push:
    branches: [main]
    paths:
      - data/lessons.js

permissions:
  contents: write

concurrency:
  group: generate-audio
  cancel-in-progress: false

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install edge-tts
        run: pip install edge-tts

      - name: Generate audio
        run: python3 scripts/generate_audio.py

      - name: Commit audio if changed
        run: |
          if [ -n "$(git status --porcelain audio)" ]; then
            git config user.name "github-actions[bot]"
            git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
            git add audio
            git commit -m "Auto-generate Cantonese audio [skip ci]"
            git push
          else
            echo "No audio changes to commit."
          fi
```

- [ ] **Step 2: Verify the YAML parses**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/generate-audio.yml')); print('yaml ok')"`
Expected: `yaml ok`. (If it errors with `No module named 'yaml'`, run `pip install pyyaml` first.)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/generate-audio.yml
git commit -m "Add CI workflow to generate Cantonese audio"
```

---

### Task 7: Rewrite the README audio section

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the audio section**

Replace the entire section that begins with `## 🔊 Getting the audio to work` and ends just before `## ✏️ Making it yours` with:

````markdown
## 🔊 How the audio works

Every Cantonese phrase has a **pre-generated MP3** committed under `audio/`, so
playback is reliable and high quality on any device or browser — no system voice
required. The 🔊 buttons play these files first and only fall back to your
device's built-in text-to-speech (or an online voice) if a file is missing.

The MP3s are produced by **GitHub Actions** using Microsoft's `edge-tts`
(voice *zh-HK-HiuMaanNeural*):

- **First time / on demand:** open the repo's **Actions** tab → **Generate
  Cantonese audio** → **Run workflow**. It synthesizes the audio and commits it.
- **Automatically:** whenever `data/lessons.js` changes on `main`, the workflow
  regenerates any new phrases and commits them.

Prefer to generate locally instead? Run:

```bash
pip install edge-tts
python3 scripts/generate_audio.py
```

then commit the new files in `audio/`. (Use `--dry-run` to preview the phrase
list without generating anything.)

> Heads up: audio generation needs open internet access to Microsoft's TTS
> servers, so it can't run inside restricted sandboxes — use GitHub Actions or
> your own machine.
````


- [ ] **Step 2: Verify the new heading is present and the old one is gone**

Run: `grep -c 'How the audio works' README.md; grep -c 'Getting the audio to work' README.md`
Expected: `1` then `0`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Document the pre-generated audio system in README"
```

---

### Task 8: Push and trigger the first generation

**Files:** none (operational)

- [ ] **Step 1: Push the branch**

```bash
git push -u origin claude/cool-franklin-75ZFc
```

- [ ] **Step 2: Generate the real audio (outside the sandbox)**

The MP3 bytes cannot be produced in the Claude sandbox (TTS host blocked). After this branch is merged to `main`, open the GitHub **Actions** tab → **Generate Cantonese audio** → **Run workflow**. It synthesizes all 173 phrases and commits them, replacing the empty `audio/manifest.js` stub. (Alternatively, run `python3 scripts/generate_audio.py` locally after `pip install edge-tts` and commit `audio/`.)

- [ ] **Step 3: Smoke-test in a browser**

Open `audio-test.html` — section 4 should report coverage (e.g. "173 phrases have pre-generated audio"). Open a lesson, click 🔊, and confirm in DevTools → Network that an `audio/<key>.mp3` is fetched and played.

---

## Notes for the implementer

- **Order matters:** Task 1 before Task 2 (the generator imports `extract_phrases`); Task 3 creates `audio/manifest.js` before Task 4 references it.
- **What you can verify in-sandbox:** Tasks 1–7 are fully verifiable here (Python tests, `--dry-run`, `node --check`, `grep`, YAML parse). Only the actual MP3 synthesis (Task 8, Step 2) requires open network.
- **Graceful degradation:** with the empty manifest stub, `speakCantonese` behaves exactly as it does today (live TTS), so nothing regresses before audio is generated.
