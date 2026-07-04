/**
 * Picks a letter that's in the answer but neither already known via
 * keyboard status nor already surfaced by a previous letter-reveal hint.
 * Returns null when no such letter remains.
 */
export function pickHintLetter(answer, keyboardStatuses, hintedLetters) {
  const alreadyKnown = new Set(Object.keys(keyboardStatuses));
  const alreadyHinted = new Set(hintedLetters);
  const candidates = [...new Set(answer.split(''))].filter(
    (letter) => !alreadyKnown.has(letter) && !alreadyHinted.has(letter)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
