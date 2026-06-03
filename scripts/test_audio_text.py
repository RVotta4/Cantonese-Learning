"""Unit tests for scripts/audio_text.py.  Run: python3 scripts/test_audio_text.py"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audio_text
from audio_text import spoken_text


def test_multichar_unchanged():
    assert spoken_text("現金") == "現金"
    assert spoken_text("唔該晒") == "唔該晒"


def test_single_char_gets_continuation_comma():
    assert spoken_text("史") == "史，"
    assert spoken_text("折") == "折，"


def test_override_wins():
    audio_text.OVERRIDES["詩"] = "詩詩"
    try:
        assert spoken_text("詩") == "詩詩"
    finally:
        del audio_text.OVERRIDES["詩"]


def _run():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    failed = 0
    for t in tests:
        try:
            t(); print("PASS", t.__name__)
        except Exception as e:
            failed += 1; print("FAIL", t.__name__, "-", e)
    print("\n%d test(s) failed" % failed if failed else "\nAll %d tests passed" % len(tests))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    _run()
