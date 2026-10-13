# Feature Specification: Project Export & Import

**Feature Branch**: `006-project-export-import`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "Let's add a feature that allows the proyects to be fully exported and imported."

## Clarifications

### Session 2026-10-13

- Q: When a project file is imported, should the new project keep the original's created/last-edited timestamps, or get fresh ones as of the import moment? → A: Fresh timestamps — the imported project's created/updated times reflect the import moment, same as duplicating a project.
- Q: Does the exported project file need to be a plain, human-readable format that someone could open in a text editor and inspect or tweak by hand, or can it be treated as an opaque file meant only to go back into this app? → A: Human-readable — the file is plain structured text, openable and skimmable outside the app.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Export a project to a file (Priority: P1)

A user who has built up a project (card types, their properties and visual
elements, filled-in cards, and decks) wants to save it outside the app, so
they can back it up, move it to another browser or computer, or hand it to
someone else.

**Why this priority**: Without export, nothing else in this feature has a
source file to work from. It is also independently useful on its own (as a
backup mechanism), even before import exists.

**Independent Test**: From the project list, export an existing project and
confirm a single file is produced that is named after the project and
contains recognizable project content.

**Acceptance Scenarios**:

1. **Given** a project with multiple card types, properties, elements,
   filled-in cards, and decks, **When** the user chooses to export that
   project, **Then** the app produces one downloadable file containing all
   of that project's card types, properties, elements, cards, and decks.
2. **Given** a brand-new, otherwise-empty project, **When** the user exports
   it, **Then** the app still produces a valid file representing that empty
   project (no error).
3. **Given** a project the user has exported before, **When** they export it
   again after making further edits, **Then** the newly produced file
   reflects the current state of the project, not the earlier export.

---

### User Story 2 - Import a project from a file (Priority: P1)

A user who has a previously exported project file (their own backup, or one
shared with them) wants to bring it into the app as a usable project they
can open and keep editing.

**Why this priority**: Import is the other half of the round trip; export
alone has no way to bring data back in. Both are needed for the feature to
deliver its stated purpose (backup / transfer / sharing).

**Independent Test**: Import a previously exported file and confirm a new
project appears in the project list, fully populated and ready to open in
the card type editor exactly as the original was.

**Acceptance Scenarios**:

1. **Given** a valid exported project file, **When** the user imports it,
   **Then** a new project is added to the project list containing the same
   card types, properties, elements, cards, and decks as the original.
2. **Given** a valid exported project file whose project name matches a
   project that already exists in the app, **When** the user imports it,
   **Then** the import still succeeds and the new project is given a
   non-colliding name (the existing project is left untouched either way).
3. **Given** a file that is not a recognizable project export (wrong format,
   corrupted, or unrelated content), **When** the user attempts to import
   it, **Then** the app rejects it with a clear explanation and no project
   is created or altered.
4. **Given** an imported project, **When** the user opens one of its card
   types in the editor, **Then** every element renders in the same position,
   size, rotation, depth order, and style as it did in the original project.

---

### User Story 3 - Confirm what will happen before importing (Priority: P2)

A user who is about to import a file wants a moment to see what they're
about to add (at least the project name) before it's committed, so an
accidental or wrong file doesn't clutter their project list unnoticed.

**Why this priority**: Reduces risk of confusing clutter from a misclick,
but the feature is still fully usable without it — P1 already guarantees
nothing is silently corrupted or merged into existing data.

**Independent Test**: Start an import and confirm the app shows the
incoming project's name before it is added to the list.

**Acceptance Scenarios**:

1. **Given** a valid project file selected for import, **When** the app
   finishes reading it, **Then** the user sees the project name that is
   about to be created before the new project is added to their list.

---

### Edge Cases

- What happens if the imported file was exported by an older or newer
  version of the app and some fields are missing or unrecognized? The
  import should fill in sensible defaults for anything missing and ignore
  anything it doesn't recognize, rather than failing outright.
