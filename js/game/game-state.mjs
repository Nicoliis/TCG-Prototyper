// Game rules for a playtest: pure and deterministic (no DOM, no network, no storage). The same state and the same
// event always give the same result, so two browsers that apply the same numbered events end up identical.
//
//   state = { seq, phase: "setup" | "playing", turn, active, players: [{ name, deckId, ready, counters }],
//             zones: { [zoneKey]: [{ uid, cardId, owner, faceUp, rot }] }, log: [{ seq, by, text }] }
//
// A zone key is "p0:<zoneId>" / "p1:<zoneId>" (a zone of one player) or "s:<zoneId>" (a shared zone). Inside a zone the
// LAST card is the top. A card uid is "<owner>-<n>".
//
// Events that need randomness (shuffling, coin, die) are first resolved by the room creator with prepareEvent, which
// writes the outcome into the event; applyEvent then never needs a random number.

const LOG_MAX = 300;
const NAME_MAX = 24;
const PILE_ROLES = ["deck", "hand", "discard"];

export const COIN_RESULTS = ["heads", "tails"];

export function zoneKey(side, zoneId) {
  return side === "shared" ? `s:${zoneId}` : `p${side}:${zoneId}`;
}

export function parseKey(key) {
  const [head, zoneId] = String(key).split(":");
  return { side: head === "s" ? "shared" : Number(head.slice(1)), zoneId };
}

export const ownerOf = (uid) => Number(String(uid).split("-")[0]);

export function cleanName(name) {
  return String(name ?? "").trim().replace(/\s+/g, " ").slice(0, NAME_MAX);
}

export function roleZone(board, role) {
  return board.zones.find((zone) => zone.role === role);
}

// The zone that starts with the deck's extra cards, if the board has one.
function extraZone(board) {
  return board.zones.find((zone) => zone.extra && !zone.role && zone.area === "player") ?? null;
}

function zoneDef(board, zoneId) {
  return board.zones.find((zone) => zone.id === zoneId) ?? null;
}

export function newGame(board, names = ["Player 1", "Player 2"]) {
  const zones = {};
  for (const zone of board.zones) {
    if (zone.area === "shared") zones[zoneKey("shared", zone.id)] = [];
    else {
      zones[zoneKey(0, zone.id)] = [];
      zones[zoneKey(1, zone.id)] = [];
    }
  }
  return {
    seq: 0,
    phase: "setup",
    turn: 1,
    active: 0,
    players: [0, 1].map((i) => ({
      name: cleanName(names[i]) || `Player ${i + 1}`,
      deckId: null,
      ready: false,
      counters: board.counters.map((c) => c.start),
    })),
    zones,
    log: [],
  };
}

// What the viewer sees of a card: "up" (the face), "peek" (the viewer's own face-down card, shown dimmed) or "down".
export function cardView(board, viewer, key, entry) {
  const { side, zoneId } = parseKey(key);
  const zone = zoneDef(board, zoneId);
  if (entry.faceUp) return "up";
  const visibility = zone ? zone.visibility : "public";
  if (side !== "shared" && visibility === "private" && side === viewer) return "up";
  if (visibility !== "hidden" && entry.owner === viewer) return "peek";
  return "down";
}

