// The link between the two players' browsers: one ordered, reliable data channel made with the browser's built-in
// peer-to-peer support (WebRTC), set up by exchanging two codes by hand. No server of this project takes part; a
// public STUN address only helps the browsers find a path to each other.
//
//   const link = createLink({ onStatus(status, detail), onMessage(message) })
//   link.createOffer()      -> Promise<string>   the invitation code (creator)
//   link.acceptOffer(text)  -> Promise<string>   the reply code (joiner)
//   link.acceptAnswer(text) -> Promise<void>     the reply pasted by the creator
//   link.send(message) -> boolean, link.close()
//
// Statuses: "gathering" | "waiting-reply" | "connecting" | "connected" | "disconnected" | "failed".
// Big messages (a whole game pack) are sent in chunks.

const STUN_URL = "stun:stun.l.google.com:19302";
const CONNECT_TIMEOUT_MS = 30000;
const ICE_GATHER_TIMEOUT_MS = 4000;
const PING_MS = 3000;
const SILENCE_MS = 12000;
const CHUNK_SIZE = 12000;
const MESSAGE_MAX = 4000000;
const ALLOWED = ["hello", "snapshot", "intent", "event", "resync", "refused"];
const CODE_PREFIX = "TCG1.";
const CODE_PATTERN = /TCG1\.[A-Za-z0-9_-]+/;
const CODE_MAX = 20000;

function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text) {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  return new TextDecoder().decode(Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)));
}

export function encodeCode(kind, sdp) {
  return CODE_PREFIX + toBase64Url(JSON.stringify({ v: 1, k: kind, s: sdp }));
}

export function decodeCode(text) {
  const found = CODE_PATTERN.exec(String(text ?? ""));
  if (!found) return { ok: false, reason: "That is not a connection code. Paste the whole code you received." };
  if (found[0].length > CODE_MAX) return { ok: false, reason: "That code is too long to be valid." };
  let data;
  try {
    data = JSON.parse(fromBase64Url(found[0].slice(CODE_PREFIX.length)));
  } catch {
    return { ok: false, reason: "That code is damaged. Copy it again and paste the whole thing." };
  }
  if (!data || data.v !== 1 || !["offer", "answer"].includes(data.k) || typeof data.s !== "string" || !data.s) {
    return { ok: false, reason: "That code is damaged. Copy it again and paste the whole thing." };
  }
  return { ok: true, kind: data.k, sdp: data.s };
}

function waitForGathering(pc) {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === "complete") return resolve();
    const done = () => {
      clearTimeout(timer);
      pc.removeEventListener("icegatheringstatechange", onChange);
      resolve();
    };
    const onChange = () => pc.iceGatheringState === "complete" && done();
    const timer = setTimeout(done, ICE_GATHER_TIMEOUT_MS);
    pc.addEventListener("icegatheringstatechange", onChange);
  });
}

