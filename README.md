# Wordle

A Wordle clone with hints and a ranked daily "Time Mode" — play live at [roytjy.github.io/wordle](https://roytjy.github.io/wordle/).

Guess a hidden word in 6 tries. Each guess colors letters green (right letter, right spot), yellow (right letter, wrong spot), or gray (not in the word) — on both the grid and the on-screen keyboard. Play with 5, 6, or 7-letter words, or switch to **Time Mode** to race everyone else on the same word of the day and see how you rank.

## Features

### Normal mode

- **Difficulty**: pick 5, 6, or 7-letter words at any time. Always 6 guess rows, regardless of word length.
- **Hints** (two independent types, each capped separately — see `src/game/constants.js`'s `HINT_LIMITS`):
  - *Reveal a letter* — highlights one letter that's in the answer on the on-screen keyboard only. It never places the letter in the grid or reveals its position, and never repeats a letter already surfaced.
  - *Reveal meaning* — shows the answer's dictionary definition. Purely informational.
- **Persistence, per difficulty** — up to 3 games in progress at once (one per word length), saved to `localStorage`. Revisit any time and pick up exactly where you left off: same answer, same guesses, same keyboard state, same hints used.
- **Finish screen** — winning or losing brings up an overlay with the result, a "Play again" (same difficulty, new word), a "Restart (same word)" option mid-game, and quick links to jump into your other two difficulties, each labeled with its status (not started / in progress / completed).

### Time Mode

A second, ranked mode toggled alongside difficulty:

1. **Claim a username** the first time you enter Time Mode — it's checked for global uniqueness and remembered locally afterward, so you never need to re-enter it.
2. **Play the word of the day.** For each difficulty (5/6/7 letters), everyone gets the *same* word on the *same* calendar day — the day boundary is Singapore time (00:00–24:00 SGT), not your local timezone, and the word is picked deterministically (no server round-trip needed to know it).
3. **No hints, timer running.** Time Mode strips out both hint types and shows a running timer instead.
4. **One attempt per difficulty per day.** Once you've played a difficulty today, revisiting it skips straight to that day's leaderboard instead of a fresh board — enforced server-side, not just locally, so it holds even across devices/browsers.
5. **Leaderboard.** Winning stops the timer and submits your time; losing (running out of guesses) still gets you onto the leaderboard, shown as "DNF" and excluded from the ranked ordering. The board shows every player's username and time for that difficulty and day, fastest first.
6. **Refreshing mid-attempt is safe** — your progress and the timer both resume from real elapsed time, they don't reset.

**Known trade-offs** (accepted, not oversights — see `CLAUDE.md` and `firestore.rules` for detail): there's no login/auth, so there's no anti-cheat beyond basic shape-validation in Firestore's security rules, no cross-device username recovery once claimed, and no historical (past-day) leaderboard view yet.

## Tech stack

| Layer | Choice | Why / where |
|---|---|---|
| UI | React 19 + Vite, plain JS/JSX (no TypeScript) | Fast dev server, simple static build. All components live in `src/components/`, one folder each. |
| Styling | CSS Modules, no framework | One `Component.module.css` per component; shared colors/tokens as CSS variables in `src/index.css`. |
| Game logic | Plain, pure JS functions | `src/game/` — `evaluateGuess`, `keyboardStatus`, `hints`, `gameReducer`, `wordlist`, plus Time Mode's `dailyWord` (deterministic word-of-the-day) and `singaporeDate` (SGT day boundary). Framework-agnostic and unit-tested. |
| State management | A single `useReducer` per game session | `src/game/gameReducer.js`, driven by `src/hooks/useWordleGame.js` (Normal mode) and `src/hooks/useTimeModeGame.js` (Time Mode) — both hooks wrap the *same* reducer; only the surrounding orchestration (word selection, persistence, timer, hints) differs. |
| Local persistence | `localStorage`, behind an abstraction | `src/storage/storage.js` (saved games, username, last mode/difficulty) and `src/storage/timeAttemptStorage.js` (in-progress Time Mode attempts) — game/component code never touches `localStorage` directly, so the storage backend could be swapped later without touching game logic. |
| Shared/ranked state | Firebase Firestore (client SDK only) | `src/firebase/` — Time Mode's global username registry and per-day leaderboard. No custom server: called directly from the static frontend. See "Time Mode backend" below. |
| Testing | Vitest | `src/game/__tests__/` — covers the pure logic: guess evaluation (especially duplicate-letter handling), keyboard coloring, hint selection, word-of-the-day determinism, the SGT day-boundary helper, and username validation. |
| Linting | oxlint | `npm run lint`. |
| Word data | Static JSON, not generated at runtime | `public/words/` — see `public/words/README.md` for the exact schema. |
| Hosting/deploy | GitHub Pages via GitHub Actions | `.github/workflows/deploy.yml` builds with `npm run build` and publishes `dist/` on every push to `main`. Fully static — no server to run or maintain, including for Time Mode (Firestore is called directly from the browser). |

### Time Mode backend

Time Mode needed some form of shared state (a globally unique username registry, a leaderboard visible to every player) that plain `localStorage` fundamentally can't provide. Rather than standing up a custom server, it uses **Firebase Firestore**, called straight from the static frontend via the Firebase JS SDK:

- `usernames` collection — one document per claimed handle. A `create`-only-if-absent security rule (`allow create: if !exists(...)`) gives atomic, race-safe uniqueness with no server code.
- `results` collection — one document per `(difficulty, day, username)`, using a composite, deterministic document ID so "have I already played today?" is a single cheap document read, not a query. The same create-only-if-absent rule enforces "one attempt per difficulty per day," and both collections are fully immutable after creation (no `update`/`delete` rule at all).
- The full rules are in `firestore.rules` at the repo root (the source of truth, pasted manually into the Firebase console — there's no CI deploy step for it).
- Firebase's client config (`src/firebase/config.js`) is not a secret — it's committed directly, per Firebase's own documentation. All real access control lives in the security rules, not in hiding that file.

This keeps the entire app on GitHub Pages with zero servers to run, at zero cost on Firebase's free "Spark" tier.

## Project layout

```
public/words/            word list JSON (answers+definitions, plus a separate accepted-guess dictionary), see its own README
firestore.rules          Firestore Security Rules for Time Mode (pasted into the Firebase console manually)
src/game/                pure logic: evaluateGuess, keyboardStatus, hints, wordlist, gameReducer, constants,
                         dailyWord (Time Mode word-of-the-day), singaporeDate (SGT day boundary), username validation
src/storage/             localStorage abstraction: saved games, username, last mode/difficulty, Time Mode attempts
src/firebase/            Firestore client + leaderboard data-access layer (Time Mode only)
src/hooks/               useWordleGame (Normal mode), useTimeModeGame (Time Mode), useKeyboardInput
src/components/          DifficultySelector, ModeToggle, Game, Board, Tile, Keyboard, HintPanel, FinishScreen,
                         TimeMode, TimeModeGame, UsernameEntry, Leaderboard, Timer
```

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm test         # run the Vitest unit test suite
npm run lint     # oxlint
npm run build    # production build to dist/
```

Normal mode works immediately with no setup. **Time Mode requires a one-time Firebase project** (Firestore, free tier) — see `CLAUDE.md` for the full manual console walkthrough. Until that's configured, Time Mode's username claim will simply fail gracefully; the rest of the app is unaffected.

## Deployment

Every push to `main` builds and publishes automatically to GitHub Pages via `.github/workflows/deploy.yml` — no manual deploy step. `vite.config.js` sets `base: '/wordle/'` to match the Pages URL path; keep that in sync if the repo is ever renamed.

## Further reading

- `spec.md` — the original game design spec.
- `CLAUDE.md` — detailed conventions and architecture notes for anyone (human or AI) working in this codebase.
- `public/words/README.md` — word list file schema.
