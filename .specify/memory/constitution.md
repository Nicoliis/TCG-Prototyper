<!--
Sync Impact Report
==================
Version change: TEMPLATE → 1.0.0 (initial ratification)
Modified principles: n/a (first concrete adoption from placeholder template)
Added sections:
  - I. Vanilla Web Stack Only
  - II. Small, Focused Files
  - III. HTML-First Visual Composition
  - IV. Self-Explanatory Code, Minimal Comments
  - Technology Constraints
  - Governance
Removed sections: none
Deferred placeholders: none — all template tokens resolved.
Follow-up TODOs: none
-->

# Cardgame Prototyper Constitution

## Core Principles

### I. Vanilla Web Stack Only
The project is built exclusively with HTML, CSS, and JavaScript. No build tools,
transpilers, bundlers, or UI frameworks (React, Vue, etc.) MAY be introduced.
Any script runs directly in the browser as authored.

Rationale: Keeps the project dependency-free, instantly runnable, and approachable
without a build pipeline.

### II. Small, Focused Files
Every HTML and JavaScript file MUST have a single, clear responsibility and stay
small. When a file accumulates unrelated concerns or grows unwieldy, it MUST be
split into smaller files rather than extended in place. CSS is exempt from the
size constraint and MAY be consolidated into larger stylesheets, since styling
rules benefit from centralization and shared context.

Rationale: Small, focused files are easier to locate, reason about, and modify
without side effects, while CSS commonly needs shared scope (variables, resets,
cascade order) that favors fewer, larger files.

### III. HTML-First Visual Composition
Visual elements (cards, panels, layout sections, UI widgets) MUST be defined as
HTML markup — in dedicated `.html` fragments/templates or inline markup — rather
than constructed element-by-element through DOM APIs in JavaScript
(`createElement`, `innerHTML` string-building for whole components, etc.).
JavaScript MAY populate data into existing markup (text content, attributes,
clone a template) but MUST NOT be the primary author of an element's structure.

Rationale: HTML markup is more readable, more easily previewed, and easier to
restyle than structure assembled imperatively in JavaScript.

### IV. Self-Explanatory Code, Minimal Comments
Code MUST be written so that naming and structure communicate intent without
narration. Comments MUST be kept to a minimum and used only to explain
non-obvious rationale (a workaround, a subtle constraint) — never to restate what
the code already shows.

Rationale: Over-commented code rots as behavior changes; clear naming and
structure stay accurate by construction.

## Technology Constraints

No server-side runtime, package manager, or framework dependency may be added
without amending this constitution first. All features ship as static HTML/CSS/JS
assets that run directly in a browser.

## Governance

This constitution supersedes any conflicting project convention. Amendments
require: (1) the change documented in this file, (2) a version bump per the
rules below, (3) the Sync Impact Report updated at the top of this file.

Versioning policy (semantic):
- MAJOR: backward-incompatible principle removal or redefinition.
- MINOR: a new principle or materially expanded guidance added.
- PATCH: wording clarifications, typo fixes, non-semantic refinements.

All code review and implementation work MUST verify compliance with these
principles. Any deviation must be justified in the relevant plan/spec and
resolved by either conforming the work or amending this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-10-12 | **Last Amended**: 2026-10-12
