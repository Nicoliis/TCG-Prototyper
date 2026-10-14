# Implementation Plan: Card Schema vs. Design, Typed Properties, Card Editor

**Branch**: `007-card-schema-and-editing` | **Date**: 2026-10-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-card-schema-and-editing/spec.md`

## Summary

Give every property a **type** (`line`, `text`, `integer`, `decimal`), add a
built-in, read-only, auto-incrementing **ID** to every card type, and add an
**Edit card** screen (one rendered card + typed inputs, Prev/Next/go-to-ID).
The card type editor already has a "Properties" tab plus design tabs; they
are regrouped under a top-level **Properties | Design** switch so schema and
layout are visibly separate (Properties: ID row + typed property rows;
Design: Size, Add Element, Elements).

Approach: purely additive data changes with lazy normalization on load
(missing `type` → `line`; cards without a `number` are numbered by current
order; `nextCardNumber` derived from the highest number). The ID is a
*virtual* property exposed by one accessor (`getSchema(cardType)` = ID +
stored properties) rather than a stored entry, so existing exports, clones,
CSV mapping and deck references keep working. The card's uuid `id` stays the
internal reference used by decks; the user-facing ID is `card.number`.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022+), native ES modules — unchanged.

**Primary Dependencies**: None.

**Storage**: Unchanged `StorageAdapter` contract; card types are saved whole
via `saveCardType`. New fields live inside the card type document
(`properties[].type`, `cards[].number`, `nextCardNumber`). Normalization is a
pure model function applied wherever a project is read (adapter `getProject`
and import), so no storage version bump is needed.

**Testing**: `node:test` for pure model logic (per-type value validation,
number assignment/never-reuse, normalization, type-change flagging, CSV
ID-key upsert, export/import round trip). Manual quickstart for browser
screens (tabs, Edit card navigation, live render).

**Target Platform**: Modern desktop browsers over a static HTTP server — unchanged.

**Project Type**: Single-page, client-only static web app.

**Performance Goals**: Edit-card field changes re-render in < 0.5 s (SC-005), met by re-running the existing preview renderer.

**Constraints**: No build step; must not regress slices 1–6; saved projects
and exports without `type`/`number` must still open and import. Bump the
`?v=` cache-busting suffix in every commit that changes served assets
(currently `?v=26`).

**Scale/Scope**: Single local user; hundreds of cards per card type.

## Constitution Check

| Principle | Check | Result |
|---|---|---|
| I. Vanilla Web Stack Only | Native text inputs and `<textarea>`; no dependencies. | PASS |
| II. Small, Focused Files | New `property-types.mjs`, `card-numbering.mjs`, and a separate `card-editor/` view (html + mjs + navigation helper); existing large files not extended. | PASS |
| III. HTML-First Visual Composition | Edit-card screen and per-type inputs are `<template>`s in `card-editor.html`; JS clones and fills. | PASS |
| IV. Self-Explanatory Code | No narration comments planned. | PASS |

Post-design re-check: PASS. Complexity Tracking not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/007-card-schema-and-editing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/ui-contracts.md
```

### Source Code (repository root)

```text
js/models/
├── property-types.mjs        # NEW: type list, validateValue
├── card-numbering.mjs        # NEW: getSchema, normalizeCardType, nextNumber, findCardByNumber
├── card-type.mjs             # createProperty gets type; reserve name "ID"; clone keeps numbers
├── card.mjs                  # addCard assigns number from cardType
└── print-selection.mjs       # cardValuesByName includes ID
js/csv/import-cards.mjs       # ID as matching key; new cards get numbers
js/views/card-type-editor/
├── card-properties-panel.mjs # type select, ID row, type-change warning
└── card-type-editor.html     # Properties | Design regrouping
js/views/card-editor/         # NEW: card-editor.html / .mjs / card-navigation.mjs
js/views/card-table/          # ID column, typed inputs, per-row Edit action
js/views/card-type-list/      # "Edit cards" button + route
js/views/csv-import/          # ID selectable as key
tests/unit/                   # new + extended tests
```

**Structure Decision**: Single static project; extend existing model/view
folders, one new view folder for the Edit card screen.
