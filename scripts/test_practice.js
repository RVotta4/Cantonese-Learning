/* Node tests for window.PracticeLogic.  Run: node scripts/test_practice.js */
var fs = require("fs");
global.window = {};
eval(fs.readFileSync(__dirname + "/../js/practice-logic.js", "utf8"));
var P = global.window.PracticeLogic;

var failed = 0;
function check(name, cond) { console.log((cond ? "PASS " : "FAIL ") + name); if (!cond) failed++; }
function sameSet(a, b) { return a.slice().sort().join("|") === b.slice().sort().join("|"); }

// --- primitives ---
check("tokenize splits on spaces", sameSet(P.tokenizeJyutping("nei5 hou2 maa3"), ["nei5", "hou2", "maa3"]));
check("tokenize empty -> []", P.tokenizeJyutping("   ").length === 0);
check("isSingleSyllable true", P.isSingleSyllable("si1") === true);
check("isSingleSyllable false (space)", P.isSingleSyllable("nei5 hou2") === false);
check("isSingleSyllable false (empty)", P.isSingleSyllable("") === false);
check("toneOf single", P.toneOf("maa5") === 5);
check("toneOf multi -> null", P.toneOf("nei5 hou2") === null);
check("syllableKey strips tone + lowercases", P.syllableKey("MAA5") === "maa");

// --- shuffle ---
var arr = [1, 2, 3, 4, 5];
var sh = P.shuffle(arr);
check("shuffle keeps elements", sameSet(sh.map(String), arr.map(String)) && sh.length === 5);
check("shuffle does not mutate input", arr.join(",") === "1,2,3,4,5");

// --- distractors / options ---
var pool = [{ english: "hello" }, { english: "bye" }, { english: "yes" }, { english: "bye" }];
var ds = P.pickDistractors("hello", "english", pool, 2);
check("distractors count", ds.length === 2);
check("distractors exclude answer", ds.indexOf("hello") === -1);
check("distractors unique", ds.length === (ds[0] === ds[1] ? 1 : 2) && ds[0] !== ds[1]);
check("distractors degrade gracefully", P.pickDistractors("hello", "english", [{ english: "hello" }], 3).length === 0);
var opts = P.optionsWith("hello", "english", pool, 3);
check("optionsWith includes answer", opts.indexOf("hello") > -1);
check("optionsWith size <= n+1", opts.length <= 4 && opts.length >= 2);

// --- tone pairs ---
var tp = P.mineTonePairs([
  { hanzi: "詩", jyutping: "si1" }, { hanzi: "史", jyutping: "si2" },
  { hanzi: "媽", jyutping: "maa1" }, { hanzi: "你好", jyutping: "nei5 hou2" }
]);
check("tone pair found for si", !!tp.si && tp.si.length === 2);
check("no pair for single-tone maa", !tp.maa);
check("multi-syllable ignored", !tp["nei hou"]);
var tp2 = P.mineTonePairs([{ hanzi: "媽", jyutping: "maa1" }, { hanzi: "馬", jyutping: "maa5" }]);
check("maa1/maa5 pair found", !!tp2.maa && tp2.maa.length === 2);

// --- buildSession ---
var lesson = {
  id: "t",
  vocab: [
    { hanzi: "詩", jyutping: "si1", english: "poem" },
    { hanzi: "你好", jyutping: "nei5 hou2", english: "hello" },
    { hanzi: "多謝", jyutping: "do1 ze6", english: "thank you" },
    { hanzi: "早晨", jyutping: "zou2 san4", english: "good morning" }
  ],
  examples: [{ hanzi: "你好嗎？", jyutping: "nei5 hou2 maa3", english: "How are you?" }]
};
function typesOf(s) { return s.map(function (t) { return t.type; }); }
var full = P.buildSession(lesson, { cap: 100, pool: [], hasAudio: function (h) { return h === "詩"; }, tonePairs: P.mineTonePairs(lesson.vocab) });
var types = typesOf(full);
["recall", "listening", "matching", "cloze", "reorder", "tone", "shadow"].forEach(function (t) {
  check("session includes " + t, types.indexOf(t) > -1);
});
var capped = P.buildSession(lesson, { cap: 3, pool: [], hasAudio: function () { return false; }, tonePairs: {} });
check("cap respected", capped.length === 3);
check("interleaved (first two differ)", capped[0].type !== capped[1].type);
var noAudio = P.buildSession(lesson, { cap: 100, pool: [], hasAudio: function () { return false; }, tonePairs: {} });
check("no tone tasks without audio", typesOf(noAudio).indexOf("tone") === -1);
var cloze = full.filter(function (t) { return t.type === "cloze"; })[0];
check("cloze target appears in sentence", cloze && cloze.sentence.hanzi.indexOf(cloze.target.hanzi) > -1);
var reorder = full.filter(function (t) { return t.type === "reorder"; })[0];
check("reorder has >=3 tokens", reorder && reorder.tokens.length >= 3);
var tiny = P.buildSession({ id: "x", vocab: [{ hanzi: "狗", jyutping: "gau2", english: "dog" }], examples: [] },
  { cap: 100, pool: [], hasAudio: function () { return false; }, tonePairs: {} });
check("tiny lesson still yields tasks", tiny.length >= 1);
check("tiny lesson has no cloze/reorder/matching", ["cloze", "reorder", "matching"].every(function (t) { return typesOf(tiny).indexOf(t) === -1; }));

// --- scoreSession ---
var W1 = { hanzi: "A" }, W2 = { hanzi: "B" };
var sc = P.scoreSession([
  { type: "listening", correct: true, word: W1 },
  { type: "cloze", correct: false, word: W2 },
  { type: "shadow", correct: null, word: null },
  { type: "tone", correct: false, word: W2 }
]);
check("score total excludes unscored", sc.total === 3);
check("score correct count", sc.correct === 1);
check("score pct rounded", sc.pct === 33);
check("missed words deduped", sc.missedWords.length === 1 && sc.missedWords[0].hanzi === "B");

console.log(failed ? ("\n" + failed + " failed") : "\nAll passed");
process.exit(failed ? 1 : 0);
