// Draws cards on a board, reusing the print renderer so a card on the table looks exactly like the card as designed.
// A drawn face is rendered once (off screen, so its text can be fitted) and then cloned for every later use.
import { loadPrintTemplates } from "../print/render-sheets.mjs?v=35";
import { renderPrintCard } from "../print/render-card.mjs?v=35";
import { h } from "../dom.mjs?v=35";

let templatesPromise;
let stage;
const faceCache = new Map(); // "cardId|width|height" -> detached, already fitted element

export function loadCardTemplates() {
  return (templatesPromise ??= loadPrintTemplates());
}

function offscreenStage() {
  if (!stage) {
    stage = h("div", { class: "card-stage", "aria-hidden": "true" });
    document.body.append(stage);
  }
  return stage;
}

function renderFace(templates, cardType, card, width, height) {
  const scale = Math.min(width / cardType.width, height / cardType.height);
  const placement = { width: cardType.width * scale, height: cardType.height * scale, scale };
  const { frame, fitText } = renderPrintCard(cardType, card, templates, placement);
  frame.style.left = `${(width - placement.width) / 2}px`;
  frame.style.top = `${(height - placement.height) / 2}px`;
  const holder = h("div", { class: "card-face-art", style: { width: `${width}px`, height: `${height}px` } }, frame);
  offscreenStage().append(holder);
  fitText();
  holder.remove();
  return holder;
}

// The face of a card, sized width x height px. `found` is { cardType, card } (null draws a blank card).
export function cardFaceElement(templates, found, width, height) {
  if (!found) return h("div", { class: "card-face-art card-face-missing", style: { width: `${width}px`, height: `${height}px` } }, "?");
  const key = `${found.card.id}|${Math.round(width)}|${Math.round(height)}`;
  if (!faceCache.has(key)) faceCache.set(key, renderFace(templates, found.cardType, found.card, width, height));
  return faceCache.get(key).cloneNode(true);
}

// The size a card has when it must fit inside a box, keeping its own shape.
export function fitSize(found, boxWidth, boxHeight) {
  if (!found) return { width: boxWidth, height: boxHeight };
  const scale = Math.min(boxWidth / found.cardType.width, boxHeight / found.cardType.height);
  return { width: Math.round(found.cardType.width * scale), height: Math.round(found.cardType.height * scale) };
}

export function cardBackElement(width, height) {
  return h("div", { class: "card-back-art", style: { width: `${width}px`, height: `${height}px` } });
}

export function clearFaceCache() {
  faceCache.clear();
}
