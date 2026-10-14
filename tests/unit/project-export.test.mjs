import test from "node:test";
import assert from "node:assert/strict";
import { createProject } from "../../js/models/project.mjs";
import { createCardType, addProperty, addElement } from "../../js/models/card-type.mjs";
import { addCard } from "../../js/models/card.mjs";
import { createDeck, upsertDeck, addCardToDeck } from "../../js/models/deck.mjs";
import {
  buildExportEnvelope,
  exportFileName,
  validateExportEnvelope,
  buildProjectFromImport,
} from "../../js/models/project-export.mjs";

function sampleProject() {
  const project = createProject("Source", []);
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const property = addProperty(cardType, "atk");
  addElement(cardType, "text", { x: 0, y: 0, width: 50, height: 20 });
  project.cardTypes.push(cardType);
  const card = addCard(cardType, { [property.id]: "5" });
  const deck = createDeck("Deck A", []);
  addCardToDeck(deck, card.id);
  upsertDeck(project, deck);
  return project;
}

test("buildExportEnvelope carries full project contents without id/timestamps", () => {
  const project = sampleProject();
  const envelope = buildExportEnvelope(project);
  assert.equal(envelope.cardgamePrototyperExport, "project");
  assert.equal(envelope.formatVersion, 1);
  assert.equal(typeof envelope.exportedAt, "string");
  assert.equal(envelope.project.name, "Source");
  assert.equal(envelope.project.cardTypes.length, 1);
  assert.equal(envelope.project.decks.length, 1);
  assert.equal(envelope.project.id, undefined);
  assert.equal(envelope.project.createdAt, undefined);
  assert.equal(envelope.project.updatedAt, undefined);
});

test("exportFileName slugifies a typical project name", () => {
  assert.equal(exportFileName("My Deck Game!"), "my-deck-game.json");
});

test("exportFileName falls back to project.json for an all-symbols name", () => {
  assert.equal(exportFileName("@@@"), "project.json");
});

test("validateExportEnvelope accepts a well-formed envelope", () => {
  const envelope = buildExportEnvelope(sampleProject());
  assert.doesNotThrow(() => validateExportEnvelope(envelope));
});

test("validateExportEnvelope rejects null", () => {
  assert.throws(() => validateExportEnvelope(null));
});

test("validateExportEnvelope rejects an unrelated object", () => {
  assert.throws(() => validateExportEnvelope({ hello: "world" }));
});

test("validateExportEnvelope rejects a missing marker", () => {
  const envelope = buildExportEnvelope(sampleProject());
  delete envelope.cardgamePrototyperExport;
  assert.throws(() => validateExportEnvelope(envelope));
});

test("validateExportEnvelope rejects a non-string project name", () => {
  const envelope = buildExportEnvelope(sampleProject());
  envelope.project.name = 42;
  assert.throws(() => validateExportEnvelope(envelope));
});

test("validateExportEnvelope rejects a non-array cardTypes", () => {
  const envelope = buildExportEnvelope(sampleProject());
  envelope.project.cardTypes = "nope";
  assert.throws(() => validateExportEnvelope(envelope));
});

test("validateExportEnvelope tolerates a missing decks array", () => {
  const envelope = buildExportEnvelope(sampleProject());
  delete envelope.project.decks;
  assert.doesNotThrow(() => validateExportEnvelope(envelope));
});

test("buildProjectFromImport regenerates every id and remaps deck references", () => {
  const source = sampleProject();
  const envelope = buildExportEnvelope(source);
  const built = buildProjectFromImport(envelope, []);

  const sourceCardType = source.cardTypes[0];
  const builtCardType = built.cardTypes[0];
  assert.notEqual(builtCardType.id, sourceCardType.id);
  assert.notEqual(builtCardType.properties[0].id, sourceCardType.properties[0].id);
  assert.notEqual(builtCardType.elements[0].id, sourceCardType.elements[0].id);
  assert.notEqual(builtCardType.cards[0].id, sourceCardType.cards[0].id);

  assert.equal(built.decks[0].entries.length, 1);
  assert.equal(built.decks[0].entries[0].cardId, builtCardType.cards[0].id);
  assert.notEqual(built.decks[0].entries[0].cardId, sourceCardType.cards[0].id);
});

test("buildProjectFromImport drops a deck entry whose card is missing from the envelope", () => {
  const source = sampleProject();
  const envelope = buildExportEnvelope(source);
  envelope.project.decks[0].entries.push({ cardId: "does-not-exist", count: 1 });
  const built = buildProjectFromImport(envelope, []);
  assert.equal(built.decks[0].entries.length, 1);
  assert.notEqual(built.decks[0].entries[0].cardId, "does-not-exist");
});

test("buildProjectFromImport keeps a non-colliding name untouched", () => {
  const envelope = buildExportEnvelope(sampleProject());
  const built = buildProjectFromImport(envelope, ["Other Project"]);
  assert.equal(built.name, "Source");
});

test("buildProjectFromImport resolves a colliding name", () => {
  const envelope = buildExportEnvelope(sampleProject());
  const built = buildProjectFromImport(envelope, ["Source"]);
  assert.equal(built.name, "Source copy");
});

test("export then import preserves property types and card numbers", () => {
  const project = sampleProject();
  project.cardTypes[0].properties[0].type = "integer";
  const built = buildProjectFromImport(buildExportEnvelope(project), []);
  assert.equal(built.cardTypes[0].properties[0].type, "integer");
  assert.equal(built.cardTypes[0].cards[0].number, 1);
  assert.equal(built.cardTypes[0].nextCardNumber, 2);
});

test("importing a legacy export without types or numbers fills them in", () => {
  const envelope = buildExportEnvelope(sampleProject());
  const legacyType = envelope.project.cardTypes[0];
  delete legacyType.nextCardNumber;
  delete legacyType.properties[0].type;
  delete legacyType.cards[0].number;
  const built = buildProjectFromImport(envelope, []);
  assert.equal(built.cardTypes[0].properties[0].type, "line");
  assert.equal(built.cardTypes[0].cards[0].number, 1);
});

test("export then import keeps formatting markers in values and templates", () => {
  const project = sampleProject();
  const cardType = project.cardTypes[0];
  const atk = cardType.properties[0];
  cardType.cards[0].values[atk.id] = "**5** and *six*";
  cardType.elements[0].template = "__ATK__ {atk}";
  const built = buildProjectFromImport(buildExportEnvelope(project), []);
  const imported = built.cardTypes[0];
  assert.equal(imported.cards[0].values[imported.properties[0].id], "**5** and *six*");
  assert.equal(imported.elements[0].template, "__ATK__ {atk}");
});
