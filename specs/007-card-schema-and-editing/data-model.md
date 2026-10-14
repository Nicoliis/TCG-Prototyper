# Data Model: Card Schema vs. Design, Typed Properties, Card Editor

## Property (stored in `cardType.properties[]`)

| Field | Type | Notes |
|---|---|---|
| id | uuid | unchanged |
| name | string | unique per card type, case-insensitive; `ID` reserved |
| sampleValue | string | unchanged (design previews) |
| type | `"line"`, `"text"`, `"integer"`, `"decimal"` | NEW; `line` when absent |

## ID property (virtual)

`{ id: "__id__", name: "ID", type: "integer", builtin: true }`, always first in
`getSchema(cardType)`. Not stored; cannot be removed, renamed, retyped or edited.

## Card (`cardType.cards[]`)

| Field | Type | Notes |
|---|---|---|
| id | uuid | internal, used by decks; unchanged |
| number | positive int | NEW; the user-facing ID, unique per card type |
| values | `{ [propertyId]: string }` | unchanged; blank values omitted |

## Card type additions

| Field | Type | Notes |
|---|---|---|
| nextCardNumber | positive int | NEW; next number to assign; never decreases |

## Rules

- New card: `number = nextCardNumber++`.
- Normalization (idempotent): default types; assign missing numbers in array order; `nextCardNumber = max(stored, highest + 1, 1)`.
- Clone/duplicate/import: preserve `number`, `type`, `nextCardNumber`; regenerate uuids only.
- Value validity is computed by `validateValue(type, value)`; empty is valid; invalid stored values are flagged in the UI, never auto-removed.
- Removing a property deletes its values (existing behaviour); templates reference by name, so a missing name renders blank as today.
- Navigation order: ascending `number`.
