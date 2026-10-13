# Feature Specification: CSV Card Fill

**Feature Branch**: `003-csv-card-fill`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "from FEATURE-SLICES.md start specifying the
point 3, (skip 2). CSV fill: CSV import + minuscule CSV editor, column ->
property mapping; undefined properties left empty. Depends on: Slice 1
(needs card properties to map to)."

## Clarifications

### Session 2026-10-13

- Q: Should CSV import feed into the same card table as the manual
  editor, or be a separate, standalone flow? → A: Separate flow — import
  is its own dedicated screen/process (not inline editing of the live
  table); imported/updated cards then show up in the regular table like
  any other card.
- Q: Should re-importing a CSV always create new cards, or try to update
  matching cards from a previous import? → A: Try to update matching
  cards — this requires the user to designate a property as the matching
  key for that import, turning import into an upsert (update if a card's
  key value matches, otherwise create).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fill cards directly in an in-app table (Priority: P1)

A designer picks one of their card types and sees a simple spreadsheet-like
table: one row per card, one column per property defined on that card type.
They type values directly into cells to create new cards, edit existing
ones, or delete cards they no longer want — all without ever leaving the
app or touching an external file.

**Why this priority**: This is the "minuscule CSV editor" itself — the
fastest way to get real card data into the app, and the foundation the CSV
import feature (User Story 2) adds data into.

**Independent Test**: Can be fully tested by opening a card type with no
cards yet, adding two rows by typing values into cells, confirming both
cards exist with those values, then deleting one and confirming only the
other remains.

**Acceptance Scenarios**:

1. **Given** a card type with properties `name`, `atk`, `def`, **When** the
   user opens its card table, **Then** they see one column per property and
   zero rows (if no cards exist yet).
2. **Given** the card table is open, **When** the user adds a new row and
   types a value into one or more cells, **Then** a new card is created
   holding exactly those values, with every other property blank.
3. **Given** an existing card, **When** the user edits one of its cell
   values, **Then** that card's value for that property updates and
   nothing else about the card changes.
4. **Given** an existing card, **When** the user deletes its row, **Then**
   that card no longer exists and every other card is unaffected.
5. **Given** the card table has cards in it, **When** the user leaves and
   reopens the application, **Then** every card and its values are exactly
   as left.

---

### User Story 2 - Bulk-create or update cards via a dedicated CSV import (Priority: P2)

Instead of typing every card by hand, a designer opens a separate "Import
CSV" screen for a card type, supplies a CSV file (or pastes CSV text),
picks which property acts as the matching key (e.g. `name`), and confirms.
Each column whose header matches one of the card type's properties gets
mapped to that property. For every data row: if an existing card's
key-property value equals that row's value for the key column, that card
is updated with the row's other mapped values; otherwise a new card is
created. The results then appear in the regular card table from User
Story 1, like any other card.

**Why this priority**: Delivers the bulk "fill many cards at once" value
the feature is named for, including safely re-running a corrected import
without creating duplicates — but it depends on User Story 1's table
existing as where the resulting cards are reviewed afterward.

**Independent Test**: Can be fully tested by importing a CSV with 3 data
rows and 2 of its columns matching real properties, then confirming
exactly 3 new cards exist, each with only those 2 properties filled in;
then importing a corrected version of the same CSV (same key values) and
confirming it updates those same 3 cards instead of creating 3 more.

**Acceptance Scenarios**:

1. **Given** a card type with properties `name`, `atk`, **When** the user
   imports a CSV whose header row is `name,atk` with 2 data rows and no
   existing card's `name` matches either row, **Then** 2 new cards are
   created with both properties filled from the matching columns.
2. **Given** an existing card with `name` = "Goblin" and `atk` = 3, **When**
   the user imports a CSV row with `name` = "Goblin" and `atk` = 5, using
   `name` as the matching key, **Then** the existing Goblin card's `atk`
   updates to 5 — no duplicate card is created.
3. **Given** a card type with properties `name`, `atk`, **When** the user
   imports a CSV with an extra column `flavor` that matches no property,
   **Then** cards are still created/updated from the other matching
   columns, and the `flavor` column's data is not stored anywhere.
4. **Given** a card type with properties `name`, `atk`, `def`, **When** the
   user imports a CSV whose header row is only `name,atk` (no `def`
   column) for a brand-new card, **Then** that new card has `def` left
   blank.
5. **Given** an existing card with `def` = 4, **When** a CSV row updates
   that same card (matched by key) but the CSV has no `def` column,
   **Then** the card's existing `def` value of 4 is left unchanged — an
   import only overwrites properties it actually has matching data for.
6. **Given** a CSV row whose value in the key column is blank, **When**
   imported, **Then** a new card is always created for that row (a blank
   key cannot match any existing card).

---

### User Story 3 - See what an import did and didn't fill in (Priority: P3)

After (or while) importing a CSV, the designer is told plainly which of
the CSV's columns were ignored (matched no property) and which of the card
type's properties received no data from the import, so a typo'd header or
a missing column is obvious immediately rather than discovered later by
noticing blank cards.

**Why this priority**: Independently valuable feedback that prevents silent
data loss, but it's a refinement of User Story 2 rather than new data
capability — the import already works correctly without it, this just
makes mistakes visible.

**Independent Test**: Can be fully tested by importing a CSV with one
column that doesn't match any property and confirming the app explicitly
names that column as ignored.

**Acceptance Scenarios**:

1. **Given** a CSV import includes a column that matches no property,
   **When** the import completes, **Then** the app explicitly lists that
   column as ignored.
2. **Given** a card type has a property that no CSV column matched,
   **When** the import completes, **Then** the app explicitly lists that
   property as left blank on newly created cards.
