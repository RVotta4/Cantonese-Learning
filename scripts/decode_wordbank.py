#!/usr/bin/env python3
"""Decode a CantoneseClass101 "My Word Bank" PDF export into structured JSON.

The export embeds many subsetted CID fonts (one glyph set per text run), so the
characters can't be copied out directly — each run needs its font's /ToUnicode
CMap to turn glyph ids back into Unicode. This script parses the PDF object
graph, resolves each page's font resources, and decodes the content streams.

Dependency-free (stdlib zlib + re only) so it runs anywhere, including the
restricted web sandbox. Output is a JSON list of {hanzi, jyutping, english}.

Usage:
    python3 scripts/decode_wordbank.py <input.pdf> <output.json>
"""
import json
import re
import sys
import unicodedata
import zlib


def load_objects(data):
    """Map every indirect object number -> its raw body bytes."""
    objs = {}
    for m in re.finditer(rb"(\d+)\s+(\d+)\s+obj\b(.*?)\bendobj", data, re.DOTALL):
        objs[int(m.group(1))] = m.group(3)
    return objs


def stream_of(body):
    """Return the decoded (FlateDecode or raw) stream bytes in an object body."""
    m = re.search(rb"stream\r?\n(.*?)\r?\nendstream", body, re.DOTALL)
    if not m:
        m = re.search(rb"stream\r?\n(.*?)endstream", body, re.DOTALL)
    if not m:
        return None
    raw = m.group(1)
    for cand in (raw, raw.rstrip(b"\r\n")):
        try:
            return zlib.decompress(cand)
        except Exception:
            pass
    return raw


def dict_part(body):
    i = body.find(b"stream")
    return (body[:i] if i >= 0 else body).decode("latin1", "replace")


