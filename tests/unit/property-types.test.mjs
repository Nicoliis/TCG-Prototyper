import test from "node:test";
import assert from "node:assert/strict";
import { PROPERTY_TYPES, validatePropertyType, validateValue } from "../../js/models/property-types.mjs";

test("exactly the four property types exist", () => {
  assert.deepEqual(PROPERTY_TYPES, ["line", "text", "integer", "decimal"]);
});

test("validatePropertyType rejects unknown types", () => {
  assert.equal(validatePropertyType("integer"), "integer");
  assert.throws(() => validatePropertyType("boolean"), /Property type/);
});

test("empty values are valid for every type", () => {
  for (const type of PROPERTY_TYPES) assert.equal(validateValue(type, "").ok, true);
});

test("line and text accept any text", () => {
  assert.equal(validateValue("line", "abc 3.5").ok, true);
  assert.equal(validateValue("text", "a\nb").ok, true);
});

test("integer accepts whole numbers only", () => {
  for (const good of ["3", "-12", "0"]) assert.equal(validateValue("integer", good).ok, true);
  for (const bad of ["3.5", "abc", "1e3", "3 4"]) {
    const result = validateValue("integer", bad);
    assert.equal(result.ok, false);
    assert.ok(result.message);
  }
});

test("decimal accepts numbers with an optional fraction", () => {
  for (const good of ["2.75", "3", "-0.5", ".5", "2,75"]) assert.equal(validateValue("decimal", good).ok, true);
  for (const bad of ["abc", "1.2.3", "2.", "--1"]) assert.equal(validateValue("decimal", bad).ok, false);
});
