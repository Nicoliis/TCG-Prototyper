# Data Model: Projects + Card Types (core)

## Project

Independent container for one prototype.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Generated, stable identity. |
| `name` | string | Non-empty; unique among all projects (FR-018). |
| `cardTypes` | CardType[] | Owned collection; deleted with the project. |
| `createdAt` / `updatedAt` | timestamp | For ordering/debugging only, not user-facing in this slice. |

**Rules**: Create/rename/delete/duplicate (FR-001–FR-005). Duplicating a
project deep-copies every `CardType` with new ids, leaving the original
untouched (FR-003). Deleting a project removes all its card types (FR-005).

## CardType

A named template within a project.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Generated, stable identity. |
| `name` | string | Non-empty; unique within its project (FR-008, FR-018). |
| `width`, `height` | number (px) | This card type's own physical size (FR-014a). |
| `properties` | Property[] | Named attributes available to templates. |
| `elements` | (TextDisplay \| ImageDisplay \| Label \| ImageIcon)[] | The layout, in no particular order (positions are explicit). |

## Property

| Field | Type | Notes |
|---|---|---|
| `id` | string | Generated. |
| `name` | string | Non-empty; unique within its card type; referenced as `{name}` in templates (FR-009, FR-010). |
| `sampleValue` | string | Used only for preview rendering (FR-015); may be empty. |

## Layout element base shape

Every element on a layout shares a position/size, independent of its kind
(FR-014):

| Field | Type | Notes |
|---|---|---|
| `id` | string | Generated. |
| `x`, `y` | number (px) | Top-left corner, relative to the card type's canvas. |
| `width`, `height` | number (px) | Element's own size. |
| `rotation` | number (degrees, 0-360) | Clockwise rotation around the element's own center. Defaults to 0; normalized into [0, 360) on write. |

### TextDisplay (extends base)

| Field | Type | Notes |
|---|---|---|
| `kind` | `"text"` | |
| `template` | string | Literal text with `{propertyName}` tokens (FR-010), e.g. `"{atk}/{def}"`. |

**Validation**: Tokens referencing a property that no longer exists render
as empty for that token rather than failing (Edge Cases).

### ImageDisplay (extends base)

| Field | Type | Notes |
|---|---|---|
| `kind` | `"image"` | |
| `template` | string | Literal text with `{propertyName}` tokens resolved into an image location (FR-011), e.g. `"https://myurl.com/{imgurl}"`. |

**Validation**: A resolved location that fails to load renders a
placeholder, never a broken layout (Edge Cases/SC-005).

### Label (extends base)

| Field | Type | Notes |
|---|---|---|
| `kind` | `"label"` | |
| `text` | string | Fixed text, no property substitution (FR-012). |

### ImageIcon (extends base)

| Field | Type | Notes |
|---|---|---|
| `kind` | `"icon"` | |
| `src` | string | Fixed image location, no property substitution (FR-013). |

## Relationships

```text
Project 1 ──* CardType 1 ──* Property
                        1 ──* (TextDisplay | ImageDisplay | Label | ImageIcon)
```

A `CardType` belongs to exactly one `Project`. A `Property` belongs to
exactly one `CardType`, as does every layout element. Nothing in this slice
references another `CardType` or `Project`.

## Validation rules summary (from spec Functional Requirements)

- Project name: non-empty, unique across all projects (FR-018).
- CardType name: non-empty, unique within its project (FR-008, FR-018).
- Property name: non-empty, unique within its card type (implied by
  template token resolution needing unambiguous names).
- `width`/`height` on CardType and on every layout element: positive
  numbers.
