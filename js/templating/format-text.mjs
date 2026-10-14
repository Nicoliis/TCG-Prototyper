const ESCAPABLE = new Set(["*", "_"]);

const SIGNATURE_BY_KINDS = (kinds) => kinds.join("+");

function isVisible(char) {
  return char !== undefined && !/\s/.test(char);
}

function tokenize(source) {
  const items = [];
  let text = "";
  const flushText = () => {
    if (text) items.push({ type: "text", value: text });
    text = "";
  };

  let i = 0;
  while (i < source.length) {
    const char = source[i];
    if (char === "\\" && ESCAPABLE.has(source[i + 1])) {
      text += source[i + 1];
      i += 2;
      continue;
    }
    if (char === "*" || char === "_") {
      let end = i;
      while (source[end] === char) end++;
      const length = end - i;
      const kinds = markerKinds(char, length);
      if (!kinds) {
        text += source.slice(i, end);
      } else {
        flushText();
        items.push({
          type: "marker",
          kinds,
          raw: source.slice(i, end),
          canOpen: isVisible(source[end]),
          canClose: isVisible(source[i - 1]),
        });
      }
      i = end;
      continue;
    }
    text += char;
    i++;
  }
  flushText();
  return items;
}

function markerKinds(char, length) {
  if (char === "*") return { 1: ["italic"], 2: ["bold"], 3: ["bold", "italic"] }[length] ?? null;
  return length === 2 ? ["underline"] : null;
}

function findOpener(stack, kinds) {
  const signature = SIGNATURE_BY_KINDS(kinds);
  for (let index = stack.length - 1; index >= 0; index--) {
    if (SIGNATURE_BY_KINDS(stack[index].kinds) === signature) return index;
  }
  return -1;
}

function tripleCloserIndex(stack) {
  const top = stack.slice(-2).map((entry) => entry.kinds.join());
  const isPair = top.length === 2 && top.includes("bold") && top.includes("italic");
  return isPair ? stack.length - 2 : -1;
}

function resolve(items) {
  const output = [];
  const stack = [];

  for (const item of items) {
    if (item.type === "text") {
      output.push(item);
      continue;
    }
    let openerIndex = -1;
    let matchedCount = 1;
    if (item.canClose) {
      openerIndex = findOpener(stack, item.kinds);
      if (openerIndex === -1 && item.kinds.length === 2) {
        openerIndex = tripleCloserIndex(stack);
        matchedCount = 2;
      }
    }
    if (openerIndex !== -1) {
      const closed = stack.splice(openerIndex);
      closed.forEach((entry, index) => {
        entry.matched = index < matchedCount;
        output.push({ type: "close", entry });
      });
    } else if (item.canOpen) {
      const entry = { kinds: item.kinds, raw: item.raw, matched: false };
      stack.push(entry);
      output.push({ type: "open", entry });
    } else {
      output.push({ type: "text", value: item.raw });
    }
  }
  return output;
}

export function parseFormatted(text) {
  const output = resolve(tokenize(String(text ?? "")));
  const active = { bold: 0, italic: 0, underline: 0 };
  const segments = [];

  const push = (value) => {
    if (!value) return;
    const style = { bold: active.bold > 0, italic: active.italic > 0, underline: active.underline > 0 };
    const last = segments[segments.length - 1];
    if (last && last.bold === style.bold && last.italic === style.italic && last.underline === style.underline) {
      last.text += value;
    } else {
      segments.push({ text: value, ...style });
    }
  };

  for (const item of output) {
    if (item.type === "text") push(item.value);
    else if (item.type === "open") {
      if (item.entry.matched) for (const kind of item.entry.kinds) active[kind]++;
      else push(item.entry.raw);
    } else if (item.entry.matched) {
      for (const kind of item.entry.kinds) active[kind]--;
    }
  }
  return segments;
}
