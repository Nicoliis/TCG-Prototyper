---

description: "Task list for Proxy Printing"
---

# Tasks: Proxy Printing

**Input**: Design documents from `/specs/005-proxy-printing/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/print-layout.md, quickstart.md

**Tests**: Included for the pure modules (sheet layout/packing, settings validation, selection resolution) per plan.md. Rendering fidelity, preview and actual printing are verified manually via quickstart.md. Node is not installed on the dev machine; install it to run `node --test tests/unit`.

**Organization**: Tasks are grouped by user story (spec.md) so each can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3
- Paths are relative to the repository root.

## Delivery Rules (apply to every task)

- **Small commits**: commit after each task or tightly related group; every commit must leave the app loadable (git auto-deploy).
- **Version bump**: whenever a commit changes a served script or stylesheet (anything under `js/`, `css/`, or `index.html`), bump the `?v=` suffix (currently `?v=16`) consistently across `index.html` and every `js/` import in that same commit. New files nothing imports yet need no bump; use the current version in their own imports.
- Constitution: structure lives in `.html` templates, JS only clones and fills; no dependencies; minimal comments; small single-purpose files.

---

## Phase 1: Setup

- [ ] T001 Install Node 20+ if missing (for `node --test tests/unit`) and create the empty folder `js/views/print/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pure modules every story depends on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Create `js/models/sheet-layout.mjs` exporting `PAPER_SIZES` (`a4`: 793.7 x 1122.5 px, `pageSize` `"210mm 297mm"`; `letter`: 816 x 1056 px, `pageSize` `"8.5in 11in"`; each with a `label`), `PAGE_MARGIN_PX = 24`, `defaultSheetSettings(locale)` (`letter` for `en-US`/`en-CA`/`es-MX`, else `a4`; `spacingInches` 0.1; `cutGuides` false), `validateSheetSettings(raw, locale)` (never throws; bad or missing fields fall back to defaults; spacing must be a number 0–0.5), and `layoutSheets(items, settings)` implementing the rules in `contracts/print-layout.md` (expand copies in order, per-card scale `min(1, contentW/w, contentH/h)`, shelf packing, effective spacing `max(spacingInches, cutGuides ? 0.1 : 0)`, new page when a row does not fit, returns `{ pages: [{ placements }], scaledCount, totalCards }`). **New file only: no `?v=` bump.**
- [X] T003 [P] Create `js/models/print-selection.mjs` exporting `selectionFromDeck(deck)` (copies entries), `resolveSelection(project, selection)` (uses `findCard` from `js/models/deck.mjs`; skips missing cards; returns `{ cardType, card, count }[]`) and `cardValuesByName(cardType, card)`. **New file only: no bump.**
- [X] T004 [P] Create `js/storage/sheet-settings-store.mjs` exporting `loadSheetSettings()` and `saveSheetSettings(settings)` using `localStorage` key `cardgame-prototyper.sheetSettings`, everything in try/catch, validated through `validateSheetSettings(raw, navigator.language)`. **New file only: no bump.**
- [X] T005 [P] Write `tests/unit/sheet-layout.test.mjs` (node:test): default paper by locale; `validateSheetSettings` fallbacks (garbage input, negative/huge spacing, unknown paper); `layoutSheets` — empty items; ten 240x336 cards on A4 split 9 + 1 at spacing 0.1 in, nine on Letter split 6 + 3 at 0.1 in and fit one page at spacing 0; copies expand in item order; mixed sizes never overlap and stay inside the content area (assert pairwise non-overlap and bounds over a generated set); an oversized card is scaled to fit with `scaledCount` incremented; totals equal the sum of counts; spacing 0 vs 0.5 changes placement; with `cutGuides: true` and spacing 0 the gaps are still at least 0.1 in (depends on T001, T002)
- [X] T006 [P] Write `tests/unit/print-selection.test.mjs` (node:test): `selectionFromDeck` copies entries and later selection edits do not change the deck; `resolveSelection` expands cards with counts and skips missing cards; `cardValuesByName` maps property names, blank for missing values; selection works with `addCardToDeck`/`setEntryCount`/`deckTotals` from `js/models/deck.mjs` (depends on T001, T003)

**Checkpoint**: `node --test tests/unit` passes (once Node is available).

---

## Phase 3: User Story 1 - Print cards I pick one by one (Priority: P1) MVP

**Goal**: Print screen with a card picker, copy counts, true-size preview and printing.

