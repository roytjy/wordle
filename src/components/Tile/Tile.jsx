import styles from './Tile.module.css';

const REVEALED = new Set(['green', 'yellow', 'gray']);

export default function Tile({ letter, state, colIndex, animate }) {
  const className = [
    styles.tile,
    styles[state] || '',
    animate && letter && REVEALED.has(state) ? styles.reveal : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} style={{ '--col-index': colIndex }}>
      {letter}
    </div>
  );
}
