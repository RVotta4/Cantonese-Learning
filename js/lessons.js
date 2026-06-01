/* ===========================================================
   Cantonese Learning — lesson library page (Phase 2)
   Reads window.LESSONS and renders them grouped by level.
   =========================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("lesson-library");
  if (!mount || !window.LESSONS) return;

  // Group lessons by level number.
  var byLevel = {};
  window.LESSONS.forEach(function (l) {
    (byLevel[l.level] = byLevel[l.level] || []).push(l);
  });

  var levels = Object.keys(byLevel).sort(function (a, b) { return a - b; });
  var html = "";

  levels.forEach(function (lvl) {
    var lessons = byLevel[lvl].sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
    var levelName = lessons[0].levelName || ("Level " + lvl);

    html += '<section class="level-block">';
    html += '<div class="level-block-head">';
    html += '<span class="level-tag">Level ' + lvl + '</span>';
    html += '<h2>' + escapeHtml(levelName) + '</h2>';
    html += '</div>';
    html += '<div class="lesson-list">';

    lessons.forEach(function (l, i) {
      html +=
        '<a class="lesson-row" href="lesson.html?id=' + encodeURIComponent(l.id) + '">' +
          '<span class="lesson-num">' + (i + 1) + '</span>' +
          '<span class="lesson-info">' +
            '<span class="lesson-title">' + escapeHtml(l.title) + '</span>' +
            '<span class="lesson-sub">' + escapeHtml(l.subtitle || "") + '</span>' +
          '</span>' +
          '<span class="lesson-meta">' +
            (l.minutes ? l.minutes + ' min' : '') +
          '</span>' +
          '<span class="lesson-go">→</span>' +
        '</a>';
    });

    html += '</div></section>';
  });

  mount.innerHTML = html;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
})();
