import styles from './ModeToggle.module.css';

const MODES = [
  { value: 'normal', label: 'Normal' },
  { value: 'time', label: 'Time Mode' },
];

export default function ModeToggle({ value, onChange }) {
  return (
    <div className={styles.selector} role="radiogroup" aria-label="Game mode">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          type="button"
          role="radio"
          aria-checked={value === mode.value}
          className={`${styles.option} ${value === mode.value ? styles.active : ''}`}
          onClick={() => onChange(mode.value)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
