const TOKEN_PATTERN = /\{([^{}]+)\}/g;

export function substitute(template, values) {
  return (template ?? "").replace(TOKEN_PATTERN, (match, token) => {
    const value = values?.[token];
    return value === undefined || value === null ? "" : String(value);
  });
}
