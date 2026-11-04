// Draws the playing field of a game: the viewer's half at the bottom, the other player's half mirrored 180 degrees at
// the top (zones mirrored, cards kept upright so they stay readable), the shared band in the middle.
// DOM only: it holds no game state. The controller calls update(model) after every change and gets user actions back
// through the handlers.
//
//   const view = createGameView(container, { templates, handlers })
//   model    = { state, ctx, viewer, selectedUid }
//   handlers = { onCardMenu(uid, key, rect), onZoneMenu(key, rect), onMove(uid, toKey, { shift, x, y, onto }), onHover(entry | null) }
import { h } from "../dom.mjs?v=32";
import { cardFaceElement, cardBackElement, fitSize } from "../board/card-view.mjs?v=32";
import { cardView, zoneKey } from "../../game/game-state.mjs?v=32";

const GAP = 6;
const AREA_GAP = 18;
const STACK_OFFSET = 7;
const STACK_MAX_STEPS = 8;
const DRAG_THRESHOLD_PX = 5;

// A card on the table, fitted (keeping its shape) inside a cell of cellW x cellH. node.cardW / node.cardH tell its size.
// `vis` is "up", "peek" (own face-down card) or "down".
export function buildCardNode({ ctx, templates }, entry, vis, cellW, cellH) {
  const found = ctx.index.get(entry.cardId) ?? null;
  const { width, height } = fitSize(found, cellW, cellH);
  const art = vis === "down" ? cardBackElement(width, height) : cardFaceElement(templates, found, width, height);
  const node = h(
    "div",
    { class: `gcard vis-${vis}${entry.rot ? " rotated" : ""}`, style: { width: `${width}px`, height: `${height}px` }, dataset: { uid: entry.uid } },
    art,
    vis === "peek" ? h("span", { class: "gcard-badge" }, "face-down") : null,
  );
  node.cardW = width;
  node.cardH = height;
  return node;
}

