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

  // ---- Online Cantonese audio (no install needed) ----
  // Uses Google Translate's Cantonese (yue) text-to-speech, played through an
  // <audio> element. This is what makes audio "just work" without any system
  // voice installed. Requires an internet connection.
  var currentAudio = null;
  function speakOnline(text) {
    try {
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      var url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=yue&q=" +
                encodeURIComponent(text);
      currentAudio = new Audio(url);
      currentAudio.play().catch(function () {
        // If online playback is blocked/unavailable, try the local engine.
        speakLocal(text, true);
      });
      return true;
    } catch (e) {
      return speakLocal(text, true);
    }
  }

  function speakLocal(text, anyVoice) {
    if (!("speechSynthesis" in window)) return false;
    refreshVoices();
    window.speechSynthesis.cancel();
    var pick = pickVoice();
    var u = new SpeechSynthesisUtterance(text);
    if (pick.voice && (anyVoice || pick.isCantonese)) {
      u.voice = pick.voice;
      u.lang = pick.voice.lang;
    } else {
      u.lang = "zh-HK";
    }
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
    return true;
  }

  // Main entry point used by lesson/vocab/flashcard pages.
  // Prefers a real local Cantonese voice (instant, offline); otherwise plays
  // the online Cantonese voice.
  window.speakCantonese = function (text) {
    refreshVoices();
    if (pickVoice().isCantonese) {
      return speakLocal(text, false) ? "local" : speakOnline(text) && "online";
    }
    return speakOnline(text) ? "online" : "unsupported";
  };

  // True only if a real local Cantonese voice is installed.
  window.hasCantoneseVoice = function () {
    refreshVoices();
    return !!pickVoice().isCantonese;
  };
})();
