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
