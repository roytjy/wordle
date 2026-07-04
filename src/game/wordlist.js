const cache = new Map();

/**
 * Loads and validates the word list for a given difficulty from
 * public/words/words-{difficulty}.json, plus the guess-only dictionary from
 * public/words/words-{difficulty}-dictionary.json. Makes no assumptions
 * about list size, so it works identically for placeholder or real files.
 *
 * The core list is required: throws on any missing/malformed data, so
 * callers surface a clear error state rather than falling back to a
 * hardcoded list. The dictionary is purely additive (widens what counts
 * as a valid guess beyond the core list) and degrades gracefully - a
 * missing/malformed dictionary file logs a warning and yields an empty
 * set instead of failing the whole game.
 */
export function loadWordList(difficulty) {
  if (cache.has(difficulty)) return cache.get(difficulty);

  const promise = Promise.all([
    fetch(`${import.meta.env.BASE_URL}words/words-${difficulty}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Word list HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => validate(data, difficulty)),
    loadDictionary(difficulty),
  ])
    .then(([{ words, wordSet, definitions }, dictionarySet]) => ({
      words,
      wordSet,
      definitions,
      dictionarySet,
    }))
    .catch((err) => {
      cache.delete(difficulty);
      throw err;
    });

  cache.set(difficulty, promise);
  return promise;
}

function validate(data, difficulty) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Word list for length ${difficulty} is empty or malformed`);
  }

  const words = [];
  const definitions = new Map();

  for (const entry of data) {
    if (typeof entry?.word !== 'string' || entry.word.length !== difficulty) {
      throw new Error(`Invalid entry for length ${difficulty}: ${JSON.stringify(entry)}`);
    }
    const word = entry.word.toUpperCase();
    words.push(word);
    definitions.set(word, entry.definition ?? '');
  }

  return { words, wordSet: new Set(words), definitions };
}

function loadDictionary(difficulty) {
  return fetch(`${import.meta.env.BASE_URL}words/words-${difficulty}-dictionary.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`Dictionary HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => parseDictionary(data, difficulty))
    .catch((err) => {
      console.warn(`Guess dictionary unavailable for length ${difficulty}:`, err.message);
      return new Set();
    });
}

export function parseDictionary(data, difficulty) {
  if (!Array.isArray(data)) return new Set();
  const words = data.filter(
    (word) => typeof word === 'string' && word.length === difficulty
  );
  return new Set(words.map((word) => word.toUpperCase()));
}