// Where each card of a zone goes, relative to the zone: [{ x, y } | null] (null: not drawn). Spots are the top-left of
// the cell (cw x ch) the card sits in; the card itself is centred in it.
function placeCards(zone, cards, cw, ch, zw, zh, dir) {
  const count = cards.length;
  const spots = new Array(count).fill(null);
  const stackable = zone.layout === "grid" || zone.layout === "free";
  const baseIndex = new Map(cards.map((c, i) => [c.uid, i]));
  let slotCounter = 0;
  const gridCols = Math.max(1, Math.round((zw + GAP) / (cw + GAP)));
  const gridRows = Math.max(1, Math.round((zh + GAP) / (ch + GAP)));
  const children = new Map(); // base uid -> how many cards are stacked on it so far
  for (let i = 0; i < count; i++) {
    const card = cards[i];
    if (stackable && card.under && baseIndex.has(card.under)) continue; // placed after its base
    switch (zone.layout) {
      case "pile":
        spots[i] = i === count - 1 ? { x: (zw - cw) / 2, y: (zh - ch) / 2 } : null;
        break;
      case "stack": {
        const fromTop = Math.min(i, STACK_MAX_STEPS) * STACK_OFFSET;
        spots[i] = { x: dir > 0 ? fromTop : zw - cw - fromTop, y: dir > 0 ? fromTop : zh - ch - fromTop };
        break;
      }
      case "spread": {
        const natural = cw + 4;
        const step = count * natural <= zw ? natural : count > 1 ? (zw - cw) / (count - 1) : 0;
        spots[i] = { x: i * step, y: (zh - ch) / 2 };
        break;
      }
      case "free":
        spots[i] = { x: (card.x ?? 0.5) * Math.max(0, zw - cw), y: (card.y ?? 0.5) * Math.max(0, zh - ch) };
        break;
      default: {
        // grid: square cells in reading order; extra cards beyond the cells pile up on the last cell
        const capacity = gridCols * gridRows;
        const slot = slotCounter % capacity;
        const over = Math.floor(slotCounter / capacity) * STACK_OFFSET;
        spots[i] = { x: (slot % gridCols) * (cw + GAP) + over, y: Math.floor(slot / gridCols) * (ch + GAP) + over };
        slotCounter += 1;
      }
    }
  }
  if (stackable) {
    cards.forEach((card, i) => {
      if (!card.under || !baseIndex.has(card.under)) return;
      const base = spots[baseIndex.get(card.under)];
      if (!base) return;
      const k = (children.get(card.under) ?? 0) + 1;
      children.set(card.under, k);
      spots[i] = { x: base.x + dir * k * STACK_OFFSET, y: base.y + dir * k * STACK_OFFSET };
    });
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
  let cellW = 100;
  let cellH = 140;
  let latestState = null;
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
    cellW = cw;
    cellH = ch;
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
    const signature = JSON.stringify([cards.map((c, i) => [c.uid, c.cardId, c.faceUp, c.rot, c.under ?? null, c.x ?? null, c.y ?? null, views[i]]), model.selectedUid && cards.some((c) => c.uid === model.selectedUid) ? model.selectedUid : null]);
    if (signature === info.signature) return;
    info.signature = signature;

    info.labelEl.textContent = `${zone.name}${cards.length ? ` (${cards.length})` : ""}`;
    info.node.classList.toggle("empty", cards.length === 0);
    info.cardsEl.replaceChildren();
    const cw = board.cellWidth;
    const ch = board.cellHeight;
    const spots = placeCards(zone, cards, cw, ch, width, height, mirrored ? -1 : 1);
    cards.forEach((entry, i) => {
      const spot = spots[i];
      if (!spot) return;
      const node = buildCardNode({ ctx, templates }, entry, views[i], cw, ch);
      node.style.left = `${spot.x + (cw - node.cardW) / 2}px`;
      node.style.top = `${spot.y + (ch - node.cardH) / 2}px`;
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
      drag.ghost = drag.source.cloneNode(true);
      drag.ghost.classList.add("drag-ghost");
      drag.ghost.classList.remove("dragging", "selected");
      Object.assign(drag.ghost.style, { position: "fixed", left: "0", top: "0", margin: "0", zIndex: "9999", pointerEvents: "none", transformOrigin: "top left", width: `${drag.source.offsetWidth}px`, height: `${drag.source.offsetHeight}px` });
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
    const shift = event.shiftKey;
    const grab = drag.offset;
    const onto = started ? cardUnder(event.clientX, event.clientY, uid) : null;
    endDrag();
    if (!started) return handlers.onCardMenu(uid, fromKey, rect);
    if (!target) return;
    const info = zoneNodes.get(target.dataset.key);
    if (onto && onto.dataset.key === target.dataset.key) {
      return handlers.onMove(uid, target.dataset.key, { shift, onto: onto.dataset.uid });
    }
    const spot = {};
    if (info.zone.layout === "free") {
      // where the card's centre lands inside the zone, as a fraction of the room it can move in
      const zoneRect = target.getBoundingClientRect();
      const centreX = (event.clientX - zoneRect.left) / scale - (grab.x - source.offsetWidth / 2);
      const centreY = (event.clientY - zoneRect.top) / scale - (grab.y - source.offsetHeight / 2);
      const cell = cellSize();
      spot.x = (centreX - cell.w / 2) / Math.max(1, info.width - cell.w);
      spot.y = (centreY - cell.h / 2) / Math.max(1, info.height - cell.h);
    }
    if (target.dataset.key !== fromKey || info.zone.layout === "free") handlers.onMove(uid, target.dataset.key, { shift, ...spot });
  }

  // another card of a stackable zone under the pointer (not the one being dragged, nor one stacked on it)
  function cardUnder(x, y, uid) {
    for (const element of document.elementsFromPoint(x, y)) {
      const card = element.closest?.(".gcard");
      if (!card || card.dataset.uid === uid || !boardEl.contains(card)) continue;
      const info = zoneNodes.get(card.dataset.key);
      if (info && (info.zone.layout === "grid" || info.zone.layout === "free") && !isStackedOn(card.dataset.key, card.dataset.uid, uid)) return card;
    }
    return null;
  }

  function isStackedOn(key, uid, baseUid) {
    const entry = latestState?.zones[key]?.find((c) => c.uid === uid);
    return entry?.under === baseUid;
  }

  function cellSize() {
    return { w: cellW, h: cellH };
  }

  boardEl.addEventListener("pointerdown", (event) => {
    const source = event.target.closest?.(".gcard");
    if (!source || event.button !== 0) return;
    event.preventDefault();
    const grabbed = source.getBoundingClientRect();
    drag = { source, x: event.clientX, y: event.clientY, started: false, ghost: null, offset: { x: (event.clientX - grabbed.left) / scale, y: (event.clientY - grabbed.top) / scale } };
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
      latestState = model.state;
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
