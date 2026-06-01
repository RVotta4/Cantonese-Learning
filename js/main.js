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

  // ---- Cantonese text-to-speech (uses the browser's built-in voice) ----
  // Exposed globally so lesson/vocab pages can call it from audio buttons.
  window.speakCantonese = function (text) {
    if (!("speechSynthesis" in window)) {
      return false; // not supported in this browser
    }
    window.speechSynthesis.cancel(); // stop anything already playing
    var u = new SpeechSynthesisUtterance(text);
    // Prefer a Hong Kong / Cantonese voice if one is installed.
    var voices = window.speechSynthesis.getVoices();
    var preferred = voices.find(function (v) {
      return /zh[-_]?(HK|yue)/i.test(v.lang) || /cantonese|粵|廣東/i.test(v.name);
    });
    u.lang = preferred ? preferred.lang : "zh-HK";
    if (preferred) u.voice = preferred;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
    return true;
  };

  // Some browsers load voices asynchronously; trigger a load early.
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
})();
