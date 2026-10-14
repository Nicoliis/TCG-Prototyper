import { addProperty, removeProperty, setPropertyType, countInvalidValues, elementsUsingProperty } from "../../models/card-type.mjs?v=28";
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from "../../models/property-types.mjs?v=28";

export function setUpCardPropertiesPanel(section, cardType, persist, refreshAllPreviews) {
  const list = section.querySelector(".property-list:not(.property-list--builtin)");
  const itemTemplate = section.querySelector(".property-list-item-template");
  const optionTemplate = section.querySelector(".property-type-option-template");
  const form = section.querySelector(".add-property-form");
  const errorEl = section.querySelector(".property-error");

  function fillTypeSelect(select, selectedType) {
    for (const type of PROPERTY_TYPES) {
      const option = optionTemplate.content.firstElementChild.cloneNode(true);
      option.value = type;
      option.textContent = PROPERTY_TYPE_LABELS[type];
      select.appendChild(option);
    }
    select.value = selectedType;
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function confirmTypeChange(property, type) {
    const unfit = countInvalidValues(cardType, property, type);
    if (unfit === 0) return true;
    return confirm(
      `${unfit} existing card value(s) for "${property.name}" do not fit "${PROPERTY_TYPE_LABELS[type]}". ` +
        "They will be kept but flagged as invalid until corrected. Change the type?",
    );
  }

  function confirmDelete(property) {
    const used = elementsUsingProperty(cardType, property.name);
    if (used.length === 0) return true;
    const names = used.map((element) => element.name).join(", ");
    return confirm(`"${property.name}" is used by: ${names}. Those elements will render blank. Remove it?`);
  }

  function renderProperties() {
    list.replaceChildren();
    for (const property of cardType.properties) {
      const item = itemTemplate.content.cloneNode(true);
      item.querySelector(".property-name").textContent = property.name;

      const typeSelect = item.querySelector(".property-type-select");
      fillTypeSelect(typeSelect, property.type);
      typeSelect.addEventListener("change", async () => {
        if (!confirmTypeChange(property, typeSelect.value)) {
          typeSelect.value = property.type;
          return;
        }
        setPropertyType(cardType, property.id, typeSelect.value);
        await persist();
      });

      const sampleInput = item.querySelector(".property-sample-value-input");
      sampleInput.value = property.sampleValue;
      sampleInput.addEventListener("input", async () => {
        property.sampleValue = sampleInput.value;
        refreshAllPreviews();
        await persist();
      });

      item.querySelector(".property-delete-button").addEventListener("click", async () => {
        if (!confirmDelete(property)) return;
        removeProperty(cardType, property.id);
        renderProperties();
        refreshAllPreviews();
        await persist();
      });

      list.appendChild(item);
    }
  }

  fillTypeSelect(form.querySelector(".property-type-select"), "line");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");
    try {
      const data = new FormData(form);
      addProperty(cardType, data.get("propertyName"), "", data.get("propertyType"));
      form.reset();
      renderProperties();
      await persist();
    } catch (error) {
      showError(error.message);
    }
  });

  renderProperties();
}
