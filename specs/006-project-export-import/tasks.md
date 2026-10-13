---

description: "Task list for Project Export & Import"
---

# Tasks: Project Export & Import

**Input**: Design documents from `/specs/006-project-export-import/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/project-export-format.md, quickstart.md

**Tests**: Included for the pure model functions (envelope build/validate/rebuild, id remapping) and the extended storage-adapter contract suite, per plan.md. The actual file download/picker round trip is verified manually via quickstart.md (browser file I/O isn't unit-testable under plain Node).

**Organization**: Tasks are grouped by user story (spec.md) so each can be implemented and tested independently. US1 (export) and US2 (import) are both P1; US3 (import feedback) is P2 and only adds a thin UI layer on top of US2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3
- Paths are relative to the repository root.

## Delivery Rules (apply to every task)

- **Small commits**: commit after each task or tightly related group; every commit must leave the app loadable (git auto-deploy).
- **Version bump**: whenever a commit changes a served script or stylesheet (anything under `js/`, `css/`, or `index.html`), bump the `?v=` suffix (currently `?v=21`) consistently across `index.html` and every `js/` import in that same commit. New files nothing imports yet need no bump; use the current version in their own imports once they are wired in.
- Constitution: structure lives in `.html` templates, JS only clones and fills; no dependencies (`Blob`/object URLs/`<input type="file">` only); minimal comments; small single-purpose files.

---

## Phase 1: Setup

- [X] T001 Confirm Node 20+ is available for `node --test tests/unit` (no new scaffolding needed — all target directories already exist from prior slices)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The pure, storage-agnostic envelope logic both stories build on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Create `js/models/project-export.mjs` exporting:
  - `buildExportEnvelope(project)` → `{ cardgamePrototyperExport: "project", formatVersion: 1, exportedAt: new Date().toISOString(), project: { name: project.name, cardTypes: project.cardTypes, decks: getDecks(project) } }` (import `getDecks` from `./deck.mjs`; no deep clone needed, the result is serialized immediately)
  - `exportFileName(projectName)` → slugify (lowercase, non-alphanumerics → `-`, collapse/trim repeated/leading/trailing `-`) + `.json`; falls back to `"project.json"` if the slug is empty
  - `validateExportEnvelope(parsed)` → throws a single clear `Error` (e.g. `"This file is not a Cardgame Prototyper project export."`) unless `parsed` is a non-null object with `parsed.cardgamePrototyperExport === "project"`, `parsed.project` is an object, `typeof parsed.project.name === "string"` (non-empty after trim), and `Array.isArray(parsed.project.cardTypes)`; treats a missing/non-array `parsed.project.decks` as `[]` rather than failing
  - `buildProjectFromImport(envelope, existingNames)` → per data-model.md: a `cardIdMap = new Map()`; `cardTypes = envelope.project.cardTypes.map((ct) => cloneCardType(ct, cardIdMap))` (import `cloneCardType` from `./card-type.mjs`); `decks = cloneDecksForCards(envelope.project.decks ?? [], cardIdMap)` (import `cloneDecksForCards` from `./deck.mjs`, already drops entries whose `cardId` isn't in `cardIdMap` — satisfies FR-009); `name = validateProjectName` resolved against collisions the same way `cloneProjectForDuplicate` resolves a duplicate name (try the imported name as-is first, then append `copy`, `copy 2`, ... only on actual collision — do **not** always append "copy" the way duplicate does, since an import's own name should survive untouched when there's no collision); returns a plain object with that `name`, `cardTypes`, `decks` (no `id`/`createdAt`/`updatedAt` — the caller assigns those like any other new project)
- [X] T003 [P] Add `importProject(exportedData)` to `js/storage/storage-adapter.mjs`'s base class: `throw new Error("importProject not implemented")`
- [X] T004 Implement `importProject(exportedData)` in `js/storage/indexeddb-adapter.mjs`: validate first — `validateExportEnvelope(exportedData)` — so a direct/malformed call fails with the same clear, non-technical message FR-007 promises rather than a raw technical error, matching `saveCardType`'s existing self-validating precedent; then `const existing = await this.#getAllProjects(); const built = buildProjectFromImport(exportedData, existing.map((p) => p.name)); const now = Date.now(); const project = { id: crypto.randomUUID(), ...built, createdAt: now, updatedAt: now }; return this.#putProject(project);` (import `buildProjectFromImport`/`validateExportEnvelope` from `../models/project-export.mjs`) (depends on T002)
- [X] T005 [P] Implement the same `importProject` logic (including the `validateExportEnvelope` call first) in `tests/support/in-memory-adapter.mjs` (Map-backed: build existing names from `[...this.#projects.values()]`, `this.#projects.set(project.id, project)`) (depends on T002)
- [X] T006 [P] Implement the same `importProject` logic (including the `validateExportEnvelope` call first) in `tests/support/array-store-adapter.mjs` (array-backed: `this.#projects.map((p) => p.name)`, `this.#projects.push(project)`) (depends on T002)
- [X] T007 [P] Write `tests/unit/project-export.test.mjs` (node:test) covering: `buildExportEnvelope` shape (marker, `formatVersion`, `project.name`/`cardTypes`/`decks`, no `id`/timestamps leaked); `exportFileName` slugifies typical names, falls back to `project.json` for an all-symbols name; `validateExportEnvelope` accepts a well-formed envelope, rejects `null`/a plain unrelated object/one missing the marker/one with a non-string `project.name`/one with a non-array `project.cardTypes`, and tolerates a missing `project.decks`; `buildProjectFromImport` regenerates every card type/property/element/card id (none match the input), remaps a deck's `cardId` entries to the new card ids, drops a deck entry whose `cardId` has no matching card in the same envelope, and resolves a name collision against `existingNames` while leaving a non-colliding name untouched (depends on T002)
- [X] T008 [P] Extend `tests/unit/storage-adapter.contract.test.mjs` with `importProject` cases run against both `InMemoryAdapter` and `ArrayStoreAdapter`: a minimal envelope import appears in `listProjects()` with an id distinct from anything already present; the imported project's `createdAt`/`updatedAt` are fresh (`Date.now() - project.createdAt < 1000`), not inherited from anywhere (FR-011); importing an envelope whose `project.name` collides with an existing project succeeds with an adjusted name and leaves the existing project untouched; card type/card/deck ids inside the imported project differ from the ids in the source envelope; a deck entry referencing a card id absent from the same envelope is dropped rather than causing a thrown error; calling `importProject` directly with a malformed envelope (missing marker field) throws the same clear `Error` `validateExportEnvelope` would throw, and creates no project (depends on T004, T005, T006)

