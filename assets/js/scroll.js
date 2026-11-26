export function initScrollControls(document, window) {
  const top = document.getElementById("scroll-top"),
    bottom = document.getElementById("scroll-bottom");
  function update() {
    const remaining =
      document.documentElement.scrollHeight -
      window.innerHeight -
      window.scrollY;
    top.disabled = window.scrollY <= 8;
    bottom.disabled = remaining <= 8;
    const focused = document.activeElement;
    const editing =
      focused &&
      focused.matches('input,textarea,select,[contenteditable="true"]');
    top.parentElement.hidden = editing || (top.disabled && bottom.disabled);
  }
  function move(toBottom) {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: toBottom ? document.documentElement.scrollHeight : 0,
      behavior: reduce ? "instant" : "smooth",
    });
  }
  top.addEventListener("click", () => move(false));
  bottom.addEventListener("click", () => move(true));
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  document.addEventListener("focusin", update);
  document.addEventListener("focusout", () =>
    window.requestAnimationFrame(update),
  );
  if (typeof window.ResizeObserver !== "undefined")
    new window.ResizeObserver(update).observe(document.body);
  if (typeof window.MutationObserver !== "undefined")
    new window.MutationObserver(() =>
      window.requestAnimationFrame(update),
    ).observe(document.querySelector("main"), {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  update();
}
