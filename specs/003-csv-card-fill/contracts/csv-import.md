# Contract: CSV Parsing and Import (internal modules)

## `parseCsv(text) -> string[][]` — `js/csv/parse-csv.mjs`

- Fields separated by `,`; rows by CRLF or LF.
- `"` starts a quoted field; inside, `""` is a literal quote, and commas/newlines are literal.
- A leading UTF-8 BOM is stripped; one trailing empty line is ignored.
- Rows may have differing lengths; missing trailing cells read as blank.
- Empty input returns `[]`.

## `importCards(cardType, csvRows, keyPropertyId) -> { cards, report }` — `js/csv/import-cards.mjs`

Pure function; does not persist. The caller saves the returned card type.

**Inputs**
- `cardType`: current card type (cards read as `cards ?? []`).
- `csvRows`: output of `parseCsv`; row 0 is the header row.
- `keyPropertyId`: id of one of `cardType.properties`.

**Rules** (spec FR-006…FR-011)
1. Header and property names compared with `trim().toLowerCase()`; first matching column per property wins; other columns are ignored.
2. For each data row: look up an existing card whose key-property value (normalized) equals the row's key-column value (normalized). Blank key or absent key column never matches. First existing card wins.
3. Match → overwrite only mapped properties on that card. No match → new card with mapped properties, others absent (blank).
4. Cards created during this import are not matched by later rows of the same import.

**Output**
- `cards`: the full resulting card list (existing order, updates in place, new cards appended).
- `report`: `{ created, updated, ignoredColumns, unfilledProperties }`.

## UI contracts

- **Card table** (`mountCardTable(root, storage, projectId, cardTypeId, onBack)`): one column per property, one row per card; Add row, edit cell (commit on `change`), delete row; each commit persists via `saveCardType`.
- **CSV import** (`mountCsvImport(root, storage, projectId, cardTypeId, onBack, onOpenTable)`): file input + paste textarea, key-property select (default first property), Import button; after import shows the report and a link to the card table.
