# Feature Specification: Card Editor Precision & Visual Polish

**Feature Branch**: `002-card-editor-polish`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "We will improve the card editor. The edition
should be one element at a time. All editable parameters should be listed
with their values on screen for 'precision editing' (x,y,rotation,width,
height,etc etc). The element should have toggable 'background', 'borders',
'shadow' with options to personalize them (color, thickness). We have a lot
of dead space in all the page, the elements should feel less crammed without
adding a bunch of margin without reason. Buttons should look nicer. Elements
should look nicer. This screams 'I know 0 css', instead of 'this is your
playground, enjoy'."

## Clarifications

### Session 2026-10-12

- Q: Should the old canvas-wide Edit/See mode toggle be removed now that
  selecting an element shows its own editing controls? → A: Yes, remove
  it — deselecting already shows the clean, accurate preview.
- Q: Should the visual redesign cover the whole app or just the card-type
  editor screen? → A: Whole app — project list, card-type list, and editor
  all get the same restyle.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select one element and edit it precisely (Priority: P1)

A designer clicks a single layout element on the card canvas. A properties
panel appears showing every editable parameter of that element — position
(x, y), size (width, height), rotation, and its content (the text/image
template or static value) — each with its current value, editable by typing
an exact number or text instead of only dragging by hand.

