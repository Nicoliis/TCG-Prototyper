import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=9";
import { getElementName } from "../../models/card-type.mjs?v=9";

const KIND_ICON = { text: "T", image: "🖼", label: "🏷", icon: "★" };

let templatePromise;

export async function mountLayerList(container, callbacks) {
  const template = await (templatePromise ??= loadFragment("js/views/card-type-editor/layer-list.html?v=9"));
  const section = cloneTemplate(template).firstElementChild;
  container.appendChild(section);

  const emptyState = section.querySelector(".layer-list-empty");
  const list = section.querySelector(".layer-list");
  const itemTemplate = section.querySelector(".layer-list-item-template");

  let draggedId = null;

  function render(elements, selectedElementId) {
    emptyState.hidden = elements.length > 0;
    list.replaceChildren();

    // Front-of-stack first, like a conventional layers panel; the underlying
    // array is stored back-to-front (later entries render on top).
    const displayOrder = [...elements].reverse();

    for (const element of displayOrder) {
      const item = itemTemplate.content.cloneNode(true);
      const row = item.querySelector(".layer-list-item");
      row.classList.toggle("selected", element.id === selectedElementId);
      row.querySelector(".layer-kind-icon").textContent = KIND_ICON[element.kind] ?? "?";
      row.querySelector(".layer-label").textContent = getElementName(element);

      row.addEventListener("click", () => callbacks.onSelect(element.id));

      row.addEventListener("dragstart", () => {
        draggedId = element.id;
        row.classList.add("dragging");
      });
      row.addEventListener("dragend", () => {
        draggedId = null;
        row.classList.remove("dragging");
      });
      row.addEventListener("dragover", (event) => event.preventDefault());
      row.addEventListener("drop", (event) => {
        event.preventDefault();
        if (!draggedId || draggedId === element.id) return;

        const rect = row.getBoundingClientRect();
        const dropBefore = event.clientY < rect.top + rect.height / 2;
        const remainingIds = displayOrder.map((e) => e.id).filter((id) => id !== draggedId);
        const targetIndex = remainingIds.indexOf(element.id);
        remainingIds.splice(dropBefore ? targetIndex : targetIndex + 1, 0, draggedId);

        callbacks.onReorder(remainingIds.reverse());
      });

      list.appendChild(row);
    }
  }

  return { render };
}
