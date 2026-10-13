import { cardValuesByName } from "../../models/print-selection.mjs?v=25";
import {
  applyTransform,
  applyElementStyle,
  applyDepth,
  renderPreview,
} from "../card-type-editor/layout-element.mjs?v=25";
import { applyTextFit } from "../card-type-editor/text-fit.mjs?v=25";

export function renderPrintCard(cardType, card, templates, placement) {
  const frame = templates.card.content.firstElementChild.cloneNode(true);
  frame.style.width = `${placement.width}px`;
  frame.style.height = `${placement.height}px`;

  const content = frame.querySelector(".print-card-content");
  content.style.width = `${cardType.width}px`;
  content.style.height = `${cardType.height}px`;
  content.style.transform = `scale(${placement.scale})`;

  const values = cardValuesByName(cardType, card);
  const rendered = cardType.elements.map((element, index) => {
    const node = templates.elements.get(element.kind).content.firstElementChild.cloneNode(true);
    applyTransform(node, element);
    applyElementStyle(node, element);
    applyDepth(node, index);
    renderPreview(node, element, values);
    content.appendChild(node);
    return { node, element };
  });

  return {
    frame,
    fitText: () => rendered.forEach(({ node, element }) => applyTextFit(node, element)),
  };
}
