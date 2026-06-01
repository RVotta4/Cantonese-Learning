/* ===========================================================
   Cantonese Learning — dashboard stats (Phase 3)
   Fills in real numbers from the flashcard progress store.
   =========================================================== */

(function () {
  "use strict";
  if (!window.Vocab || !window.Store) return;

  var all = window.Vocab.all();
  var due = window.Store.dueCards(all).length;
  var fresh = window.Store.newCards(all).length;
  var known = window.Store.knownCount(all);

  set("cards-due", due > 0 ? due : (fresh > 0 ? fresh + " new" : "0"));
  if (known > 0) set("words-known", known);

  function set(key, val) {
    var el = document.querySelector('[data-stat="' + key + '"]');
    if (el) el.textContent = val;
  }
})();
