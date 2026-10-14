import test from "node:test";
import assert from "node:assert/strict";
import { createCardType, addProperty } from "../../js/models/card-type.mjs";
import { addCard, getCardValue } from "../../js/models/card.mjs";
import { importCards } from "../../js/csv/import-cards.mjs";

function setup() {
  const type = createCardType("Monster", { width: 100, height: 140 }, []);
  const name = addProperty(type, "name");
  const atk = addProperty(type, "atk");
  const def = addProperty(type, "def");
  return { type, name, atk, def };
}

test("creates new cards from matching columns", () => {
  const { type, name, atk } = setup();
  const { cards, report } = importCards(type, [["name", "atk"], ["Goblin", "3"], ["Orc", "4"]], name.id);
  assert.equal(cards.length, 2);
  assert.equal(getCardValue(cards[0], atk.id), "3");
  assert.equal(report.created, 2);
  assert.equal(report.updated, 0);
});

test("updates the card matching the key instead of duplicating", () => {
  const { type, name, atk } = setup();
  addCard(type, { [name.id]: "Goblin", [atk.id]: "3" });
  const { cards, report } = importCards(type, [["name", "atk"], ["Goblin", "5"]], name.id);
  assert.equal(cards.length, 1);
  assert.equal(getCardValue(cards[0], atk.id), "5");
  assert.equal(report.updated, 1);
});

test("reports ignored columns and unfilled properties", () => {
  const { type, name } = setup();
  const { report } = importCards(type, [["name", "flavor"], ["Goblin", "x"]], name.id);
  assert.deepEqual(report.ignoredColumns, ["flavor"]);
  assert.deepEqual(report.unfilledProperties, ["atk", "def"]);
});

test("a new card leaves unmapped properties blank", () => {
  const { type, name, def } = setup();
  const { cards } = importCards(type, [["name"], ["Goblin"]], name.id);
  assert.equal(getCardValue(cards[0], def.id), "");
});

test("an update leaves properties without a matching column untouched", () => {
  const { type, name, def } = setup();
  addCard(type, { [name.id]: "Goblin", [def.id]: "4" });
  const { cards } = importCards(type, [["name", "atk"], ["Goblin", "5"]], name.id);
  assert.equal(getCardValue(cards[0], def.id), "4");
});

test("a blank key always creates a new card", () => {
  const { type, name, atk } = setup();
  addCard(type, { [atk.id]: "1" });
  const { cards, report } = importCards(type, [["name", "atk"], ["", "9"]], name.id);
  assert.equal(cards.length, 2);
  assert.equal(report.created, 1);
});

test("an absent key column creates a card for every row", () => {
  const { type, name } = setup();
  addCard(type, { [name.id]: "Goblin" });
  const { cards } = importCards(type, [["atk"], ["1"], ["2"]], name.id);
  assert.equal(cards.length, 3);
});

test("matching is case- and whitespace-insensitive for headers and keys", () => {
  const { type, name, atk } = setup();
  addCard(type, { [name.id]: "Goblin" });
  const { cards, report } = importCards(type, [[" NAME ", "Atk"], [" goblin ", "7"]], name.id);
  assert.equal(cards.length, 1);
  assert.equal(getCardValue(cards[0], atk.id), "7");
  assert.equal(report.updated, 1);
});

test("a duplicate header uses the first column and ignores later ones", () => {
  const { type, name, atk } = setup();
  const { cards, report } = importCards(type, [["name", "atk", "atk"], ["Goblin", "1", "2"]], name.id);
  assert.equal(getCardValue(cards[0], atk.id), "1");
  assert.deepEqual(report.ignoredColumns, ["atk"]);
});

test("duplicate existing keys update the first card found", () => {
  const { type, name, atk } = setup();
  const first = addCard(type, { [name.id]: "Goblin" });
  const second = addCard(type, { [name.id]: "Goblin" });
  importCards(type, [["name", "atk"], ["Goblin", "5"]], name.id);
  assert.equal(getCardValue(first, atk.id), "5");
  assert.equal(getCardValue(second, atk.id), "");
});

test("repeated keys within one CSV each create a card", () => {
  const { type, name } = setup();
  const { cards } = importCards(type, [["name"], ["Goblin"], ["Goblin"]], name.id);
  assert.equal(cards.length, 2);
});

test("a header-only CSV changes nothing", () => {
  const { type, name } = setup();
  const { cards, report } = importCards(type, [["name"]], name.id);
  assert.equal(cards.length, 0);
  assert.equal(report.created + report.updated, 0);
});

test("no matching columns still creates blank cards and ignores every column", () => {
  const { type, name } = setup();
  const { cards, report } = importCards(type, [["x", "y"], ["1", "2"]], name.id);
  assert.equal(cards.length, 1);
  assert.deepEqual(cards[0].values, {});
  assert.deepEqual(report.ignoredColumns, ["x", "y"]);
});

import { ID_PROPERTY } from "../../js/models/card-numbering.mjs";

test("ID as key updates the card with that number and numbers new cards automatically", () => {
  const { type, name } = setup();
  const first = addCard(type, { [name.id]: "Goblin" });
  const { cards, report } = importCards(
    type,
    [["ID", "name"], ["1", "Goblin King"], ["99", "Orc"]],
    ID_PROPERTY.id,
  );
  assert.equal(cards.length, 2);
  assert.equal(getCardValue(cards[0], name.id), "Goblin King");
  assert.equal(cards[0].id, first.id);
  assert.equal(cards[1].number, 2);
  assert.deepEqual([report.created, report.updated], [1, 1]);
  assert.deepEqual(report.ignoredColumns, []);
});

test("invalid values for numeric properties are reported but still imported", () => {
  const { type, name, atk } = setup();
  atk.type = "integer";
  const { cards, report } = importCards(type, [["name", "atk"], ["Goblin", "x"]], name.id);
  assert.equal(getCardValue(cards[0], atk.id), "x");
  assert.deepEqual(report.invalidValues, [{ row: 1, property: "atk", value: "x" }]);
});

test("CSV cells keep their formatting markers unchanged", () => {
  const { type, name } = setup();
  const { cards } = importCards(type, [["name"], ["**Flying** and *fast* __always__"]], name.id);
  assert.equal(getCardValue(cards[0], name.id), "**Flying** and *fast* __always__");
});
