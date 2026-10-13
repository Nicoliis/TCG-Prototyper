# Data Model: CSV Card Fill

## Card (new)

One filled-in instance of a Card Type. Stored inside its card type.

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | Generated on creation; stable row identity for the table |
| `values` | object `{ [propertyId]: string }` | Absent key = blank. Values are always strings |

**Validation**: None — every value, including all-blank, is valid (FR-013). Values are stored as given (not trimmed); normalization applies only to matching.

## CardType (changed)

Adds one field to the Slice 1/2 shape:

| Field | Type | Notes |
|---|---|---|
| `cards` | `Card[]` | Default `[]`. May be absent on previously stored card types; always read as `cards ?? []` |

**Relationships**: Project 1—* CardType 1—* Card. Card values reference the card type's `properties[].id`.

**Behavior changes**:
- `createCardType` initializes `cards: []`.
- `removeProperty(cardType, propertyId)` also deletes `propertyId` from every card's `values`.
- `cloneCardType` clones cards with new ids and remaps `values` keys from old property ids to the cloned properties' new ids (needed because project duplication regenerates property ids).
- Renaming a property needs no card change (values keyed by id).

## ImportReport (transient, not stored)

| Field | Type | Meaning |
|---|---|---|
| `created` | number | Cards newly created |
| `updated` | number | Existing cards updated |
| `ignoredColumns` | string[] | CSV headers (as written) matching no property, including later duplicates |
| `unfilledProperties` | string[] | Property names no CSV column matched (left blank on new cards) |

## Import state transitions (per data row)

```text
key column present AND key value non-blank
  AND an existing card's key-property value equals it (normalized)
    -> update that existing card (first match): overwrite only mapped properties
otherwise
    -> create new card with mapped properties; others blank
```

A CSV with no data rows creates/updates nothing and returns zeros.
