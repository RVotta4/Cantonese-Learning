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
