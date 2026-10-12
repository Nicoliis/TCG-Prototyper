import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=1";
import { mountCardTypeEditor } from "../card-type-editor/card-type-editor.mjs?v=1";
import { createCardType } from "../../models/card-type.mjs?v=1";

let templatePromise;

export async function mountCardTypeList(root, storage, projectId, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/card-type-list/card-type-list.html?v=1"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".card-type-list-view");

  const heading = section.querySelector(".project-name-heading");
  const form = section.querySelector(".create-card-type-form");
  const errorEl = section.querySelector(".field-error");
  const list = section.querySelector(".card-type-list");
  const itemTemplate = section.querySelector(".card-type-list-item-template");

  section.querySelector(".back-button").addEventListener("click", onBack);

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function openCardType(cardTypeId) {
    mountCardTypeEditor(root, storage, projectId, cardTypeId, () =>
      mountCardTypeList(root, storage, projectId, onBack),
    );
  }

  async function refresh() {
    const project = await storage.getProject(projectId);
    heading.textContent = project.name;
    list.replaceChildren();
    for (const cardType of project.cardTypes) {
      const item = itemTemplate.content.cloneNode(true);
      const openButton = item.querySelector(".card-type-open-button");
      openButton.textContent = `${cardType.name} (${cardType.width}x${cardType.height})`;
      openButton.addEventListener("click", () => openCardType(cardType.id));
      list.appendChild(item);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");
    try {
      const data = new FormData(form);
      const project = await storage.getProject(projectId);
      const cardType = createCardType(
        data.get("cardTypeName"),
        { width: Number(data.get("width")), height: Number(data.get("height")) },
        project.cardTypes.map((ct) => ct.name),
      );
      await storage.saveCardType(projectId, cardType);
      form.reset();
      openCardType(cardType.id);
    } catch (error) {
      showError(error.message);
    }
  });

  root.replaceChildren(view);
  await refresh();
}
