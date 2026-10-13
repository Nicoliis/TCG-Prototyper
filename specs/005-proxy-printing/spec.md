# Feature Specification: Proxy Printing

**Feature Branch**: `005-proxy-printing`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "Feature 5 from FEATURE-SLICES.md and
TODO-Features.md: card proxy printing — print cards on demand (choosing
manually one by one), or create a big proxy print for an entire deck.
Depends on: Slice 1 (card rendering), Slice 3 (cards), Slice 4 (decks)."

## Clarifications

### Session 2026-10-13

- Q: At what physical size should a card print? → A: True size, 96 px = 1
  inch, so a card type's size in the editor is its printed size (240x336
  px prints as 2.5x3.5 in); no separate printed-size setting.
- Q: Which paper sizes are offered? → A: A4 and US Letter only (default
  follows the browser locale, otherwise A4); other sizes are reached via the
  browser's own print dialog (FR-007).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Print cards I pick one by one (Priority: P1)

A designer opens a print screen for a project, chooses cards from the
project's cards one at a time (any card types), says how many copies of
each to print, and prints. The result is sheets of fully rendered cards —
each drawn exactly as its card type's layout defines, with that card's own
values filled in — laid out several to a page, ready to cut out and
sleeve as proxies.

**Why this priority**: This is the core proxy printing value and the
simplest complete path: cards exist, pick some, get paper. It stands alone
without decks.

**Independent Test**: Can be fully tested by picking two different cards
(one with 3 copies), opening the print preview, and confirming it shows 4
rendered cards laid out on the page(s) with the right values, then printing.

**Acceptance Scenarios**:

1. **Given** a project with cards, **When** the user picks a card for
   printing, **Then** it is added to the print selection with 1 copy.
2. **Given** a card in the print selection, **When** the user sets its
   copies to 3, **Then** the print preview shows that card 3 times.
3. **Given** a card in the print selection, **When** the user removes it,
   **Then** it no longer appears in the preview.
4. **Given** a selection of cards from two different card types of
   different sizes, **When** the user opens the preview, **Then** each card
   is drawn at its own card type's size, all on the sheet(s) without
   overlapping or being cut off.
5. **Given** a non-empty selection, **When** the user prints, **Then** the
   output contains only the card sheets — no app navigation, buttons or
   other interface elements.
6. **Given** an empty selection, **When** the user tries to print, **Then**
   printing is unavailable and the screen says to pick cards first.

---

### User Story 2 - Print a whole deck as a proxy sheet (Priority: P2)

A designer picks one of the project's decks and prints it as one big proxy
sheet: every card in the deck is printed as many times as the deck's copy
count says, so a 40-card deck yields 40 printed cards.

**Why this priority**: Printing a whole deck in one action is the main
reason decks exist for printing, but it needs deckbuilding and the sheet
rendering from User Story 1.

**Independent Test**: Can be fully tested by printing a deck containing
two cards with counts 3 and 2 and confirming the preview shows 5 cards in
total, 3 of one and 2 of the other.

**Acceptance Scenarios**:

1. **Given** a deck with cards and copy counts, **When** the user chooses
   to print it, **Then** the preview contains each card repeated by its
   copy count, so the printed total equals the deck's total cards.
2. **Given** a deck chosen for printing, **When** the user also wants an
   extra copy of one card, **Then** they can adjust the copies in the print
   selection for this print without changing the deck itself.
3. **Given** an empty deck, **When** the user chooses to print it, **Then**
   the app says the deck has no cards and does not print.
4. **Given** a deck was printed, **When** the user later views the deck,
   **Then** the deck is exactly as it was (printing never changes decks or
   cards).

---

### User Story 3 - Control the sheet layout (Priority: P3)

Before printing, the designer can choose the paper size and see how cards
are arranged: cards per page, spacing between them, and optional cut
guides, so the printed sheet matches their paper and cutting method.

**Why this priority**: Defaults make printing work for most people; layout
control refines it for different paper and cutting needs.

**Independent Test**: Can be fully tested by switching paper size and
toggling cut guides in the preview and confirming the page count and card
placement change accordingly.

**Acceptance Scenarios**:

1. **Given** the print preview, **When** the user changes the paper size,
   **Then** the preview re-flows the cards across pages for that size.
