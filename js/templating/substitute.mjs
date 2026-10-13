const TOKEN_PATTERN = /\{([^{}]+)\}/g;

export function substitute(template, values) {
  return (template ?? "").replace(TOKEN_PATTERN, (match, token) => {
    const value = values?.[token];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function extractTokens(template) {
  const tokens = [];
  for (const match of (template ?? "").matchAll(TOKEN_PATTERN)) {
    if (!tokens.includes(match[1])) tokens.push(match[1]);
  }
  return tokens;
}
