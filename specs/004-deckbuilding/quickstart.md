# Quickstart: Deckbuilding — Validation Guide

## Prerequisites

- Node 20+ for unit tests (not currently installed on the dev machine) and any static HTTP server from the repo root, e.g. `python -m http.server 8080`, then open `http://localhost:8080`.
- A project with two card types and at least a few cards (see Slice 3's card table).

## 1. Automated checks

```text
node --test tests/unit
```

Expected: all pass, including `deck-model` and the storage contract's deck cases. See [contracts/storage-adapter-delta.md](./contracts/storage-adapter-delta.md) and [data-model.md](./data-model.md).

## 2. Manual: decks (User Story 1)

1. Open the project → **Decks**. Expect an empty list.
2. Create decks `Starter`, `Tournament`, `Scratch`. Rename `Scratch` to `Draft`; delete `Draft`. Expect `Starter` and `Tournament`.
3. Try creating a deck with an empty name, then one named ` starter ` — expect both refused with a message.
4. Reload. Expect both decks. Open another project; expect its deck list unchanged.

## 3. Manual: sorting cards (User Story 2)

1. Open `Starter`. **Add** two different cards; add one of them again. Expect it to show count 2.
2. Set a count to 3; expect totals updated. Try `-1`, `1.5`, blank; expect each refused and the old count kept.
3. Set a count to 0; expect the card to leave the deck but remain in the card table.
4. Add one card to `Tournament` with a different count; expect `Starter` unchanged.
5. Reload; expect all counts as left.

## 4. Manual: filtering and consistency (User Story 3)

1. In a deck, filter available cards by card type; expect only that type. Type part of a card's value into search; expect only matching cards.
2. Delete a card that sits in two decks (via the card table); open both decks; expect it gone and totals reduced.
3. Delete a card type whose cards are in a deck; expect those entries gone.

## 5. Edge cases

- Project with no cards: deck editor says no cards are available; decks can still be created.
- Duplicate a project that has decks: the copy's decks list the copy's own cards with the same counts; editing the copy does not change the original.
