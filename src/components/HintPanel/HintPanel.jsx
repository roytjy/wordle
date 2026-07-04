import { HINT_LIMITS } from '../../game/constants.js';
import styles from './HintPanel.module.css';

export default function HintPanel({ state, onUseLetterHint, onUseWordMeaningHint }) {
  const letterHintsLeft = Math.max(HINT_LIMITS.letterReveal - state.hintsUsed.letterReveal, 0);
  const wordMeaningHintsLeft = Math.max(HINT_LIMITS.wordMeaning - state.hintsUsed.wordMeaning, 0);
  const canUseLetterHint = state.status === 'playing' && letterHintsLeft > 0;
  const canUseWordMeaningHint = wordMeaningHintsLeft > 0;

  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={styles.button}
        disabled={!canUseLetterHint}
        onClick={onUseLetterHint}
      >
        Reveal a letter ({letterHintsLeft} left)
      </button>
      <button
        type="button"
        className={styles.button}
        disabled={!canUseWordMeaningHint}
        onClick={onUseWordMeaningHint}
      >
        Reveal meaning ({wordMeaningHintsLeft} left)
      </button>
      {state.definitionRevealed && <p className={styles.definition}>{state.definition}</p>}
    </div>
  );
}
