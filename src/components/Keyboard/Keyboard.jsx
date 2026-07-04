import { useEffect, useRef } from 'react';
import Key from './Key.jsx';
import styles from './Keyboard.module.css';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export default function Keyboard({ shakeKey, keyboardStatuses, disabled, onLetter, onEnter, onBackspace }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (shakeKey === 0) return;
    const node = containerRef.current;
    if (!node) return;
    node.classList.remove(styles.shake);
    void node.offsetWidth; // force reflow so the animation can retrigger
    node.classList.add(styles.shake);
  }, [shakeKey]);

  function handleClick(key) {
    if (disabled) return;
    if (key === 'ENTER') onEnter();
    else if (key === 'BACKSPACE') onBackspace();
    else onLetter(key);
  }

  return (
    <div className={styles.keyboard} ref={containerRef}>
      {ROWS.map((row, i) => (
        <div className={styles.row} key={i}>
          {row.map((key) => (
            <Key
              key={key}
              label={key === 'BACKSPACE' ? '⌫' : key === 'ENTER' ? 'Enter' : key}
              wide={key === 'ENTER' || key === 'BACKSPACE'}
              status={keyboardStatuses[key]}
              disabled={disabled}
              onClick={() => handleClick(key)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
