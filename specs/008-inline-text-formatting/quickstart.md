# Quickstart: Validation Guide

Prerequisites: serve the repo statically (e.g. `npx serve .`); run unit tests with `node --test tests/unit`.

1. **Label**: add a label with `A **bold**, *italic* and __underlined__ word` → three words formatted, no markers visible.
2. **Template + card value**: text element template `**ATK** {atk}`; in Edit card give a rules property `**Flying** creatures gain *+1*` → both render formatted live as you type; the input shows raw markers.
3. **Nesting / mid-word**: `***both***`, `**__x__**`, `un**believ**able`.
4. **Multi-line**: a textarea value `**one` + new line + `two**` → both lines bold.
5. **Literal cases**: `2 * 3 * 4`, `**unfinished`, `\*literal\*`, `_x_` → shown as typed (last-but-one without backslashes).
6. **Table and CSV**: card table shows raw markers; CSV cell `**Flying**` imports unchanged and displays bold on the card.
7. **Print**: open the print preview → formatting matches the editor.
8. **Text-fit**: set overflow to shrink/squash on a formatted text → still fits.
9. **Existing projects**: texts without markers look identical to before.
10. **Export/import** a project → marker text unchanged.
