import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=29";
import { mountCardTypeList } from "../card-type-list/card-type-list.mjs?v=29";
import { buildExportEnvelope, exportFileName, validateExportEnvelope } from "../../models/project-export.mjs?v=29";
import { downloadTextFile } from "./download-file.mjs?v=29";

let templatePromise;

export async function mountProjectList(root, storage) {
  const template = await (templatePromise ??= loadFragment("js/views/project-list/project-list.html?v=29"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".project-list-view");

  const form = section.querySelector(".create-project-form");
  const errorEl = section.querySelector(".field-error");
  const list = section.querySelector(".project-list");
  const itemTemplate = section.querySelector(".project-list-item-template");
  const importButton = section.querySelector(".import-project-button");
  const importInput = section.querySelector(".import-project-input");
  const importStatus = section.querySelector(".import-status");

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function showImportStatus(message) {
    importStatus.textContent = message;
    importStatus.hidden = !message;
  }

  function openProject(projectId) {
    mountCardTypeList(root, storage, projectId, () => mountProjectList(root, storage));
  }

  async function refresh() {
    showError("");
    const projects = await storage.listProjects();
    list.replaceChildren();
    for (const project of projects) {
      const item = itemTemplate.content.cloneNode(true);

      const openButton = item.querySelector(".project-open-button");
      openButton.textContent = project.name;
      openButton.addEventListener("click", () => openProject(project.id));

      item.querySelector(".project-rename-button").addEventListener("click", async () => {
        const name = prompt("Rename project", project.name);
        if (name === null) return;
        try {
          await storage.renameProject(project.id, name);
          await refresh();
        } catch (error) {
          showError(error.message);
        }
      });

      item.querySelector(".project-duplicate-button").addEventListener("click", async () => {
        await storage.duplicateProject(project.id);
        await refresh();
      });

      item.querySelector(".project-export-button").addEventListener("click", async () => {
        const fullProject = await storage.getProject(project.id);
        const envelope = buildExportEnvelope(fullProject);
        downloadTextFile(exportFileName(fullProject.name), JSON.stringify(envelope, null, 2));
      });

      item.querySelector(".project-delete-button").addEventListener("click", async () => {
        await storage.deleteProject(project.id);
        await refresh();
      });

      list.appendChild(item);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const name = new FormData(form).get("projectName");
      const project = await storage.createProject(name);
      form.reset();
      await refresh();
      openProject(project.id);
    } catch (error) {
      showError(error.message);
    }
  });

  importButton.addEventListener("click", () => importInput.click());

  importInput.addEventListener("change", async () => {
    showImportStatus("");
    const file = importInput.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("This file is not valid JSON.");
      }
      validateExportEnvelope(parsed);
      const created = await storage.importProject(parsed);
      await refresh();
      showImportStatus(`Imported "${created.name}".`);
    } catch (error) {
      showError(error.message);
    } finally {
      importInput.value = "";
    }
  });

  root.replaceChildren(view);
  await refresh();
}
