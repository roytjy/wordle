import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../../firebase/leaderboard.js';
import { normalizeUsername } from '../../game/username.js';
import styles from './Leaderboard.module.css';

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centis = Math.floor((ms % 1000) / 10);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
}

export default function Leaderboard({ difficulty, dateString, highlightUsername }) {
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard(difficulty, dateString).then((results) => {
      if (!cancelled) setEntries(results);
    });
    return () => {
      cancelled = true;
    };
  }, [difficulty, dateString]);

  if (entries === null) {
    return <p className={styles.message}>Loading leaderboard…</p>;
  }

  const highlightId = highlightUsername ? normalizeUsername(highlightUsername) : null;
  let rank = 0;

  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.heading}>
        {difficulty}-letter leaderboard — {dateString}
      </h2>
      {entries.length === 0 ? (
        <p className={styles.message}>No one has played yet today. Be the first!</p>
      ) : (
        <ol className={styles.list}>
          {entries.map((entry) => {
            if (entry.status === 'won') rank += 1;
            const isHighlighted = highlightId && normalizeUsername(entry.username) === highlightId;
            return (
              <li key={entry.username} className={`${styles.row} ${isHighlighted ? styles.highlight : ''}`}>
                <span className={styles.rank}>{entry.status === 'won' ? rank : '—'}</span>
                <span className={styles.username}>{entry.username}</span>
                <span className={styles.time}>{entry.status === 'won' ? formatTime(entry.timeMs) : 'DNF'}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
