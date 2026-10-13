import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv } from "../../js/csv/parse-csv.mjs";

test("parses simple rows", () => {
  assert.deepEqual(parseCsv("a,b\n1,2"), [["a", "b"], ["1", "2"]]);
});

test("handles quoted commas, escaped quotes and embedded newlines", () => {
  assert.deepEqual(parseCsv('a,b\n"x, y","say ""hi""\nbye"'), [["a", "b"], ["x, y", 'say "hi"\nbye']]);
});

test("accepts CRLF and ignores a trailing empty line", () => {
  assert.deepEqual(parseCsv("a,b\r\n1,2\r\n"), [["a", "b"], ["1", "2"]]);
});

test("strips a leading BOM", () => {
  assert.deepEqual(parseCsv("﻿a,b\n1,2")[0], ["a", "b"]);
});

test("empty input returns no rows", () => {
  assert.deepEqual(parseCsv(""), []);
});

test("keeps ragged rows and empty cells", () => {
  assert.deepEqual(parseCsv("a,b,c\n1,,3\n4"), [["a", "b", "c"], ["1", "", "3"], ["4"]]);
});
