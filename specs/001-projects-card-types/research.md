# Phase 0 Research: Projects + Card Types (core)

All Technical Context items were decidable from the constitution and spec
without open unknowns. This records the decisions and the alternatives
rejected for each.

## Storage engine behind the abstraction

**Decision**: IndexedDB, wrapped by `js/storage/indexeddb-adapter.mjs`
implementing the `storage-adapter.mjs` contract.

**Rationale**: Projects and card types are structured objects (nested
properties, displays, positions) that need to survive reloads. IndexedDB
stores structured data natively (no manual JSON stringify size limits) and
has effectively no practical size ceiling for this app's scale. The storage
abstraction (FR-017) means this choice is isolated to one file.

**Alternatives considered**:
- `localStorage` — rejected as primary store: string-only (requires
  manual serialization of every write/read) and capped around 5MB, which
  is fine today but a worse foundation; still trivial to add later as an
  alternate adapter behind the same contract if ever wanted.
- Remote/server-backed storage — rejected: out of scope for this
  slice (no backend; Assumptions explicitly state local/offline use).

## Module loading without a build step

**Decision**: Native ES modules via `<script type="module" src="...">`,
one module per file.

**Rationale**: Browser-native, zero tooling, and gives the small/focused
file structure the constitution requires without needing a bundler to
stitch files together.

**Alternatives considered**:
- Global `<script>` tags with implicit globals — rejected: no namespacing,
  encourages large catch-all files, harder to keep each file single-purpose.
- A bundler (Webpack/Vite/esbuild) — rejected outright by Principle I
  (no build tools).

## HTML-first fragment composition

**Decision**: Each view is a standalone `.html` file containing a
`<template>` element; a small loader `fetch()`es the fragment once, then
`content.cloneNode(true)` is inserted into the view's mount point. JS only
sets text/attribute values and event listeners on the cloned markup.

**Rationale**: Directly satisfies Principle III — the structure lives in
HTML, not in `createElement`/`innerHTML` calls. Requires the app to be
served over HTTP (not opened via `file://`), which is already the plan's
Target Platform assumption and is a one-line local static server, not a
build step.

**Alternatives considered**:
- Inline `<template>` blocks all living inside one `index.html` — rejected:
  would grow `index.html` into a large multi-concern file, conflicting with
  Principle II.
- Building elements via `document.createElement` in JS — rejected directly
  by Principle III.

## Testing approach without a framework dependency

**Decision**: Node's built-in `node:test` + `assert` module for unit tests
of pure logic (storage adapter contract — run once per adapter implementation,
card type/project validation, `{token}` template substitution). UI/visual
behavior is verified manually via `quickstart.md`.

**Rationale**: Ships with Node, adds zero dependencies, and keeps logic that
has nothing to do with the DOM testable headlessly. Introducing a browser
test automation framework (Playwright/Cypress) would add a dependency not
justified by this slice's scope.

**Alternatives considered**:
- No automated tests at all — rejected: the storage abstraction's whole
  point (FR-017/SC-004) is verifiable by running the same contract test
  against two different adapters; that needs an automated check, not just
  manual inspection.
- A browser-based test runner — deferred: can be revisited in a later
  slice if DOM-heavy logic grows complex enough to need it.

## Layout element positioning model

**Decision**: Each positioned element (display, label, icon) stores
`x, y, width, height` in CSS pixels relative to the card type's own
canvas, which is sized to that card type's configured width/height
(absē-positioned `div`s inside a relatively-positioned canvas container).

**Rationale**: Matches the clarified "freeform" decision and the clarified
per-card-type sizing decision; pixel coordinates are the simplest unit that
requires no additional unit-conversion logic in this slice (CW/CH units are
introduced later, for the Playing Field Designer slice).

**Alternatives considered**: Percentage-based coordinates — deferred, not
rejected; pixels are simpler for v1 and a future adapter/migration could
convert if resizing-relative layouts become a need.
