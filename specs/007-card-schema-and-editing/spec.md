# Feature Specification: Card Schema vs. Design, Typed Properties, Card Editor

**Feature Branch**: `007-card-schema-and-editing`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "Card properties definition and card design should be two different things. The ID should always exist and be the id of the card; when adding it should autoincrease. Properties should be defined as 'one line', 'textarea', 'integer', 'decimal' and have corresponding editing fields in the editing window. Allow entering 'edit card' where you can see one card rendered and edit its fields, using next, prev, (id) to move through defined cards."

## Clarifications

### Session 2026-10-13

- Q: How should properties definition and card design be separated? → A: Separate tabs ("Properties" and "Design") within the card type editor.
- Q: What happens on a type change when existing values don't fit? → A: Warn, change the type, keep the old values and flag them as invalid until fixed.
- Q: How does CSV import treat the card ID? → A: ID can be chosen as the matching key to update existing cards; unmatched rows create cards with new automatic IDs.
- Q: Where is Edit card entered from? → A: An "Edit cards" button on the card type, plus an edit action on each card table row that opens that card.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Define properties separately from the design (Priority: P1)

A designer working on a card type has two distinct places: a **properties
definition** area (what data a card holds: names and types) and a **card
design** area (how that data is laid out visually). They can define or change
properties without opening the visual layout, and design the layout without
the property list crowding it. The design area still lets them bind elements
to the defined properties.

**Why this priority**: This is the structural change the rest builds on; the
typed fields and the card editor both need a clean schema to work from.

**Independent Test**: Open a card type, add a property in the properties
area, then switch to the design area and bind an element to it; confirm each
area can be used without the other's controls visible.

**Acceptance Scenarios**:

1. **Given** a card type, **When** the user opens its properties definition,
   **Then** they see only property management (add, rename, change type,
   remove), not layout tools.
2. **Given** a card type, **When** the user opens its design, **Then** they
   see the layout tools and can reference the defined properties, but do not
   manage the property list there.
3. **Given** existing card types created before this feature, **When** opened,
   **Then** their properties, elements and cards are preserved and behave
   as before.

---

### User Story 2 - Typed properties with matching input fields (Priority: P1)

When defining a property the designer chooses its type: **one line**
(single-line text), **textarea** (multi-line text), **integer** (whole
number) or **decimal** (number with fractional part). Anywhere a card's
values are edited, each property shows an input suited to its type: a
single-line field, a multi-line field, or a numeric field that only accepts
valid numbers of that kind.

**Why this priority**: Typed data prevents bad values and makes editing
faster and less error-prone.

**Independent Test**: Create one property of each type, open the card editor
on a card, and confirm each shows the right input and that invalid numeric
input (letters; a fraction in an integer field) is rejected.

**Acceptance Scenarios**:

1. **Given** the user adds a property, **When** choosing its type, **Then**
   exactly the four types are offered and a type is always set (default:
   one line).
2. **Given** an integer property, **When** the user enters `3.5` or `abc`,
   **Then** the value is rejected with a clear message and the stored value
   is unchanged.
3. **Given** a decimal property, **When** the user enters `2.75`, **Then**
   it is accepted and shown back as entered.
4. **Given** a textarea property, **When** the user enters several lines,
   **Then** line breaks are kept and shown on the card.
5. **Given** a property that already has cards with values, **When** the
   user changes its type to one that cannot represent an existing value
   (e.g. text "abc" to integer), **Then** the user is warned and those
   values are not silently lost.

---

### User Story 3 - Every card has an automatic ID (Priority: P1)

Every card always has an ID, shown as the first, non-removable property of
every card type. It is a whole number assigned automatically: when a card is
added it receives the next number (previous highest + 1, starting at 1). The
designer does not type it, and it is not editable. IDs are never reused after
a card is deleted within the same card type.

**Why this priority**: The ID is how cards are identified and navigated, and
the card editor relies on it.

**Independent Test**: Add three cards, confirm IDs 1, 2, 3; delete 2, add
another, confirm it is 4.

**Acceptance Scenarios**:

1. **Given** a card type with no cards, **When** a card is added, **Then** it
   gets ID 1.
2. **Given** cards 1–3, **When** card 3 is deleted and a card is added,
   **Then** the new card gets ID 4 (not 3).
3. **Given** any card type, **When** viewing its properties, **Then** an ID
   property is always present, cannot be removed, renamed or retyped, and
   can be used in the design like any other property.
4. **Given** cards created by CSV import or the card table, **When** created,
   **Then** they also receive automatic IDs.
5. **Given** existing cards created before this feature, **When** the project
   is opened, **Then** each card is assigned an ID in its current order
   without data loss.

---

### User Story 4 - Edit a card on a rendered card (Priority: P2)

From a card type the designer enters **Edit card** mode. One card is shown
rendered with its design, alongside input fields for each of its properties.
Changing a field updates the rendered card immediately. They move between
cards with **Previous** and **Next** controls and can jump directly to a
card by typing its **ID**. They can also add a new card from this mode.

**Why this priority**: It is the main way to author card content while
seeing the real result, but depends on stories 1–3.

**Independent Test**: With three cards, enter Edit card, change a field and
see the render update, press Next twice, then type ID 1 to return to the
first card; confirm edits persisted.

**Acceptance Scenarios**:

