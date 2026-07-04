import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { gameReducer, createInitialState } from '../game/gameReducer.js';
import { loadWordList } from '../game/wordlist.js';
import { pickHintLetter } from '../game/hints.js';
import { HINT_LIMITS } from '../game/constants.js';
import { gameStorage } from '../storage/storage.js';

function pickRandomAnswer(wordData) {
  const answer = wordData.words[Math.floor(Math.random() * wordData.words.length)];
  return { answer, definition: wordData.definitions.get(answer) || '' };
}

export function useWordleGame(difficulty) {
  const [state, dispatch] = useReducer(gameReducer, difficulty, createInitialState);
  const [shakeKey, setShakeKey] = useState(0);
  // Row index of the guess just submitted this session, so only that row
  // plays the flip animation - rows restored from storage render statically.
  const [animatedRow, setAnimatedRow] = useState(-1);
  const wordDataRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadWordList(difficulty)
      .then(async (wordData) => {
        if (cancelled) return;
        wordDataRef.current = wordData;
        const saved = await gameStorage.load(difficulty);
        if (cancelled) return;
        if (saved) {
          dispatch({ type: 'RESTORE', state: saved });
        } else {
          const { answer, definition } = pickRandomAnswer(wordData);
          dispatch({ type: 'NEW_GAME', answer, definition });
        }
        gameStorage.saveLastDifficulty(difficulty);
      })
      .catch((err) => {
        if (!cancelled) dispatch({ type: 'ERROR', message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [difficulty]);

  useEffect(() => {
    if (state.status === 'loading' || state.status === 'error') return;
    gameStorage.save(difficulty, state);
  }, [state, difficulty]);

  const handleKeyPress = useCallback((letter) => {
    dispatch({ type: 'INPUT_LETTER', letter });
  }, []);

  const handleBackspace = useCallback(() => {
    dispatch({ type: 'DELETE_LETTER' });
  }, []);

  const handleEnter = useCallback(() => {
    const wordData = wordDataRef.current;
    if (!wordData || state.status !== 'playing') return;
    const guess = state.currentGuess;
    if (guess.length !== state.answer.length || !wordData.wordSet.has(guess)) {
      setShakeKey((k) => k + 1);
      return;
    }
    setAnimatedRow(state.guesses.length);
    dispatch({ type: 'SUBMIT_GUESS' });
  }, [state.currentGuess, state.status, state.answer.length, state.guesses.length]);

  const useLetterHint = useCallback(() => {
    if (state.hintsUsed.letterReveal >= HINT_LIMITS.letterReveal) return;
    const letter = pickHintLetter(state.answer, state.keyboardStatuses, state.hintedLetters);
    if (letter) dispatch({ type: 'USE_LETTER_HINT', letter });
  }, [state.answer, state.keyboardStatuses, state.hintedLetters, state.hintsUsed.letterReveal]);

  const useWordMeaningHint = useCallback(() => {
    dispatch({ type: 'USE_WORD_MEANING_HINT' });
  }, []);

  const startNewGame = useCallback(() => {
    const wordData = wordDataRef.current;
    if (!wordData) return;
    const { answer, definition } = pickRandomAnswer(wordData);
    setAnimatedRow(-1);
    dispatch({ type: 'NEW_GAME', answer, definition });
  }, []);

  return {
    state,
    shakeKey,
    animatedRow,
    handleKeyPress,
    handleBackspace,
    handleEnter,
    useLetterHint,
    useWordMeaningHint,
    startNewGame,
  };
}
