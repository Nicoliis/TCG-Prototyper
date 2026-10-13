import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=17";
import { PAPER_SIZES, layoutSheets } from "../../models/sheet-layout.mjs?v=17";
import { renderPrintCard } from "./render-card.mjs?v=17";

let templatesPromise;

async function loadPrintTemplates() {
  const fragmentTemplate = await (templatesPromise ??= loadFragment("js/views/print/print-sheet.html?v=17"));
  const fragment = cloneTemplate(fragmentTemplate);
  return {
    page: fragment.querySelector(".print-page-template"),
    card: fragment.querySelector(".print-card-template"),
    elements: new Map(
      [...fragment.querySelectorAll(".print-element-template")].map((t) => [t.dataset.kind, t]),
    ),
  };
}

export async function renderSheets(container, items, settings) {
  const templates = await loadPrintTemplates();
  const paper = PAPER_SIZES[settings.paper];
  const layout = layoutSheets(items, settings);
  const cardsById = new Map(items.map((item) => [item.card.id, item]));
  const pendingFits = [];

  container.replaceChildren();
  for (const { placements } of layout.pages) {
    const page = templates.page.content.firstElementChild.cloneNode(true);
    page.style.width = `${paper.widthPx}px`;
    page.style.height = `${paper.heightPx}px`;
    for (const placement of placements) {
      const { cardType, card } = cardsById.get(placement.cardId);
      const { frame, fitText } = renderPrintCard(cardType, card, templates, placement);
      frame.style.left = `${placement.x}px`;
      frame.style.top = `${placement.y}px`;
      page.appendChild(frame);
      pendingFits.push(fitText);
    }
    container.appendChild(page);
  }
  pendingFits.forEach((fitText) => fitText());
  return layout;
}
