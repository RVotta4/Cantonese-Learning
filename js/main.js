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
  // Voices can load asynchronously, so we cache them and refresh on the
  // voiceschanged event. Exposed globally for the lesson/vocab pages.
  var voiceCache = [];
  function refreshVoices() {
    if ("speechSynthesis" in window) {
      voiceCache = window.speechSynthesis.getVoices() || [];
    }
  }
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  // Find the best available voice: Cantonese first, then any Chinese.
  function pickVoice() {
    var cantonese = voiceCache.find(function (v) {
      return /zh[-_]?(HK|yue)/i.test(v.lang) || /cantonese|粵|廣東|hiu|hk/i.test(v.name);
    });
    if (cantonese) return { voice: cantonese, isCantonese: true };
    var chinese = voiceCache.find(function (v) { return /^zh/i.test(v.lang); });
    if (chinese) return { voice: chinese, isCantonese: false };
    return { voice: null, isCantonese: false };
  }

  // Returns: "cantonese" | "fallback" | "unsupported"
  window.speakCantonese = function (text) {
    if (!("speechSynthesis" in window)) return "unsupported";
    refreshVoices();
    window.speechSynthesis.cancel(); // stop anything already playing
    var pick = pickVoice();
    var u = new SpeechSynthesisUtterance(text);
    if (pick.voice) {
      u.voice = pick.voice;
      u.lang = pick.voice.lang;
    } else {
      u.lang = "zh-HK"; // best effort; Edge's online voices respond to this
    }
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
    return pick.isCantonese ? "cantonese" : (pick.voice ? "fallback" : "fallback");
  };

  // True only if a real Cantonese voice is installed.
  window.hasCantoneseVoice = function () {
    refreshVoices();
    return !!pickVoice().isCantonese;
  };
})();
