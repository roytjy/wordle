const STORAGE_VERSION = 'v1';

export const keyFor = (difficulty) => `wordle:${STORAGE_VERSION}:save:${difficulty}`;

export const META_KEY = `wordle:${STORAGE_VERSION}:lastDifficulty`;

export const timeAttemptKeyFor = (difficulty, dateString) =>
  `wordle:${STORAGE_VERSION}:timeAttempt:${difficulty}:${dateString}`;

export const USERNAME_KEY = `wordle:${STORAGE_VERSION}:username`;

export const MODE_KEY = `wordle:${STORAGE_VERSION}:lastMode`;
