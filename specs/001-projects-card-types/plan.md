# Implementation Plan: Projects + Card Types (core)

**Branch**: `001-projects-card-types` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-projects-card-types/spec.md`

## Summary

Let a designer create/duplicate/delete independent projects, and within a
project define card types — named properties plus a freeform (x/y/width/height)
layout of text displays, image displays, static labels, and static
images/icons — then preview a card type with sample values. Built as a
static, vanilla HTML/CSS/JS single-page app with no build step; all
persistence goes through one storage abstraction so the backing store (e.g.
IndexedDB today) can be swapped by re-implementing that abstraction alone.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022+), native ES modules —
no transpilation.

**Primary Dependencies**: None. No UI framework, no bundler, no package
manager dependency, per constitution Principle I.

**Storage**: Browser-based persistent storage (IndexedDB), accessed only
through a storage abstraction (`js/storage/storage-adapter.mjs` contract +
swappable adapter implementation). See [research.md](./research.md).

**Testing**: Node's built-in `node:test` + `assert` for pure-logic modules
(storage adapter contract, template substitution, validation); a manual
browser quickstart scenario (see [quickstart.md](./quickstart.md)) for
visual/UI verification, since no test framework dependency is introduced.

**Target Platform**: Modern desktop browsers (latest Chrome/Firefox/Edge),
served as static files over a local HTTP server (not opened via `file://`,
so `fetch()` of HTML fragments and ES modules work under the browser's
same-origin rules).

**Project Type**: Single-page, client-only static web application.

**Performance Goals**: Layout edits reflect in the preview within one
interaction frame (no perceptible lag at the scale of a single prototype's
worth of card types).

**Constraints**: No build step; fully offline-capable once loaded (no
required network calls except user-supplied image URLs); no backend/server
component in this slice.

**Scale/Scope**: Single local user; tens of projects, each with up to a few
dozen card types — well within IndexedDB's capacity.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Vanilla Web Stack Only | No framework, bundler, or transpiler introduced; native ES modules and `fetch` are browser features, not tooling. | PASS |
| II. Small, Focused Files | Project structure below gives each JS file one responsibility (one model, one view, one adapter); CSS is consolidated per the constitution's CSS exemption. | PASS |
| III. HTML-First Visual Composition | Every view (project list, card type editor, layout canvas, preview) is authored as an `.html` fragment cloned via `<template>`; JS only binds data into existing markup. | PASS |
| IV. Self-Explanatory Code, Minimal Comments | No design decision here requires narration; enforced during implementation/review, not architecture. | PASS (carried forward to tasks/implement) |

No violations. Complexity Tracking table is not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/001-projects-card-types/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── storage-adapter.md
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
index.html                        # App shell: nav + mount points, loads app.mjs

css/
└── styles.css                     # Single consolidated stylesheet (CSS exempt from file-size rule)

js/
├── app.mjs                         # Boot: wires router/views together
├── storage/
│   ├── storage-adapter.mjs         # Abstract contract all adapters must satisfy
│   └── indexeddb-adapter.mjs       # Default concrete implementation
├── models/
│   ├── project.mjs                 # Project shape + validation (FR-001..007, FR-018)
│   └── card-type.mjs                # CardType/Property/Display/Label/Icon shape + validation
├── templating/
│   └── substitute.mjs               # `{token}` substitution used by text & image displays
└── views/
    ├── project-list/
    │   ├── project-list.html       # Fragment: list + create/duplicate/rename/delete controls
    │   └── project-list.mjs         # Behavior: binds model to fragment
    ├── card-type-list/
    │   ├── card-type-list.html
    │   └── card-type-list.mjs
    └── card-type-editor/
        ├── card-type-editor.html   # Fragment: property list, layout canvas, sample-value form
        └── card-type-editor.mjs     # Behavior: layout editing, preview rendering

tests/
└── unit/
    ├── storage-adapter.contract.test.mjs  # Same contract test suite run against each adapter
    ├── card-type-model.test.mjs
    └── substitute.test.mjs
```

**Structure Decision**: Single static-site project at the repo root (no
`src/`, no separate frontend/backend split — there is no backend). Views
are grouped by feature under `js/views/`, each pairing one `.html` fragment
with one small `.mjs` behavior file, matching Principle III and Principle II.
All storage access is funneled through `js/storage/storage-adapter.mjs`;
swapping persistence means adding a new adapter file and changing one
wiring line in `app.mjs`, never touching `models/` or `views/`.

## Complexity Tracking

Not applicable — no constitution violations.
