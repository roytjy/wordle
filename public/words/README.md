# Word lists — placeholder data

`words-5.json`, `words-6.json`, and `words-7.json` in this directory are **development placeholders** (~30-35 words each), not the real dataset.

Roy will supply the real ~2000-most-common-words-per-length files later. To swap them in:

1. Replace each file, keeping the exact same filename (`words-5.json`, `words-6.json`, `words-7.json`) and schema:
   ```json
   [{ "word": "APPLE", "definition": "A round fruit with red, green, or yellow skin." }]
   ```
2. No code changes are needed — the loader (`src/game/wordlist.js`) makes no assumptions about list size or specific words, only that every entry's `word` matches the file's expected length and has a non-empty `definition`.
