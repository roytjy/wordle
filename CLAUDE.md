# CLAUDE.md

Guidance for Claude Code (or any future session) working in this repository.

## Project

A Wordle clone with hints, built as a client-side-only React web app. Full requirements live in `spec.md` — read it first. Key points:

- Word length is chosen by the player: 5, 6, or 7 letters. Always 6 guess rows.
- Word lists load from static JSON at `public/words/words-{5,6,7}.json` (schema: `{ word, definition }[]`). **The files currently in the repo are small placeholders for development** — Roy will supply the real ~2000-word lists later, same filenames/schema. Loader code must never assume list size.
- Two independent hint types: letter reveal (keyboard-only, never repeats a letter, never places it in the grid) and word-meaning reveal. Both are capped via `src/game/constants.js` (`HINT_LIMITS`), not hardcoded inline.
- Persistence is per-difficulty: up to 3 concurrent saved games in localStorage (keys `wordle:v1:save:{5,6,7}`), via the storage abstraction in `src/storage/` — never call `localStorage` directly from game/component code, go through `src/storage/storage.js` so persistence can be swapped later.
- Difficulty is switchable at any time; switching just resumes (or starts fresh) that difficulty's own save.
- `.venv` / `.python-version` at the repo root are reserved for possible future backend work — unrelated to this app, leave them alone.

## Tech stack

React + Vite, plain JS/JSX (no TypeScript). CSS Modules per component, no CSS framework. Vitest for unit tests.

## Layout

```
public/words/            word list JSON (placeholders) + README noting so
src/game/                 pure logic: evaluateGuess, keyboardStatus, hints, wordlist, gameReducer, constants
src/storage/              storage abstraction (storage.js) + localStorage adapter + key scheme
src/hooks/                useWordleGame (reducer + persistence orchestration), useKeyboardInput
src/components/           DifficultySelector, Game, Board, Tile, Keyboard (+Key), HintPanel, StatusBanner
```

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm test` — run Vitest unit tests (covers `evaluateGuess`, `keyboardStatus`, `hints` — the highest bug-risk logic, especially duplicate-letter handling)

## Workflow

- After each major implementation step, update this file if the architecture/conventions changed, then commit and push to `origin/main` — keep GitHub in sync incrementally rather than one large commit at the end.
