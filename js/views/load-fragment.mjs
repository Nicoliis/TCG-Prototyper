const htmlCache = new Map();

export async function loadFragment(url) {
  if (!htmlCache.has(url)) {
    htmlCache.set(url, fetch(url).then((response) => response.text()));
  }
  const html = await htmlCache.get(url);
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.querySelector("template");
}

export function cloneTemplate(template) {
  return template.content.cloneNode(true);
}
