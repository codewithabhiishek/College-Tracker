/**
 * storageService.js
 * Multi-user and session scoped storage engine for College Tracker.
 * Manages user UI preferences, filters, and local states with strict user boundary isolation.
 */

export const BASE_STORAGE_KEY = 'college_tracker';

/**
 * Sanitizes a userId string to ensure safe storage keys without injection risk.
 * @param {string|null|undefined} userId
 * @returns {string}
 */
export function sanitizeUserId(userId) {
  if (!userId || typeof userId !== 'string') return 'anonymous';
  const clean = userId.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
  return clean || 'anonymous';
}

/**
 * Returns a storage key strictly scoped to a specific user and preference namespace.
 * @param {string} subKey
 * @param {string|null|undefined} userId
 * @returns {string}
 */
export function getScopedStorageKey(subKey, userId) {
  const safeUser = sanitizeUserId(userId);
  return `${BASE_STORAGE_KEY}.${subKey}.${safeUser}`;
}

/**
 * Safely reads a user-scoped preference from localStorage.
 * @template T
 * @param {string} subKey
 * @param {string|null|undefined} userId
 * @param {T} defaultValue
 * @returns {T}
 */
export function getUserPreference(subKey, userId, defaultValue) {
  if (typeof localStorage === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(getScopedStorageKey(subKey, userId));
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Safely persists a user-scoped preference to localStorage.
 * @param {string} subKey
 * @param {string|null|undefined} userId
 * @param {any} value
 */
export function setUserPreference(subKey, userId, value) {
  if (typeof localStorage === 'undefined') return;
  try {
    const key = getScopedStorageKey(subKey, userId);
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage preference setItem failed:', err);
  }
}

/**
 * Removes a user-scoped preference from localStorage.
 * @param {string} subKey
 * @param {string|null|undefined} userId
 */
export function removeUserPreference(subKey, userId) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(getScopedStorageKey(subKey, userId));
  } catch {
    // ignore
  }
}

/**
 * Creates an isolated localStorage adapter for a specific user.
 * @param {string|null|undefined} userId
 */
export function createScopedStorage(userId) {
  const safeUser = sanitizeUserId(userId);

  return {
    userId: safeUser,
    getItem(subKey, defaultValue = null) {
      return getUserPreference(subKey, safeUser, defaultValue);
    },
    setItem(subKey, value) {
      setUserPreference(subKey, safeUser, value);
    },
    removeItem(subKey) {
      removeUserPreference(subKey, safeUser);
    },
    clearUserData() {
      if (typeof localStorage === 'undefined') return 0;
      try {
        let count = 0;
        const keysToRemove = [];
        const suffix = `.${safeUser}`;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`${BASE_STORAGE_KEY}.`) && key.endsWith(suffix)) {
            keysToRemove.push(key);
          }
        }
        for (const k of keysToRemove) {
          localStorage.removeItem(k);
          count++;
        }
        return count;
      } catch {
        return 0;
      }
    },
  };
}
