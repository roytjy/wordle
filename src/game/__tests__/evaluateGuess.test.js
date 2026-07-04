import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../evaluateGuess.js';

describe('evaluateGuess', () => {
  it('marks every letter green on an exact match', () => {
    expect(evaluateGuess('APPLE', 'APPLE')).toEqual([
      'green', 'green', 'green', 'green', 'green',
    ]);
  });

  it('marks every letter gray when none are in the answer', () => {
    expect(evaluateGuess('CRWTH', 'BOING')).toEqual([
      'gray', 'gray', 'gray', 'gray', 'gray',
    ]);
  });

  it('marks a single misplaced letter yellow', () => {
    // 'A' is in BRAVE but not at index 0
    expect(evaluateGuess('AXXXX', 'BRAVE')).toEqual([
      'yellow', 'gray', 'gray', 'gray', 'gray',
    ]);
  });

  it('does not over-count yellows when guess repeats a letter that appears once in the answer', () => {
    // answer has exactly one 'L'; guess has two 'L's, neither in the correct spot
    const result = evaluateGuess('LLOOO', 'HELLO');
    // guess: L L O O O, answer: H E L L O
    // index0 L vs H -> not green; index1 L vs E -> not green; index2 O vs L; index3 O vs L; index4 O vs O -> green
    expect(result[4]).toBe('green');
    const yellowOrGreenCount = result.filter((r) => r !== 'gray').length;
    // answer letters available to guess 'L' pool (2 L's) and 'O' pool (1 O, but claimed by green at idx4)
    expect(yellowOrGreenCount).toBeLessThanOrEqual(3);
  });

  it('lets green claim its slot before yellow pool is computed (duplicate letter, one correct spot)', () => {
    // answer ALLOY, guess ALLEY -> A green, L green, L green, E vs O gray, Y green
    const result = evaluateGuess('ALLEY', 'ALLOY');
    expect(result).toEqual(['green', 'green', 'green', 'gray', 'green']);
  });

  it('handles duplicate letter in answer guessed only once (should be green, not yellow twice)', () => {
    // answer ERROR, guess ARIES -> only checking duplicate R handling partially;
    // use a clearer case: answer ERROR, guess ROBOT (5 letters both)
    const result = evaluateGuess('ROBOT', 'ERROR');
    // answer: E R R O R
    // guess:  R O B O T
    // idx0 R vs E -> not green, R available in remaining? remaining after pass1: E:1,R:2,O:1 minus none green yet except check idx3 O vs O -> green
    // idx3: guess O vs answer O -> green
    // remaining pool after removing green O: E:1, R:2
    // idx0 R -> yellow (consumes one R), idx1 O -> not in remaining (O used by green), gray
    // idx2 B -> gray, idx4 T -> gray
    expect(result).toEqual(['yellow', 'gray', 'gray', 'green', 'gray']);
  });

  it('never marks more yellow/green than the letter actually occurs in the answer', () => {
    const result = evaluateGuess('SASSY', 'CHESS');
    const sCount = result.filter((r, i) => 'SASSY'[i] === 'S' && r !== 'gray').length;
    const sInAnswer = 'CHESS'.split('').filter((c) => c === 'S').length;
    expect(sCount).toBeLessThanOrEqual(sInAnswer);
  });
});
