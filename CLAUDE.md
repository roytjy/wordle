# CLAUDE.md

Guidance for Claude Code (or any future session) working in this repository.

## Project

A Wordle clone with hints, built as a client-side-only React web app. Full requirements live in `spec.md` — read it first. Key points:

- Word length is chosen by the player: 5, 6, or 7 letters. Always 6 guess rows.
- Word lists load from static JSON at `public/words/words-{5,6,7}.json` (schema: `{ word, definition }[]`). Real datasets are in place (3,000 entries each). Loader code must never assume list size, so these can be swapped again later with no code changes.
- Guesses are also accepted against `public/words/words-{5,6,7}-dictionary.json` (flat array of words, no definitions) - a guess is valid if it's in *either* file. This widens accepted guesses beyond the curated answer list without ever narrowing it. All three are real comprehensive dictionaries now (4,667 / 20,089 / 30,074 words). A missing/malformed dictionary file degrades gracefully (logs a warning, game stays playable) - only the core `words-{n}.json` failing is treated as fatal.
- Two independent hint types: letter reveal (keyboard-only, never repeats a letter, never places it in the grid) and word-meaning reveal. Both are capped via `src/game/constants.js` (`HINT_LIMITS`), not hardcoded inline.
- Persistence is per-difficulty: up to 3 concurrent saved games in localStorage (keys `wordle:v1:save:{5,6,7}`), via the storage abstraction in `src/storage/` — never call `localStorage` directly from game/component code, go through `src/storage/storage.js` so persistence can be swapped later.
- Difficulty is switchable at any time; switching just resumes (or starts fresh) that difficulty's own save.
- `.venv` / `.python-version` at the repo root are reserved for possible future backend work — unrelated to this app, leave them alone.
- **Time Mode**: a second, ranked mode toggled via `ModeToggle` alongside difficulty. Players claim a globally-unique username (Firestore-backed, remembered locally afterward), then race a deterministic word-of-the-day per difficulty (same for everyone, seeded from the Asia/Singapore calendar date — see `src/game/dailyWord.js`/`src/game/singaporeDate.js`), with no hints and a running timer. One attempt per difficulty per SGT day per username; a repeat visit that day goes straight to that day's leaderboard instead of a fresh board. Losses still reach the leaderboard, shown as "DNF" and excluded from ranking. See `firestore.rules` (repo root) for the data model/security rules, and the "Known limitations" section of the Time Mode plan for accepted trade-offs (no anti-cheat, no historical leaderboard, no username recovery). **Requires a one-time manual Firebase console setup** — see `src/firebase/config.js`, which ships with placeholder values until that's done.

## Tech stack

React + Vite, plain JS/JSX (no TypeScript). CSS Modules per component, no CSS framework. Vitest for unit tests. Firebase (Firestore only, client SDK) for Time Mode's shared leaderboard/username state — no other backend exists; the app is otherwise fully static (GitHub Pages).

## Layout

```
public/words/            real word list JSON (3,000 entries each) + README on schema
firestore.rules           Firestore Security Rules (source of truth; pasted into the Firebase console manually)
src/game/                 pure logic: evaluateGuess, keyboardStatus, hints, wordlist, gameReducer, constants,
                          singaporeDate (SGT day boundary), dailyWord (deterministic word-of-the-day), username
src/storage/              storage abstraction (storage.js, includes username caching) + timeAttemptStorage
                          (Time Mode in-progress attempts) + localStorage adapter + key scheme
src/firebase/             Firestore client (config.js + client.js) and leaderboard.js data-access layer
src/hooks/                useWordleGame (Normal mode), useTimeModeGame (Time Mode, same reducer, own
                          persistence/timer/submission), useKeyboardInput
src/components/           DifficultySelector, ModeToggle, Game, Board, Tile, Keyboard (+Key), HintPanel,
                          FinishScreen, TimeMode, TimeModeGame, UsernameEntry, Leaderboard, Timer
```

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm test` — run Vitest unit tests (covers `evaluateGuess`, `keyboardStatus`, `hints` — the highest bug-risk logic, especially duplicate-letter handling)

## Deployment

`.github/workflows/deploy.yml` builds and publishes the app to GitHub Pages on every push to `main` (requires Pages enabled once via Settings > Pages > Source: GitHub Actions). `vite.config.js` sets `base: '/wordle/'` to match the Pages URL path (`https://roytjy.github.io/wordle/`) — keep this in sync if the repo is ever renamed. Time Mode's Firebase config (`src/firebase/config.js`) is committed directly (not a secret — see the file's own comment) and needs no GitHub Actions secret or workflow change.

## Workflow

- After each major implementation step, update this file if the architecture/conventions changed, then commit and push to `origin/main` — keep GitHub in sync incrementally rather than one large commit at the end.
