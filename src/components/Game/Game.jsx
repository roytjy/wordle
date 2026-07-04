import { useWordleGame } from '../../hooks/useWordleGame.js';
import { useKeyboardInput } from '../../hooks/useKeyboardInput.js';
import Board from '../Board/Board.jsx';
import Keyboard from '../Keyboard/Keyboard.jsx';
import HintPanel from '../HintPanel/HintPanel.jsx';
import StatusBanner from '../StatusBanner/StatusBanner.jsx';
import styles from './Game.module.css';

export default function Game({ difficulty }) {
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
  } = useWordleGame(difficulty);

  useKeyboardInput({
    enabled: state.status === 'playing',
    onLetter: handleKeyPress,
    onEnter: handleEnter,
    onBackspace: handleBackspace,
  });

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
      <StatusBanner state={state} onPlayAgain={startNewGame} />
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
