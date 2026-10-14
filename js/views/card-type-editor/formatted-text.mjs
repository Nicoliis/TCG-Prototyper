import { parseFormatted } from "../../templating/format-text.mjs?v=29";

const STYLE_CLASSES = [
  ["bold", "fmt-bold"],
  ["italic", "fmt-italic"],
  ["underline", "fmt-underline"],
];

function renderRun(segment) {
  const classes = STYLE_CLASSES.filter(([style]) => segment[style]).map(([, name]) => name);
  if (classes.length === 0) return document.createTextNode(segment.text);
  const run = document.createElement("span");
  run.className = classes.join(" ");
  run.textContent = segment.text;
  return run;
}

// The container is a flex box (for alignment), so runs must live inside one
// wrapper or each would become a separate flex item and wrap on its own.
export function renderFormatted(container, text) {
  const flow = document.createElement("span");
  flow.className = "formatted-flow";
  flow.append(...parseFormatted(text).map(renderRun));
  container.replaceChildren(flow);
}
