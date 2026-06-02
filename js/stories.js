/* ===========================================================
   Cantonese Learning — story library page
   Reads window.STORIES and lists them grouped by category.
   =========================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("stories-library");
  if (!mount || !window.STORIES) return;

  var labels = { beginner: "Beginner stories", custom: "Your stories" };
  var order = ["beginner", "custom"];

  var groups = {};
  window.STORIES.forEach(function (s) {
    (groups[s.category] = groups[s.category] || []).push(s);
  });
  // Append any categories not in the preferred order.
  Object.keys(groups).forEach(function (c) { if (order.indexOf(c) === -1) order.push(c); });

  var html = "";
  order.forEach(function (cat) {
    var list = groups[cat];
    if (!list || !list.length) return;
    list.sort(function (a, b) { return (a.level - b.level) || 0; });

    html += '<section class="level-block">';
    html += '<div class="level-block-head"><h2>' + escapeHtml(labels[cat] || cat) + '</h2></div>';
    html += '<div class="lesson-list">';
    list.forEach(function (s) {
      html +=
        '<a class="lesson-row" href="story.html?id=' + encodeURIComponent(s.id) + '">' +
          '<span class="lesson-num">📖</span>' +
          '<span class="lesson-info">' +
            '<span class="lesson-title">' + escapeHtml(s.title) + '</span>' +
            '<span class="lesson-sub">' + escapeHtml(s.blurb || "") + '</span>' +
          '</span>' +
          '<span class="lesson-meta">Level ' + s.level + (s.minutes ? ' · ' + s.minutes + ' min' : '') + '</span>' +
          '<span class="lesson-go">→</span>' +
        '</a>';
    });
    html += '</div></section>';
  });

  mount.innerHTML = html || '<p class="muted">No stories yet.</p>';

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
})();
