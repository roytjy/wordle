import { describe, it, expect, vi, afterEach } from 'vitest';
import { pickHintLetter } from '../hints.js';

describe('pickHintLetter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('never returns a letter already known via keyboard status', () => {
    // answer BRAVE, 'B' already known
    for (let i = 0; i < 20; i++) {
      const letter = pickHintLetter('BRAVE', { B: 'green' }, []);
      expect(letter).not.toBe('B');
    }
  });

  it('never returns a letter already surfaced by a previous hint', () => {
    for (let i = 0; i < 20; i++) {
      const letter = pickHintLetter('BRAVE', {}, ['R']);
      expect(letter).not.toBe('R');
    }
  });

  it('returns null when every letter has been either guessed or hinted', () => {
    const letter = pickHintLetter('CAT', { C: 'green', A: 'green' }, ['T']);
    expect(letter).toBeNull();
  });

  it('only ever returns letters that are actually in the answer', () => {
    for (let i = 0; i < 20; i++) {
      const letter = pickHintLetter('BRAVE', {}, []);
      expect('BRAVE'.split('')).toContain(letter);
    }
  });
});
