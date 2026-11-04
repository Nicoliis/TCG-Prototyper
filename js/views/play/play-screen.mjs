// The play screen: practice alone, host a game for a friend, or join one. It owns the session (game-session.mjs) and
// the link (net/link.mjs) and draws three phases: connecting, choosing decks, and the game itself.
//
//   mountPlay(root, storage, { mode: "practice" | "host", projectId, boardId }, onBack)
//   mountPlay(root, storage, { mode: "join" }, onBack)
import { h } from "../dom.mjs?v=33";
import { getBoards } from "../../models/board.mjs?v=33";
import { buildPack } from "../../game/game-pack.mjs?v=33";
import { newGame, zoneKey, parseKey, roleZone, cardView } from "../../game/game-state.mjs?v=33";
import { createGameSession, ROLE_CREATOR, ROLE_JOINER } from "../../game/game-session.mjs?v=33";
import { createLink } from "../../net/link.mjs?v=33";
import { loadCardTemplates, cardFaceElement, fitSize } from "../board/card-view.mjs?v=33";
import { createGameView, buildCardNode } from "./game-view.mjs?v=33";
import { showMenu, closeMenu } from "./menu.mjs?v=33";

const NAME_KEY = "tcg-prototyper-player-name";
const LOG_SHOWN = 80;
const PREVIEW_WIDTH = 360; // the whole card is shown large: we cannot know which text matters
const BROWSE_WIDTH = 92;

function storedName() {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

function rememberName(name) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // private browsing: the name is simply not remembered
  }
}

