import { stores } from "../../data/stores.js?v=1dc4618cbf6a";
import { providers } from "../../data/providers.js?v=1dc4618cbf6a";
import { guideContent } from "../../data/guides.js?v=1dc4618cbf6a";
import { checklistItems } from "../../data/checklist.js?v=1dc4618cbf6a";
import { changelogEntries } from "../../data/changelog.js?v=1dc4618cbf6a";
import { initNavigation } from "./navigation.js?v=1dc4618cbf6a";
import { initProviders } from "./providers.js?v=1dc4618cbf6a";
import { initGuides } from "./guides.js?v=1dc4618cbf6a";
import { initChecklist } from "./checklist.js?v=1dc4618cbf6a";
import { initCalculator } from "./calculator.js?v=1dc4618cbf6a";
import { initStoreFinder } from "./stores.js?v=1dc4618cbf6a";
import { initScrollControls } from "./scroll.js?v=1dc4618cbf6a";
import { initChangelog } from "./changelog.js?v=1dc4618cbf6a";

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
  const navigation = initNavigation(document, window, (page) => {
    if (page === "summary") calculator.refresh();
  });
  const providerData = data.providers || providers;
  const providerView = initProviders(document, providerData);
  initGuides(document, data.guideContent || guideContent);
  initChecklist(document, storage, data.checklistItems || checklistItems);
  initStoreFinder(
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
