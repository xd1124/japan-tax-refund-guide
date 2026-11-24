import fs from "node:fs";
import { parseHTML } from "linkedom";
import { initApp } from "../assets/js/app.js";

export const html = fs.readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);
export function memoryStorage(values = {}) {
  const data = new Map(Object.entries(values));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}
export function boot({
  storage = memoryStorage(),
  hash = "",
  fetchRate,
  data,
} = {}) {
  const { document, window: domWindow } = parseHTML(html);
  const events = new Map();
  const window = {
    location: { hash },
    localStorage: storage,
    innerHeight: 800,
    scrollY: 0,
    fetch:
      fetchRate ||
      (async () => ({
        ok: true,
        json: async () => ({
          base: "JPY",
          quote: "KRW",
          rate: 8.4386,
          date: "2026-11-23",
        }),
      })),
    requestAnimationFrame: (fn) => fn(),
    scrollTo: (options) => {
      window.lastScroll = options;
    },
    matchMedia: () => ({ matches: false }),
    addEventListener(type, listener) {
      const list = events.get(type) || [];
      list.push(listener);
      events.set(type, list);
    },
    removeEventListener(type, listener) {
      events.set(
        type,
        (events.get(type) || []).filter((fn) => fn !== listener),
      );
    },
    dispatch(type) {
      for (const listener of events.get(type) || []) listener();
    },
  };
  Object.defineProperty(document.getElementById("store-region"), "value", {
    value: "",
    writable: true,
  });
  document.getElementById("fx-input").value = "";
  Object.defineProperty(domWindow.HTMLInputElement.prototype, "checked", {
    configurable: true,
    get() {
      return this.hasAttribute("checked");
    },
    set(value) {
      value
        ? this.setAttribute("checked", "")
        : this.removeAttribute("checked");
    },
  });
  domWindow.HTMLElement.prototype.scrollIntoView = function () {};
  const dialog = document.getElementById("changelog-dialog");
  dialog.showModal = () => {
    dialog.open = true;
  };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent(new domWindow.Event("close"));
  };
  const app = initApp(document, window, data);
  const input = (selector, value, type = "input") => {
    const target = document.querySelector(selector);
    target.value = value;
    target.dispatchEvent(new domWindow.Event(type, { bubbles: true }));
  };
  return {
    document,
    window,
    domWindow,
    app,
    input,
    click: (selector) => document.querySelector(selector).click(),
    storage,
  };
}
