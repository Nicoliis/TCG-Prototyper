import test from "node:test";
import assert from "node:assert/strict";
import { createCardType, addProperty, removeProperty, cloneCardType } from "../../js/models/card-type.mjs";
import { getCards, addCard, removeCard, getCardValue, setCardValue } from "../../js/models/card.mjs";

const newType = () => createCardType("Monster", { width: 100, height: 140 }, []);

test("getCards returns an empty list for a card type without cards", () => {
  assert.deepEqual(getCards({ properties: [], elements: [] }), []);
});

test("addCard and removeCard", () => {
  const type = newType();
  const a = addCard(type);
  const b = addCard(type);
  removeCard(type, a.id);
  assert.deepEqual(getCards(type).map((c) => c.id), [b.id]);
});

test("addCard works on a card type that has no cards field", () => {
  const type = { properties: [], elements: [] };
  addCard(type);
  assert.equal(type.cards.length, 1);
});

test("setCardValue stores strings and deletes the key when blank", () => {
  const card = addCard(newType());
  setCardValue(card, "p1", 5);
  assert.equal(getCardValue(card, "p1"), "5");
  setCardValue(card, "p1", "");
  assert.equal("p1" in card.values, false);
  assert.equal(getCardValue(card, "p1"), "");
});

test("removeProperty strips that property's values from every card", () => {
  const type = newType();
  const atk = addProperty(type, "atk");
  const def = addProperty(type, "def");
  const card = addCard(type, { [atk.id]: "3", [def.id]: "4" });
  removeProperty(type, atk.id);
  assert.deepEqual(card.values, { [def.id]: "4" });
});

test("cloneCardType remaps card values to the new property ids", () => {
  const type = newType();
  const atk = addProperty(type, "atk");
  const card = addCard(type, { [atk.id]: "3" });
  const copy = cloneCardType(type);
  const newAtk = copy.properties[0];
  assert.notEqual(newAtk.id, atk.id);
  assert.notEqual(copy.cards[0].id, card.id);
  assert.deepEqual(copy.cards[0].values, { [newAtk.id]: "3" });
});
