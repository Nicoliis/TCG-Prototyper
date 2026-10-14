# Tasks: Inline Text Formatting (Bold, Italic, Underline)

**Input**: Design documents from `/specs/008-inline-text-formatting/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/format-contract.md

**Tests**: Unit tests for the pure parser (`node --test tests/unit`; in this environment run in headless Edge via shims). Visual behaviour is validated via quickstart.md.

**Conventions**: Make a small commit after each task or tight group (app loadable at every commit, commit messages end with the Co-Authored-By line). Keep `?v=` unchanged in feature commits and bump it (currently `?v=27`) in the final commit.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: US1 = format with markers, US2 = templates and card values, US3 = literal and malformed cases

## Phase 1: Setup

- [ ] T001 Confirm baseline: run the unit tests (headless Edge shim runner) and note all pass before changes

---

## Phase 2: Foundational

**Purpose**: The pure parser that every story depends on.

- [ ] T002 Create `js/templating/format-text.mjs` exporting `parseFormatted(text)` per `contracts/format-contract.md`: markers `**`, `*`, `__`; opener needs a following non-space, closer a preceding non-space; works mid-word and across line breaks; asterisk runs of 1/2/3 map to italic/bold/bold+italic; backslash before `*` or `_` yields the literal character; unmatched, empty, space-adjacent and longer runs stay literal; adjacent same-style segments are coalesced; never throws
- [ ] T003 Create `tests/unit/format-text.test.mjs` covering every row of the contract table plus: empty string returns `[]`, unformatted text returns one plain segment, HTML-like input such as `<b>x</b>` and `&amp;` stays literal text, concatenated segment text equals input minus consumed markers and escape backslashes, `_x_` stays literal, mismatched nesting leaves the inner opener literal

**Checkpoint**: Parser complete and tested.

---

## Phase 3: User Story 1 - Format part of a text with markers (Priority: P1) 🎯 MVP

**Goal**: Marked words display formatted on cards, markers hidden.

**Independent Test**: Quickstart steps 1 and 3.

- [ ] T004 [US1] Create `js/views/card-type-editor/formatted-text.mjs` exporting `renderFormatted(container, text)`: replace the container's children with text nodes and `span.fmt-bold` / `span.fmt-italic` / `span.fmt-underline` runs built from `parseFormatted` (text nodes only, never `innerHTML`)
- [ ] T005 [P] [US1] Add `.fmt-bold`, `.fmt-italic`, `.fmt-underline` rules to `css/styles.css`
- [ ] T006 [US1] In `js/views/card-type-editor/layout-element.mjs` make `renderPreview` call `renderFormatted` for label elements (`element.text`) and text elements (`substitute(element.template, values)`); leave image and icon branches untouched

**Checkpoint**: Labels and text elements show formatting in the editor, Edit card and print (single shared render path).

---

## Phase 4: User Story 2 - Templates and card values (Priority: P1)

**Goal**: Formatting works for static template text and for card values, with raw markers kept in storage and inputs.

**Independent Test**: Quickstart steps 2, 6, 7 and 10.

- [ ] T007 [US2] Verify end to end (headless browser smoke test, as for feature 007) that a template `**ATK** {atk}` and a card value `**Flying** creatures gain *+1*` render formatted live in the card type editor preview, Edit card and print output, while the Edit card input, card table cell and stored value keep the raw markers, and that image and icon elements (including a template like `https://x/**a**.png`) are not formatted; fix any path that bypasses `renderPreview`
- [ ] T008 [P] [US2] Add unit tests proving CSV import and project export/import keep marker text unchanged by extending `tests/unit/import-cards.test.mjs` and `tests/unit/project-export.test.mjs`
- [ ] T009 [US2] Add a one-line hint (`**bold**  *italic*  __underline__`) beside the template and label text fields in `js/views/card-type-editor/element-properties-panel.html`

**Checkpoint**: Both static and per-card formatting work and no stored data changes.

---

## Phase 5: User Story 3 - Literal and malformed cases (Priority: P2)

**Goal**: Ordinary text is never damaged; literals can be shown.

**Independent Test**: Quickstart steps 5 and 9.

- [ ] T010 [US3] Verify in the browser that `2 * 3 * 4`, `**unfinished`, `\*literal\*`, `_x_`, `****`, `__ __` and `<b>x</b>` display as the contract specifies in the preview and Edit card; fix parser or renderer if any case differs
- [ ] T011 [US3] Verify text-fit (shrink, squash, wrap) still fits formatted text and that texts without markers look identical to before (quickstart steps 8 and 9); fix `js/views/card-type-editor/text-fit.mjs` interaction only if it regressed

---

## Phase 6: Polish

- [ ] T012 Run the full unit-test suite and walk through every step of `quickstart.md`; fix regressions in earlier features (decks, print, export/import, Edit card)
- [ ] T013 Bump `?v=` suffix app-wide (27 → 28) and record feature 008 as complete in `FEATURE-SLICES.md` in the final commit

---

## Dependencies & Execution Order

- T001 → T002 → T003 → US1 (T004–T006) → US2 (T007–T009) → US3 (T010–T011) → Polish.
- T005 is independent of T004 and T006 (CSS only).
- T008 and T009 are independent of each other and of T007.
- US3 only verifies and refines behaviour already provided by the parser (T002) and renderer (T004–T006).

### Parallel opportunities

- T005 with T004.
- T008 with T009.

## Implementation Strategy

- **MVP**: Phases 1–3 (parser, renderer, label/text formatting everywhere).
- Commit after each phase (or each task for T002–T006), keeping the app loadable, finishing with the version-bump commit.
