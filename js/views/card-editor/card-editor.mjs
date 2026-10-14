import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=28";
import { addCard, removeCard, getCards, getCardValue, setCardValue } from "../../models/card.mjs?v=28";
import { cardsInNumberOrder, findCardByNumber } from "../../models/card-numbering.mjs?v=28";
import { cardValuesByName } from "../../models/print-selection.mjs?v=28";
import {
  applyTransform,
  applyElementStyle,
  applyDepth,
  renderPreview,
} from "../card-type-editor/layout-element.mjs?v=28";
import { applyTextFit } from "../card-type-editor/text-fit.mjs?v=28";
import { adjacentCard, positionOf, resolveGoTo, cardToShowAfterDelete } from "./card-navigation.mjs?v=28";
import { loadTypedInputTemplates, createTypedInput } from "./typed-input.mjs?v=28";

let templatePromise;

export async function mountCardEditor(root, storage, projectId, cardTypeId, startNumber, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/card-editor/card-editor.html?v=28"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".card-editor-view");
  const inputTemplates = await loadTypedInputTemplates();

  const heading = section.querySelector(".card-type-name-heading");
  const prevButton = section.querySelector(".prev-card-button");
  const nextButton = section.querySelector(".next-card-button");
  const positionEl = section.querySelector(".card-position");
  const goToForm = section.querySelector(".go-to-form");
  const goToInput = section.querySelector(".go-to-id-input");
  const goToError = section.querySelector(".go-to-error");
  const deleteButton = section.querySelector(".delete-card-button");
  const emptyEl = section.querySelector(".card-editor-empty");
  const bodyEl = section.querySelector(".card-editor-body");
  const cardEl = section.querySelector(".card-editor-card");
  const idOutput = section.querySelector(".card-id-output");
  const fieldList = section.querySelector(".card-editor-field-list");
  const valueError = section.querySelector(".value-error");
  const fieldTemplate = section.querySelector(".card-editor-field-template");
  const elementTemplates = new Map(
    [...section.querySelectorAll(".card-editor-element-template")].map((t) => [t.dataset.kind, t]),
  );

  section.querySelector(".back-button").addEventListener("click", onBack);

  let cardType;
  let card = null;
  let renderedElements = [];

  async function save() {
    await storage.saveCardType(projectId, cardType);
  }

  function showMessage(element, message) {
    element.textContent = message;
    element.hidden = !message;
  }

  function buildCard() {
    cardEl.replaceChildren();
    cardEl.style.width = `${cardType.width}px`;
    cardEl.style.height = `${cardType.height}px`;
    renderedElements = cardType.elements.map((element, index) => {
      const node = elementTemplates.get(element.kind).content.firstElementChild.cloneNode(true);
      applyTransform(node, element);
      applyElementStyle(node, element);
      applyDepth(node, index);
      cardEl.appendChild(node);
      return { node, element };
    });
    refreshCard();
  }

  function refreshCard() {
    const values = cardValuesByName(cardType, card);
    for (const { node, element } of renderedElements) {
      renderPreview(node, element, values);
      applyTextFit(node, element);
    }
  }

  function buildFields() {
    fieldList.replaceChildren();
    for (const property of cardType.properties) {
      const field = fieldTemplate.content.cloneNode(true);
      field.querySelector(".card-editor-field-name").textContent = property.name;
      const input = createTypedInput(inputTemplates, property, getCardValue(card, property.id), {
        onValid: async (value) => {
          showMessage(valueError, "");
          setCardValue(card, property.id, value);
          refreshCard();
          await save();
        },
        onInvalid: (message) => showMessage(valueError, `${property.name}: ${message}`),
      });
      field.querySelector(".card-editor-field-input").appendChild(input);
      fieldList.appendChild(field);
    }
  }

  function showCard(next) {
    card = next;
    showMessage(goToError, "");
    showMessage(valueError, "");
    heading.textContent = `Edit ${cardType.name} cards`;
    const hasCard = card !== null;
    bodyEl.hidden = !hasCard;
    emptyEl.hidden = hasCard;
    deleteButton.disabled = !hasCard;
    goToInput.disabled = !hasCard;
    if (!hasCard) {
      positionEl.textContent = "";
      prevButton.disabled = true;
      nextButton.disabled = true;
      return;
    }
    const { index, total } = positionOf(cardType, card.number);
    positionEl.textContent = `Card ${index} of ${total}`;
    prevButton.disabled = adjacentCard(cardType, card.number, -1) === null;
    nextButton.disabled = adjacentCard(cardType, card.number, 1) === null;
    idOutput.textContent = card.number;
    goToInput.value = "";
    buildFields();
    buildCard();
  }

  async function addAndShowCard() {
    const added = addCard(cardType);
    await save();
    showCard(added);
  }

  prevButton.addEventListener("click", () => showCard(adjacentCard(cardType, card.number, -1)));
  nextButton.addEventListener("click", () => showCard(adjacentCard(cardType, card.number, 1)));
  section.querySelector(".add-card-button").addEventListener("click", addAndShowCard);
  section.querySelector(".add-first-card-button").addEventListener("click", addAndShowCard);

  deleteButton.addEventListener("click", async () => {
    const replacement = cardToShowAfterDelete(cardType, card.number);
    removeCard(cardType, card.id);
    await save();
    showCard(replacement);
  });

  goToForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = resolveGoTo(cardType, goToInput.value);
    if (result.error) showMessage(goToError, result.error);
    else showCard(result.card);
  });

  const project = await storage.getProject(projectId);
  cardType = project.cardTypes.find((ct) => ct.id === cardTypeId);
  root.replaceChildren(view);
  const first = findCardByNumber(cardType, startNumber) ?? cardsInNumberOrder(cardType)[0] ?? null;
  showCard(getCards(cardType).length ? first : null);
}
