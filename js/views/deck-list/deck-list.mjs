import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=16";
import { mountDeckEditor } from "../deck-editor/deck-editor.mjs?v=16";
import { getDecks, createDeck } from "../../models/deck.mjs?v=16";

let templatePromise;

export async function mountDeckList(root, storage, projectId, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/deck-list/deck-list.html?v=16"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".deck-list-view");

  const heading = section.querySelector(".project-name-heading");
  const form = section.querySelector(".create-deck-form");
  const errorEl = section.querySelector(".field-error");
  const list = section.querySelector(".deck-list");
  const itemTemplate = section.querySelector(".deck-list-item-template");

  section.querySelector(".back-button").addEventListener("click", onBack);

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  async function refresh() {
    showError("");
    const project = await storage.getProject(projectId);
    heading.textContent = project.name;
    list.replaceChildren();
    for (const deck of getDecks(project)) {
      const item = itemTemplate.content.cloneNode(true);
      const openButton = item.querySelector(".deck-open-button");
      openButton.textContent = deck.name;
      openButton.addEventListener("click", () =>
        mountDeckEditor(root, storage, projectId, deck.id, () => mountDeckList(root, storage, projectId, onBack)),
      );

      item.querySelector(".deck-rename-button").addEventListener("click", async () => {
        const name = prompt("Rename deck", deck.name);
        if (name === null) return;
        try {
          await storage.saveDeck(projectId, { ...deck, name });
          await refresh();
        } catch (error) {
          showError(error.message);
        }
      });

      item.querySelector(".deck-delete-button").addEventListener("click", async () => {
        await storage.deleteDeck(projectId, deck.id);
        await refresh();
      });

      list.appendChild(item);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");
    try {
      const project = await storage.getProject(projectId);
      const deck = createDeck(
        new FormData(form).get("deckName"),
        getDecks(project).map((d) => d.name),
      );
      await storage.saveDeck(projectId, deck);
      form.reset();
      await refresh();
    } catch (error) {
      showError(error.message);
    }
  });

  root.replaceChildren(view);
  await refresh();
}
