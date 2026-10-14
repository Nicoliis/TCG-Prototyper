# UI & Module Contracts

## Model modules

- `property-types.mjs`: `PROPERTY_TYPES = ["line", "text", "integer", "decimal"]`; `validateValue(type, text) -> { ok, message }`.
- `card-numbering.mjs`: `getSchema(cardType)`, `normalizeCardType(cardType)`, `nextNumber(cardType)`, `findCardByNumber(cardType, number)`.
- `addCard(cardType, values)` assigns `number` and advances `nextCardNumber`.

## Card type editor

- Top switch **Properties | Design**. Properties: locked ID row + typed property rows (name, type select, sample value, delete). Design: Size / Add Element / Elements.
- Changing a type with unfit values: confirm dialog stating the number of affected cards.

## Card table

- First column ID (read-only); inputs per property type; per-row **Edit** action opens Edit card at that card.

## Edit card screen (`card-editor`)

- Header: Back, Prev, ID input (Enter/blur to go), Next, "Card i of n", Add card, Delete card.
- Left: rendered card at 1:1. Right: ID (read-only) + one input per property by type; invalid numeric text shows a message and is not saved.
- Entry: "Edit cards" button on the card type (first card) and the row Edit action (that card).
- Empty state: message + "Add first card".

## CSV import

- Key selector lists **ID** plus properties; ID key matches `card.number`; ID is not a fill column.
