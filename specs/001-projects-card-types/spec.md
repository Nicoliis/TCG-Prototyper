# Feature Specification: Projects + Card Types (core)

**Feature Branch**: `001-projects-card-types`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "start implementing slice 1 from FEATURE-SLICES.md. keep all storage related code behind an abstraction so we can change the storage method re-implementing abstraction."

## Clarifications

### Session 2026-10-12

- Q: How should elements (text displays, image displays, labels, icons) be
  positioned on a card type's layout? → A: Freeform (x/y/width/height) — each
  element has a free position and size on the card canvas.
- Q: Is a card type's physical size (width x height) fixed per project or
  configurable per card type? → A: Per card type — each card type defines its
  own width/height.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage prototype projects (Priority: P1)

A designer opens the app and creates a new, empty project to hold one card
game prototype. They can see all their projects, duplicate one to branch off
a variant, rename one, and delete one they no longer need. Each project's
contents (card types, later: cards, decks) are completely independent of
every other project.

**Why this priority**: Without a project container, there is nowhere to put
card types. This is the foundation every later slice builds on.

**Independent Test**: Can be fully tested by creating two projects, adding
a card type to one, and confirming the other project shows no trace of it;
and by duplicating a project and confirming the duplicate is an independent
copy (editing one does not affect the other).

**Acceptance Scenarios**:

1. **Given** no projects exist, **When** the user creates a new project with
   a name, **Then** the project appears in the project list and becomes the
   active project.
2. **Given** at least one project exists, **When** the user duplicates it,
   **Then** a new project appears with a copy of all its card types, and
   changes to the copy do not affect the original (or vice versa).
3. **Given** at least one project exists, **When** the user deletes it,
   **Then** it is removed from the project list and its data is no longer
   accessible.
4. **Given** multiple projects exist, **When** the user switches the active
   project, **Then** only that project's card types are shown.

---

### User Story 2 - Define a card type's properties and layout (Priority: P2)

Within a project, a designer creates a card type (e.g. "Monster", "Spell")
and defines the properties it will carry (e.g. `name`, `atk`, `def`,
`imgurl`). They then lay out the card face by placing text displays, an
image display, static labels, and static images/icons.

**Why this priority**: Card types are the first real content a project
holds; without them the project container has nothing to show.

**Independent Test**: Can be fully tested by creating one card type with at
least one property, one text display, one image display, one label, and one
static icon, and confirming the layout saves and reloads correctly.

**Acceptance Scenarios**:

1. **Given** an active project, **When** the user creates a new card type
   and names it, **Then** it appears in that project's list of card types.
2. **Given** a card type, **When** the user adds a property (e.g. `atk`),
   **Then** the property becomes available to reference from displays on
   that card type's layout.
3. **Given** a card type with a property, **When** the user adds a text
   display using a template like `{atk}/{def}`, **Then** the display
   definition stores the template and substitutes current property values
   when previewed.
4. **Given** a card type, **When** the user adds an image display bound to a
   property (e.g. `{imgurl}`), **Then** the layout stores a reference that
   resolves to an image location built from that property's value.
5. **Given** a card type, **When** the user adds a static label or a static
   image/icon, **Then** it renders unchanged regardless of property values.
6. **Given** a card type with a saved layout, **When** the user reopens the
   project later, **Then** the card type and its layout are unchanged.

---

### User Story 3 - Preview a card type with sample values (Priority: P3)

While designing a layout, the designer wants to see roughly how a real card
will look, so they enter sample values for the card type's properties and
see the layout render with those values substituted into every display.

**Why this priority**: Confirms the layout is correct before any real card
data exists (card data entry arrives in a later slice). Lower priority than
defining the structure itself.

**Independent Test**: Can be fully tested by entering sample values for a
card type's properties and confirming each display updates to reflect them.

**Acceptance Scenarios**:

1. **Given** a card type with properties and displays, **When** the user
   enters a sample value for each property, **Then** the preview shows the
   rendered card with those values substituted into text and image
   templates.
2. **Given** a sample value is left empty, **When** the preview renders,
   **Then** the corresponding display shows empty/blank rather than an
   error.

---

### Edge Cases

- What happens when a text display's template references a property that
  was later deleted from the card type? (Display should render the
  template literally or blank for that token, not crash.)
- What happens when an image display's resolved URL fails to load? (Show a
  placeholder, not a broken layout.)
- What happens when the user tries to delete the last remaining project?
  (Allowed — the app simply has zero projects and prompts to create one.)
- What happens when two card types in the same project are given the same
  name? (Rejected with a validation message; names must be unique within a
  project.)
