import { useEffect, useState } from 'react';
import { getSingaporeDateString } from '../../game/singaporeDate.js';
import { normalizeUsername } from '../../game/username.js';
import { hasPlayedToday } from '../../firebase/leaderboard.js';
import { gameStorage } from '../../storage/storage.js';
import UsernameEntry from '../UsernameEntry/UsernameEntry.jsx';
import TimeModeGame from '../TimeModeGame/TimeModeGame.jsx';
import Leaderboard from '../Leaderboard/Leaderboard.jsx';
import styles from './TimeMode.module.css';

export default function TimeMode({ difficulty }) {
  const [username, setUsername] = useState(undefined);
  const [roundStatus, setRoundStatus] = useState('checking');
  const dateString = getSingaporeDateString();

  useEffect(() => {
    gameStorage.loadUsername().then((saved) => setUsername(saved));
  }, []);

  useEffect(() => {
    if (!username) return;
    setRoundStatus('checking');
    let cancelled = false;
    hasPlayedToday(difficulty, dateString, normalizeUsername(username)).then((played) => {
      if (!cancelled) setRoundStatus(played ? 'blocked' : 'available');
    });
    return () => {
      cancelled = true;
    };
  }, [username, difficulty, dateString]);

  if (username === undefined) {
    return <p className={styles.message}>Loading…</p>;
  }

  if (username === null) {
    return <UsernameEntry onClaimed={setUsername} />;
  }

  if (roundStatus === 'checking') {
    return <p className={styles.message}>Checking today's status…</p>;
  }

  if (roundStatus === 'blocked') {
    return <Leaderboard difficulty={difficulty} dateString={dateString} highlightUsername={username} />;
  }

  return (
    <TimeModeGame
      difficulty={difficulty}
      username={username}
      dateString={dateString}
      onFinished={() => setRoundStatus('blocked')}
    />
  );
}
