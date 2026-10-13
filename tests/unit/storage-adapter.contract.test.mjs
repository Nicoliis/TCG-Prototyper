import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryAdapter } from "../support/in-memory-adapter.mjs";
import { ArrayStoreAdapter } from "../support/array-store-adapter.mjs";

// IndexedDbAdapter isn't exercised here because IndexedDB is a browser API
// unavailable under plain Node; its conformance to this same contract is
// verified manually via quickstart.md. These two adapters are structurally
// different (Map- vs array-backed) specifically to prove FR-017/SC-004:
// the app's logic depends only on the contract, not a given backend.
const adapters = [
  ["InMemoryAdapter", () => new InMemoryAdapter()],
  ["ArrayStoreAdapter", () => new ArrayStoreAdapter()],
];

const sampleCardType = (overrides = {}) => ({
  name: "Monster",
  width: 100,
  height: 140,
  properties: [],
  elements: [],
  ...overrides,
});

const sampleEnvelope = (overrides = {}) => ({
  cardgamePrototyperExport: "project",
  formatVersion: 1,
  exportedAt: "2026-01-01T00:00:00.000Z",
  project: {
    name: "Imported",
    cardTypes: [
      sampleCardType({
        properties: [{ id: "p1", name: "atk", sampleValue: "" }],
        cards: [{ id: "c1", values: { p1: "5" } }],
      }),
    ],
    decks: [{ name: "Starter", entries: [{ cardId: "c1", count: 2 }] }],
    ...overrides,
  },
});

for (const [label, make] of adapters) {
  test(`${label}: a created project appears in listProjects`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Test Game");
    const projects = await adapter.listProjects();
    assert.ok(projects.some((p) => p.id === project.id && p.name === "Test Game"));
  });

  test(`${label}: duplicateProject is independent of the source`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Source");
    await adapter.saveCardType(project.id, sampleCardType());
    const duplicate = await adapter.duplicateProject(project.id);

    const copiedCardType = duplicate.cardTypes[0];
    await adapter.saveCardType(duplicate.id, { ...copiedCardType, name: "Changed" });

    const original = await adapter.getProject(project.id);
    assert.equal(original.cardTypes[0].name, "Monster");
  });

  test(`${label}: deleteProject removes it from listProjects and getProject`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Temp");
    await adapter.deleteProject(project.id);
    assert.equal(await adapter.getProject(project.id), null);
    assert.equal(
      (await adapter.listProjects()).some((p) => p.id === project.id),
      false,
    );
  });

  test(`${label}: saveCardType enforces unique names within a project but not across projects`, async () => {
    const adapter = make();
    const projectA = await adapter.createProject("A");
    const projectB = await adapter.createProject("B");
    await adapter.saveCardType(projectA.id, sampleCardType());

    await assert.rejects(() => adapter.saveCardType(projectA.id, sampleCardType()));
    await assert.doesNotReject(() => adapter.saveCardType(projectB.id, sampleCardType()));
  });
}

for (const [label, make] of adapters) {
  test(`${label}: saveCardType round-trips cards`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Cards");
    const cards = [{ id: "c1", values: { p1: "Goblin" } }];
    const saved = await adapter.saveCardType(project.id, sampleCardType({ cards }));
    const loaded = await adapter.getProject(project.id);
    assert.deepEqual(loaded.cardTypes.find((ct) => ct.id === saved.id).cards, cards);
  });

  test(`${label}: a card type saved without cards reads back without cards`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Legacy");
    const saved = await adapter.saveCardType(project.id, sampleCardType());
    const loaded = await adapter.getProject(project.id);
    assert.equal(loaded.cardTypes.find((ct) => ct.id === saved.id).cards, undefined);
  });

  test(`${label}: duplicateProject remaps card values to the new property ids`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Source");
    await adapter.saveCardType(
      project.id,
      sampleCardType({
        properties: [{ id: "old", name: "atk", sampleValue: "" }],
        cards: [{ id: "c1", values: { old: "3" } }],
      }),
    );
    const duplicate = await adapter.duplicateProject(project.id);
    const copied = duplicate.cardTypes[0];
    assert.deepEqual(copied.cards[0].values, { [copied.properties[0].id]: "3" });
  });
}

