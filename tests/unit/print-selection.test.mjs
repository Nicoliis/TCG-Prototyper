import test from "node:test";
import assert from "node:assert/strict";
import { selectionFromDeck, resolveSelection, cardValuesByName } from "../../js/models/print-selection.mjs";
import { addCardToDeck, setEntryCount, deckTotals } from "../../js/models/deck.mjs";

const project = () => ({
  cardTypes: [
    {
      id: "t1",
      name: "Monster",
      properties: [{ id: "p1", name: "name" }, { id: "p2", name: "atk" }],
      cards: [{ id: "c1", number: 1, values: { p1: "Goblin" } }, { id: "c2", number: 2, values: { p1: "Orc", p2: "4" } }],
    },
  ],
});

test("selectionFromDeck copies entries so selection edits do not change the deck", () => {
  const deck = { id: "d", name: "D", entries: [{ cardId: "c1", count: 3 }] };
  const selection = selectionFromDeck(deck);
  setEntryCount(selection, "c1", 5);
  addCardToDeck(selection, "c2");
  assert.deepEqual(deck.entries, [{ cardId: "c1", count: 3 }]);
  assert.deepEqual(deckTotals(selection), { totalCards: 6, distinctCards: 2 });
});

test("resolveSelection expands cards with counts and skips missing cards", () => {
  const selection = { entries: [{ cardId: "c2", count: 2 }, { cardId: "gone", count: 1 }, { cardId: "c1", count: 1 }] };
  const items = resolveSelection(project(), selection);
  assert.deepEqual(items.map((i) => [i.card.id, i.count, i.cardType.id]), [["c2", 2, "t1"], ["c1", 1, "t1"]]);
});

test("cardValuesByName maps property names to values with blanks for missing ones", () => {
  const { cardTypes } = project();
  assert.deepEqual(cardValuesByName(cardTypes[0], cardTypes[0].cards[0]), { ID: 1, name: "Goblin", atk: "" });
  assert.deepEqual(cardValuesByName(cardTypes[0], cardTypes[0].cards[1]), { ID: 2, name: "Orc", atk: "4" });
});

test("the selection reuses deck validation for copies", () => {
  const selection = { entries: [] };
  addCardToDeck(selection, "c1");
  assert.throws(() => setEntryCount(selection, "c1", "1.5"));
  setEntryCount(selection, "c1", 0);
  assert.deepEqual(selection.entries, []);
});

import { createCardType as createTypeForId, addProperty as addPropertyForId } from "../../js/models/card-type.mjs";
import { addCard as addCardForId } from "../../js/models/card.mjs";
import { cardValuesByName as valuesByName } from "../../js/models/print-selection.mjs";

test("cardValuesByName exposes the card ID as ID", () => {
  const type = createTypeForId("T", { width: 10, height: 10 }, []);
  const name = addPropertyForId(type, "name");
  const card = addCardForId(type, { [name.id]: "Goblin" });
  assert.deepEqual(valuesByName(type, card), { ID: 1, name: "Goblin" });
});
