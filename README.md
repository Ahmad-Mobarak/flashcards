# Flashcards (InfoSec / Ethical Hacking)

A simple static flashcards website (HTML/CSS/JS) for reviewing information security and ethical hacking basics.

## Run locally

Option 1 (simple): open `index.html` in your browser.

Option 2 (recommended): run a local static server:

```bash
# Python 3
python -m http.server 8000
```

Then open:

- http://localhost:8000

## GitHub Pages

To publish the site:
1. Go to **Settings → Pages**.
2. Under **Build and deployment** choose **Deploy from a branch**.
3. Select branch **main** and folder **/** (root).
4. Save.

After that, your site will be available at the Pages URL shown in the Pages settings.

## Controls

- **Prev / Next** buttons
- **Random** button
- **Show/Hide Answer** button
- Progress indicator (e.g., `3 / 26`)

Keyboard shortcuts:
- **Left Arrow**: previous card
- **Right Arrow**: next card
- **Space**: show/hide answer
- **R**: random card

Search:
- Type a keyword to search across question + answer.
- Use **Prev match / Next match** to cycle through results.

Theme:
- **Light/Dark** toggle (saved in `localStorage`).