export function createLink({ onStatus = () => {}, onMessage = () => {} }) {
  let pc = null;
  let channel = null;
  let status = "idle";
  let connectTimer = null;
  let pingTimer = null;
  let lastHeard = 0;
  let wasConnected = false;
  let chunkId = 0;
  const partial = new Map();

  const setStatus = (next, detail) => {
    status = next;
    onStatus(next, detail);
  };

  function stopTimers() {
    clearTimeout(connectTimer);
    clearInterval(pingTimer);
  }

  function fail(detail) {
    stopTimers();
    if (status !== "failed" && status !== "disconnected") setStatus(wasConnected ? "disconnected" : "failed", detail);
  }

  function raw(text) {
    if (!channel || channel.readyState !== "open") return false;
    channel.send(text);
    return true;
  }

  function send(message) {
    const text = JSON.stringify(message);
    if (text.length <= CHUNK_SIZE) return raw(text);
    const id = ++chunkId;
    const total = Math.ceil(text.length / CHUNK_SIZE);
    for (let i = 0; i < total; i++) {
      const piece = { chunk: id, i, n: total, d: text.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE) };
      if (!raw(JSON.stringify(piece))) return false;
    }
    return true;
  }

  function deliver(text) {
    let message;
    try {
      message = JSON.parse(text);
    } catch {
      return;
    }
    if (!message || typeof message !== "object") return;
    if (message.type === "ping") {
      raw(JSON.stringify({ type: "pong" }));
      return;
    }
    if (message.type === "pong") return;
    if (ALLOWED.includes(message.type)) onMessage(message);
  }

  function wire(ch) {
    channel = ch;
    ch.onopen = () => {
      clearTimeout(connectTimer);
      wasConnected = true;
      setStatus("connected");
      lastHeard = Date.now();
      pingTimer = setInterval(() => {
        if (Date.now() - lastHeard > SILENCE_MS) {
          fail("The other player stopped answering.");
          pc?.close();
        } else raw(JSON.stringify({ type: "ping" }));
      }, PING_MS);
    };
    ch.onclose = () => status === "connected" && fail("The other player left or the connection was lost.");
    ch.onmessage = (event) => {
      lastHeard = Date.now();
      if (typeof event.data !== "string" || event.data.length > MESSAGE_MAX) return;
      let parsed;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        return;
      }
      if (parsed && typeof parsed.chunk === "number") {
        const entry = partial.get(parsed.chunk) ?? { parts: [], got: 0 };
        if (entry.parts[parsed.i] === undefined) entry.got += 1;
        entry.parts[parsed.i] = parsed.d;
        partial.set(parsed.chunk, entry);
        if (entry.got === parsed.n) {
          partial.delete(parsed.chunk);
          deliver(entry.parts.join(""));
        }
      } else deliver(event.data);
    };
  }

  function open() {
    pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_URL }] });
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") fail("The connection failed. Some networks block direct connections between players.");
      else if (pc.connectionState === "disconnected" && status === "connected") fail("The connection was lost.");
    };
  }

  function startConnectTimer() {
    clearTimeout(connectTimer);
    connectTimer = setTimeout(() => {
      if (status === "connecting") {
        fail("The connection could not be made in time. Some networks block direct connections between players.");
        pc?.close();
      }
    }, CONNECT_TIMEOUT_MS);
  }

  return {
    send,
    getStatus: () => status,
    async createOffer() {
      open();
      wire(pc.createDataChannel("game", { ordered: true }));
      setStatus("gathering");
      await pc.setLocalDescription(await pc.createOffer());
      await waitForGathering(pc);
      setStatus("waiting-reply");
      return encodeCode("offer", pc.localDescription.sdp);
    },
    async acceptOffer(text) {
      const decoded = decodeCode(text);
      if (!decoded.ok) throw new Error(decoded.reason);
      if (decoded.kind !== "offer") throw new Error("That is a reply code. Paste the invitation code the room creator sent you.");
      open();
      pc.ondatachannel = (event) => wire(event.channel);
      setStatus("gathering");
      await pc.setRemoteDescription({ type: "offer", sdp: decoded.sdp });
      await pc.setLocalDescription(await pc.createAnswer());
      await waitForGathering(pc);
      setStatus("connecting");
      startConnectTimer();
      return encodeCode("answer", pc.localDescription.sdp);
    },
    async acceptAnswer(text) {
      if (status !== "waiting-reply") throw new Error("This room is not waiting for a reply.");
      const decoded = decodeCode(text);
      if (!decoded.ok) throw new Error(decoded.reason);
      if (decoded.kind !== "answer") throw new Error("That is an invitation code. Paste the reply code your friend sent back.");
      await pc.setRemoteDescription({ type: "answer", sdp: decoded.sdp });
      setStatus("connecting");
      startConnectTimer();
    },
    close() {
      stopTimers();
      wasConnected = false;
      if (channel) channel.onclose = null;
      pc?.close();
      pc = null;
      channel = null;
      status = "idle";
    },
  };
}
