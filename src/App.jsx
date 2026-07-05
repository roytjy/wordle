import { useEffect, useState } from 'react';
import { DEFAULT_DIFFICULTY } from './game/constants.js';
import { gameStorage } from './storage/storage.js';
import DifficultySelector from './components/DifficultySelector/DifficultySelector.jsx';
import Game from './components/Game/Game.jsx';
import styles from './App.module.css';

export default function App() {
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);

  useEffect(() => {
    gameStorage.loadLastDifficulty().then((last) => {
      if (last) setDifficulty(last);
    });
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Wordle</h1>
        <DifficultySelector value={difficulty} onChange={setDifficulty} />
      </header>
      <Game key={difficulty} difficulty={difficulty} onSwitchDifficulty={setDifficulty} />
    </div>
  );
}