- What happens if a deck in the file references a card that isn't present
  in the same file (a corrupted or hand-edited export)? That dangling
  reference is dropped silently; the rest of the import proceeds.
- What happens when exporting a project while it has unsaved in-progress
  edits open in another part of the app? Export always reflects the
  latest saved state at the moment export is requested.
- What happens if the user imports the exact same file twice? Each import
  creates its own separate new project; the two resulting projects are
  independent copies and editing one never affects the other.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to export any single existing project from
  the project list as one file.
- **FR-002**: An exported project file MUST contain that project's complete
  contents: all card types (with their size, properties, and elements —
  including each element's position, size, rotation, depth order, and
  style), all filled-in cards, and all decks (including which cards are in
  each deck and in what quantities).
- **FR-003**: The exported file's name MUST be derived from the project's
  name so the user can identify it among other downloaded files.
- **FR-003a**: The exported file MUST be in a plain, human-readable
  structured text format that can be opened and inspected (and, at the
  user's own risk, hand-edited) outside the app, not an opaque or encoded
  blob.
- **FR-004**: Users MUST be able to import a previously exported project
  file back into the app.
- **FR-005**: Importing a file MUST always create a new, independent
  project; it MUST NOT modify, merge into, or replace any existing project.
- **FR-006**: If the imported project's name collides with a project that
  already exists in the app, the system MUST automatically adjust the new
  project's name so it does not collide, without blocking the import.
- **FR-007**: The system MUST validate that an imported file is a
  recognizable project export before creating anything from it, and MUST
  reject anything else with a clear, non-technical error message.
- **FR-008**: On a successful import, the system MUST show the user the name
  of the project that was just created.
- **FR-009**: Decks in an imported file that reference cards not present in
  that same file MUST have those dangling references dropped rather than
  causing the import to fail.
- **FR-010**: An imported project MUST open and render in the card type
  editor and card list identically to how the original project behaved
  before it was exported.
- **FR-011**: An imported project's created and last-updated timestamps MUST
  reflect the moment of import, not the original project's history (the
  same rule already used when duplicating a project).

### Key Entities *(include if feature involves data)*

- **Project export file**: A single portable file representing one
  project's full contents at the moment of export — its card types
  (properties, elements, and styling), its cards (the property values of
  each printed instance), and its decks (named groupings of cards with
  copy counts). Self-contained: everything needed to reconstruct the
  project lives in this one file.
- **Project** *(existing entity)*: Unchanged in shape by this feature;
  import simply produces a new instance of it, and export simply reads an
  existing instance's current contents.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can export a project and re-import it, ending up with
  a project that is indistinguishable in content from the original when
  opened in the editor (card types, properties, elements, cards, and decks
  all match; the new project's own created/updated timestamps are
  intentionally fresh per FR-011 and are not part of this comparison).
- **SC-002**: Exporting a project of typical size (dozens of card types and
  hundreds of cards) completes in under 5 seconds.
- **SC-003**: Attempting to import an invalid or unrelated file always
  results in a clear rejection message and never leaves a partially-created
  or corrupted project behind.
- **SC-004**: 100% of a project's card types, cards, and decks survive an
  export/import round trip with no data loss.

## Assumptions

- Export produces exactly one file per project (not one file per card type
  or a multi-file bundle).
- Import always results in a brand-new project, named distinctly from any
  existing project — never an overwrite or merge — mirroring how "duplicate
  project" already behaves for name collisions in this app.
- There is no project-level sheet/print settings data stored on the project
  itself (per the current data model), so export/import is not expected to
  carry print layout preferences; if that assumption turns out to be wrong
  it can be folded in later without changing this feature's shape.
- The file being human-readable (FR-003a) is about inspectability, not
  about providing a supported bulk-editing workflow — hand-editing card
  data in bulk is already covered separately by the CSV card import/export
  feature; a user who edits an exported project file by hand does so at
  their own risk and the import validation (FR-007) is what protects the
  app from a malformed result.
- Only one project is exported or imported per action; bulk export/import
  of multiple projects at once is out of scope for this feature.
