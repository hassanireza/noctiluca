# Noctiluca

A mobile first Python puzzle game. Players follow a constellation path, solve short coding traces, and run Python in the browser.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

Build with `npm run build`. The production bundle is written to `dist/`.

## GitHub Pages

Create `hassanireza/noctiluca` on GitHub, put these files on its `main` branch, and set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The included workflow builds and deploys the app at `https://hassanireza.github.io/noctiluca/`.

## Game design

1,000 levels in 50 episodes of 20. Each episode is drawn as a constellation: level 001 sits at the bottom of the page and the path climbs upward. Any level can be opened at any time. New players land on the hero; returning players land on their current episode, and a thumb-reach dock always offers **Begin / Continue** plus a **Jump to episode** sheet. Progress and essence are saved in local storage; streaks use the local calendar day and lapse after a missed day.

## Mobile editor

CodeMirror 6 with Python highlighting in the Noctiluca theme. Autocapitalise, autocorrect and smart quotes are disabled, indentation is four spaces, and a symbol row (Tab, undo and common punctuation) is docked above the keyboard using `visualViewport`, so Run is always reachable. Python starts downloading when a level opens, infinite loops are stopped after 8 seconds, and every run uses a fresh namespace. Wrong answers get a clear verdict, with the expected output offered after two attempts.

## Installable app (iPhone and Android)

Brand assets are generated from one vector definition: `npm run assets` rewrites `public/` icons (180px apple-touch-icon, 192/512, maskable, favicons) and 13 iPhone splash screens, and `scripts/splash-links.html` holds the matching `<link>` tags already pasted into `index.html`. The manifest and service worker are base-path relative. The service worker serves pages network-first (updates appear on next open), caches built assets, and caches the Pyodide runtime so Python works offline after the first run. On iOS the app teaches **Share, then Add to Home Screen** once (snoozed 14 days); Chromium gets the native install prompt. Safe areas are respected for the notch, status bar and home indicator.

## Update questions

The first 20 questions are authored examples. The remaining 980 are produced by `makeQuestion()` in `src/questions.ts`. Edit its tiered templates to expand or tune the sequence. Keep solutions at 20 lines or fewer and provide a concise prompt and hint. Episode names live in `src/episodes.ts`; colors are in `src/questions.ts`; the map is `src/screens/MapScreen.tsx`.

## Credits and reference

The provided Pyxis project was used as a visual reference for its restrained dark notebook palette and monospaced code surface. No Pyxis code or branding is included in this app.
