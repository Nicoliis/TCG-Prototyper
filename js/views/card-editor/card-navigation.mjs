import { cardsInNumberOrder, findCardByNumber } from "../../models/card-numbering.mjs?v=27";

export function adjacentCard(cardType, number, direction) {
  const sorted = cardsInNumberOrder(cardType);
  const index = sorted.findIndex((card) => card.number === number);
  return sorted[index + direction] ?? null;
}

export function positionOf(cardType, number) {
  const sorted = cardsInNumberOrder(cardType);
  return { index: sorted.findIndex((card) => card.number === number) + 1, total: sorted.length };
}

export function resolveGoTo(cardType, text) {
  const trimmed = String(text ?? "").trim();
  if (!/^\d+$/.test(trimmed)) return { error: "Enter a card ID (a whole number)." };
  const card = findCardByNumber(cardType, Number(trimmed));
  return card ? { card } : { error: `There is no card with ID ${trimmed}.` };
}

export function cardToShowAfterDelete(cardType, number) {
  return adjacentCard(cardType, number, 1) ?? adjacentCard(cardType, number, -1);
}
