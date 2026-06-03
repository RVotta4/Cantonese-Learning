/* Node test for the Store deck API.  Run: node scripts/test_deck.js  */
var fs = require("fs");
var store = {};
global.localStorage = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
  setItem: function (k, v) { store[k] = String(v); },
};
global.window = {};
eval(fs.readFileSync(__dirname + "/../js/data-utils.js", "utf8"));
var S = global.window.Store;

var failed = 0;
function check(name, cond) { console.log((cond ? "PASS " : "FAIL ") + name); if (!cond) failed++; }

var w = { hanzi: "現金", jyutping: "jin6 gam1", english: "cash", source: "wordbank" };
check("empty deck", S.deckList().length === 0 && S.deckCount() === 0);
S.addToDeck(w);
check("add one", S.deckCount() === 1 && S.inDeck("現金"));
check("stores full object", S.deckList()[0].english === "cash");
S.addToDeck(w);
check("idempotent add", S.deckCount() === 1);
S.removeFromDeck("現金");
check("remove", S.deckCount() === 0 && !S.inDeck("現金"));
S.addToDeck(w);
S.reset();
check("reset keeps deck", S.deckCount() === 1);

console.log(failed ? ("\n" + failed + " failed") : "\nAll passed");
process.exit(failed ? 1 : 0);
