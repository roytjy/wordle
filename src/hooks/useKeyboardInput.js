import { useEffect } from 'react';

export function useKeyboardInput({ enabled, onLetter, onEnter, onBackspace }) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (event.key === 'Enter') {
        onEnter();
      } else if (event.key === 'Backspace') {
        onBackspace();
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        onLetter(event.key.toUpperCase());
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onLetter, onEnter, onBackspace]);
}
