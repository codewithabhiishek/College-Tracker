import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeUserId,
  getScopedStorageKey,
  getUserPreference,
  setUserPreference,
  removeUserPreference,
  createScopedStorage,
  BASE_STORAGE_KEY,
} from '../src/lib/storageService.js';

describe('storageService unit tests', () => {
  const originalLocalStorage = global.localStorage;
  let mockStore = new Map();

  beforeEach(() => {
    mockStore.clear();
    global.localStorage = {
      getItem: (k) => mockStore.get(k) ?? null,
      setItem: (k, v) => mockStore.set(k, String(v)),
      removeItem: (k) => mockStore.delete(k),
      clear: () => mockStore.clear(),
      get length() {
        return mockStore.size;
      },
      key: (i) => Array.from(mockStore.keys())[i] ?? null,
    };
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
  });

  describe('sanitizeUserId', () => {
    test('returns "anonymous" for invalid or missing user IDs', () => {
      assert.equal(sanitizeUserId(null), 'anonymous');
      assert.equal(sanitizeUserId(undefined), 'anonymous');
      assert.equal(sanitizeUserId(''), 'anonymous');
      assert.equal(sanitizeUserId('   '), 'anonymous');
      assert.equal(sanitizeUserId(42), 'anonymous');
    });

    test('sanitizes special characters to underscores', () => {
      assert.equal(sanitizeUserId('user_clerk_123'), 'user_clerk_123');
      assert.equal(sanitizeUserId('user@domain.com!'), 'user_domain_com_');
    });

    test('truncates IDs longer than 64 characters', () => {
      const longId = 'u'.repeat(100);
      assert.equal(sanitizeUserId(longId).length, 64);
    });
  });

  describe('getScopedStorageKey', () => {
    test('scopes keys uniquely by user ID', () => {
      const keyAlice = getScopedStorageKey('preferred_view', 'usr_alice');
      const keyBob = getScopedStorageKey('preferred_view', 'usr_bob');
      const keyAnon = getScopedStorageKey('preferred_view', null);

      assert.equal(keyAlice, `${BASE_STORAGE_KEY}.preferred_view.usr_alice`);
      assert.equal(keyBob, `${BASE_STORAGE_KEY}.preferred_view.usr_bob`);
      assert.equal(keyAnon, `${BASE_STORAGE_KEY}.preferred_view.anonymous`);
      assert.notEqual(keyAlice, keyBob);
    });
  });

  describe('getUserPreference / setUserPreference / removeUserPreference', () => {
    test('persists and retrieves JSON values per user', () => {
      setUserPreference('preferred_view', 'usr_alice', 'kanban');
      setUserPreference('preferred_view', 'usr_bob', 'calendar');

      assert.equal(getUserPreference('preferred_view', 'usr_alice', 'table'), 'kanban');
      assert.equal(getUserPreference('preferred_view', 'usr_bob', 'table'), 'calendar');
      assert.equal(getUserPreference('preferred_view', 'usr_charlie', 'table'), 'table');
    });

    test('removeUserPreference clears targeted key only', () => {
      setUserPreference('test_key', 'usr_alice', { active: true });
      setUserPreference('test_key', 'usr_bob', { active: false });

      removeUserPreference('test_key', 'usr_alice');

      assert.equal(getUserPreference('test_key', 'usr_alice', null), null);
      assert.deepEqual(getUserPreference('test_key', 'usr_bob', null), { active: false });
    });
  });

  describe('createScopedStorage adapter', () => {
    test('provides clean user-scoped CRUD methods', () => {
      const storageA = createScopedStorage('usr_student_a');
      const storageB = createScopedStorage('usr_student_b');

      storageA.setItem('active_tab', 'calendar');
      storageB.setItem('active_tab', 'table');

      assert.equal(storageA.getItem('active_tab'), 'calendar');
      assert.equal(storageB.getItem('active_tab'), 'table');

      storageA.removeItem('active_tab');
      assert.equal(storageA.getItem('active_tab'), null);
      assert.equal(storageB.getItem('active_tab'), 'table');
    });

    test('clearUserData purges all entries for the user', () => {
      const storageA = createScopedStorage('usr_student_a');
      const storageB = createScopedStorage('usr_student_b');

      storageA.setItem('pref1', 'val1');
      storageA.setItem('pref2', 'val2');
      storageB.setItem('pref1', 'valB');

      const cleared = storageA.clearUserData();
      assert.equal(cleared, 2);

      assert.equal(storageA.getItem('pref1'), null);
      assert.equal(storageA.getItem('pref2'), null);
      assert.equal(storageB.getItem('pref1'), 'valB');
    });

    test('handles SSR gracefully when localStorage is undefined', () => {
      delete global.localStorage;
      const storage = createScopedStorage('ssr_user');

      assert.doesNotThrow(() => {
        assert.equal(storage.getItem('pref', 'default'), 'default');
        storage.setItem('pref', 'value');
        storage.removeItem('pref');
        assert.equal(storage.clearUserData(), 0);
      });
    });
  });
});
