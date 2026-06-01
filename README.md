# Cantonese Learning 🇭🇰

A personal Cantonese learning website — lessons, vocabulary, and spaced-repetition
flashcards — built as a simple static site so it's easy to host, update, and never breaks.

Inspired by the layout of CantoneseClass101: a dashboard, a level-based lesson
pathway, vocabulary lists, and flashcard review.

---

## 🧭 Build roadmap (built in parts)

| Phase | What it adds | Status |
|-------|--------------|--------|
| **1. Foundation** | Navigation, dashboard, full styling, deploy setup | ✅ Done |
| **2. Lesson Library** | Lessons by level with dialogue, jyutping, notes & audio | ⏳ Next |
| **3. Vocabulary & Flashcards** | Searchable word lists + spaced-repetition review | ⏳ Planned |
| **4. Personalization** | Progress tracking, streaks, "continue where you left off" | ⏳ Planned |

---

## 🚀 Putting it live on GitHub Pages (one-time setup)

This site is plain HTML/CSS/JS, so GitHub can serve it directly — no build step.

1. Push this code to GitHub (the branch is already set up).
2. On GitHub, open the repo and go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the branch (e.g. `main`) and folder **`/ (root)`**, then **Save**.
5. Wait ~1 minute. Your site goes live at:
   **`https://<your-username>.github.io/cantonese-learning/`**

After that, every time you push changes, the live site updates automatically —
just like Vercel.

> Tip: this branch is `claude/stoic-gates-HSRVZ` during development. When you're
> happy with it, merge it into `main` and point Pages at `main`.

---

## 🖥️ Viewing it on your own computer

No tools required — just open `index.html` in your browser.

For a closer match to how it runs online (so links behave correctly), you can
start a tiny local server from this folder:

```bash
# Python 3 (already on most Macs/Linux)
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

---

## 📁 Project structure

```
cantonese-learning/
├── index.html        # Dashboard / home
├── lessons.html      # Lesson library (Phase 2)
├── vocabulary.html   # Vocabulary lists (Phase 3)
├── flashcards.html   # Flashcard review (Phase 3)
├── css/style.css     # All styling
├── js/main.js        # Shared scripts
├── .nojekyll         # Tells GitHub Pages to serve files as-is
└── README.md
```

---

## ✏️ Making it yours

- Your name appears in the dashboard greeting and footer — search for `Robbie`
  in `index.html` to change it.
- Colors live at the top of `css/style.css` (the `:root` block) — tweak `--red`,
  `--gold`, etc.
