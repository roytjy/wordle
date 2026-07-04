import styles from './StatusBanner.module.css';

export default function StatusBanner({ state, onPlayAgain }) {
  if (state.status === 'won') {
    return (
      <div className={styles.banner}>
        <p className={styles.message}>You got it! 🎉</p>
        <button type="button" className={styles.button} onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    );
  }

  if (state.status === 'lost') {
    return (
      <div className={styles.banner}>
        <p className={styles.message}>Out of guesses. The word was {state.answer}.</p>
        <button type="button" className={styles.button} onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    );
  }

  return null;
}
