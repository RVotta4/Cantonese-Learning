"""Unit tests for scripts/build_wordbank.py.  Run: python3 scripts/test_build_wordbank.py"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_wordbank import fix_row, topic_for, build


def test_pattern_a_moves_leading_jyutping():
    r = fix_row({"hanzi": "先生", "jyutping": "sin1", "english": "saang1 sir/ mister"})
    assert r["jyutping"] == "sin1 saang1", r
    assert r["english"] == "sir / mister", r


def test_pattern_a_multi_token():
    r = fix_row({"hanzi": "冇問題", "jyutping": "mou5", "english": "man6 tai4 no problem"})
    assert r["jyutping"] == "mou5 man6 tai4", r
    assert r["english"] == "no problem", r


def test_pattern_b_truncates_at_cjk():
    r = fix_row({"hanzi": "熱", "jyutping": "jit6", "english": "hot ⾼ gou1 tall"})
    assert r["jyutping"] == "jit6", r
    assert r["english"] == "hot", r


def test_clean_row_unchanged():
    r = fix_row({"hanzi": "現金", "jyutping": "jin6 gam1", "english": "cash"})
    assert r == {"hanzi": "現金", "jyutping": "jin6 gam1", "english": "cash"}, r


def test_topics():
    assert topic_for("bank") == "Money & banking"
    assert topic_for("doctor") == "Jobs"
    assert topic_for("to rain") == "Weather"
    assert topic_for("xyzzy") == "General"


def test_build_dedupes_and_has_no_cjk_in_english():
    rows = [{"hanzi": "熱", "jyutping": "jit6", "english": "hot ⾼ gou1 tall"},
            {"hanzi": "熱", "jyutping": "jit6", "english": "hot"}]
    out = build(rows)
    hanzis = [w["hanzi"] for w in out]
    assert hanzis.count("熱") == 1, hanzis
    assert all(not any("一" <= c <= "鿿" or "⺀" <= c <= "⿿" for c in w["english"]) for w in out)
    assert all("topic" in w for w in out)


def test_pattern_a_final_token_no_space():
    r = fix_row({"hanzi": "x", "jyutping": "saam1 cin1 ng5 baak3", "english": "gau2 sap6"})
    assert r["jyutping"] == "saam1 cin1 ng5 baak3 gau2 sap6", r
    assert r["english"] == "", r


def test_card_topic_not_transport():
    assert topic_for("to swipe the card") != "Transport & travel"


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
