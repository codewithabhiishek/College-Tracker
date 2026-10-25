import test from 'node:test';
import assert from 'node:assert/strict';
import { haptics, hapticPatterns, isHapticsSupported, triggerHaptic } from '../src/lib/haptics.js';

test('hapticPatterns defines expected vibration timing arrays and numbers', () => {
  assert.equal(typeof hapticPatterns.tap, 'number');
  assert.equal(typeof hapticPatterns.light, 'number');
  assert.equal(typeof hapticPatterns.medium, 'number');
  assert.equal(typeof hapticPatterns.select, 'number');

  assert.ok(Array.isArray(hapticPatterns.statusChange));
  assert.ok(Array.isArray(hapticPatterns.success));
  assert.ok(Array.isArray(hapticPatterns.delete));
  assert.ok(Array.isArray(hapticPatterns.error));

  assert.ok(hapticPatterns.tap > 0);
  assert.ok(hapticPatterns.success.length > 0);
});

test('isHapticsSupported handles missing window or navigator safely in node environment', () => {
  // In Node environment, window is undefined
  assert.equal(isHapticsSupported(), false);
  assert.equal(triggerHaptic(10), false);
  assert.equal(haptics.tap(), false);
  assert.equal(haptics.success(), false);
  assert.equal(haptics.delete(), false);
  assert.equal(haptics.statusChange(), false);
});

test('triggerHaptic invokes navigator.vibrate when available', () => {
  let vibrateCalledWith = null;
  const mockNavigator = {
    vibrate: (pattern) => {
      vibrateCalledWith = pattern;
      return true;
    },
  };

  // Mock global window and navigator
  global.window = { navigator: mockNavigator };

  try {
    assert.equal(isHapticsSupported(), true);
    const result = triggerHaptic(15);
    assert.equal(result, true);
    assert.equal(vibrateCalledWith, 15);

    haptics.success();
    assert.deepEqual(vibrateCalledWith, hapticPatterns.success);

    haptics.delete();
    assert.deepEqual(vibrateCalledWith, hapticPatterns.delete);
  } finally {
    delete global.window;
  }
});

test('triggerHaptic catches and safely recovers if navigator.vibrate throws', () => {
  const mockNavigator = {
    vibrate: () => {
      throw new Error('Permission denied');
    },
  };

  global.window = { navigator: mockNavigator };

  try {
    assert.equal(isHapticsSupported(), true);
    const result = triggerHaptic(10);
    assert.equal(result, false);
  } finally {
    delete global.window;
  }
});
