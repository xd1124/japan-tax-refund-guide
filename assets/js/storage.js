// Storage can be blocked, full, or contain malformed data. Features still work in memory.
export function readSaved(storage, key, fallback = null) {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeSaved(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* Optional persistence. */
  }
}
export function removeSaved(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    /* Optional persistence. */
  }
}
