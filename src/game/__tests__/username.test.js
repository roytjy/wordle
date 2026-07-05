import { describe, it, expect } from 'vitest';
import { isValidUsername, normalizeUsername } from '../username.js';

describe('isValidUsername', () => {
  it('accepts alphanumeric/underscore names between 3 and 20 chars', () => {
    expect(isValidUsername('roy_tan1')).toBe(true);
    expect(isValidUsername('abc')).toBe(true);
    expect(isValidUsername('a'.repeat(20))).toBe(true);
  });

  it('rejects names that are too short or too long', () => {
    expect(isValidUsername('ab')).toBe(false);
    expect(isValidUsername('a'.repeat(21))).toBe(false);
  });

  it('rejects names with disallowed characters', () => {
    expect(isValidUsername('roy tan')).toBe(false);
    expect(isValidUsername('roy@tan')).toBe(false);
    expect(isValidUsername('roy-tan')).toBe(false);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(isValidUsername('  roytan  ')).toBe(true);
  });

  it('rejects non-string input', () => {
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(123)).toBe(false);
  });
});

describe('normalizeUsername', () => {
  it('trims and lowercases', () => {
    expect(normalizeUsername('  RoyTan  ')).toBe('roytan');
  });
});
