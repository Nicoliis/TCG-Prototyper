import { getTextStyle } from "../../models/card-type.mjs?v=3";

const MIN_FONT_SIZE = 6;
const MAX_SHRINK_STEPS = 40;
const JUSTIFY_BY_ALIGN = { left: "flex-start", center: "center", right: "flex-end" };
const ORIGIN_BY_ALIGN = { left: "left center", center: "center center", right: "right center" };

export function applyTextFit(node, element) {
  if (element.kind !== "text" && element.kind !== "label") return;
  const content = node.querySelector(".element-content");
  const textStyle = getTextStyle(element);

  content.style.fontFamily = textStyle.fontFamily;
  content.style.fontWeight = textStyle.bold ? "bold" : "normal";
  content.style.textAlign = textStyle.align;
  content.style.justifyContent = JUSTIFY_BY_ALIGN[textStyle.align] ?? "flex-start";
  content.style.fontSize = `${textStyle.fontSize}px`;
  content.style.transform = "";

  if (textStyle.overflow === "wrap") {
    content.style.whiteSpace = "normal";
    content.style.overflowWrap = "break-word";
    return;
  }

  content.style.whiteSpace = "nowrap";
  content.style.overflowWrap = "normal";

  if (textStyle.overflow === "shrink") {
    shrinkToFit(content, textStyle.fontSize);
  } else if (textStyle.overflow === "squash") {
    squashToFit(content, textStyle.align);
  }
}

function shrinkToFit(content, startingSize) {
  let size = startingSize;
  for (let step = 0; step < MAX_SHRINK_STEPS && size > MIN_FONT_SIZE; step += 1) {
    const fits = content.scrollWidth <= content.clientWidth && content.scrollHeight <= content.clientHeight;
    if (fits) return;
    size -= 1;
    content.style.fontSize = `${size}px`;
  }
}

function squashToFit(content, align) {
  const naturalWidth = content.scrollWidth;
  const availableWidth = content.clientWidth;
  if (naturalWidth <= availableWidth || naturalWidth === 0) return;
  content.style.transformOrigin = ORIGIN_BY_ALIGN[align] ?? "left center";
  content.style.transform = `scaleX(${Math.max(0.1, availableWidth / naturalWidth)})`;
}