export function shuffled(list, random = Math.random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function ownedUids(state, by) {
  return Object.values(state.zones).flat().filter((entry) => entry.owner === by).map((entry) => entry.uid);
}

// The room creator turns an intent into a fully decided event. Returns { event } or { error }.
export function prepareEvent(state, event, { board, pack, random = Math.random }) {
  switch (event.kind) {
    case "ready": {
      if (event.deckId === "") return { event: { ...event, cards: [] } }; // practice alone with no cards on this side
      const deck = (pack.decks ?? []).find((d) => d.id === event.deckId);
      if (!deck) return { error: "That deck does not exist." };
      const cards = [];
      for (const entry of deck.entries) for (let i = 0; i < entry.count; i++) cards.push({ cardId: entry.cardId, extra: Boolean(entry.extra) });
      if (!cards.length) return { error: "That deck has no cards." };
      const order = shuffled(
        cards.map(({ cardId, extra }, n) => ({ uid: `${event.by}-${n}`, cardId, ...(extra ? { extra: true } : {}) })),
        random,
      );
      return { event: { ...event, cards: order } };
    }
    case "redeal":
      return { event: { ...event, order: shuffled(ownedUids(state, event.by), random) } };
    case "shuffle": {
      const cards = state.zones[event.key];
      if (!cards) return { error: "That zone does not exist." };
      return { event: { ...event, order: shuffled(cards.map((c) => c.uid), random) } };
    }
    case "moveAll": {
      const cards = state.zones[event.from];
      if (!cards) return { error: "That zone does not exist." };
      return { event: { ...event, order: event.shuffle ? shuffled(cards.map((c) => c.uid), random) : cards.map((c) => c.uid) } };
    }
    case "coin":
      return { event: { ...event, result: COIN_RESULTS[random() < 0.5 ? 0 : 1] } };
    case "die": {
      const sides = Math.min(100, Math.max(2, Number(event.sides) | 0 || 6));
      return { event: { ...event, sides, result: 1 + Math.floor(random() * sides) } };
    }
    default:
      return { event };
  }
}

function refuse(state, reason) {
  return { ok: false, state, reason };
}

function find(next, uid) {
  for (const [key, cards] of Object.entries(next.zones)) {
    const index = cards.findIndex((c) => c.uid === uid);
    if (index !== -1) return { key, index, entry: cards[index] };
  }
  return null;
}

function zoneName(board, key) {
  const zone = zoneDef(board, parseKey(key).zoneId);
  return zone ? zone.name : "a zone";
}

const clamp01 = (n) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0.5));

// The card as it arrives in a zone. A card never keeps its stack or its spot from another zone.
function entryFor(zone, entry, faceOverride, spot) {
  const faceUp = faceOverride ?? (zone.face === "choose" ? entry.faceUp : zone.face === "up");
  const rot = zone.orientation === "choose" ? entry.rot : zone.orientation === "sideways" ? 90 : 0;
  const arrived = { ...entry, faceUp, rot };
  delete arrived.under;
  delete arrived.x;
  delete arrived.y;
  if (zone.layout === "free") Object.assign(arrived, { x: clamp01(spot?.x), y: clamp01(spot?.y) });
  return arrived;
}

function withLog(next, by, text) {
  next.seq += 1;
  next.log = next.log.concat({ seq: next.seq, by, text }).slice(-LOG_MAX);
}

function nameOfCard(ctx, cardId) {
  return (ctx.cardName && ctx.cardName(cardId)) || "a card";
}

// Where a card may go for this player; returns { key } or { error }.
function resolveDestination(next, board, by, entry, toKey) {
  const to = parseKey(toKey);
  const zone = zoneDef(board, to.zoneId);
  if (!zone || !(toKey in next.zones)) return { error: "That zone does not exist." };
  if (to.side === "shared") return { key: toKey, zone };
  if (zone.role && PILE_ROLES.includes(zone.role)) {
    // a card always goes back to the piles of its owner, whoever moves it
    return { key: zoneKey(entry.owner, zone.id), zone };
  }
  if (to.side === by) return { key: toKey, zone };
  return { error: "You can only place cards in your own zones or in shared zones." };
}

function canTake(board, by, key) {
  const { side, zoneId } = parseKey(key);
  if (side === "shared" || side === by) return true;
  const zone = zoneDef(board, zoneId);
  return Boolean(zone) && zone.visibility === "public";
}

