import { findCard } from "./deck.mjs?v=20";

export function selectionFromDeck(deck) {
  return { entries: deck.entries.map((entry) => ({ cardId: entry.cardId, count: entry.count })) };
}

export function resolveSelection(project, selection) {
  const items = [];
  for (const entry of selection.entries) {
    const found = findCard(project, entry.cardId);
    if (found) items.push({ cardType: found.cardType, card: found.card, count: entry.count });
  }
  return items;
}

export function cardValuesByName(cardType, card) {
  return Object.fromEntries(cardType.properties.map((p) => [p.name, card.values[p.id] ?? ""]));
}
