import { WORD_LENGTHS } from '../../game/constants.js';
import styles from './FinishScreen.module.css';

const STATUS_LABELS = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
};

export default function FinishScreen({
  status,
  answer,
  difficulty,
  otherDifficultyStatuses,
  onPlayAgain,
  onSwitchDifficulty,
  onResetOther,
}) {
  const others = WORD_LENGTHS.filter((length) => length !== difficulty);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        {status === 'won' ? (
          <>
            <h2 className={styles.heading}>Congrats!</h2>
            <p className={styles.message}>You got it! 🎉</p>
          </>
        ) : (
          <>
            <h2 className={styles.heading}>So close!</h2>
            <p className={styles.message}>Out of guesses. The word was {answer}.</p>
          </>
        )}

        <button type="button" className={styles.primaryButton} onClick={onPlayAgain}>
          Play again
        </button>

        <div className={styles.otherGames}>
          {others.map((length) => {
            const saveStatus = otherDifficultyStatuses?.[length];
            return (
              <div key={length} className={styles.otherGameRow}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => onSwitchDifficulty(length)}
                >
                  {length} letters{saveStatus ? ` — ${STATUS_LABELS[saveStatus]}` : ''}
                </button>
                {saveStatus === 'in-progress' && (
                  <button
                    type="button"
                    className={styles.resetButton}
                    onClick={() => onResetOther(length)}
                  >
                    Reset (same word)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