function drawCards(next, board, by, count, ctx) {
  const deck = next.zones[zoneKey(by, roleZone(board, "deck").id)];
  const handZone = roleZone(board, "hand");
  const hand = next.zones[zoneKey(by, handZone.id)];
  let drawn = 0;
  for (let i = 0; i < count && deck.length; i++) {
    hand.push(entryFor(handZone, deck.pop()));
    drawn += 1;
  }
  return drawn;
}

function dealStartingHands(next, board, ctx) {
  for (const by of [0, 1]) drawCards(next, board, by, board.startingHand, ctx);
}

// Puts a player's cards in their starting zones: the main deck, and the cards marked "extra" in the extra zone
// (or in the main deck when the board has no extra zone).
function fillDeck(next, board, by, cards) {
  const deckZone = roleZone(board, "deck");
  const extra = extraZone(board);
  const place = (zone, list) => {
    next.zones[zoneKey(by, zone.id)] = list.map(({ uid, cardId, extra: isExtra }) =>
      entryFor(zone, { uid, cardId, owner: by, faceUp: false, rot: 0, ...(isExtra ? { extra: true } : {}) }),
    );
  };
  place(deckZone, extra ? cards.filter((c) => !c.extra) : cards);
  if (extra) place(extra, cards.filter((c) => c.extra));
}

