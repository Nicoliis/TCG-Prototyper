import test from "node:test";
import assert from "node:assert/strict";
import {
  createCardType,
  addProperty,
  addElement,
  cloneCardType,
  getElementStyle,
  setElementStyle,
  setElementPadding,
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

test("new elements default to 4px padding", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10 });
  assert.equal(getElementStyle(element).padding, 4);
});

test("getElementStyle defaults padding for an element saved before this feature", () => {
  const legacyElement = { id: "x", kind: "label", x: 0, y: 0, width: 10, height: 10, text: "Hi" };
  assert.equal(getElementStyle(legacyElement).padding, 4);
});

test("getElementStyle defaults padding even when a style object already exists without it", () => {
  const legacyStyledElement = {
    id: "x",
    kind: "label",
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    text: "Hi",
    style: { background: { enabled: true, color: "#ff0000" }, border: { enabled: false, color: "#000", thickness: 1 }, shadow: { enabled: false, color: "#000", thickness: 4 } },
  };
  assert.equal(getElementStyle(legacyStyledElement).padding, 4);
  assert.equal(getElementStyle(legacyStyledElement).background.enabled, true);
});

test("setElementPadding updates padding and rejects a negative value", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10 });
  setElementPadding(element, 12);
  assert.equal(getElementStyle(element).padding, 12);
  assert.throws(() => setElementPadding(element, -1));
});

test("setElementPadding heals a legacy element with no style field at all", () => {
  const legacyElement = { id: "x", kind: "label", x: 0, y: 0, width: 10, height: 10, text: "Hi" };
  setElementPadding(legacyElement, 8);
  assert.equal(legacyElement.style.padding, 8);
});

test("cloneCardType deep-copies each element's style so duplicates stay independent", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10 });
  const duplicate = cloneCardType(cardType);

  setElementStyle(duplicate.elements[0], "background", { enabled: true, color: "#00ff00" });

  assert.equal(element.style.background.enabled, false);
  assert.equal(duplicate.elements[0].style.background.enabled, true);
});

test("cloneCardType carries padding into the duplicate independently", () => {
  const cardType = createCardType("Monster", { width: 100, height: 140 }, []);
  const element = addElement(cardType, "label", { x: 0, y: 0, width: 10, height: 10 });
  const duplicate = cloneCardType(cardType);

  setElementPadding(duplicate.elements[0], 30);

  assert.equal(getElementStyle(element).padding, 4);
  assert.equal(getElementStyle(duplicate.elements[0]).padding, 30);
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

import { setPropertyType, countInvalidValues, elementsUsingProperty, validatePropertyName } from "../../js/models/card-type.mjs";
import { addCard as addTestCard, setCardValue as setTestCardValue, removeCard } from "../../js/models/card.mjs";

test("properties default to the one line type and accept a type", () => {
  const type = createCardType("T", { width: 10, height: 10 }, []);
  assert.equal(addProperty(type, "name").type, "line");
  assert.equal(addProperty(type, "atk", "", "integer").type, "integer");
  assert.throws(() => addProperty(type, "bad", "", "boolean"), /Property type/);
});

test("the name ID is reserved for the built-in property", () => {
  assert.throws(() => validatePropertyName("id", []), /already exists/);
});

test("setPropertyType keeps values and reports how many no longer fit", () => {
  const type = createCardType("T", { width: 10, height: 10 }, []);
  const atk = addProperty(type, "atk");
  setTestCardValue(addTestCard(type), atk.id, "abc");
  setTestCardValue(addTestCard(type), atk.id, "5");
  assert.equal(countInvalidValues(type, atk, "integer"), 1);
  assert.equal(setPropertyType(type, atk.id, "integer"), 1);
  assert.equal(atk.type, "integer");
  assert.equal(type.cards[0].values[atk.id], "abc");
});

test("elementsUsingProperty finds elements whose template mentions the property", () => {
  const type = createCardType("T", { width: 100, height: 100 }, []);
  addProperty(type, "name");
  const used = addElement(type, "text", { x: 0, y: 0, width: 10, height: 10, template: "Hi {name}" });
  addElement(type, "text", { x: 0, y: 0, width: 10, height: 10, template: "static" });
  assert.deepEqual(elementsUsingProperty(type, "name").map((e) => e.id), [used.id]);
});

test("cloneCardType preserves card numbers, property types and the counter", () => {
  const type = createCardType("T", { width: 10, height: 10 }, []);
  addProperty(type, "atk", "", "integer");
  addTestCard(type);
  const second = addTestCard(type);
  removeCard(type, type.cards[0].id);
  const copy = cloneCardType(type);
  assert.equal(copy.properties[0].type, "integer");
  assert.equal(copy.cards[0].number, second.number);
  assert.equal(copy.nextCardNumber, 3);
});
