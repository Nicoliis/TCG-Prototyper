# Research: Proxy Printing

No `NEEDS CLARIFICATION` items remain. Decisions:

## 1. Printing mechanism

- **Decision**: Build a print-ready page layout in the app and call `window.print()`; an `@media print` stylesheet hides the app header, controls and preview chrome so only the pages print.
- **Rationale**: Matches the spec assumption (browser dialog, "save as PDF" works for free), needs no dependency, and keeps preview and print the same DOM.
- **Alternatives**: Generating a PDF in JS (needs a library — violates Principle I); printing from a popup window (blockers, loses styles).

## 2. Physical size

- **Decision**: True size at 96 CSS px per inch (clarified). A card of `width x height` px prints at exactly that size; CSS `px` is defined as 1/96 inch in print.
- **Rationale**: The editor's default 240x336 is already 2.5x3.5 in. No new per-card-type setting.
- **Caveat**: The user must leave the browser dialog's scale at 100%/Default; the quickstart says so.

## 3. Paper sizes

- **Decision**: A4 (210x297 mm) and US Letter (8.5x11 in) only (clarified), stored as CSS px at 96 dpi (A4 ≈ 793.7x1122.5, Letter 816x1056). Default: Letter when the browser locale is `en-US`, `en-CA` or `es-MX`, otherwise A4.
- **`@page`**: a `<style class="page-size-style">` in the screen's HTML gets its text set to `@page { size: <w>mm <h>mm; margin: 0 }`. This is the only imperative CSS and exists because `@page` size cannot read CSS variables.

## 4. Page margins and spacing

- **Decision**: A fixed 0.25 in (24 px) page margin (printer-safe default); user-adjustable card spacing (0–0.5 in, step 0.05, default 0.1 in) and a cut-guides toggle (default off). When cut guides are on, the effective spacing is at least 0.1 in so guides always fit between cards and never cover a neighbour; the spacing control keeps showing the chosen value.
- **Rationale**: Spec requires spacing and guides but not margins; fixed margin keeps the control surface small.

## 5. Layout / packing algorithm

- **Decision**: Row ("shelf") packing in reading order, one pure function `layoutSheets(items, settings)`: place left to right; wrap when the next card doesn't fit in the row width; start a new page when the next row doesn't fit in the page height. Each card is scaled down (never up) by `min(1, contentW/w, contentH/h)` when larger than the content area; the result reports how many were scaled.
- **Rationale**: Mixed card sizes are supported without overlap; for same-size cards it degenerates to a simple grid (2.5x3.5 in cards with 0.1 in spacing: 9 per page on A4, 6 on Letter, because Letter is 11 in tall and three 3.5 in rows plus margins and gaps need more; 9 per page on Letter at spacing 0). Optimal bin packing is unnecessary.
- **Alternatives**: Fixed grid by largest card (wastes paper with mixed sizes); first-fit-decreasing (reorders cards, confusing for the user).

## 6. Rendering a card read-only

- **Decision**: New `render-card.mjs` clones per-kind element markup from `print-sheet.html` templates (no delete/resize/rotate handles), then reuses the editor's exported `applyTransform`, `applyElementStyle`, `renderPreview` and `applyTextFit` so output matches the editor. Values come from `cardValuesByName(cardType, card)` mapped to property names (what `substitute` expects). A `.print-card` CSS scope removes the editor's tinted border/background on `.layout-element`; inline element styles still win.
- **Rationale**: Reuse guarantees visual fidelity (SC-003) and keeps one source of truth for text fitting and substitution. Text fit must run after the node is attached to the DOM, so rendering appends first, then fits.
- **Alternatives**: Re-implementing rendering (drifts from the editor); screenshotting to canvas (blurry, heavy).

## 7. Print selection

- **Decision**: The selection is `{ entries: [{ cardId, count }] }`, the same shape as a deck, so `addCardToDeck`, `setEntryCount`, `deckTotals` are reused for adding, copy validation and totals. `selectionFromDeck(deck)` copies a deck's entries; `resolveSelection(project, selection)` expands to `{ cardType, card, count }` and silently skips cards that no longer exist.
- **Rationale**: Identical semantics to Slice 4 (0 removes, whole numbers only) with no new validation; loading a deck copies, so edits never touch the deck (FR-004, FR-011).

## 8. Remembering layout choices

- **Decision**: `localStorage` key `cardgame-prototyper.sheetSettings`, JSON `{ paper, spacingInches, cutGuides }`, validated on read (invalid or missing → defaults), wrapped in try/catch so a blocked or full store never breaks printing.
- **Rationale**: Per-viewer convenience data that needs no project storage; avoids touching the storage adapter contract.

## 9. Empty selection and edge cases

- **Decision**: Print button disabled with an explanatory message when the resolved selection has zero cards. A card larger than the page is scaled down and a notice shows in the preview. Failing images render via the existing broken-image placeholder, so the problem is visible in the preview.

## 10. Entry point and cleanup

- **Decision**: A **Print** button on the card type list screen (project level), next to **Decks**. The print screen has a Back button to that list.

## 11. Delivery

- **Decision**: Small commits, `?v=` bump on every commit changing served scripts, pure-model files first (no UI impact), UI last.

## 12. Print timing

- **Decision**: The Print button waits (up to 5 seconds) for every preview image to load or fail over to the broken-image placeholder before calling `window.print()`.
- **Rationale**: `window.print()` snapshots the page as it is; printing instantly after a selection change could capture images still loading, which would make a printed card differ from its on-screen rendering.
