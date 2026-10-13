export function getCards(cardType) {
  return cardType.cards ?? [];
}

export function createCard(values = {}) {
  return { id: crypto.randomUUID(), values };
}

export function getCardValue(card, propertyId) {
  return card.values[propertyId] ?? "";
}

export function setCardValue(card, propertyId, value) {
  if (value === "") delete card.values[propertyId];
  else card.values[propertyId] = String(value);
}

export function addCard(cardType, values = {}) {
  cardType.cards ??= [];
  const card = createCard(values);
  cardType.cards.push(card);
  return card;
}

export function removeCard(cardType, cardId) {
  cardType.cards = getCards(cardType).filter((c) => c.id !== cardId);
}
