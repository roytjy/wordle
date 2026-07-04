# Word lists

There are two kinds of files per difficulty:

## `words-{5,6,7}.json` — answers + definitions

The real word datasets (3,000 entries each). Used to pick the day's answer and to show its definition for the word-meaning hint. Schema:
```json
[{ "word": "APPLE", "definition": "A round fruit with red, green, or yellow skin." }]
```

## `words-{5,6,7}-dictionary.json` — accepted guesses

A much larger, definition-free list of words that are accepted as valid *guesses*, even if they're not one of the possible answers above (this is how real Wordle avoids rejecting ordinary words). Schema is a flat array of words:
```json
["APPLE", "BRAVE", "GRAPE"]
```

A guess is accepted if it appears in *either* file — so this list only ever expands what's accepted, never removes anything already valid.

All three (`words-5-dictionary.json`, `words-6-dictionary.json`, `words-7-dictionary.json`) are real comprehensive dictionaries now (4,667 / 20,089 / 30,074 words respectively) - no more placeholders.
