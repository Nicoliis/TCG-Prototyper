import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=31";
import { mountBoardEditor } from "../board-editor/board-editor.mjs?v=31";
import { mountPlay } from "../play/play-screen.mjs?v=31";
import { getBoards, createBoard, cloneBoard } from "../../models/board.mjs?v=31";

let templatePromise;

export async function mountBoardList(root, storage, projectId, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/board-list/board-list.html?v=31"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".board-list-view");

  const heading = section.querySelector(".project-name-heading");
  const form = section.querySelector(".create-board-form");
  const errorEl = section.querySelector(".field-error");
  const list = section.querySelector(".board-list");
  const emptyEl = section.querySelector(".board-list-empty");
  const itemTemplate = section.querySelector(".board-list-item-template");

  section.querySelector(".back-button").addEventListener("click", onBack);

  const backToList = () => mountBoardList(root, storage, projectId, onBack);

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  async function refresh() {
    showError("");
    const project = await storage.getProject(projectId);
    heading.textContent = project.name;
    const boards = getBoards(project);
    emptyEl.hidden = boards.length > 0;
    list.replaceChildren();
    for (const board of boards) {
      const item = itemTemplate.content.cloneNode(true);
      const openButton = item.querySelector(".board-open-button");
      openButton.textContent = `${board.name} (${board.cols}x${board.rows}${board.sharedRows ? ` + ${board.sharedRows} shared` : ""})`;
      openButton.title = "Design this board";
      openButton.addEventListener("click", () => mountBoardEditor(root, storage, projectId, board.id, backToList));

      item.querySelector(".board-practice-button").addEventListener("click", () =>
        mountPlay(root, storage, { mode: "practice", projectId, boardId: board.id }, backToList),
      );
      item.querySelector(".board-host-button").addEventListener("click", () =>
        mountPlay(root, storage, { mode: "host", projectId, boardId: board.id }, backToList),
      );

      item.querySelector(".board-rename-button").addEventListener("click", async () => {
        const name = prompt("Rename board", board.name);
        if (name === null) return;
        try {
          await storage.saveBoard(projectId, { ...board, name });
          await refresh();
        } catch (error) {
          showError(error.message);
        }
      });

      item.querySelector(".board-duplicate-button").addEventListener("click", async () => {
        try {
          const names = boards.map((b) => b.name);
          let name = `${board.name} copy`;
          for (let n = 2; names.some((x) => x.toLowerCase() === name.toLowerCase()); n++) name = `${board.name} copy ${n}`;
          await storage.saveBoard(projectId, cloneBoard(board, name));
          await refresh();
        } catch (error) {
          showError(error.message);
        }
      });

      item.querySelector(".board-delete-button").addEventListener("click", async () => {
        if (!confirm(`Delete the board "${board.name}"?`)) return;
        await storage.deleteBoard(projectId, board.id);
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
      const board = createBoard(new FormData(form).get("boardName"), getBoards(project).map((b) => b.name));
      await storage.saveBoard(projectId, board);
      mountBoardEditor(root, storage, projectId, board.id, backToList);
    } catch (error) {
      showError(error.message);
    }
  });

  root.replaceChildren(view);
  await refresh();
}
