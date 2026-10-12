import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=1";
import { addProperty, removeProperty, addElement, setCardTypeDimensions } from "../../models/card-type.mjs?v=1";
import { renderElement, renderPreview } from "./layout-element.mjs?v=1";

let templatePromise;

export async function mountCardTypeEditor(root, storage, projectId, cardTypeId, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/card-type-editor/card-type-editor.html?v=1"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".card-type-editor-view");

  const project = await storage.getProject(projectId);
  const cardType = project.cardTypes.find((ct) => ct.id === cardTypeId);

  section.querySelector(".card-type-name-heading").textContent = cardType.name;
  section.querySelector(".back-button").addEventListener("click", onBack);

  const canvas = section.querySelector(".canvas");
  canvas.style.width = `${cardType.width}px`;
  canvas.style.height = `${cardType.height}px`;

  const templatesByKind = new Map(
    [...section.querySelectorAll(".element-template")].map((t) => [t.dataset.kind, t]),
  );

  async function persist() {
    await storage.saveCardType(projectId, cardType);
  }

  function getSampleValues() {
    return Object.fromEntries(cardType.properties.map((p) => [p.name, p.sampleValue]));
  }

  function refreshAllPreviews() {
    const sampleValues = getSampleValues();
    for (const node of canvas.querySelectorAll(".layout-element")) {
      const element = cardType.elements.find((e) => e.id === node.dataset.elementId);
      if (element) renderPreview(node, element, sampleValues);
    }
  }

  function placeElement(elementData) {
    return renderElement(canvas, elementData, templatesByKind, {
      onChange: persist,
      onDelete: async (id) => {
        removeElementById(id);
        await persist();
      },
      getSampleValues,
    });
  }

  function removeElementById(id) {
    const index = cardType.elements.findIndex((e) => e.id === id);
    if (index !== -1) cardType.elements.splice(index, 1);
  }

  setUpDimensionsForm(section, cardType, canvas, persist);
  setUpPropertiesPanel(section, cardType, persist, refreshAllPreviews);
  setUpAddElementButtons(section, cardType, persist, placeElement);
  setUpModeToggle(section, canvas);

  for (const element of cardType.elements) placeElement(element);

  root.replaceChildren(view);
}

function setUpDimensionsForm(section, cardType, canvas, persist) {
  const form = section.querySelector(".dimensions-form");
  const errorEl = section.querySelector(".dimensions-error");
  form.width.value = cardType.width;
  form.height.value = cardType.height;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorEl.hidden = true;
    try {
      setCardTypeDimensions(cardType, { width: Number(form.width.value), height: Number(form.height.value) });
      canvas.style.width = `${cardType.width}px`;
      canvas.style.height = `${cardType.height}px`;
      await persist();
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.hidden = false;
    }
  });
}

function setUpPropertiesPanel(section, cardType, persist, refreshAllPreviews) {
  const list = section.querySelector(".property-list");
  const itemTemplate = section.querySelector(".property-list-item-template");
  const form = section.querySelector(".add-property-form");
  const errorEl = section.querySelector(".property-error");

  function renderProperties() {
    list.replaceChildren();
    for (const property of cardType.properties) {
      const item = itemTemplate.content.cloneNode(true);
      item.querySelector(".property-name").textContent = property.name;

      const sampleInput = item.querySelector(".property-sample-value-input");
      sampleInput.value = property.sampleValue;
      sampleInput.addEventListener("input", async () => {
        property.sampleValue = sampleInput.value;
        refreshAllPreviews();
        await persist();
      });

      item.querySelector(".property-delete-button").addEventListener("click", async () => {
        removeProperty(cardType, property.id);
        renderProperties();
        refreshAllPreviews();
        await persist();
      });

      list.appendChild(item);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorEl.hidden = true;
    try {
      addProperty(cardType, new FormData(form).get("propertyName"));
      form.reset();
      renderProperties();
      await persist();
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.hidden = false;
    }
  });

  renderProperties();
}

function setUpModeToggle(section, canvas) {
  const editButton = section.querySelector(".mode-edit-button");
  const seeButton = section.querySelector(".mode-see-button");

  function setMode(mode) {
    canvas.dataset.mode = mode;
    editButton.setAttribute("aria-pressed", String(mode === "edit"));
    seeButton.setAttribute("aria-pressed", String(mode === "see"));
  }

  editButton.addEventListener("click", () => setMode("edit"));
  seeButton.addEventListener("click", () => setMode("see"));
}

function setUpAddElementButtons(section, cardType, persist, placeElement) {
  for (const button of section.querySelectorAll(".add-element-button")) {
    button.addEventListener("click", async () => {
      const offset = 10 + (cardType.elements.length % 8) * 15;
      const element = addElement(cardType, button.dataset.kind, {
        x: offset,
        y: offset,
        width: 80,
        height: 40,
      });
      placeElement(element);
      await persist();
    });
  }
}
