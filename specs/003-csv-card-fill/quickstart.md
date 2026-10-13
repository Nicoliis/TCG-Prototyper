# Quickstart: CSV Card Fill — Validation Guide

## Prerequisites

- Node 20+ (unit tests only) and any static HTTP server from the repo root, e.g. `python -m http.server 8080`, then open `http://localhost:8080`.
- A project with a card type having properties `name`, `atk`, `def`.

## 1. Automated checks

```text
node --test tests/unit
```

Expected: all pass, including `parse-csv`, `card-model`, `import-cards` and the storage contract's cards round-trip. See [contracts/csv-import.md](./contracts/csv-import.md) and [data-model.md](./data-model.md).

## 2. Manual: in-app table (User Story 1)

1. Card type list → **Cards** on the card type. Expect columns `name, atk, def` and zero rows.
2. **Add card**, type `Goblin` in `name`, `3` in `atk`. Expect one card; `def` blank.
3. Edit `atk` to `5`; expect only that value changes. Add a second card, then delete it; expect the first is unaffected.
4. Reload the page; expect cards exactly as left.

## 3. Manual: CSV import (User Story 2)

1. Card type list → **Import CSV**. Paste:
   ```text
   name,atk,flavor
   Goblin,7,Sneaky
   Orc,4,Big
   ```
2. Key property `name` → **Import**. Expect `Goblin` updated (atk 7, def unchanged), `Orc` created (def blank).
3. Open the card table; confirm the results, and that re-importing the same text creates no duplicates.
4. Paste a CSV with a blank `name` cell; expect a new card created for that row.
5. Upload a `.csv` file instead of pasting; expect the same behavior.

## 4. Manual: report (User Story 3)

After step 3.2 expect: ignored column `flavor`; unfilled property `def`; `1 created, 1 updated`.

## 5. Edge cases

- Header-only or empty CSV → "0 cards created" message, no failure.
- Duplicate `atk` headers → first used, second listed as ignored.
- No matching columns → blank cards created, all columns ignored.
- Duplicate a project that has cards → copy's cards show the same values.
