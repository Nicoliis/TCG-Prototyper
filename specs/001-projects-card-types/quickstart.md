# Quickstart: Projects + Card Types (core)

## Prerequisites

- A current Node.js install (for `node:test` unit tests only — not needed
  to run the app itself).
- Any static file server, e.g. `npx serve .` or `python3 -m http.server`,
  run from the repo root. The app must be loaded over `http://`, not
  `file://` (see research.md: HTML-first fragment composition).

## Run the unit tests

```sh
node --test
```

Expected: all storage-adapter contract, card-type model, and template
substitution tests pass.

## Validate the feature end-to-end (manual)

1. Start a static server from the repo root and open `index.html` in a
   browser. Start a timer: steps 2-9 together should take under 5 minutes
   (SC-001).
2. **Create a project** named `Test Game`. *Expect*: it appears in the
   project list and becomes active (Acceptance Scenario US1.1).
3. **Create a second project** named `Other Game`. Add a card type to it.
   Switch back to `Test Game`. *Expect*: no trace of the other project's
   card type (US1.4, SC-002).
4. In `Test Game`, **create a card type** named `Monster`, set its width
   and height (FR-014a).
5. **Add properties** `name`, `atk`, `def`, `imgurl`.
6. **Add a text display** with template `{atk}/{def}`, positioned
   anywhere on the canvas (FR-010, FR-014).
7. **Add an image display** with template `{imgurl}` (FR-011).
8. **Add a static label** and a **static image/icon** (FR-012, FR-013).
9. **Enter sample values** for each property, including leaving one blank.
   *Expect*: preview renders all elements, the blank property's display
   shows empty rather than erroring (US3, SC-005).
10. **Reload the browser.** *Expect*: `Test Game`, `Monster`, its
    properties, and its layout are all unchanged (FR-016, SC-003).
11. **Duplicate `Test Game`.** Edit the duplicate's `Monster` card type.
    *Expect*: the original `Test Game` → `Monster` is unaffected (FR-003,
    SC-002).
12. **Delete every project**, including the last one. *Expect*: the app
    shows zero projects and prompts to create one, with no error (Edge
    Cases).

## Validate storage swappability (SC-004)

1. Run `node --test`. `tests/unit/storage-adapter.contract.test.mjs` runs
   the identical contract suite against two structurally different
   adapters (`InMemoryAdapter`, Map-backed; `ArrayStoreAdapter`,
   array-backed) — both pass with no test-file changes between them,
   demonstrating the app's project/card-type logic depends only on the
   storage contract, not a specific backend.
2. The production `IndexedDbAdapter` satisfies the same contract (it's
   the adapter wired into `js/app.mjs`) but can't run under plain Node
   (no `indexedDB` global outside a browser); step 10 above — reload the
   browser and see the data persist — is its proof of conformance.
