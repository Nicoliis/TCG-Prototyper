import { cloneCardType } from "./card-type.mjs?v=19";
import { getDecks, cloneDecksForCards } from "./deck.mjs?v=19";

function sameName(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function validateProjectName(name, existingNames) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) throw new Error("Project name cannot be empty.");
  if (existingNames.some((existing) => sameName(existing, trimmed))) {
    throw new Error(`A project named "${trimmed}" already exists.`);
  }
  return trimmed;
}

export function createProject(name, existingNames) {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name: validateProjectName(name, existingNames),
    cardTypes: [],
    decks: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function cloneProjectForDuplicate(project, existingNames) {
  const baseName = `${project.name} copy`;
  let name = baseName;
  let suffix = 2;
  while (existingNames.some((existing) => sameName(existing, name))) {
    name = `${baseName} ${suffix++}`;
  }
  const now = Date.now();
  const cardIdMap = new Map();
  return {
    id: crypto.randomUUID(),
    name,
    cardTypes: project.cardTypes.map((cardType) => cloneCardType(cardType, cardIdMap)),
    decks: cloneDecksForCards(getDecks(project), cardIdMap),
    createdAt: now,
    updatedAt: now,
  };
}
