---

description: "Task list for Card Editor Precision & Visual Polish"
---

# Tasks: Card Editor Precision & Visual Polish

**Input**: Design documents from `/specs/002-card-editor-polish/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/storage-adapter-delta.md, quickstart.md

**Tests**: Included for the new model logic (`ElementStyle` defaults/
validation), consistent with how Slice 1 tested `card-type.mjs`. UI/visual
behavior (selection, panel sync, style rendering, visual consistency) is
verified manually via quickstart.md, since it's DOM-interaction and visual
judgment, not unit-testable logic.

**Organization**: Tasks are grouped by user story (spec.md) to enable
independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths are relative to the repository root, per plan.md's Project Structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: The visual design system every story's styling depends on

- [X] T001 Add CSS custom properties (spacing scale, palette colors, border
      radius) at `:root` in `css/styles.css`, as the single source of truth
      the rest of this feature's CSS work references

**Checkpoint**: Variables exist; no visual change yet (nothing references them).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `ElementStyle` data shape every later story needs

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] In `js/models/card-type.mjs`: add a default `style` block
      (`background`/`border`/`shadow`, each `{enabled: false, ...}` per
      data-model.md) to `createElement`'s output; export
      `defaultElementStyle()` and `getElementStyle(element)` (returns
      `element.style ?? defaultElementStyle()`, so elements saved before
      this feature — which have no `style` field at all — read safely,
      per FR-012); add `setElementStyle(element, styleKey, patch)`
      validating `color` (non-empty string) and `thickness` (positive
      number) the same way `width`/`height` are validated, and
      self-healing (`element.style ??= defaultElementStyle()`) before
      writing so it also works on legacy elements
- [X] T003 [P] In `tests/unit/card-type-model.test.mjs`: add tests for
      `style` defaulting to all-disabled on a new element,
      `getElementStyle` returning defaults for an element with no `style`
      field at all, and `setElementStyle` rejecting a non-positive
      thickness

**Checkpoint**: `node --test` passes with the new style model covered.

---

## Phase 3: User Story 1 - Select one element and edit it precisely (Priority: P1) 🎯 MVP

**Goal**: Click an element to select only it; a properties panel shows and
lets you precisely edit its x/y/width/height/rotation/content; deselecting
shows a clean, real-values preview with no toggle needed.

**Independent Test**: Click an element, confirm the panel shows its current
values, change one by typing, confirm the canvas matches exactly; drag the
element and confirm the panel updates to match.

### Implementation for User Story 1

- [X] T004 [US1] Remove the old Edit/See toggle: delete the
      `.canvas-mode-toggle` markup from
      `js/views/card-type-editor/card-type-editor.html` and the
      `setUpModeToggle` function + its call from
      `js/views/card-type-editor/card-type-editor.mjs` (research.md
      "Deselection replaces the Edit/See toggle")
- [X] T005 [P] [US1] Restructure `js/views/card-type-editor/card-type-editor.html`
      into a 3-column layout (card data-properties sidebar | canvas |
      element-properties-panel mount point); simplify each element
      `<template>` to drop the old inline edit-view `<input>` (content
      editing moves to the new panel) while keeping the rendered content,
      delete button, resize handle, and rotate handle; rename the existing
      "Properties" heading to "Card Properties" so it reads distinctly
      from the new per-element panel (avoids two same-named panels on
      one screen)
- [X] T006 [P] [US1] Create `js/views/card-type-editor/element-properties-panel.html`:
      titled "Element Properties" (distinct from the card type's "Card
      Properties" sidebar), with an empty-state message plus a field set
      with number inputs for x, y, width, height, rotation, and one
      generalized labeled content field (relabeled per element kind at
      runtime)
- [X] T007 [US1] Create `js/views/card-type-editor/element-properties-panel.mjs`:
      fetch + clone T006's fragment once; export `setElement(element,
      callbacks)` that populates every field with the element's current
      values and wires each input's `input` listener to mutate the element
      and call `callbacks.onChange()` (card-type-editor.mjs passes its
      existing `persist` function as `onChange`, the same callback already
      used elsewhere in that file); export `clear()` that shows the empty
      state instead (depends on T006)
- [X] T008 [US1] In `js/views/card-type-editor/layout-element.mjs`: on
      `pointerdown` directly on an element (not its handles/delete
      button), call `callbacks.onSelect(element.id)` before starting the
      existing drag-tracking; add `setElementSelected(node, isSelected)`
      toggling a `.selected` class (depends on T005)
- [X] T009 [US1] In `js/views/card-type-editor/card-type-editor.mjs`: track
      `selectedElementId`; on `onSelect`, call the panel's `setElement`,
      clear `.selected` from every other node, and set it on the selected
      one; on a `pointerdown` whose target is the canvas element itself
      (not a child), deselect (panel `clear()`, remove `.selected`
      everywhere) (depends on T007, T008)
- [X] T010 [US1] Keep the panel in sync after direct manipulation: the
      existing drag/resize/rotate `onChange` callback in
      `card-type-editor.mjs` now also re-populates the panel (via
      `setElement`) when the changed element is the currently selected one
      (depends on T009)
- [X] T011 [US1] CSS in `css/styles.css`: the 3-column editor grid, the
      properties-panel field layout, and selection visibility rules
      (`.layout-element` hides its resize/rotate/delete controls by
      default; `.layout-element.selected` shows them). Deleted the rules
      that are now dead because T004/T005 remove what they styled:
      `.canvas-mode-toggle*`, every `.canvas[data-mode=...]` rule, and the
      `.element-edit-view` rule. Renamed `.element-see-view` to
      `.element-content` (in the HTML templates and `layout-element.mjs`
      too) now that the edit/see distinction is gone — it's just the
      content container now (depends on T005, T001)

**Checkpoint**: User Story 1 is fully functional and independently
testable (quickstart.md "Validate precision selection & editing").

---

## Phase 4: User Story 2 - Personalize background, border, and shadow (Priority: P2)

**Goal**: With an element selected, independently toggle a background,
border, and shadow, each with its own color (and thickness for border/
shadow), persisted like any other property.

**Independent Test**: Select an element, enable its border with a custom
color and thickness, reload the project, confirm the border is unchanged.

### Implementation for User Story 2

- [X] T012 [P] [US2] Add background/border/shadow controls to
      `js/views/card-type-editor/element-properties-panel.html`: one toggle
      per effect, each revealing its color input (border/shadow also a
      thickness input) only while enabled
- [X] T013 [US2] Wire the new controls in
      `js/views/card-type-editor/element-properties-panel.mjs`: each
      toggle/color/thickness input calls `setElementStyle` (from T002) on
      the current element and `callbacks.onChange()` (the same `persist`
      callback already wired in T007) (depends on T012, T007)
- [X] T014 [US2] Implement `applyElementStyle(node, element)` in
      `js/views/card-type-editor/layout-element.mjs`: sets
      `background-color`/`border`/`box-shadow` inline styles from
      `getElementStyle(element)` (not `element.style` directly, so
      elements saved before this feature render with every effect off
      instead of throwing — FR-012), omitting any effect that's disabled
      (depends on T002)
- [X] T015 [US2] Call `applyElementStyle` from both initial element
      rendering and whenever the panel changes style, so style is visible
      immediately in both cases (depends on T013, T014)
- [X] T016 [US2] CSS in `css/styles.css`: layout for the style toggle
      groups and their conditional detail rows (depends on T012)

**Checkpoint**: User Stories 1 AND 2 both work independently
(quickstart.md "Validate background/border/shadow").

---

## Phase 5: User Story 3 - A visually coherent, intentionally designed app (Priority: P3)

**Goal**: Project list, card type list, and the editor share one
deliberately designed look — styled buttons, purposeful spacing, no large
unexplained empty regions.

**Independent Test**: View all three screens; every button shares one
consistent styled appearance; no screen has a large empty region or a
visually cramped cluster.

### Implementation for User Story 3

- [X] T017 [P] [US3] Restyle buttons app-wide in `css/styles.css` using the
      T001 custom properties (hover/active states, consistent padding and
      radius) so the project list, card type list, and editor all share one
      button appearance
- [X] T018 [P] [US3] Rebalance spacing on the project-list and
      card-type-list screens (list item padding, section gaps) using the
      T001 spacing scale, closing large empty regions without adding
      arbitrary margin
- [X] T019 [US3] Rebalance the editor's 3-column layout spacing/column
      widths so the canvas area doesn't leave a large empty gutter at a
      typical desktop window size (depends on T011)

**Checkpoint**: All three user stories are independently functional
(quickstart.md "Validate the visual pass").

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all stories

- [X] T020 [P] Run `node --test` and fix any failures
- [X] T021 Run the full manual quickstart.md pass (selection/panel sync,
      style toggles + persistence, visual consistency across all 3 screens)
- [X] T022 [P] Review every new/changed file against the constitution
      (small/focused files, HTML-first composition for the new panel,
      minimal/self-explanatory-only comments)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational; builds on US1's
  panel (T007) and per-element rendering (T014 extends `layout-element.mjs`)
- **User Story 3 (Phase 5)**: T017/T018 only need Setup (T001) and touch
  screens outside the editor, so they could start in parallel with US1/US2
  if staffed; T019 depends on US1's editor grid (T011)
- **Polish (Phase 6)**: Depends on all three user stories

### Parallel Opportunities

- Foundational: T002, T003 in parallel
- US1: T005 and T006 in parallel (different files)
- US2: T012 can start as soon as T006 exists, in parallel with US1's
  remaining tasks
- US3: T017 and T018 in parallel; both can run alongside US1/US2 since they
  touch different screens
- Polish: T020 and T022 in parallel

---

## Parallel Example: User Story 1

```bash
Task: "Restructure card-type-editor.html into a 3-column layout"
Task: "Create element-properties-panel.html with precision fields"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: quickstart.md "Validate precision selection & editing"
5. Demo: precise, single-element editing replaces the old always-everything-editable canvas