**Independent Test**: quickstart.md section 2.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Create `js/views/print/print-sheet.html`: `<template id="print-sheet-view">` holding a `.print-pages` container, a `.print-page-template` (`<section class="print-page">`), a `.print-card-template` (`<div class="print-card">` frame sized by JS) and four clean per-kind element templates (`.print-element-template` with `data-kind` text/image/label/icon, each a `.layout-element` with only an `.element-content`, no delete/resize/rotate handles)
- [ ] T008 [US1] Create `js/views/print/render-card.mjs` exporting `renderPrintCard(cardType, card, templates, scale)`: clone the `.print-card-template`, set size to `width*scale`/`height*scale`, render each element by cloning the matching element template, then use `applyTransform`, `applyElementStyle`, `renderPreview` (from `js/views/card-type-editor/layout-element.mjs`) with `cardValuesByName`; attach to the DOM before calling `applyTextFit` (from `js/views/card-type-editor/text-fit.mjs`) because fitting needs layout; when `scale < 1` wrap the card contents in an inner box with `transform: scale(scale)` and `transform-origin: top left` so the card keeps its own pixel layout (depends on T003, T007)
- [ ] T009 [US1] Create `js/views/print/render-sheets.mjs` exporting `renderSheets(container, project, items, settings, templates)`: call `layoutSheets`, clear the container, for each page clone `.print-page-template` (page size from `PAPER_SIZES[settings.paper]`), position each placement absolutely via `left/top` and append `renderPrintCard`; returns the `LayoutResult` (depends on T002, T008)
- [ ] T010 [US1] Create `js/views/print/print-screen.html`: `<template id="print-screen-view">` with back button, heading, `.print-controls` (available-card list with `.available-card-template` rows and Add buttons; selection list with `.selection-entry-template` rows holding card summary, copies `<input type="number">`, remove button; `.field-error`; empty-selection message; Print button) and a `.print-preview` mount for the sheets; include the `<style class="page-size-style"></style>` element for `@page`
- [ ] T011 [US1] Create `js/views/print/print-screen.mjs` exporting `mountPrintScreen(root, storage, projectId, onBack)`: load `print-sheet.html` and `print-screen.html` with `loadFragment`/`cloneTemplate`; keep the selection as `{ entries: [] }`; Add uses `addCardToDeck`, copies input uses `setEntryCount` (on error show the message and restore the value), remove uses count 0; card summaries via `describeCard`; `refreshPreview()` resolves the selection with `resolveSelection`, calls `renderSheets` with default sheet settings, updates a totals line, disables Print and shows "Pick cards first" when there are no cards; Print button first waits until every `<img>` in the preview has loaded or fallen back to the broken-image placeholder (resolve on `load`/`error`, give up after 5 seconds), then calls `window.print()`; set the `.page-size-style` text to `@page { size: <pageSize>; margin: 0 }` (depends on T003, T009, T010)
- [ ] T012 [P] [US1] Add to `css/styles.css`: print-screen layout (controls beside preview, preview shown smaller on screen with CSS `zoom: var(--preview-scale)` on the preview wrapper, not `transform`, so no empty full-size space is left behind), `.print-page` (white page at paper size, `position: relative`, page-break-after), `.print-card` (absolute, overflow hidden) and the clean-card overrides (`.print-card .layout-element { border: none; background: none; }` so inline element styles still win and the editor's tinted chrome never shows) **Commit together with T013 and T014 (one `?v=` bump), since the CSS only matters once the screen is reachable.**
- [ ] T013 [US1] Add `@media print` rules to `css/styles.css`: hide `.app-header` and `.print-controls` and anything else in the screen except `.print-pages`; remove `main` padding/max-width; reset `--preview-scale` to 1 (no zoom when printing); one `.print-page` per sheet with `break-after: page` (no trailing blank page); `-webkit-print-color-adjust: exact` / `print-color-adjust: exact` so backgrounds print **Same commit as T012 and T014.**
- [ ] T014 [US1] Add a project-level **Print** button (`.print-button`) to `js/views/card-type-list/card-type-list.html` next to **Decks**, and wire it in `js/views/card-type-list/card-type-list.mjs` to `mountPrintScreen(root, storage, projectId, backToList)` (depends on T011). **Commit with a `?v=` bump.**
- [ ] T015 [US1] Manual validation: run quickstart.md section 2 and fix issues

**Checkpoint**: Cards can be picked, previewed at true size and printed. MVP.

---

## Phase 4: User Story 2 - Print a whole deck as a proxy sheet (Priority: P2)

**Goal**: Load a deck into the selection in one action.

**Independent Test**: quickstart.md section 3.

### Implementation for User Story 2

- [ ] T016 [US2] Add a deck `<select class="print-deck-select">` (with a "Choose a deck" placeholder and a `<template>` option) and a "Load deck" button to `js/views/print/print-screen.html`
- [ ] T017 [US2] Update `js/views/print/print-screen.mjs`: populate the select from `getDecks(project)`; Load deck replaces the selection with `selectionFromDeck(deck)`; an empty deck shows "This deck has no cards" and leaves the selection empty; selection edits never call `saveDeck` (depends on T016). **Commit with a `?v=` bump.**
- [ ] T018 [US2] Manual validation: run quickstart.md section 3 and fix issues

**Checkpoint**: Stories 1 and 2 work; a deck prints with one action.

---

## Phase 5: User Story 3 - Control the sheet layout (Priority: P3)

**Goal**: Paper size, spacing, cut guides, notices, remembered choices.

**Independent Test**: quickstart.md section 4.

### Implementation for User Story 3

- [ ] T019 [US3] Add to `js/views/print/print-screen.html`: a paper `<select class="sheet-paper-select">` (options A4, US Letter from `PAPER_SIZES` via a `<template>` option), a spacing `<input type="number" min="0" max="0.5" step="0.05">`, a cut-guides checkbox, a `.scaled-notice` paragraph (hidden by default), and a cut-guide template in `print-sheet.html` (`.print-cut-guide`, thin corner marks outside the card frame)
- [ ] T020 [US3] Update `js/views/print/print-screen.mjs`: initial settings from `loadSheetSettings()`; on any control change run `validateSheetSettings`, `saveSheetSettings`, update `@page`, and refresh the preview; show the `.scaled-notice` when `LayoutResult.scaledCount > 0` (depends on T004, T019)
- [ ] T021 [US3] Update `js/views/print/render-card.mjs` / `render-sheets.mjs` to draw cut guides around each placement (from the cut-guide template) when `settings.cutGuides` is true, drawn in the spacing gap so they never overlap neighbouring cards (depends on T019). **Commit T019–T021 with a `?v=` bump.**
- [ ] T022 [P] [US3] Add cut-guide and controls styling to `css/styles.css`, including that guides print (they are part of `.print-pages`) **Commit with a `?v=` bump (CSS change).**
- [ ] T023 [US3] Manual validation: run quickstart.md sections 4 and 5 and fix issues

**Checkpoint**: All three stories work independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T024 Confirm every commit that touched served scripts bumped `?v=` consistently (grep `index.html` and `js/` for mixed versions)
- [ ] T025 Run `node --test tests/unit` and the whole quickstart.md (including a real print or save-as-PDF at 100% scale and a ruler check of a 240x336 card) once Node/browser are available; confirm Slices 1–4 did not regress
- [ ] T026 Update `FEATURE-SLICES.md`: mark Slice 5 `[x]` after validation

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (blocks all stories) → US1 → US2 → US3 → Polish.
- US2 and US3 both extend `print-screen.html`/`.mjs`, so they follow US1 (and each other) rather than running in parallel.
- Within US1: T007 → T008 → T009; T010 → T011 (needs T009); T012 and T013 can follow T007 in parallel with the JS; T014 last.

### Parallel Opportunities

- Phase 2: T002 ∥ T003 ∥ T004, then T005 ∥ T006.
- US1: T007 ∥ T010 ∥ T012 (different files); T013 after T012 (same file).
- US3: T022 ∥ T020.

---

## Parallel Example: Foundational

```text
Task: "Create js/models/sheet-layout.mjs"                  (T002)
Task: "Create js/models/print-selection.mjs"               (T003)
Task: "Create js/storage/sheet-settings-store.mjs"         (T004)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phases 1–2 (pure modules and tests; no UI impact, no bump needed)
2. Phase 3 (print screen), validate with quickstart section 2

### Incremental Delivery

1. Foundation → US1 (pick and print) → US2 (print a deck) → US3 (layout controls), each as small commits with a version bump when served scripts change.

---

## Notes

- Printed cards must be rendered with the same code as the editor (`renderPreview`, `applyElementStyle`, `applyTextFit`, `substitute`) so they match on-screen rendering; never duplicate that logic.
- The print selection reuses the deck model's functions; it is never stored and never changes cards or decks.
