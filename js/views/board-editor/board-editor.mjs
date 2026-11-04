import { loadFragment, cloneTemplate } from "../load-fragment.mjs?v=34";
import { h } from "../dom.mjs?v=34";
import {
  getBoards,
  addZone,
  removeZone,
  resizeBoard,
  setBoardSettings,
  validateBoard,
  validateCounters,
  zoneFits,
  zoneCollides,
  areaSize,
  ZONE_AREAS,
  ZONE_LAYOUTS,
  ZONE_FACES,
  ZONE_ORIENTATIONS,
  ZONE_VISIBILITIES,
  LAYOUT_LABELS,
  FACE_LABELS,
  ORIENTATION_LABELS,
  VISIBILITY_LABELS,
} from "../../models/board.mjs?v=34";

const CELL_PX = 62; // width of one cell in the designer
const GAP_PX = 4;
const AREA_GAP_PX = 14;
const ROLE_NOTES = {
  deck: "The deck is required. Players draw from it and it is where their chosen deck is shuffled at the start.",
  hand: "The hand is required. Cards drawn go here.",
  discard: "The discard pile is required. Cards that leave play go here, and cards of the other player return to their owner's discard.",
};

let templatePromise;

function fillSelect(select, values, labels = {}) {
  select.replaceChildren(...values.map((value) => h("option", { value }, labels[value] ?? value)));
}

