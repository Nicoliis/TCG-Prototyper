import { parseFormatted } from "../../templating/format-text.mjs?v=36";

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
// Each line break starts a new block so the "line gap" setting can space them.
export function renderFormatted(container, text) {
  const flow = document.createElement("span");
  flow.className = "formatted-flow";
  let line = newLine(flow);
  for (const segment of parseFormatted(text)) {
    const parts = segment.text.split("\n");
    parts.forEach((part, index) => {
      if (index > 0) line = newLine(flow);
      if (part) line.append(renderRun({ ...segment, text: part }));
    });
  }
  container.replaceChildren(flow);
}

function newLine(flow) {
  const line = document.createElement("span");
  line.className = "formatted-line";
  flow.append(line);
  return line;
}
