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

Twenty short traces rise from literal output through loops, strings, functions, collections, and small algorithms. Players see one next challenge at a time, can retry freely, and keep unlocked progress and essence in local storage. Difficulty steps are grouped into five worlds; each completed trace unlocks the next. This uses clear next actions, low-cost retries, visible mastery, and short sessions rather than punitive lives or streak loss.

## Mobile editor

The editor uses CodeMirror 6 with Python language support, line numbers, a dedicated four-space indent button, and a horizontal row of commonly needed symbols. The row works with touch and does not intercept typing focus. The page respects safe areas and has a compact, single-column play view.

## Python execution

Pyodide runs CPython compiled to WebAssembly in the browser. User code is not sent to a server. The initial runner loads Pyodide on demand and displays stdout or runtime errors. Challenges use a strict normalized source comparison to award completion, so alternative correct programs can run and show output but do not yet receive completion credit. Add test-based validators to `src/questions.ts` before publishing broader challenge packs.

## Install on iPhone

Open the deployed site in Safari, tap **Share**, then **Add to Home Screen**. iOS does not expose the Chromium install prompt event, so the app provides this instruction when an install prompt event is available and documents the Safari path here.

## Update questions

Add entries to `src/questions.ts`. Keep `id` sequential and set `world`, concise prompt, hint, starter, target solution, and essence reward. The first 20 prompts are deliberately brief for phone-sized sessions.

## Credits and reference

The provided Pyxis project was used as a visual reference for its restrained dark notebook palette and monospaced code surface. No Pyxis code or branding is included in this app.
