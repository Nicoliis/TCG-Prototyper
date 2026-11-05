// Keeps two game states identical. The ROOM CREATOR is the authority: the joiner only sends intents, the creator
// turns them into events (choosing every random result), applies them in the order they arrive and sends each applied
// event to the joiner, who applies the same event with the same pure rules (game-state.mjs).
// No DOM, no network and no storage here: the caller gives it a `send` function and feeds it what arrives.
//
//   const session = createGameSession({ role: 0 | 1, pack, state, send, random, onChange, onNotice, onRefused })
//   session.intent(event)          ask for a change (creator: applies it; joiner: sends it to the creator)
//   session.intentFor(by, event)   creator only (practice alone): an event as if player `by` had made it
//   session.receive(message)       feed a message from the other side
//   session.hello(name)            joiner: introduce itself when the link opens
//
// Messages: hello, snapshot, intent, event, resync, refused.
import { applyEvent, prepareEvent, cleanName } from "./game-state.mjs?v=35";
import { makeContext, validatePack } from "./game-pack.mjs?v=35";

export const ROLE_CREATOR = 0;
export const ROLE_JOINER = 1;

export function createGameSession({ role, pack = null, state = null, send, random = Math.random, onChange = () => {}, onNotice = () => {}, onRefused = () => {} }) {
  let currentPack = pack;
  let ctx = pack ? makeContext(pack) : null;
  let current = state;

  function setState(next) {
    current = next;
    onChange(current);
  }

  function setPack(next) {
    currentPack = next;
    ctx = makeContext(next);
  }

  function applyAsAuthority(event) {
    const prepared = prepareEvent(current, event, { board: currentPack.board, pack: currentPack, random });
    if (prepared.error) return { ok: false, reason: prepared.error };
    const base = current.seq;
    const result = applyEvent(current, prepared.event, ctx);
    if (!result.ok) return result;
    setState(result.state);
    send({ type: "event", base, event: prepared.event });
    return result;
  }

  function sendSnapshot(withPack) {
    send({ type: "snapshot", state: current, ...(withPack ? { pack: currentPack } : {}) });
  }

  function onHello(message) {
    if (role !== ROLE_CREATOR || !current) return;
    const name = cleanName(message.name);
    if (name && name !== current.players[1].name) applyAsAuthority({ kind: "name", by: 1, name });
    sendSnapshot(true);
  }

  function onSnapshot(message) {
    if (role !== ROLE_JOINER || !message.state || !Array.isArray(message.state.players)) return;
    if (message.pack) {
      if (!validatePack(message.pack)) {
        onRefused("The room creator sent a game this version cannot read.");
        return;
      }
      setPack(message.pack);
    }
    if (!ctx) return;
    const differs = current !== null && JSON.stringify(current) !== JSON.stringify(message.state);
    setState(message.state);
    if (differs && current.seq > 0) onNotice("Your table was replaced by the room creator's table.");
  }

  function onIntent(message) {
    if (role !== ROLE_CREATOR || !current || !message.event) return;
    const result = applyAsAuthority({ ...message.event, by: 1 });
    if (!result.ok) send({ type: "refused", reason: result.reason });
  }

  function onEvent(message) {
    if (role !== ROLE_JOINER || !current || !ctx) return;
    if (message.base < current.seq) return;
    if (message.base > current.seq) {
      send({ type: "resync" });
      return;
    }
    const result = applyEvent(current, message.event, ctx);
    if (!result.ok) {
      send({ type: "resync" });
      return;
    }
    setState(result.state);
  }

  return {
    getState: () => current,
    getPack: () => currentPack,
    getContext: () => ctx,
    setState,
    hello(name) {
      send({ type: "hello", name });
    },
    intentFor(by, event) {
      return role === ROLE_CREATOR ? applyAsAuthority({ ...event, by }) : { ok: false, reason: "Only the room creator can do that." };
    },
    intent(event) {
      if (role === ROLE_CREATOR) return applyAsAuthority({ ...event, by: 0 });
      send({ type: "intent", event });
      return { ok: true };
    },
    receive(message) {
      if (!message || typeof message !== "object") return;
      if (message.type === "hello") onHello(message);
      else if (message.type === "snapshot") onSnapshot(message);
      else if (message.type === "intent") onIntent(message);
      else if (message.type === "event") onEvent(message);
      else if (message.type === "resync" && role === ROLE_CREATOR && current) sendSnapshot(false);
      else if (message.type === "refused") onRefused(message.reason);
    },
  };
}
