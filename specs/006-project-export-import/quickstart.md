# Quickstart: Project Export & Import — Validation Guide

## Prerequisites

- Node 20+ for unit tests, and any static HTTP server from the repo root
  (e.g. `python3 -m http.server 8080`), then open `http://localhost:8080`.
- A project ("Source") with at least two card types (one with several
  properties/elements, including styled text and an image), several filled
  cards on each, and a deck containing some of those cards with varied
  counts.
- A second, differently-named existing project ("Target") to test name
  collisions against.

## 1. Automated checks

```text
node --test tests/unit
```

Expected: all pass, including `project-export` and the extended
`storage-adapter.contract` cases. See
[contracts/project-export-format.md](./contracts/project-export-format.md)
and [data-model.md](./data-model.md).

## 2. Manual: export (User Story 1)

1. From the project list, export "Source". Expect a single file download
   named after the project (e.g. `source.json`).
2. Open the downloaded file in a text editor. Expect plain, indented JSON
   you can read — a `cardgamePrototyperExport` marker, the project's name,
   and its card types/decks (FR-003a).
3. Export an otherwise-empty project. Expect a valid file with empty
   `cardTypes`/`decks` arrays, no error.
4. Edit "Source" (e.g. add a card), export again. Expect the new file to
   reflect the edit, not the first export.

## 3. Manual: import (User Story 2)

1. Import the file from step 2.1. Expect a new project to appear in the
   list — not a change to "Source" — with the same card types, cards, and
   deck contents.
2. Open the imported project's card types in the editor. Expect every
   element's position, size, rotation, layer order, and style to match
   "Source" exactly.
3. Rename "Source" to exactly match the name inside the imported file (or
   re-export so the names collide), then import again. Expect the import
   to still succeed and the new project to get an adjusted, non-colliding
   name — and expect "Source" to be completely unaffected.
4. Try importing an unrelated `.json` file (or a `.txt` file renamed to
   `.json`). Expect a clear rejection message and no new project created.
5. Hand-edit an exported file to remove one card but leave a deck entry
   pointing at that card's old id, then import it. Expect the import to
   still succeed, with that dangling deck entry simply absent from the
   imported deck.

## 4. Manual: import feedback (User Story 3)

1. Import any valid file. Expect to see the new project's name surfaced to
   you (e.g. a confirmation message) before/as it lands in the list.

## 5. Round-trip check (SC-001, SC-004)

1. Export "Source", import it back, and compare the import against
   "Source" card-by-card and deck-by-deck in the UI. Expect no visible
   difference in content (created/updated timestamps are expected to
   differ — that's by design, FR-011).

## 6. Edge cases

- Export/import a project with ~30 card types and ~300 cards total; expect
  both to complete in a few seconds with no visible freeze (SC-002).
- Cancel the file picker during import; expect no error and no partial
  project created.
- Import the same valid file twice in a row; expect two separate new
  projects, each independently editable without affecting the other.
