import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=26";
import { validateValue } from "../../models/property-types.mjs?v=26";

let templatePromise;

export async function loadTypedInputTemplates() {
  const template = await (templatePromise ??= loadFragment("js/views/card-editor/typed-inputs.html?v=26"));
  return cloneTemplate(template).querySelector(".typed-input-templates");
}

function markValidity(input, result) {
  input.classList.toggle("invalid", !result.ok);
  input.setAttribute("aria-invalid", String(!result.ok));
  input.title = result.ok ? "" : result.message;
}

export function createTypedInput(templates, property, value, { eventName = "input", onValid, onInvalid } = {}) {
  const template = templates.querySelector(`.${property.type}-input-template`);
  const input = template.content.firstElementChild.cloneNode(true);
  input.value = value;
  input.setAttribute("aria-label", property.name);
  markValidity(input, validateValue(property.type, value));

  input.addEventListener(eventName, () => {
    const result = validateValue(property.type, input.value);
    markValidity(input, result);
    if (result.ok) onValid?.(input.value);
    else onInvalid?.(result.message);
  });
  return input;
}