export async function mountBoardEditor(root, storage, projectId, boardId, onBack) {
  const template = await (templatePromise ??= loadFragment("js/views/board-editor/board-editor.html?v=34"));
  const view = cloneTemplate(template);
  const section = view.querySelector(".board-editor-view");

  const project = await storage.getProject(projectId);
  const board = structuredClone(getBoards(project).find((b) => b.id === boardId));
  if (!board) {
    onBack();
    return;
  }

  const heading = section.querySelector(".board-heading");
  const errorEl = section.querySelector(".field-error");
  const dirtyEl = section.querySelector(".board-dirty");
  const canvas = section.querySelector(".board-editor-canvas");
  const zoneForm = section.querySelector(".zone-form");
  const zoneEmpty = section.querySelector(".zone-panel-empty");
  const roleNote = section.querySelector(".zone-role-note");
  const deleteButton = section.querySelector(".zone-delete-button");
  const settingsForm = section.querySelector(".board-settings-form");
  const counterList = section.querySelector(".counter-list");
  const nameInput = h("input", { type: "text", class: "board-name-input", value: board.name, "aria-label": "Board name" });

  let selectedId = null;
  let dirty = false;

  fillSelect(zoneForm.area, ZONE_AREAS, { player: "Each player (mirrored)", shared: "Shared (middle of the table)" });
  fillSelect(zoneForm.layout, ZONE_LAYOUTS, LAYOUT_LABELS);
  fillSelect(zoneForm.orientation, ZONE_ORIENTATIONS, ORIENTATION_LABELS);
  fillSelect(zoneForm.face, ZONE_FACES, FACE_LABELS);
  fillSelect(zoneForm.visibility, ZONE_VISIBILITIES, VISIBILITY_LABELS);

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  function markDirty() {
    dirty = true;
    dirtyEl.hidden = false;
  }

  const selected = () => board.zones.find((z) => z.id === selectedId) ?? null;

  /* ---- the canvas ---- */

  const step = () => ({ x: CELL_PX + GAP_PX, y: Math.round((CELL_PX * board.cellHeight) / board.cellWidth) + GAP_PX });

  function areaBox(area, top) {
    const { cols, rows } = areaSize(board, area);
    const s = step();
    return { width: cols * s.x - GAP_PX, height: rows * s.y - GAP_PX, top, rows };
  }

  function zoneBox(zone, offsets, mirrored) {
    const s = step();
    const { cols, rows } = areaSize(board, zone.area);
    const col = mirrored ? cols - zone.col - zone.w : zone.col;
    const row = mirrored ? rows - zone.row - zone.h : zone.row;
    return {
      left: col * s.x,
      top: offsets[zone.area === "shared" ? "shared" : mirrored ? "opponent" : "player"] + row * s.y,
      width: zone.w * s.x - GAP_PX,
      height: zone.h * s.y - GAP_PX,
    };
  }

  function renderCanvas() {
    const s = step();
    const offsets = { opponent: 0 };
    offsets.shared = board.rows * s.y - GAP_PX + AREA_GAP_PX;
    offsets.player = offsets.shared + (board.sharedRows ? board.sharedRows * s.y - GAP_PX + AREA_GAP_PX : 0);
    const totalWidth = board.cols * s.x - GAP_PX;
    const totalHeight = offsets.player + board.rows * s.y - GAP_PX;
    canvas.style.width = `${totalWidth}px`;
    canvas.style.height = `${totalHeight}px`;
    canvas.replaceChildren();

    const addArea = (className, label, top, rows) => {
      canvas.append(h("div", { class: `be-area ${className}`, style: { top: `${top}px`, height: `${rows * s.y - GAP_PX}px`, width: `${totalWidth}px` } }));
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < board.cols; col++) {
          canvas.append(
            h("div", {
              class: `be-cell ${className}`,
              style: { left: `${col * s.x}px`, top: `${top + row * s.y}px`, width: `${CELL_PX}px`, height: `${s.y - GAP_PX}px` },
            }),
          );
        }
      }
      canvas.append(h("div", { class: `be-area-label ${className}`, style: { top: `${top + 2}px` } }, label));
    };
    addArea("opponent", "Opponent (mirrored preview)", offsets.opponent, board.rows);
    if (board.sharedRows) addArea("shared", "Shared", offsets.shared, board.sharedRows);
    addArea("player", "Each player", offsets.player, board.rows);

    for (const zone of board.zones) {
      if (zone.area === "shared") continue;
      const box = zoneBox(zone, offsets, true);
      canvas.append(
        h("div", { class: `be-zone ghost ${zone.role ?? ""}`, style: boxStyle(box) }, h("span", { class: "be-zone-name" }, zone.name)),
      );
    }

    for (const zone of board.zones) {
      const box = zoneBox(zone, offsets, false);
      const node = h(
        "div",
        {
          class: `be-zone ${zone.role ?? ""} vis-${zone.visibility}${zone.id === selectedId ? " selected" : ""}`,
          style: boxStyle(box),
          dataset: { zoneId: zone.id },
          title: `${zone.name} - ${zone.layout}, ${zone.visibility}`,
        },
        h("span", { class: "be-zone-name" }, zone.name),
        h("span", { class: "be-zone-meta" }, `${zone.w}x${zone.h} ${zone.layout}`),
        h("span", { class: "be-zone-resize", dataset: { resize: "1" } }),
      );
      node.addEventListener("pointerdown", (event) => startDrag(event, zone));
      canvas.append(node);
    }
  }

  function boxStyle(box) {
    return { left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px` };
  }

  function startDrag(event, zone) {
    if (event.button !== 0) return;
    event.preventDefault();
    const resizing = event.target.dataset.resize === "1";
    const s = step();
    const origin = { x: event.clientX, y: event.clientY, col: zone.col, row: zone.row, w: zone.w, h: zone.h };
    selectedId = zone.id;
    let moved = false;

    const onMove = (move) => {
      const dCol = Math.round((move.clientX - origin.x) / s.x);
      const dRow = Math.round((move.clientY - origin.y) / s.y);
      const candidate = resizing
        ? { ...zone, w: Math.max(1, origin.w + dCol), h: Math.max(1, origin.h + dRow) }
        : { ...zone, col: origin.col + dCol, row: origin.row + dRow };
      if (!zoneFits(board, candidate) || zoneCollides(board, candidate)) return;
      if (candidate.col === zone.col && candidate.row === zone.row && candidate.w === zone.w && candidate.h === zone.h) return;
      Object.assign(zone, { col: candidate.col, row: candidate.row, w: candidate.w, h: candidate.h });
      moved = true;
      renderCanvas();
      fillZoneForm();
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (moved) markDirty();
      renderAll();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    renderAll();
  }

  /* ---- zone panel ---- */

  function fillZoneForm() {
    const zone = selected();
    zoneForm.hidden = !zone;
    zoneEmpty.hidden = Boolean(zone);
    if (!zone) return;
    for (const key of ["name", "area", "col", "row", "w", "h", "layout", "orientation", "face", "visibility"]) zoneForm[key].value = zone[key];
    zoneForm.extra.checked = Boolean(zone.extra);
    zoneForm.extra.disabled = Boolean(zone.role) || zone.area !== "player";
    zoneForm.area.disabled = Boolean(zone.role);
    deleteButton.disabled = Boolean(zone.role);
    roleNote.hidden = !zone.role;
    roleNote.textContent = zone.role ? ROLE_NOTES[zone.role] : "";
  }

  zoneForm.addEventListener("submit", (event) => event.preventDefault());
  zoneForm.addEventListener("change", () => {
    const zone = selected();
    if (!zone) return;
    showError("");
    const candidate = {
      ...zone,
      name: zoneForm.name.value,
      area: zoneForm.area.value,
      col: Number(zoneForm.col.value),
      row: Number(zoneForm.row.value),
      w: Number(zoneForm.w.value),
      h: Number(zoneForm.h.value),
      layout: zoneForm.layout.value,
      orientation: zoneForm.orientation.value,
      face: zoneForm.face.value,
      visibility: zoneForm.visibility.value,
      extra: zoneForm.extra.checked,
    };
    try {
      if (!candidate.name.trim()) throw new Error("A zone needs a name.");
      if (board.zones.some((z) => z.id !== zone.id && z.name.trim().toLowerCase() === candidate.name.trim().toLowerCase())) {
        throw new Error(`Another zone is already called "${candidate.name.trim()}".`);
      }
      if (candidate.area === "shared" && board.sharedRows === 0) throw new Error("Add shared rows to the board first.");
      if (!zoneFits(board, candidate)) throw new Error("That does not fit inside the area.");
      if (zoneCollides(board, candidate)) throw new Error("That overlaps another zone.");
      if (candidate.extra) for (const other of board.zones) if (other.id !== zone.id) other.extra = false; // only one zone starts with the extra cards
      Object.assign(zone, candidate, { name: candidate.name.trim() });
      markDirty();
    } catch (error) {
      showError(error.message);
    }
    renderAll();
  });

  deleteButton.addEventListener("click", () => {
    const zone = selected();
    if (!zone) return;
    try {
      removeZone(board, zone.id);
      selectedId = null;
      markDirty();
      showError("");
    } catch (error) {
      showError(error.message);
    }
    renderAll();
  });

  /* ---- board settings and counters ---- */

  function fillSettings() {
    for (const key of ["cols", "rows", "sharedRows", "cellWidth", "cellHeight", "startingHand"]) {
      settingsForm[key].value = board[key];
    }
  }

  settingsForm.addEventListener("submit", (event) => event.preventDefault());
  settingsForm.addEventListener("change", () => {
    showError("");
    try {
      resizeBoard(board, { cols: settingsForm.cols.value, rows: settingsForm.rows.value, sharedRows: settingsForm.sharedRows.value });
      setBoardSettings(board, {
        cellWidth: settingsForm.cellWidth.value,
        cellHeight: settingsForm.cellHeight.value,
        startingHand: settingsForm.startingHand.value,
      });
      markDirty();
    } catch (error) {
      showError(error.message);
    }
    renderAll();
  });

  function renderCounters() {
    counterList.replaceChildren();
    board.counters.forEach((counter, index) => {
      const name = h("input", { type: "text", value: counter.name, "aria-label": "Counter name" });
      const start = h("input", { type: "number", value: counter.start, "aria-label": "Starting value" });
      const update = () => {
        counter.name = name.value;
        counter.start = start.value === "" ? 0 : Number(start.value);
        markDirty();
      };
      name.addEventListener("input", update);
      start.addEventListener("input", update);
      counterList.append(
        h(
          "li",
          { class: "counter-row" },
          name,
          start,
          h(
            "button",
            {
              type: "button",
              onclick: () => {
                board.counters.splice(index, 1);
                markDirty();
                renderCounters();
              },
            },
            "Remove",
          ),
        ),
      );
    });
  }

  section.querySelector(".counter-add-button").addEventListener("click", () => {
    board.counters.push({ name: `Counter ${board.counters.length + 1}`, start: 0 });
    markDirty();
    renderCounters();
  });

  /* ---- top actions ---- */

  function addZoneOf(area) {
    showError("");
    try {
      if (area === "shared" && board.sharedRows === 0) {
        resizeBoard(board, { cols: board.cols, rows: board.rows, sharedRows: 1 });
        fillSettings();
      }
      const zone = addZone(board, { area });
      selectedId = zone.id;
      markDirty();
    } catch (error) {
      showError(error.message);
    }
    renderAll();
  }

  section.querySelector(".board-add-zone-button").addEventListener("click", () => addZoneOf("player"));
  section.querySelector(".board-add-shared-button").addEventListener("click", () => addZoneOf("shared"));

  section.querySelector(".board-save-button").addEventListener("click", async () => {
    showError("");
    try {
      board.name = nameInput.value;
      board.counters = validateCounters(board.counters);
      validateBoard(board);
      const saved = await storage.saveBoard(projectId, board);
      board.name = saved.name;
      dirty = false;
      dirtyEl.hidden = true;
      renderAll();
    } catch (error) {
      showError(error.message);
    }
  });

  nameInput.addEventListener("input", markDirty);
  section.querySelector(".back-button").addEventListener("click", () => {
    if (dirty && !confirm("Leave without saving your changes to this board?")) return;
    onBack();
  });

  function renderAll() {
    heading.replaceChildren(nameInput);
    renderCanvas();
    fillZoneForm();
    fillSettings();
  }

  root.replaceChildren(view);
  renderAll();
  renderCounters();
}