export async function mountPlay(root, storage, options, onBack) {
  const templates = await loadCardTemplates();
  const mode = options.mode;
  const practice = mode === "practice";

  let project = null;
  let board = null;
  if (mode !== "join") {
    project = await storage.getProject(options.projectId);
    board = getBoards(project).find((b) => b.id === options.boardId) ?? null;
    if (!project || !board) {
      onBack();
      return;
    }
  }

  const room = {
    session: null,
    link: null,
    viewer: mode === "join" ? ROLE_JOINER : ROLE_CREATOR,
    shownPhase: null,
    gameView: null,
    deckChoice: { 0: null, 1: "" },
    browseKey: null,
    browseLimit: null,
    closed: false,
    ui: {},
  };

  root.classList.add("wide");

  /* ---- frame ---- */

  const messageEl = h("p", { class: "play-message", hidden: true });
  const body = h("div", { class: "play-body" });
  const titleEl = h("h2", { class: "play-title" });
  const leaveButton = h("button", { type: "button", class: "back-button", onclick: () => leave() }, "← Leave");
  const section = h("section", { class: "view play-view" }, h("div", { class: "play-header" }, leaveButton, titleEl), messageEl, body);

  function setMessage(text, kind = "error") {
    messageEl.textContent = text ?? "";
    messageEl.className = `play-message ${kind}`;
    messageEl.hidden = !text;
  }

  function leave() {
    const state = room.session?.getState();
    if (state?.phase === "playing" && !confirm("Leave this game? Its state is not saved.")) return;
    teardown();
    root.classList.remove("wide");
    onBack();
  }

  function teardown() {
    room.closed = true;
    closeMenu();
    room.link?.close();
    room.gameView?.destroy();
  }

  const ctxOf = () => room.session?.getContext() ?? null;
  const stateOf = () => room.session?.getState() ?? null;

  /* ---- sending actions ---- */

  function act(event) {
    const result = practice ? room.session.intentFor(room.viewer, event) : room.session.intent(event);
    if (result && result.ok === false) setMessage(result.reason, "error");
    else if (messageEl.classList.contains("error")) setMessage("");
    return result;
  }

  function myName() {
    return document.querySelector(".play-name-input")?.value.trim() || storedName() || "Player";
  }

  /* ---- starting each mode ---- */

  function makeSession(extra) {
    return createGameSession({
      send: (message) => (room.link ? room.link.send(message) : false),
      onChange: () => render(),
      onNotice: (text) => setMessage(text, "notice"),
      onRefused: (reason) => setMessage(reason, "error"),
      ...extra,
    });
  }

  function startPractice() {
    const pack = buildPack(project, board);
    const name = storedName() || "You";
    room.session = makeSession({ role: ROLE_CREATOR, pack, state: newGame(board, [name, "Opponent"]) });
    room.deckChoice = { 0: pack.decks[0]?.id ?? "", 1: "" };
    render();
  }

  function linkHandlers() {
    const link = createLink({
      onStatus: (status, detail) => {
        if (room.link !== link || room.closed) return;
        room.linkStatus = status;
        if (status === "connected" && mode === "join") room.session.hello(myName());
        if (status === "disconnected" || status === "failed") setMessage(detail || "The connection was lost.", "error");
        else if (status === "connected") setMessage("Connected.", "notice");
        updateConnectStatus();
        render();
      },
      onMessage: (message) => room.link === link && room.session.receive(message),
    });
    room.link = link;
    return link;
  }

  async function startHost() {
    const pack = buildPack(project, board);
    const link = linkHandlers();
    room.session = makeSession({ role: ROLE_CREATOR, pack, state: newGame(board, [storedName() || "Player 1", "Player 2"]) });
    room.ui.connectStatus = "Preparing your invitation…";
    render();
    try {
      room.ui.code = await link.createOffer();
      room.ui.connectStatus = "Send this code to your friend, then paste their reply below.";
    } catch (error) {
      room.ui.connectStatus = "";
      setMessage(`Could not create the room: ${error.message}`, "error");
    }
    showConnect();
  }

  function startJoin() {
    room.session = makeSession({ role: ROLE_JOINER });
    room.ui.connectStatus = "Paste the invitation code your friend sent you.";
    showConnect();
  }

  /* ---- connect screen ---- */

  function copyButton(getText, label = "Copy") {
    return h(
      "button",
      {
        type: "button",
        onclick: async (event) => {
          try {
            await navigator.clipboard.writeText(getText());
            event.target.textContent = "Copied!";
          } catch {
            setMessage("Select the code and copy it by hand.", "notice");
          }
        },
      },
      label,
    );
  }

  function nameField() {
    const input = h("input", { type: "text", class: "play-name-input", maxlength: "24", value: storedName(), placeholder: "Player" });
    input.addEventListener("change", () => rememberName(input.value.trim()));
    return h("label", { class: "play-name-field" }, "Your name ", input);
  }

  function updateConnectStatus() {
    if (room.ui.statusEl) room.ui.statusEl.textContent = room.ui.connectStatus ?? "";
  }

  function showConnect() {
    room.shownPhase = "connect";
    const statusEl = h("p", { class: "play-status" });
    room.ui.statusEl = statusEl;
    const children = [nameField()];
    if (mode === "host") {
      const codeBox = h("textarea", { class: "code-box", readonly: true, rows: "5", value: room.ui.code ?? "" });
      codeBox.value = room.ui.code ?? "";
      const replyBox = h("textarea", { class: "code-box", rows: "5", placeholder: "Paste your friend's reply code here" });
      children.push(
        h("h3", {}, "1. Send this invitation to your friend"),
        codeBox,
        h("div", { class: "play-row" }, copyButton(() => codeBox.value, "Copy invitation")),
        h("h3", {}, "2. Paste their reply"),
        replyBox,
        h(
          "button",
          {
            type: "button",
            onclick: async () => {
              try {
                await room.link.acceptAnswer(replyBox.value);
                room.ui.connectStatus = "Connecting…";
                setMessage("");
              } catch (error) {
                setMessage(error.message, "error");
              }
              updateConnectStatus();
            },
          },
          "Connect",
        ),
        statusEl,
      );
    } else {
      const inviteBox = h("textarea", { class: "code-box", rows: "5", placeholder: "Paste the invitation code here" });
      const replyBox = h("textarea", { class: "code-box", readonly: true, rows: "5", hidden: true });
      const replyRow = h("div", { class: "play-row", hidden: true }, copyButton(() => replyBox.value, "Copy reply"));
      children.push(
        h("h3", {}, "1. Paste the invitation"),
        inviteBox,
        h(
          "button",
          {
            type: "button",
            onclick: async () => {
              setMessage("");
              rememberName(myName());
              try {
                room.link?.close();
                const link = linkHandlers();
                room.ui.connectStatus = "Preparing your reply…";
                updateConnectStatus();
                replyBox.value = await link.acceptOffer(inviteBox.value);
                replyBox.hidden = false;
                replyRow.hidden = false;
                room.ui.connectStatus = "Send the reply code back to the room creator and wait: the game opens by itself.";
              } catch (error) {
                room.link?.close();
                room.link = null;
                room.ui.connectStatus = "";
                setMessage(error.message, "error");
              }
              updateConnectStatus();
            },
          },
          "Create reply code",
        ),
        h("h3", {}, "2. Send this reply back"),
        replyBox,
        replyRow,
        statusEl,
      );
    }
    body.replaceChildren(...children);
    updateConnectStatus();
  }

  /* ---- deck choice ---- */

  function deckSelect(pack, current, allowNone, onChange) {
    const select = h(
      "select",
      { class: "play-deck-select" },
      allowNone ? h("option", { value: "" }, "No cards (an empty side)") : null,
      pack.decks.map((deck) => h("option", { value: deck.id }, `${deck.name} (${deck.entries.reduce((n, e) => n + e.count, 0)} cards)`)),
    );
    select.value = current ?? pack.decks[0]?.id ?? "";
    select.addEventListener("change", () => onChange(select.value));
    return select;
  }

  function showSetup() {
    const state = stateOf();
    const pack = room.session.getPack();
    const board = pack.board;
    const empty = pack.decks.length === 0;
    const children = [
      h("p", { class: "hint" }, `Board: ${board.name}. Each player draws ${board.startingHand} cards to start.`),
    ];
    if (empty) {
      children.push(h("p", { class: "field-error" }, "This project has no decks with cards yet. Build a deck first (Decks), then come back."));
    }
    if (practice) {
      children.push(
        h(
          "div",
          { class: "setup-grid" },
          h("label", {}, "Your deck ", deckSelect(pack, room.deckChoice[0], true, (id) => (room.deckChoice[0] = id))),
          h("label", {}, "Opponent's deck ", deckSelect(pack, room.deckChoice[1], true, (id) => (room.deckChoice[1] = id))),
        ),
        h(
          "button",
          {
            type: "button",
            class: "primary",
            onclick: () => {
              act0(0, room.deckChoice[0] ?? pack.decks[0]?.id ?? "");
              act0(1, room.deckChoice[1] ?? "");
            },
          },
          "Start practice",
        ),
        h("p", { class: "hint" }, "Tip: leave the opponent without cards to practice opening hands alone. You can switch sides at any time during the game."),
      );
    } else {
      const me = state.players[room.viewer];
      const other = state.players[1 - room.viewer];
      children.push(
        h("p", { class: "play-status" }, `${state.players[0].name} (room creator) vs ${state.players[1].name}`),
        me.ready
          ? h("p", { class: "play-status" }, `You chose your deck. ${other.ready ? "Starting…" : `Waiting for ${other.name} to choose a deck…`}`)
          : h(
              "div",
              { class: "setup-grid" },
              h("label", {}, "Your deck ", deckSelect(pack, room.deckChoice[room.viewer], false, (id) => (room.deckChoice[room.viewer] = id))),
              h(
                "button",
                {
                  type: "button",
                  class: "primary",
                  disabled: empty,
                  onclick: () => act({ kind: "ready", deckId: room.deckChoice[room.viewer] ?? pack.decks[0]?.id }),
                },
                "Ready",
              ),
            ),
        h("p", { class: "play-status" }, other.ready ? `${other.name} is ready.` : `${other.name} is choosing a deck…`),
      );
    }
    body.replaceChildren(...children);
  }

  function act0(by, deckId) {
    const result = room.session.intentFor(by, { kind: "ready", deckId });
    if (result && result.ok === false) setMessage(result.reason, "error");
  }

  /* ---- the game ---- */

  function showGame() {
    const preview = h("div", { class: "game-preview" }, h("p", { class: "hint" }, "Point at a card to read it."));
    const logEl = h("ol", { class: "game-log" });
    const bar = h("div", { class: "game-topbar" });
    const stage = h("div", { class: "game-stage" });
    const browse = h("div", { class: "browse-overlay", hidden: true });
    body.replaceChildren(
      h("div", { class: "game-layout" }, bar, h("div", { class: "game-main" }, stage, h("aside", { class: "game-side" }, preview, h("h3", {}, "Log"), logEl), browse)),
    );
    room.ui = { ...room.ui, bar, preview, logEl, browse };
    room.gameView = createGameView(stage, {
      templates,
      handlers: {
        onCardMenu: openCardMenu,
        onZoneMenu: openZoneMenu,
        onMove: playCard,
        onHover: showPreview,
      },
    });
  }

  // A card dropped on a zone (or on another card). Zones only set a default side; Shift plays the opposite.
  function playCard(uid, toKey, { shift = false, x, y, onto } = {}) {
    const state = stateOf();
    const ctx = ctxOf();
    let entry = null;
    for (const cards of Object.values(state.zones)) entry ??= cards.find((c) => c.uid === uid) ?? null;
    if (!entry) return;
    const event = { kind: "move", uid, to: toKey };
    if (onto) event.onto = onto;
    if (x !== undefined) Object.assign(event, { x, y });
    if (shift) {
      const zone = ctx.board.zones.find((z) => z.id === parseKey(toKey).zoneId);
      const defaultUp = zone.face === "choose" ? entry.faceUp : zone.face === "up";
      event.faceUp = !defaultUp;
    }
    act(event);
  }

  function showPreview(cardId) {
    const ctx = ctxOf();
    const { preview } = room.ui;
    if (!preview || !ctx) return;
    if (!cardId) return;
    const found = ctx.index.get(cardId);
    if (!found) return;
    const size = fitSize(found, PREVIEW_WIDTH, Math.min(540, Math.round(window.innerHeight * 0.6)));
    preview.replaceChildren(cardFaceElement(templates, found, size.width, size.height), h("p", { class: "preview-name" }, ctx.cardName(cardId)));
  }

  function counterChip(state, ctx, index) {
    const player = state.players[index];
    const own = index === room.viewer;
    const nameButton = h(
      "button",
      {
        type: "button",
        class: "player-name",
        title: own ? "Click to rename" : "",
        disabled: !own,
        onclick: () => {
          const name = prompt("Your name", player.name);
          if (name?.trim()) {
            rememberName(name.trim());
            act({ kind: "name", name });
          }
        },
      },
      player.name,
    );
    return h(
      "div",
      { class: `player-chip${state.active === index && state.phase === "playing" ? " active" : ""}${own ? " own" : ""}` },
      nameButton,
      ctx.board.counters.map((counter, idx) =>
        h(
          "span",
          { class: "counter" },
          h("span", { class: "counter-name" }, counter.name),
          h("button", { type: "button", "aria-label": `Decrease ${counter.name}`, onclick: () => act({ kind: "counter", target: index, idx, mode: "add", amount: -1 }) }, "−"),
          h(
            "button",
            {
              type: "button",
              class: "counter-value",
              title: "Click to set a value",
              onclick: () => {
                const answer = prompt(`Set ${player.name}'s ${counter.name} to`, String(player.counters[idx]));
                if (answer === null) return;
                const amount = Number(answer);
                if (Number.isInteger(amount)) act({ kind: "counter", target: index, idx, mode: "set", amount });
              },
            },
            String(player.counters[idx]),
          ),
          h("button", { type: "button", "aria-label": `Increase ${counter.name}`, onclick: () => act({ kind: "counter", target: index, idx, mode: "add", amount: 1 }) }, "+"),
        ),
      ),
    );
  }

  function renderBar(state, ctx) {
    const { bar } = room.ui;
    const other = 1 - room.viewer;
    bar.replaceChildren(
      counterChip(state, ctx, other),
      counterChip(state, ctx, room.viewer),
      h(
        "div",
        { class: "game-actions" },
        h("span", { class: "turn-label" }, `Turn ${state.turn}`),
        h("button", { type: "button", class: "primary", onclick: () => act({ kind: "endturn" }) }, "End turn"),
        h("button", { type: "button", onclick: () => act({ kind: "draw", n: 1 }) }, "Draw"),
        h("button", { type: "button", onclick: () => confirm("Shuffle everything back and draw a new hand?") && act({ kind: "redeal" }) }, "New hand"),
        h("button", { type: "button", onclick: () => act({ kind: "coin" }) }, "Coin"),
        h(
          "button",
          {
            type: "button",
            onclick: () => {
              const sides = Number(prompt("How many sides?", "6"));
              if (Number.isInteger(sides) && sides >= 2) act({ kind: "die", sides });
            },
          },
          "Die",
        ),
        practice ? h("button", { type: "button", onclick: () => ((room.viewer = 1 - room.viewer), render()) }, "Switch side") : null,
        h("button", { type: "button", onclick: () => confirm("Restart the game? Cards go back to the decks.") && act({ kind: "restart" }) }, "Restart"),
      ),
    );
  }

  function renderLog(state) {
    const { logEl } = room.ui;
    logEl.replaceChildren(
      ...state.log.slice(-LOG_SHOWN).map((entry) => h("li", { class: entry.by === room.viewer ? "mine" : "theirs" }, entry.text)),
    );
    logEl.scrollTop = logEl.scrollHeight;
  }

  /* ---- menus ---- */

  function describe(key) {
    const ctx = ctxOf();
    const state = stateOf();
    const { side, zoneId } = parseKey(key);
    return { ctx, state, side, zone: ctx.board.zones.find((z) => z.id === zoneId), cards: state.zones[key] ?? [] };
  }

  function moveItems(currentKey, uid) {
    const ctx = ctxOf();
    const b = ctx.board;
    const items = [{ separator: true }, { heading: "Move to" }];
    const to = (key, where = "top") => () => act({ kind: "move", uid, to: key, where });
    const role = (r) => zoneKey(room.viewer, roleZone(b, r).id);
    const push = (label, key, where) => key !== currentKey && items.push({ label, onClick: to(key, where) });
    push("Top of the deck", role("deck"), "top");
    items.push({ label: "Bottom of the deck", onClick: to(role("deck"), "bottom"), disabled: currentKey === role("deck") });
    push("Hand", role("hand"));
    push("Discard", role("discard"));
    for (const zone of b.zones.filter((z) => !z.role)) {
      push(zone.name, zone.area === "shared" ? zoneKey("shared", zone.id) : zoneKey(room.viewer, zone.id));
    }
    return items;
  }

  function openCardMenu(uid, key, rect) {
    const state = stateOf();
    const entry = state?.zones[key]?.find((c) => c.uid === uid);
    if (!entry) return;
    const { ctx, side, zone, cards } = describe(key);
    const vis = cardView(ctx.board, room.viewer, key, entry);
    const name = vis === "down" ? "Face-down card" : ctx.cardName(entry.cardId) ?? "Card";
    const mine = side === room.viewer || side === "shared";
    const items = [{ heading: name }];
    if (!mine && zone.visibility !== "public") {
      items.push({ heading: "That card is not yours to move." });
      return showMenu(rect, items);
    }
    const privateOwn = side === room.viewer && zone.visibility === "private";
    items.push({
      label: privateOwn ? (entry.faceUp ? "Hide from opponent" : "Reveal to opponent") : entry.faceUp ? "Turn face down" : "Turn face up",
      onClick: () => act({ kind: "flip", uid }),
    });
    items.push({ label: entry.rot ? "Straighten" : "Turn sideways", onClick: () => act({ kind: "rotate", uid }) });
    const stacked = entry.under || cards.some((c) => c.under === uid);
    if (stacked) items.push({ label: entry.under ? "Take out of the stack" : "Unstack all", onClick: () => act({ kind: "unstack", uid }) });
    items.push(...moveItems(key, uid));
    // a pile shows only its top card, so its zone actions (search, shuffle, draw...) are offered from the card too
    if (zone.layout === "pile") {
      const more = zoneItems(key);
      if (more.length) items.push({ separator: true }, { heading: zone.name }, ...more);
    }
    showMenu(rect, items);
  }

  // What can be done to a whole zone: draw, search, look at the top, shuffle, move everything.
  function zoneItems(key) {
    const { ctx, side, zone, cards } = describe(key);
    const mine = side === room.viewer || side === "shared";
    const canSee = mine || zone.visibility === "public";
    const b = ctx.board;
    const items = [];
    if (zone.role === "deck" && side === room.viewer) {
      items.push({ label: "Draw 1", onClick: () => act({ kind: "draw", n: 1 }) });
      items.push({
        label: "Draw several…",
        onClick: () => {
          const n = Number(prompt("How many cards?", "3"));
          if (Number.isInteger(n) && n > 0) act({ kind: "draw", n });
        },
      });
    }
    if (canSee && cards.length) {
      items.push({ label: "Search / browse all cards", onClick: () => openBrowse(key) });
      if (cards.length > 1) {
        items.push({
          label: "Look at the top…",
          onClick: () => {
            const n = Number(prompt("How many cards from the top?", "3"));
            if (Number.isInteger(n) && n > 0) openBrowse(key, n);
          },
        });
      }
    }
    if (mine && cards.length > 1) items.push({ label: "Shuffle", onClick: () => act({ kind: "shuffle", key }) });
    if (mine && cards.length) {
      const dest = (label, toKey, shuffle) => toKey !== key && items.push({ label, onClick: () => act({ kind: "moveAll", from: key, to: toKey, shuffle }) });
      items.push({ separator: true }, { heading: "Move all cards to" });
      dest("Deck (shuffled)", zoneKey(room.viewer, roleZone(b, "deck").id), true);
      dest("Hand", zoneKey(room.viewer, roleZone(b, "hand").id), false);
      dest("Discard", zoneKey(room.viewer, roleZone(b, "discard").id), false);
    }
    return items;
  }

  function openZoneMenu(key, rect) {
    const { state, zone, cards } = describe(key);
    if (!state || state.phase !== "playing") return;
    const items = [{ heading: `${zone.name} (${cards.length})` }, ...zoneItems(key)];
    if (items.length === 1) items.push({ heading: zone.visibility === "public" ? "Empty" : "Hidden from you" });
    showMenu(rect, items);
  }

  /* ---- browsing a zone ---- */

  function openBrowse(key, limit = null) {
    room.browseKey = key;
    room.browseLimit = limit;
    renderBrowse();
  }

  function renderBrowse() {
    const { browse } = room.ui;
    if (!browse) return;
    const state = stateOf();
    const ctx = ctxOf();
    if (!room.browseKey || !state || !(room.browseKey in state.zones)) {
      room.browseKey = null;
      browse.hidden = true;
      return;
    }
    const key = room.browseKey;
    const { side, zone, cards } = describe(key);
    const shown = room.browseLimit ? cards.slice(-room.browseLimit) : cards;
    const grid = h("div", { class: "browse-grid" });
    [...shown].reverse().forEach((entry) => {
      const vis = side === room.viewer ? "up" : cardView(ctx.board, room.viewer, key, entry);
      const node = buildCardNode({ ctx, templates }, entry, vis, BROWSE_WIDTH, Math.round(BROWSE_WIDTH * 1.4));
      node.dataset.key = key;
      node.addEventListener("click", () => openCardMenu(entry.uid, key, node.getBoundingClientRect()));
      node.addEventListener("pointerover", () => vis !== "down" && showPreview(entry.cardId));
      grid.append(node);
    });
    browse.replaceChildren(
      h(
        "div",
        { class: "browse-panel" },
        h("div", { class: "browse-head" }, h("strong", {}, room.browseLimit ? `${zone.name}: top ${shown.length} of ${cards.length}` : `${zone.name} (${cards.length}) - top first`), h("button", { type: "button", onclick: () => ((room.browseKey = null), (room.browseLimit = null), renderBrowse()) }, "Close")),
        cards.length ? grid : h("p", { class: "hint" }, "No cards here."),
      ),
    );
    browse.hidden = false;
  }

  /* ---- drawing everything ---- */

  function render() {
    if (room.closed) return;
    const state = stateOf();
    const ctx = ctxOf();
    const phase = !state || !ctx ? "connect" : state.phase;
    const connected = room.link?.getStatus() === "connected";
    titleEl.textContent = practice
      ? `Practice: ${board.name}`
      : mode === "host"
        ? `Hosting: ${board.name}`
        : ctx
          ? `Playing: ${ctx.board.name}`
          : "Join a game";
    if (phase === "connect" || (phase === "setup" && !practice && !connected)) {
      if (room.shownPhase !== "connect") {
        room.shownPhase = "connect";
        showConnect();
      }
      return;
    }
    if (room.shownPhase !== phase) {
      if (room.shownPhase === "playing") room.gameView?.destroy();
      room.shownPhase = phase;
      closeMenu();
      if (phase === "playing") showGame();
    }
    if (phase === "setup") return showSetup();
    renderBar(state, ctx);
    renderLog(state);
    room.gameView.update({ state, ctx, viewer: room.viewer, selectedUid: null });
    renderBrowse();
    if (room.link && ["disconnected", "failed"].includes(room.link.getStatus())) setMessage("Your opponent is no longer connected.", "error");
  }

  root.replaceChildren(section);
  if (practice) startPractice();
  else if (mode === "host") await startHost();
  else startJoin();
}