3. **Given** an import updates some existing cards and creates others,
   **When** the import completes, **Then** the app reports how many cards
   were newly created versus updated.

---

### Edge Cases

- What happens when an imported CSV is empty or has only a header row?
  (Zero cards are created; the app says so rather than behaving as if
  something failed.)
- What happens when a CSV has two columns with the same header name (e.g.
  two `atk` columns)? (The first matching column is used; later duplicates
  are treated like any other unmatched/ignored column.)
- What happens when none of a CSV's columns match any property? (All data
  rows still become cards — entirely blank ones — and every column is
  reported as ignored, per User Story 3.)
- What happens when the user deletes a card? (It is removed immediately;
  no other card is affected, consistent with how deleting a project or
  card type already works elsewhere in the app.)
- What happens when a cell is left blank, either typed directly or via
  import? (The card simply has a blank value for that property — blank is
  always a valid state, never an error.)
- What happens when more than one existing card shares the same value in
  the chosen key property (e.g. two cards both named "Goblin")? (The
  import updates the first matching card it finds; this is an inherent
  risk of picking a non-unique property as the key, not an error the
  system detects.)
- What happens when the CSV's key column is missing entirely (not just
  blank values, but no column with that name at all)? (Every row is
  treated as having a blank key, so every row creates a new card — same
  as the blank-key case above.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show, for a selected card type, a table of all
  its cards with one row per card and one column per property defined on
  that card type.
- **FR-002**: System MUST let users add a new card directly in this table.
- **FR-003**: System MUST let users edit any property value of any
  existing card directly in this table.
- **FR-004**: System MUST let users delete any existing card directly from
  this table.
- **FR-005**: System MUST provide a dedicated import screen/flow, separate
  from the manual table editor, where a user imports a CSV (as either an
  uploaded file or pasted text) for a selected card type.
- **FR-006**: System MUST match each CSV column to a property by name
  (case-insensitive, ignoring surrounding whitespace) and map its values
  into that property for every imported row.
- **FR-007**: System MUST ignore any CSV column that matches no property
  of the selected card type, without blocking the rest of the import.
- **FR-008**: System MUST leave a property blank on a newly created card
  when no CSV column matches that property's name.
- **FR-009**: System MUST report which CSV columns were ignored, which
  properties received no data on newly created cards, and how many cards
  were created versus updated, for a given import.
- **FR-010**: System MUST let the user designate one property of the
  selected card type as the matching key for an import.
- **FR-011**: System MUST, for each CSV data row, update the existing card
  whose key-property value equals that row's value in the matching key
  column — overwriting only the properties the row has matching columns
  for, leaving that card's other existing property values unchanged — or,
  if no existing card's key-property value matches (including when the
  row's key value is blank or the key column is absent), create a new
  card from that row instead.
- **FR-012**: System MUST persist every card and every edit, import, or
  deletion to it, so cards are unchanged after closing and reopening the
  application.
- **FR-013**: System MUST allow a card to have any subset of its
  properties (including all of them) left blank.

### Key Entities

- **Card** (new in this slice): One filled-in instance of a Card Type.
  Holds a value (possibly blank) for each of that Card Type's properties.
  Belongs to exactly one Card Type and, transitively, one Project. Distinct
  from a Property's "sample value" (Slice 1), which exists only for
  previewing a Card Type's layout, not for real card data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a fully-filled card by typing directly into
  the table, with zero reliance on an external file or tool.
- **SC-002**: Importing a CSV with N data rows, none matching an existing
  card's key value, results in exactly N new cards, verified across 100%
  of tested cases, including CSVs with unmatched or missing columns.
- **SC-003**: After any import that includes at least one unmatched column
  or one unfilled property, a user can identify which columns were
  ignored, which properties are blank, and how many cards were created
  versus updated, without inspecting the raw CSV file.
- **SC-004**: Cards and all edits to them survive closing and reopening the
  application, with zero data loss, matching the existing guarantee for
  projects and card types.
- **SC-005**: Re-importing a corrected CSV whose rows share key values
  with a previous import updates those same cards instead of creating
  duplicates, verified across 100% of tested cases.

## Assumptions

- Import is a distinct screen/flow from the manual table editor (not
  inline editing of a live grid), but both ultimately operate on the same
  one list of cards per card type — a card created or updated by import
  shows up in the regular table (User Story 1) exactly like a hand-typed
  one.
- The matching key is a single property the user picks per import (default
  selection: the card type's first property, changeable before
  confirming). There is no persistent, system-enforced unique identifier
  for cards beyond this user-chosen key at import time.
- Matching is exact string equality (after the same case-insensitive,
  trimmed normalization used for column names) between the row's key-column
  value and a card's current key-property value. If more than one existing
  card shares that value, the import updates the first one found — picking
  a property that isn't actually unique is the user's responsibility, not
  something the system validates.
- A blank key value (or an absent key column) never matches an existing
  card, so that row always creates a new card rather than updating
  anything.
- Updating a card only overwrites the properties the CSV row has matching
  columns for; properties already on that card but not covered by this
  CSV keep their existing value rather than being blanked out.
- CSV parsing follows standard comma-separated, double-quote-escaped
  conventions, with the first row always treated as the header row.
- Column-to-property matching is case-insensitive and ignores leading/
  trailing whitespace in both the CSV header and the property name.
- No CSV export is in scope for this slice; the in-app table is the
  source of truth for card data going forward.
- No limit on the number of cards per card type is imposed beyond what the
  browser's storage can hold, consistent with Slice 1's local-storage
  assumption.
- Deleting a card is immediate, with no confirmation prompt, consistent
  with how project and card type deletion already behave elsewhere in the
  app.
