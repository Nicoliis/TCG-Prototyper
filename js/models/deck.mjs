function sameName(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function validateCount(value) {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) throw new Error("Copies must be a whole number, zero or more.");
  return Number(text);
}

export function getDecks(project) {
  return project.decks ?? [];
}

export function validateDeckName(name, existingNames) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) throw new Error("Deck name cannot be empty.");
  if (existingNames.some((existing) => sameName(existing, trimmed))) {
    throw new Error(`A deck named "${trimmed}" already exists.`);
  }
  return trimmed;
}

export function createDeck(name, existingNames) {
  return { id: crypto.randomUUID(), name: validateDeckName(name, existingNames), entries: [] };
}

function validateEntries(entries) {
  for (const entry of entries) {
    if (!Number.isInteger(entry.count) || entry.count < 1) {
      throw new Error("Every deck entry needs a whole number of copies, 1 or more.");
    }
  }
}

export function upsertDeck(project, deck) {
  const decks = (project.decks ??= []);
  const otherNames = decks.filter((d) => d.id !== deck.id).map((d) => d.name);
  const saved = {
    ...deck,
    id: deck.id ?? crypto.randomUUID(),
    name: validateDeckName(deck.name, otherNames),
  };
  validateEntries(saved.entries);
  const index = decks.findIndex((d) => d.id === saved.id);
  if (index === -1) decks.push(saved);
  else decks[index] = saved;
  return saved;
}

export function removeDeck(project, deckId) {
  project.decks = getDecks(project).filter((d) => d.id !== deckId);
}

export function addCardToDeck(deck, cardId) {
  const entry = deck.entries.find((e) => e.cardId === cardId);
  if (entry) entry.count += 1;
  else deck.entries.push({ cardId, count: 1 });
}

export function setEntryCount(deck, cardId, value) {
  const count = validateCount(value);
  if (count === 0) {
    deck.entries = deck.entries.filter((e) => e.cardId !== cardId);
    return;
  }
  const entry = deck.entries.find((e) => e.cardId === cardId);
  if (entry) entry.count = count;
  else deck.entries.push({ cardId, count });
}

export function deckTotals(deck) {
  return {
    totalCards: deck.entries.reduce((sum, e) => sum + e.count, 0),
    distinctCards: deck.entries.length,
  };
}

export function cloneDecksForCards(decks, cardIdMap) {
  return decks.map((deck) => ({
    ...deck,
    id: crypto.randomUUID(),
    entries: deck.entries
      .filter((entry) => cardIdMap.has(entry.cardId))
      .map((entry) => ({ cardId: cardIdMap.get(entry.cardId), count: entry.count })),
  }));
}
