// Draws the playing field of a game: the viewer's half at the bottom, the other player's half mirrored 180 degrees at
// the top (zones mirrored, cards kept upright so they stay readable), the shared band in the middle.
// DOM only: it holds no game state. The controller calls update(model) after every change and gets user actions back
// through the handlers.
//
//   const view = createGameView(container, { templates, handlers })
//   model    = { state, ctx, viewer, selectedUid }
//   handlers = { onCardMenu(uid, key, rect), onZoneMenu(key, rect), onMove(uid, toKey), onHover(entry | null) }
import { h } from "../dom.mjs?v=31";
import { cardFaceElement, cardBackElement } from "../board/card-view.mjs?v=31";
import { cardView, zoneKey } from "../../game/game-state.mjs?v=31";

const GAP = 6;
const AREA_GAP = 18;
const STACK_OFFSET = 7;
const STACK_MAX_STEPS = 8;
const DRAG_THRESHOLD_PX = 5;

// A card on the table. `vis` is "up", "peek" (own face-down card) or "down".
export function buildCardNode({ ctx, templates }, entry, vis, width, height) {
  const art = vis === "down" ? cardBackElement(width, height) : cardFaceElement(templates, ctx.index.get(entry.cardId) ?? null, width, height);
  return h(
    "div",
    { class: `gcard vis-${vis}${entry.rot ? " rotated" : ""}`, style: { width: `${width}px`, height: `${height}px` }, dataset: { uid: entry.uid } },
    art,
    vis === "peek" ? h("span", { class: "gcard-badge" }, "face-down") : null,
  );
}

// Where each card of a zone goes, relative to the zone: [{ x, y } | null] (null: not drawn).
function placeCards(zone, count, cw, ch, zw, zh, dir) {
  const spots = [];
  for (let i = 0; i < count; i++) {
    switch (zone.layout) {
      case "pile":
        spots.push(i === count - 1 ? { x: (zw - cw) / 2, y: (zh - ch) / 2 } : null);
        break;
      case "stack": {
        const fromTop = Math.min(i, STACK_MAX_STEPS) * STACK_OFFSET;
        spots.push({ x: dir > 0 ? fromTop : zw - cw - fromTop, y: dir > 0 ? fromTop : zh - ch - fromTop });
        break;
      }
      case "spread": {
        const natural = cw + 4;
        const step = count * natural <= zw ? natural : count > 1 ? (zw - cw) / (count - 1) : 0;
        spots.push({ x: i * step, y: (zh - ch) / 2 });
        break;
      }
      default: {
        // grid: one card per cell, reading order; extra cards pile up on the last cell
        const cols = Math.max(1, Math.round((zw + GAP) / (cw + GAP)));
        const rows = Math.max(1, Math.round((zh + GAP) / (ch + GAP)));
        const capacity = cols * rows;
        const slot = i % capacity;
        const over = Math.floor(i / capacity) * STACK_OFFSET;
        spots.push({ x: (slot % cols) * (cw + GAP) + over, y: Math.floor(slot / cols) * (ch + GAP) + over });
      }
    }
  }
  return spots;
}