2. **Given** the print preview, **When** the user turns cut guides on,
   **Then** guide marks appear around each card in the preview and print.
3. **Given** the print preview, **When** the user changes the spacing
   between cards, **Then** the preview and print reflect it.
4. **Given** the user leaves the print screen and returns, **When** they
   reopen it, **Then** their last paper size and layout choices are kept.

---

### Edge Cases

- What happens when a card is larger than a page? (It is scaled down to
  fit the page, and the preview tells the user it was scaled.)
- What happens when a card is deleted while it is in the print selection?
  (It disappears from the selection, like it does from decks.)
- What happens when the selection is large (e.g. hundreds of cards)? (The
  preview and print still work, split across as many pages as needed.)
- What happens when a card has blank values? (It prints with those parts
  blank, exactly as it appears on screen.)
- What happens when a card contains an image that fails to load? (It
  prints as it shows on screen, and the preview makes the problem visible
  before printing.)
- What happens when a deck's cards come from card types of different
  sizes? (Each card prints at its own size; sizes are never mixed up or
  stretched.)
- What happens when the copy count is invalid (blank, negative,
  fractional)? (It is rejected and the previous count kept, as in decks.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a print screen for a project where users
  choose individual cards, from any of the project's card types, for
  printing.
- **FR-002**: System MUST let users set, per chosen card, how many copies
  to print, and remove chosen cards from the print selection.
- **FR-003**: System MUST render every printed card using its card type's
  layout with the card's own values, identical to how it appears on
  screen.
- **FR-004**: System MUST let users pick one of the project's decks to load
  into the print selection, with each card's copies set to the deck's copy
  count, and MUST let users adjust the selection afterwards without
  changing the deck.
- **FR-005**: System MUST show a print preview of the sheet(s) before
  printing, reflecting the selection and layout choices.
- **FR-006**: System MUST arrange cards on pages without overlap, using
  each card's own size, flowing onto additional pages as needed.
- **FR-007**: System MUST let users choose a paper size, the spacing
  between cards, and whether cut guides are shown.
- **FR-008**: System MUST produce print output containing only the card
  sheets (no application interface).
- **FR-009**: System MUST remember the user's last paper size and layout
  choices.
- **FR-010**: System MUST prevent printing an empty selection and say why.
- **FR-011**: System MUST NOT modify cards or decks as a result of
  printing or building a selection.
- **FR-012**: System MUST reject invalid copy counts (blank, negative,
  non-whole) without changing the selection.

### Key Entities

- **Print Selection** (new, temporary): The list of cards chosen for the
  current print, each with a copy count. Built from picked cards and/or a
  loaded deck. It is a working list for one print job; it does not change
  cards or decks.
- **Sheet Layout** (new, remembered): The user's paper size, card spacing
  and cut-guide choice.
- **Card / Card Type / Deck** (earlier slices): The source of what is
  printed; only read, never changed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can go from opening the print screen to a printable
  preview of a chosen card in under 30 seconds.
- **SC-002**: Printing a deck produces exactly as many printed cards as the
  deck's total card count, verified across 100% of tested decks.
- **SC-003**: Every printed card is visually identical to its on-screen
  rendering, verified across 100% of tested card types.
- **SC-004**: No printed card overlaps another or is cut off by the page
  edge, verified across 100% of tested paper sizes and selections.
- **SC-005**: A 40-card deck prints as one continuous sheet set in a single
  print action, with no manual per-card steps.

## Assumptions

- Printing uses the browser's own print function; the app prepares a
  print-ready layout, and the user finishes in the browser's print dialog
  (including saving as a document file, if they prefer).
- The print screen is reached from a project's screens, alongside card
  types and decks.
- Cards print at true size derived from their card type's dimensions at
  96 pixels per inch (see Clarifications), so card types sized in the
  editor print at that exact physical size.
- Paper size choices are A4 and US Letter (see Clarifications), with a
  default preselected.
- Cut guides are simple marks around each card, off by default.
- Only the front of each card is printed; card backs are out of scope.
- The print selection is temporary: it is not saved between visits, only
  the layout choices are.
- Printing needs no network beyond what card images already require; if a
  card's image URL cannot load, it prints as it appears on screen.
- Data is read from local browser storage like earlier slices; this slice
  adds no new data about cards or decks.
