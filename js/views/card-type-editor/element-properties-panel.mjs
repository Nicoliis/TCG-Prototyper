import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=11";
import { setElementStyle, getElementStyle, setTextStyle, getTextStyle, getElementName } from "../../models/card-type.mjs?v=11";
import { substitute } from "../../templating/substitute.mjs?v=11";
import { setUpTabs, activeTab, selectTab, setUpSegmented, setSegmentedValue } from "./tabs.mjs?v=11";

const CONTENT_FIELD_BY_KIND = {
  text: { label: "Template", placeholder: "{property} template" },
  image: { label: "Image template", placeholder: "{property} image template" },
  label: { label: "Label text", placeholder: "Label text" },
  icon: { label: "Image URL", placeholder: "Icon image URL" },
};

const TEXT_KINDS = ["text", "label"];

let templatePromise;

export async function mountElementPropertiesPanel(container) {
  const template = await (templatePromise ??= loadFragment(
    "js/views/card-type-editor/element-properties-panel.html?v=11",
  ));
  const panel = cloneTemplate(template).firstElementChild;
  container.appendChild(panel);

  const emptyState = panel.querySelector(".element-properties-empty");
  const fields = panel.querySelector(".element-properties-fields");
  const contentLabel = panel.querySelector(".content-field-label");
  const previewValue = panel.querySelector(".content-preview-value");
  const textTabButton = panel.querySelector('.tab-button[data-tab="text"]');

  let currentElement = null;
  let currentCallbacks = null;

  fields.addEventListener("submit", (event) => event.preventDefault());

  setUpTabs(panel);

  function contentValue(element) {
    return element.template ?? element.text ?? element.src ?? "";
  }

  function applyContentValue(value) {
    if (currentElement.kind === "text" || currentElement.kind === "image") currentElement.template = value;
    else if (currentElement.kind === "label") currentElement.text = value;
    else currentElement.src = value;
  }

  function updatePreview() {
    const raw = contentValue(currentElement);
    const sampleValues = currentCallbacks.getSampleValues();
    const resolved =
      currentElement.kind === "text" || currentElement.kind === "image" ? substitute(raw, sampleValues) : raw;
    previewValue.textContent = resolved || "(empty)";
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

  function readTextStyleIntoFields() {
    const textStyle = getTextStyle(currentElement);
    fields.fontFamily.value = textStyle.fontFamily;
    fields.fontSize.value = textStyle.fontSize;
    fields.bold.checked = textStyle.bold;
    setSegmentedValue(panel, "align", textStyle.align);
    setSegmentedValue(panel, "verticalAlign", textStyle.verticalAlign);
    setSegmentedValue(panel, "overflow", textStyle.overflow);
  }

  function setElement(element, callbacks) {
    currentElement = element;
    currentCallbacks = callbacks;
    emptyState.hidden = true;
    fields.hidden = false;

    const isTextKind = TEXT_KINDS.includes(element.kind);
    textTabButton.hidden = !isTextKind;
    if (!isTextKind && activeTab(panel) === "text") selectTab(panel, "content");

    const { label, placeholder } = CONTENT_FIELD_BY_KIND[element.kind];
    contentLabel.textContent = label;
    fields.content.placeholder = placeholder;

    fields.name.value = getElementName(element);
    fields.content.value = contentValue(element);
    updatePreview();

    fields.x.value = element.x;
    fields.y.value = element.y;
    fields.width.value = element.width;
    fields.height.value = element.height;
    fields.rotation.value = element.rotation;

    readTextStyleIntoFields();
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
    currentCallbacks.onChange();
  }

  for (const name of ["x", "y", "width", "height", "rotation"]) {
    fields[name].addEventListener("input", onGeometryInput);
  }

  fields.content.addEventListener("input", () => {
    if (!currentElement) return;
    applyContentValue(fields.content.value);
    updatePreview();
    currentCallbacks.onChange();
  });

  fields.name.addEventListener("input", () => {
    if (!currentElement) return;
    currentElement.name = fields.name.value;
    currentCallbacks.onChange();
  });

  fields.fontFamily.addEventListener("input", () => {
    if (!currentElement) return;
    setTextStyle(currentElement, { fontFamily: fields.fontFamily.value });
    currentCallbacks.onChange();
  });

  fields.fontSize.addEventListener("input", () => {
    if (!currentElement) return;
    try {
      setTextStyle(currentElement, { fontSize: Number(fields.fontSize.value) });
      currentCallbacks.onChange();
    } catch {
      // Ignore an invalid interim value (e.g. field cleared mid-edit); last valid size stays applied.
    }
  });

  fields.bold.addEventListener("input", () => {
    if (!currentElement) return;
    setTextStyle(currentElement, { bold: fields.bold.checked });
    currentCallbacks.onChange();
  });

  setUpSegmented(panel, "align", (value) => {
    if (!currentElement) return;
    setTextStyle(currentElement, { align: value });
    currentCallbacks.onChange();
  });

  setUpSegmented(panel, "verticalAlign", (value) => {
    if (!currentElement) return;
    setTextStyle(currentElement, { verticalAlign: value });
    currentCallbacks.onChange();
  });

  setUpSegmented(panel, "overflow", (value) => {
    if (!currentElement) return;
    setTextStyle(currentElement, { overflow: value });
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
