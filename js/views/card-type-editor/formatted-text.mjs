import { parseFormatted } from "../../templating/format-text.mjs?v=28";

const STYLE_CLASSES = [
  ["bold", "fmt-bold"],
  ["italic", "fmt-italic"],
  ["underline", "fmt-underline"],
];

export function renderFormatted(container, text) {
  const runs = parseFormatted(text).map((segment) => {
    const classes = STYLE_CLASSES.filter(([style]) => segment[style]).map(([, name]) => name);
    if (classes.length === 0) return document.createTextNode(segment.text);
    const run = document.createElement("span");
    run.className = classes.join(" ");
    run.textContent = segment.text;
    return run;
  });
  container.replaceChildren(...runs);
}
