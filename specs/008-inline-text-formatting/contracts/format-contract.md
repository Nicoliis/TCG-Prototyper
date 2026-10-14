# Contracts

## `js/templating/format-text.mjs`
`parseFormatted(text: string): Segment[]` — pure, total, DOM-free (see data-model.md).

| Input | Output (visible text and style) |
|---|---|
| `Hello **world**` | `Hello ` plain, `world` bold |
| `*a* and __b__` | `a` italic, ` and ` plain, `b` underline |
| `***x***` | `x` bold+italic |
| `**__x__**` | `x` bold+underline |
| `un**believ**able` | `un` plain, `believ` bold, `able` plain |
| `**one\ntwo**` | `one\ntwo` bold (pair spans line break) |
| `**unfinished` | `**unfinished` plain |
| `2 * 3 * 4` | `2 * 3 * 4` plain |
| `****`, `__ __` | unchanged, plain |
| `\*literal\*` | `*literal*` plain |
| `_x_` | `_x_` plain |

## `js/views/card-type-editor/formatted-text.mjs`
`renderFormatted(container: Element, text: string): void` — replaces container children with text nodes and `<span class="fmt-bold|fmt-italic|fmt-underline">` runs; uses text nodes only (no HTML parsing).

## `renderPreview(node, element, values)` (existing)
- text element: `renderFormatted(content, substitute(element.template, values))`
- label element: `renderFormatted(content, element.text)`
- image / icon elements: unchanged.

## UI
- Element properties panel shows a one-line marker hint next to the template/text field.
