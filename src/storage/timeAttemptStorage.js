import { timeAttemptKeyFor } from './keys.js';
import { localStorageAdapter } from './localStorageAdapter.js';

/**
 * @typedef {Object} TimeAttemptStorage
 * @property {(difficulty: number, dateString: string) => Promise<{startedAt: number, gameState: object}|null>} load
 * @property {(difficulty: number, dateString: string, attempt: {startedAt: number, gameState: object}) => Promise<void>} save
 * @property {(difficulty: number, dateString: string) => Promise<void>} clear
 */

/**
 * @param {typeof localStorageAdapter} adapter
 * @returns {TimeAttemptStorage}
 */
export function createTimeAttemptStorage(adapter) {
  return {
    async load(difficulty, dateString) {
      const raw = adapter.getItem(timeAttemptKeyFor(difficulty, dateString));
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    },
    async save(difficulty, dateString, attempt) {
      adapter.setItem(timeAttemptKeyFor(difficulty, dateString), JSON.stringify(attempt));
    },
    async clear(difficulty, dateString) {
      adapter.removeItem(timeAttemptKeyFor(difficulty, dateString));
    },
  };
}

export const timeAttemptStorage = createTimeAttemptStorage(localStorageAdapter);
