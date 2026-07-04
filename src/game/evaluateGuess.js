/**
 * Evaluates a guess against the answer, returning an array of
 * 'green' | 'yellow' | 'gray' aligned by index with the guess.
 *
 * Two-pass algorithm so duplicate letters are handled correctly:
 * greens claim their answer-letter slot first, and yellows can only
 * be assigned from what's left over after greens are removed.
 */
export function evaluateGuess(guess, answer) {
  const length = answer.length;
  const result = new Array(length).fill('gray');
  const remaining = {};

  for (let i = 0; i < length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'green';
    } else {
      remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
    }
  }

  for (let i = 0; i < length; i++) {
    if (result[i] === 'green') continue;
    const letter = guess[i];
    if (remaining[letter] > 0) {
      result[i] = 'yellow';
      remaining[letter] -= 1;
    }
  }

  return result;
}
