# Quickstart: Card Editor Precision & Visual Polish

## Prerequisites

Same as Slice 1: a static file server over `http://` (not `file://`), and
Node for `node --test`.

## Run the unit tests

```sh
node --test
```

Expected: all existing tests still pass, plus new ones covering
`ElementStyle` defaults and validation.

## Validate precision selection & editing

1. Open a card type with at least two layout elements (reuse one from
   Slice 1's quickstart, or create a fresh one).
2. **Click one element.** *Expect*: only that element shows a selection
   outline and handles; the properties panel shows its x, y, width,
   height, rotation, and content with current values (FR-001, FR-002,
   SC-002).
3. **Type a new x value into the panel.** *Expect*: the element moves on
   the canvas to exactly that x (FR-003, SC-001).
4. **Drag the element on the canvas.** *Expect*: the panel's x/y fields
   update to match (FR-004).
5. **Click a second element.** *Expect*: the panel now shows only the
   second element's values; the first element's handles disappear
   (FR-005).
6. **Click empty canvas space.** *Expect*: nothing is selected, the panel
   shows its empty state, and every element renders its real value with
   no handles visible anywhere (FR-006).

## Validate background/border/shadow

1. Select an element. Enable its background and pick a color. *Expect*:
   the element immediately shows that background (US2.1).
2. Enable its border, pick a color and a thickness. *Expect*: a border of
   that color/thickness appears (US2.2).
3. Enable its shadow, pick a color and thickness. *Expect*: a drop shadow
   appears (US2.3).
4. Turn the border back off. *Expect*: the border disappears but the
   background and shadow remain (FR-007).
5. **Reload the browser.** *Expect*: the element's background/border/
   shadow settings are exactly as left (FR-011, SC-003).
6. Open an element created before this feature (or any Slice-1-era card
   type). *Expect*: it renders with no background/border/shadow, i.e.
   unchanged from before (FR-012, Edge Cases).

## Validate the visual pass

1. Visit the project list, the card type list, and the card type editor.
   *Expect*: buttons look the same deliberate way on all three screens,
   not like unstyled default browser buttons (SC-004).
2. At a typical desktop window size, check each screen has no single
   empty region bigger than roughly a third of the visible area, and every
   control is reachable without scrolling (SC-005).
3. Confirm the old Edit/See toggle buttons are gone from the editor
   (superseded by selection — see Clarifications in spec.md).
