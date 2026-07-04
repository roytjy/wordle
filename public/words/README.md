# Word lists

`words-5.json`, `words-6.json`, and `words-7.json` are the real word datasets (3,000 entries each), replacing the original development placeholders.

Schema:
```json
[{ "word": "APPLE", "definition": "A round fruit with red, green, or yellow skin." }]
```

The loader (`src/game/wordlist.js`) makes no assumptions about list size - only that every entry's `word` matches the file's expected length and has a non-empty `definition`. So these files can be swapped again later (e.g. a bigger or curated list) with no code changes, as long as the filename and schema stay the same.
