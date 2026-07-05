import { useEffect, useRef, useState } from 'react';
import { DEFAULT_DIFFICULTY } from './game/constants.js';
import { gameStorage } from './storage/storage.js';
import DifficultySelector from './components/DifficultySelector/DifficultySelector.jsx';
import ModeToggle from './components/ModeToggle/ModeToggle.jsx';
import Game from './components/Game/Game.jsx';
import TimeMode from './components/TimeMode/TimeMode.jsx';
import styles from './App.module.css';

export default function App() {
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [mode, setMode] = useState('normal');
  // Guards against persisting the default difficulty/mode before the restore
  // below has had a chance to apply - otherwise, under StrictMode's
  // double-invoked effects, the restored values can lose a race against the
  // effect below writing the (stale) defaults back over them.
  const restoredRef = useRef(false);

  useEffect(() => {
    Promise.all([gameStorage.loadLastDifficulty(), gameStorage.loadLastMode()]).then(
      ([lastDifficulty, lastMode]) => {
        if (lastDifficulty) setDifficulty(lastDifficulty);
        if (lastMode) setMode(lastMode);
        restoredRef.current = true;
      }
    );
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    gameStorage.saveLastDifficulty(difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (!restoredRef.current) return;
    gameStorage.saveLastMode(mode);
  }, [mode]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Wordle</h1>
        <ModeToggle value={mode} onChange={setMode} />
        <DifficultySelector value={difficulty} onChange={setDifficulty} />
      </header>
      {mode === 'normal' ? (
        <Game key={difficulty} difficulty={difficulty} onSwitchDifficulty={setDifficulty} />
      ) : (
        <TimeMode key={difficulty} difficulty={difficulty} />
      )}
    </div>
  );
}
