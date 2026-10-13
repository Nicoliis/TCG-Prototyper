import test from "node:test";
import assert from "node:assert/strict";
import {
  createCardType,
  addProperty,
  addElement,
  cloneCardType,
  getElementStyle,
  setElementStyle,
  getElementName,
  getTextStyle,
  setTextStyle,
} from "../../js/models/card-type.mjs";

test("createCardType rejects an empty name", () => {
  assert.throws(() => createCardType("  ", { width: 100, height: 140 }, []));
});

test("createCardType rejects a duplicate name", () => {
  assert.throws(() => createCardType("Monster", { width: 100, height: 140 }, ["Monster"]));
});

test("createCardType rejects non-positive dimensions", () => {
  assert.throws(() => createCardType("Monster", { width: 0, height: 140 }, []));
});

test("addProperty rejects duplicate property names on the same card type", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  addProperty(cardType, "atk");
  assert.throws(() => addProperty(cardType, "atk"));
});

test("addElement rejects an unknown element kind", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  assert.throws(() => addElement(cardType, "sparkle", { x: 0, y: 0, width: 10, height: 10 }));
});

test("addElement accepts all four known kinds with valid bounds", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  for (const kind of ["text", "image", "label", "icon"]) {
    assert.doesNotThrow(() => addElement(cardType, kind, { x: 0, y: 0, width: 10, height: 10 }));
  }
});

test("addElement defaults rotation to 0 and rejects a non-finite rotation", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10 });
  assert.equal(element.rotation, 0);
  assert.throws(() =>
    addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10, rotation: NaN }),
  );
});

test("addElement normalizes rotation into the 0-360 range", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10, rotation: -90 });
  assert.equal(element.rotation, 270);
});

test("new elements default to background/border/shadow all disabled", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10 });
  const style = getElementStyle(element);
  assert.equal(style.background.enabled, false);
  assert.equal(style.border.enabled, false);
  assert.equal(style.shadow.enabled, false);
});

test("getElementStyle defaults an element saved before this feature (no style field at all)", () => {
  const legacyElement = { id: "x", kind: "label", x: 0, y: 0, width: 10, height: 10, text: "Hi" };
  const style = getElementStyle(legacyElement);
  assert.equal(style.background.enabled, false);
  assert.equal(style.border.enabled, false);
  assert.equal(style.shadow.enabled, false);
});

test("setElementStyle heals a legacy element with no style field and rejects a non-positive thickness", () => {
  const legacyElement = { id: "x", kind: "label", x: 0, y: 0, width: 10, height: 10, text: "Hi" };
  setElementStyle(legacyElement, "border", { enabled: true, color: "#ff0000", thickness: 2 });
  assert.equal(legacyElement.style.border.thickness, 2);
  assert.throws(() => setElementStyle(legacyElement, "border", { thickness: 0 }));
});

test("addElement gives each new element a default name scoped by kind", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const firstText = addElement(cardType, "text", { x: 0, y: 0, width: 10, height: 10 });
  const secondText = addElement(cardType, "text", { x: 0, y: 0, width: 10, height: 10 });
  const firstLabel = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10 });
  assert.equal(firstText.name, "Text 1");
  assert.equal(secondText.name, "Text 2");
  assert.equal(firstLabel.name, "Label 1");
});

test("addElement accepts an explicit name instead of the default", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10, name: "Title" });
  assert.equal(element.name, "Title");
});

test("getElementName falls back to a kind-based label for an element saved before this feature", () => {
  const legacyElement = { id: "x", kind: "label", x: 0, y: 0, width: 10, height: 10, text: "Hi" };
  assert.equal(getElementName(legacyElement), "Label");
});

test("cloneCardType deep-copies each element's style so duplicates stay independent", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10 });
  const duplicate = cloneCardType(cardType);

  setElementStyle(duplicate.elements[0], "background", { enabled: true, color: "#00ff00" });

  assert.equal(element.style.background.enabled, false);
  assert.equal(duplicate.elements[0].style.background.enabled, true);
});

test("new elements default to left-aligned, wrapping, non-bold text style", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "text", { x: 0, y: 0, width: 10, height: 10 });
  const textStyle = getTextStyle(element);
  assert.equal(textStyle.align, "left");
  assert.equal(textStyle.verticalAlign, "middle");
  assert.equal(textStyle.overflow, "wrap");
  assert.equal(textStyle.bold, false);
});

test("getTextStyle defaults an element saved before this feature (no textStyle field at all)", () => {
  const legacyElement = { id: "x", kind: "text", x: 0, y: 0, width: 10, height: 10, template: "{atk}" };
  const textStyle = getTextStyle(legacyElement);
  assert.equal(textStyle.fontFamily, "system-ui, sans-serif");
  assert.equal(textStyle.fontSize, 14);
});

test("setTextStyle heals a legacy element and rejects an invalid align/overflow/fontSize", () => {
  const legacyElement = { id: "x", kind: "text", x: 0, y: 0, width: 10, height: 10, template: "{atk}" };
  setTextStyle(legacyElement, { bold: true, fontSize: 20 });
  assert.equal(legacyElement.textStyle.bold, true);
  assert.equal(legacyElement.textStyle.fontSize, 20);
  assert.throws(() => setTextStyle(legacyElement, { align: "diagonal" }));
  assert.throws(() => setTextStyle(legacyElement, { verticalAlign: "diagonal" }));
  assert.throws(() => setTextStyle(legacyElement, { overflow: "explode" }));
  assert.throws(() => setTextStyle(legacyElement, { fontSize: 0 }));
});

test("cloneCardType deep-copies each element's textStyle so duplicates stay independent", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "text", { x: 0, y: 0, width: 10, height: 10 });
  const duplicate = cloneCardType(cardType);

  setTextStyle(duplicate.elements[0], { bold: true });

  assert.equal(element.textStyle.bold, false);
  assert.equal(duplicate.elements[0].textStyle.bold, true);
});
