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


def test_real_data_extracts_many_phrases():
    # Sanity floor, not an exact snapshot — survives normal lesson growth.
    here = os.path.dirname(os.path.abspath(__file__))
    data = os.path.join(here, "..", "data", "lessons.js")
    with open(data, encoding="utf-8") as f:
        phrases = extract_phrases(f.read())
    assert len(phrases) >= 100, "extracted only %d phrases (expected >=100)" % len(phrases)


def _run():
    tests = [v for k, v in sorted(globals().items())
             if k.startswith("test_") and callable(v)]
    failed = 0
    for t in tests:
        try:
            t()
            print("PASS", t.__name__)
        except Exception as e:
            failed += 1
            print("FAIL", t.__name__, "-", e)
    if failed:
        print("\n%d test(s) failed" % failed)
        sys.exit(1)
    print("\nAll %d tests passed" % len(tests))


if __name__ == "__main__":
    _run()
