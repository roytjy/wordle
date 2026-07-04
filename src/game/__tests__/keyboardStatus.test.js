import { describe, it, expect } from 'vitest';
import { mergeKeyboardStatus, applyGuessToKeyboard } from '../keyboardStatus.js';

describe('mergeKeyboardStatus', () => {
  it('sets a status for a previously unseen letter', () => {
    expect(mergeKeyboardStatus({}, 'A', 'gray')).toEqual({ A: 'gray' });
  });

  it('upgrades gray to yellow', () => {
    expect(mergeKeyboardStatus({ A: 'gray' }, 'A', 'yellow')).toEqual({ A: 'yellow' });
  });

  it('upgrades yellow to green', () => {
    expect(mergeKeyboardStatus({ A: 'yellow' }, 'A', 'green')).toEqual({ A: 'green' });
  });

  it('never downgrades green to yellow or gray', () => {
    expect(mergeKeyboardStatus({ A: 'green' }, 'A', 'yellow')).toEqual({ A: 'green' });
    expect(mergeKeyboardStatus({ A: 'green' }, 'A', 'gray')).toEqual({ A: 'green' });
  });

  it('never downgrades yellow to gray', () => {
    expect(mergeKeyboardStatus({ A: 'yellow' }, 'A', 'gray')).toEqual({ A: 'yellow' });
  });
});

describe('applyGuessToKeyboard', () => {
  it('folds a full guess result into keyboard statuses, taking the best per letter', () => {
    // guess LLOOO with results e.g. [gray, gray, gray, gray, green] for letter mix
    const result = applyGuessToKeyboard({}, 'LLOOO', ['gray', 'yellow', 'gray', 'gray', 'green']);
    expect(result.L).toBe('yellow'); // best of gray, yellow for L
    expect(result.O).toBe('green'); // best of gray, gray, green for O
  });
});
