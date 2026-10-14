import { getCards, createCard, getCardValue, setCardValue } from "../models/card.mjs?v=26";
import { ID_PROPERTY, nextNumber } from "../models/card-numbering.mjs?v=26";
import { validateValue } from "../models/property-types.mjs?v=26";

function normalize(value) {
  return (value ?? "").trim().toLowerCase();
}

function mapColumns(properties, headerRow, keyColumnByIdHeader) {
  const columnByPropertyId = new Map();
  const ignoredColumns = [];
  headerRow.forEach((header, index) => {
    const property = properties.find((p) => normalize(p.name) === normalize(header));
    if (property && !columnByPropertyId.has(property.id)) columnByPropertyId.set(property.id, index);
    else if (!(keyColumnByIdHeader && index === keyColumnByIdHeader.column)) ignoredColumns.push(header);
  });
  return { columnByPropertyId, ignoredColumns };
}

function indexByKey(cards, keyPropertyId) {
  const index = new Map();
  for (const card of cards) {
    const key =
      keyPropertyId === ID_PROPERTY.id ? String(card.number) : normalize(getCardValue(card, keyPropertyId));
    if (key && !index.has(key)) index.set(key, card);
  }
  return index;
}

function findIdColumn(headerRow) {
  const column = headerRow.findIndex((header) => normalize(header) === normalize(ID_PROPERTY.name));
  return column === -1 ? null : { column };
}

export function importCards(cardType, csvRows, keyPropertyId) {
  const [headerRow = [], ...dataRows] = csvRows;
  const keyedById = keyPropertyId === ID_PROPERTY.id;
  const idColumn = keyedById ? findIdColumn(headerRow) : null;
  const { columnByPropertyId, ignoredColumns } = mapColumns(cardType.properties, headerRow, idColumn);
  const unfilledProperties = cardType.properties
    .filter((p) => !columnByPropertyId.has(p.id))
    .map((p) => p.name);

  const existingCards = getCards(cardType);
  const cards = [...existingCards];
  const existingByKey = indexByKey(existingCards, keyPropertyId);
  const keyColumn = keyedById ? idColumn?.column : columnByPropertyId.get(keyPropertyId);
  const invalidValues = [];
  let created = 0;
  let updated = 0;

  dataRows.forEach((row, rowIndex) => {
    const rowKey = keyColumn === undefined || keyColumn === null ? "" : normalize(row[keyColumn]);
    const match = rowKey ? existingByKey.get(rowKey) : undefined;
    const target = match ?? createCard({}, nextNumber(cardType));
    for (const [propertyId, column] of columnByPropertyId) {
      const value = row[column] ?? "";
      const property = cardType.properties.find((p) => p.id === propertyId);
      if (!validateValue(property.type, value).ok) {
        invalidValues.push({ row: rowIndex + 1, property: property.name, value });
      }
      setCardValue(target, propertyId, value);
    }
    if (match) updated++;
    else {
      cards.push(target);
      created++;
    }
  });

  return { cards, report: { created, updated, ignoredColumns, unfilledProperties, invalidValues } };
}
