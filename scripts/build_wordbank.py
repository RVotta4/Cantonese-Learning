#!/usr/bin/env python3
"""Build data/wordbank.js from the decoded word-bank source JSON.

Cleans the ~25 PDF column-flow artifacts (see plan Task 1), tags each word with
a coarse topic for the Word Bank page, appends a few high-value words that were
absorbed into other rows, and emits `window.WORDBANK = [...]`.

Usage:  python3 scripts/build_wordbank.py
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "docs", "superpowers", "specs", "2026-06-03-wordbank-source.json")
OUT = os.path.join(ROOT, "data", "wordbank.js")

_JYUT_TOKEN = re.compile(r"^((?:[a-z]+[1-6](?:\s+|$))+)", re.IGNORECASE)
_CJK = re.compile(r"[一-鿿⺀-⿿]")

# Topics: first matching keyword (substring, case-insensitive) wins; else General.
TOPICS = [
    ("Money & banking", ["bank", "money", "cash", "account", "interest", "bill",
        "credit", "discount", "sale", "dollar", "pay", "save", "expensive",
        "cheap", "change", "counter", "receipt", "invoice", "card"]),
    ("Food & dining", ["eat", "drink", "tea", "coffee", "beer", "wine", "juice",
        "water", "restaurant", "meal", "delicious", "tasty", "dessert", "soup",
        "food", "dish", "porridge", "goose", "treat", "hungry", "thirsty"]),
    ("Family & people", ["brother", "sister", "father", "mother", "wife",
        "husband", "family", "boyfriend", "girlfriend", "people", "person",
        "miss", "mister", "sir", "handsome", "pretty girl"]),
    ("Jobs", ["teacher", "student", "doctor", "lawyer", "engineer", "actor",
        "director", "work"]),
    ("Weather", ["rain", "humid", "sunny", "muggy", "stuffy", "weather"]),
    ("Transport & travel", ["taxi", "bus", "subway", "airplane", "car",
        "minibus", "traffic", "arrive", "joyride", "rush"]),
    ("Home & hotel", ["room", "hotel", "apartment", "rent", "lobby", "suite",
        "home", "to book", "check out", "square feet"]),
    ("TV & movies", ["movie", "film", "tv", "television", "concert",
        "advertisement", "commercial", "play", "show", "series", "watch"]),
    ("Colours", ["colour", "color", "blue", "green", "white", "yellow",
        "black", "red"]),
    ("Shopping", ["shopping", "mall", "buy", "sell", "bargain", "tips", "swipe"]),
    ("Communication", ["phone", "message", "internet", "online", "call",
        "dial", "number", "text", "get through"]),
    ("Numbers & time", ["one", "two", "three", "four", "five", "six", "seven",
        "eight", "nine", "ten", "twenty", "thirty", "forty", "fifty", "sixty",
        "seventy", "eighty", "ninety", "hundred", "thousand", "zero", "today",
        "tomorrow", "yesterday", "morning", "night", "evening", "noon",
        "afternoon", "week", "monday", "tuesday", "saturday", "sunday", "hour",
        "when", "now", "late", "early", "time"]),
]

# Rows whose English was lost during PDF decoding; supply it explicitly.
CORRECTIONS = {
    "三千五百九十": {"jyutping": "saam1 cin1 ng5 baak3 gau2 sap6", "english": "3590"},
    "七千八百八十": {"jyutping": "cat1 cin1 baat3 baak3 baat3 sap6", "english": "7880"},
}

# High-value words absorbed into Pattern-B rows, re-added as their own entries.
EXTRA_WORDS = [
    {"hanzi": "高", "jyutping": "gou1", "english": "high / tall"},
    {"hanzi": "白色", "jyutping": "baak6 sik1", "english": "white"},
    {"hanzi": "黃色", "jyutping": "wong4 sik1", "english": "yellow"},
    {"hanzi": "黑色", "jyutping": "haak1 sik1", "english": "black"},
    {"hanzi": "人", "jyutping": "jan4", "english": "people / person"},
    {"hanzi": "食", "jyutping": "sik6", "english": "to eat"},
    {"hanzi": "水", "jyutping": "seoi2", "english": "water"},
    {"hanzi": "車", "jyutping": "ce1", "english": "car"},
    {"hanzi": "白日", "jyutping": "baak6 jat6", "english": "day"},
    {"hanzi": "走", "jyutping": "zau2", "english": "to leave / to walk"},
    {"hanzi": "八", "jyutping": "baat3", "english": "eight (8)"},
    {"hanzi": "十", "jyutping": "sap6", "english": "ten (10)"},
    {"hanzi": "二十", "jyutping": "ji6 sap6", "english": "twenty (20)"},
    {"hanzi": "八十", "jyutping": "baat3 sap6", "english": "eighty (80)"},
    {"hanzi": "十一", "jyutping": "sap6 jat1", "english": "eleven (11)"},
    {"hanzi": "十二", "jyutping": "sap6 ji6", "english": "twelve (12)"},
]


def fix_row(row):
    """Apply Pattern A/B cleanup to one decoded row; return a clean row."""
    hanzi = row["hanzi"]
    jyut = row["jyutping"].strip()
    eng = row["english"].strip()
    m = _JYUT_TOKEN.match(eng)
    if m:  # Pattern A: leading jyutping syllables belong to the word
        jyut = (jyut + " " + m.group(1).strip()).strip()
        eng = eng[m.end():].strip()
    cjk = _CJK.search(eng)
    if cjk:  # Pattern B: truncate at the absorbed following word
        eng = eng[: cjk.start()].strip()
    eng = re.sub(r"\s*/\s*", " / ", eng)          # tidy "a/ b" -> "a / b"
    eng = re.sub(r"\s+", " ", eng).strip(" ;,/")
    return {"hanzi": hanzi, "jyutping": jyut, "english": eng}


def topic_for(english):
    low = english.lower()
    for name, keys in TOPICS:
        if any(re.search(r"\b" + re.escape(k) + r"\b", low) for k in keys):
            return name
    return "General"


def build(rows):
    out, seen = [], set()
    for r in list(rows) + EXTRA_WORDS:
        r = fix_row(r) if "topic" not in r else r
        if not r["hanzi"] or r["hanzi"] in seen:
            continue
        seen.add(r["hanzi"])
        if r["hanzi"] in CORRECTIONS:
            r.update(CORRECTIONS[r["hanzi"]])
        r["topic"] = topic_for(r["english"])
        out.append(r)
    return out


def main():
    with open(SRC, encoding="utf-8") as f:
        rows = json.load(f)
    words = build(rows)
    body = json.dumps(words, ensure_ascii=False, indent=2)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("/* ===========================================================\n")
        f.write("   Cantonese Learning — word bank\n\n")
        f.write("   The user's saved CantoneseClass101 'My Word Bank' export,\n")
        f.write("   decoded and cleaned. Generated by scripts/build_wordbank.py\n")
        f.write("   from docs/superpowers/specs/2026-06-03-wordbank-source.json.\n")
        f.write("   =========================================================== */\n\n")
        f.write("window.WORDBANK = " + body + ";\n")
    print("Wrote %d words -> %s" % (len(words), OUT))


if __name__ == "__main__":
    main()
