const RANK = { gray: 0, yellow: 1, green: 2 };

/**
 * Merges a single (letter, status) result into the accumulated keyboard
 * statuses, upgrading only - a key's color never regresses once it has
 * been marked green or yellow by an earlier guess.
 */
export function mergeKeyboardStatus(current, letter, status) {
  if (!current[letter] || RANK[status] > RANK[current[letter]]) {
    return { ...current, [letter]: status };
  }
  return current;
}

/**
 * Folds a full guess + its evaluateGuess result into keyboard statuses.
 */
export function applyGuessToKeyboard(current, guess, result) {
  let next = current;
  for (let i = 0; i < guess.length; i++) {
    next = mergeKeyboardStatus(next, guess[i], result[i]);
  }
  return next;
}
