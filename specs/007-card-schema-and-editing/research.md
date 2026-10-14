# Research: Card Schema vs. Design, Typed Properties, Card Editor

## 1. Where does the ID live?
- **Decision**: `card.number` (positive integer) plus `cardType.nextCardNumber`; the ID is exposed as a *virtual* first property via `getSchema(cardType)`.
- **Rationale**: Keeps the uuid `card.id` as the stable internal key decks and exports use; a virtual property cannot be deleted/renamed/retyped by construction and needs no change to `properties[]`.
- **Alternatives**: Replace uuid with the number (breaks deck references); store ID as a real property (needs special-casing wherever it could be removed or edited).

## 2. Never reusing IDs
- **Decision**: Persist `nextCardNumber`; on load use `max(stored, highest number + 1, 1)`.
- **Rationale**: Highest+1 alone would reuse a deleted last card's number (spec: delete 3, next is 4).

## 3. Migration
- **Decision**: Lazy, idempotent, pure `normalizeCardType` on read and on import: missing `type` → `line`; cards lacking `number` numbered by array order; counter initialised.
- **Rationale**: No storage versioning exists; this also covers old exports.

## 4. Typed values
- **Decision**: Values stay strings in `card.values` (CSV and templates are text). `validateValue(type, text)`: integer `^-?\d+$`; decimal `^-?(\d+([.,]\d+)?|[.,]\d+)$`; empty always valid. Inputs: text input (line), `<textarea>` (text), text input with `inputmode` and validation message for numbers.
- **Alternatives**: Native `type=number` (hides invalid text, locale quirks); storing JS numbers (breaks CSV round trip and blanks).

## 5. Type change with unfit values
- **Decision**: `confirm` warning stating affected count, change type, keep values, mark invalid ones (`aria-invalid` styling) until fixed. Validity is computed, never stored (FR-007/016).

## 6. Separating properties from design
- **Decision**: Keep one editor screen; add a top-level **Properties | Design** switch wrapping the existing tab sets. Properties holds the property definitions (now with ID row and type); Design holds Size, Add Element, Elements.
- **Rationale**: Clarified as separate tabs; the Properties tab already exists, so this is regrouping, not rebuilding.

## 7. Edit card rendering
- **Decision**: Reuse `renderPreview`, `applyTransform`, `applyElementStyle`, `applyDepth`, `applyTextFit` (as `render-card.mjs` does) at 1:1 scale; re-render on every input event.

## 8. CSV with ID key
- **Decision**: ID is a selectable key matching `card.number`; ID is never written from CSV; unmatched rows get the next number. Invalid numeric cells are imported and reported (consistent with keep-and-flag).
