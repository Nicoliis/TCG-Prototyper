import test from "node:test";
import assert from "node:assert/strict";
import { createCardType, addProperty, addElement } from "../../js/models/card-type.mjs";

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
