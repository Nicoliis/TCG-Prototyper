export const PROPERTY_TYPES = ["line", "text", "integer", "decimal"];
export const DEFAULT_PROPERTY_TYPE = "line";

export const PROPERTY_TYPE_LABELS = {
  line: "One line",
  text: "Textarea",
  integer: "Integer",
  decimal: "Decimal",
};

const INTEGER_PATTERN = /^-?\d+$/;
const DECIMAL_PATTERN = /^-?(\d+([.,]\d+)?|[.,]\d+)$/;

export function validatePropertyType(type) {
  if (!PROPERTY_TYPES.includes(type)) {
    throw new Error(`Property type must be one of: ${PROPERTY_TYPES.join(", ")}.`);
  }
  return type;
}

export function validateValue(type, text) {
  const value = String(text ?? "").trim();
  if (value === "") return { ok: true };
  if (type === "integer" && !INTEGER_PATTERN.test(value)) {
    return { ok: false, message: "Enter a whole number, for example 3." };
  }
  if (type === "decimal" && !DECIMAL_PATTERN.test(value)) {
    return { ok: false, message: "Enter a number, for example 2.75." };
  }
  return { ok: true };
}
