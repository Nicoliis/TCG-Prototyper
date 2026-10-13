# Quickstart: Proxy Printing — Validation Guide

## Prerequisites

- Node 20+ for unit tests (not currently installed on the dev machine) and any static HTTP server from the repo root, e.g. `python -m http.server 8080`, then open `http://localhost:8080`.
- A project with two card types of different sizes (e.g. 240x336 and 336x240), several cards (include images and blank values), and a deck with counts 3 and 2 (Slice 4).
- When printing, leave the browser dialog's scale at 100% / Default and margins at Default or None.

## 1. Automated checks

```text
node --test tests/unit
```

Expected: all pass, including `sheet-layout` and `print-selection`. See [contracts/print-layout.md](./contracts/print-layout.md) and [data-model.md](./data-model.md).

## 2. Manual: pick cards and print (User Story 1)

1. Project → **Print**. With nothing picked, expect the Print button disabled and a "pick cards first" message.
2. Pick two cards; set one to 3 copies. Expect 4 cards in the preview, each at its own card type's size, with correct values.
3. Compare a previewed card with the card type editor canvas: same layout, text fit, styles, images; no blue editor borders or handles.
4. Remove a card; expect it to leave the preview. Enter `-1`, `1.5`, blank copies; expect each refused with the old value kept.
5. Click **Print**. In the print preview of the browser, expect only card pages (no app header, buttons or controls).
6. Measure a printed (or print-previewed at 100%) 240x336 card: expect 2.5 x 3.5 in.

## 3. Manual: deck printing (User Story 2)

1. Choose the deck (counts 3 and 2) → **Load deck**. Expect 5 cards in the preview.
2. Raise one count by 1 in the selection; expect 6 in the preview. Open the deck in Decks; expect its counts unchanged.
3. Load an empty deck; expect a message that it has no cards and Print stays disabled.

## 4. Manual: layout (User Story 3)

1. Switch A4 / Letter; expect the preview to re-flow and the browser print page size to follow.
2. Toggle cut guides; expect marks around each card in the preview and the print.
3. Change spacing to 0 and 0.5 in; expect card gaps to change; no overlaps and no card past a page edge.
4. Reload the app and reopen Print; expect your last paper, spacing and guides choice.

## 5. Edge cases

- A card type larger than the page (e.g. 1200x1600): expect it scaled to fit and a notice in the preview.
- 200+ copies: expect multiple pages and no lag.
- Delete a card in the Cards table, then open Print: it is not offered and not in any new selection.
- A card image with a bad URL shows the broken-image placeholder in the preview.
- Browser with storage blocked: Print still works with default layout choices.
