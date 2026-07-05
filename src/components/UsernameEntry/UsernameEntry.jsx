import { useState } from 'react';
import { claimUsername } from '../../firebase/leaderboard.js';
import { gameStorage } from '../../storage/storage.js';
import styles from './UsernameEntry.module.css';

export default function UsernameEntry({ onClaimed }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('checking');
    const result = await claimUsername(value);
    if (result.ok) {
      await gameStorage.saveUsername(result.username);
      onClaimed(result.username);
    } else {
      setStatus(result.reason);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="username-entry">
        Choose a username for Time Mode
      </label>
      <input
        id="username-entry"
        className={styles.input}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus('idle');
        }}
        placeholder="3-20 letters, numbers, underscores"
        autoComplete="off"
        maxLength={20}
      />
      <button type="submit" className={styles.button} disabled={status === 'checking' || !value}>
        {status === 'checking' ? 'Checking…' : 'Claim username'}
      </button>
      {status === 'taken' && <p className={styles.error}>That username is already taken. Try another.</p>}
      {status === 'invalid' && (
        <p className={styles.error}>Usernames must be 3-20 characters: letters, numbers, underscores only.</p>
      )}
      {status === 'error' && <p className={styles.error}>Something went wrong. Please try again.</p>}
    </form>
  );
}
