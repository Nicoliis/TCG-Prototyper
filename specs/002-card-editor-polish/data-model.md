# Data Model: Card Editor Precision & Visual Polish

This extends `specs/001-projects-card-types/data-model.md`'s Layout
Element base shape. No existing field changes meaning; `style` is new.

## Layout Element (updated)

| Field | Type | Notes |
|---|---|---|
| `id`, `kind`, `x`, `y`, `width`, `height`, `rotation` | *(unchanged, see Slice 1)* | |
| `template` / `text` / `src` | *(unchanged, kind-dependent, see Slice 1)* | |
| `style` | ElementStyle | New. Defaults applied so pre-existing elements behave exactly as before (Edge Cases, FR-012). |

**Transient, not persisted**: a `selectedElementId` exists only in the
editor's in-memory UI state (see research.md) — no element carries a
`selected` field in storage.

## ElementStyle (new)

| Field | Type | Notes |
|---|---|---|
| `background.enabled` | boolean | Default `false` (FR-012). |
| `background.color` | string (CSS color) | Default `"#ffffff"`. Ignored when `enabled` is `false`. |
| `border.enabled` | boolean | Default `false`. |
| `border.color` | string (CSS color) | Default `"#000000"`. |
| `border.thickness` | number (px, > 0) | Default `1`. |
| `shadow.enabled` | boolean | Default `false`. |
| `shadow.color` | string (CSS color) | Default `"#000000"`. |
| `shadow.thickness` | number (px, > 0) | Blur size (research.md/spec Assumptions). Default `4`. |

**Validation**: `thickness` fields reject non-positive values, consistent
with `width`/`height` validation in Slice 1's `card-type.mjs`. `color`
fields accept any non-empty string (the native color input always supplies
a valid `#rrggbb` value, so no further parsing/validation is needed).

## Relationships

Unchanged from Slice 1 — `ElementStyle` is an embedded sub-object of a
Layout Element, not a separate persisted entity.
