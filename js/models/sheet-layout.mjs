export const PAPER_SIZES = {
  a4: { label: "A4", widthPx: 793.7, heightPx: 1122.5, pageSize: "210mm 297mm" },
  letter: { label: "US Letter", widthPx: 816, heightPx: 1056, pageSize: "8.5in 11in" },
};

export const PAGE_MARGIN_PX = 24;

const PX_PER_INCH = 96;
const MAX_SPACING_INCHES = 0.5;
const DEFAULT_SPACING_INCHES = 0.1;
const MIN_SPACING_WITH_GUIDES_INCHES = 0.1;
const LETTER_LOCALES = ["en-US", "en-CA", "es-MX"];
const FIT_TOLERANCE = 1e-6;

export function defaultSheetSettings(locale = "") {
  return {
    paper: LETTER_LOCALES.includes(locale) ? "letter" : "a4",
    spacingInches: DEFAULT_SPACING_INCHES,
    cutGuides: false,
  };
}

export function validateSheetSettings(raw, locale = "") {
  const defaults = defaultSheetSettings(locale);
  const source = raw && typeof raw === "object" ? raw : {};
  const spacing = source.spacingInches;
  const spacingIsValid = typeof spacing === "number" && spacing >= 0 && spacing <= MAX_SPACING_INCHES;
  return {
    paper: source.paper in PAPER_SIZES ? source.paper : defaults.paper,
    spacingInches: spacingIsValid ? spacing : defaults.spacingInches,
    cutGuides: source.cutGuides === true,
  };
}

function expandPlacements(items, contentWidth, contentHeight) {
  const cards = [];
  for (const { cardType, card, count } of items) {
    const scale = Math.min(1, contentWidth / cardType.width, contentHeight / cardType.height);
    for (let copy = 0; copy < count; copy++) {
      cards.push({
        cardId: card.id,
        cardTypeId: cardType.id,
        width: cardType.width * scale,
        height: cardType.height * scale,
        scale,
      });
    }
  }
  return cards;
}

export function layoutSheets(items, settings) {
  const paper = PAPER_SIZES[settings.paper];
  const contentWidth = paper.widthPx - 2 * PAGE_MARGIN_PX;
  const contentHeight = paper.heightPx - 2 * PAGE_MARGIN_PX;
  const spacing =
    Math.max(settings.spacingInches, settings.cutGuides ? MIN_SPACING_WITH_GUIDES_INCHES : 0) * PX_PER_INCH;

  const pages = [];
  let page = null;
  let x = 0;
  let y = 0;
  let rowHeight = 0;

  function startPage() {
    page = { placements: [] };
    pages.push(page);
    x = 0;
    y = 0;
    rowHeight = 0;
  }

  const cards = expandPlacements(items, contentWidth, contentHeight);
  for (const card of cards) {
    if (!page) startPage();
    if (x > 0 && x + card.width > contentWidth + FIT_TOLERANCE) {
      x = 0;
      y += rowHeight + spacing;
      rowHeight = 0;
    }
    if (y + card.height > contentHeight + FIT_TOLERANCE) startPage();
    page.placements.push({ ...card, x: PAGE_MARGIN_PX + x, y: PAGE_MARGIN_PX + y });
    x += card.width + spacing;
    rowHeight = Math.max(rowHeight, card.height);
  }

  return {
    pages,
    scaledCount: cards.filter((c) => c.scale < 1).length,
    totalCards: cards.length,
  };
}
