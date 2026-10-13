import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=19";
import {
  getDecks,
  addCardToDeck,
  setEntryCount,
  deckTotals,
  filterCards,
  findCard,
  describeCard,
} from "../../models/deck.mjs?v=19";

let templatePromise;

export async function mountDeckEditor(root, storage, projectId, deckId, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/deck-editor/deck-editor.html?v=19"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".deck-editor-view");

  const heading = section.querySelector(".deck-name-heading");
  const totalCards = section.querySelector(".deck-total-cards");
  const distinctCards = section.querySelector(".deck-distinct-cards");
  const errorEl = section.querySelector(".field-error");
  const entriesEmpty = section.querySelector(".deck-entries-empty");
  const entryList = section.querySelector(".deck-entry-list");
  const availableEmpty = section.querySelector(".available-cards-empty");
  const availableList = section.querySelector(".available-card-list");
  const entryTemplate = section.querySelector(".deck-entry-template");
  const availableTemplate = section.querySelector(".available-card-template");
  const typeFilter = section.querySelector(".available-type-filter");
  const textFilter = section.querySelector(".available-text-filter");
  const optionTemplate = section.querySelector(".type-filter-option-template");

  section.querySelector(".back-button").addEventListener("click", onBack);

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  async function change(deck, apply) {
    try {
      apply(deck);
      await storage.saveDeck(projectId, deck);
      showError("");
    } catch (error) {
      showError(error.message);
    }
    await render();
  }

  async function render() {
    const project = await storage.getProject(projectId);
    const deck = getDecks(project).find((d) => d.id === deckId);
    heading.textContent = deck.name;

    const totals = deckTotals(deck);
    totalCards.textContent = totals.totalCards;
    distinctCards.textContent = totals.distinctCards;

    entryList.replaceChildren();
    for (const entry of deck.entries) {
      const found = findCard(project, entry.cardId);
      if (!found) continue;
      const item = entryTemplate.content.cloneNode(true);
      item.querySelector(".deck-entry-summary").textContent = describeCard(found.cardType, found.card);
      const countInput = item.querySelector(".deck-entry-count");
      countInput.value = entry.count;
      countInput.addEventListener("change", () =>
        change(deck, (d) => setEntryCount(d, entry.cardId, countInput.value)),
      );
      item.querySelector(".deck-entry-remove-button").addEventListener("click", () =>
        change(deck, (d) => setEntryCount(d, entry.cardId, 0)),
      );
      entryList.appendChild(item);
    }
    entriesEmpty.hidden = deck.entries.length > 0;

    if (typeFilter.options.length === 1) {
      for (const cardType of project.cardTypes) {
        const option = optionTemplate.content.cloneNode(true);
        const optionEl = option.querySelector("option");
        optionEl.value = cardType.id;
        optionEl.textContent = cardType.name;
        typeFilter.appendChild(option);
      }
    }

    const available = filterCards(project.cardTypes, {
      cardTypeId: typeFilter.value,
      text: textFilter.value,
    });
    availableList.replaceChildren();
    for (const { cardType, card } of available) {
      const item = availableTemplate.content.cloneNode(true);
      item.querySelector(".available-card-summary").textContent = describeCard(cardType, card);
      item.querySelector(".available-card-add-button").addEventListener("click", () =>
        change(deck, (d) => addCardToDeck(d, card.id)),
      );
      availableList.appendChild(item);
    }
    availableEmpty.hidden = available.length > 0;
    availableEmpty.textContent = filterCards(project.cardTypes).length
      ? "No cards match the current filters."
      : "This project has no cards yet. Fill some in from a card type's Cards table first.";
  }

  typeFilter.addEventListener("change", render);
  textFilter.addEventListener("input", render);

  root.replaceChildren(view);
  await render();
}
