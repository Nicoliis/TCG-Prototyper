# Data Model: Proxy Printing

No stored cards, decks, card types or projects change in this slice.

## SheetSettings (new, persisted per browser)

Stored in `localStorage` under `cardgame-prototyper.sheetSettings`.

| Field | Type | Rules |
|---|---|---|
| `paper` | `"a4"` \| `"letter"` | Anything else falls back to the default |
| `spacingInches` | number | 0 ≤ value ≤ 0.5; invalid falls back to 0.1 |
| `cutGuides` | boolean | Default `false` |

**Default**: `paper` = `"letter"` for locales `en-US`, `en-CA`, `es-MX`, else `"a4"`; `spacingInches` = 0.1; `cutGuides` = false.

## PaperSize (constant)

| Key | Label | Width x Height (CSS px at 96 dpi) | `@page` size |
|---|---|---|---|
| `a4` | A4 | 793.7 x 1122.5 | `210mm 297mm` |
| `letter` | US Letter | 816 x 1056 | `8.5in 11in` |

Page margin is a fixed 24 px (0.25 in) on all sides.

## PrintSelection (new, temporary, in memory)

Same shape as a deck so deck functions are reused:

```text
{ entries: [{ cardId: string, count: integer >= 1 }] }
```

- Built by adding cards (count 1, or +1 if present) and/or loading a deck (copy of its entries).
- Never saved; discarded when leaving the print screen.
- Entries whose card no longer exists are skipped when resolving.

## PrintItem (derived)

`{ cardType, card, count }` — a resolved selection entry; `count` copies are placed.

## LayoutResult (derived by `layoutSheets`)

```text
{
  pages: [ { placements: [ { cardId, cardTypeId, x, y, width, height, scale } ] } ],
  scaledCount: number,        // placements with scale < 1
  totalCards: number          // sum of counts placed
}
```

`x`, `y`, `width`, `height` are px on the page (already scaled); `scale` is 1 unless the card was larger than the page content area.

## Relationships

PrintSelection → Cards (read-only, by id) → CardTypes (for layout and size). Deck → PrintSelection (copy of entries at load time). Nothing flows back into decks or cards.
