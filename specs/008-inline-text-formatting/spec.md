# Feature Specification: Inline Text Formatting (Bold, Italic, Underline)

**Feature Branch**: `008-inline-text-formatting`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Allow bold, italic and underline formatting mid-text. Authored with markup syntax typed in the text (e.g. **bold**, *italic*, __underline__), no editor toolbar. Applies to text element templates, label elements, and card values (including values from Edit card, the card table and CSV import)."

## Clarifications

### Session 2026-10-14

- Q: Can one marker pair span multiple lines? → A: Yes; a pair may enclose line breaks and every enclosed line shows the formatting.
- Q: Do markers work inside a word? → A: Yes, anywhere (e.g. un**believ**able); only space-adjacent markers are ignored.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Format part of a text with markers (Priority: P1)

A designer wants a card's text to emphasise just a few words, for example
"**Flying** creatures gain *+1* attack" or a label like "__Rules__". They
type simple markers around the words: `**` for bold, `*` for italic and `__`
for underline. Everywhere that text is displayed on a card, the marked words
appear formatted and the markers themselves disappear.

**Why this priority**: This is the entire feature; it gives designers
mid-text emphasis without any extra editing controls.

**Independent Test**: Put `A **bold**, *italic* and __underlined__ word` into
a label or text element and confirm the card preview shows the three words
formatted and no marker characters.

**Acceptance Scenarios**:

1. **Given** a label with text `Hello **world**`, **When** the card is
   shown, **Then** "world" is bold and "Hello " is normal, with no `**`
   visible.
2. **Given** text `*soft* and __under__`, **When** shown, **Then** "soft"
   is italic and "under" is underlined.
3. **Given** text `***both***` or `**__both__**`, **When** shown, **Then**
   the words carry the combined formatting (nesting of different marker
   types is supported).
4. **Given** text with no markers, **When** shown, **Then** it looks
   exactly as before this feature.

---

### User Story 2 - Formatting in templates and in card values (Priority: P1)

Formatting works in both places text comes from: the **static text** written
in a text element template or label (e.g. `**ATK** {atk}`), and the **values
of cards** (e.g. a rules-text property whose value contains
`**Flying** creatures...`), whether typed in Edit card, in the card table,
or imported from CSV.

**Why this priority**: Designers need both fixed styling in the layout and
per-card emphasis in the data.

**Independent Test**: Create a text element with template `**ATK** {atk}` and
a card whose rules value contains `__Once per turn__`; confirm the card
shows "ATK" in bold with its value, and the rules with underlined words, in
the card type editor preview, Edit card, and print preview.

**Acceptance Scenarios**:

1. **Given** a template `**ATK** {atk}` and atk = 5, **When** shown,
   **Then** "ATK" is bold and "5" is normal.
2. **Given** a card value `Gain *+1* attack` typed in Edit card, **When** the
   rendered card updates, **Then** "+1" appears italic.
3. **Given** a CSV cell containing `**Flying**`, **When** imported, **Then**
   the stored value keeps the raw markers and the card displays "Flying"
   in bold.
4. **Given** a card value with markers, **When** viewed in the card table or
   an input field, **Then** the raw markers remain visible and editable
   (formatting appears only on the rendered card).

---

### User Story 3 - Show literal markers when wanted or malformed (Priority: P2)

A designer can still show a literal `*` or `__` (for example "5 * 3" or an
unfinished marker). A backslash before a marker character shows it literally
(`\*not italic\*`). Markers that are not properly closed are shown as typed
rather than hiding or breaking the text.

**Why this priority**: Prevents surprising results for ordinary text and
makes the feature safe to adopt in existing projects.

**Independent Test**: Show `2 * 3 = 6`, `**unfinished` and `\*literal\*` and
confirm they appear as plain text (the last without the backslashes).

**Acceptance Scenarios**:

