---

description: "Task list for Projects + Card Types (core)"
---

# Tasks: Projects + Card Types (core)

**Input**: Design documents from `/specs/001-projects-card-types/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/storage-adapter.md, quickstart.md

**Tests**: Included. The plan's Testing strategy (research.md) and the
storage contract (contracts/storage-adapter.md) require an automated
contract test to verify FR-017/SC-004 (storage swappability), so test
tasks are in scope here, not merely optional illustration.

**Organization**: Tasks are grouped by user story (spec.md) to enable
independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths are relative to the repository root, per plan.md's Project Structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Static-site skeleton, no build step (Principle I)

- [X] T001 Create `index.html` app shell (nav + a single view mount point, `<script type="module" src="js/app.mjs">`)
- [X] T002 [P] Create `css/styles.css` with a base reset and layout rules for the app shell
- [X] T003 [P] Create `tests/unit/` directory and confirm `node --test` runs (empty pass) with no added dependencies. All hand-written files use the `.mjs` extension so Node recognizes them as ES modules natively, with no `package.json` or any other manifest needed — keeping the repo exclusively HTML/CSS/JS per the constitution.

**Checkpoint**: App loads a blank shell over a static server; test runner works.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The storage abstraction, models, and template substitution every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Define the storage contract in `js/storage/storage-adapter.mjs` per `contracts/storage-adapter.md` (method signatures: `listProjects`, `getProject`, `createProject`, `renameProject`, `duplicateProject`, `deleteProject`, `saveCardType`, `deleteCardType`; throw "not implemented" in the base so a missing method fails loudly)
- [X] T005 [P] Implement `js/models/project.mjs`: `Project` shape + name validation (non-empty, unique) per data-model.md and FR-018
- [X] T006 [P] Implement `js/models/card-type.mjs`: `CardType`, `Property`, `TextDisplay`, `ImageDisplay`, `Label`, `ImageIcon` shapes + validation (non-empty/unique names, positive width/height) per data-model.md
- [X] T007 [P] Implement `js/templating/substitute.mjs`: resolves `{propertyName}` tokens in a template string against a property-value map, leaving unknown tokens blank (Edge Cases)
- [X] T008 Implement `js/storage/indexeddb-adapter.mjs` satisfying the contract from T004, backed by IndexedDB (depends on T004, T005, T006)
- [X] T009 [P] Implement `tests/support/in-memory-adapter.mjs` and `tests/support/array-store-adapter.mjs`: two structurally distinct Node-runnable adapters (Map- vs array-backed) satisfying the same contract, used to prove swappability automatically since IndexedDB has no Node runtime (depends on T004)
- [X] T010 Write `tests/unit/storage-adapter.contract.test.mjs`: a single `node:test` suite parameterized over `[InMemoryAdapter, ArrayStoreAdapter]`, asserting the behaviors from contracts/storage-adapter.md; `IndexedDbAdapter` is instead verified via quickstart.md's manual reload/persistence steps, since IndexedDB is unavailable under plain Node (depends on T008, T009)
- [X] T011 [P] Write `tests/unit/card-type-model.test.mjs` and `tests/unit/substitute.test.mjs` covering the validation/substitution rules from T006/T007
- [X] T012 Wire `js/app.mjs`: imports the active adapter (`indexeddb-adapter.mjs`) as the app's single storage instance, bootstraps the project-list view into `index.html`'s mount point (depends on T008)

**Checkpoint**: `node --test` passes (18/18); storage, models, and substitution are ready for views to consume.

---

## Phase 3: User Story 1 - Manage prototype projects (Priority: P1) 🎯 MVP

**Goal**: Create, list, duplicate, rename, delete, and switch between fully
isolated projects.

**Independent Test**: Create two projects, add a card type to one (stub
card type creation is enough at this phase), confirm the other shows no
trace of it; duplicate a project and confirm editing the copy doesn't
affect the original.

### Implementation for User Story 1

- [X] T013 [P] [US1] Create `js/views/project-list/project-list.html`: a `<template>` fragment with the project list, a create-project form, and per-project duplicate/rename/delete controls (Principle III)
- [X] T014 [US1] Implement `js/views/project-list/project-list.mjs`: fetch + clone the T013 fragment, bind it to `listProjects`/`createProject`/`duplicateProject`/`renameProject`/`deleteProject`, and track which project is active (depends on T013, T012)
- [X] T015 [US1] Add inline validation messages for empty/duplicate project names, reusing `js/models/project.mjs` validation (FR-018) (depends on T014)
- [X] T016 [US1] Expose the active-project state tracked in T014 to later views (US2/US3), gating card-type visibility on it (depends on T014)

**Checkpoint**: User Story 1 is fully functional and independently
testable (quickstart.md steps 2-3).

---

## Phase 4: User Story 2 - Define a card type's properties and layout (Priority: P2)

**Goal**: Within the active project, create card types with named
properties and a freeform layout of text displays, image displays, static
labels, and static images/icons, each card type with its own size.

**Independent Test**: Create one card type with one property, one text
display, one image display, one label, one icon; reload the browser and
confirm the card type and its layout are unchanged.

### Implementation for User Story 2

- [X] T017 [P] [US2] Create `js/views/card-type-list/card-type-list.html`: fragment listing the active project's card types with a create-card-type control
- [X] T018 [US2] Implement `js/views/card-type-list/card-type-list.mjs`: bind to `saveCardType` (create path) scoped to the active project; enforce unique card type name (FR-008, FR-018) (depends on T017, T016)
- [X] T019 [P] [US2] Create `js/views/card-type-editor/card-type-editor.html`: fragment with a card type width/height input, a property editor (add/remove named properties), a canvas sized to the card type's width/height, controls to add a text display / image display / label / icon, and one `<template>` per element kind (text display, image display, label, icon) for cloning onto the canvas (Principle III)
- [X] T020 [US2] Implement property CRUD and width/height editing in `js/views/card-type-editor/card-type-editor.mjs`, backed by `js/models/card-type.mjs` (depends on T019, T006)
- [X] T021 [US2] Implement freeform element placement on the canvas: for each of the four element kinds, clone its `<template>` from T019 (never build it via `createElement`/`innerHTML`) and support drag/position + resize producing `x,y,width,height` per data-model.md (depends on T020). Implemented in `js/views/card-type-editor/layout-element.mjs`, kept separate from the view orchestrator to stay focused (Principle II).
- [X] T022 [US2] Render text displays using `js/templating/substitute.mjs` against current property values (depends on T021, T007)
- [X] T023 [US2] Render image displays: resolve the template to a URL via `substitute.mjs`, show a placeholder image on load error (Edge Cases) (depends on T021, T007)
- [X] T024 [US2] Persist every card type edit (properties, elements, width/height) via `saveCardType`/`deleteCardType` (depends on T022, T023, T008)
- [X] T025 [US2] Wire navigation: project-list → card-type-list → card-type-editor (depends on T018, T024). Implemented as direct calls between the three view modules (each mount function takes an `onBack` callback to return to its caller) rather than a central router in `js/app.mjs`, keeping `app.mjs` a one-line bootstrap and each view responsible only for its own forward navigation (Principle II).

**Checkpoint**: User Stories 1 AND 2 both work independently (quickstart.md
steps 4-8, 10-11).

---

## Phase 5: User Story 3 - Preview a card type with sample values (Priority: P3)

**Goal**: Enter sample values per property and see every display render
with those values, tolerant of blanks and broken images.

**Independent Test**: Enter sample values for a card type's properties,
including leaving one blank; confirm every display updates and the blank
property's display renders empty, not an error.

### Implementation for User Story 3

- [X] T026 [US3] Add a sample-value input (one field per property) to `js/views/card-type-editor/card-type-editor.html` (depends on T019)
- [X] T027 [US3] Implement live preview re-render in `card-type-editor.mjs`: on any sample-value change, re-run T022/T023's rendering with the current sample values, blank-safe (FR-015, SC-005) (depends on T022, T023, T026)

**Checkpoint**: All three user stories are independently functional
(quickstart.md step 9).

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all stories

- [X] T028 [P] Finish `css/styles.css` rules for the project list, card-type list, and card-type editor/canvas
- [X] T029 [P] Run `node --test` and fix any failures — 18/18 passing
- [X] T030 Run the full manual quickstart.md pass (all steps) including the storage swappability check (SC-004) — driven headlessly via Playwright against a local static server; isolation, duplication, persistence-across-reload, zero-projects, blank-sample-value, and broken-image-placeholder all verified with no console errors
- [X] T031 [P] Review every new file against the constitution (small/focused files, HTML-first composition, minimal/self-explanatory-only comments) and refactor any violations — all view markup lives in `.html` `<template>` fragments (no `createElement`/`innerHTML` structure-building); largest file is 150 lines (card-type-editor.mjs), split from layout-element.mjs to stay focused; only 2 comments in the whole codebase, both non-obvious rationale

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational and on US1's active-project switching (T016)
- **User Story 3 (Phase 5)**: Depends on US2's card-type-editor existing (T019, T022, T023) — it adds to the same editor rather than standing alone, matching spec.md's note that US3 is lower priority than defining the structure itself
- **Polish (Phase 6)**: Depends on all three user stories

### Parallel Opportunities

- Setup: T002, T003 in parallel
- Foundational: T004, T005, T006, T007 in parallel; then T009 in parallel with T008; T011 in parallel with T010
- US1: T013 can start while Foundational's later tasks finish, but T014 needs T012
- US2: T017 and T019 (different files) in parallel
- Polish: T028, T029, T031 in parallel

---

## Parallel Example: Foundational Phase

```bash
Task: "Define storage contract in js/storage/storage-adapter.mjs"
Task: "Implement Project model in js/models/project.mjs"
Task: "Implement CardType/Property/Display/Label/Icon models in js/models/card-type.mjs"
Task: "Implement template substitution in js/templating/substitute.mjs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: quickstart.md steps 2-3
5. Demo: project creation/isolation works, even with no card types yet

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → validate → demo (MVP)
3. Add US2 → validate → demo (first real content: a rendered card type)
4. Add US3 → validate → demo (preview with sample data)
5. Polish → full quickstart.md pass, including SC-004 swappability check

---

## Notes

- [P] tasks touch different files with no unmet dependencies
- Every file path above matches plan.md's Project Structure exactly
- Commit after each task or logical group
- Stop at each checkpoint to validate that story independently before continuing
