import { MAX_GUESSES } from '../../game/constants.js';
import Tile from '../Tile/Tile.jsx';
import styles from './Board.module.css';

export default function Board({ state, difficulty, animatedRow }) {
  const rows = [];

  for (let r = 0; r < MAX_GUESSES; r++) {
    const guess = state.guesses[r];
    const result = state.results[r];
    const isCurrentRow = r === state.guesses.length && state.status === 'playing';
    const letters = guess ? guess.split('') : isCurrentRow ? state.currentGuess.split('') : [];

    rows.push(
      <div className={styles.row} key={r}>
        {Array.from({ length: difficulty }).map((_, c) => (
          <Tile
            key={c}
            letter={letters[c] || ''}
            state={result ? result[c] : letters[c] ? 'filled' : 'empty'}
            colIndex={c}
            animate={r === animatedRow}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.board} style={{ '--difficulty': difficulty }}>
      {rows}
    </div>
  );
}
