export function parseCsv(text) {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let fieldStarted = false;

  function endField() {
    row.push(field);
    field = "";
    fieldStarted = false;
  }

  function endRow() {
    if (!fieldStarted && row.length === 0) return;
    endField();
    rows.push(row);
    row = [];
  }

  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (inQuotes) {
      if (char !== '"') field += char;
      else if (source[i + 1] === '"') {
        field += '"';
        i++;
      } else inQuotes = false;
    } else if (char === '"') {
      inQuotes = true;
      fieldStarted = true;
    } else if (char === ",") {
      endField();
      fieldStarted = true;
    } else if (char === "\r" || char === "\n") {
      if (char === "\r" && source[i + 1] === "\n") i++;
      endRow();
    } else {
      field += char;
      fieldStarted = true;
    }
  }
  endRow();
  return rows;
}
