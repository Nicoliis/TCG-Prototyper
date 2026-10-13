# Contract: Project Export File Format & `importProject`

This feature adds exactly one method to the existing storage adapter
contract (see [001's storage-adapter.md](../../001-projects-card-types/contracts/storage-adapter.md)),
plus a file format that is produced/consumed entirely by model-layer
functions, never by the storage adapter itself.

## File format (produced by `buildExportEnvelope`, consumed by `validateExportEnvelope` + `buildProjectFromImport`)

Pretty-printed JSON (`JSON.stringify(envelope, null, 2)`), human-readable
per FR-003a:

```json
{
  "cardgamePrototyperExport": "project",
  "formatVersion": 1,
  "exportedAt": "2026-10-13T12:00:00.000Z",
  "project": {
    "name": "My Deck Game",
    "cardTypes": [ /* unchanged CardType shape */ ],
    "decks": [ /* unchanged Deck shape */ ]
  }
}
```

See [data-model.md](../data-model.md) for field-by-field rules.

## Model functions (`js/models/project-export.mjs`)

| Function | Input | Output | Notes |
|---|---|---|---|
| `buildExportEnvelope(project)` | full `Project` (as returned by `getProject`) | `ExportEnvelope` plain object | Drops `id`/`createdAt`/`updatedAt`; everything else copied as-is (no need to deep-clone — the result is immediately serialized, not retained). |
| `exportFileName(projectName)` | `string` | `string` (e.g. `"my-deck-game.json"`) | Slugifies; falls back to `"project.json"` if the slug is empty. |
| `validateExportEnvelope(parsed)` | `unknown` (result of `JSON.parse`) | `void` | Throws a single clear `Error` if `parsed` isn't a recognizable project export (FR-007): missing/wrong marker field, or `project.name`/`project.cardTypes` missing or wrong type. |
| `buildProjectFromImport(envelope, existingNames)` | validated `ExportEnvelope`, `string[]` of existing project names | a new, storage-ready `Project` object (no `id`; caller/adapter assigns one like any other `createProject`) | Regenerates every card type/property/element/card id via `cloneCardType`, remaps deck entries via `cloneDecksForCards`, drops dangling deck references (FR-009), and resolves the name against `existingNames` the same way `cloneProjectForDuplicate` resolves collisions (FR-006). |

## Storage adapter addition

| Method | Input | Output | Notes |
|---|---|---|---|
| `importProject(exportedData)` | the raw parsed `ExportEnvelope` (not yet guaranteed valid) | `Project` (newly created, persisted, full) | Internally: `validateExportEnvelope(exportedData)` first, then `existing = await this.#getAllProjects()`-equivalent → `buildProjectFromImport` → persist exactly like `createProject` does. Must never touch any existing project (FR-005). |

The view layer also calls `validateExportEnvelope` before ever calling
`importProject`, for a fast, UI-level rejection — but `importProject`
validates again as its own first step. This mirrors `saveCardType`, which
already self-validates (`validateCardTypeName`) rather than trusting its
caller, so the adapter stays the final, authoritative gate on its own
inputs: a direct or malformed call still gets FR-007's clear,
non-technical error message instead of a raw technical one, and never
creates a partial project.

## Contract test additions (`tests/unit/storage-adapter.contract.test.mjs`)

Run against both `InMemoryAdapter` and `ArrayStoreAdapter`, per the
existing pattern:

1. `importProject` on a minimal envelope produces a project that appears
   in `listProjects()`, with a *different* id than anything already
   present.
2. The imported project's `createdAt`/`updatedAt` are fresh (close to
   `Date.now()`), never inherited from anywhere — there is nothing to
   inherit from since the envelope never carries them, but this is
   explicitly asserted so FR-011 has direct coverage rather than being
   true only by construction.
3. Importing an envelope whose `project.name` collides with an existing
   project's name succeeds and yields a non-colliding name (FR-006).
4. Card types/cards/decks in the imported project have ids distinct from
   the ids in the original envelope (proves id regeneration happened, not
   a pass-through).
5. A deck entry in the envelope referencing a card id not present among
   that envelope's cards is dropped from the imported project's deck
   (FR-009), not left dangling or causing a thrown error.
6. Calling `importProject` directly with a malformed envelope (e.g.
   missing the marker field) throws the same clear, non-technical `Error`
   `validateExportEnvelope` would throw, and no project is created —
   proves the adapter's own validation (not just the view layer's) is
   what guarantees FR-007/SC-003, consistent with `saveCardType`'s
   self-validating precedent.

## Non-goals of this contract

- No schema versioning migrations beyond tolerating missing optional
  fields — `formatVersion` exists for future use, nothing branches on it
  yet (YAGNI, per research.md).
- No bulk/multi-project import or export in one action.
- No network transfer of the file — the browser's own download/file-picker
  mechanisms are the only "transport."
