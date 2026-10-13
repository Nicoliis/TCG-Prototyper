# Implementation Plan: Proxy Printing

**Branch**: `005-proxy-printing` | **Date**: 2026-10-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-proxy-printing/spec.md`

## Summary

Add a project-level **Print** screen. The user builds a temporary print
selection (cards picked one by one, or a deck loaded in one click, each with
a copy count), chooses A4 or US Letter, card spacing and optional cut guides,
sees a live page-by-page preview, and prints through the browser's print
dialog. Cards are drawn by a new read-only card renderer that reuses the
editor's element rendering (substitution, text fit, element styles) but none
of its editing chrome, at true size (96 px = 1 inch). A pure layout function
packs cards onto pages. The selection is a plain `{ entries }` list reusing
the deck model's add/count/total functions; only the layout choices persist,
in browser local storage. No stored cards, decks or storage-adapter methods
change.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022+), native ES modules — unchanged.

**Primary Dependencies**: None. Printing uses `window.print()` and an `@media print` stylesheet; paper size via a CSS `@page` rule.

**Storage**: Unchanged storage adapter and IndexedDB data. Sheet layout choices (paper, spacing, cut guides) are stored in `localStorage` under one key, read/written through try/catch since it can be unavailable; the print selection is not stored.

**Testing**: `node:test` for the pure modules (sheet layout/packing, layout-settings validation and defaults, selection-from-deck); manual quickstart for rendering fidelity, preview and actual printing (visual and browser-dialog behavior isn't unit-testable). Node isn't currently installed on the dev machine.

**Target Platform**: Modern desktop browsers over a static HTTP server — unchanged.

**Project Type**: Single-page, client-only static web app.

**Performance Goals**: Preview of a 40-card selection renders without perceptible lag; hundreds of cards still paginate and print.

**Constraints**: No build step; must not regress Slices 1–4. Printed cards must be visually identical to their on-screen rendering, minus editor chrome. Print output contains only the sheets.

**Scale/Scope**: Single local user; selections from 1 to a few hundred cards.

**Delivery conventions (from the user)**: small incremental commits that each leave the app loadable for git auto-deploy; bump the `?v=` suffix in every commit that changes served scripts or stylesheets (currently `?v=16`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Vanilla Web Stack Only | `window.print()`, CSS `@page`, `localStorage`; no dependency. | PASS |
| II. Small, Focused Files | Packing, settings, card renderer, sheet renderer and the screen are separate small files. | PASS |
| III. HTML-First Visual Composition | Screen and card/element/page markup live in `.html` `<template>`s; JS clones and fills values and sets positions. The one imperative piece is the `@page` size rule, set as the text of a `<style>` element declared in the HTML (CSS cannot take `@page` size from a variable). | PASS |
| IV. Self-Explanatory Code, Minimal Comments | No narration comments planned. | PASS |

Post-design re-check: PASS. Complexity Tracking not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/005-proxy-printing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── print-layout.md
└── tasks.md              # /speckit-tasks — not created here
```

### Source Code (repository root)

```text
js/
├── models/
│   ├── sheet-layout.mjs            # NEW: PAPER_SIZES, defaultSheetSettings, validateSheetSettings, layoutSheets
│   └── print-selection.mjs         # NEW: selectionFromDeck, resolveSelection (entries -> printable items, skipping missing cards), cardValuesByName
├── storage/
│   └── sheet-settings-store.mjs    # NEW: load/save sheet settings in localStorage (try/catch)
└── views/
    ├── card-type-list/             # + "Print" button (project level)
    └── print/
        ├── print-screen.html       # NEW: controls (card picker, deck select, selection list with copies, paper/spacing/guides) + preview mount
        ├── print-screen.mjs        # NEW: selection state, controls wiring, Print button
        ├── print-sheet.html        # NEW: page, card frame, cut-guide and per-kind element templates (no editing chrome)
        ├── render-card.mjs         # NEW: read-only card renderer (reuses substitute, applyTransform/applyElementStyle/renderPreview, applyTextFit)
        └── render-sheets.mjs       # NEW: lays out items and fills pages from templates

css/styles.css                      # + print screen styles, clean-card overrides, @media print rules

tests/unit/
├── sheet-layout.test.mjs           # NEW
└── print-selection.test.mjs        # NEW
```

**Structure Decision**: One new view folder (`js/views/print/`) with the
established `.html` + `.mjs` pairing. All decisions that can be wrong
(packing, scaling, validation) are in pure model functions so they are
unit-tested without a browser; the views only render.

## Complexity Tracking

Not applicable — no constitution violations.
