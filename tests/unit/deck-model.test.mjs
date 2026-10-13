import test from "node:test";
import assert from "node:assert/strict";
import {
  getDecks,
  validateDeckName,
  createDeck,
  upsertDeck,
  removeDeck,
  addCardToDeck,
  setEntryCount,
  deckTotals,
} from "../../js/models/deck.mjs";

const emptyProject = () => ({ cardTypes: [] });

test("getDecks reads a project without decks as empty", () => {
  assert.deepEqual(getDecks(emptyProject()), []);
});

test("validateDeckName trims and rejects empty or duplicate names", () => {
  assert.equal(validateDeckName("  Starter ", []), "Starter");
  assert.throws(() => validateDeckName("   ", []));
  assert.throws(() => validateDeckName(" starter ", ["Starter"]));
});

test("createDeck makes an empty deck with an id", () => {
  const deck = createDeck("Starter", []);
  assert.ok(deck.id);
  assert.deepEqual(deck.entries, []);
});

test("upsertDeck creates, then replaces by id", () => {
  const project = emptyProject();
  const saved = upsertDeck(project, { name: "Starter", entries: [] });
  assert.ok(saved.id);
  upsertDeck(project, { ...saved, name: "Renamed" });
  assert.deepEqual(getDecks(project).map((d) => d.name), ["Renamed"]);
});

test("upsertDeck rejects a name used by another deck but allows keeping its own", () => {
  const project = emptyProject();
  const a = upsertDeck(project, { name: "A", entries: [] });
  const b = upsertDeck(project, { name: "B", entries: [] });
  assert.throws(() => upsertDeck(project, { ...b, name: "a" }));
  assert.doesNotThrow(() => upsertDeck(project, { ...a, name: "A" }));
});

test("upsertDeck rejects invalid entry counts", () => {
  const project = emptyProject();
  for (const count of [0, -1, 1.5, "2"]) {
    assert.throws(() => upsertDeck(project, { name: "X", entries: [{ cardId: "c", count }] }));
  }
});

test("removeDeck removes only that deck", () => {
  const project = emptyProject();
  const a = upsertDeck(project, { name: "A", entries: [] });
  upsertDeck(project, { name: "B", entries: [] });
  removeDeck(project, a.id);
  assert.deepEqual(getDecks(project).map((d) => d.name), ["B"]);
});

test("addCardToDeck adds a new entry then increments it", () => {
  const deck = createDeck("D", []);
  addCardToDeck(deck, "c1");
  addCardToDeck(deck, "c1");
  addCardToDeck(deck, "c2");
  assert.deepEqual(deck.entries, [{ cardId: "c1", count: 2 }, { cardId: "c2", count: 1 }]);
});

test("setEntryCount sets a count and 0 removes the entry", () => {
  const deck = createDeck("D", []);
  addCardToDeck(deck, "c1");
  setEntryCount(deck, "c1", "3");
  assert.equal(deck.entries[0].count, 3);
  setEntryCount(deck, "c1", 0);
  assert.deepEqual(deck.entries, []);
});

test("setEntryCount rejects invalid values and leaves the deck unchanged", () => {
  const deck = createDeck("D", []);
  addCardToDeck(deck, "c1");
  for (const bad of [-1, 1.5, "", "abc", null]) {
    assert.throws(() => setEntryCount(deck, "c1", bad));
  }
  assert.deepEqual(deck.entries, [{ cardId: "c1", count: 1 }]);
});

test("deckTotals sums copies and counts distinct cards", () => {
  const deck = createDeck("D", []);
  setEntryCount(deck, "c1", 3);
  setEntryCount(deck, "c2", 2);
  assert.deepEqual(deckTotals(deck), { totalCards: 5, distinctCards: 2 });
});
