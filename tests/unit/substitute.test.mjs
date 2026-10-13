import test from "node:test";
import assert from "node:assert/strict";
import { substitute } from "../../js/templating/substitute.mjs";

test("substitutes a single token", () => {
  assert.equal(substitute("{name}", { name: "Goblin" }), "Goblin");
});

test("substitutes multiple tokens in one template", () => {
  assert.equal(substitute("{atk}/{def}", { atk: 3, def: 5 }), "3/5");
});

test("renders an unknown token as blank instead of throwing", () => {
  assert.equal(substitute("{missing}", {}), "");
});

test("passes through text with no tokens unchanged", () => {
  assert.equal(substitute("Static Label", {}), "Static Label");
});
