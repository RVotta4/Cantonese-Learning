/* ===========================================================
   Cantonese Learning — shared "+ Add to deck" button.
   window.Deck.button(word) -> HTML; window.Deck.mount(root) wires clicks.
   =========================================================== */
(function () {
  "use strict";
  if (!window.Store) return;

  function attrs(word) {
    return 'data-deck-hanzi="' + esc(word.hanzi) + '"' +
      ' data-deck-jyutping="' + esc(word.jyutping) + '"' +
      ' data-deck-english="' + esc(word.english) + '"' +
      ' data-deck-source="' + esc(word.source || "lesson") + '"' +
      (word.lessonId ? ' data-deck-lesson-id="' + esc(word.lessonId) + '"' : "") +
      (word.lessonTitle ? ' data-deck-lesson-title="' + esc(word.lessonTitle) + '"' : "");
  }
  function label(inDeck) { return inDeck ? "✓ In deck" : "+ Add to deck"; }

  function button(word) {
    var inDeck = window.Store.inDeck(word.hanzi);
    return '<button type="button" class="deck-btn' + (inDeck ? " in-deck" : "") + '" ' +
      attrs(word) + ' aria-pressed="' + inDeck + '">' + label(inDeck) + '</button>';
  }
  function wordFrom(btn) {
    return {
      hanzi: btn.getAttribute("data-deck-hanzi"),
      jyutping: btn.getAttribute("data-deck-jyutping"),
      english: btn.getAttribute("data-deck-english"),
      source: btn.getAttribute("data-deck-source"),
      lessonId: btn.getAttribute("data-deck-lesson-id") || undefined,
      lessonTitle: btn.getAttribute("data-deck-lesson-title") || undefined
    };
  }
  function paint(btn, inDeck) {
    btn.classList.toggle("in-deck", inDeck);
    btn.setAttribute("aria-pressed", String(inDeck));
    btn.textContent = label(inDeck);
  }
  function mount(root) {
    root = root || document;
    root.addEventListener("click", function (e) {
      var btn = e.target.closest(".deck-btn");
      if (!btn) return;
      e.preventDefault();
      var w = wordFrom(btn);
      if (btn.hasAttribute("data-deck-all")) return; // handled by addAll
      if (window.Store.inDeck(w.hanzi)) { window.Store.removeFromDeck(w.hanzi); paint(btn, false); }
      else { window.Store.addToDeck(w); window.Store.recordActivity(); paint(btn, true); }
    });
  }
  // Add every word in a list at once; refresh any visible buttons.
  function addAll(words, root) {
    words.forEach(function (w) { window.Store.addToDeck(w); });
    window.Store.recordActivity();
    (root || document).querySelectorAll(".deck-btn").forEach(function (b) {
      paint(b, window.Store.inDeck(b.getAttribute("data-deck-hanzi")));
    });
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  window.Deck = { button: button, mount: mount, addAll: addAll };
})();
