# Phase 0 Research: Project Export & Import

No `[NEEDS CLARIFICATION]` markers remained in the Technical Context — the
two genuine forks (timestamp handling, file readability) were already
resolved during `/speckit-clarify`. This document records the remaining
implementation-approach decisions.

## Decision: Triggering a file download without a build tool or server

**Decision**: Build a `Blob` from the JSON string, create an object URL with
`URL.createObjectURL`, assign it to a detached `<a download="name.json">`'s
`href`, call `.click()` on it, then `URL.revokeObjectURL` after a tick.

**Rationale**: This is the standard native-browser mechanism for
client-only, no-backend file downloads and needs no dependency, matching
Principle I. It has been proven in this codebase's constraints by every
other feature (no npm, no bundler).

**Alternatives considered**:
- `data:` URL on the anchor — rejected: large projects can exceed practical
  URL length limits in some browsers; `Blob`/object-URL has no such cap.
- `window.open()` with the JSON as content — rejected: triggers a new tab
  instead of a save-as flow, and some browsers block the popup.

## Decision: Reading an imported file

**Decision**: `<input type="file" accept=".json,application/json">`, read
via `await file.text()` (available on the `File` object in all supported
browsers), then `JSON.parse`.

**Rationale**: Simplest native API; no need for `FileReader` event
plumbing since `File.text()` already returns a Promise.

**Alternatives considered**: Drag-and-drop onto the project list —
rejected for this slice as an enhancement, not required by any acceptance
scenario; a plain file picker satisfies every acceptance scenario in the
spec. `FileReader.readAsText` — rejected as equivalent but more verbose
than `file.text()`.

## Decision: Export envelope shape

**Decision**: A small wrapper object around the project payload rather than
dumping the raw internal `Project` record as-is:

```json
{
  "cardgamePrototyperExport": "project",
  "formatVersion": 1,
  "exportedAt": "2026-10-13T12:00:00.000Z",
  "project": { "name": "...", "cardTypes": [...], "decks": [...] }
}
```

**Rationale**: FR-007 requires validating that an imported file is a
recognizable project export before touching storage — a literal marker
field (`cardgamePrototyperExport: "project"`) is the cheapest possible
reliable check, and is itself still plain, human-readable JSON (FR-003a).
`formatVersion` gives future slices a documented place to branch behavior
if the shape ever needs to change, without requiring it now (YAGNI: only
version `1` exists; the field exists so a *future* version doesn't have to
guess). Only `name`, `cardTypes`, and `decks` are carried — not `id`,
`createdAt`, or `updatedAt` — because those are regenerated/reset on import
per FR-011 and the clarified duplicate-like semantics, so including them
would be dead data that invites confusion if someone opens the file by
hand.

**Alternatives considered**: Exporting the raw stored `Project` object
unchanged — rejected: it would carry a stale `id` that must never be reused
directly (FR-005 requires a brand-new, independent project) and stale
timestamps that FR-011 says to discard, so keeping them in the file would
be misleading to anyone inspecting it by hand.

## Decision: Id regeneration and reference remapping on import

**Decision**: Reuse the existing `cloneCardType(cardType, cardIdMap)` and
`cloneDecksForCards(decks, cardIdMap)` functions (already used by
`cloneProjectForDuplicate` for in-app project duplication) to rebuild the
imported project: every card type, element, property, and card gets a new
id; the same `cardIdMap` is threaded through so deck entries are remapped
to the new card ids rather than the imported file's original ones.

**Rationale**: This is the exact mechanism that already guarantees
duplicated projects are fully independent and internally consistent
(Slice 1/4). Reusing it for import means the import path inherits that
already-tested guarantee for free instead of re-implementing id remapping,
and keeps the two "make me a new, independent copy of this data" code
paths (duplicate, import) sharing one implementation.

**Alternatives considered**: Preserving original ids from the file —
rejected: no actual requirement calls for it (FR-011 already establishes
"treat imported data like a duplicate, not a restore-in-place"), and
preserving them would reintroduce exactly the kind of cross-project id
collision risk the duplicate-id-remapping code was written to prevent.

## Decision: Validation strategy for FR-007 / dangling references (FR-009)

**Decision**: `validateExportEnvelope(parsed)` is a narrow structural check
(marker field present, `project.name` a non-empty string, `project.cardTypes`
an array) that throws a single user-facing error on failure; anything past
that point reuses the existing model-level defaults and validation
(`createCardType`/property/element shape helpers already tolerate missing
optional fields with sensible defaults, per how the editor already handles
older in-app data). Dangling deck→card references are dropped by filtering
each deck's entries to only those whose `cardId` is present in the
rebuilt `cardIdMap`, mirroring `pruneDecks`'s existing "drop what no longer
exists" behavior.

**Rationale**: A full deep schema validator is unnecessary complexity for a
single-user local tool with no untrusted multi-tenant input; the existing
model layer already has to tolerate "missing optional field" shapes
(forward/backward compatibility, per the spec's edge cases), so validation
only needs to catch "this clearly isn't one of our export files at all."

**Alternatives considered**: A full JSON-schema validation library —
rejected: new dependency, violates Principle I, and is disproportionate to
a local single-user tool's actual risk (malicious or garbled input causing
a crash, not a security boundary).

## Decision: Export file naming

**Decision**: Slugify the project name (lowercase, non-alphanumerics to
`-`, collapse/trim dashes) and append `.json`, e.g. `my-deck-game.json`;
fall back to `project.json` if slugifying empties the string (e.g. a
name made entirely of emoji/symbols).

**Rationale**: Satisfies FR-003 ("derived from the project's name") while
staying filesystem-safe across OSes without pulling in a slug library.

**Alternatives considered**: Using the raw project name verbatim as the
filename — rejected: project names can contain characters invalid in file
names on some OSes (`/`, `:`, etc.).
