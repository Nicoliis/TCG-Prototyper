# Feature Specification: Deckbuilding

**Feature Branch**: `004-deckbuilding`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "Start with feature 4 (Deckbuilding) from
FEATURE-SLICES.md and TODO-Features.md: a deckbuilding section where cards
can be sorted into N decks that can be named. Depends on: Slice 1 (cards
exist via Slice 3's card table)."

## Clarifications

### Session 2026-10-13

- Q: Can the same card be in several decks at once, or at most one? → A:
  Many decks, each with its own independent copy count (FR-006 confirmed).
- Q: Can a deck hold cards from any card type, or only one? → A: Any of the
  project's card types (FR-004 confirmed); no per-deck card type restriction.
- Q: Should decks cap how many copies of a card they can hold? → A: No
  limits or rule checks; any whole number of copies is allowed (FR-005
  confirmed).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create, name and manage decks (Priority: P1)

A designer opens a new "Decks" section of a project and sees the list of
that project's decks. They can create a deck by giving it a name, rename
it, and delete it. Each project has its own independent set of decks.

**Why this priority**: Named decks are the container everything else in
this feature depends on, and are demonstrable on their own (a project with
several named decks).

**Independent Test**: Can be fully tested by creating three decks with
different names in one project, renaming one, deleting one, reloading the
app, and confirming exactly the two remaining decks exist with the
expected names — and that a second project is unaffected.

**Acceptance Scenarios**:

1. **Given** a project with no decks, **When** the user creates a deck
   named "Starter", **Then** a deck named "Starter" appears in that
   project's deck list, empty.
2. **Given** an existing deck, **When** the user renames it, **Then** it
   shows the new name and keeps all of its cards.
3. **Given** an existing deck, **When** the user deletes it, **Then** the
   deck is gone from the list and none of the project's cards are deleted.
4. **Given** two projects, **When** a deck is created in one, **Then** the
   other project's deck list is unchanged.
5. **Given** a deck name that is empty or already used by another deck in
   the same project, **When** the user tries to create or rename a deck
   with it, **Then** the app refuses and explains why.
6. **Given** decks exist, **When** the user leaves and reopens the
   application, **Then** every deck and its name are exactly as left.

---

### User Story 2 - Sort cards into a deck (Priority: P2)

Inside a deck, the designer sees which cards are in it and can add cards
from the project's cards (across all of the project's card types), choose
how many copies of each card the deck holds, change that number, and remove
cards from the deck. A card can be in several decks at once; changing one
deck never changes another.

**Why this priority**: This is the actual "sort cards into decks" value —
it makes decks useful — but needs User Story 1's decks to exist first.

**Independent Test**: Can be fully tested by adding two different cards to
a deck (one with 3 copies), confirming the deck lists both with the right
copy counts, adding one of those cards to a second deck with a different
count, and confirming the first deck is unchanged.

**Acceptance Scenarios**:

1. **Given** an empty deck and a project with cards, **When** the user adds
   a card to the deck, **Then** the deck lists that card with 1 copy.
2. **Given** a card already in a deck, **When** the user sets its copy
   count to 3, **Then** the deck lists it with 3 copies.
3. **Given** a card in a deck, **When** the user sets its copies to 0 or
   removes it, **Then** the card no longer appears in that deck but still
   exists in the project and in any other deck.
4. **Given** a card in deck A, **When** the user adds it to deck B,
   **Then** it appears in both, each with its own independent copy count.
5. **Given** a deck, **When** the user views it, **Then** they see its
   total card count (sum of all copies) and the number of distinct cards.
6. **Given** decks with cards, **When** the user leaves and reopens the
   application, **Then** every deck's cards and copy counts are exactly as
   left.

---

### User Story 3 - Find cards and keep decks consistent (Priority: P3)

While building a deck, the designer can narrow the list of available cards
(for example by card type or by searching card text) so large card pools
stay manageable. If a card is deleted from the project, it disappears from
every deck that held it, and the deck's totals update.

**Why this priority**: Convenience and integrity refinements — decks work
without them, but they make larger projects practical and prevent decks
pointing at cards that no longer exist.

**Independent Test**: Can be fully tested by deleting a card that is in two
decks and confirming it is gone from both and that both decks' totals
dropped by that card's copy count.

**Acceptance Scenarios**:

1. **Given** a project with many cards across card types, **When** the user
   filters the available cards by card type, **Then** only cards of that
   type are listed for adding.
2. **Given** a text search, **When** the user types part of a card's
   property value, **Then** only cards with a matching value are listed.
3. **Given** a card that is in one or more decks, **When** the user deletes
   that card from the card table, **Then** it no longer appears in any
   deck and each deck's counts reflect the removal.
