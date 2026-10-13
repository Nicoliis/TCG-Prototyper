import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=21";
import { mountCardTypeList } from "../card-type-list/card-type-list.mjs?v=21";

let templatePromise;

export async function mountProjectList(root, storage) {
  const template = await (templatePromise ??= loadFragment("js/views/project-list/project-list.html?v=21"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".project-list-view");

  const form = section.querySelector(".create-project-form");
  const errorEl = section.querySelector(".field-error");
  const list = section.querySelector(".project-list");
  const itemTemplate = section.querySelector(".project-list-item-template");

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
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

  root.replaceChildren(view);
  await refresh();
}
