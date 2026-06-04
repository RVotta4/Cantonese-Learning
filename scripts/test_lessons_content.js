/* ===========================================================
   Node content validator for data/lessons.js.
   Run: node scripts/test_lessons_content.js

   Part A — well-formedness. Runs on whatever dialogue / notes
   content exists, so it stays green as lessons are enriched.
   Part B (coverage: every non-excluded lesson actually has a
   dialogue + notes) is added in the bulk-authoring plan, once
   the content exists to satisfy it.
   =========================================================== */
var fs = require("fs");
global.window = {};
eval(fs.readFileSync(__dirname + "/../data/lessons.js", "utf8"));
var LESSONS = global.window.LESSONS;

var failed = 0;
function fail(msg) { console.log("FAIL " + msg); failed++; }

// Mandarin-only characters that signal a Mandarin slip or accidental
// simplified input. Deliberately conservative: characters with legitimate
// Cantonese uses (不 in 不過, 的 in 的士, 是 in 但是, 嗎 in 你好嗎) are NOT listed.
var MANDARIN = "喝這沒們这吗没们个".split("");

// A jyutping token is "Cantonese" if, after stripping surrounding
// punctuation, it has no uppercase letter (proper nouns like "Robbie"
// are tolerated). Returns the cleaned token, or null to ignore it.
function cantoneseToken(tok) {
  var clean = tok.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
  if (!clean) return null;
  if (/[A-Z]/.test(clean)) return null;
  return clean;
}

if (!Array.isArray(LESSONS)) {
  fail("window.LESSONS is not an array");
} else {
  LESSONS.forEach(function (l) {
    var id = l && l.id ? l.id : "(no id)";

    // vocab + examples exist on every lesson; dialogue + notes are optional
    // in Part A (the coverage gate enforces their presence later).
    ["vocab", "examples"].forEach(function (f) {
      if (!Array.isArray(l[f])) fail(id + ": " + f + " is not an array");
    });
    ["dialogue", "notes"].forEach(function (f) {
      if (l[f] != null && !Array.isArray(l[f])) fail(id + ": " + f + " is present but not an array");
    });

    var dialogue = Array.isArray(l.dialogue) ? l.dialogue : [];
    var vocab = Array.isArray(l.vocab) ? l.vocab : [];
    var notes = Array.isArray(l.notes) ? l.notes : [];

    dialogue.forEach(function (line, i) {
      ["speaker", "hanzi", "jyutping", "english"].forEach(function (k) {
        if (!line || typeof line[k] !== "string" || !line[k].length)
          fail(id + ": dialogue[" + i + "]." + k + " is missing or empty");
      });
      if (line && typeof line.jyutping === "string") {
        line.jyutping.trim().split(/\s+/).forEach(function (tok) {
          var c = cantoneseToken(tok);
          if (c && !/^[a-z]+[1-6]$/.test(c))
            fail(id + ": malformed jyutping token '" + tok + "' in dialogue[" + i + "]");
        });
      }
      if (line && typeof line.hanzi === "string") {
        MANDARIN.forEach(function (ch) {
          if (line.hanzi.indexOf(ch) > -1)
            fail(id + ": Mandarin character '" + ch + "' in dialogue[" + i + "] hanzi — use the Cantonese form");
        });
      }
    });

    if (dialogue.length) {
      var allHanzi = dialogue.map(function (d) { return d.hanzi || ""; }).join("");
      var grounded = vocab.some(function (v) { return v.hanzi && allHanzi.indexOf(v.hanzi) > -1; });
      if (!grounded) fail(id + ": dialogue does not use any of the lesson's vocab");
    }

    notes.forEach(function (n, i) {
      ["title", "body"].forEach(function (k) {
        if (!n || typeof n[k] !== "string" || !n[k].length)
          fail(id + ": notes[" + i + "]." + k + " is missing or empty");
      });
    });
  });

  if (!failed) console.log("PASS all " + LESSONS.length + " lessons well-formed (Part A)");
}

console.log(failed ? ("\n" + failed + " failed") : "\nAll passed");
process.exit(failed ? 1 : 0);
