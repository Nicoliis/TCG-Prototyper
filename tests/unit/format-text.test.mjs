import test from "node:test";
import assert from "node:assert/strict";
import { parseFormatted } from "../../js/templating/format-text.mjs";

const plain = (text) => ({ text, bold: false, italic: false, underline: false });
const styled = (text, ...styles) => ({
  text,
  bold: styles.includes("bold"),
  italic: styles.includes("italic"),
  underline: styles.includes("underline"),
});

test("empty and missing text give no segments", () => {
  assert.deepEqual(parseFormatted(""), []);
  assert.deepEqual(parseFormatted(undefined), []);
});

test("text without markers is one plain segment, unchanged", () => {
  assert.deepEqual(parseFormatted("Just text, 5 + 3."), [plain("Just text, 5 + 3.")]);
});

test("bold, italic and underline", () => {
  assert.deepEqual(parseFormatted("Hello **world**"), [plain("Hello "), styled("world", "bold")]);
  assert.deepEqual(parseFormatted("*a* and __b__"), [
    styled("a", "italic"),
    plain(" and "),
    styled("b", "underline"),
  ]);
});

test("different marker types nest and combine", () => {
  assert.deepEqual(parseFormatted("***x***"), [styled("x", "bold", "italic")]);
  assert.deepEqual(parseFormatted("**__x__**"), [styled("x", "bold", "underline")]);
  assert.deepEqual(parseFormatted("**bold *both***"), [styled("bold ", "bold"), styled("both", "bold", "italic")]);
  assert.deepEqual(parseFormatted("*a **b** c*"), [
    styled("a ", "italic"),
    styled("b", "bold", "italic"),
    styled(" c", "italic"),
  ]);
});

test("markers work in the middle of a word", () => {
  assert.deepEqual(parseFormatted("un**believ**able"), [plain("un"), styled("believ", "bold"), plain("able")]);
});

test("a pair can span a line break", () => {
  assert.deepEqual(parseFormatted("**one\ntwo**"), [styled("one\ntwo", "bold")]);
});

test("unclosed markers stay literal", () => {
  assert.deepEqual(parseFormatted("**unfinished"), [plain("**unfinished")]);
  assert.deepEqual(parseFormatted("a *b"), [plain("a *b")]);
});

test("space-adjacent markers stay literal", () => {
  assert.deepEqual(parseFormatted("2 * 3 * 4"), [plain("2 * 3 * 4")]);
  assert.deepEqual(parseFormatted("** x **"), [plain("** x **")]);
});

test("empty emphasis stays literal", () => {
  assert.deepEqual(parseFormatted("****"), [plain("****")]);
  assert.deepEqual(parseFormatted("__ __"), [plain("__ __")]);
});

test("a backslash shows the marker character literally", () => {
  assert.deepEqual(parseFormatted("\\*literal\\*"), [plain("*literal*")]);
  assert.deepEqual(parseFormatted("\\__x\\__"), [plain("__x__")]);
  assert.deepEqual(parseFormatted("a\\b"), [plain("a\\b")]);
});

test("single underscores are ordinary text", () => {
  assert.deepEqual(parseFormatted("_x_ and snake_case"), [plain("_x_ and snake_case")]);
});

test("mismatched nesting leaves the inner opener literal", () => {
  assert.deepEqual(parseFormatted("**a *b** c"), [styled("a *b", "bold"), plain(" c")]);
});

test("HTML-like text is never interpreted", () => {
  assert.deepEqual(parseFormatted("<b>x</b> &amp; <script>"), [plain("<b>x</b> &amp; <script>")]);
  assert.deepEqual(parseFormatted("<b>**x**</b>"), [plain("<b>"), styled("x", "bold"), plain("</b>")]);
});

test("no character is lost apart from consumed markers and escape backslashes", () => {
  for (const input of ["a**b", "**a**b**", "*a**b*", "__a__ _b_", "\\", "***", "**__*x*__**"]) {
    const visible = parseFormatted(input).map((segment) => segment.text).join("");
    const stripped = input.replace(/[*_\\]/g, "");
    assert.equal(visible.replace(/[*_\\]/g, ""), stripped, input);
  }
});

test("parsing never throws on odd input", () => {
  for (const input of ["*", "**", "***", "****", "\\*", "_", "__", "___", "* *", "\n**\n"]) {
    assert.doesNotThrow(() => parseFormatted(input));
  }
});
