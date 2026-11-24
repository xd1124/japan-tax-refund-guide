import { stores } from "../../data/stores.js?v=e77828885b05";
import { providers } from "../../data/providers.js?v=e77828885b05";
import { guideContent } from "../../data/guides.js?v=e77828885b05";
import { checklistItems } from "../../data/checklist.js?v=e77828885b05";
import { changelogEntries } from "../../data/changelog.js?v=e77828885b05";
import { initNavigation } from "./navigation.js?v=e77828885b05";
import { initProviders } from "./providers.js?v=e77828885b05";
import { initGuides } from "./guides.js?v=e77828885b05";
import { initChecklist } from "./checklist.js?v=e77828885b05";
import { initCalculator } from "./calculator.js?v=e77828885b05";
import { initStoreFinder } from "./stores.js?v=e77828885b05";
import { initScrollControls } from "./scroll.js?v=e77828885b05";
import { initChangelog } from "./changelog.js?v=e77828885b05";

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
    window,
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
