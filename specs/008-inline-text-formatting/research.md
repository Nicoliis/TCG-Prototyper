# Research: Inline Text Formatting

## 1. Library vs hand-written parser
- **Decision**: Hand-written, single-pass parser (`parseFormatted`).
- **Rationale**: Only three markers plus escape; no dependency (constitution I); full control over the clarified rules (mid-word, multi-line, literal fallbacks). A markdown library would also interpret headings, links, HTML — violating FR-012.
- **Alternatives**: Markdown library (too broad, extra dependency); regex replace to HTML (unsafe, nesting bugs).

## 2. Where formatting is applied
- **Decision**: At render time in `renderPreview`, after `substitute(template, values)` for text elements and on `element.text` for labels. Image/icon branches untouched (FR-011).
- **Rationale**: `renderPreview` is already shared by the editor canvas, Edit card and print (`render-card.mjs`), giving FR-009 with one change. Parsing after substitution makes markers inside card values work (FR-003).
- **Alternatives**: Format values at save time (would alter stored data, violating FR-004/FR-005).

## 3. Marker grammar
- **Decision**:
  - Markers: `**` bold, `*` italic, `__` underline. `_` alone is ordinary text.
  - An opener must be followed by a non-space character; a closer must be preceded by a non-space character. Works mid-word and across line breaks.
  - A `\` immediately before `*` or `_` yields the literal character without the backslash; any other backslash is literal.
  - Runs of asterisks: 1 = italic, 2 = bold, 3 = bold+italic (opened as bold then italic, closed italic then bold). Longer runs, and empty pairs like `****`, stay literal.
  - Matching: a closer pairs with the nearest preceding opener of the same type; openers nested above it that are still open become literal. Openers left unmatched at the end become literal.
- **Rationale**: Mirrors common markdown flanking rules users already know, satisfies the clarified answers, and guarantees no characters are ever lost (FR-007).

## 4. Output representation
- **Decision**: Parser returns `[{ text, bold, italic, underline }]`, coalescing adjacent segments with identical style; concatenated text of all segments equals input minus consumed markers/escape backslashes.
- **Rationale**: Pure and trivially testable; the renderer maps segments to spans with classes `fmt-bold`, `fmt-italic`, `fmt-underline`; plain segments are text nodes.

## 5. Rendering and text-fit
- **Decision**: Replace the content's children with text nodes/spans; never use `innerHTML`. Text-fit measures `scrollWidth/Height` of the content container, which still works with inline spans.
- **Rationale**: FR-010, FR-012.

## 6. Discoverability (no toolbar)
- **Decision**: Add a one-line hint under the template/text field in the element properties panel (`**bold**  *italic*  __underline__`).
- **Rationale**: Without a toolbar the syntax must be discoverable in the one place it is authored statically.
