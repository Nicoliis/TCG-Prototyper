// The "pack" is everything a playtest needs to know about the project: the board, the decks, and the card types
// with ONLY the cards the decks use. The room creator builds it from their project and sends it to the joiner, who
// may not have the project at all.

export function buildPack(project, board) {
  const used = new Set((project.decks ?? []).flatMap((deck) => deck.entries.map((e) => e.cardId)));
  const cardTypes = project.cardTypes
    .map((cardType) => ({ ...structuredClone(cardType), cards: (cardType.cards ?? []).filter((card) => used.has(card.id)) }))
    .filter((cardType) => cardType.cards.length > 0);
  return {
    projectName: project.name,
    board: structuredClone(board),
    decks: structuredClone(project.decks ?? []).filter((deck) => deck.entries.length > 0),
    cardTypes,
  };
}

export function validatePack(pack) {
  return Boolean(
    pack &&
      typeof pack === "object" &&
      pack.board &&
      Array.isArray(pack.board.zones) &&
      Array.isArray(pack.decks) &&
      Array.isArray(pack.cardTypes),
  );
}

// cardId -> { cardType, card }
export function indexCards(pack) {
  const index = new Map();
  for (const cardType of pack.cardTypes) for (const card of cardType.cards) index.set(card.id, { cardType, card });
  return index;
}

// A short readable name for the log: the property called Name (or the first filled property).
export function cardLabel(cardType, card) {
  const named = cardType.properties.find((p) => /^(name|nombre)$/i.test(p.name));
  const candidates = named ? [named, ...cardType.properties] : cardType.properties;
  for (const property of candidates) {
    const value = (card.values[property.id] ?? "").trim();
    if (value) return value;
  }
  return `${cardType.name} #${card.number ?? "?"}`;
}

export function makeContext(pack) {
  const index = indexCards(pack);
  return {
    board: pack.board,
    pack,
    index,
    cardName: (cardId) => {
      const found = index.get(cardId);
      return found ? cardLabel(found.cardType, found.card) : null;
    },
  };
}
