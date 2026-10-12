# Implementation Plan: Card Editor Precision & Visual Polish

**Branch**: `002-card-editor-polish` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-card-editor-polish/spec.md`

## Summary

Replace the editor's "every element is always editable at once" canvas with
single-element selection: clicking an element selects only it, shows its
exact x/y/width/height/rotation/content in a new properties panel for
precise typed edits, and shows selection handles only on that one element.
Deselecting (click empty canvas) returns to a clean, real-values preview —
replacing the old Edit/See toggle entirely. Elements gain an optional,
independently toggleable background/border/shadow (color + thickness).
Finally, a visual-consistency pass (spacing scale, button/control styling)
applies across all three screens (project list, card type list, editor).

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022+), native ES modules — unchanged from Slice 1.

**Primary Dependencies**: None. Color pickers use the browser-native
`<input type="color">`; no picker library introduced.

**Storage**: Unchanged IndexedDB adapter and `storage-adapter.mjs` contract.
The per-element `style` block is additional nested data on the existing
`CardType.elements[]` shape — no contract method changes.

**Testing**: `node:test` unit tests extended for the new style
default/validation model functions; manual quickstart for the
selection/panel/style UI and the visual-consistency pass (DOM-interaction
and visual judgment aren't unit-testable).

**Target Platform**: Unchanged — modern desktop browsers, static HTTP server.

**Project Type**: Unchanged — single-page, client-only static web app.

**Performance Goals**: Properties-panel edits and selection changes reflect
on the canvas within one interaction frame (no perceptible lag at this
app's scale).

**Constraints**: No build step; must not regress Slice 1 behavior (project
isolation, persistence, card type CRUD, CSV-independent property/display
editing).

**Scale/Scope**: Unchanged — single local user, small numbers of
projects/card types/elements.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Vanilla Web Stack Only | Native `<input type="color">`/`<input type="number">`; no new dependency. | PASS |
| II. Small, Focused Files | New `element-properties-panel.mjs`/`.html` split out from `card-type-editor.mjs` so each file keeps one job (orchestration vs. per-element rendering vs. the selection panel). | PASS |
| III. HTML-First Visual Composition | The new properties panel is authored as an `.html` `<template>` fragment, mounted once and only its field *values* are updated by JS — no `createElement`/`innerHTML` structure-building. | PASS |
| IV. Self-Explanatory Code, Minimal Comments | No new narration-only comments planned. | PASS |

No violations. Complexity Tracking table is not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/002-card-editor-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   └── storage-adapter-delta.md
└── tasks.md              # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
js/
├── models/
│   └── card-type.mjs                       # + style defaults/validation, setElementStyle()
└── views/
    └── card-type-editor/
        ├── card-type-editor.html            # 3-column layout; element template simplified (no inline inputs); mode-toggle markup removed
        ├── card-type-editor.mjs             # + selection state; wires the new panel; mode-toggle code removed
        ├── layout-element.mjs               # + click-to-select, selection-only handle visibility, style application; edit/see dual-view removed (canvas always shows real values)
        ├── element-properties-panel.html    # NEW: precision fields (x/y/width/height/rotation/content) + background/border/shadow toggles
        └── element-properties-panel.mjs     # NEW: binds the panel once; setElement(element)/clear()

css/styles.css                                # + spacing/color custom properties, button/control restyle, 3-column editor grid, selection outline, project-list/card-type-list spacing pass
```

**Structure Decision**: No new top-level directories. The properties panel
follows the existing per-view pairing convention (one `.html` fragment +
one small `.mjs` behavior file). `layout-element.mjs` absorbs selection and
style-application concerns since they're intrinsically about rendering one
element — splitting further would fragment one cohesive concept rather
than separate unrelated ones.

## Complexity Tracking

Not applicable — no constitution violations.
