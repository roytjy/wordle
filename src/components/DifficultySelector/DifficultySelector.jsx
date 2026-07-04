import { WORD_LENGTHS } from '../../game/constants.js';
import styles from './DifficultySelector.module.css';

export default function DifficultySelector({ value, onChange }) {
  return (
    <div className={styles.selector} role="radiogroup" aria-label="Word length">
      {WORD_LENGTHS.map((length) => (
        <button
          key={length}
          type="button"
          role="radio"
          aria-checked={value === length}
          className={`${styles.option} ${value === length ? styles.active : ''}`}
          onClick={() => onChange(length)}
        >
          {length} letters
        </button>
      ))}
    </div>
  );
}
