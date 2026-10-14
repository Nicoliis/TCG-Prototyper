import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=27";
import { getCards, addCard, removeCard, getCardValue, setCardValue } from "../../models/card.mjs?v=27";
import { ID_PROPERTY } from "../../models/card-numbering.mjs?v=27";
import { loadTypedInputTemplates, createTypedInput } from "../card-editor/typed-input.mjs?v=27";

let templatePromise;

export async function mountCardTable(root, storage, projectId, cardTypeId, onBack, onEditCard) {
  const template = await (templatePromise ??= loadFragment("js/views/card-table/card-table.html?v=27"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".card-table-view");
  const inputTemplates = await loadTypedInputTemplates();

  const heading = section.querySelector(".card-type-name-heading");
  const emptyMessage = section.querySelector(".card-table-empty");
  const headerRow = section.querySelector(".card-table-header-row");
  const actionsHeader = section.querySelector(".card-table-actions-header");
  const body = section.querySelector(".card-table-body");
  const addButton = section.querySelector(".add-card-button");
  const headerTemplate = section.querySelector(".card-table-header-template");
  const rowTemplate = section.querySelector(".card-table-row-template");
  const idCellTemplate = section.querySelector(".card-table-id-cell-template");
  const cellTemplate = section.querySelector(".card-table-cell-template");

  section.querySelector(".back-button").addEventListener("click", onBack);

  let cardType;

  async function load() {
    const project = await storage.getProject(projectId);
    cardType = project.cardTypes.find((ct) => ct.id === cardTypeId);
  }

  async function save() {
    await storage.saveCardType(projectId, cardType);
  }

  function renderRow(card) {
    const row = rowTemplate.content.cloneNode(true);
    const actionsCell = row.querySelector(".card-table-actions");
    const idCell = idCellTemplate.content.cloneNode(true);
    idCell.querySelector(".card-table-id").textContent = card.number;
    actionsCell.before(idCell);
    for (const property of cardType.properties) {
      const cell = cellTemplate.content.cloneNode(true);
      const input = createTypedInput(inputTemplates, property, getCardValue(card, property.id), {
        eventName: "change",
        onValid: async (value) => {
          setCardValue(card, property.id, value);
          await save();
        },
      });
      cell.querySelector(".card-table-cell").appendChild(input);
      actionsCell.before(cell);
    }
    row.querySelector(".edit-card-button").addEventListener("click", () => onEditCard(card.number));
    row.querySelector(".delete-card-button").addEventListener("click", async () => {
      removeCard(cardType, card.id);
      await save();
      render();
    });
    return row;
  }

  function render() {
    heading.textContent = `${cardType.name} cards`;
    headerRow.querySelectorAll(".card-table-header").forEach((header) => header.remove());
    for (const name of [ID_PROPERTY.name, ...cardType.properties.map((p) => p.name)]) {
      const header = headerTemplate.content.cloneNode(true);
      header.querySelector(".card-table-header").textContent = name;
      actionsHeader.before(header);
    }

    const cards = getCards(cardType);
    body.replaceChildren(...cards.map(renderRow));

    const noProperties = cardType.properties.length === 0;
    addButton.disabled = noProperties;
    emptyMessage.hidden = !noProperties && cards.length > 0;
    emptyMessage.textContent = noProperties
      ? "This card type has no properties yet. Add some in the card type editor."
      : "No cards yet. Add one to get started.";
  }

  addButton.addEventListener("click", async () => {
    addCard(cardType);
    await save();
    render();
  });

  await load();
  root.replaceChildren(view);
  render();
}