1. **Given** text `**unfinished`, **When** shown, **Then** it appears
   exactly as typed, unformatted.
2. **Given** text `2 * 3 * 4`, **When** shown, **Then** it is not turned
   italic (a marker next to a space does not open or close formatting).
3. **Given** text `\*literal\*`, **When** shown, **Then** it shows
   `*literal*` with no italics.
4. **Given** an existing project whose texts contain no markers, **When**
   opened, **Then** nothing changes.

---

### Edge Cases

- Empty emphasis (`****`, `__ __`) shows as typed, not as formatting.
- A marker pair may span line breaks (e.g. in textarea values); every enclosed line
  shows the formatting. Markers also work in the middle of a word.
- Text-fit behaviour (shrink/squash/wrap) still works with formatted text.
- Image and icon elements: templates that build image locations are not
  formatted and markers in them are left untouched.
- Numeric property values never contain markers meaningfully; any markers
  typed there are displayed as typed.
- Characters that look like markup but are not formatting markers (angle
  brackets, ampersands) are shown literally and never interpreted as
  anything else.
- Formatted text works in the card type editor preview, the Edit card view
  and print output alike.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Text enclosed in `**` markers MUST display bold, in `*`
  markers italic, and in `__` markers underlined, with the markers
  themselves not shown; this works anywhere in a text, including mid-word,
  and a pair MAY span line breaks.
- **FR-002**: Different marker types MUST be combinable and nestable
  (e.g. bold inside italic, underlined bold).
- **FR-003**: Formatting MUST apply to text element templates, label
  elements, and to card values substituted into templates.
- **FR-004**: Stored values MUST keep the raw markers; formatting is applied
  only when a card is displayed. Input fields and the card table MUST show
  and edit the raw text.
- **FR-005**: CSV import MUST store cell text unchanged, including markers.
- **FR-006**: A marker preceded by a backslash MUST display literally
  without its backslash.
- **FR-007**: Unclosed, empty, or space-adjacent markers MUST be displayed as
  typed and MUST NOT alter or hide surrounding text.
- **FR-008**: Text without markers MUST render exactly as it did before.
- **FR-009**: Formatted text MUST display identically in the card type
  editor preview, the Edit card view, and print output.
- **FR-010**: Existing text-fit options MUST continue to work with formatted
  text.
- **FR-011**: Marker interpretation MUST NOT apply to image locations built
  from templates (image and icon elements).
- **FR-012**: No text typed by a user may be interpreted as anything other
  than the three formats (no other markup or scripting).

### Key Entities

- **Formatted text**: Plain text that may contain bold, italic and underline
  markers, stored as typed and rendered with formatting on cards.
- **Text sources**: Element templates, label text, and card values; all are
  plain text with optional markers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A designer can emphasise a word in a card text using only
  typed markers, with no extra steps, in under 10 seconds.
- **SC-002**: 100% of tested marker combinations (bold, italic, underline,
  and their nestings) display correctly in the editor preview, Edit card and
  print output.
- **SC-003**: 100% of existing sample texts without markers display
  identically before and after the feature.
- **SC-004**: Malformed or literal marker cases (unclosed, space-adjacent,
  escaped) never hide or lose characters in 100% of tested inputs.
- **SC-005**: Round-tripping a project through export and import keeps all
  marker text unchanged.

## Assumptions

- Marker syntax: `**bold**`, `*italic*`, `__underline__`; underline uses
  double underscores (single underscores are ordinary text).
- A marker "opens" only when followed immediately by a non-space character
  and "closes" only when preceded immediately by a non-space character.
- Formatting is not offered via any toolbar or buttons in this version.
- Rendering of formatted text happens after values are substituted into a
  template, so markers inside card values format too.
- No other styling (colour, size, strikethrough, links) is in scope.
- Applies to text and label elements only; image and icon elements are
  excluded.
- Depends on the existing text/label elements, card values, Edit card view,
  print output and CSV import.
