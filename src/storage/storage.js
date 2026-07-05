import { keyFor, META_KEY, USERNAME_KEY, MODE_KEY } from './keys.js';
import { localStorageAdapter } from './localStorageAdapter.js';
import { resetProgress } from '../game/gameReducer.js';

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
 * @property {(difficulty: number) => Promise<'not-started'|'in-progress'|'completed'>} getSaveStatus
 * @property {(difficulty: number) => Promise<void>} resetSave
 * @property {() => Promise<string|null>} loadUsername
 * @property {(name: string) => Promise<void>} saveUsername
 * @property {() => Promise<'normal'|'time'|null>} loadLastMode
 * @property {(mode: 'normal'|'time') => Promise<void>} saveLastMode
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
    async getSaveStatus(difficulty) {
      const saved = await this.load(difficulty);
      if (!saved) return 'not-started';
      return saved.status === 'playing' ? 'in-progress' : 'completed';
    },
    async resetSave(difficulty) {
      const saved = await this.load(difficulty);
      if (!saved) return;
      await this.save(difficulty, resetProgress(saved));
    },
    async loadUsername() {
      return adapter.getItem(USERNAME_KEY);
    },
    async saveUsername(name) {
      adapter.setItem(USERNAME_KEY, name);
    },
    async loadLastMode() {
      const raw = adapter.getItem(MODE_KEY);
      return raw === 'normal' || raw === 'time' ? raw : null;
    },
    async saveLastMode(mode) {
      adapter.setItem(MODE_KEY, mode);
    },
  };
}

export const gameStorage = createGameStorage(localStorageAdapter);
