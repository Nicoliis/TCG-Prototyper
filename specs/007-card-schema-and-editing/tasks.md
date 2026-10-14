# Tasks: Card Schema vs. Design, Typed Properties, Card Editor

**Input**: Design documents from `/specs/007-card-schema-and-editing/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md

**Tests**: Unit tests (`node:test`, `node --test tests/unit`) are included for pure model logic, following the project's existing convention. Browser screens are validated via quickstart.md.

**Conventions**: Bump the `?v=` cache-busting suffix (currently `?v=26`) app-wide in any commit that changes served assets. Keep files small and HTML-first (constitution).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: US1 = separate properties/design, US2 = typed properties, US3 = automatic ID, US4 = Edit card

## Phase 1: Setup

- [x] T001 Confirm baseline: run `node --test tests/unit` and note all tests pass before changes

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: Pure model layer every story relies on.

- [x] T002 [P] Create `js/models/property-types.mjs` exporting `PROPERTY_TYPES` (`line`, `text`, `integer`, `decimal`), `DEFAULT_PROPERTY_TYPE`, and `validateValue(type, text)` returning `{ ok, message }` (empty valid; integer `^-?\d+$`; decimal accepts `.` or `,`)
- [x] T003 [P] Create `tests/unit/property-types.test.mjs` covering each type's valid/invalid values and empty values
- [x] T004 Create `js/models/card-numbering.mjs` exporting `ID_PROPERTY` (virtual `{ id: "__id__", name: "ID", type: "integer", builtin: true }`), `getSchema(cardType)` (ID first, then stored properties), `nextNumber(cardType)` (returns and advances `nextCardNumber`), `findCardByNumber(cardType, number)`, and idempotent `normalizeCardType(cardType)` (default missing property types to `line`, number un-numbered cards in array order, set `nextCardNumber = max(stored, highest + 1, 1)`)
- [x] T005 [P] Create `tests/unit/card-numbering.test.mjs` covering numbering from 1, no reuse after deleting the last card, normalization of legacy cards/properties, idempotency, `findCardByNumber`
- [x] T006 Apply `normalizeCardType` to every card type returned by project reads in `js/storage/indexeddb-adapter.mjs` and to imported projects in `js/models/project-export.mjs`; extend `tests/unit/storage-adapter.contract.test.mjs` / `tests/unit/project-export.test.mjs` (and test doubles in `tests/support/`) so legacy data reads back typed and numbered

**Checkpoint**: Model layer ready; user stories can proceed.

---

## Phase 3: User Story 3 - Automatic ID (Priority: P1) 🎯 MVP

**Goal**: Every card has an auto-incrementing, read-only ID that never gets reused.

**Independent Test**: Add 3 cards → IDs 1,2,3; delete 3, add one → 4 (quickstart step 2).

- [x] T007 [US3] Update `js/models/card.mjs`: `createCard`/`addCard` assign `number` via `nextNumber(cardType)`; update `tests/unit/card-model.test.mjs`
- [x] T008 [US3] Reserve the name "ID" (case-insensitive) in `validatePropertyName` in `js/models/card-type.mjs`; add test in `tests/unit/card-type-model.test.mjs`
- [x] T009 [US3] Make `cloneCardType` in `js/models/card-type.mjs` preserve `number`, property `type` and `nextCardNumber`; extend `tests/unit/card-type-model.test.mjs` and `tests/unit/project-export.test.mjs` for duplicate/export/import round trip (FR-014)
- [x] T010 [P] [US3] Update `cardValuesByName` in `js/models/print-selection.mjs` to include `ID` so templates can use it; extend `tests/unit/print-selection.test.mjs` (or `substitute.test.mjs`)
- [x] T011 [US3] Add read-only ID column (first) to `js/views/card-table/card-table.mjs` and `card-table.html` (+ bump `?v=`)
- [x] T012 [US3] Show a locked ID row (cannot delete/rename/retype) at the top of the property list in `js/views/card-type-editor/card-properties-panel.mjs` and `card-type-editor.html`

**Checkpoint**: IDs automatic and visible; deck/print behaviour unchanged.

---

## Phase 4: User Story 2 - Typed properties (Priority: P1)

**Goal**: Properties have a type; every edit input matches it and invalid numbers are rejected.

**Independent Test**: Quickstart steps 1, 3 and 6.

- [x] T013 [US2] Extend `createProperty`/`addProperty` in `js/models/card-type.mjs` with a `type` (default `line`, validated against `PROPERTY_TYPES`) and add `setPropertyType(cardType, propertyId, type)` returning the number of existing values that do not fit (values kept); tests in `tests/unit/card-type-model.test.mjs`
- [x] T014a [US1] Warn before deleting a property whose name appears in any element template of the card type (list the element names; proceeding leaves them rendering blank) in `js/views/card-type-editor/card-properties-panel.mjs`; add a pure helper `elementsUsingProperty(cardType, propertyName)` in `js/models/card-type.mjs` with a test in `tests/unit/card-type-model.test.mjs`
- [x] T014 [US2] Add a type `<select>` (labels "One line", "Textarea", "Integer", "Decimal"; stored keys `line`, `text`, `integer`, `decimal`) to the add-property form and each property row in `js/views/card-type-editor/card-type-editor.html` and wire it in `js/views/card-type-editor/card-properties-panel.mjs`, with a `confirm` warning stating the count of affected cards before a type change that leaves invalid values (FR-007)
- [x] T015 [P] [US2] Create shared typed-input templates in `js/views/card-editor/typed-inputs.html` and `js/views/card-editor/typed-input.mjs` (`createTypedInput(property, value, onValidChange)`: text input, `<textarea>`, numeric text input with `inputmode`; shows message and does not save invalid numeric text; marks pre-existing invalid values `aria-invalid`)
- [x] T016 [US2] Use `createTypedInput` for cells in `js/views/card-table/card-table.mjs` (replace the plain `.card-cell-input`), and add invalid-value styling in `css/` (FR-006, FR-016)

**Checkpoint**: Typed editing works in the table.

---

## Phase 5: User Story 1 - Properties separate from design (Priority: P1)

**Goal**: Property definition and card design are distinct areas of the card type editor.

**Independent Test**: Quickstart step 1; add a property without seeing layout tools, design without property management.

- [x] T017 [US1] Restructure `js/views/card-type-editor/card-type-editor.html` into a top-level **Properties | Design** switch: Properties contains the existing properties panel; Design contains the Size / Add Element / Elements tabs (move the `properties` tab out of the design tab list)
- [x] T018 [US1] Wire the top-level switch in `js/views/card-type-editor/card-type-editor.mjs` using `js/views/card-type-editor/tabs.mjs` (reuse `selectTab`; keep design sub-tabs working and persist nothing new), update styles in `css/`
- [x] T019 [US1] Verify in the browser that a pre-feature project's card types open unchanged and `{{name}}` bindings still render in `js/views/card-type-editor/layout-element.mjs`; if the Design area has a property picker or hint list for templates, make it list `ID` first via `getSchema`
- [x] T019a [US2] Make rendered text preserve line breaks (CSS `white-space: pre-wrap` on text elements, preview and print) in `css/` and confirm `js/views/card-type-editor/text-fit.mjs` still fits multi-line and long text without breaking the layout (spec US2 scenario 4, long-text edge case)

**Checkpoint**: Schema and design are cleanly separated.

---

## Phase 6: User Story 4 - Edit card (Priority: P2)

**Goal**: One rendered card with typed inputs and Prev/Next/go-to-ID navigation.

**Independent Test**: Quickstart steps 3, 4, 5.

- [x] T020 [P] [US4] Create `js/views/card-editor/card-navigation.mjs` (pure: `cardsByNumber`, `adjacentCard(cardType, number, direction)`, `resolveGoTo(cardType, text)` returning card or error message) and `tests/unit/card-navigation.test.mjs`
- [x] T021 [US4] Create `js/views/card-editor/card-editor.html` (header with Back/Prev/ID input/Next/"Card i of n"/Add/Delete, preview pane, field list template, empty state)
- [x] T022 [US4] Create `js/views/card-editor/card-editor.mjs` exporting `mountCardEditor(root, storage, projectId, cardTypeId, startCardNumber, onBack)`: render card 1:1 reusing `renderPreview`/`applyTransform`/`applyElementStyle`/`applyDepth`/`applyTextFit` as in `js/views/print/render-card.mjs`, build inputs per `getSchema` via `createTypedInput`, re-render on every valid input, save via `storage.saveCardType`, handle boundaries, unknown ID message, add card and the empty state, and delete card (afterwards show the next card, or the previous if it was last, or the empty state if none remain)
- [x] T023 [US4] Add the "Edit cards" button route in `js/views/card-type-list/card-type-list.mjs` and `card-type-list.html` (opens first card) and a per-row Edit action in `js/views/card-table/card-table.mjs`/`card-table.html` (opens that card)
- [x] T024 [P] [US4] Add Edit card layout styles in `css/` (preview left, fields right, narrow-width stacking)

**Checkpoint**: Full Edit card flow works.

---

## Phase 7: Polish & Cross-Cutting

- [x] T025 Update `js/csv/import-cards.mjs` so ID is a selectable key matching `card.number`, ID is never written from CSV, unmatched rows get `nextNumber`, and invalid numeric cells are reported in the import report (FR-015); extend `tests/unit/import-cards.test.mjs`
- [x] T026 Update `js/views/csv-import/csv-import.mjs` and `csv-import.html` so the key selector offers ID plus properties and the report lists invalid numeric cells
- [x] T027 Bump `?v=` suffix app-wide to the next version in all served references
- [x] T028 Run `node --test tests/unit` and walk through every step of `quickstart.md`; fix regressions in slices 1–6 (decks, print, export/import)
- [x] T029 Record feature 007 as complete in `FEATURE-SLICES.md` (matching how earlier features such as project export/import were marked)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (blocks all stories) → stories → Phase 7.
- US3 (Phase 3) first: US4 and US2 rely on numbers; US2 (Phase 4) needs T002 and T013; US1 (Phase 5) is mostly independent of US2/US3 and can run in parallel with them after Phase 2 (T012 and T014 touch the same panel, so do US1's T017 first if parallelizing).
- US4 (Phase 6) needs US3 and the typed input from US2 (T015).
- Phase 7 needs US3 (numbers) and US2 (types).

### Parallel opportunities

- T002/T003/T005 (separate files) after reading the design.
- T010 with T011/T012.
- T015 with T013.
- T020 with T021, T024.

## Implementation Strategy

- **MVP**: Phases 1–3 (automatic IDs, migration, visible in table), then Phase 4 for typed inputs.
- Deliver incrementally: each phase ends with a loadable app and green `node --test tests/unit`; commit per phase with the `?v=` bump.
