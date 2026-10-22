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

The game has 1,000 levels arranged into 50 episodes of 20. The map lists recent episodes first and places level 001 at the bottom. Players may open any level at any time. The start action always returns to level 001, and map entry scrolls to the bottom so the first level and start action are immediately available. The generated challenge sequence introduces output, arithmetic, strings, loops, functions, collections, comprehensions, and algorithmic patterns over ten difficulty tiers. Solutions are kept to 20 lines or fewer. Progress and essence are saved in local storage.

## Mobile editor

The editor uses CodeMirror 6 with Python language support, line numbers, a dedicated four-space indent button, and a horizontal row of commonly needed symbols. The row works with touch and does not intercept typing focus. The page respects safe areas and has a compact, single-column play view.

## Python execution

Pyodide runs CPython compiled to WebAssembly in a browser worker. User code is not sent to a server. Challenge completion compares the learner program's output to the authored solution's output, with an extra probe for function challenges. Add a test probe to `src/questions.ts` when authoring a function challenge.

## Install on iPhone

Open the deployed site in Safari, tap **Share**, then **Add to Home Screen**. iOS does not expose the Chromium install prompt event, so the app provides this instruction when an install prompt event is available and documents the Safari path here.

## Update questions

The first 20 questions are authored examples. The remaining 980 are produced by `makeQuestion()` in `src/questions.ts`. Edit its tiered templates to expand or tune the sequence. Keep solutions at 20 lines or fewer and provide a concise prompt and hint. Episode group names, colors, and map presentation are in `src/App.tsx` and `src/questions.ts`.

## Credits and reference

The provided Pyxis project was used as a visual reference for its restrained dark notebook palette and monospaced code surface. No Pyxis code or branding is included in this app.