export function applyEvent(state, event, ctx) {
  const { board } = ctx;
  if (!event || (event.by !== 0 && event.by !== 1)) return refuse(state, "Unknown player.");
  const next = structuredClone(state);
  const by = event.by;
  const who = next.players[by].name;

  switch (event.kind) {
    case "name": {
      const name = cleanName(event.name);
      if (!name) return refuse(state, "A name cannot be empty.");
      const before = next.players[by].name;
      next.players[by].name = name;
      withLog(next, by, `${before} is now called ${name}`);
      return { ok: true, state: next };
    }
    case "ready": {
      if (next.phase !== "setup") return refuse(state, "The game already started.");
      if (!Array.isArray(event.cards) || (!event.cards.length && event.deckId !== "")) return refuse(state, "That deck has no cards.");
      fillDeck(next, board, by, event.cards);
      next.players[by].ready = true;
      next.players[by].deckId = event.deckId;
      withLog(next, by, event.deckId === "" ? `${who} plays without cards` : `${who} chose a deck (${event.cards.length} cards)`);
      if (next.players.every((p) => p.ready)) {
        next.phase = "playing";
        dealStartingHands(next, board, ctx);
        withLog(next, by, `The game starts: each player draws ${board.startingHand} cards`);
      }
      return { ok: true, state: next };
    }
    case "restart": {
      const fresh = newGame(board, next.players.map((p) => p.name));
      fresh.seq = next.seq;
      fresh.log = next.log;
      withLog(fresh, by, `${who} restarted the game`);
      return { ok: true, state: fresh };
    }
    case "redeal": {
      if (next.phase !== "playing") return refuse(state, "The game has not started yet.");
      const mine = new Map(Object.values(next.zones).flat().filter((e) => e.owner === by).map((e) => [e.uid, e]));
      if (!Array.isArray(event.order) || event.order.length !== mine.size || event.order.some((uid) => !mine.has(uid))) {
        return refuse(state, "That redeal does not match your cards.");
      }
      for (const [key, cards] of Object.entries(next.zones)) next.zones[key] = cards.filter((c) => c.owner !== by);
      fillDeck(next, board, by, event.order.map((uid) => ({ uid, cardId: mine.get(uid).cardId, extra: mine.get(uid).extra })));
      const drawn = drawCards(next, board, by, board.startingHand, ctx);
      withLog(next, by, `${who} shuffled everything back and drew a new hand of ${drawn}`);
      return { ok: true, state: next };
    }
    case "draw": {
      if (next.phase !== "playing") return refuse(state, "The game has not started yet.");
      const count = Math.min(60, Math.max(1, Number(event.n) | 0 || 1));
      const drawn = drawCards(next, board, by, count, ctx);
      withLog(next, by, drawn ? `${who} drew ${drawn} card${drawn === 1 ? "" : "s"}` : `${who} tried to draw from an empty deck`);
      return { ok: true, state: next };
    }
    case "move": {
      if (next.phase !== "playing") return refuse(state, "The game has not started yet.");
      const found = find(next, event.uid);
      if (!found) return refuse(state, "That card is not there any more.");
      if (!canTake(board, by, found.key)) return refuse(state, "You cannot take cards from that zone.");
      // dropping onto another card of the table stacks the card there
      let base = null;
      let toKey = event.to;
      if (event.onto) {
        base = find(next, event.onto);
        if (!base || base.entry.uid === event.uid) return refuse(state, "That card is not there any more.");
        const baseSide = parseKey(base.key).side;
        const baseZone = zoneDef(board, parseKey(base.key).zoneId);
        if (!["grid", "free"].includes(baseZone.layout)) return refuse(state, "Cards cannot be stacked in that zone.");
        if (baseSide !== by && baseSide !== "shared") return refuse(state, "You can only stack cards in your own zones or in shared zones.");
        toKey = base.key;
      }
      const dest = resolveDestination(next, board, by, found.entry, toKey);
      if (dest.error) return refuse(state, dest.error);
      // the card travels with the cards stacked on it
      const followers = next.zones[found.key].filter((c) => c.under === event.uid);
      next.zones[found.key] = next.zones[found.key].filter((c) => c.uid !== event.uid && c.under !== event.uid);
      const entry = entryFor(dest.zone, found.entry, event.faceUp, event);
      const pile = next.zones[dest.key];
      if (base) {
        entry.under = base.entry.under ?? base.entry.uid;
        if (entry.under === event.uid) return refuse(state, "A card cannot be stacked on itself.");
      }
      if (event.where === "bottom") pile.unshift(entry);
      else pile.push(entry);
      const stackable = ["grid", "free"].includes(dest.zone.layout);
      for (const follower of followers) {
        const moved = entryFor(dest.zone, follower, undefined, event);
        if (stackable) moved.under = entry.under ?? event.uid; // stacks are one level deep: everything hangs from the bottom card
        pile.push(moved);
      }
      const known = entry.faceUp || found.entry.faceUp; // a card the table already saw keeps its name in the log
      const text = base
        ? `${who} stacked ${known ? nameOfCard(ctx, entry.cardId) : "a card"} on ${base.entry.faceUp ? nameOfCard(ctx, base.entry.cardId) : "a card"}`
        : `${who} moved ${known ? nameOfCard(ctx, entry.cardId) : "a card"} from ${zoneName(board, found.key)} to ${zoneName(board, dest.key)}`;
      withLog(next, by, text);
      return { ok: true, state: next };
    }
    case "unstack": {
      const found = find(next, event.uid);
      if (!found || !canTake(board, by, found.key)) return refuse(state, "That card is not there any more.");
      for (const card of next.zones[found.key].filter((c) => c.uid === event.uid || c.under === event.uid)) delete card.under;
      withLog(next, by, `${who} unstacked ${found.entry.faceUp ? nameOfCard(ctx, found.entry.cardId) : "a card"}`);
      return { ok: true, state: next };
    }
    case "moveAll": {
      if (next.phase !== "playing") return refuse(state, "The game has not started yet.");
      const source = next.zones[event.from];
      if (!source || !canTake(board, by, event.from)) return refuse(state, "You cannot take cards from that zone.");
      if (!source.length) return { ok: true, state: next };
      const order = Array.isArray(event.order) ? event.order : source.map((c) => c.uid);
      const byUid = new Map(source.map((c) => [c.uid, c]));
      if (order.length !== source.length || order.some((uid) => !byUid.has(uid))) return refuse(state, "That move does not match the zone.");
      next.zones[event.from] = [];
      let moved = 0;
      for (const uid of order) {
        const card = byUid.get(uid);
        const dest = resolveDestination(next, board, by, card, event.to);
        if (dest.error) {
          next.zones[event.from].push(card);
          continue;
        }
        const entry = entryFor(dest.zone, card, event.faceUp);
        if (event.where === "bottom") next.zones[dest.key].unshift(entry);
        else next.zones[dest.key].push(entry);
        moved += 1;
      }
      withLog(next, by, `${who} moved ${moved} card${moved === 1 ? "" : "s"} from ${zoneName(board, event.from)} to ${zoneName(board, event.to)}${event.shuffle ? " and shuffled" : ""}`);
      return { ok: true, state: next };
    }
    case "flip": {
      const found = find(next, event.uid);
      if (!found) return refuse(state, "That card is not there any more.");
      if (!canTake(board, by, found.key)) return refuse(state, "You cannot turn cards in that zone.");
      if (found.entry.faceUp && found.entry.owner !== by && found.key.startsWith(`p${1 - by}:`)) {
        return refuse(state, "Only its owner can turn that card face-down.");
      }
      found.entry.faceUp = !found.entry.faceUp;
      withLog(next, by, found.entry.faceUp ? `${who} turned ${nameOfCard(ctx, found.entry.cardId)} face up` : `${who} turned a card face down`);
      return { ok: true, state: next };
    }
    case "rotate": {
      const found = find(next, event.uid);
      if (!found) return refuse(state, "That card is not there any more.");
      if (!canTake(board, by, found.key)) return refuse(state, "You cannot turn cards in that zone.");
      found.entry.rot = found.entry.rot ? 0 : 90;
      withLog(next, by, `${who} ${found.entry.rot ? "turned" : "straightened"} ${found.entry.faceUp ? nameOfCard(ctx, found.entry.cardId) : "a card"} sideways`);
      return { ok: true, state: next };
    }
    case "shuffle": {
      const cards = next.zones[event.key];
      if (!cards || !canTake(board, by, event.key)) return refuse(state, "You cannot shuffle that zone.");
      const byUid = new Map(cards.map((c) => [c.uid, c]));
      if (!Array.isArray(event.order) || event.order.length !== cards.length || event.order.some((uid) => !byUid.has(uid))) {
        return refuse(state, "That shuffle does not match the zone.");
      }
      next.zones[event.key] = event.order.map((uid) => byUid.get(uid));
      withLog(next, by, `${who} shuffled ${zoneName(board, event.key)}`);
      return { ok: true, state: next };
    }
    case "counter": {
      const target = next.players[event.target];
      const counter = board.counters[event.idx];
      if (!target || !counter) return refuse(state, "That counter does not exist.");
      const amount = Number(event.amount);
      if (!Number.isInteger(amount) || Math.abs(amount) > 1000000) return refuse(state, "That amount is not valid.");
      const before = target.counters[event.idx];
      target.counters[event.idx] = event.mode === "set" ? amount : before + amount;
      withLog(next, by, `${who} changed ${target.name}'s ${counter.name}: ${before} → ${target.counters[event.idx]}`);
      return { ok: true, state: next };
    }
    case "endturn": {
      if (next.phase !== "playing") return refuse(state, "The game has not started yet.");
      next.active = 1 - next.active;
      next.turn += 1;
      withLog(next, by, `Turn ${next.turn}: ${next.players[next.active].name}`);
      return { ok: true, state: next };
    }
    case "coin":
      if (!COIN_RESULTS.includes(event.result)) return refuse(state, "That coin result is not valid.");
      withLog(next, by, `${who} flipped a coin: ${event.result}`);
      return { ok: true, state: next };
    case "die":
      if (!Number.isInteger(event.result) || event.result < 1 || event.result > event.sides) return refuse(state, "That die result is not valid.");
      withLog(next, by, `${who} rolled a d${event.sides}: ${event.result}`);
      return { ok: true, state: next };
    default:
      return refuse(state, "Unknown change.");
  }
}
