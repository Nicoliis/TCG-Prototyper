import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=26";
import { PAPER_SIZES, layoutSheets } from "../../models/sheet-layout.mjs?v=26";
import { renderPrintCard } from "./render-card.mjs?v=26";

const GUIDE_OUTSET_PX = 3;

let templatesPromise;

async function loadPrintTemplates() {
  const fragmentTemplate = await (templatesPromise ??= loadFragment("js/views/print/print-sheet.html?v=26"));
  const fragment = cloneTemplate(fragmentTemplate);
  return {
    page: fragment.querySelector(".print-page-template"),
    card: fragment.querySelector(".print-card-template"),
    guide: fragment.querySelector(".print-cut-guide-template"),
    elements: new Map(
      [...fragment.querySelectorAll(".print-element-template")].map((t) => [t.dataset.kind, t]),
    ),
  };
}

function createCutGuide(templates, placement) {
  const guide = templates.guide.content.firstElementChild.cloneNode(true);
  guide.style.left = `${placement.x - GUIDE_OUTSET_PX}px`;
  guide.style.top = `${placement.y - GUIDE_OUTSET_PX}px`;
  guide.style.width = `${placement.width + 2 * GUIDE_OUTSET_PX}px`;
  guide.style.height = `${placement.height + 2 * GUIDE_OUTSET_PX}px`;
  return guide;
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
      if (settings.cutGuides) page.appendChild(createCutGuide(templates, placement));
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
