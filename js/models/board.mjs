// A board ("playing field") describes where a game is played. It is designed for ONE player: the player area
// (cols x rows). The opponent gets the same area mirrored 180 degrees on the other side of the table. Zones in the
// shared area (sharedRows rows between both players) belong to nobody.
//
// Every board always has three system zones in the player area, which can be moved, resized and restyled but
// never removed: the deck, the hand and the discard pile.

export const ZONE_ROLES = ["deck", "hand", "discard"];
export const ZONE_LAYOUTS = ["pile", "stack", "spread", "grid", "free"];
export const ZONE_FACES = ["up", "down", "choose"];
export const ZONE_ORIENTATIONS = ["vertical", "sideways", "choose"];
export const ZONE_VISIBILITIES = ["public", "private", "hidden"];
export const ZONE_AREAS = ["player", "shared"];

export const LAYOUT_LABELS = {
  pile: "Pile (only the top card, with a count)",
  stack: "Stack (cards offset so each stays visible)",
  spread: "Spread (a row of overlapping cards)",
  grid: "Grid (square cells; cards can lie straight or sideways)",
  free: "Chaotic (cards stay wherever you drop them)",
};
export const FACE_LABELS = {
  up: "Face up (Shift-drop plays it face down)",
  down: "Face down (Shift-drop plays it face up)",
  choose: "Choose (the card keeps its side; Shift-drop flips it)",
};
export const ORIENTATION_LABELS = {
  vertical: "Vertical",
  sideways: "Sideways",
  choose: "Choose (the card keeps its turn; turn it from its menu)",
};
export const VISIBILITY_LABELS = {
  public: "Public (everyone sees face-up cards)",
  private: "Private (only the owner sees the cards)",
  hidden: "Hidden (nobody sees the cards, only a count)",
};

export const MAX_COLS = 16;
export const MAX_ROWS = 10;
export const MAX_SHARED_ROWS = 6;

function sameName(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function wholeNumber(value, label, { min, max }) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(`${label} must be a whole number from ${min} to ${max}.`);
  }
  return n;
}

export function getBoards(project) {
  return project.boards ?? [];
}

export function validateBoardName(name, existingNames) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) throw new Error("Board name cannot be empty.");
  if (existingNames.some((existing) => sameName(existing, trimmed))) {
    throw new Error(`A board named "${trimmed}" already exists.`);
  }
  return trimmed;
}

export function createZone(fields = {}) {
  return {
    id: crypto.randomUUID(),
    name: "Zone",
    role: null,
    area: "player",
    col: 0,
    row: 0,
    w: 1,
    h: 1,
    layout: "stack",
    face: "up",
    orientation: "vertical",
    visibility: "public",
    extra: false,
    ...fields,
  };
}

export function createBoard(name, existingNames) {
  const board = {
    id: crypto.randomUUID(),
    name: validateBoardName(name, existingNames),
    cols: 6,
    rows: 3,
    sharedRows: 0,
    cellWidth: 140,
    cellHeight: 140,
    startingHand: 5,
    counters: [{ name: "Life", start: 20 }],
    zones: [],
  };
  board.zones = [
    createZone({ name: "Play area", col: 0, row: 0, w: 6, h: 2, layout: "grid", face: "up", visibility: "public" }),
    createZone({ name: "Deck", role: "deck", col: 0, row: 2, layout: "pile", face: "down", visibility: "hidden" }),
    createZone({ name: "Discard", role: "discard", col: 1, row: 2, layout: "pile", face: "up", visibility: "public" }),
    createZone({ name: "Hand", role: "hand", col: 2, row: 2, w: 4, layout: "spread", face: "down", visibility: "private" }),
  ];
  return board;
}

// The zone that starts with the deck's "extra" cards (null when the board has none).
export function extraZone(board) {
  return board.zones.find((z) => z.extra && !z.role && z.area === "player") ?? null;
}

export function areaSize(board, area) {
  return { cols: board.cols, rows: area === "shared" ? board.sharedRows : board.rows };
}

export function zonesOverlap(a, b) {
  if (a.area !== b.area) return false;
  return a.col < b.col + b.w && b.col < a.col + a.w && a.row < b.row + b.h && b.row < a.row + a.h;
}

export function zoneFits(board, zone) {
  const { cols, rows } = areaSize(board, zone.area);
  return zone.col >= 0 && zone.row >= 0 && zone.w >= 1 && zone.h >= 1 && zone.col + zone.w <= cols && zone.row + zone.h <= rows;
}

export function zoneCollides(board, zone) {
  return board.zones.some((other) => other.id !== zone.id && zonesOverlap(zone, other));
}

// The first free cell of the player area (or null when it is full).
export function findFreeCell(board, area = "player") {
  const { cols, rows } = areaSize(board, area);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const probe = { id: "", area, col, row, w: 1, h: 1 };
      if (!zoneCollides(board, probe)) return { col, row };
    }
  }
  return null;
}

export function addZone(board, fields = {}) {
  const area = fields.area ?? "player";
  const cell = findFreeCell(board, area);
  if (!cell) throw new Error(`There is no free cell left in the ${area} area. Make the area bigger first.`);
  const zone = createZone({ name: `Zone ${board.zones.length + 1}`, area, ...cell, ...fields });
  board.zones.push(zone);
  return zone;
}

export function removeZone(board, zoneId) {
  const zone = board.zones.find((z) => z.id === zoneId);
  if (!zone) return;
  if (zone.role) throw new Error(`The ${zone.role} is required: you can move it but not remove it.`);
  board.zones = board.zones.filter((z) => z.id !== zoneId);
}

