import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=1";
import { setElementStyle, getElementStyle, getElementDepth } from "../../models/card-type.mjs?v=1";

const CONTENT_FIELD_BY_KIND = {
  text: { label: "Template", placeholder: "{property} template" },
  image: { label: "Image template", placeholder: "{property} image template" },
  label: { label: "Label text", placeholder: "Label text" },
  icon: { label: "Image URL", placeholder: "Icon image URL" },
};

let templatePromise;

export async function mountElementPropertiesPanel(container) {
  const template = await (templatePromise ??= loadFragment(
    "js/views/card-type-editor/element-properties-panel.html?v=1",
  ));
  const panel = cloneTemplate(template).firstElementChild;
  container.appendChild(panel);

  const emptyState = panel.querySelector(".element-properties-empty");
  const fields = panel.querySelector(".element-properties-fields");
  const contentLabel = panel.querySelector(".content-field-label");

  let currentElement = null;
  let currentCallbacks = null;

  fields.addEventListener("submit", (event) => event.preventDefault());

  function contentValue(element) {
    return element.template ?? element.text ?? element.src ?? "";
  }

  function applyContentValue(value) {
    if (currentElement.kind === "text" || currentElement.kind === "image") currentElement.template = value;
    else if (currentElement.kind === "label") currentElement.text = value;
    else currentElement.src = value;
  }

  function updateStyleGroupVisibility() {
    panel.querySelector('[data-style="background"]').dataset.enabled = fields.backgroundEnabled.checked;
    panel.querySelector('[data-style="border"]').dataset.enabled = fields.borderEnabled.checked;
    panel.querySelector('[data-style="shadow"]').dataset.enabled = fields.shadowEnabled.checked;
  }

  function readStyleIntoFields() {
    const style = getElementStyle(currentElement);
    fields.backgroundEnabled.checked = style.background.enabled;
    fields.backgroundColor.value = style.background.color;
    fields.borderEnabled.checked = style.border.enabled;
    fields.borderColor.value = style.border.color;
    fields.borderThickness.value = style.border.thickness;
    fields.shadowEnabled.checked = style.shadow.enabled;
    fields.shadowColor.value = style.shadow.color;
    fields.shadowThickness.value = style.shadow.thickness;
    updateStyleGroupVisibility();
  }

  function setElement(element, callbacks) {
    currentElement = element;
    currentCallbacks = callbacks;
    emptyState.hidden = true;
    fields.hidden = false;

    const { label, placeholder } = CONTENT_FIELD_BY_KIND[element.kind];
    contentLabel.textContent = label;
    fields.content.placeholder = placeholder;

    fields.x.value = element.x;
    fields.y.value = element.y;
    fields.width.value = element.width;
    fields.height.value = element.height;
    fields.rotation.value = element.rotation;
    fields.depth.value = getElementDepth(element);
    fields.content.value = contentValue(element);

    readStyleIntoFields();
  }

  function clear() {
    currentElement = null;
    currentCallbacks = null;
    emptyState.hidden = false;
    fields.hidden = true;
  }

  function onGeometryInput() {
    if (!currentElement) return;
    currentElement.x = Math.max(0, Number(fields.x.value) || 0);
    currentElement.y = Math.max(0, Number(fields.y.value) || 0);
    currentElement.width = Math.max(1, Number(fields.width.value) || 1);
    currentElement.height = Math.max(1, Number(fields.height.value) || 1);
    currentElement.rotation = Number(fields.rotation.value) || 0;
    currentElement.depth = Math.round(Number(fields.depth.value) || 0);
    currentCallbacks.onChange();
  }

  for (const name of ["x", "y", "width", "height", "rotation", "depth"]) {
    fields[name].addEventListener("input", onGeometryInput);
  }

  fields.content.addEventListener("input", () => {
    if (!currentElement) return;
    applyContentValue(fields.content.value);
    currentCallbacks.onChange();
  });

  function bindStyleGroup(styleKey, inputNames) {
    const { enabled, color, thickness } = inputNames;

    fields[enabled].addEventListener("input", () => {
      if (!currentElement) return;
      setElementStyle(currentElement, styleKey, { enabled: fields[enabled].checked });
      updateStyleGroupVisibility();
      currentCallbacks.onChange();
    });

    fields[color].addEventListener("input", () => {
      if (!currentElement) return;
      setElementStyle(currentElement, styleKey, { color: fields[color].value });
      currentCallbacks.onChange();
    });

    if (!thickness) return;
    fields[thickness].addEventListener("input", () => {
      if (!currentElement) return;
      try {
        setElementStyle(currentElement, styleKey, { thickness: Number(fields[thickness].value) });
        currentCallbacks.onChange();
      } catch {
        // Ignore an invalid interim value (e.g. field cleared mid-edit); last valid thickness stays applied.
      }
    });
  }

  bindStyleGroup("background", { enabled: "backgroundEnabled", color: "backgroundColor" });
  bindStyleGroup("border", { enabled: "borderEnabled", color: "borderColor", thickness: "borderThickness" });
  bindStyleGroup("shadow", { enabled: "shadowEnabled", color: "shadowColor", thickness: "shadowThickness" });

  return { setElement, clear };
}
