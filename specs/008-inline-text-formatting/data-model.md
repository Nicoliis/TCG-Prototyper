# Data Model: Inline Text Formatting

No stored data changes. Text sources stay plain strings.

## Text sources (unchanged)
- Text element `template` (string, may contain `{property}` tokens)
- Label element `text` (string)
- Card `values[propertyId]` (string)

Raw markers are stored exactly as typed; export/import and CSV import/export carry them unchanged.

## Segment (in-memory, display only)
| Field | Type | Notes |
|---|---|---|
| text | string | Visible characters (markers and escape backslashes removed) |
| bold | boolean | |
| italic | boolean | |
| underline | boolean | |

## Rules
- `parseFormatted("")` returns `[]`.
- Input with no markers returns one plain segment with the input unchanged (FR-008).
- Concatenating all segment texts never drops a character other than a consumed marker or an escape backslash (FR-007).
- Parsing never throws for any string.
