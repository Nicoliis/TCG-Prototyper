# Data Model: Project Export & Import

No change to the shape of the stored `Project`, `CardType`, `Card`, or
`Deck` entities. This feature adds one new transient (never-persisted)
shape, the **export envelope**, plus the id-remapping relationship import
relies on.

## ExportEnvelope (new, file-only, never stored)

```text
{
  cardgamePrototyperExport: "project",   // fixed marker; presence is the FR-007 recognizability check
  formatVersion: 1,                      // integer; reserved for future format changes
  exportedAt: string (ISO 8601),         // informational only, not re-used on import
  project: {
    name: string,
    cardTypes: CardType[],               // unchanged shape (see card-type.mjs)
    decks: Deck[]                        // unchanged shape (see deck.mjs)
  }
}
```

| Field | Type | Rules |
|---|---|---|
| `cardgamePrototyperExport` | string | Must equal `"project"`; anything else (or missing) fails FR-007 validation |
| `formatVersion` | integer | Must be a positive integer; only `1` is currently handled — an unrecognized future value still attempts a best-effort import rather than failing outright, since the spec's edge cases call for tolerating a mismatched version |
| `exportedAt` | string | Not validated; display-only if ever surfaced, not required for import to succeed |
| `project.name` | string | Must be a non-empty string after trimming, else validation fails |
| `project.cardTypes` | array | Must be an array (may be empty); each entry passed through the same defaulting the app already applies when loading a card type, so missing optional fields (e.g. a property's `sampleValue`, an element's `rotation`) fall back to their existing defaults rather than erroring |
| `project.decks` | array | Must be an array if present; absent treated as `[]` |

`project` deliberately excludes `id`, `createdAt`, and `updatedAt` — those
belong to a *stored* `Project`, never to the portable file (see
research.md "Export envelope shape").

## Id Remapping (import-time relationship, not a stored field)

On import, `buildProjectFromImport` walks `project.cardTypes` and
`project.decks` using the same `cardIdMap` threading as
`cloneProjectForDuplicate`:

```text
for each cardType in envelope.project.cardTypes:
    new cardType.id, new property ids, new element ids   (cloneCardType)
    for each card in cardType.cards:
        new card.id                                        (cloneCardType)
        cardIdMap[old card.id] = new card.id

for each deck in envelope.project.decks:
    new deck.id
    deck.entries = [ { cardId: cardIdMap[old cardId], count }
                      for each old entry whose cardId is in cardIdMap ]
                   // entries whose cardId has no mapping (dangling, FR-009) are dropped
```

The resulting in-memory `Project` record is then created through the
storage adapter exactly like any other new project: fresh `id`,
`createdAt`/`updatedAt` set to "now" (FR-011), and `name` resolved against
existing project names the same way `cloneProjectForDuplicate` resolves a
duplicate's name (append `copy`, `copy 2`, ... per FR-006 — except seeded
from the imported name itself, not `"<name> copy"`, since this is a fresh
import rather than an explicit duplicate).

## Relationships

```text
ExportEnvelope --(export)--> read from an existing stored Project (unchanged)
ExportEnvelope --(import)--> new stored Project (new ids throughout, via cloneCardType/cloneDecksForCards)
```

Nothing else in the data model changes; `StorageAdapter` gains one new
method (`importProject`) documented in
`contracts/project-export-format.md`, not a new entity.
