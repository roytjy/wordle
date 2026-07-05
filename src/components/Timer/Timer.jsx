import styles from './Timer.module.css';

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function Timer({ elapsedMs }) {
  return (
    <div className={styles.timer}>
      <span className={styles.label}>Time</span>
      <span className={styles.value}>{formatElapsed(elapsedMs)}</span>
    </div>
  );
}