**Why this priority**: Precise placement (e.g., "x = 120, not approximately
120") is the core capability this feature exists to deliver; everything else
builds on having a reliable, single-target editing surface.

**Independent Test**: Can be fully tested by clicking an element, confirming
the panel shows its current x/y/width/height/rotation/content, changing one
value by typing, and confirming the element updates on the canvas to match
exactly.

**Acceptance Scenarios**:

1. **Given** a card type with multiple layout elements, **When** the user
   clicks one element, **Then** that element becomes selected and a
   properties panel shows its current x, y, width, height, rotation, and
   content values.
2. **Given** an element is selected, **When** the user types a new value
   into any property field, **Then** the element on the canvas immediately
   reflects that exact value.
3. **Given** an element is selected, **When** the user drags, resizes, or
   rotates it directly on the canvas, **Then** the properties panel's
   values update to match.
4. **Given** an element is selected, **When** the user clicks a different
   element, **Then** the panel switches to show only the newly selected
   element's values — never more than one element's values at once.
5. **Given** an element is selected, **When** the user clicks empty canvas
   space (or deletes the selected element), **Then** the element is
   deselected, the panel no longer shows any element's properties, and the
   canvas shows every element rendered with its real value, with no
   selection outline or handles on anything.

---

### User Story 2 - Personalize an element's background, border, and shadow (Priority: P2)

With an element selected, the designer turns on a background and picks a
color, turns on a border and picks a color and thickness, and turns on a
shadow and picks a color and thickness — each independently toggle-able,
each remembered as part of that element's layout.

**Why this priority**: Extends precision editing to an element's appearance,
not just its geometry; depends on User Story 1's selection/panel existing.

**Independent Test**: Can be fully tested by selecting an element, enabling
its border with a custom color and thickness, reloading the project, and
confirming the border is still there with the same color and thickness.

**Acceptance Scenarios**:

1. **Given** an element is selected, **When** the user enables its
   background and picks a color, **Then** the element renders with that
   background color.
2. **Given** an element is selected, **When** the user enables its border
   and sets a color and thickness, **Then** the element renders with a
   border of that color and thickness.
3. **Given** an element is selected, **When** the user enables its shadow
   and sets a color and thickness, **Then** the element renders with a
   drop shadow of that color and thickness.
4. **Given** any of background/border/shadow is turned off, **When** the
   element renders, **Then** that particular effect is not shown, regardless
   of what color/thickness was previously set for it.
5. **Given** background/border/shadow settings were made, **When** the
   project is reloaded, **Then** those settings are unchanged.

---

### User Story 3 - A visually coherent, intentionally designed app (Priority: P3)

A user opens the app and its screens (project list, card type list, card
type editor) look like a deliberately designed tool: buttons have a
considered look and feel, spacing is purposeful rather than either cramped
or full of unexplained empty space, and nothing looks like unstyled default
browser markup.

**Why this priority**: Valuable but independent of the precision-editing
mechanics in User Stories 1-2; can be delivered as a visual pass once the
new editor structure (panel, canvas) exists to be styled.

**Independent Test**: Can be fully tested by viewing each of the three main
screens and confirming every interactive control has a deliberate style
(not browser-default appearance) and no screen has a large empty region with
no content or purpose.

**Acceptance Scenarios**:

1. **Given** any of the three main screens, **When** the user views it,
   **Then** every button shares a consistent, deliberately styled
   appearance (not unstyled default browser button styling).
2. **Given** any of the three main screens, **When** the user views it at
   a typical desktop window size, **Then** content is arranged to use the
   available space with intentional spacing — no large empty regions and no
   visually cramped clusters of controls.

---

### Edge Cases

- What happens when the selected element is deleted while selected? (It is
  deselected automatically; the panel clears.)
- What happens when a property field is left blank or given an invalid
  value (e.g., negative width)? (Rejected with a validation message,
  consistent with existing element validation; the last valid value is
  kept.)
- What happens when background, border, and shadow are all enabled at once
  on the same element? (All three render together.)
- What happens to existing elements created before this feature, which have
  no background/border/shadow settings saved? (They render exactly as
  before: no background, no border beyond the existing default outline
  treatment, no shadow — i.e., all three default to off.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST let users select exactly one layout element at a
  time by clicking it on the card canvas.
- **FR-002**: System MUST show, for the selected element, a properties
  panel listing its current x, y, width, height, rotation, and content
  (template/text/image source, depending on element kind) as editable
  fields.
- **FR-003**: System MUST apply a change made in the properties panel to
  the element immediately and visibly on the canvas.
- **FR-004**: System MUST keep the properties panel's displayed values in
  sync when the element is instead changed by dragging, resizing, or
  rotating it directly on the canvas.
- **FR-005**: System MUST ensure only one element's properties are shown
  and editable at any time; selecting a different element replaces the
  panel's content rather than adding to it.
- **FR-006**: System MUST let users deselect the current element (e.g., by
  clicking empty canvas space), after which no element is selected, the
  panel shows no element's properties, and the canvas shows every element
  at its real rendered value with no selection outline or editing handles
  visible on any element. This fully replaces the previous separate
  canvas-wide Edit/See mode toggle.
- **FR-007**: System MUST let users independently toggle a background,
  a border, and a shadow on the selected element, each on or off
  separately from the others.
- **FR-008**: System MUST let users set a color for an enabled background.
- **FR-009**: System MUST let users set a color and a thickness for an
  enabled border.
- **FR-010**: System MUST let users set a color and a thickness for an
  enabled shadow.
- **FR-011**: System MUST persist each element's background/border/shadow
  settings (on/off state and their color/thickness values) so they survive
  reloading the project, the same as its other properties.
- **FR-012**: System MUST render elements created before this feature with
  background, border, and shadow all off by default, preserving their
  prior appearance.
- **FR-013**: System MUST apply a single, deliberately designed visual
  style (buttons, spacing, color palette) consistently across the project
  list, card type list, and card type editor screens.
- **FR-014**: System MUST arrange each of these screens' content so that
  available space is used with intentional spacing, avoiding both visually
  cramped control clusters and large unexplained empty regions.

### Key Entities

- **Layout Element** (extends the existing Display/Label/Image-Icon
  entity): gains a `selected` state (exactly one element per card type can
  be selected at a time, transient — not persisted) and a style block
  covering background, border, and shadow.
- **Element Style**: Three independent togglable effects on a layout
  element:
  - **Background**: on/off, color.
  - **Border**: on/off, color, thickness.
  - **Shadow**: on/off, color, thickness.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can set an element's exact position, size, and
  rotation by typing values, with zero reliance on freehand dragging, for
  100% of an element's geometry properties.
- **SC-002**: Selecting any element shows all of its editable parameters
  within one interaction (a single click), with no additional navigation.
- **SC-003**: A user can enable and customize an element's background,
  border, and shadow independently, and all three settings survive a
  project reload unchanged, verified across 100% of tested cases.
- **SC-004**: Across the project list, card type list, and card type editor
  screens, 100% of buttons share one consistent, deliberately styled
  appearance rather than unstyled browser defaults.
- **SC-005**: On each of the three main screens at a typical desktop window
  size, every control is reachable without scrolling, and no single empty
  region exceeds a third of the visible content area.

## Assumptions

- The per-element properties panel covers layout elements (text/image
  displays, labels, images/icons) only; the card type's own overall width
  and height keep using the existing dedicated form from Slice 1, which
  this feature restyles but does not functionally change.
- "Thickness" for a border means its stroke width in pixels; "thickness"
  for a shadow means its blur size in pixels. Both are plain numeric
  inputs with the same validation style as other numeric properties
  (positive numbers).
- Background/border/shadow apply uniformly to all four element kinds (text
  display, image display, label, image/icon) — there is no kind-specific
  restriction on which effects are available.
- Color values are chosen via the browser's native color input, consistent
  with keeping the project framework-free.
- This feature does not change the underlying freeform x/y/width/height/
  rotation data model from Slice 1 beyond adding the style block; it
  changes how that data is edited and how elements are presented, not
  what data exists per element.
