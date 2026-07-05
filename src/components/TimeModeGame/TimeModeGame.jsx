import { useEffect } from 'react';
import { useTimeModeGame } from '../../hooks/useTimeModeGame.js';
import { useKeyboardInput } from '../../hooks/useKeyboardInput.js';
import Board from '../Board/Board.jsx';
import Keyboard from '../Keyboard/Keyboard.jsx';
import Timer from '../Timer/Timer.jsx';
import styles from './TimeModeGame.module.css';

export default function TimeModeGame({ difficulty, username, dateString, onFinished }) {
  const { state, shakeKey, animatedRow, elapsedMs, submitStatus, handleKeyPress, handleBackspace, handleEnter } =
    useTimeModeGame(difficulty, username, dateString);

  useKeyboardInput({
    enabled: state.status === 'playing',
    onLetter: handleKeyPress,
    onEnter: handleEnter,
    onBackspace: handleBackspace,
  });

  useEffect(() => {
    if (submitStatus === 'done') onFinished();
  }, [submitStatus, onFinished]);

  if (state.status === 'loading') {
    return <p className={styles.message}>Loading today's word…</p>;
  }

  if (state.status === 'error') {
    return (
      <p className={styles.error}>
        Couldn't load the word list for {difficulty}-letter words: {state.errorMessage}
      </p>
    );
  }

  return (
    <div className={styles.game}>
      <Timer elapsedMs={elapsedMs} />
      {(state.status === 'won' || state.status === 'lost') && (
        <p className={styles.message}>
          {state.status === 'won' ? 'Solved!' : `Out of guesses. The word was ${state.answer}.`} Submitting your
          result…
        </p>
      )}
      <Board state={state} difficulty={difficulty} animatedRow={animatedRow} />
      <Keyboard
        shakeKey={shakeKey}
        keyboardStatuses={state.keyboardStatuses}
        disabled={state.status !== 'playing'}
        onLetter={handleKeyPress}
        onEnter={handleEnter}
        onBackspace={handleBackspace}
      />
    </div>
  );
}
