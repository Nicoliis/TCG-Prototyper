import { cloneCardType } from "./card-type.mjs";
import { getDecks, cloneDecksForCards } from "./deck.mjs";

function sameName(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function resolveImportName(name, existingNames) {
  const trimmed = name.trim();
  if (!existingNames.some((existing) => sameName(existing, trimmed))) return trimmed;
  const baseName = `${trimmed} copy`;
  let candidate = baseName;
  let suffix = 2;
  while (existingNames.some((existing) => sameName(existing, candidate))) {
    candidate = `${baseName} ${suffix++}`;
  }
  return candidate;
}

export function buildExportEnvelope(project) {
  return {
    cardgamePrototyperExport: "project",
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    project: {
      name: project.name,
      cardTypes: project.cardTypes,
      decks: getDecks(project),
    },
  };
}

export function exportFileName(projectName) {
  const slug = (projectName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "project"}.json`;
}

export function validateExportEnvelope(parsed) {
  const project = parsed && typeof parsed === "object" ? parsed.project : null;
  const valid =
    parsed &&
    typeof parsed === "object" &&
    parsed.cardgamePrototyperExport === "project" &&
    project &&
    typeof project === "object" &&
    typeof project.name === "string" &&
    project.name.trim() !== "" &&
    Array.isArray(project.cardTypes);
  if (!valid) throw new Error("This file is not a Cardgame Prototyper project export.");
}

export function buildProjectFromImport(envelope, existingNames) {
  const cardIdMap = new Map();
  const cardTypes = envelope.project.cardTypes.map((cardType) => cloneCardType(cardType, cardIdMap));
  const decks = cloneDecksForCards(envelope.project.decks ?? [], cardIdMap);
  const name = resolveImportName(envelope.project.name, existingNames);
  return { name, cardTypes, decks };
}
