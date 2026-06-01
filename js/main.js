/* ===========================================================
   Cantonese Learning — shared scripts (Phase 1)
   Keeps things simple: mobile nav toggle + footer year.
   More logic (flashcards, progress) arrives in later phases.
   =========================================================== */

(function () {
  "use strict";

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Auto-fill the year in the footer
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
