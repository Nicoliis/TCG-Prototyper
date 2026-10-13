import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=21";
import {
  getDecks,
  addCardToDeck,
  setEntryCount,
  deckTotals,
  filterCards,
  findCard,
  describeCard,
} from "../../models/deck.mjs?v=21";
import { resolveSelection, selectionFromDeck } from "../../models/print-selection.mjs?v=21";
import { PAPER_SIZES, validateSheetSettings } from "../../models/sheet-layout.mjs?v=21";
import { loadSheetSettings, saveSheetSettings } from "../../storage/sheet-settings-store.mjs?v=21";
import { renderSheets } from "./render-sheets.mjs?v=21";

const IMAGE_WAIT_MS = 5000;

let templatePromise;

function waitForImages(container) {
  const pending = [...container.querySelectorAll("img")]
    .filter((img) => !img.complete)
    .map(
      (img) =>
        new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        }),
    );
  const timeout = new Promise((resolve) => setTimeout(resolve, IMAGE_WAIT_MS));
  return Promise.race([Promise.all(pending), timeout]);
}

export async function mountPrintScreen(root, storage, projectId, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/print/print-screen.html?v=21"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".print-screen-view");

  const heading = section.querySelector(".print-heading");
  const pageSizeStyle = section.querySelector(".page-size-style");
  const availableEmpty = section.querySelector(".available-cards-empty");
  const availableList = section.querySelector(".available-card-list");
  const selectionEmpty = section.querySelector(".selection-empty");
  const selectionList = section.querySelector(".selection-list");
  const totalsEl = section.querySelector(".print-totals");
  const errorEl = section.querySelector(".field-error");
  const printButton = section.querySelector(".print-button");
  const pagesEl = section.querySelector(".print-pages");
  const deckSelect = section.querySelector(".print-deck-select");
  const deckOptionTemplate = section.querySelector(".deck-option-template");
  const availableTemplate = section.querySelector(".available-card-template");
  const entryTemplate = section.querySelector(".selection-entry-template");
  const paperSelect = section.querySelector(".sheet-paper-select");
  const paperOptionTemplate = section.querySelector(".paper-option-template");
  const spacingInput = section.querySelector(".sheet-spacing-input");
  const cutGuidesInput = section.querySelector(".sheet-cut-guides");
  const scaledNotice = section.querySelector(".scaled-notice");

  section.querySelector(".back-button").addEventListener("click", onBack);

  const project = await storage.getProject(projectId);
  const selection = { entries: [] };
  const settings = loadSheetSettings();
  heading.textContent = `Print cards from ${project.name}`;

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function renderAvailable() {
    const cards = filterCards(project.cardTypes);
    availableList.replaceChildren();
    for (const { cardType, card } of cards) {
      const item = availableTemplate.content.cloneNode(true);
      item.querySelector(".available-card-summary").textContent = describeCard(cardType, card);
      item.querySelector(".available-card-add-button").addEventListener("click", () => {
        addCardToDeck(selection, card.id);
        showError("");
        refresh();
      });
      availableList.appendChild(item);
    }
    availableEmpty.hidden = cards.length > 0;
    availableEmpty.textContent = "This project has no cards yet. Fill some in from a card type's Cards table first.";
  }

  function renderSelection() {
    selectionList.replaceChildren();
    for (const entry of selection.entries) {
      const found = findCard(project, entry.cardId);
      if (!found) continue;
      const item = entryTemplate.content.cloneNode(true);
      item.querySelector(".deck-entry-summary").textContent = describeCard(found.cardType, found.card);
      const countInput = item.querySelector(".deck-entry-count");
      countInput.value = entry.count;
      countInput.addEventListener("change", () => {
        try {
          setEntryCount(selection, entry.cardId, countInput.value);
          showError("");
        } catch (error) {
          showError(error.message);
        }
        refresh();
      });
      item.querySelector(".deck-entry-remove-button").addEventListener("click", () => {
        setEntryCount(selection, entry.cardId, 0);
        refresh();
      });
      selectionList.appendChild(item);
    }
  }

  async function renderPreview() {
    const items = resolveSelection(project, selection);
    pageSizeStyle.textContent = `@page { size: ${PAPER_SIZES[settings.paper].pageSize}; margin: 0; }`;
    const layout = await renderSheets(pagesEl, items, settings);
    scaledNotice.hidden = layout.scaledCount === 0;
    const { totalCards } = deckTotals(selection);
    totalsEl.textContent = `${totalCards} cards on ${layout.pages.length} page${layout.pages.length === 1 ? "" : "s"}`;
    selectionEmpty.hidden = items.length > 0;
    printButton.disabled = items.length === 0;
  }

  async function refresh() {
    renderSelection();
    await renderPreview();
  }

  for (const [key, paper] of Object.entries(PAPER_SIZES)) {
    const option = paperOptionTemplate.content.cloneNode(true);
    const optionEl = option.querySelector("option");
    optionEl.value = key;
    optionEl.textContent = paper.label;
    paperSelect.appendChild(option);
  }

  function showSettings() {
    paperSelect.value = settings.paper;
    spacingInput.value = settings.spacingInches;
    cutGuidesInput.checked = settings.cutGuides;
  }

  function onSettingsChange() {
    const spacing = spacingInput.value.trim() === "" ? NaN : Number(spacingInput.value);
    Object.assign(
      settings,
      validateSheetSettings(
        { paper: paperSelect.value, spacingInches: spacing, cutGuides: cutGuidesInput.checked },
        navigator.language,
      ),
    );
    saveSheetSettings(settings);
    showSettings();
    refresh();
  }

  for (const control of [paperSelect, spacingInput, cutGuidesInput]) {
    control.addEventListener("change", onSettingsChange);
  }
  showSettings();

  for (const deck of getDecks(project)) {
    const option = deckOptionTemplate.content.cloneNode(true);
    const optionEl = option.querySelector("option");
    optionEl.value = deck.id;
    optionEl.textContent = deck.name;
    deckSelect.appendChild(option);
  }

  section.querySelector(".print-load-deck-button").addEventListener("click", () => {
    const deck = getDecks(project).find((d) => d.id === deckSelect.value);
    if (!deck) return;
    selection.entries = selectionFromDeck(deck).entries;
    showError(selection.entries.length ? "" : `The deck "${deck.name}" has no cards.`);
    refresh();
  });

  printButton.addEventListener("click", async () => {
    printButton.disabled = true;
    await waitForImages(pagesEl);
    printButton.disabled = false;
    window.print();
  });

  root.replaceChildren(view);
  renderAvailable();
  await refresh();
}
