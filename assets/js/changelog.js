export function initChangelog(document, changelogEntries) {
  const dialog = document.getElementById("changelog-dialog"),
    open = document.getElementById("changelog-open"),
    list = document.getElementById("changelog-list");
  changelogEntries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "changelog-item";
    const meta = document.createElement("div");
    meta.className = "changelog-meta";
    const time = document.createElement("time");
    time.dateTime = entry.date.replaceAll(".", "-");
    time.textContent = entry.date;
    const version = document.createElement("b");
    version.textContent = entry.version || "버전 미지정";
    meta.append(time, version);
    article.append(meta);
    entry.summary.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      article.append(p);
    });
    list.append(article);
  });
  open.addEventListener("click", () => dialog.showModal());
  document
    .getElementById("changelog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => open.focus());
}
