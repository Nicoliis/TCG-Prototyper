import test from "node:test";
import assert from "node:assert/strict";
import { createCardType } from "../../js/models/card-type.mjs";
import { addCard } from "../../js/models/card.mjs";
import {
  adjacentCard,
  positionOf,
  resolveGoTo,
  cardToShowAfterDelete,
} from "../../js/views/card-editor/card-navigation.mjs";

function typeWithCards(count) {
  const type = createCardType("Monster", { width: 100, height: 140 }, []);
  for (let i = 0; i < count; i++) addCard(type);
  return type;
}

test("adjacentCard moves by ID order and stops at the ends", () => {
  const type = typeWithCards(3);
  assert.equal(adjacentCard(type, 2, 1).number, 3);
  assert.equal(adjacentCard(type, 2, -1).number, 1);
  assert.equal(adjacentCard(type, 3, 1), null);
  assert.equal(adjacentCard(type, 1, -1), null);
});

test("positionOf reports the index and total", () => {
  assert.deepEqual(positionOf(typeWithCards(3), 2), { index: 2, total: 3 });
});

test("resolveGoTo finds a card or explains why not", () => {
  const type = typeWithCards(2);
  assert.equal(resolveGoTo(type, " 2 ").card.number, 2);
  assert.match(resolveGoTo(type, "9").error, /no card with ID 9/);
  assert.match(resolveGoTo(type, "abc").error, /whole number/);
  assert.match(resolveGoTo(type, "").error, /whole number/);
});

test("cardToShowAfterDelete prefers the next card, then the previous, then none", () => {
  const type = typeWithCards(3);
  assert.equal(cardToShowAfterDelete(type, 2).number, 3);
  assert.equal(cardToShowAfterDelete(type, 3).number, 2);
  assert.equal(cardToShowAfterDelete(typeWithCards(1), 1), null);
});
