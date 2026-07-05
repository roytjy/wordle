import { MAX_GUESSES, HINT_LIMITS } from './constants.js';
import { evaluateGuess } from './evaluateGuess.js';
import { applyGuessToKeyboard, mergeKeyboardStatus } from './keyboardStatus.js';

export function createInitialState(difficulty) {
  return {
    status: 'loading',
    errorMessage: null,
    difficulty,
    answer: '',
    definition: '',
    guesses: [],
    results: [],
    currentGuess: '',
    keyboardStatuses: {},
    hintsUsed: { letterReveal: 0, wordMeaning: 0 },
    hintedLetters: [],
    definitionRevealed: false,
  };
}

export function resetProgress(state) {
  return {
    ...state,
    guesses: [],
    results: [],
    currentGuess: '',
    keyboardStatuses: {},
    hintsUsed: { letterReveal: 0, wordMeaning: 0 },
    hintedLetters: [],
    definitionRevealed: false,
    status: 'playing',
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'ERROR':
      return { ...state, status: 'error', errorMessage: action.message };

    case 'RESET_SAME_WORD':
      return resetProgress(state);

    case 'RESTORE':
      return { ...action.state };

    case 'NEW_GAME':
      return {
        ...createInitialState(state.difficulty),
        status: 'playing',
        answer: action.answer,
        definition: action.definition,
      };

    case 'INPUT_LETTER': {
      if (state.status !== 'playing') return state;
      if (state.currentGuess.length >= state.answer.length) return state;
      return { ...state, currentGuess: state.currentGuess + action.letter };
    }

    case 'DELETE_LETTER': {
      if (state.status !== 'playing') return state;
      return { ...state, currentGuess: state.currentGuess.slice(0, -1) };
    }

    case 'SUBMIT_GUESS': {
      if (state.status !== 'playing') return state;
      const guess = state.currentGuess;
      const result = evaluateGuess(guess, state.answer);
      const guesses = [...state.guesses, guess];
      const results = [...state.results, result];
      const keyboardStatuses = applyGuessToKeyboard(state.keyboardStatuses, guess, result);
      const won = guess === state.answer;
      const lost = !won && guesses.length >= MAX_GUESSES;
      return {
        ...state,
        guesses,
        results,
        keyboardStatuses,
        currentGuess: '',
        status: won ? 'won' : lost ? 'lost' : 'playing',
      };
    }

    case 'USE_LETTER_HINT': {
      if (state.status !== 'playing') return state;
      if (state.hintsUsed.letterReveal >= HINT_LIMITS.letterReveal) return state;
      if (!action.letter) return state;
      return {
        ...state,
        keyboardStatuses: mergeKeyboardStatus(state.keyboardStatuses, action.letter, 'yellow'),
        hintedLetters: [...state.hintedLetters, action.letter],
        hintsUsed: { ...state.hintsUsed, letterReveal: state.hintsUsed.letterReveal + 1 },
      };
    }

    case 'USE_WORD_MEANING_HINT': {
      if (state.status !== 'playing' && state.status !== 'won' && state.status !== 'lost') return state;
      if (state.hintsUsed.wordMeaning >= HINT_LIMITS.wordMeaning) return state;
      return {
        ...state,
        definitionRevealed: true,
        hintsUsed: { ...state.hintsUsed, wordMeaning: state.hintsUsed.wordMeaning + 1 },
      };
    }

    default:
      return state;
  }
}
