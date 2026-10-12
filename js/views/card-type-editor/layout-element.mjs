import { substitute } from "../../templating/substitute.mjs?v=1";

const MIN_SIZE = 10;
const BROKEN_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">' +
      '<rect width="40" height="40" fill="#eee"/><line x1="4" y1="4" x2="36" y2="36" stroke="#b3261e"/>' +
      '<line x1="36" y1="4" x2="4" y2="36" stroke="#b3261e"/></svg>',
  );

export function renderElement(canvas, element, templatesByKind, callbacks) {
  const template = templatesByKind.get(element.kind);
  const node = template.content.firstElementChild.cloneNode(true);
  node.dataset.elementId = element.id;
  applyTransform(node, element);

  const input = node.querySelector(".element-template-input, .element-text-input, .element-src-input");
  input.value = element.template ?? element.text ?? element.src ?? "";
  input.addEventListener("input", () => {
    if (element.kind === "text" || element.kind === "image") element.template = input.value;
    else if (element.kind === "label") element.text = input.value;
    else element.src = input.value;
    renderPreview(node, element, callbacks.getSampleValues());
    callbacks.onChange();
  });

  node.querySelector(".element-delete-button").addEventListener("click", () => {
    node.remove();
    callbacks.onDelete(element.id);
  });

  makeDraggable(node, element, callbacks.onChange);
  makeResizable(node, element, callbacks.onChange);
  makeRotatable(node, element, callbacks.onChange);

  renderPreview(node, element, callbacks.getSampleValues());
  canvas.appendChild(node);
  return node;
}

export function renderPreview(node, element, sampleValues) {
  const seeView = node.querySelector(".element-see-view");
  if (element.kind === "text") {
    seeView.textContent = substitute(element.template, sampleValues);
  } else if (element.kind === "label") {
    seeView.textContent = element.text;
  } else if (element.kind === "image") {
    setImageSrc(seeView, substitute(element.template, sampleValues));
  } else if (element.kind === "icon") {
    setImageSrc(seeView, element.src);
  }
}

function setImageSrc(img, url) {
  img.onerror = () => {
    img.onerror = null;
    img.src = BROKEN_IMAGE_PLACEHOLDER;
  };
  img.src = url || BROKEN_IMAGE_PLACEHOLDER;
}

function applyTransform(node, element) {
  node.style.left = `${element.x}px`;
  node.style.top = `${element.y}px`;
  node.style.width = `${element.width}px`;
  node.style.height = `${element.height}px`;
  node.style.transform = `rotate(${element.rotation ?? 0}deg)`;
}

function makeDraggable(node, element, onChange) {
  node.addEventListener("pointerdown", (event) => {
    if (event.target.closest("input, button, .resize-handle, .rotate-handle")) return;
    const startX = event.clientX - element.x;
    const startY = event.clientY - element.y;

    function onMove(moveEvent) {
      element.x = Math.max(0, moveEvent.clientX - startX);
      element.y = Math.max(0, moveEvent.clientY - startY);
      applyTransform(node, element);
    }
    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      onChange();
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });
}

function makeResizable(node, element, onChange) {
  const handle = node.querySelector(".resize-handle");
  handle.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    const startWidth = element.width;
    const startHeight = element.height;
    const startX = event.clientX;
    const startY = event.clientY;

    function onMove(moveEvent) {
      element.width = Math.max(MIN_SIZE, startWidth + (moveEvent.clientX - startX));
      element.height = Math.max(MIN_SIZE, startHeight + (moveEvent.clientY - startY));
      applyTransform(node, element);
    }
    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      onChange();
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });
}

function makeRotatable(node, element, onChange) {
  const handle = node.querySelector(".rotate-handle");
  handle.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    const canvas = node.offsetParent;

    function angleFor(pointerEvent) {
      const canvasRect = canvas.getBoundingClientRect();
      const centerX = canvasRect.left + element.x + element.width / 2;
      const centerY = canvasRect.top + element.y + element.height / 2;
      const dx = pointerEvent.clientX - centerX;
      const dy = pointerEvent.clientY - centerY;
      const degrees = Math.round((Math.atan2(dy, dx) * 180) / Math.PI) + 90;
      return ((degrees % 360) + 360) % 360;
    }

    function onMove(moveEvent) {
      element.rotation = angleFor(moveEvent);
      applyTransform(node, element);
    }
    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      onChange();
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });
}
