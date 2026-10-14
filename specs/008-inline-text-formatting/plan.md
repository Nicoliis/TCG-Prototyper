# Implementation Plan: Inline Text Formatting (Bold, Italic, Underline)

**Branch**: `008-inline-text-formatting` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-inline-text-formatting/spec.md`

## Summary

Add typed-marker inline formatting (`**bold**`, `*italic*`, `__underline__`)
to text and label elements. A new pure, DOM-free parser turns a string into
styled segments; a small renderer fills an element's content with one text
run per segment. Parsing happens at display time, *after* template
substitution, so markers written in templates, labels and card values all
work. Stored data never changes (no migration, export/CSV untouched).

All display paths already funnel through one function,
`renderPreview` in `js/views/card-type-editor/layout-element.mjs`, used by
the card type editor, the Edit card view and print output, so a single
integration point gives FR-009 for free.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2022+), native ES modules — unchanged.

**Primary Dependencies**: None. No markdown library; the grammar is three markers plus a backslash escape.

**Storage**: Unchanged. Raw text with markers is stored as typed.

**Testing**: `node:test` for the pure parser (all marker combinations, nesting, escapes, malformed input, multi-line, mid-word, round-trip of unformatted text). In this environment tests are run in headless Edge via shims for `node:test`/`assert`. Manual quickstart for visual rendering and text-fit.

**Target Platform**: Modern desktop browsers over a static HTTP server — unchanged.

**Project Type**: Single-page, client-only static web app.

**Performance Goals**: Parsing is a single linear scan per text; re-render on each Edit card keystroke stays well under 0.5 s.

**Constraints**: No build step; no `innerHTML` for user text (FR-012: text is only ever inserted as text nodes). Existing text-fit (`applyTextFit`) must keep working. Bump `?v=` (currently `?v=27`) when finishing; commit in small increments.

**Scale/Scope**: Single local user; texts of up to a few hundred characters.

## Constitution Check

| Principle | Check | Result |
|---|---|---|
| I. Vanilla Web Stack Only | Hand-written parser, plain DOM text nodes. | PASS |
| II. Small, Focused Files | New `format-text.mjs` (parser) and `formatted-text.mjs` (renderer) are separate small files; `layout-element.mjs` gains one call. | PASS |
| III. HTML-First Visual Composition | Text runs are inline wrappers for dynamic text content, not component structure; they are created in JS only because the run list is derived from data. | PASS with justification (see Complexity Tracking) |
| IV. Self-Explanatory Code | Parser comments limited to the non-obvious flanking rule. | PASS |

Post-design re-check: PASS.

## Complexity Tracking

| Item | Why needed | Simpler alternative rejected because |
|---|---|---|
| Text runs created with `document.createElement("span")` | A formatted text is an arbitrary-length list of runs derived from data; its structure cannot be authored as static HTML. | Setting `innerHTML` from user text would violate FR-012 (safety); a template per run would force async fragment loading into the synchronous preview path. |

## Project Structure

### Documentation (this feature)

```text
specs/008-inline-text-formatting/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/format-contract.md
```

### Source Code (repository root)

```text
js/templating/
└── format-text.mjs                      # NEW: parseFormatted(text) -> segments (pure)
js/views/card-type-editor/
├── formatted-text.mjs                   # NEW: renderFormatted(container, text)
├── layout-element.mjs                   # renderPreview uses renderFormatted for text and label
└── element-properties-panel.html        # small hint about the markers (content tab)
css/styles.css                           # .fmt-bold / .fmt-italic / .fmt-underline
tests/unit/format-text.test.mjs          # NEW
```

**Structure Decision**: Single static project; one pure module, one tiny view helper, one integration point.