**Checkpoint**: `node --test tests/unit` passes — the envelope logic and both test-double adapters are proven correct before any UI is wired up.

---

## Phase 3: User Story 1 - Export a project to a file (Priority: P1) 🎯 MVP

**Goal**: An **Export** button per project in the project list that downloads that project as a human-readable JSON file.

**Independent Test**: quickstart.md section 2.

### Implementation for User Story 1

- [ ] T009 [US1] Add a `.project-export-button` (labelled "Export") to the `.project-list-item-template` in `js/views/project-list/project-list.html`, next to the existing Rename/Duplicate/Delete buttons
- [ ] T010 [US1] Create `js/views/project-list/download-file.mjs` exporting `downloadTextFile(fileName, text)`: build a `Blob([text], { type: "application/json" })`, object URL via `URL.createObjectURL`, assign to a detached `<a>`'s `href`/`download`, call `.click()`, then `URL.revokeObjectURL` on the next tick. **New file only: no `?v=` bump.**
- [ ] T011 [US1] Wire the export button in `js/views/project-list/project-list.mjs`: inside the per-item click handler (nested in `for (const project of projects)`), do **not** redeclare `project` — a `const project = ...` there would shadow the loop's `project` for the whole function body and throw a TDZ `ReferenceError` on `project.id`. Instead: `const fullProject = await storage.getProject(project.id)`, `const envelope = buildExportEnvelope(fullProject)`, `downloadTextFile(exportFileName(fullProject.name), JSON.stringify(envelope, null, 2))` (import `buildExportEnvelope`/`exportFileName` from `../../models/project-export.mjs?v=22` and `downloadTextFile` from `./download-file.mjs?v=22`) (depends on T002, T009, T010). **Commit with a `?v=` bump.**
- [ ] T012 [US1] Manual validation: run quickstart.md section 2 and fix issues

**Checkpoint**: Any project can be exported to a readable JSON file. MVP (export half).

---

## Phase 4: User Story 2 - Import a project from a file (Priority: P1)

**Goal**: An **Import project** action on the project list that reads a chosen file and adds it as a new, independent project.

**Independent Test**: quickstart.md section 3.

### Implementation for User Story 2

