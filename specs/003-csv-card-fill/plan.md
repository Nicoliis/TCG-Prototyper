# Implementation Plan: CSV Card Fill

**Branch**: `003-csv-card-fill` | **Date**: 2026-10-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-csv-card-fill/spec.md`

## Summary

Add real card data. A card type gets a `cards[]` list (each card holds a
value per property). A new **card table** view lets the user add, edit and
delete cards inline. A separate **CSV import** view accepts an uploaded file
or pasted text, maps columns to properties by name, lets the user pick a
matching-key property, and upserts cards (update on key match, otherwise
create), then reports ignored columns, unfilled properties and created vs.
updated counts. Cards persist as nested data on the existing card type, so
the storage contract gains no new methods.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022+), native ES modules — unchanged.

**Primary Dependencies**: None. CSV parsing is a small hand-written RFC-4180-style parser (no library).

**Storage**: Existing IndexedDB adapter / `storage-adapter.mjs` contract, unchanged. Cards live in `CardType.cards[]` and persist through `saveCardType`.

**Testing**: `node:test` unit tests for the pure modules (CSV parser, card model, import/upsert logic) and the existing storage contract test extended to round-trip cards; manual quickstart for the table and import UI.

**Target Platform**: Modern desktop browsers over a static HTTP server — unchanged.

**Project Type**: Single-page, client-only static web app.

**Performance Goals**: Importing a few thousand rows completes without perceptible lag; one IndexedDB write per edit or import.

**Constraints**: No build step. Must not regress Slices 1–2. Existing stored card types have no `cards` field and must keep loading (treated as `[]`).

**Scale/Scope**: Single local user; up to low thousands of cards per card type.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Vanilla Web Stack Only | Native `FileReader`/`File.text()`, `<table>`, `<input>`; hand-written CSV parser; no dependency. | PASS |
| II. Small, Focused Files | Parser, card model, import logic, table view and import view are separate small files. | PASS |
| III. HTML-First Visual Composition | Table and import screens are `.html` fragments with `<template>` rows/headers; JS clones templates and sets values. Column headers/cells come from cloning `<template>` elements, not `createElement` structure-building. | PASS |
| IV. Self-Explanatory Code, Minimal Comments | No narration comments planned. | PASS |

Post-design re-check: PASS — no violations. Complexity Tracking not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/003-csv-card-fill/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── csv-import.md
│   └── storage-adapter-delta.md
└── tasks.md              # /speckit-tasks — not created here
```

### Source Code (repository root)

```text
js/
├── models/
│   ├── card-type.mjs              # + cards: [] default; removeProperty drops card values; cloneCardType remaps card values to new property ids
│   └── card.mjs                   # NEW: createCard, setCardValue, removeCard, getCardValue
├── csv/
│   ├── parse-csv.mjs              # NEW: text -> string[][] (quotes, escaped quotes, CRLF/LF, embedded newlines, BOM)
│   └── import-cards.mjs           # NEW: planImport/applyImport — column mapping, key upsert, ImportReport
└── views/
    ├── card-type-list/            # + "Cards" and "Import CSV" buttons per card type
    ├── card-table/
    │   ├── card-table.html        # NEW: table shell + header/row templates
    │   └── card-table.mjs         # NEW: render rows, add/edit/delete, persist via saveCardType
    └── csv-import/
        ├── csv-import.html        # NEW: file input, paste textarea, key select, report panel
        └── csv-import.mjs         # NEW: read input, run import, show report, link back to table

css/styles.css                      # + table and import-screen styling
tests/unit/
├── parse-csv.test.mjs              # NEW
├── card-model.test.mjs             # NEW
├── import-cards.test.mjs           # NEW
└── storage-adapter.contract.test.mjs  # + cards round-trip
```

**Structure Decision**: No new top-level directories beyond `js/csv/` for the
two pure, UI-free modules. Views follow the existing one-`.html`-plus-one-`.mjs`
pairing. Import logic is kept out of the view so it is unit-testable in Node.

## Complexity Tracking

Not applicable — no constitution violations.
