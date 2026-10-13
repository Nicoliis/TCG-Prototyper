import test from "node:test";
import assert from "node:assert/strict";
import {
  PAPER_SIZES,
  PAGE_MARGIN_PX,
  defaultSheetSettings,
  validateSheetSettings,
  layoutSheets,
} from "../../js/models/sheet-layout.mjs";

const cardType = (id, width, height) => ({ id, width, height });
const item = (type, cardId, count) => ({ cardType: type, card: { id: cardId }, count });
const standard = cardType("std", 240, 336);

test("default paper follows the locale", () => {
  assert.equal(defaultSheetSettings("en-US").paper, "letter");
  assert.equal(defaultSheetSettings("es-MX").paper, "letter");
  assert.equal(defaultSheetSettings("es-AR").paper, "a4");
  assert.equal(defaultSheetSettings().paper, "a4");
});

test("validateSheetSettings falls back to defaults on garbage", () => {
  const defaults = defaultSheetSettings("en-US");
  assert.deepEqual(validateSheetSettings(null, "en-US"), defaults);
  assert.deepEqual(validateSheetSettings("nope", "en-US"), defaults);
  assert.deepEqual(validateSheetSettings({ paper: "a0", spacingInches: -1, cutGuides: "yes" }, "en-US"), defaults);
  assert.equal(validateSheetSettings({ spacingInches: 9 }).spacingInches, defaults.spacingInches);
});

test("validateSheetSettings keeps valid values", () => {
  const settings = { paper: "letter", spacingInches: 0.25, cutGuides: true };
  assert.deepEqual(validateSheetSettings(settings), settings);
});

test("an empty selection lays out nothing", () => {
  assert.deepEqual(layoutSheets([], defaultSheetSettings()), { pages: [], scaledCount: 0, totalCards: 0 });
});

test("A4 fits nine standard cards per page at the default spacing", () => {
  const result = layoutSheets([item(standard, "c1", 10)], { paper: "a4", spacingInches: 0.1, cutGuides: false });
  assert.deepEqual(result.pages.map((p) => p.placements.length), [9, 1]);
  assert.equal(result.totalCards, 10);
});

test("Letter fits six standard cards per page at the default spacing and nine with no spacing", () => {
  const withSpacing = layoutSheets([item(standard, "c1", 9)], { paper: "letter", spacingInches: 0.1, cutGuides: false });
  assert.deepEqual(withSpacing.pages.map((p) => p.placements.length), [6, 3]);
  const tight = layoutSheets([item(standard, "c1", 9)], { paper: "letter", spacingInches: 0, cutGuides: false });
  assert.deepEqual(tight.pages.map((p) => p.placements.length), [9]);
});

test("copies expand in item order without reordering", () => {
  const result = layoutSheets(
    [item(standard, "a", 2), item(standard, "b", 1), item(standard, "c", 2)],
    defaultSheetSettings(),
  );
  assert.deepEqual(result.pages[0].placements.map((p) => p.cardId), ["a", "a", "b", "c", "c"]);
});

test("total cards equals the sum of copies", () => {
  const result = layoutSheets([item(standard, "a", 4), item(cardType("w", 100, 100), "b", 7)], defaultSheetSettings());
  assert.equal(result.totalCards, 11);
});

test("larger spacing changes how many fit in a row", () => {
  const tight = layoutSheets([item(standard, "a", 3)], { paper: "letter", spacingInches: 0, cutGuides: false });
  const wide = layoutSheets([item(standard, "a", 3)], { paper: "letter", spacingInches: 0.5, cutGuides: false });
  assert.equal(tight.pages[0].placements[2].y, tight.pages[0].placements[0].y);
  assert.ok(wide.pages[0].placements[2].y > wide.pages[0].placements[0].y);
});

test("cut guides keep at least 0.1 in between cards even at zero spacing", () => {
  const { pages } = layoutSheets([item(standard, "a", 2)], { paper: "letter", spacingInches: 0, cutGuides: true });
  const [first, second] = pages[0].placements;
  assert.ok(second.x - (first.x + first.width) >= 9.6 - 1e-6);
});

test("an oversized card is scaled to fit and counted", () => {
  const huge = cardType("huge", 2000, 3000);
  const { pages, scaledCount } = layoutSheets([item(huge, "h", 1), item(standard, "s", 1)], defaultSheetSettings());
  const [scaled] = pages[0].placements;
  const paper = PAPER_SIZES.a4;
  assert.ok(scaled.scale < 1);
  assert.ok(scaled.width <= paper.widthPx - 2 * PAGE_MARGIN_PX + 1e-6);
  assert.ok(scaled.height <= paper.heightPx - 2 * PAGE_MARGIN_PX + 1e-6);
  assert.equal(scaledCount, 1);
});

test("mixed sizes never overlap and stay inside the content area", () => {
  const items = [
    item(cardType("a", 240, 336), "a", 7),
    item(cardType("b", 336, 240), "b", 5),
    item(cardType("c", 150, 150), "c", 11),
    item(cardType("d", 700, 400), "d", 2),
  ];
  for (const paperKey of Object.keys(PAPER_SIZES)) {
    for (const spacingInches of [0, 0.1, 0.5]) {
      const { pages } = layoutSheets(items, { paper: paperKey, spacingInches, cutGuides: false });
      const paper = PAPER_SIZES[paperKey];
      for (const { placements } of pages) {
        for (const p of placements) {
          assert.ok(p.x >= PAGE_MARGIN_PX - 1e-6 && p.y >= PAGE_MARGIN_PX - 1e-6);
          assert.ok(p.x + p.width <= paper.widthPx - PAGE_MARGIN_PX + 1e-6);
          assert.ok(p.y + p.height <= paper.heightPx - PAGE_MARGIN_PX + 1e-6);
        }
        for (let i = 0; i < placements.length; i++) {
          for (let j = i + 1; j < placements.length; j++) {
            const a = placements[i];
            const b = placements[j];
            const overlaps =
              a.x < b.x + b.width - 1e-6 &&
              b.x < a.x + a.width - 1e-6 &&
              a.y < b.y + b.height - 1e-6 &&
              b.y < a.y + a.height - 1e-6;
            assert.equal(overlaps, false);
          }
        }
      }
    }
  }
});
