/**
 * localStorage that can't throw. In private browsing or with site data
 * blocked, the accessors themselves raise, which would stop the app starting.
 */
export function readStored(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* the preference just won't persist */
  }
}
