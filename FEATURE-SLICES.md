# Feature Slice Plan

Breakdown of TODO-Features.md into incremental speckit cycles. Each slice runs
the full `/speckit-specify -> /speckit-clarify -> /speckit-plan -> /speckit-tasks -> /speckit-analyze -> /speckit-implement`
chain on its own, in order, and must end in a working, demoable product before
the next slice starts.

Status legend: `[ ]` not started, `[~]` in progress, `[x]` done.

## Slices

- [x] **1. Projects + Card Types (core)** — implemented in `specs/001-projects-card-types/`
  - Project CRUD/storage (create, duplicate, delete), independent per project.
  - Card type properties and layout.
  - Displays: text displays, simple image displays (`{imgurl}` / URL templates).
  - Labels (static values).
  - Images/Icons (static).
  - Demo: create a project, define a card type, see a fully rendered card.

- [x] **2. Card Types — image-list & spritesheet displays**
  - Image list displays: predetermined list, default + input-to-image mapping
    (e.g. attribute icon, background color, card border).
  - Spritesheet slicing: `{imgnumb:templatex}`.
  - Depends on: Slice 1.

- [X] **3. CSV fill**
  - CSV import + minuscule CSV editor.
  - Column -> property mapping; undefined properties left empty.
  - Depends on: Slice 1 (needs card properties to map to).

- [X] **4. Deckbuilding**
  - Named decks; sort cards into N decks.
  - Depends on: Slice 1.

- [X] **5. Proxy printing**
  - Print a single card on demand.
  - Print a full proxy sheet for an entire deck.
  - Depends on: Slice 1, Slice 4 (for deck printing).

- [ ] **6. Playing field designer**
  - Stacks (1x1, face down/face up) and areas (CW x CH sizing).
  - Player areas (mirrored 180 for opponent) vs shared areas.
  - Cell-defined vs free-space areas; public vs private visibility.
  - Consider splitting further into "stacks + player areas" then
    "free-space areas + visibility rules" if it proves too large for one pass.
  - Depends on: Slice 1 (cards exist to place in the field).

- [ ] **7. Online, testing**
  - Share-link P2P playtesting, local state per client.
  - Side selection on join; actions over stacks/areas/hand as listed in
    TODO-Features.md.
  - Depends on: Slice 6.

## Ordering rationale

1 is foundational storage + the first real content (card types) worth
demoing together, since storage alone has nothing to show. 2 and 3 both
build directly on 1's card type/property model. 4 and 5 need cards (and
5 needs decks) to operate on. 6 only needs cards to place, so it could
start as its own track any time after 1, but is kept last-but-one since
7 depends on it.

## How to use this file

When context grows too large mid-slice, re-read this file to recall which
slice is active and what's left, rather than re-deriving scope from
TODO-Features.md. Update status checkboxes as each slice's `implement` step
completes and the result has been verified as a working product.
