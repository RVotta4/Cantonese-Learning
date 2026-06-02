"""Pure helpers for the audio generator.

Extract speakable phrases from data/lessons.js and turn a phrase into a
stable audio filename key. Dependency-free (no edge-tts, no network) so it
can be unit-tested in isolation by scripts/test_extract.py.
"""
import hashlib
import re

# Matches  hanzi: "..."  (the key is unquoted in data/lessons.js).
# The body allows backslash escapes like \" so escaped quotes don't end it.
_HANZI_RE = re.compile(r'hanzi\s*:\s*"((?:\\.|[^"\\\n])*)"')

# JS string escapes we might see in a captured value. Today's hanzi values
# are plain text, but unescaping keeps the manifest key byte-identical to the
# string the browser actually passes to speakCantonese().
_UNESCAPE = {'\\"': '"', "\\\\": "\\", "\\/": "/", "\\n": "\n", "\\t": "\t"}
_ESCAPE_RE = re.compile(r'\\["\\/nt]')


def _unescape(raw):
    return _ESCAPE_RE.sub(lambda m: _UNESCAPE[m.group(0)], raw)


def extract_phrases(js_text):
    """Return the unique hanzi phrases in first-seen order."""
    result = []
    known = set()
    for m in _HANZI_RE.finditer(js_text):
        phrase = _unescape(m.group(1))
        if phrase and phrase not in known:
            known.add(phrase)
            result.append(phrase)
    return result


def extract_from_texts(texts):
    """Unique phrases across several JS sources, in first-seen order."""
    result = []
    known = set()
    for text in texts:
        for phrase in extract_phrases(text):
            if phrase not in known:
                known.add(phrase)
                result.append(phrase)
    return result


def phrase_key(text):
    """Stable audio filename stem: first 16 hex chars of SHA-1(UTF-8)."""
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:16]
