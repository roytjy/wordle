import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { gameReducer, createInitialState } from '../game/gameReducer.js';
import { loadWordList } from '../game/wordlist.js';
import { pickDailyWord } from '../game/dailyWord.js';
import { timeAttemptStorage } from '../storage/timeAttemptStorage.js';
import { submitResult } from '../firebase/leaderboard.js';

export function useTimeModeGame(difficulty, username, dateString) {
  const [state, dispatch] = useReducer(gameReducer, difficulty, createInitialState);
  const [shakeKey, setShakeKey] = useState(0);
  const [animatedRow, setAnimatedRow] = useState(-1);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const wordDataRef = useRef(null);
  // Set once per attempt and never rewritten afterward - a mid-attempt
  // refresh resumes counting from real elapsed time instead of resetting.
  const startedAtRef = useRef(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    startedAtRef.current = null;
    submittedRef.current = false;
    setSubmitStatus('idle');
    setElapsedMs(0);

    loadWordList(difficulty)
      .then(async (wordData) => {
        if (cancelled) return;
        wordDataRef.current = wordData;
        const answer = pickDailyWord(wordData.words, dateString, difficulty);
        const definition = wordData.definitions.get(answer) || '';
        const saved = await timeAttemptStorage.load(difficulty, dateString);
        if (cancelled) return;
        if (saved?.gameState?.answer === answer) {
          startedAtRef.current = saved.startedAt;
          dispatch({ type: 'RESTORE', state: saved.gameState });
        } else {
          startedAtRef.current = Date.now();
          dispatch({ type: 'NEW_GAME', answer, definition });
        }
      })
      .catch((err) => {
        if (!cancelled) dispatch({ type: 'ERROR', message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [difficulty, dateString]);

  useEffect(() => {
    if (state.status === 'loading' || state.status === 'error') return;
    if (startedAtRef.current == null) return;
    timeAttemptStorage.save(difficulty, dateString, {
      startedAt: startedAtRef.current,
      gameState: state,
    });
  }, [state, difficulty, dateString]);

  useEffect(() => {
    if (state.status !== 'playing' || startedAtRef.current == null) return;
    const tick = () => setElapsedMs(Date.now() - startedAtRef.current);
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== 'won' && state.status !== 'lost') return;
    if (submittedRef.current || startedAtRef.current == null) return;
    submittedRef.current = true;
    const finishedAt = Date.now();
    setElapsedMs(finishedAt - startedAtRef.current);
    setSubmitStatus('submitting');
    submitResult({
      difficulty,
      dateString,
      username,
      status: state.status,
      timeMs: state.status === 'won' ? finishedAt - startedAtRef.current : null,
    }).then((result) => {
      setSubmitStatus(result.ok ? 'done' : 'error');
    });
  }, [state.status, difficulty, dateString, username]);

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
    const isAcceptable = wordData.wordSet.has(guess) || wordData.dictionarySet.has(guess);
    if (guess.length !== state.answer.length || !isAcceptable) {
      setShakeKey((k) => k + 1);
      return;
    }
    setAnimatedRow(state.guesses.length);
    dispatch({ type: 'SUBMIT_GUESS' });
  }, [state.currentGuess, state.status, state.answer.length, state.guesses.length]);

  return {
    state,
    shakeKey,
    animatedRow,
    elapsedMs,
    submitStatus,
    handleKeyPress,
    handleBackspace,
    handleEnter,
  };
}