- [ ] T013 [US2] Add to `js/views/project-list/project-list.html`: an `.import-project-button` ("Import project") and a hidden `<input type="file" class="import-project-input" accept=".json,application/json" hidden>`, both above the `.project-list`
- [ ] T014 [US2] Wire import in `js/views/project-list/project-list.mjs`: clicking `.import-project-button` triggers a click on the hidden file input; on the input's `change` event, read `input.files[0]` (return early if none — a cancelled picker), `await file.text()`, `JSON.parse` wrapped in try/catch (a `SyntaxError` is surfaced through the same `showError` as a validation failure), `validateExportEnvelope(parsed)`, then `const created = await storage.importProject(parsed)` (capture the return value — Phase 5/T017 reads `created.name`), then `await refresh()`; reset `input.value = ""` afterward so re-selecting the same file re-fires `change`; any thrown error (parse failure, validation failure, or an adapter error) goes through the existing `showError` (import `validateExportEnvelope` from `../../models/project-export.mjs?v=22`) (depends on T002, T004, T013). **Commit with a `?v=` bump.**
- [ ] T015 [US2] Manual validation: run quickstart.md section 3 and fix issues

**Checkpoint**: Stories 1 and 2 together deliver the full export/import round trip. MVP complete.

---

## Phase 5: User Story 3 - Confirm what will happen before importing (Priority: P2)

**Goal**: Surface the imported project's name to the user as part of a successful import.

**Independent Test**: quickstart.md section 4.

### Implementation for User Story 3

- [ ] T016 [US3] Add an `.import-status` paragraph (hidden by default, styled like the existing `.field-error` but not an error) to `js/views/project-list/project-list.html`, placed near the import button
- [ ] T017 [US3] Update `js/views/project-list/project-list.mjs`'s import handler: on a successful `storage.importProject`, set `.import-status` to `` Imported "${created.name}". `` and clear it the next time an import starts or fails (depends on T014). **Commit with a `?v=` bump.**
- [ ] T018 [US3] Manual validation: run quickstart.md section 4 and fix issues

**Checkpoint**: All three stories work independently; the full spec is satisfied.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Add minimal styling for `.project-export-button`, `.import-project-button`, and `.import-status` to `css/styles.css`, reusing existing button/field-error classes where they already fit. **Commit with a `?v=` bump (CSS change).**
- [ ] T020 Confirm every commit that touched served scripts/styles bumped `?v=` consistently (grep `index.html` and `js/` for mixed versions)
- [ ] T021 Run `node --test tests/unit` and all of quickstart.md (sections 1–6, including the round-trip and edge-case checks); confirm Slices 1–5 did not regress
- [ ] T022 Update `FEATURE-SLICES.md` / note this feature's completion (it sits outside the original 7-slice list, added by later user request) once validated

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (blocks all stories) → US1 → US2 → US3 → Polish.
- US1 and US2 both only need the Phase 2 model/adapter work and are otherwise independent of each other (export doesn't need import to exist, and vice versa) — they could be built in either order or in parallel by different people, but both touch `project-list.html`/`.mjs`, so sequence them to avoid merge conflicts in one working session.
- US3 strictly extends US2's import handler and has no meaning without it.
- Within Phase 2: T002 first; T003 ∥ (independent); T004/T005/T006 each depend on T002 (and T004 also needs T003's contract method declared first, though adding the override doesn't strictly require the base class edit to land first — sequence them together for clarity); T007 and T008 depend on all of T002/T004/T005/T006.

### Parallel Opportunities

- Phase 2: T003 ∥ T005 ∥ T006 (different files) once T002 exists; T007 ∥ T008 once T002/T004/T005/T006 exist.
- US1: T009 ∥ T010 (different files), then T011.
- Polish: T019 can run any time after the buttons exist.

---

## Parallel Example: Foundational

```text
Task: "Add importProject contract method to js/storage/storage-adapter.mjs"     (T003)
Task: "Implement importProject in tests/support/in-memory-adapter.mjs"          (T005)
Task: "Implement importProject in tests/support/array-store-adapter.mjs"        (T006)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Phases 1–2 (envelope logic and both test-double adapters; no UI impact, no bump needed until T004's `IndexedDbAdapter` change, which does bump since it's a served file)
2. Phase 3 (export), validate with quickstart section 2
3. Phase 4 (import), validate with quickstart section 3 — together these two are the MVP; export alone or import alone doesn't deliver the feature's stated purpose

### Incremental Delivery

1. Foundation → US1 (export) → US2 (import) → US3 (import feedback), each as small commits with a version bump when served scripts/styles change.

---

## Notes

- Import always creates a brand-new project and never touches an existing one (FR-005) — there is no "merge" or "overwrite" code path to build.
- `buildProjectFromImport` reuses `cloneCardType`/`cloneDecksForCards` exactly as `cloneProjectForDuplicate` does, so id-regeneration correctness is inherited from already-shipped, already-tested code rather than reimplemented.
- The one behavioral difference from `cloneProjectForDuplicate`'s name handling: a duplicate always appends "copy" by construction, while an import keeps the original name untouched unless it actually collides (FR-006) — don't copy the "copy" suffix logic verbatim; only its collision-resolution loop.
