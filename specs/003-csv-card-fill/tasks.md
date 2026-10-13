---

description: "Task list for CSV Card Fill"
---

# Tasks: CSV Card Fill

**Input**: Design documents from `/specs/003-csv-card-fill/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/csv-import.md, contracts/storage-adapter-delta.md, quickstart.md

**Tests**: Included for the pure modules (CSV parser, card model, import/upsert logic) and the storage contract's cards round-trip, per plan.md. UI behavior (table, import screen, report display) is verified manually via quickstart.md.

**Organization**: Tasks are grouped by user story (spec.md) so each can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3
- Paths are relative to the repository root. Run unit tests with `node --test tests/unit`.
- Convention: browser-loaded imports carry a `?v=6` cache-busting suffix (see `js/app.mjs`); match the current value used in neighboring files. Node tests import without it.

---

## Phase 1: Setup

**Purpose**: Directories for new modules

- [X] T001 Create empty folders `js/csv/`, `js/views/card-table/`, `js/views/csv-import/` (add files in later tasks; nothing to commit until then)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The Card data shape every story depends on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Create `js/models/card.mjs` exporting `getCards(cardType)` (returns `cardType.cards ?? []`), `createCard(values = {})` (returns `{ id: crypto.randomUUID(), values }`), `getCardValue(card, propertyId)` (returns `card.values[propertyId] ?? ""`), `setCardValue(card, propertyId, value)` (deletes the key when value is `""`, else stores the string), `addCard(cardType, values = {})` (initializes `cardType.cards ??= []`, pushes, returns the card), `removeCard(cardType, cardId)`
- [X] T003 Update `js/models/card-type.mjs`: `createCardType` returns `cards: []`; `removeProperty` also deletes the property id from every card's `values`; `cloneCardType` clones cards with new ids and remaps `values` keys from old property ids to the cloned properties' new ids (build the old→new id map while cloning `properties`)
- [X] T004 [P] Write `tests/unit/card-model.test.mjs` (node:test) covering: `getCards` on a card type without `cards`; `addCard`/`removeCard`; `setCardValue` blank-deletes key; `removeProperty` strips values from cards; `cloneCardType` yields cards whose `values` use the new property ids and new card ids
- [X] T005 Extend `tests/unit/storage-adapter.contract.test.mjs` with cases per `contracts/storage-adapter-delta.md`: `saveCardType` round-trips `cards`; a card type saved without `cards` reads back as stored; `duplicateProject` yields cards referencing the duplicate's new property ids

**Checkpoint**: `node --test tests/unit` passes; Card model ready.

---

## Phase 3: User Story 1 - Fill cards directly in an in-app table (Priority: P1) MVP

**Goal**: Per-card-type table to add, edit and delete cards, persisted across reloads.

**Independent Test**: quickstart.md section 2 — add two rows by typing values, delete one, reload and confirm persistence.

### Implementation for User Story 1

- [X] T006 [P] [US1] Create `js/views/card-table/card-table.html`: a `<template id="card-table-view">` with `<section class="view card-table-view">` containing a back button, `<h2 class="card-type-name-heading">`, an "Add card" button, a `<table class="card-table">` with empty `<thead><tr class="card-table-header-row"></tr></thead>` and `<tbody>`, plus nested templates `.card-table-header-template` (a `<th>`), `.card-table-row-template` (a `<tr>` holding `.card-table-cells` placeholder and a trailing `<td>` with a `.delete-card-button`), and `.card-table-cell-template` (a `<td>` with a text `<input>`)
- [X] T007 [US1] Create `js/views/card-table/card-table.mjs` exporting `mountCardTable(root, storage, projectId, cardTypeId, onBack)` using `loadFragment`/`cloneTemplate` like `js/views/card-type-list/card-type-list.mjs`: load the project, render one `<th>` per property and one row per card via the templates (input values from `getCardValue`); "Add card" calls `addCard` then saves and re-renders; cell `change` calls `setCardValue` then `storage.saveCardType(projectId, cardType)`; delete button calls `removeCard`, saves, re-renders; show an empty-state message when there are no properties or no cards
- [X] T008 [P] [US1] Add table styling (`.card-table`, header/cell spacing, cell inputs filling the cell, delete button) to `css/styles.css` using the existing spacing/color custom properties
- [X] T009 [US1] Update `js/views/card-type-list/card-type-list.html` and `.mjs`: add a `.card-type-cards-button` ("Cards") to `.card-type-list-item-template`, wire it in `refresh()` to call `mountCardTable(root, storage, projectId, cardType.id, () => mountCardTypeList(root, storage, projectId, onBack))`
- [ ] T010 [US1] Manual validation: run quickstart.md section 2 and fix any issues

**Checkpoint**: User Story 1 fully functional — the app can hold real card data.

---

## Phase 4: User Story 2 - Bulk-create or update cards via CSV import (Priority: P2)

**Goal**: Dedicated import screen that upserts cards by a chosen key property.

**Independent Test**: quickstart.md section 3 — import, then re-import a corrected CSV and confirm updates rather than duplicates.

### Tests for User Story 2

- [X] T011 [P] [US2] Write `tests/unit/parse-csv.test.mjs` covering: simple rows; quoted fields with commas; `""` escaped quotes; newlines inside quotes; CRLF and LF; leading BOM; trailing empty line ignored; empty input returns `[]`; ragged rows
- [X] T012 [P] [US2] Write `tests/unit/import-cards.test.mjs` covering every scenario in spec User Story 2 and the edge cases: new cards created; key-match update; unmatched column ignored; missing column leaves new card blank; update leaves un-mapped properties untouched; blank key always creates; absent key column creates for every row; duplicate header uses first column; case/whitespace-insensitive matching; duplicate key among existing cards updates the first; repeated key within one CSV creates multiple cards; header-only CSV returns zeros

### Implementation for User Story 2

- [X] T013 [P] [US2] Create `js/csv/parse-csv.mjs` exporting `parseCsv(text)` per `contracts/csv-import.md` (state-machine parser; makes T011 pass)
- [X] T014 [US2] Create `js/csv/import-cards.mjs` exporting `importCards(cardType, csvRows, keyPropertyId)` returning `{ cards, report }` per `contracts/csv-import.md`: normalize with `trim().toLowerCase()`, map first matching column per property, prebuild a normalized-key → first-existing-card map before processing rows, update only mapped properties on a match, otherwise create a card, do not add newly created cards to the map; report is `{ created, updated, ignoredColumns, unfilledProperties }` (makes T012 pass; depends on T002, T013)
- [X] T015 [P] [US2] Create `js/views/csv-import/csv-import.html`: `<template id="csv-import-view">` with back button, heading, `<input type="file" accept=".csv,text/csv" class="csv-file-input">`, `<textarea class="csv-paste-input">`, `<select class="key-property-select">`, an "Import" button, a `.field-error` paragraph, and a hidden `.import-report` panel (report fields filled in US3)
- [X] T016 [US2] Create `js/views/csv-import/csv-import.mjs` exporting `mountCsvImport(root, storage, projectId, cardTypeId, onBack, onOpenTable)`: fill the key select from the card type's properties (default first); on Import read pasted text if non-empty, else `await file.text()`, show an error if neither is provided; run `parseCsv` then `importCards`, assign `cardType.cards = result.cards`, save via `storage.saveCardType`, then reveal a link/button calling `onOpenTable` (depends on T014, T015)
- [X] T017 [P] [US2] Add import-screen styling (textarea size, form spacing, report panel) to `css/styles.css`
- [X] T018 [US2] Update `js/views/card-type-list/card-type-list.html` and `.mjs`: add a `.card-type-import-button` ("Import CSV") and wire it to `mountCsvImport(..., onBack = back to this card type list, onOpenTable = mountCardTable)` (depends on T009, T016)
- [ ] T019 [US2] Manual validation: run quickstart.md section 3 (and the file-upload path) and fix any issues

**Checkpoint**: User Stories 1 and 2 both work; imported cards appear in the table.

---

## Phase 5: User Story 3 - See what an import did and didn't fill in (Priority: P3)

**Goal**: Plain-language import report in the UI.

**Independent Test**: quickstart.md section 4 — import a CSV with an unmatched column and an unfilled property; the report names both and shows created/updated counts.

### Implementation for User Story 3

- [X] T020 [US3] Extend `js/views/csv-import/csv-import.html` `.import-report` with fields for created count, updated count, an ignored-columns list and an unfilled-properties list (each list with a "None" fallback element and a `<template>` list item), plus a distinct message element for "0 cards imported"
- [X] T021 [US3] Update `js/views/csv-import/csv-import.mjs` to populate the report from `result.report` after import: counts, ignored columns, unfilled properties, and the empty/header-only message when `created + updated === 0`; clear the report when starting a new import
- [ ] T022 [US3] Manual validation: run quickstart.md sections 4 and 5 and fix any issues

**Checkpoint**: All three stories work independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T023 [P] Bump the `?v=` cache-busting suffix consistently across `index.html`, `js/app.mjs` and all module imports, including new files, if the project's practice requires it after module changes
- [ ] T024 Run the full `node --test tests/unit` suite and quickstart.md end to end (including duplicate-project-with-cards and reload persistence); confirm Slice 1–2 behavior has not regressed

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) → Foundational (Phase 2, blocks all stories) → US1 → US2 → US3 → Polish
- US2 needs US1's card table as the destination of `onOpenTable` and shares `card-type-list` edits (T018 after T009).
- US3 extends the import view built in US2 (T020/T021 after T015/T016).

### Within Each Story

- Tests before implementation (T011, T012 before T013, T014)
- Pure modules before views; views before the card-type-list wiring

### Parallel Opportunities

- Phase 2: T002 ∥ T004 (T004 needs T003 to pass but can be drafted alongside); T005 after T003
- US1: T006 ∥ T008; T007 after T006
- US2: T011 ∥ T012 ∥ T013 ∥ T015 ∥ T017; T014 after T013

---

## Parallel Example: User Story 2

```text
Task: "Write tests/unit/parse-csv.test.mjs"          (T011)
Task: "Write tests/unit/import-cards.test.mjs"       (T012)
Task: "Create js/csv/parse-csv.mjs"                  (T013)
Task: "Create js/views/csv-import/csv-import.html"   (T015)
Task: "Add import-screen styling to css/styles.css" (T017)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phases 1–2 (Card model + tests)
2. Phase 3 (card table)
3. STOP and VALIDATE via quickstart.md section 2

### Incremental Delivery

1. Foundation → US1 (usable card data entry)
2. + US2 (bulk import with upsert)
3. + US3 (import feedback)

---

## Notes

- Constitution: structure lives in `.html` templates; JS only clones templates and sets values. No `createElement` structure-building, no dependencies, minimal comments.
- Keep files small; `import-cards.mjs` and the views stay separate.
- Commit after each task or logical group.
