import { stores } from "../../data/stores.js?v=62079fed8885";
import { providers } from "../../data/providers.js?v=62079fed8885";
import { guideContent } from "../../data/guides.js?v=62079fed8885";
import { checklistItems } from "../../data/checklist.js?v=62079fed8885";
import { changelogEntries } from "../../data/changelog.js?v=62079fed8885";
import { initNavigation } from "./navigation.js?v=62079fed8885";
import { initProviders } from "./providers.js?v=62079fed8885";
import { initGuides } from "./guides.js?v=62079fed8885";
import { initChecklist } from "./checklist.js?v=62079fed8885";
import { initCalculator } from "./calculator.js?v=62079fed8885";
import { initStoreFinder } from "./stores.js?v=62079fed8885";
import { initScrollControls } from "./scroll.js?v=62079fed8885";
import { initChangelog } from "./changelog.js?v=62079fed8885";

const initialized = new WeakMap();
export function initApp(document, window, data = {}) {
  if (initialized.has(document)) return initialized.get(document);
  let storage;
  try {
    storage = window.localStorage;
  } catch {
    /* Privacy settings can block access. */
  }
  const calculator = initCalculator(document, {
    storage,
    fetchRate: (...args) => window.fetch(...args),
  });
  let storeFinder;
  const navigation = initNavigation(document, window, (page) => {
    if (page === "summary") calculator.refresh();
    storeFinder?.enter(page);
  });
  const providerData = data.providers || providers;
  const providerView = initProviders(document, providerData);
  initGuides(document, data.guideContent || guideContent);
  initChecklist(document, storage, data.checklistItems || checklistItems);
  storeFinder = initStoreFinder(
    document,
    data.stores || stores,
    providerData,
    navigation.navigate,
    providerView.select,
  );
  initScrollControls(document, window);
  initChangelog(document, data.changelogEntries || changelogEntries);
  const app = { navigation, calculator };
  initialized.set(document, app);
  navigation.start();
  return app;
}

if (typeof document !== "undefined" && typeof window !== "undefined")
  initApp(document, window);
