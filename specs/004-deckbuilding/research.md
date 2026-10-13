# Research: Deckbuilding

No `NEEDS CLARIFICATION` items remain; decisions below record technical choices.

## 1. Where decks live

- **Decision**: `project.decks[]`, nested in the project record.
- **Rationale**: Decks mix cards from several card types (clarified), so they cannot nest in a card type. Nesting in the project needs no IndexedDB schema bump, is deleted with the project, and is copied by duplication.
- **Alternatives**: A separate `decks` object store (needs DB upgrade and cascade work) — rejected.

## 2. Deck entries reference cards by id

- **Decision**: Entry = `{ cardId, count }`; one entry per card per deck; `count` is a whole number ≥ 1.
- **Rationale**: Many-decks-per-card with independent counts (clarified) falls out naturally; card edits are reflected automatically since decks hold no copies of card data.
- **Alternatives**: Storing the deck on the card (single deck only; contradicts clarification).

## 3. Keeping decks consistent when cards disappear (FR-010)

- **Decision**: A pure `pruneDecks(project)` removes entries whose card id no longer exists in any card type. Each adapter's `saveCardType` and `deleteCardType` call it after updating the project, before persisting.
- **Rationale**: Cards are deleted from the card table through `saveCardType` and whole types through `deleteCardType`; pruning at the storage layer covers both paths with one rule, regardless of which view caused the deletion. Deck views then never display dangling entries.
- **Alternatives**: Pruning in the card table view (misses card type deletion, couples views); pruning lazily on read (stale data persists).

## 4. Project duplication

- **Decision**: `cloneCardType(cardType, cardIdMap?)` fills an optional `Map` of old→new card ids; `cloneProjectForDuplicate` passes one map shared across all card types, then clones decks with new ids and remapped `cardId`s (entries whose card is not in the map are dropped).
- **Rationale**: Slice 3 already regenerates card ids when cloning; the decks only need the mapping, and the optional out-param keeps existing callers unchanged.

## 5. Storage contract

- **Decision**: Add `saveDeck(projectId, deck)` (create when `deck.id` is absent, else replace; validates name uniqueness) and `deleteDeck(projectId, deckId)`, both implemented in adapters via pure `upsertDeck(project, deck)` / `removeDeck(project, deckId)` from the deck model.
- **Rationale**: Mirrors `saveCardType`/`deleteCardType`; keeps three adapter copies tiny and identical in behavior.

## 6. Deck editing UI

- **Decision**: Deck list screen (create form, rename, delete, open) reached from a **Decks** button on the card type list screen. Deck editor shows entries (card summary, editable count input, remove button), totals (total copies, distinct cards), and a candidate list with a card type `<select>` filter and a text search input; **Add** puts a card in with count 1 or increments an existing entry.
- **Card summary text**: the card's property values joined in property order (blank ones skipped), prefixed by the card type name; falls back to "(empty card)".
- **Rationale**: Minimal screens that satisfy US1–US3 and SC-005 without new concepts.

## 7. Filtering

- **Decision**: `filterCards(cardTypes, { cardTypeId, text })` returns `{ cardType, card }` pairs; text match is case-insensitive substring over any of the card's values.
- **Rationale**: Pure and unit-testable; the view only renders results.

## 8. Count validation

- **Decision**: `setEntryCount` accepts only whole numbers ≥ 0; 0 removes the entry; negative, fractional, blank or non-numeric input throws and the view restores the previous value.

## 9. Backward compatibility

- **Decision**: `project.decks ?? []` via a `getDecks(project)` helper; created lazily on first write.

## 10. Delivery

- **Decision**: Work in small commits that each load correctly; bump `?v=` for every commit that changes served scripts (pure-model-only commits still bump because model files are imported by the app).
