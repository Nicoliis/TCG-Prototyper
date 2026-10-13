# Implementation Plan: Project Export & Import

**Branch**: `006-project-export-import` | **Date**: 2026-10-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-project-export-import/spec.md`

## Summary

Add a **Project Export / Import** capability to the project list screen. Export
reads a full project (card types with their properties/elements/styling,
cards, decks) through the existing storage adapter, wraps it in a small
versioned envelope, and downloads it as pretty-printed, human-readable JSON
named after the project. Import reads a chosen file, validates the envelope,
and builds a brand-new project — regenerating every id (card type, element,
property, card, deck) exactly the way `cloneProjectForDuplicate` already
does for in-app duplication, so cross-references stay internally consistent
and nothing can collide with existing data. The new project gets a
non-colliding name and fresh timestamps. All of this stays behind the
existing `StorageAdapter` contract: one new method, `importProject`,
implemented on `IndexedDbAdapter` and on both Node-runnable test doubles,
proven interchangeable by the existing contract test suite.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022+), native ES modules — unchanged.

**Primary Dependencies**: None. Export uses a `Blob` + object URL + a
programmatic `<a download>` click (already the browser-native pattern for
"save this generated data as a file" in a build-tool-free app). Import uses
a hidden `<input type="file">` and `File.text()`. No parser/serialization
library — `JSON.stringify`/`JSON.parse` only.

**Storage**: Unchanged `StorageAdapter` contract plus one addition,
`importProject(exportedData)`, implemented in `IndexedDbAdapter` (and the
two Node test doubles) following the same pattern as `duplicateProject`.
Export does not add storage surface — it reads via the existing
`getProject`.

**Testing**: `node:test` for the pure model functions (building the export
envelope, validating an incoming envelope, rebuilding a project from one
with ids regenerated and references remapped) and for the extended
storage-adapter contract suite (`importProject` against both test doubles).
Manual quickstart for the actual file download/picker round trip and
file-name derivation, since browser file I/O isn't unit-testable under
plain Node.

**Target Platform**: Modern desktop browsers over a static HTTP server — unchanged.

**Project Type**: Single-page, client-only static web app.

**Performance Goals**: Exporting/importing a project with dozens of card
types and hundreds of cards completes in under 5 seconds (per SC-002),
comfortably met by a single synchronous JSON serialize/parse pass.

**Constraints**: No build step; must not regress Slices 1–5. Export format
must be plain, human-readable structured text (FR-003a) — ruling out any
binary or encoded envelope. Import must never mutate or merge into an
existing project (FR-005) and must reject anything that isn't a recognizable
project export without leaving partial state behind (FR-007, SC-003).

**Scale/Scope**: Single local user; one project exported or imported per
action (bulk export/import of multiple projects is out of scope per the
spec's Assumptions).

**Delivery conventions (from the user)**: small incremental commits that
each leave the app loadable for git auto-deploy; bump the `?v=` suffix in
every commit that changes served scripts or stylesheets (currently `?v=21`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|---|---|---|
| I. Vanilla Web Stack Only | `Blob`, object URLs, `<a download>`, `<input type="file">`, `JSON.stringify`/`parse` — all native, zero dependencies. | PASS |
| II. Small, Focused Files | Envelope build/validate/rebuild logic, the download helper, and the file-picker wiring are each a separate small module. | PASS |
| III. HTML-First Visual Composition | The export/import buttons and hidden file input live in `project-list.html`; JS only wires events and triggers the download/read, never builds DOM structure. | PASS |
| IV. Self-Explanatory Code, Minimal Comments | No narration comments planned; the one non-obvious comment carried over from `duplicateProject`'s id-remapping precedent will be referenced, not re-explained. | PASS |

Post-design re-check: PASS. Complexity Tracking not applicable.

## Project Structure

### Documentation (this feature)

```text
specs/006-project-export-import/
├── plan.md               # This file
├── research.md           # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/
│   └── project-export-format.md
└── tasks.md              # /speckit-tasks — not created here
```

### Source Code (repository root)

```text
js/
├── models/
│   └── project-export.mjs      # NEW: buildExportEnvelope, validateExportEnvelope, buildProjectFromImport
├── storage/
│   ├── storage-adapter.mjs     # + importProject(exportedData) contract method
│   └── indexeddb-adapter.mjs   # + importProject implementation
└── views/
    └── project-list/
        ├── project-list.html   # + Export/Import buttons, hidden file input, per-item Export button
        └── project-list.mjs    # + download-file helper call, file-read + import wiring

css/styles.css                  # + minor styling for the new buttons (reuse existing button classes where possible)

tests/
├── support/
│   ├── in-memory-adapter.mjs    # + importProject
│   └── array-store-adapter.mjs  # + importProject
└── unit/
    ├── project-export.test.mjs       # NEW: envelope build/validate/rebuild, id remap, name collision, dangling deck refs
    └── storage-adapter.contract.test.mjs  # + importProject cases (both adapters)
```

**Structure Decision**: One new pure model file (`project-export.mjs`) holds
every decision that can be wrong (envelope shape, validation, id
remapping) so it is fully unit-tested without a browser, mirroring how
`sheet-layout.mjs` and `print-selection.mjs` were split out for Slice 5.
The storage adapter gains exactly one new method, consistent with the
original requirement that all storage access stay behind the swappable
adapter contract. `importProject` validates its own input (mirroring
`saveCardType`'s existing self-validating precedent) rather than trusting
the view layer alone, so the adapter stays the final authoritative gate on
its own inputs. The project-list view only wires buttons/inputs to that
model and to `storage.importProject`/`storage.getProject` — no new view
folder is needed since this is a project-list-level action, not a new
screen.

## Complexity Tracking

Not applicable — no constitution violations.
