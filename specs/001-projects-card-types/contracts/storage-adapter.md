# Contract: Storage Adapter

This is the one seam (FR-017) the rest of the app depends on. Every method
operates on the plain-object shapes from [data-model.md](../data-model.md).
Replacing persistence means writing a new file that satisfies this same
contract and pointing `app.mjs`'s single wiring line at it — nothing in
`models/` or `views/` may import a storage backend directly.

## Methods

| Method | Input | Output | Notes |
|---|---|---|---|
| `listProjects()` | — | `Project[]` (summaries: `id`, `name` only) | For the project list view; must not require loading full card type data. |
| `getProject(id)` | `id: string` | `Project` (full, with `cardTypes`) \| `null` | `null` if not found. |
| `createProject(name)` | `name: string` | `Project` (new, empty `cardTypes`) | Rejects (throws) on empty/duplicate name (FR-018). |
| `renameProject(id, name)` | `id, name: string` | `Project` (updated) | Same validation as create. |
| `duplicateProject(id)` | `id: string` | `Project` (new id, deep-copied `cardTypes` with new ids) | Original is untouched (FR-003). |
| `deleteProject(id)` | `id: string` | `void` | Removes the project and all its card types. |
| `saveCardType(projectId, cardType)` | `projectId: string`, `cardType: CardType` | `CardType` (persisted) | Create (no `id`) or update (existing `id`); validates name uniqueness within the project (FR-008, FR-018). |
| `deleteCardType(projectId, cardTypeId)` | both `string` | `void` | |

## Contract test (run against every adapter)

A single test suite (`tests/unit/storage-adapter.contract.test.mjs`) is
parameterized over adapter implementations and, for each one, asserts:

1. A created project appears in `listProjects()`.
2. `duplicateProject` produces a project whose card type edits do not
   affect the source project's card types, and vice versa (SC-002).
3. `deleteProject` removes the project from `listProjects()` and
   `getProject` returns `null` for it afterwards.
4. `saveCardType` enforces unique, non-empty names within one project but
   allows the same name reused in a different project.
5. Data written by one adapter instance is visible to a second instance
   constructed against the same underlying store (persistence, FR-016).

Running this exact suite against both the default IndexedDB adapter and a
throwaway in-memory adapter is how SC-004 (swappable storage) is verified
without manually re-testing the whole UI for every backend.

## Non-goals of this contract

- No network calls, no authentication — single local user only
  (Assumptions).
- No card *instance* data (filled-in cards) — only `Project` and
  `CardType` definitions exist in this slice.
