# Phase 0 Research: Card Editor Precision & Visual Polish

## Selection state ownership

**Decision**: `selectedElementId` lives as a plain local variable in
`card-type-editor.mjs`'s closure — transient UI state, never persisted or
part of the `CardType` shape.

**Rationale**: Matches spec's Key Entities note that selection is
transient. Keeping it local avoids inventing a new persistence concern for
something that resets every time the editor is opened.

**Alternatives considered**: Storing `selected: true` on the element
object — rejected: would leak transient UI state into saved data and
would need clearing on every other element whenever selection changes.

## Properties panel binds once, then updates values

**Decision**: `element-properties-panel.mjs` fetches and clones its
`.html` fragment exactly once at editor-mount time. A `setElement(element,
callbacks)` function updates the already-mounted fields' values and
re-attaches the current element/callbacks in closure; `clear()` shows an
empty-state message instead of the field set.

**Rationale**: Avoids re-fetching/re-cloning the template and re-binding
every input's event listener on every click — selection can change often
during a session. Matches the "mount once, update values" pattern already
used by the card-type properties list in `card-type-editor.mjs`.

**Alternatives considered**: Re-render (clone fresh template + rebind
listeners) on every selection change — rejected: unnecessary churn for a
fixed, small set of fields.

## One generalized content field instead of four kind-specific ones

**Decision**: The panel has a single text field for an element's content
(the text/image template, static label text, or icon URL, depending on
kind), with its `<label>` text and `placeholder` updated by
`setElement()` to match the selected element's kind.

**Rationale**: Only one element is ever selected at a time, so only one
content field is ever shown — four kind-specific sub-templates in the
panel would be dead markup 75% of the time for no benefit.

**Alternatives considered**: Four separate labeled fields shown/hidden by
kind (mirrors the old per-element-kind `<template>` approach) — rejected
as needless duplication now that only one element's fields are visible at
once.

## Color and thickness inputs

**Decision**: Native `<input type="color">` for every color field,
native `<input type="number" min="0">` for every thickness field.

**Rationale**: Zero-dependency, consistent with the existing x/y/width/
height number inputs, and satisfies Principle I.

**Alternatives considered**: A custom color-swatch picker — rejected,
unnecessary complexity and a dependency-free native control already does
the job.

## Click-to-select vs. drag disambiguation

**Decision**: A `pointerdown` directly on an element (not on its resize/
rotate/delete controls) both selects that element and begins the existing
drag-tracking in the same gesture — exactly how design tools conventionally
combine select-and-drag.

**Rationale**: No reason to require a separate "selection click" before a
drag can start; one gesture serving both reduces interaction steps.

**Alternatives considered**: Separate explicit "select" affordance (e.g., a
dedicated select button per element) — rejected as pure friction with no
benefit over click-to-select.

## Deselection replaces the Edit/See toggle

**Decision**: A `pointerdown` whose target is the canvas element itself
(not a child layout-element) clears the selection. With nothing selected,
every element already renders its real value with no handles — identical
to what the removed "See" mode showed. The Edit/See toggle buttons and
their wiring are deleted.

**Rationale**: Confirmed with the user during `/speckit-clarify`; avoids
two overlapping "how do I see the real card" mechanisms.

## Visual design system

**Decision**: Introduce a small set of CSS custom properties at `:root`
in `styles.css` (a spacing scale, a handful of palette colors, a border
radius) and reference them from existing and new rules, rather than
hand-picking pixel values per rule as before.

**Rationale**: Gives "nicer, consistent" styling a single source of truth
that's maintainable without a preprocessor — native CSS variables require
no build tooling, satisfying Principle I.

**Alternatives considered**: A CSS framework/utility library (e.g.
Tailwind) — rejected outright by Principle I (no frameworks).
