/** FNV-1a, 32-bit — simple, dependency-free deterministic hash. */
export function fnv1aHash(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Deterministically picks the word-of-the-day out of an already-loaded word
 * list: same dateString + difficulty always yields the same index for every
 * player, with no network round trip for the word itself.
 */
export function pickDailyWord(words, dateString, difficulty) {
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error('pickDailyWord requires a non-empty word list');
  }
  const seed = fnv1aHash(`${dateString}:${difficulty}`);
  return words[seed % words.length];
}