for (const [label, make] of adapters) {
  test(`${label}: saveDeck creates a deck readable through getProject`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Decks");
    const saved = await adapter.saveDeck(project.id, { name: "Starter", entries: [{ cardId: "c1", count: 2 }] });
    const loaded = await adapter.getProject(project.id);
    assert.deepEqual(loaded.decks.find((d) => d.id === saved.id).entries, [{ cardId: "c1", count: 2 }]);
  });

  test(`${label}: saveDeck with an id replaces that deck`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Decks");
    const saved = await adapter.saveDeck(project.id, { name: "Starter", entries: [] });
    await adapter.saveDeck(project.id, { ...saved, name: "Renamed" });
    const loaded = await adapter.getProject(project.id);
    assert.deepEqual(loaded.decks.map((d) => d.name), ["Renamed"]);
  });

  test(`${label}: saveDeck rejects empty and duplicate names`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Decks");
    await adapter.saveDeck(project.id, { name: "Starter", entries: [] });
    await assert.rejects(() => adapter.saveDeck(project.id, { name: "  ", entries: [] }));
    await assert.rejects(() => adapter.saveDeck(project.id, { name: " starter", entries: [] }));
  });

  test(`${label}: saveDeck rejects invalid copy counts`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Decks");
    await assert.rejects(() =>
      adapter.saveDeck(project.id, { name: "Bad", entries: [{ cardId: "c1", count: 0 }] }),
    );
  });

  test(`${label}: deleteDeck removes only the deck and leaves cards alone`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Decks");
    const cards = [{ id: "c1", values: {} }];
    await adapter.saveCardType(project.id, sampleCardType({ cards }));
    const deck = await adapter.saveDeck(project.id, { name: "Starter", entries: [] });
    await adapter.deleteDeck(project.id, deck.id);
    const loaded = await adapter.getProject(project.id);
    assert.deepEqual(loaded.decks, []);
    assert.equal(loaded.cardTypes[0].cards.length, 1);
  });

  test(`${label}: decks are isolated per project`, async () => {
    const adapter = make();
    const a = await adapter.createProject("A");
    const b = await adapter.createProject("B");
    await adapter.saveDeck(a.id, { name: "Starter", entries: [] });
    await assert.doesNotReject(() => adapter.saveDeck(b.id, { name: "Starter", entries: [] }));
    assert.equal((await adapter.getProject(b.id)).decks.length, 1);
  });

  test(`${label}: duplicateProject remaps deck entries to the duplicate's cards`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Source");
    await adapter.saveCardType(
      project.id,
      sampleCardType({
        properties: [{ id: "p1", name: "name", sampleValue: "" }],
        cards: [{ id: "c1", values: { p1: "Goblin" } }],
      }),
    );
    await adapter.saveDeck(project.id, { name: "Starter", entries: [{ cardId: "c1", count: 3 }] });
    const duplicate = await adapter.duplicateProject(project.id);
    const copiedCardId = duplicate.cardTypes[0].cards[0].id;
    assert.deepEqual(duplicate.decks[0].entries, [{ cardId: copiedCardId, count: 3 }]);
  });
}

for (const [label, make] of adapters) {
  test(`${label}: saving a card type without a card removes it from every deck`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Prune");
    const cardType = await adapter.saveCardType(
      project.id,
      sampleCardType({ cards: [{ id: "c1", values: {} }, { id: "c2", values: {} }] }),
    );
    await adapter.saveDeck(project.id, { name: "A", entries: [{ cardId: "c1", count: 2 }, { cardId: "c2", count: 1 }] });
    await adapter.saveDeck(project.id, { name: "B", entries: [{ cardId: "c1", count: 3 }] });

    await adapter.saveCardType(project.id, { ...cardType, cards: [{ id: "c2", values: {} }] });

    const loaded = await adapter.getProject(project.id);
    assert.deepEqual(loaded.decks.find((d) => d.name === "A").entries, [{ cardId: "c2", count: 1 }]);
    assert.deepEqual(loaded.decks.find((d) => d.name === "B").entries, []);
  });

  test(`${label}: deleting a card type removes its cards from decks but keeps other entries`, async () => {
    const adapter = make();
    const project = await adapter.createProject("Prune");
    const monster = await adapter.saveCardType(
      project.id,
      sampleCardType({ name: "Monster", cards: [{ id: "m1", values: {} }] }),
    );
    await adapter.saveCardType(project.id, sampleCardType({ name: "Spell", cards: [{ id: "s1", values: {} }] }));
    await adapter.saveDeck(project.id, {
      name: "Mixed",
      entries: [{ cardId: "m1", count: 1 }, { cardId: "s1", count: 2 }],
    });

    await adapter.deleteCardType(project.id, monster.id);

    const loaded = await adapter.getProject(project.id);
    assert.deepEqual(loaded.decks[0].entries, [{ cardId: "s1", count: 2 }]);
  });
}

for (const [label, make] of adapters) {
  test(`${label}: importProject adds a new project with a distinct id`, async () => {
    const adapter = make();
    const existing = await adapter.createProject("Existing");
    const imported = await adapter.importProject(sampleEnvelope());
    assert.notEqual(imported.id, existing.id);
    assert.ok((await adapter.listProjects()).some((p) => p.id === imported.id));
  });

  test(`${label}: importProject gives the new project fresh timestamps`, async () => {
    const adapter = make();
    const before = Date.now();
    const imported = await adapter.importProject(sampleEnvelope());
    assert.ok(imported.createdAt >= before);
    assert.ok(Date.now() - imported.createdAt < 1000);
    assert.equal(imported.createdAt, imported.updatedAt);
  });

  test(`${label}: importProject resolves a colliding name without touching the existing project`, async () => {
    const adapter = make();
    const existing = await adapter.createProject("Imported");
    const imported = await adapter.importProject(sampleEnvelope());
    assert.notEqual(imported.name, "Imported");
    assert.equal((await adapter.getProject(existing.id)).name, "Imported");
  });

  test(`${label}: importProject regenerates card type, card and deck ids`, async () => {
    const adapter = make();
    const envelope = sampleEnvelope();
    const imported = await adapter.importProject(envelope);
    const sourceCardType = envelope.project.cardTypes[0];
    const importedCardType = imported.cardTypes[0];
    assert.notEqual(importedCardType.id, sourceCardType.id);
    assert.notEqual(importedCardType.cards[0].id, sourceCardType.cards[0].id);
    assert.deepEqual(imported.decks[0].entries, [{ cardId: importedCardType.cards[0].id, count: 2 }]);
  });

  test(`${label}: importProject drops a deck entry referencing a card absent from the envelope`, async () => {
    const adapter = make();
    const envelope = sampleEnvelope();
    envelope.project.decks[0].entries.push({ cardId: "missing", count: 1 });
    const imported = await adapter.importProject(envelope);
    assert.equal(imported.decks[0].entries.length, 1);
    assert.notEqual(imported.decks[0].entries[0].cardId, "missing");
  });

  test(`${label}: importProject rejects a malformed envelope and creates no project`, async () => {
    const adapter = make();
    const before = await adapter.listProjects();
    await assert.rejects(() => adapter.importProject({ not: "a project export" }));
    assert.deepEqual(await adapter.listProjects(), before);
  });
}