export function createGameView(container, { templates, handlers }) {
  const wrap = h("div", { class: "game-board-wrap" });
  const boardEl = h("div", { class: "game-board" });
  wrap.append(boardEl);
  container.replaceChildren(wrap);

  let layoutSignature = "";
  const zoneNodes = new Map(); // zone key -> { node, cardsEl, labelEl, signature }
  let scale = 1;
  let natural = { width: 1, height: 1 };

  /* ---- fitting the board into the window ---- */

  function fit() {
    const availableW = wrap.clientWidth;
    const availableH = wrap.clientHeight;
    if (!availableW || !availableH) return;
    scale = Math.min(availableW / natural.width, availableH / natural.height, 1.4);
    boardEl.style.transform = `scale(${scale})`;
    boardEl.style.left = `${Math.max(0, (availableW - natural.width * scale) / 2)}px`;
  }
  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(wrap);

  /* ---- building the grid of zones ---- */

  function buildLayout(model) {
    const { board } = model.ctx;
    const cw = board.cellWidth;
    const ch = board.cellHeight;
    const stepX = cw + GAP;
    const stepY = ch + GAP;
    const offsets = { top: 0, shared: board.rows * stepY - GAP + AREA_GAP };
    offsets.bottom = offsets.shared + (board.sharedRows ? board.sharedRows * stepY - GAP + AREA_GAP : 0);
    natural = { width: board.cols * stepX - GAP, height: offsets.bottom + board.rows * stepY - GAP };
    boardEl.style.width = `${natural.width}px`;
    boardEl.style.height = `${natural.height}px`;
    boardEl.replaceChildren();
    zoneNodes.clear();

    const viewer = model.viewer;
    for (const zone of board.zones) {
      const sides = zone.area === "shared" ? ["shared"] : [1 - viewer, viewer]; // other player first (top)
      for (const side of sides) {
        const mirrored = side !== viewer && side !== "shared";
        const col = mirrored ? board.cols - zone.col - zone.w : zone.col;
        const row = mirrored ? board.rows - zone.row - zone.h : zone.row;
        const top = side === "shared" ? offsets.shared : mirrored ? offsets.top : offsets.bottom;
        const width = zone.w * stepX - GAP;
        const height = zone.h * stepY - GAP;
        const key = zoneKey(side, zone.id);
        const labelEl = h("button", { type: "button", class: "gz-label", title: "Zone options" });
        const cardsEl = h("div", { class: "gz-cards" });
        const node = h(
          "div",
          {
            class: `gz ${zone.role ?? ""} layout-${zone.layout}${mirrored ? " theirs" : ""}${side === "shared" ? " shared" : ""}`,
            style: { left: `${col * stepX}px`, top: `${top + row * stepY}px`, width: `${width}px`, height: `${height}px` },
            dataset: { key },
          },
          labelEl,
          cardsEl,
        );
        labelEl.addEventListener("click", (event) => {
          event.stopPropagation();
          handlers.onZoneMenu(key, labelEl.getBoundingClientRect());
        });
        node.addEventListener("click", (event) => {
          if (event.target === node || event.target === cardsEl) handlers.onZoneMenu(key, node.getBoundingClientRect());
        });
        boardEl.append(node);
        zoneNodes.set(key, { node, cardsEl, labelEl, signature: "", zone, side, mirrored, width, height });
      }
    }
    fit();
  }

  /* ---- filling the zones ---- */

  function fillZone(model, key, info) {
    const { state, ctx, viewer } = model;
    const cards = state.zones[key] ?? [];
    const { zone, width, height, mirrored } = info;
    const board = ctx.board;
    const views = cards.map((entry) => cardView(board, viewer, key, entry));
    const signature = JSON.stringify([cards.map((c, i) => [c.uid, c.cardId, c.faceUp, c.rot, views[i]]), model.selectedUid && cards.some((c) => c.uid === model.selectedUid) ? model.selectedUid : null]);
    if (signature === info.signature) return;
    info.signature = signature;

    info.labelEl.textContent = `${zone.name}${cards.length ? ` (${cards.length})` : ""}`;
    info.node.classList.toggle("empty", cards.length === 0);
    info.cardsEl.replaceChildren();
    const cw = board.cellWidth;
    const ch = board.cellHeight;
    const spots = placeCards(zone, cards.length, cw, ch, width, height, mirrored ? -1 : 1);
    cards.forEach((entry, i) => {
      const spot = spots[i];
      if (!spot) return;
      const node = buildCardNode({ ctx, templates }, entry, views[i], cw, ch);
      node.style.left = `${spot.x}px`;
      node.style.top = `${spot.y}px`;
      node.style.zIndex = String(i + 1);
      node.dataset.key = key;
      if (views[i] !== "down") node.dataset.cardId = entry.cardId;
      if (entry.uid === model.selectedUid) node.classList.add("selected");
      info.cardsEl.append(node);
    });
  }

  /* ---- pointer handling: click for a menu, drag to move ---- */

  let drag = null;

  function dropTargetAt(x, y) {
    for (const element of document.elementsFromPoint(x, y)) {
      const zoneEl = element.closest?.(".gz");
      if (zoneEl && boardEl.contains(zoneEl)) return zoneEl;
    }
    return null;
  }

  function endDrag() {
    if (!drag) return;
    drag.ghost?.remove();
    boardEl.querySelectorAll(".drop-target").forEach((n) => n.classList.remove("drop-target"));
    drag.source.classList.remove("dragging");
    drag = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", endDrag);
  }

  function onPointerMove(event) {
    if (!drag) return;
    if (!drag.started && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < DRAG_THRESHOLD_PX) return;
    if (!drag.started) {
      drag.started = true;
      drag.source.classList.add("dragging");
      const rect = drag.source.getBoundingClientRect();
      drag.ghost = drag.source.cloneNode(true);
      drag.ghost.classList.add("drag-ghost");
      drag.ghost.classList.remove("dragging", "selected");
      Object.assign(drag.ghost.style, { position: "fixed", left: "0", top: "0", margin: "0", zIndex: "9999", pointerEvents: "none", transformOrigin: "top left", width: `${drag.source.offsetWidth}px`, height: `${drag.source.offsetHeight}px` });
      drag.offset = { x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale };
      document.body.append(drag.ghost);
    }
    drag.ghost.style.transform = `translate(${event.clientX - drag.offset.x * scale}px, ${event.clientY - drag.offset.y * scale}px) scale(${scale})${drag.source.classList.contains("rotated") ? " rotate(90deg)" : ""}`;
    boardEl.querySelectorAll(".drop-target").forEach((n) => n.classList.remove("drop-target"));
    dropTargetAt(event.clientX, event.clientY)?.classList.add("drop-target");
  }

  function onPointerUp(event) {
    if (!drag) return;
    const { started, source } = drag;
    const uid = source.dataset.uid;
    const target = started ? dropTargetAt(event.clientX, event.clientY) : null;
    const rect = source.getBoundingClientRect();
    const fromKey = source.dataset.key;
    endDrag();
    if (!started) handlers.onCardMenu(uid, fromKey, rect);
    else if (target && target.dataset.key !== fromKey) handlers.onMove(uid, target.dataset.key);
  }

  boardEl.addEventListener("pointerdown", (event) => {
    const source = event.target.closest?.(".gcard");
    if (!source || event.button !== 0) return;
    event.preventDefault();
    drag = { source, x: event.clientX, y: event.clientY, started: false, ghost: null, offset: { x: 0, y: 0 } };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", endDrag);
  });

  boardEl.addEventListener("contextmenu", (event) => {
    const source = event.target.closest?.(".gcard");
    if (!source) return;
    event.preventDefault();
    handlers.onCardMenu(source.dataset.uid, source.dataset.key, source.getBoundingClientRect());
  });

  boardEl.addEventListener("pointerover", (event) => {
    const source = event.target.closest?.(".gcard");
    handlers.onHover(source?.dataset.cardId ?? null);
  });
  boardEl.addEventListener("pointerleave", () => handlers.onHover(null));

  return {
    update(model) {
      const signature = `${model.ctx.board.id}|${model.viewer}|${model.ctx.board.zones.length}|${JSON.stringify(model.ctx.board)}`;
      if (signature !== layoutSignature) {
        layoutSignature = signature;
        buildLayout(model);
      }
      for (const [key, info] of zoneNodes) fillZone(model, key, info);
    },
    refit: fit,
    destroy() {
      endDrag();
      resizeObserver.disconnect();
    },
  };
}
