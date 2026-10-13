# Contract Delta: Storage Adapter (Slice 3)

**No method changes.** `StorageAdapter` keeps the Slice 1/2 methods unchanged.

Cards persist as the `cards` array on the `CardType` object passed to `saveCardType(projectId, cardType)` and returned by `getProject`.

## Behavioral requirements

1. `saveCardType` MUST round-trip `cardType.cards` unchanged (ids and `values`).
2. `getProject` MUST return card types saved without a `cards` field exactly as stored; callers read `cards ?? []`.
3. `deleteCardType` and `deleteProject` remove the cards with their owner (no separate cleanup).
4. `duplicateProject` MUST yield cards whose `values` reference the duplicated card type's *new* property ids (delivered via `cloneCardType`).

## Test impact

`tests/unit/storage-adapter.contract.test.mjs` gains cases for (1)–(4); both `InMemoryAdapter` and `IndexedDbAdapter` run the same contract.
