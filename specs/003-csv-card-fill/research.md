# Research: CSV Card Fill

No `NEEDS CLARIFICATION` items remained after the spec's clarification session; the decisions below record the technical choices.

## 1. Where cards are stored

- **Decision**: Nest `cards: []` inside each `CardType` within the existing project record.
- **Rationale**: `saveCardType` already persists a whole card type atomically; no new adapter methods, no IndexedDB schema bump (`DB_VERSION` stays 1), and the in-memory test adapter needs no change. Deleting a card type or project removes its cards for free. Matches the "unchanged storage contract" approach of Slice 2.
- **Alternatives**: A separate `cards` object store keyed by card type (needs a DB upgrade, new adapter methods, cascading deletes, duplicate-project plumbing) — rejected as unnecessary at this scale. Rewriting the whole project record per cell edit is acceptable for low-thousands of cards.

## 2. Card value keying

- **Decision**: `card.values` is an object keyed by **property id**; absent key = blank.
- **Rationale**: Renaming a property must not orphan data, so names are the wrong key. Blank-as-absent makes "any subset blank" (FR-013) the natural state.
- **Consequence**: `removeProperty` must delete that id from every card's values, and `cloneCardType` (used by project duplication) must remap old property ids to the freshly generated ones.
- **Alternatives**: Keying by property name (breaks on rename) — rejected.

## 3. CSV parsing

- **Decision**: Small hand-written state-machine parser: comma-separated, `"` quoting with `""` escape, quoted fields may contain commas/newlines, accepts CRLF/LF, strips a leading UTF-8 BOM, ignores a trailing empty line.
- **Rationale**: Constitution forbids dependencies; the required grammar is small and fully unit-testable.
- **Alternatives**: Naive `split(",")` (breaks on quotes) — rejected. A CDN library — violates Principle I.

## 4. Column ↔ property matching

- **Decision**: Normalize with `trim().toLowerCase()` on both header and property name; first matching column wins; later duplicates and non-matching columns are reported ignored.
- **Rationale**: Directly from FR-006/FR-007 and the duplicate-header edge case.

## 5. Upsert / key matching

- **Decision**: Build a `Map` from normalized key value → first existing card (in list order) before processing rows. A blank key, or absent key column, never matches. Cards created earlier in the same import are **not** added to the map, so repeated key values within one CSV each create a card.
- **Rationale**: Spec says "the first one found" among existing cards and blank never matches; a prebuilt map is O(n) instead of O(n·m).
- **Alternatives**: Adding newly created cards to the map (would merge duplicate rows within one file) — rejected; the spec only defines matching against existing cards.
- **Update semantics**: Only properties with a matched CSV column are overwritten, including overwriting with a blank CSV cell (the column exists, so the CSV is authoritative for it). Unmapped properties are untouched.

## 6. Import input

- **Decision**: Two inputs — `<input type="file" accept=".csv,text/csv">` read via `File.text()`, and a paste `<textarea>`. Pasted text wins if both are provided; the screen states which source was used. The user picks the key property from a `<select>` defaulting to the card type's first property, then confirms.
- **Rationale**: FR-005 requires both upload and paste; no preview/mapping UI is required since matching is by name.

## 7. Import report

- **Decision**: `importCards` returns `{ created, updated, ignoredColumns[], unfilledProperties[] }`; the view renders it. `unfilledProperties` = card-type properties with no matching CSV column.
- **Rationale**: Covers FR-009 and SC-003 with a pure, testable return value.

## 8. Table editing and persistence

- **Decision**: Inline `<input>` per cell; commit on `change`, saving via `saveCardType`. "Add card" appends an empty card row immediately; delete removes immediately, no confirmation (per spec assumption).
- **Rationale**: Minimal UI that satisfies US1; persistence on every commit satisfies FR-012.

## 9. Backward compatibility

- **Decision**: Read `cardType.cards ?? []` everywhere (via a `getCards` helper); lazily initialize on first write. Same pattern as `getElementStyle`/`getTextStyle` in Slice 2.
- **Rationale**: Existing stored card types have no `cards` field; no migration needed.

## 10. Testing

- **Decision**: Pure modules (`parse-csv`, `card`, `import-cards`) tested with `node:test`; storage contract test extended to round-trip cards; table/import UI verified manually per quickstart.
