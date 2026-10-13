import { addProperty, removeProperty } from "../../models/card-type.mjs?v=23";

export function setUpCardPropertiesPanel(section, cardType, persist, refreshAllPreviews) {
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
