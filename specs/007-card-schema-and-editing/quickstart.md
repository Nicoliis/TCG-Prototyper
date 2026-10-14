# Quickstart: Validation Guide

Prerequisites: serve the repo statically (e.g. `npx serve .`); run unit tests with `node --test tests/unit`.

1. **Typed properties**: open a card type, Properties switch; add one property per type; the ID row is locked and first.
2. **Automatic IDs**: in the card table add 3 cards (IDs 1, 2, 3); delete 3, add one → ID 4.
3. **Validation**: in Edit card type `3.5` in an integer field → rejected with a message, value unchanged; `2.75` in a decimal field is accepted; multi-line text in a textarea renders with line breaks.
4. **Edit card navigation**: "Edit cards" opens the first card; edit a field and watch the render update; Next/Prev; type an ID; an unknown ID shows a message; boundaries are disabled.
5. **Row entry**: click Edit on card table row 2 → opens card 2.
6. **Type change**: put `abc` in a one-line property, change it to integer → warning, value kept and flagged.
7. **CSV**: import with ID as key: matching rows update, others get new IDs.
8. **Migration**: open a project saved before this feature: properties are one line, cards numbered 1..n.
9. **Export/import** a project: types and IDs preserved.
