import { element } from "./dom.js?v=1dc4618cbf6a";
import { readSaved, writeSaved, removeSaved } from "./storage.js?v=1dc4618cbf6a";
export const CHECKLIST_KEY = "japan-refund-dashboard-checks-v2";

export function initChecklist(document, storage, items) {
  const saved = readSaved(storage, CHECKLIST_KEY, {});
  let checks =
    saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  const list = document.getElementById("checks");
  function render() {
    list.replaceChildren(
      ...items.map((text, index) => {
        const row = element(document, "label", "checkrow");
        const input = element(document, "input");
        input.type = "checkbox";
        input.dataset.check = index;
        input.checked = Boolean(checks[index]);
        row.append(input, element(document, "span", "", text));
        return row;
      }),
    );
    const completed = items.filter((_, index) => checks[index]).length;
    const percentage = items.length ? (completed / items.length) * 100 : 0;
    document.getElementById("counter").textContent =
      `${completed} / ${items.length}`;
    document.getElementById("home-check-count").textContent =
      `${completed} / ${items.length} 완료`;
    for (const id of ["fill", "home-check-fill"])
      document.getElementById(id).style.width = `${percentage}%`;
    const progress = document.getElementById("home-check-progress");
    progress.setAttribute("aria-valuenow", completed);
    progress.setAttribute("aria-valuemax", items.length);
  }
  list.addEventListener("change", (event) => {
    const index = Number(event.target.dataset.check);
    if (!Number.isInteger(index) || index < 0 || index >= items.length) return;
    checks[index] = event.target.checked;
    writeSaved(storage, CHECKLIST_KEY, checks);
    render();
  });
  document.getElementById("reset").addEventListener("click", () => {
    checks = {};
    removeSaved(storage, CHECKLIST_KEY);
    render();
  });
  render();
}