// Checks a whole board; throws a readable error for the first problem.
export function validateBoard(board) {
  const names = new Set();
  for (const role of ZONE_ROLES) {
    const count = board.zones.filter((z) => z.role === role).length;
    if (count !== 1) throw new Error(`A board needs exactly one ${role} zone.`);
  }
  for (const zone of board.zones) {
    if (!zone.name.trim()) throw new Error("Every zone needs a name.");
    const key = zone.name.trim().toLowerCase();
    if (names.has(key)) throw new Error(`Two zones are called "${zone.name}". Zone names must be different.`);
    names.add(key);
    if (zone.extra && (zone.role || zone.area !== "player")) throw new Error(`"${zone.name}" cannot hold the extra deck: it must be a normal zone in the player area.`);
    if (zone.role && zone.area !== "player") throw new Error(`The ${zone.role} must be in the player area.`);
    if (!zoneFits(board, zone)) throw new Error(`"${zone.name}" does not fit inside the ${zone.area} area.`);
    if (zoneCollides(board, zone)) throw new Error(`"${zone.name}" overlaps another zone.`);
  }
  return board;
}

// Changes the size of the player/shared area. Refuses if a zone would be left outside.
export function resizeBoard(board, { cols, rows, sharedRows }) {
  const next = {
    ...board,
    cols: wholeNumber(cols, "Columns", { min: 1, max: MAX_COLS }),
    rows: wholeNumber(rows, "Rows", { min: 1, max: MAX_ROWS }),
    sharedRows: wholeNumber(sharedRows, "Shared rows", { min: 0, max: MAX_SHARED_ROWS }),
  };
  const outside = board.zones.find((zone) => !zoneFits(next, zone));
  if (outside) throw new Error(`"${outside.name}" would fall outside the area. Move or resize it first.`);
  Object.assign(board, { cols: next.cols, rows: next.rows, sharedRows: next.sharedRows });
}

export function setBoardSettings(board, fields) {
  board.cellWidth = wholeNumber(fields.cellWidth, "Cell width", { min: 40, max: 400 });
  board.cellHeight = wholeNumber(fields.cellHeight, "Cell height", { min: 40, max: 560 });
  board.startingHand = wholeNumber(fields.startingHand, "Starting hand", { min: 0, max: 60 });
}

export function validateCounters(counters) {
  const names = new Set();
  return counters.map((counter) => {
    const name = (counter.name ?? "").trim();
    if (!name) throw new Error("Every counter needs a name.");
    if (names.has(name.toLowerCase())) throw new Error(`Two counters are called "${name}".`);
    names.add(name.toLowerCase());
    const start = Number(counter.start);
    if (!Number.isInteger(start) || Math.abs(start) > 1000000) throw new Error(`The start of "${name}" must be a whole number.`);
    return { name, start };
  });
}

// Fills in anything an older or hand-edited board lacks, and keeps values inside the allowed sets.
export function normalizeBoard(board) {
  board.cols = Math.min(MAX_COLS, Math.max(1, board.cols | 0 || 6));
  board.rows = Math.min(MAX_ROWS, Math.max(1, board.rows | 0 || 3));
  board.sharedRows = Math.min(MAX_SHARED_ROWS, Math.max(0, board.sharedRows | 0));
  board.cellWidth ||= 100;
  board.cellHeight ||= 140;
  board.startingHand ??= 5;
  delete board.drawPerTurn;
  board.counters ??= [{ name: "Life", start: 20 }];
  board.zones ??= [];
  for (const zone of board.zones) {
    zone.id ??= crypto.randomUUID();
    zone.area = ZONE_AREAS.includes(zone.area) ? zone.area : "player";
    zone.layout = ZONE_LAYOUTS.includes(zone.layout) ? zone.layout : "stack";
    // boards saved before the orientation list had one setting, "keep", that meant both choices
    if (zone.face === "keep") {
      zone.face = "choose";
      zone.orientation ??= "choose";
    }
    zone.face = ZONE_FACES.includes(zone.face) ? zone.face : "up";
    zone.orientation = ZONE_ORIENTATIONS.includes(zone.orientation) ? zone.orientation : "vertical";
    zone.visibility = ZONE_VISIBILITIES.includes(zone.visibility) ? zone.visibility : "public";
    zone.role = ZONE_ROLES.includes(zone.role) ? zone.role : null;
    zone.extra = Boolean(zone.extra) && !zone.role && zone.area === "player";
    zone.w = Math.max(1, zone.w | 0);
    zone.h = Math.max(1, zone.h | 0);
  }
  return board;
}

export function cloneBoard(board, name) {
  return { ...structuredClone(board), id: crypto.randomUUID(), name };
}

export function cloneBoards(boards) {
  return boards.map((board) => ({ ...structuredClone(board), id: crypto.randomUUID() }));
}

export function upsertBoard(project, board) {
  const boards = (project.boards ??= []);
  const otherNames = boards.filter((b) => b.id !== board.id).map((b) => b.name);
  const saved = { ...board, id: board.id ?? crypto.randomUUID(), name: validateBoardName(board.name, otherNames) };
  validateBoard(saved);
  validateCounters(saved.counters);
  const index = boards.findIndex((b) => b.id === saved.id);
  if (index === -1) boards.push(saved);
  else boards[index] = saved;
  return saved;
}

export function removeBoard(project, boardId) {
  project.boards = getBoards(project).filter((b) => b.id !== boardId);
}
