# Data Model: Deckbuilding

## Deck (new)

Stored in `project.decks`.

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Generated on creation |
| `name` | string | Non-empty after trim; unique within the project (case-insensitive, trimmed) |
| `entries` | `DeckEntry[]` | Default `[]`; order = order added |

## DeckEntry (new)

| Field | Type | Notes |
|---|---|---|
| `cardId` | string | Id of a card in one of the project's card types |
| `count` | integer ≥ 1 | Copies in this deck; setting 0 removes the entry |

**Uniqueness**: at most one entry per `cardId` per deck.

## Project (changed)

Adds `decks: Deck[]` (default `[]`; may be absent on stored projects, read as `decks ?? []`). `createProject` initializes `decks: []`.

## Relationships

Project 1—* Deck 1—* DeckEntry *—1 Card (by id). A card may appear in many decks. Deleting a deck never affects cards; deleting a card (or its card type) removes its entries from all decks.

## Derived values (not stored)

- **Total cards** of a deck = sum of entry counts.
- **Distinct cards** of a deck = number of entries.

## Rules

- `pruneDecks(project)`: drop every entry whose `cardId` matches no card in any card type.
- Duplicating a project copies decks with new deck ids; entry `cardId`s are remapped to the duplicate's new card ids.
- Validation lives in `js/models/deck.mjs` and is applied by storage on every deck save.
