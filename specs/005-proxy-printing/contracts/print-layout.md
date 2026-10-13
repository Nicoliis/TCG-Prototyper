# Contract: Print Layout and Selection (internal modules)

No storage-adapter changes in this slice.

## `js/models/sheet-layout.mjs`

| Function | Behavior |
|---|---|
| `PAPER_SIZES` | `{ a4, letter }` with `label`, `widthPx`, `heightPx`, `pageSize` (CSS `@page` size string) |
| `PAGE_MARGIN_PX` | `24` |
| `defaultSheetSettings(locale)` | `{ paper, spacingInches: 0.1, cutGuides: false }`; paper is `letter` for `en-US`, `en-CA`, `es-MX`, else `a4` |
| `validateSheetSettings(raw, locale)` | Returns a clean settings object; invalid or missing fields fall back to defaults; never throws |
| `layoutSheets(items, settings)` | `items`: `[{ cardType: { id, width, height }, card: { id }, count }]`. Returns `LayoutResult` (see data-model.md) |

**`layoutSheets` rules**
1. Content area = page size minus `PAGE_MARGIN_PX` on each side. Spacing = `spacingInches * 96` px between cards horizontally and between rows.
2. Cards are expanded to `count` placements each, in item order (no reordering).
3. Scale per card = `min(1, contentW / width, contentH / height)`; scaled size is `width*scale` x `height*scale`.
4. Place left to right; if the next card does not fit in the remaining row width and the row is non-empty, start a new row below the tallest card of the row plus spacing; if the new row does not fit in the content height, start a new page.
5. Placements never overlap and never exceed the content area.
6. Empty items return `{ pages: [], scaledCount: 0, totalCards: 0 }`.

## `js/models/print-selection.mjs`

| Function | Behavior |
|---|---|
| `selectionFromDeck(deck)` | `{ entries }` with copies of the deck's entries (the deck is not referenced afterwards) |
| `resolveSelection(project, selection)` | `[{ cardType, card, count }]`, skipping cards that no longer exist |
| `cardValuesByName(cardType, card)` | `{ [propertyName]: value }` with `""` for blank values, as `substitute` expects |

Adding cards, changing copies and totals reuse `addCardToDeck`, `setEntryCount` and `deckTotals` from `js/models/deck.mjs` on the selection object.

## `js/storage/sheet-settings-store.mjs`

| Function | Behavior |
|---|---|
| `loadSheetSettings()` | Reads `localStorage`, validates via `validateSheetSettings`; defaults on any failure |
| `saveSheetSettings(settings)` | Writes JSON; silently ignores storage errors |

## UI contract

- **Print screen** `mountPrintScreen(root, storage, projectId, onBack)`: card picker (all project cards, with add), deck `<select>` + "Load deck" (replaces the selection), selection list with copy inputs and remove buttons, paper select (A4/Letter), spacing input, cut-guides checkbox, live preview, **Print** button (disabled with a message when the selection is empty).
- **Print output**: only the page elements; the app header, controls and preview chrome are hidden by `@media print`.
