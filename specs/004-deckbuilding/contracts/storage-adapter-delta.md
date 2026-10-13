# Contract Delta: Storage Adapter (Slice 4)

## New methods

```text
saveDeck(projectId, deck)      -> saved deck   // no id: create; with id: replace
deleteDeck(projectId, deckId)  -> void
```

- `saveDeck` MUST reject an empty name, or a name already used by another deck in the same project (case-insensitive, trimmed), with an `Error`. It MUST reject entries with a non-integer or < 1 count.
- `deleteDeck` MUST remove only the deck; cards are untouched.
- Decks persist as `project.decks`, returned by `getProject`.

## Changed behavior

1. `saveCardType` and `deleteCardType` MUST prune deck entries whose card no longer exists in any of the project's card types, before persisting.
2. `duplicateProject` MUST copy decks to the duplicate with fresh deck ids and entries remapped to the duplicate's card ids.
3. `getProject` MUST return projects stored without `decks` exactly as stored; callers read `decks ?? []`.
4. `deleteProject` removes the project's decks with it.

## Test impact

`tests/unit/storage-adapter.contract.test.mjs` gains cases for each rule above; `InMemoryAdapter` and `ArrayStoreAdapter` implement the new methods (via `js/models/deck.mjs`) and run the same suite. `IndexedDbAdapter` is verified via the quickstart.

## Model contract (`js/models/deck.mjs`)

| Function | Behavior |
|---|---|
| `getDecks(project)` | `project.decks ?? []` |
| `validateDeckName(name, existingNames)` | Trimmed, non-empty, unique; returns trimmed |
| `createDeck(name, existingNames)` | `{ id, name, entries: [] }` |
| `upsertDeck(project, deck)` | Validates name and entries, inserts or replaces, returns saved deck |
| `removeDeck(project, deckId)` | Removes the deck |
| `addCardToDeck(deck, cardId)` | New entry with count 1, or increments existing |
| `setEntryCount(deck, cardId, value)` | Whole number ≥ 0 required; 0 removes; otherwise throws |
| `deckTotals(deck)` | `{ totalCards, distinctCards }` |
| `pruneDecks(project)` | Drops entries for missing cards |
| `cloneDecksForCards(decks, cardIdMap)` | New ids, remapped entries, drops unmapped |
| `filterCards(cardTypes, { cardTypeId, text })` | `{ cardType, card }[]` matching the type and case-insensitive text |
