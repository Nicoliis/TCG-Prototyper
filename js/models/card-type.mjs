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

function validateColor(value) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) throw new Error("Color cannot be empty.");
  return trimmed;
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
    cards: [],
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
  for (const card of cardType.cards ?? []) delete card.values[propertyId];
}

const ELEMENT_KIND_LABEL = { text: "Text", image: "Image", label: "Label", icon: "Icon" };

export function createElement(
  kind,
  { x, y, width, height, rotation = 0, name = "", template = "", text = "", src = "" },
) {
  if (!ELEMENT_KINDS.includes(kind)) throw new Error(`Unknown element kind: ${kind}`);
  const base = {
    id: crypto.randomUUID(),
    kind,
    name: validateNonEmpty(name, "Element name"),
    x: validateNonNegativeNumber(x, "x"),
    y: validateNonNegativeNumber(y, "y"),
    width: validatePositiveNumber(width, "width"),
    height: validatePositiveNumber(height, "height"),
    rotation: validateRotation(rotation),
    style: defaultElementStyle(),
    textStyle: defaultTextStyle(),
  };
  if (kind === "text" || kind === "image") return { ...base, template };
  if (kind === "label") return { ...base, text };
  return { ...base, src };
}

function defaultElementName(cardType, kind) {
  const countOfKind = cardType.elements.filter((e) => e.kind === kind).length;
  return `${ELEMENT_KIND_LABEL[kind] ?? kind} ${countOfKind + 1}`;
}

export function getElementName(element) {
  return element.name ?? ELEMENT_KIND_LABEL[element.kind] ?? element.kind;
}

function validateRotation(degrees) {
  const n = Number(degrees);
  if (!Number.isFinite(n)) throw new Error("Rotation must be a number.");
  return ((n % 360) + 360) % 360;
}

export function defaultElementStyle() {
  return {
    background: { enabled: false, color: "#ffffff" },
    border: { enabled: false, color: "#000000", thickness: 1 },
    shadow: { enabled: false, color: "#000000", thickness: 4 },
  };
}

export function getElementStyle(element) {
  return element.style ?? defaultElementStyle();
}

export function setElementStyle(element, styleKey, patch) {
  element.style ??= defaultElementStyle();
  const next = { ...element.style[styleKey], ...patch };
  if ("color" in patch) next.color = validateColor(patch.color);
  if ("thickness" in patch) next.thickness = validatePositiveNumber(patch.thickness, "Thickness");
  element.style[styleKey] = next;
  return next;
}

const TEXT_ALIGNS = ["left", "center", "right"];
const TEXT_VERTICAL_ALIGNS = ["top", "middle", "bottom"];
const TEXT_OVERFLOW_MODES = ["wrap", "shrink", "squash"];

export function defaultTextStyle() {
  return {
    fontFamily: "system-ui, sans-serif",
    fontSize: 14,
    bold: false,
    align: "left",
    verticalAlign: "middle",
    overflow: "wrap",
  };
}

export function getTextStyle(element) {
  return element.textStyle ?? defaultTextStyle();
}

export function setTextStyle(element, patch) {
  element.textStyle ??= defaultTextStyle();
  const next = { ...element.textStyle, ...patch };
  if ("fontSize" in patch) next.fontSize = validatePositiveNumber(patch.fontSize, "Font size");
  if ("align" in patch && !TEXT_ALIGNS.includes(patch.align)) {
    throw new Error(`Text align must be one of: ${TEXT_ALIGNS.join(", ")}.`);
  }
  if ("verticalAlign" in patch && !TEXT_VERTICAL_ALIGNS.includes(patch.verticalAlign)) {
    throw new Error(`Text vertical align must be one of: ${TEXT_VERTICAL_ALIGNS.join(", ")}.`);
  }
  if ("overflow" in patch && !TEXT_OVERFLOW_MODES.includes(patch.overflow)) {
    throw new Error(`Text overflow mode must be one of: ${TEXT_OVERFLOW_MODES.join(", ")}.`);
  }
  element.textStyle = next;
  return next;
}

export function addElement(cardType, kind, bounds) {
  const name = bounds.name ?? defaultElementName(cardType, kind);
  const element = createElement(kind, { ...bounds, name });
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

export function cloneCardType(cardType, cardIdMap) {
  const propertyIdMap = new Map();
  const properties = cardType.properties.map((p) => {
    const id = crypto.randomUUID();
    propertyIdMap.set(p.id, id);
    return { ...p, id };
  });
  return {
    ...cardType,
    id: crypto.randomUUID(),
    properties,
    elements: cardType.elements.map((e) => ({
      ...e,
      id: crypto.randomUUID(),
      style: structuredClone(getElementStyle(e)),
      textStyle: structuredClone(getTextStyle(e)),
    })),
    cards: (cardType.cards ?? []).map((card) => {
      const id = crypto.randomUUID();
      cardIdMap?.set(card.id, id);
      return {
        id,
        values: Object.fromEntries(
          Object.entries(card.values)
            .filter(([propertyId]) => propertyIdMap.has(propertyId))
            .map(([propertyId, value]) => [propertyIdMap.get(propertyId), value]),
        ),
      };
    }),
  };
}
