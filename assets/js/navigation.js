export function initNavigation(document, window, onEnter = () => {}) {
  function navigate(page, updateHash = true) {
    const target = document.getElementById(page);
    if (!target?.classList.contains("page")) return;
    document
      .querySelectorAll(".page")
      .forEach((node) => node.classList.toggle("on", node === target));
    document
      .querySelectorAll(".nav button")
      .forEach((node) =>
        node.classList.toggle("active", node.dataset.route === page),
      );
    if (updateHash) window.location.hash = page === "home" ? "" : page;
    window.scrollTo({ top: 0, behavior: "instant" });
    onEnter(page);
  }
  function fromHash() {
    let page;
    try {
      page = decodeURIComponent(window.location.hash.slice(1)) || "home";
    } catch {
      page = "home";
    }
    if (document.querySelector(".page.on")?.id !== page) navigate(page, false);
  }
  const click = (event) => {
    const button = event.target.closest("[data-route]");
    if (button) navigate(button.dataset.route);
  };
  document.addEventListener("click", click);
  window.addEventListener("hashchange", fromHash);
  return {
    navigate,
    start: fromHash,
    destroy() {
      document.removeEventListener("click", click);
      window.removeEventListener("hashchange", fromHash);
    },
  };
}
