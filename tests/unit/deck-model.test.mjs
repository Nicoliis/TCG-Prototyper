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
  cloneDecksForCards,
  listCards,
  findCard,
  describeCard,
} from "../../js/models/deck.mjs";
import { cloneProjectForDuplicate } from "../../js/models/project.mjs";

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

test("cloneDecksForCards remaps entries, drops unmapped cards and regenerates ids", () => {
  const decks = [{ id: "d1", name: "A", entries: [{ cardId: "old1", count: 2 }, { cardId: "gone", count: 1 }] }];
  const [copy] = cloneDecksForCards(decks, new Map([["old1", "new1"]]));
  assert.notEqual(copy.id, "d1");
  assert.deepEqual(copy.entries, [{ cardId: "new1", count: 2 }]);
  assert.equal(decks[0].entries[0].cardId, "old1");
});

test("cloneProjectForDuplicate copies decks pointing at the duplicate's own cards", () => {
  const project = {
    name: "P",
    cardTypes: [
      {
        id: "t1",
        name: "T",
        width: 1,
        height: 1,
        properties: [{ id: "p1", name: "name", sampleValue: "" }],
        elements: [],
        cards: [{ id: "c1", values: { p1: "Goblin" } }],
      },
    ],
    decks: [{ id: "d1", name: "Starter", entries: [{ cardId: "c1", count: 3 }] }],
  };
  const copy = cloneProjectForDuplicate(project, ["P"]);
  const copiedCardId = copy.cardTypes[0].cards[0].id;
  assert.notEqual(copiedCardId, "c1");
  assert.deepEqual(copy.decks[0].entries, [{ cardId: copiedCardId, count: 3 }]);
  assert.equal(project.decks[0].entries[0].cardId, "c1");
});

const projectWithCards = () => ({
  cardTypes: [
    {
      id: "t1",
      name: "Monster",
      properties: [{ id: "p1", name: "name" }, { id: "p2", name: "atk" }],
      cards: [{ id: "c1", values: { p1: "Goblin", p2: "3" } }, { id: "c2", values: {} }],
    },
    { id: "t2", name: "Spell", properties: [{ id: "p3", name: "name" }] },
  ],
});

test("listCards pairs every card with its card type, tolerating types without cards", () => {
  const pairs = listCards(projectWithCards().cardTypes);
  assert.deepEqual(pairs.map((p) => p.card.id), ["c1", "c2"]);
  assert.equal(pairs[0].cardType.name, "Monster");
});

test("findCard locates a card by id or returns null", () => {
  const project = projectWithCards();
  assert.equal(findCard(project, "c1").cardType.id, "t1");
  assert.equal(findCard(project, "missing"), null);
});

test("describeCard joins non-blank values in property order, or marks an empty card", () => {
  const { cardTypes } = projectWithCards();
  assert.equal(describeCard(cardTypes[0], cardTypes[0].cards[0]), "Monster: Goblin / 3");
  assert.equal(describeCard(cardTypes[0], cardTypes[0].cards[1]), "Monster: (empty card)");
});
