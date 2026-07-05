import { describe, it, expect } from 'vitest';
import { fnv1aHash, pickDailyWord } from '../dailyWord.js';

describe('fnv1aHash', () => {
  it('is deterministic for the same input', () => {
    expect(fnv1aHash('2026-07-05:5')).toBe(fnv1aHash('2026-07-05:5'));
  });

  it('differs for different inputs', () => {
    expect(fnv1aHash('2026-07-05:5')).not.toBe(fnv1aHash('2026-07-06:5'));
  });
});

describe('pickDailyWord', () => {
  const words = ['apple', 'crane', 'mango', 'zebra', 'quilt'];

  it('is deterministic for the same date and difficulty', () => {
    expect(pickDailyWord(words, '2026-07-05', 5)).toBe(pickDailyWord(words, '2026-07-05', 5));
  });

  it('usually differs across dates', () => {
    const results = new Set(
      ['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05'].map((d) =>
        pickDailyWord(words, d, 5)
      )
    );
    expect(results.size).toBeGreaterThan(1);
  });

  it('usually differs across difficulties for the same date', () => {
    const results = new Set([5, 6, 7].map((d) => pickDailyWord(words, '2026-07-05', d)));
    expect(results.size).toBeGreaterThan(1);
  });

  it('always returns an element from the list', () => {
    for (const d of ['2026-01-01', '2026-12-31', '2027-06-15']) {
      expect(words).toContain(pickDailyWord(words, d, 6));
    }
  });

  it('throws on an empty word list', () => {
    expect(() => pickDailyWord([], '2026-07-05', 5)).toThrow();
  });
});