def parse_cmap(b):
    """Parse a ToUnicode CMap stream -> (code_width_bytes, {code: unicode})."""
    t = b.decode("latin1")
    width = 2
    cs = re.search(r"begincodespacerange(.*?)endcodespacerange", t, re.DOTALL)
    if cs:
        hx = re.findall(r"<([0-9A-Fa-f]+)>", cs.group(1))
        if hx:
            width = len(hx[0]) // 2
    mp = {}
    for blk in re.findall(r"beginbfchar(.*?)endbfchar", t, re.DOTALL):
        for src, dst in re.findall(r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", blk):
            h = dst if len(dst) % 2 == 0 else "0" + dst
            try:
                mp[int(src, 16)] = bytes.fromhex(h).decode("utf-16-be", "replace")
            except Exception:
                pass
    for blk in re.findall(r"beginbfrange(.*?)endbfrange", t, re.DOTALL):
        for lo, hi, dst in re.findall(
            r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", blk
        ):
            lo, hi, base = int(lo, 16), int(hi, 16), int(dst, 16)
            for k, code in enumerate(range(lo, hi + 1)):
                mp[code] = chr(base + k)
    return width, mp


def decode_pdf_text(path):
    """Return [(page_obj_num, [decoded_line, ...]), ...] for the whole PDF."""
    data = open(path, "rb").read()
    objs = load_objects(data)
    cmap_cache = {}

    def get_cmap(num):
        if num not in cmap_cache:
            s = stream_of(objs.get(num, b""))
            cmap_cache[num] = parse_cmap(s) if s else (2, {})
        return cmap_cache[num]

    def font_tounicode(fontnum):
        d = dict_part(objs.get(fontnum, b""))
        m = re.search(r"/ToUnicode\s+(\d+)\s+\d+\s+R", d)
        return int(m.group(1)) if m else None

    def font_resources(restext):
        fm = re.search(r"/Font\s+(\d+)\s+\d+\s+R", restext)
        body = dict_part(objs.get(int(fm.group(1)), b"")) if fm else ""
        if not fm:
            fm = re.search(r"/Font\s*<<(.*?)>>", restext, re.DOTALL)
            body = fm.group(1) if fm else ""
        return {
            name: int(num)
            for name, num in re.findall(r"/([A-Za-z0-9_.]+)\s+(\d+)\s+\d+\s+R", body)
        }

    def contents(d):
        cm = re.search(r"/Contents\s+(\d+)\s+\d+\s+R", d)
        refs = [int(cm.group(1))] if cm else []
        if not cm:
            cm = re.search(r"/Contents\s*\[(.*?)\]", d, re.DOTALL)
            if cm:
                refs = [int(x) for x in re.findall(r"(\d+)\s+\d+\s+R", cm.group(1))]
        out = b""
        for r in refs:
            s = stream_of(objs.get(r, b""))
            if s:
                out += s + b"\n"
        return out

    def resources(d):
        rm = re.search(r"/Resources\s+(\d+)\s+\d+\s+R", d)
        if rm:
            return dict_part(objs.get(int(rm.group(1)), b""))
        rm = re.search(r"/Resources\s*<<(.*)", d, re.DOTALL)
        return rm.group(1) if rm else d

    tok_re = re.compile(
        rb"/([A-Za-z0-9_.]+)\s+[\d.]+\s+Tf"
        rb"|\[(.*?)\]\s*TJ"
        rb"|<([0-9A-Fa-f\s]*)>\s*Tj"
        rb"|(Tm|Td|TD|T\*|BT|ET)",
        re.DOTALL,
    )

    def render(hexstr, width, mp):
        hexstr = re.sub(r"\s", "", hexstr)
        step = width * 2
        return "".join(
            mp.get(int(hexstr[i : i + step], 16), "")
            for i in range(0, len(hexstr) - step + 1, step)
        )

    pages = []
    for num, body in objs.items():
        d = dict_part(body)
        if not re.search(r"/Type\s*/Page\b", d) or "/Pages" in d[: d.find("/Type") + 40]:
            continue
        content = contents(d)
        if not content:
            continue
        fonts = font_resources(resources(d))
        cur = (2, {})
        lines, line = [], []
        for m in tok_re.finditer(content):
            if m.group(1):  # Tf — switch active font
                fobj = fonts.get(m.group(1).decode("latin1"))
                tu = font_tounicode(fobj) if fobj else None
                cur = get_cmap(tu) if tu else (2, {})
            elif m.group(2) is not None:  # TJ array
                w, mp = cur
                for hx in re.findall(rb"<([0-9A-Fa-f\s]*)>", m.group(2)):
                    line.append(render(hx.decode("latin1"), w, mp))
            elif m.group(3) is not None:  # Tj hex string
                w, mp = cur
                line.append(render(m.group(3).decode("latin1"), w, mp))
            elif m.group(4) in (b"BT", b"ET", b"Tm"):  # line break
                if line:
                    lines.append("".join(line))
                    line = []
            else:  # Td/TD/T* — word/space gap
                line.append(" ")
        if line:
            lines.append("".join(line))
        pages.append((num, lines))
    return pages


# The export places each glyph individually, so latin runs come out space-per-
# letter with U+0001 marking real word/syllable gaps. Undo that.
_LIGATURES = {"ﬃ": "ffi", "ﬀ": "ff", "ﬁ": "fi", "ﬂ": "fl", "ﬄ": "ffl"}


def _clean_latin(s):
    s = s.replace(" ", "").replace("\x01", " ")
    for a, b in _LIGATURES.items():
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", s).strip()


def _clean_han(s):
    return unicodedata.normalize("NFKC", s.replace(" ", "").replace("\x01", ""))


def _is_cjk(s):
    return any("㐀" <= c <= "鿿" or "豈" <= c <= "﫿" for c in s)


def structure(pages):
    """Group decoded lines into {hanzi, jyutping, english} rows (deduped)."""
    rows, seen = [], set()
    for _, lines in pages:
        seq = []
        for ln in lines:
            t = _clean_latin(ln)
            if (
                not ln.strip()
                or t.replace(" ", "") == "CANTONESECLASS101.COM"
                or t in ("Word", "Jyutping", "English")
                or re.fullmatch(r"\d+", t)
            ):
                continue
            seq.append(ln)
        i = 0
        while i < len(seq):
            if not _is_cjk(seq[i]):
                i += 1
                continue
            hanzi = _clean_han(seq[i])
            i += 1
            jyut = ""
            if i < len(seq) and not _is_cjk(seq[i]):
                jyut = _clean_latin(seq[i])
                i += 1
            eng = []
            while i < len(seq) and not _is_cjk(seq[i]):
                eng.append(_clean_latin(seq[i]))
                i += 1
            if hanzi in seen:
                continue
            seen.add(hanzi)
            rows.append({"hanzi": hanzi, "jyutping": jyut, "english": " ".join(eng).strip()})
    return rows


def main(argv):
    if len(argv) != 3:
        print(__doc__)
        return 2
    rows = structure(decode_pdf_text(argv[1]))
    with open(argv[2], "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    print("Decoded %d unique words -> %s" % (len(rows), argv[2]))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
