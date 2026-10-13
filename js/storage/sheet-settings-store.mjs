import { validateSheetSettings } from "../models/sheet-layout.mjs?v=19";

const STORAGE_KEY = "cardgame-prototyper.sheetSettings";

export function loadSheetSettings() {
  try {
    return validateSheetSettings(JSON.parse(localStorage.getItem(STORAGE_KEY)), navigator.language);
  } catch {
    return validateSheetSettings(null, navigator.language);
  }
}

export function saveSheetSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be blocked or full; the layout choice just isn't remembered.
  }
}
