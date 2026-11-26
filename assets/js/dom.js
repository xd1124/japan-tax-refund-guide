// Dynamic content is text, never executable HTML. Links use HTTP(S) only.
export function element(document, tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function externalLink(document, label, url, className = "") {
  const link = element(document, "a", className, label);
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return link;
    link.href = parsed.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } catch {
    /* Invalid sources remain plain text, without an executable URL. */
  }
  return link;
}

export function animatePanel(panel) {
  panel.classList.remove("change");
  void panel.offsetWidth;
  panel.classList.add("change");
}
