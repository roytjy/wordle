const STORAGE_VERSION = 'v1';

export const keyFor = (difficulty) => `wordle:${STORAGE_VERSION}:save:${difficulty}`;

export const META_KEY = `wordle:${STORAGE_VERSION}:lastDifficulty`;