1. **Given** a card type with cards, **When** the user enters Edit card,
   **Then** the first card is shown rendered with an input per property
   (ID shown read-only).
2. **Given** a card is shown, **When** the user edits a field, **Then** the
   rendered card updates immediately and the change is saved.
3. **Given** a card in the middle, **When** the user presses Next/Previous,
   **Then** the adjacent card (by ID order) is shown.
4. **Given** the first (or last) card, **When** Previous (or Next) is
   pressed, **Then** the control is disabled or has no effect, with no error.
5. **Given** Edit card mode, **When** the user types an existing ID,
   **Then** that card is shown; for a non-existent ID, they get a clear
   message and the current card stays.
6. **Given** a card type with no cards, **When** the user enters Edit card,
   **Then** they see an empty state offering to add the first card.
7. **Given** Edit card mode, **When** the user adds a card, **Then** it gets
   the next ID and is shown immediately for editing.

---

### Edge Cases

- Deleting the card currently shown in Edit card: the next card (or previous
  if last) is shown; if none remain, the empty state appears.
- Invalid numeric text typed into a numeric field is never saved; the field
  indicates the problem.
- Empty values are allowed for every type except ID, and render as blank.
- Very long text in one-line/textarea fields must not break the rendered
  card's layout.
- Removing a property used by design elements: the user is warned which
  elements use it; if they proceed, those elements render blank rather than
  the design breaking.
- Renaming a property does not change stored values. Reordering properties is out of scope.
- Project export/import and duplication keep types, IDs and values intact.
- CSV import mapping to integer/decimal properties with invalid cells:
  invalid values are reported rather than silently stored.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The card type editor MUST separate property definition from
  card design into distinct tabs ("Properties" and "Design").
- **FR-002**: Each property MUST have a type: one line, textarea, integer or
  decimal; new properties default to one line.
- **FR-003**: Each card type MUST always have an ID property, which cannot be
  removed, renamed, retyped or manually edited.
- **FR-004**: New cards MUST receive an automatically assigned ID one greater
  than the highest ID ever assigned in that card type, starting at 1; IDs
  MUST NOT be reused after deletion.
- **FR-005**: The ID MUST be available to the card design like any other
  property.
- **FR-006**: Every place that edits card values MUST show an input matching
  the property type, and MUST reject invalid integer/decimal values with a
  clear message.
- **FR-007**: Changing a property's type MUST warn the user when existing
  values cannot be represented, keep those values, and flag them as invalid
  until corrected; data MUST NOT be silently discarded.
- **FR-008**: Users MUST be able to enter Edit card mode via an "Edit cards"
  button on the card type (opening the first card) and via an edit action
  on each card table row (opening that card), showing one card rendered plus
  an input per property.
- **FR-009**: Edits in Edit card mode MUST update the rendered card
  immediately and persist automatically.
- **FR-010**: Edit card MUST provide Previous, Next and go-to-ID navigation
  in ID order, handling boundaries and unknown IDs gracefully.
- **FR-011**: Users MUST be able to add a card from Edit card mode, and see
  a helpful empty state when no cards exist.
- **FR-012**: Existing projects MUST migrate without data loss: untyped
  properties become one line; existing cards receive IDs.
- **FR-013**: Cards created by any route (card table, CSV import, edit card,
  project import) MUST have valid unique IDs.
- **FR-014**: Project export/import MUST preserve property types and card IDs.
- **FR-015**: CSV import MUST allow the ID to be chosen as the matching key:
  rows whose value matches an existing card's ID update that card; rows with
  no match create a new card with the next automatic ID (the CSV value is not
  used as the new card's ID).
- **FR-016**: Values flagged invalid after a type change MUST be visibly
  marked wherever they are edited.

### Key Entities

- **Property**: A named, typed data field of a card type (one line, textarea,
  integer, decimal). Part of the card type's schema, independent of layout.
- **ID property**: A built-in, always-present, read-only integer property
  identifying each card within its card type.
- **Card**: A set of values, one per property, identified by its ID.
- **Card design**: The visual layout of a card type, referencing properties
  but separate from the property definitions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A designer can add a property of any type without opening the
  design area, and design without seeing property management, in 100% of
  tested flows.
- **SC-002**: 100% of cards created through any route have a unique ID, and
  no ID is reused after deletion.
- **SC-003**: Invalid integer/decimal entries are rejected in 100% of tested
  cases, with zero invalid values stored.
- **SC-004**: A designer can fill in and review 10 cards using Edit card
  (navigating with Next/Previous/ID) without leaving the screen.
- **SC-005**: Edits appear on the rendered card within a perceptible instant
  (under 0.5 seconds).
- **SC-006**: Existing projects open after the change with all prior card
  types, elements and cards intact.

## Assumptions

- The ID is unique per card type, not project-wide, and is a positive whole
  number; the existing internal card identifier remains separate if needed.
- Numeric properties store values as entered text validated against the
  type; no units, ranges or formatting options in this version.
- Edit card is reached from a card type (alongside the existing card table)
  and uses the card type's current design for rendering.
- Navigation order is ascending ID.
- Property type can be changed after creation (subject to FR-007).
- Out of scope: additional types (image, choice, boolean), per-property
  validation rules (min/max), and bulk type conversion tools.
- Depends on existing card types, card table, CSV import and project
  export/import features.
