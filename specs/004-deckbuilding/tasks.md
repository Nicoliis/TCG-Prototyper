---

description: "Task list for Deckbuilding"
---

# Tasks: Deckbuilding

**Input**: Design documents from `/specs/004-deckbuilding/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/storage-adapter-delta.md, quickstart.md

**Tests**: Included for the pure deck model and the storage contract (per plan.md). Screens are verified manually via quickstart.md. Node is not installed on the dev machine; install it to run `node --test tests/unit`.

**Organization**: Tasks are grouped by user story (spec.md) so each can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3
- Paths are relative to the repository root.

## Delivery Rules (apply to every task)

- **Small commits**: commit after each task or tightly related pair of tasks; every commit must leave the app loadable (git auto-deploy).
- **Version bump**: whenever a commit changes a served script (anything under `js/`, plus `index.html`/CSS links), bump the `?v=` suffix (currently `?v=9`) consistently across `index.html` and every `js/` import, in that same commit. New files nothing imports yet need no bump; match the current version in their own imports.
- Constitution: structure in `.html` templates, JS only clones and fills; no dependencies; minimal comments; keep files small.

---

## Phase 1: Setup

- [X] T001 Install Node 20+ if missing (needed for `node --test tests/unit`), and create empty folders `js/views/deck-list/` and `js/views/deck-editor/` (populated by later tasks; nothing to commit yet)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Deck data model and storage plumbing every story depends on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Create `js/models/deck.mjs` exporting `getDecks(project)`, `validateDeckName(name, existingNames)`, `createDeck(name, existingNames)`, `upsertDeck(project, deck)` (initializes `project.decks ??= []`, validates name uniqueness against other decks and that every entry has an integer `count` ≥ 1, assigns an id when missing, inserts or replaces, returns the saved deck), `removeDeck(project, deckId)`, `addCardToDeck(deck, cardId)` (new entry count 1 or increment), `setEntryCount(deck, cardId, value)` (whole number ≥ 0; 0 removes the entry; negative, fractional, blank or non-numeric throws), `deckTotals(deck)` returning `{ totalCards, distinctCards }`; name comparison is trimmed and case-insensitive like `js/models/card-type.mjs` **New file only: no `?v=` bump.**
- [X] T003 [P] Write `tests/unit/deck-model.test.mjs` (node:test) covering: name validation (empty, duplicate ignoring case/whitespace, trimmed result); `createDeck`; `upsertDeck` create/replace/rename-to-duplicate rejected/invalid entry count rejected; `removeDeck`; `addCardToDeck` new and increment; `setEntryCount` valid, 0 removes, and `-1`, `1.5`, `""`, `"abc"` throw leaving the deck unchanged; `deckTotals` (depends on T002)
- [X] T004 Update `js/models/project.mjs`: `createProject` returns `decks: []`; `js/models/card-type.mjs`: `cloneCardType(cardType, cardIdMap)` accepts an optional `Map` and records old→new card id for each cloned card; `js/models/deck.mjs`: add `cloneDecksForCards(decks, cardIdMap)` (new deck ids, entries remapped via the map, unmapped entries dropped); `cloneProjectForDuplicate` passes one shared map to every `cloneCardType` call and sets `decks: cloneDecksForCards(project.decks ?? [], map)` (depends on T002). **Commit with a `?v=` bump.**
- [X] T005 Add to `tests/unit/deck-model.test.mjs` cases for `cloneDecksForCards` and for `cloneProjectForDuplicate` remapping deck entries to the duplicate's card ids and leaving the original untouched (depends on T003, T004)
- [X] T006 Add `saveDeck(projectId, deck)` and `deleteDeck(projectId, deckId)` to `js/storage/storage-adapter.mjs` (throwing "not implemented", like the other methods) and implement them in `js/storage/indexeddb-adapter.mjs`, `tests/support/in-memory-adapter.mjs` and `tests/support/array-store-adapter.mjs` using `upsertDeck`/`removeDeck`; each loads the project (error when missing), applies the function, bumps `updatedAt`, persists, and returns the saved deck (depends on T002). **Commit with a `?v=` bump.**
- [X] T007 Extend `tests/unit/storage-adapter.contract.test.mjs` (runs against both test adapters) with: `saveDeck` create then read back via `getProject`; replace by id; empty and duplicate names rejected; invalid counts rejected; `deleteDeck` leaves cards untouched; decks isolated per project; a project stored without `decks` reads without them; `duplicateProject` remaps entries (depends on T005, T006)

**Checkpoint**: `node --test tests/unit` passes (once Node is available); storage supports decks.

---

## Phase 3: User Story 1 - Create, name and manage decks (Priority: P1) MVP

**Goal**: Deck list per project: create, rename, delete, persistence, per-project isolation.

**Independent Test**: quickstart.md section 2.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create `js/views/deck-list/deck-list.html`: `<template id="deck-list-view">` with a back button, project/heading, a create form (`input name="deckName"`, submit), a `.field-error` paragraph, a `.deck-list` `<ul>`, and a `.deck-list-item-template` `<li>` with open (`hidden` until T016), rename, delete buttons (mirror `js/views/project-list/project-list.html`)
- [X] T009 [US1] Create `js/views/deck-list/deck-list.mjs` exporting `mountDeckList(root, storage, projectId, onBack)`: load via `loadFragment`/`cloneTemplate`; list `getDecks(project)`; create via `createDeck` + `storage.saveDeck`; rename (like `js/views/project-list/project-list.mjs`: `prompt("Rename deck", deck.name)`, return on `null`, show errors from the save in `.field-error`) via `saveDeck` with the new name; delete via `storage.deleteDeck`; show validation errors in `.field-error`; the open button is wired in T016 and is `hidden` in the item template until then, so no dead button ships (depends on T006, T008)
- [X] T010 [P] [US1] Add deck-list styling to `css/styles.css` reusing the project-list item styles where possible (e.g. add the new item/open-button classes to the existing selectors)
- [X] T011 [US1] Add a `.card-type-decks-button` ("Decks") to the card type list screen: a single button near the top of `js/views/card-type-list/card-type-list.html` (project level, not per card type) and wire it in `js/views/card-type-list/card-type-list.mjs` to `mountDeckList(root, storage, projectId, backToList)` (depends on T009). **Commit with a `?v=` bump.**
- [ ] T012 [US1] Manual validation: run quickstart.md section 2 and fix issues

**Checkpoint**: Decks can be created, renamed, deleted and persisted. MVP.

---

## Phase 4: User Story 2 - Sort cards into a deck (Priority: P2)

**Goal**: Deck editor with entries, copy counts, totals, and adding cards.

**Independent Test**: quickstart.md section 3.

### Implementation for User Story 2

- [X] T013 [P] [US2] Create `js/views/deck-editor/deck-editor.html`: `<template id="deck-editor-view">` with back button, deck name heading, totals line (`.deck-total-cards`, `.deck-distinct-cards`), an entries table/list with `.deck-entry-template` (card summary, number `<input class="deck-entry-count">`, remove button), a `.field-error`, an "available cards" list with `.available-card-template` (card summary + Add button), and an empty-state message element
- [X] T014 [US2] Create `js/views/deck-editor/deck-editor.mjs` exporting `mountDeckEditor(root, storage, projectId, deckId, onBack)`: render entries from the deck (skipping nothing; pruning guarantees valid cards), card summary text = card type name + the card's non-blank property values in property order, or "(empty card)"; count input `change` calls `setEntryCount` then `storage.saveDeck`, restoring the previous value and showing the error on failure; remove button sets count 0; Add button calls `addCardToDeck`, saves, re-renders; totals via `deckTotals`; message when the project has no cards (depends on T006, T013)
- [X] T015 [P] [US2] Add deck-editor styling to `css/styles.css`
- [X] T016 [US2] Unhide the open button in `js/views/deck-list/deck-list.html` and wire it in `js/views/deck-list/deck-list.mjs` to `mountDeckEditor(root, storage, projectId, deck.id, () => mountDeckList(...))` (depends on T009, T014). **Commit with a `?v=` bump.**
- [ ] T017 [US2] Manual validation: run quickstart.md section 3 and fix issues

**Checkpoint**: Stories 1 and 2 work; decks hold cards with counts.

---

## Phase 5: User Story 3 - Find cards and keep decks consistent (Priority: P3)

**Goal**: Filter/search available cards; deleted cards vanish from decks.

**Independent Test**: quickstart.md section 4.

### Implementation for User Story 3

- [ ] T018 [P] [US3] Add `filterCards(cardTypes, { cardTypeId, text })` and `pruneDecks(project)` to `js/models/deck.mjs` per `contracts/storage-adapter-delta.md` **Commit with a `?v=` bump.**
- [ ] T019 [P] [US3] Add tests to `tests/unit/deck-model.test.mjs`: `filterCards` by type, by case-insensitive text over any value, both combined, neither; `pruneDecks` removes entries for deleted cards and keeps others, across several decks (depends on T018)
- [ ] T020 [US3] Make `saveCardType` and `deleteCardType` call `pruneDecks(project)` before persisting in `js/storage/indexeddb-adapter.mjs`, `tests/support/in-memory-adapter.mjs` and `tests/support/array-store-adapter.mjs` (depends on T006, T018). **Commit with a `?v=` bump.**
- [ ] T021 [US3] Add contract tests to `tests/unit/storage-adapter.contract.test.mjs`: deleting a card (via `saveCardType` without it) removes it from every deck holding it; `deleteCardType` removes its cards' entries; other entries survive (depends on T020)
- [ ] T022 [US3] Add the card type `<select class="available-type-filter">` (with an "All card types" option and a `<template>` option) and a `<input type="search" class="available-text-filter">` to `js/views/deck-editor/deck-editor.html`; update `js/views/deck-editor/deck-editor.mjs` to build the available list from `filterCards` and re-render on `change`/`input` (depends on T014, T018). **Commit with a `?v=` bump.**
- [ ] T023 [US3] Manual validation: run quickstart.md sections 4 and 5 and fix issues

**Checkpoint**: All three stories work independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T024 Confirm every commit that touched served scripts bumped `?v=` consistently (grep for mixed versions in `index.html` and `js/`)
- [ ] T025 Run `node --test tests/unit` and the whole quickstart.md once Node/browser are available; confirm Slices 1–3 did not regress (project list, card types, editor, card table, CSV import)
- [ ] T026 Update `FEATURE-SLICES.md`: mark Slice 3 `[x]` and Slice 4 `[x]` once validated, and note Slice 2 was skipped

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (blocks all stories) → US1 → US2 → US3 → Polish.
- US2 depends on US1's deck list for navigation (T016 after T009); US3 extends the US2 editor (T022 after T014).
- Within Phase 2: T002 first; T003/T004/T006 follow it; T005 after T003+T004; T007 after T005+T006.

### Parallel Opportunities

- T002 ∥ (nothing else); then T003 ∥ T004 ∥ T006.
- US1: T008 ∥ T010.
- US2: T013 ∥ T015.
- US3: T018 ∥ nothing; then T019 ∥ T020.

---

## Parallel Example: Foundational

```text
Task: "Write tests/unit/deck-model.test.mjs"                 (T003)
Task: "Clone/duplicate remap in project.mjs, card-type.mjs"  (T004)
Task: "saveDeck/deleteDeck in all adapters"                  (T006)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phases 1–2 (model + storage)
2. Phase 3 (deck list), validate with quickstart section 2

### Incremental Delivery

1. Foundation → US1 (named decks) → US2 (cards in decks) → US3 (filter + integrity), each as its own small commit(s) with a version bump when scripts change.

---

## Notes

- Decks reference cards by id; never copy card data into a deck.
- Reuse existing patterns (`loadFragment`/`cloneTemplate`, project-list rename flow) rather than inventing new ones.
