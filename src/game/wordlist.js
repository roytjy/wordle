const cache = new Map();

/**
 * Loads and validates the word list for a given difficulty from
 * public/words/words-{difficulty}.json. Makes no assumptions about list
 * size, so it works identically for placeholder or real (~2000 word) files.
 * Throws on any missing/malformed data - callers should surface this as
 * a clear error state, not fall back to a hardcoded list.
 */
export function loadWordList(difficulty) {
  if (cache.has(difficulty)) return cache.get(difficulty);

  const promise = fetch(`${import.meta.env.BASE_URL}words/words-${difficulty}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`Word list HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => validate(data, difficulty))
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
