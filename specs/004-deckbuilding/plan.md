# Implementation Plan: Deckbuilding

**Branch**: `004-deckbuilding` | **Date**: 2026-10-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-deckbuilding/spec.md`

## Summary

Add a per-project Decks section. A project gets a `decks[]` list; each deck
has a unique name and entries `{ cardId, count }` referring to cards that
already live inside the project's card types. A deck list screen creates,
renames and deletes decks; a deck editor screen lists a deck's entries with
editable copy counts and totals, and offers the project's cards (filterable
by card type and text) to add. Decks reference cards by id, so the same card
can be in many decks with independent counts. Integrity (FR-010) is enforced
in storage: every card-type save or delete prunes deck entries whose card
no longer exists. Project duplication copies decks, remapped to the copy's
new card ids.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022+), native ES modules — unchanged.

**Primary Dependencies**: None.

**Storage**: Existing IndexedDB adapter. Decks nest in the project record (`project.decks`), so no schema bump. The storage contract gains two methods, `saveDeck` and `deleteDeck`; all adapters (IndexedDB, in-memory, array-store) implement them via shared pure functions.

**Testing**: `node:test` for the pure deck model (validation, counts, totals, pruning, duplication remap, filtering) and the storage contract (decks round-trip, pruning on card/card-type deletion, duplicate remap); manual quickstart for the screens. Node is not currently installed on the dev machine, so unit tests must be run once it is.

**Target Platform**: Modern desktop browsers over a static HTTP server — unchanged.

**Project Type**: Single-page, client-only static web app.

**Performance Goals**: Deck editing and filtering feel instant for projects of a few thousand cards; one storage write per edit.

**Constraints**: No build step. Must not regress Slices 1–3. Existing stored projects have no `decks` field and must keep loading (read as `[]`).

**Scale/Scope**: Single local user; a handful of decks per project, up to a few thousand cards.

**Delivery conventions (from the user)**: small incremental commits that each leave the app loadable for git auto-deploy; bump the `?v=` cache-busting suffix whenever a commit changes served scripts.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Vanilla Web Stack Only | Native elements only; no dependency. | PASS |
| II. Small, Focused Files | Deck model, deck list view and deck editor view are separate files; the candidate-card filter lives in the model, not the view. | PASS |
| III. HTML-First Visual Composition | Both screens are `.html` fragments with `<template>` rows; JS clones and fills values. | PASS |
| IV. Self-Explanatory Code, Minimal Comments | No narration comments planned. | PASS |

Post-design re-check: PASS. Complexity Tracking not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/004-deckbuilding/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── storage-adapter-delta.md
└── tasks.md              # /speckit-tasks — not created here
```

### Source Code (repository root)

```text
js/
├── models/
│   ├── deck.mjs                   # NEW: validateDeckName, createDeck, upsertDeck, removeDeck, setEntryCount, addCardToDeck, deckTotals, pruneDecks, filterCards, cloneDecksForCards
│   ├── card-type.mjs              # cloneCardType gains optional cardIdMap out-param
│   └── project.mjs                # cloneProjectForDuplicate copies decks with remapped card ids
├── storage/
│   ├── storage-adapter.mjs        # + saveDeck, deleteDeck
│   └── indexeddb-adapter.mjs      # + saveDeck, deleteDeck; saveCardType/deleteCardType prune decks
└── views/
    ├── card-type-list/            # + "Decks" button
    ├── deck-list/
    │   ├── deck-list.html         # NEW
    │   └── deck-list.mjs          # NEW: create/rename/delete decks, open editor
    └── deck-editor/
        ├── deck-editor.html       # NEW: entries table, totals, candidate list, type filter, text search
        └── deck-editor.mjs        # NEW

css/styles.css                      # + deck screens

tests/
├── support/
│   ├── in-memory-adapter.mjs       # + saveDeck, deleteDeck, pruning
│   └── array-store-adapter.mjs     # + saveDeck, deleteDeck, pruning
└── unit/
    ├── deck-model.test.mjs         # NEW
    └── storage-adapter.contract.test.mjs   # + decks cases
```

**Structure Decision**: Same per-view `.html` + `.mjs` pairing as earlier
slices. All deck rules are pure functions in `js/models/deck.mjs` so the
three storage adapters stay thin and unit tests need no browser.

## Complexity Tracking

Not applicable — no constitution violations.