4. **Given** a card type is deleted, **When** its cards are removed with it,
   **Then** they are removed from every deck as well.

---

### Edge Cases

- What happens when a project has no cards yet? (The deck view says there
  are no cards available to add, with a pointer to fill cards first; decks
  can still be created and named.)
- What happens when the same card is added to a deck that already has it?
  (Its copy count increases by one rather than listing it twice.)
- What happens when a copy count is entered as a non-whole number,
  negative, or blank? (The change is rejected and the previous count is
  kept; 0 removes the card from the deck.)
- What happens when a deck is deleted? (Only the deck and its list of
  cards are removed; the project's cards are untouched.)
- What happens when a project is duplicated? (Its decks are copied too,
  referring to the duplicate's own cards, independent of the original.)
- What happens when two cards look identical (same values)? (They are
  still separate cards and can be counted separately in a deck.)
- What happens when a card's property values are edited? (The deck still
  holds that same card; the updated values are shown.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a deckbuilding section where, within a
  project, users can create any number of decks.
- **FR-002**: System MUST require each deck to have a name that is not
  empty and is unique among that project's decks (case-insensitive,
  ignoring surrounding whitespace), and MUST let users rename and delete
  decks.
- **FR-003**: System MUST keep decks independent per project: a deck
  belongs to exactly one project and never appears in another.
- **FR-004**: System MUST let users add any card of the project (of any of
  its card types) to a deck.
- **FR-005**: System MUST track, per deck, how many copies of each card it
  holds, and let users change that count; a count of 0 removes the card
  from that deck.
- **FR-006**: System MUST allow the same card to be in multiple decks, with
  an independent copy count in each.
- **FR-007**: System MUST show, for each deck, its listed cards with their
  copy counts, the total number of cards (sum of copies) and the number of
  distinct cards.
- **FR-008**: System MUST let users remove a card from a deck without
  deleting the card from the project.
- **FR-009**: System MUST let users narrow the cards available to add by
  card type and by text search over card values.
- **FR-010**: System MUST remove a card from every deck when that card is
  deleted (including when its card type or project content is deleted),
  keeping deck counts consistent.
- **FR-011**: System MUST persist decks, their names, their cards and copy
  counts, so they are unchanged after closing and reopening the app.
- **FR-012**: System MUST copy a project's decks, remapped to the copied
  cards, when the project is duplicated, and delete them when the project
  is deleted.
- **FR-013**: System MUST reject invalid copy counts (non-whole, negative,
  blank) without changing the deck.

### Key Entities

- **Deck** (new in this slice): A named collection of cards within one
  project. Has a name (unique within the project) and a list of entries.
- **Deck Entry** (new in this slice): One card in one deck plus the number
  of copies of it in that deck (whole number, 1 or more). A card appears at
  most once per deck, with a count.
- **Card** (Slice 3): The thing being sorted. Not copied into decks; decks
  only refer to existing cards.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a named deck and put a first card in it in
  under 30 seconds from opening the deckbuilding section.
- **SC-002**: Deck contents (names, cards, copy counts) survive closing and
  reopening the application with zero data loss, verified across 100% of
  tested cases.
- **SC-003**: Changing one deck (adding, re-counting, removing cards,
  renaming) never alters any other deck, verified across 100% of tested
  cases.
- **SC-004**: After a card is deleted, 100% of decks that held it no longer
  list it and show corrected totals.
- **SC-005**: A user can assemble a deck of 40 cards (counting copies) from
  a project of at least 100 cards in under 3 minutes using filtering.

## Assumptions

- Decks belong to a project and may mix cards from any of that project's
  card types; they are not tied to a single card type.
- A card may be in any number of decks; "sorting into N decks" means the
  user decides, per deck, what it holds — it is not an exclusive
  partition.
- Each deck holds a card at most once as an entry, with a copy count
  (default 1 when added); there are no per-deck size limits or composition
  rules (such as minimum deck size or copy limits) — decks are game
  agnostic.
- Deck names follow the same uniqueness rules as project and card type
  names elsewhere in the app (case-insensitive, trimmed, unique within the
  project).
- Deleting a deck is immediate with no confirmation prompt, consistent
  with how project, card type and card deletion already behave.
- Decks are reachable from a project's screens alongside its card types;
  a project with no cards can still have decks.
- Card order inside a deck is not meaningful; entries are listed in a
  stable, predictable order (such as the order they were added).
- No printing, shuffling, drawing or play of decks is in scope; printing a
  deck is a later slice (Slice 5), and decks only need to be readable by
  that slice.
- Data is stored locally in the browser, consistent with earlier slices,
  with no limit beyond what browser storage allows.
