import { element, animatePanel } from "./dom.js?v=e77828885b05";

export function initGuides(document, content) {
  const panel = document.getElementById("beforehome-content");
  const tabs = document.querySelector('[data-tabs="beforehome"]');
  function render(key) {
    if (key === "airport") {
      panel.replaceChildren(
        document
          .getElementById("airport-guide-template")
          .content.cloneNode(true),
      );
    } else {
      const data = content.stages[key];
      if (!data) return;
      const steps = element(document, "div", "steps");
      for (const [title, text] of data.steps) {
        const row = element(document, "div", "step"),
          body = element(document, "div");
        body.append(
          element(document, "b", "", title),
          element(document, "span", "", text),
        );
        row.append(body);
        steps.append(row);
      }
      panel.replaceChildren(
        element(document, "div", "kicker", "SELECTED / " + data.title),
        element(document, "h2", "", data.title),
        element(document, "p", "sub", data.text),
        steps,
      );
    }
    tabs
      .querySelectorAll("button")
      .forEach((button) =>
        button.classList.toggle("active", button.dataset.tab === key),
      );
    animatePanel(panel);
  }
  tabs.addEventListener("click", (event) => {
    const key = event.target.closest("[data-tab]")?.dataset.tab;
    if (key) render(key);
  });
  document
    .getElementById("shopping-stage-tabs")
    .addEventListener("click", (event) => {
      const button = event.target.closest("[data-shopping-stage]");
      if (!button) return;
      const before = button.dataset.shoppingStage === "before";
      document
        .querySelectorAll("#shopping-stage-tabs button")
        .forEach((node) => node.classList.toggle("active", node === button));
      document.getElementById("shopping-before").hidden = !before;
      document.getElementById("shopping-after").hidden = before;
    });
  render("airport");
}
