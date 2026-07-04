import styles from './Keyboard.module.css';

export default function Key({ label, wide, status, disabled, onClick }) {
  const className = [styles.key, wide ? styles.wide : '', status ? styles[status] : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={className} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
