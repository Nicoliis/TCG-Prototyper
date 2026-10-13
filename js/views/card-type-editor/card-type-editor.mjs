import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=5";
import { addElement, setCardTypeDimensions } from "../../models/card-type.mjs?v=5";
import {
  renderElement,
  renderPreview,
  applyTransform,
  applyElementStyle,
  applyDepth,
  setElementSelected,
} from "./layout-element.mjs?v=5";
import { applyTextFit } from "./text-fit.mjs?v=5";
import { mountElementPropertiesPanel } from "./element-properties-panel.mjs?v=5";
import { mountLayerList } from "./layer-list.mjs?v=5";
import { setUpCardPropertiesPanel } from "./card-properties-panel.mjs?v=5";
import { setUpTabs } from "./tabs.mjs?v=5";

let templatePromise;

export async function mountCardTypeEditor(root, storage, projectId, cardTypeId, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/card-type-editor/card-type-editor.html?v=5"));
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

  const elementNodes = new Map();
  let selectedElementId = null;

  async function persist() {
    await storage.saveCardType(projectId, cardType);
  }

  function getSampleValues() {
    return Object.fromEntries(cardType.properties.map((p) => [p.name, p.sampleValue]));
  }

  function refreshCanvasPreviews() {
    const sampleValues = getSampleValues();
    for (const [id, node] of elementNodes) {
      const element = cardType.elements.find((e) => e.id === id);
      if (element) {
        renderPreview(node, element, sampleValues);
        applyTextFit(node, element);
      }
    }
  }

  function refreshAllPreviews() {
    refreshCanvasPreviews();
    if (selectedElementId) syncPanelIfSelected(selectedElementId);
  }

  function applyAllDepths() {
    cardType.elements.forEach((element, index) => {
      const node = elementNodes.get(element.id);
      if (node) applyDepth(node, index);
    });
  }

  const panel = await mountElementPropertiesPanel(section.querySelector(".element-properties-panel-mount"));
  const layerList = await mountLayerList(section.querySelector(".layer-list-mount"), {
    onSelect: select,
    onReorder: reorderElements,
  });

  function refreshLayerList() {
    layerList.render(cardType.elements, selectedElementId);
  }

  function panelCallbacksFor(element) {
    return {
      getSampleValues,
      getProperties: () => cardType.properties,
      onSampleValueChange: () => {
        refreshCanvasPreviews();
        persist();
      },
      onChange: () => {
        const node = elementNodes.get(element.id);
        applyTransform(node, element);
        renderPreview(node, element, getSampleValues());
        applyElementStyle(node, element);
        applyTextFit(node, element);
        refreshLayerList();
        persist();
      },
    };
  }

  function select(elementId) {
    selectedElementId = elementId;
    for (const [id, node] of elementNodes) setElementSelected(node, id === elementId);
    const element = cardType.elements.find((e) => e.id === elementId);
    panel.setElement(element, panelCallbacksFor(element));
    refreshLayerList();
  }

  function deselect() {
    selectedElementId = null;
    for (const node of elementNodes.values()) setElementSelected(node, false);
    panel.clear();
    refreshLayerList();
  }

  function syncPanelIfSelected(elementId) {
    if (selectedElementId !== elementId) return;
    const element = cardType.elements.find((e) => e.id === elementId);
    panel.setElement(element, panelCallbacksFor(element));
  }

  function reorderElements(newOrderedIds) {
    const byId = new Map(cardType.elements.map((e) => [e.id, e]));
    cardType.elements = newOrderedIds.map((id) => byId.get(id));
    applyAllDepths();
    refreshLayerList();
    persist();
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (event.target === canvas) deselect();
  });

  function placeElement(elementData) {
    const node = renderElement(canvas, elementData, templatesByKind, {
      onChange: async () => {
        await persist();
        syncPanelIfSelected(elementData.id);
      },
      onDelete: async (id) => {
        elementNodes.delete(id);
        removeElementById(id);
        if (selectedElementId === id) deselect();
        applyAllDepths();
        refreshLayerList();
        await persist();
      },
      onSelect: select,
      getSampleValues,
    });
    elementNodes.set(elementData.id, node);
    return node;
  }

  function removeElementById(id) {
    const index = cardType.elements.findIndex((e) => e.id === id);
    if (index !== -1) cardType.elements.splice(index, 1);
  }

  setUpTabs(section.querySelector(".data-properties-panel"));
  setUpDimensionsForm(section, cardType, canvas, persist);
  setUpCardPropertiesPanel(section, cardType, persist, refreshAllPreviews);
  setUpAddElementButtons(section, cardType, persist, (element) => {
    placeElement(element);
    applyAllDepths();
    refreshLayerList();
  });

  for (const element of cardType.elements) placeElement(element);
  applyAllDepths();
  refreshLayerList();

  root.replaceChildren(view);

  // Re-run text fitting now that the view is attached to the live document:
  // shrink/squash measure scrollWidth/clientWidth, which are 0 on detached nodes.
  for (const element of cardType.elements) {
    const node = elementNodes.get(element.id);
    if (node) applyTextFit(node, element);
  }
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
