import { describe, it, expect } from 'vitest';
import { parseDictionary } from '../wordlist.js';

describe('parseDictionary', () => {
  it('parses a flat array of words into an uppercase Set', () => {
    const result = parseDictionary(['apple', 'BRAVE', 'Grape'], 5);
    expect(result).toEqual(new Set(['APPLE', 'BRAVE', 'GRAPE']));
  });

  it('filters out entries with the wrong length instead of throwing', () => {
    const result = parseDictionary(['APPLE', 'TOOLONGWORD', 'HI'], 5);
    expect(result).toEqual(new Set(['APPLE']));
  });

  it('filters out non-string entries instead of throwing', () => {
    const result = parseDictionary(['APPLE', 123, null, { word: 'BRAVE' }], 5);
    expect(result).toEqual(new Set(['APPLE']));
  });

  it('returns an empty Set for malformed (non-array) data', () => {
    expect(parseDictionary(null, 5)).toEqual(new Set());
    expect(parseDictionary({ word: 'APPLE' }, 5)).toEqual(new Set());
  });

  it('returns an empty Set for an empty array', () => {
    expect(parseDictionary([], 5)).toEqual(new Set());
  });
});
