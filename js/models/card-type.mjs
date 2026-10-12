const ELEMENT_KINDS = ["text", "image", "label", "icon"];

function sameName(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function validateNonEmpty(name, label) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) throw new Error(`${label} cannot be empty.`);
  return trimmed;
}

function validateUnique(trimmed, existingNames, label) {
  if (existingNames.some((existing) => sameName(existing, trimmed))) {
    throw new Error(`${label} "${trimmed}" already exists.`);
  }
}

function validatePositiveNumber(value, label) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${label} must be a positive number.`);
  return n;
}

function validateNonNegativeNumber(value, label) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error(`${label} must be zero or a positive number.`);
  return n;
}

export function validateCardTypeName(name, existingNames) {
  const trimmed = validateNonEmpty(name, "Card type name");
  validateUnique(trimmed, existingNames, "A card type named");
  return trimmed;
}

export function validatePropertyName(name, existingNames) {
  const trimmed = validateNonEmpty(name, "Property name");
  validateUnique(trimmed, existingNames, "A property named");
  return trimmed;
}

export function createCardType(name, { width, height }, existingNames) {
  return {
    id: crypto.randomUUID(),
    name: validateCardTypeName(name, existingNames),
    width: validatePositiveNumber(width, "Width"),
    height: validatePositiveNumber(height, "Height"),
    properties: [],
    elements: [],
  };
}

export function renameCardType(cardType, name, existingNames) {
  cardType.name = validateCardTypeName(name, existingNames);
  return cardType;
}

export function setCardTypeDimensions(cardType, { width, height }) {
  cardType.width = validatePositiveNumber(width, "Width");
  cardType.height = validatePositiveNumber(height, "Height");
  return cardType;
}

export function createProperty(name, existingNames, sampleValue = "") {
  return {
    id: crypto.randomUUID(),
    name: validatePropertyName(name, existingNames),
    sampleValue,
  };
}

export function addProperty(cardType, name, sampleValue = "") {
  const property = createProperty(
    name,
    cardType.properties.map((p) => p.name),
    sampleValue,
  );
  cardType.properties.push(property);
  return property;
}

export function removeProperty(cardType, propertyId) {
  cardType.properties = cardType.properties.filter((p) => p.id !== propertyId);
}

export function createElement(kind, { x, y, width, height, template = "", text = "", src = "" }) {
  if (!ELEMENT_KINDS.includes(kind)) throw new Error(`Unknown element kind: ${kind}`);
  const base = {
    id: crypto.randomUUID(),
    kind,
    x: validateNonNegativeNumber(x, "x"),
    y: validateNonNegativeNumber(y, "y"),
    width: validatePositiveNumber(width, "width"),
    height: validatePositiveNumber(height, "height"),
  };
  if (kind === "text" || kind === "image") return { ...base, template };
  if (kind === "label") return { ...base, text };
  return { ...base, src };
}

export function addElement(cardType, kind, bounds) {
  const element = createElement(kind, bounds);
  cardType.elements.push(element);
  return element;
}

export function removeElement(cardType, elementId) {
  cardType.elements = cardType.elements.filter((e) => e.id !== elementId);
}

export function updateElementBounds(element, { x, y, width, height }) {
  element.x = validateNonNegativeNumber(x, "x");
  element.y = validateNonNegativeNumber(y, "y");
  element.width = validatePositiveNumber(width, "width");
  element.height = validatePositiveNumber(height, "height");
  return element;
}

export function cloneCardType(cardType) {
  return {
    ...cardType,
    id: crypto.randomUUID(),
    properties: cardType.properties.map((p) => ({ ...p, id: crypto.randomUUID() })),
    elements: cardType.elements.map((e) => ({ ...e, id: crypto.randomUUID() })),
  };
}
