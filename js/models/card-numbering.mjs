import { DEFAULT_PROPERTY_TYPE } from "./property-types.mjs?v=29";

export const ID_PROPERTY = Object.freeze({ id: "__id__", name: "ID", type: "integer", builtin: true });

function highestNumber(cardType) {
  return Math.max(0, ...(cardType.cards ?? []).map((card) => card.number ?? 0));
}

export function getSchema(cardType) {
  return [ID_PROPERTY, ...cardType.properties];
}

export function nextNumber(cardType) {
  const number = Math.max(cardType.nextCardNumber ?? 1, highestNumber(cardType) + 1);
  cardType.nextCardNumber = number + 1;
  return number;
}

export function findCardByNumber(cardType, number) {
  return (cardType.cards ?? []).find((card) => card.number === number) ?? null;
}

export function cardsInNumberOrder(cardType) {
  return [...(cardType.cards ?? [])].sort((a, b) => a.number - b.number);
}

export function normalizeCardType(cardType) {
  for (const property of cardType.properties) property.type ??= DEFAULT_PROPERTY_TYPE;
  cardType.cards ??= [];
  cardType.nextCardNumber = Math.max(cardType.nextCardNumber ?? 1, highestNumber(cardType) + 1);
  for (const card of cardType.cards) card.number ??= nextNumber(cardType);
  return cardType;
}

export function normalizeProject(project) {
  project.cardTypes.forEach(normalizeCardType);
  return project;
}
