import test from "node:test";
import assert from "node:assert/strict";
import { createCardType, addProperty } from "../../js/models/card-type.mjs";
import { addCard, removeCard } from "../../js/models/card.mjs";
import {
  ID_PROPERTY,
  getSchema,
  findCardByNumber,
  cardsInNumberOrder,
  normalizeCardType,
} from "../../js/models/card-numbering.mjs";

const newType = () => createCardType("Monster", { width: 100, height: 140 }, []);

test("new cards are numbered from 1", () => {
  const type = newType();
  assert.deepEqual([addCard(type), addCard(type), addCard(type)].map((c) => c.number), [1, 2, 3]);
});

test("a number is never reused after deleting the last card", () => {
  const type = newType();
  addCard(type);
  addCard(type);
  const third = addCard(type);
  removeCard(type, third.id);
  assert.equal(addCard(type).number, 4);
});

test("getSchema puts the ID property first", () => {
  const type = newType();
  const name = addProperty(type, "name");
  assert.deepEqual(getSchema(type), [ID_PROPERTY, name]);
  assert.equal(ID_PROPERTY.builtin, true);
});

test("findCardByNumber and cardsInNumberOrder", () => {
  const type = newType();
  const a = addCard(type);
  const b = addCard(type);
  type.cards.reverse();
  assert.equal(findCardByNumber(type, 2).id, b.id);
  assert.equal(findCardByNumber(type, 9), null);
  assert.deepEqual(cardsInNumberOrder(type).map((c) => c.id), [a.id, b.id]);
});

test("normalizeCardType gives legacy properties a type and legacy cards numbers", () => {
  const legacy = {
    properties: [{ id: "p1", name: "name", sampleValue: "" }],
    elements: [],
    cards: [
      { id: "c1", values: {} },
      { id: "c2", values: {} },
    ],
  };
  normalizeCardType(legacy);
  assert.equal(legacy.properties[0].type, "line");
  assert.deepEqual(legacy.cards.map((c) => c.number), [1, 2]);
  assert.equal(legacy.nextCardNumber, 3);
});

test("normalizeCardType is idempotent and keeps existing numbers and counter", () => {
  const type = {
    properties: [],
    elements: [],
    cards: [{ id: "c1", number: 7, values: {} }, { id: "c2", values: {} }],
    nextCardNumber: 10,
  };
  normalizeCardType(type);
  normalizeCardType(type);
  assert.deepEqual(type.cards.map((c) => c.number), [7, 10]);
  assert.equal(type.nextCardNumber, 11);
});
