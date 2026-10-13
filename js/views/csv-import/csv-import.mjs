import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=20";
import { parseCsv } from "../../csv/parse-csv.mjs?v=20";
import { importCards } from "../../csv/import-cards.mjs?v=20";

let templatePromise;

function listOrNone(items) {
  return items.length ? items.join(", ") : "none";
}

export async function mountCsvImport(root, storage, projectId, cardTypeId, onBack, onOpenTable) {
  const template = await (templatePromise ??= loadFragment("js/views/csv-import/csv-import.html?v=20"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".csv-import-view");

  const heading = section.querySelector(".csv-import-heading");
  const form = section.querySelector(".csv-import-form");
  const fileInput = section.querySelector(".csv-file-input");
  const pasteInput = section.querySelector(".csv-paste-input");
  const keySelect = section.querySelector(".key-property-select");
  const optionTemplate = section.querySelector(".key-option-template");
  const errorEl = section.querySelector(".field-error");
  const reportEl = section.querySelector(".import-report");
  const emptyMessage = section.querySelector(".import-empty-message");
  const counts = section.querySelector(".import-counts");
  const ignoredColumns = section.querySelector(".import-ignored-columns");
  const unfilledProperties = section.querySelector(".import-unfilled-properties");

  section.querySelector(".back-button").addEventListener("click", onBack);
  section.querySelector(".open-card-table-button").addEventListener("click", onOpenTable);

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function showReport({ created, updated, ignoredColumns: ignored, unfilledProperties: unfilled }) {
    emptyMessage.hidden = created + updated > 0;
    counts.textContent = `${created} created, ${updated} updated.`;
    ignoredColumns.textContent = listOrNone(ignored);
    unfilledProperties.textContent = listOrNone(unfilled);
    reportEl.hidden = false;
  }

  async function readCsvText() {
    if (pasteInput.value.trim()) return pasteInput.value;
    const [file] = fileInput.files;
    if (!file) throw new Error("Choose a CSV file or paste CSV text.");
    return file.text();
  }

  const project = await storage.getProject(projectId);
  const cardType = project.cardTypes.find((ct) => ct.id === cardTypeId);
  heading.textContent = `Import CSV into ${cardType.name}`;
  for (const property of cardType.properties) {
    const option = optionTemplate.content.cloneNode(true);
    const optionEl = option.querySelector("option");
    optionEl.value = property.id;
    optionEl.textContent = property.name;
    keySelect.appendChild(option);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");
    reportEl.hidden = true;
    try {
      if (!keySelect.value) throw new Error("This card type has no properties to import into.");
      const rows = parseCsv(await readCsvText());
      const latest = (await storage.getProject(projectId)).cardTypes.find((ct) => ct.id === cardTypeId);
      const { cards, report } = importCards(latest, rows, keySelect.value);
      latest.cards = cards;
      await storage.saveCardType(projectId, latest);
      showReport(report);
    } catch (error) {
      showError(error.message);
    }
  });

  root.replaceChildren(view);
}