- What happens when a project or card type name is left blank? (Rejected
  with a validation message.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create a new project with a
  user-provided name.
- **FR-002**: System MUST allow users to list all existing projects.
- **FR-003**: System MUST allow users to duplicate a project, producing an
  independent copy of all its card types.
- **FR-004**: System MUST allow users to rename a project.
- **FR-005**: System MUST allow users to delete a project and all of its
  contents.
- **FR-006**: System MUST keep each project's data (card types and their
  layouts) fully isolated from every other project.
- **FR-007**: System MUST allow users to select which project is currently
  active/open.
- **FR-008**: System MUST allow users to create a card type within the
  active project, with a unique name within that project.
- **FR-009**: System MUST allow users to define named properties on a card
  type (e.g. `atk`, `def`, `imgurl`).
- **FR-010**: System MUST allow users to add text displays to a card type's
  layout, where a display's template can reference one or more property
  names (e.g. `{val}`, `{atk}/{def}`) and substitutes their values when
  rendered.
- **FR-011**: System MUST allow users to add image displays to a card
  type's layout, where the image location is built from a property's value
  (e.g. a property supplies a filename/URL fragment inserted into a
  template).
- **FR-012**: System MUST allow users to add static labels (fixed text that
  does not depend on any property) to a card type's layout.
- **FR-013**: System MUST allow users to add static images/icons (fixed
  images that do not depend on any property) to a card type's layout.
- **FR-014**: System MUST let users position each display, label, and
  image/icon freely on the card type's layout, each with an independent
  position and size (not constrained to a fixed grid).
- **FR-014a**: System MUST let users define each card type's own physical
  size (width and height), independent of other card types in the same
  project.
- **FR-015**: System MUST let users enter sample property values and
  preview the card type's layout rendered with those values.
- **FR-016**: System MUST persist all projects and card types so they are
  still present the next time the application is opened.
- **FR-017**: All persistence MUST go through a single storage
  abstraction, so the underlying storage mechanism can be replaced by
  re-implementing that abstraction alone, without changes to project or
  card type logic elsewhere in the app.
- **FR-018**: System MUST validate that project names and, within a
  project, card type names are non-empty and unique, rejecting
  duplicates/blanks with a clear message.

### Key Entities

- **Project**: A named, independent container for one game prototype.
  Holds a collection of card types. Supports create, rename, duplicate,
  delete.
- **Card Type**: A named template within a project (e.g. "Monster").
  Holds a set of properties, its own physical size (width/height), and a
  layout.
- **Property**: A named attribute on a card type (e.g. `atk`), referenced
  by templates in displays. Holds a sample value for preview purposes.
- **Display**: A freely positioned and sized element (x, y, width, height)
  on a card type's layout. Two kinds for this slice: Text Display (template
  string referencing properties) and Image Display (template resolving to
  an image location via a property).
- **Label**: A freely positioned and sized, static piece of text on the
  layout, independent of any property.
- **Image/Icon**: A freely positioned and sized, static image on the
  layout, independent of any property.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can go from "no project exists" to "a card type with a
  working text display and a working image display is previewable" in
  under 5 minutes of use.
- **SC-002**: Deleting or editing one project produces zero observable
  change in any other project, verified across 100% of tested cases.
- **SC-003**: All projects and card types created in a session are still
  present, unchanged, after closing and reopening the application.
- **SC-004**: The application's project and card type features continue to
  work unchanged when the underlying storage mechanism is swapped for a
  different implementation of the same storage abstraction.
- **SC-005**: Users can preview a card type's rendered layout with sample
  values with zero unhandled errors, even when some sample values are left
  blank or a referenced image fails to load.

## Assumptions

- Single-user, local/offline use: no accounts, login, or multi-user access
  control are in scope for this slice.
- "Duplicate project" copies the project's card type definitions only;
  there is no card instance data yet in this slice (bulk card data entry
  arrives via CSV import in a later slice), so there is nothing else to
  copy.
- Property values are plain text; any numeric or structured interpretation
  is left to how a template chooses to display them.
- Image displays in this slice resolve direct/templated URLs only; the
  spritesheet-slicing (`{imgnumb:templatex}`) and predetermined image-list
  mapping behaviors described in TODO-Features.md are explicitly deferred
  to Slice 2 per FEATURE-SLICES.md.
- Default persistence is local to the browser (e.g. the browser's own
  storage), but this is an implementation choice made behind the storage
  abstraction (FR-017) and is not a user-facing requirement of this spec.
- No real-time collaboration or sync between devices is in scope.
