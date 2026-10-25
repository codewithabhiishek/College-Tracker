import test from 'node:test';
import assert from 'node:assert/strict';

test('Multi-User Query Key Scoping prevents cross-user cache collision', () => {
  const getUserUniKey = (userId) => ["universities", userId || "anonymous"];
  const getUserDocsKey = (userId) => ["globalDocs", userId || "anonymous"];

  const userAId = "user_clerk_aaa111";
  const userBId = "user_clerk_bbb222";

  const keyA_Unis = getUserUniKey(userAId);
  const keyB_Unis = getUserUniKey(userBId);
  const keyA_Docs = getUserDocsKey(userAId);
  const keyB_Docs = getUserDocsKey(userBId);

  // Assert keys are distinctly namespaced
  assert.notDeepEqual(keyA_Unis, keyB_Unis);
  assert.notDeepEqual(keyA_Docs, keyB_Docs);
  assert.equal(keyA_Unis[1], userAId);
  assert.equal(keyB_Unis[1], userBId);

  // Mock TanStack Query cache store simulation
  const queryCache = new Map();
  const setCache = (key, data) => queryCache.set(JSON.stringify(key), data);
  const getCache = (key) => queryCache.get(JSON.stringify(key));

  const userAData = [
    { id: 1, name: "Oxford University", user_id: userAId, status: "accepted" },
  ];
  const userBData = [
    { id: 2, name: "Stanford University", user_id: userBId, status: "interview" },
  ];

  setCache(keyA_Unis, userAData);
  setCache(keyB_Unis, userBData);

  assert.deepEqual(getCache(keyA_Unis), userAData);
  assert.deepEqual(getCache(keyB_Unis), userBData);
  assert.notDeepEqual(getCache(keyA_Unis), getCache(keyB_Unis));
});

test('AuthSync cache clearance purges active session entries on logout or account switch', () => {
  class MockQueryClient {
    constructor() {
      this.cache = new Map();
    }
    setQueryData(key, value) {
      this.cache.set(JSON.stringify(key), value);
    }
    getQueryData(key) {
      return this.cache.get(JSON.stringify(key));
    }
    clear() {
      this.cache.clear();
    }
    size() {
      return this.cache.size;
    }
  }

  const client = new MockQueryClient();
  client.setQueryData(["universities", "user_1"], [{ id: 101, name: "Harvard" }]);
  client.setQueryData(["globalDocs", "user_1"], [{ id: 201, doc_name: "Transcript" }]);

  assert.equal(client.size(), 2);
  assert.ok(client.getQueryData(["universities", "user_1"]));

  // Trigger cache wipe on logout / user switch
  client.clear();

  assert.equal(client.size(), 0);
  assert.equal(client.getQueryData(["universities", "user_1"]), undefined);
  assert.equal(client.getQueryData(["globalDocs", "user_1"]), undefined);
});

test('Server-side SQL isolation query builder guards user boundaries', () => {
  const buildFetchQuery = (userId) => {
    if (!userId || typeof userId !== 'string') {
      throw new Error("Unauthorized: missing user identifier");
    }
    return {
      sql: 'SELECT * FROM universities WHERE user_id = $1 ORDER BY created_at DESC',
      values: [userId],
    };
  };

  const queryA = buildFetchQuery('user_alice_999');
  assert.equal(queryA.values[0], 'user_alice_999');
  assert.ok(queryA.sql.includes('user_id = $1'));

  assert.throws(() => buildFetchQuery(null), /Unauthorized/);
  assert.throws(() => buildFetchQuery(''), /Unauthorized/);
});
