/* Node test for Store per-lesson practice progress.  Run: node scripts/test_practice_store.js */
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

check("no stats initially", S.getPracticeStats("greetings") === null);
S.recordPractice("greetings", 80);
check("first record: best 80, times 1", S.getPracticeStats("greetings").best === 80 && S.getPracticeStats("greetings").times === 1);
S.recordPractice("greetings", 60);
check("lower score keeps best, bumps times", S.getPracticeStats("greetings").best === 80 && S.getPracticeStats("greetings").times === 2);
S.recordPractice("greetings", 90);
check("higher score raises best", S.getPracticeStats("greetings").best === 90 && S.getPracticeStats("greetings").times === 3);
S.recordPractice("greetings", 83.4);
check("pct is rounded", S.getPracticeStats("greetings").best === 90 && S.getPracticeStats("greetings").times === 4);
S.rate("詩", "good");
S.reset();
check("reset clears srs", S.getState("詩") === null);
check("reset preserves practice", S.getPracticeStats("greetings") && S.getPracticeStats("greetings").best === 90);

console.log(failed ? ("\n" + failed + " failed") : "\nAll passed");
process.exit(failed ? 1 : 0);
