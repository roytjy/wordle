import { useEffect, useState } from 'react';
import { useWordleGame } from '../../hooks/useWordleGame.js';
import { useKeyboardInput } from '../../hooks/useKeyboardInput.js';
import { WORD_LENGTHS } from '../../game/constants.js';
import { gameStorage } from '../../storage/storage.js';
import Board from '../Board/Board.jsx';
import Keyboard from '../Keyboard/Keyboard.jsx';
import HintPanel from '../HintPanel/HintPanel.jsx';
import FinishScreen from '../FinishScreen/FinishScreen.jsx';
import styles from './Game.module.css';

export default function Game({ difficulty, onSwitchDifficulty }) {
  const {
    state,
    shakeKey,
    animatedRow,
    handleKeyPress,
    handleBackspace,
    handleEnter,
    useLetterHint,
    useWordMeaningHint,
    startNewGame,
    resetSameWord,
  } = useWordleGame(difficulty);

  useKeyboardInput({
    enabled: state.status === 'playing',
    onLetter: handleKeyPress,
    onEnter: handleEnter,
    onBackspace: handleBackspace,
  });

  const [otherStatuses, setOtherStatuses] = useState(null);

  useEffect(() => {
    if (state.status !== 'won' && state.status !== 'lost') return;
    let cancelled = false;
    const others = WORD_LENGTHS.filter((length) => length !== difficulty);
    Promise.all(
      others.map((length) => gameStorage.getSaveStatus(length).then((s) => [length, s]))
    ).then((entries) => {
      if (!cancelled) setOtherStatuses(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [state.status, difficulty]);

  function handleResetSameWord() {
    if (window.confirm('Restart this game with the same word? Your current guesses will be cleared.')) {
      resetSameWord();
    }
  }

  async function handleResetOther(length) {
    await gameStorage.resetSave(length);
    onSwitchDifficulty(length);
  }

  if (state.status === 'loading') {
    return <p className={styles.message}>Loading word list…</p>;
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
      {(state.status === 'won' || state.status === 'lost') && (
        <FinishScreen
          status={state.status}
          answer={state.answer}
          difficulty={difficulty}
          otherDifficultyStatuses={otherStatuses}
          onPlayAgain={startNewGame}
          onSwitchDifficulty={onSwitchDifficulty}
          onResetOther={handleResetOther}
        />
      )}
      {state.status === 'playing' && (
        <button type="button" className={styles.restartButton} onClick={handleResetSameWord}>
          Restart (same word)
        </button>
      )}
      <Board state={state} difficulty={difficulty} animatedRow={animatedRow} />
      <HintPanel
        state={state}
        onUseLetterHint={useLetterHint}
        onUseWordMeaningHint={useWordMeaningHint}
      />
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