### Incremental Delivery

1. Setup + Foundational → style model ready
2. Add US1 → validate → demo (MVP: precision selection/editing)
3. Add US2 → validate → demo (background/border/shadow)
4. Add US3 → validate → demo (app-wide visual consistency)
5. Polish → full quickstart.md pass

---

## Notes

- [P] tasks touch different files with no unmet dependencies
- Every file path above matches plan.md's Project Structure exactly
- Commit after each task or logical group
- Stop at each checkpoint to validate that story independently before continuing

## Implementation Findings (2026-10-12)

Two real bugs were caught and fixed during implementation, beyond what
`/speckit-analyze` flagged:

- **Shallow-clone bug in `cloneCardType`**: it already deep-copied each
  element's `id`, but spread `style` by reference. Duplicating a project
  would have let editing one copy's element style silently mutate the
  original's — a regression of Slice 1's SC-002 (project isolation). Fixed
  by deep-cloning `style` via `structuredClone(getElementStyle(e))` in
  `js/models/card-type.mjs`.
- **`[hidden]` attribute overridden by author CSS**: `.element-properties-fields
  { display: flex }` has equal specificity to the browser's built-in
  `[hidden] { display: none }` rule, and author styles win equal-specificity
  ties over the user-agent stylesheet — so setting `.hidden = true` on the
  panel didn't actually hide it. Fixed with an explicit
  `.element-properties-fields[hidden] { display: none; }` override in
  `css/styles.css`.

Both were caught by browser-driven verification (Playwright), not by
`node --test` or static review — confirming T021's manual pass is load-bearing,
not a formality.

Also verified: clicking a point where two elements overlap selects and
manipulates whichever is topmost in DOM order — expected behavior for a
layered canvas, not a defect (a test script against this feature briefly
mistook it for one).
