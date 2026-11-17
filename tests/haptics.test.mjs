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
  assert.ok(Array.isArray(hapticPatterns.correct));
  assert.ok(Array.isArray(hapticPatterns.wrong));
  assert.ok(Array.isArray(hapticPatterns.streak));
  assert.ok(Array.isArray(hapticPatterns.complete));
  assert.ok(Array.isArray(hapticPatterns.save));
  assert.ok(Array.isArray(hapticPatterns.delete));
  assert.ok(Array.isArray(hapticPatterns.error));

  assert.ok(hapticPatterns.tap > 0);
  assert.ok(hapticPatterns.success.length > 0);
  assert.ok(hapticPatterns.complete.length > 0);
});

test('isHapticsSupported handles missing window or navigator safely in node environment', () => {
  assert.equal(isHapticsSupported(), false);
  assert.equal(triggerHaptic(10), false);
  assert.equal(triggerHaptic('success'), false);
  assert.equal(haptics.tap(), false);
  assert.equal(haptics.success(), false);
  assert.equal(haptics.correct(), false);
  assert.equal(haptics.wrong(), false);
  assert.equal(haptics.streak(), false);
  assert.equal(haptics.complete(), false);
  assert.equal(haptics.save(), false);
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

  global.window = { navigator: mockNavigator };

  try {
    assert.equal(isHapticsSupported(), true);
    const result = triggerHaptic(15);
    assert.equal(result, true);
    assert.equal(vibrateCalledWith, 15);

    // Named pattern string lookup
    triggerHaptic('success');
    assert.deepEqual(vibrateCalledWith, hapticPatterns.success);

    triggerHaptic('statusChange');
    assert.deepEqual(vibrateCalledWith, hapticPatterns.statusChange);

    triggerHaptic('complete');
    assert.deepEqual(vibrateCalledWith, hapticPatterns.complete);

    // Default duration when called with no arguments
    triggerHaptic();
    assert.equal(vibrateCalledWith, 15);

    haptics.success();
    assert.deepEqual(vibrateCalledWith, hapticPatterns.success);

    haptics.correct();
    assert.deepEqual(vibrateCalledWith, hapticPatterns.correct);

    haptics.wrong();
    assert.deepEqual(vibrateCalledWith, hapticPatterns.wrong);

    haptics.streak();
    assert.deepEqual(vibrateCalledWith, hapticPatterns.streak);

    haptics.complete();
    assert.deepEqual(vibrateCalledWith, hapticPatterns.complete);

    haptics.save();
    assert.deepEqual(vibrateCalledWith, hapticPatterns.save);

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
