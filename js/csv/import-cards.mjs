import { getCards, createCard, getCardValue, setCardValue } from "../models/card.mjs?v=15";

function normalize(value) {
  return (value ?? "").trim().toLowerCase();
}

function mapColumns(properties, headerRow) {
  const columnByPropertyId = new Map();
  const ignoredColumns = [];
  headerRow.forEach((header, index) => {
    const property = properties.find((p) => normalize(p.name) === normalize(header));
    if (property && !columnByPropertyId.has(property.id)) columnByPropertyId.set(property.id, index);
    else ignoredColumns.push(header);
  });
  return { columnByPropertyId, ignoredColumns };
}

function indexByKey(cards, keyPropertyId) {
  const index = new Map();
  for (const card of cards) {
    const key = normalize(getCardValue(card, keyPropertyId));
    if (key && !index.has(key)) index.set(key, card);
  }
  return index;
}

export function importCards(cardType, csvRows, keyPropertyId) {
  const [headerRow = [], ...dataRows] = csvRows;
  const { columnByPropertyId, ignoredColumns } = mapColumns(cardType.properties, headerRow);
  const unfilledProperties = cardType.properties
    .filter((p) => !columnByPropertyId.has(p.id))
    .map((p) => p.name);

  const existingCards = getCards(cardType);
  const cards = [...existingCards];
  const existingByKey = indexByKey(existingCards, keyPropertyId);
  const keyColumn = columnByPropertyId.get(keyPropertyId);
  let created = 0;
  let updated = 0;

  for (const row of dataRows) {
    const rowKey = keyColumn === undefined ? "" : normalize(row[keyColumn]);
    const match = rowKey ? existingByKey.get(rowKey) : undefined;
    const target = match ?? createCard();
    for (const [propertyId, column] of columnByPropertyId) {
      setCardValue(target, propertyId, row[column] ?? "");
    }
    if (match) updated++;
    else {
      cards.push(target);
      created++;
    }
  }

  return { cards, report: { created, updated, ignoredColumns, unfilledProperties } };
}
