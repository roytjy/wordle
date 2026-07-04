import { keyFor, META_KEY } from './keys.js';
import { localStorageAdapter } from './localStorageAdapter.js';

const REQUIRED_FIELDS = [
  'status',
  'difficulty',
  'answer',
  'guesses',
  'results',
  'currentGuess',
  'keyboardStatuses',
  'hintsUsed',
  'hintedLetters',
];

function isValidSave(parsed, difficulty) {
  if (!parsed || typeof parsed !== 'object') return false;
  if (parsed.difficulty !== difficulty) return false;
  return REQUIRED_FIELDS.every((field) => field in parsed);
}

/**
 * @typedef {Object} GameStorage
 * @property {(difficulty: number) => Promise<object|null>} load
 * @property {(difficulty: number, state: object) => Promise<void>} save
 * @property {(difficulty: number) => Promise<void>} clear
 * @property {() => Promise<number|null>} loadLastDifficulty
 * @property {(difficulty: number) => Promise<void>} saveLastDifficulty
 */

/**
 * @param {typeof localStorageAdapter} adapter
 * @returns {GameStorage}
 */
export function createGameStorage(adapter) {
  return {
    async load(difficulty) {
      const raw = adapter.getItem(keyFor(difficulty));
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        return isValidSave(parsed, difficulty) ? parsed : null;
      } catch {
        return null;
      }
    },
    async save(difficulty, state) {
      adapter.setItem(keyFor(difficulty), JSON.stringify(state));
    },
    async clear(difficulty) {
      adapter.removeItem(keyFor(difficulty));
    },
    async loadLastDifficulty() {
      const raw = adapter.getItem(META_KEY);
      const parsed = raw ? Number(raw) : null;
      return Number.isFinite(parsed) ? parsed : null;
    },
    async saveLastDifficulty(difficulty) {
      adapter.setItem(META_KEY, String(difficulty));
    },
  };
}

export const gameStorage = createGameStorage(localStorageAdapter);
