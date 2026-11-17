/**
 * Tactile mobile haptic feedback engine for College Tracker.
 * Safely guards against non-supporting browsers and SSR environments.
 */

export const isHapticsSupported = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.navigator !== 'undefined' &&
    typeof window.navigator.vibrate === 'function'
  );
};

export const hapticPatterns = {
  tap: 8,
  light: 12,
  medium: 24,
  select: 10,
  statusChange: [18, 40, 22],
  success: [15, 60, 25],
  correct: [15, 60, 25],
  wrong: [18, 40, 22],
  streak: [15, 60, 25],
  complete: [25, 20, 25, 20, 40],
  save: [15, 60, 25],
  delete: [25, 50, 35],
  error: [30, 60, 40, 60, 50],
};

/**
 * Trigger a tactile vibration pattern. Accepts a named string key, duration number, or vibration pattern array.
 * @param {keyof typeof hapticPatterns | number | number[]} [pattern=15]
 * @returns {boolean}
 */
export const triggerHaptic = (pattern = 15) => {
  if (!isHapticsSupported()) return false;
  try {
    const resolvedPattern =
      typeof pattern === 'string'
        ? hapticPatterns[pattern] || 15
        : pattern;
    return window.navigator.vibrate(resolvedPattern);
  } catch {
    return false;
  }
};

export const haptics = {
  isSupported: isHapticsSupported,
  trigger: triggerHaptic,
  tap: () => triggerHaptic(hapticPatterns.tap),
  light: () => triggerHaptic(hapticPatterns.light),
  medium: () => triggerHaptic(hapticPatterns.medium),
  select: () => triggerHaptic(hapticPatterns.select),
  statusChange: () => triggerHaptic(hapticPatterns.statusChange),
  success: () => triggerHaptic(hapticPatterns.success),
  correct: () => triggerHaptic(hapticPatterns.correct),
  wrong: () => triggerHaptic(hapticPatterns.wrong),
  streak: () => triggerHaptic(hapticPatterns.streak),
  complete: () => triggerHaptic(hapticPatterns.complete),
  save: () => triggerHaptic(hapticPatterns.save),
  delete: () => triggerHaptic(hapticPatterns.delete),
  error: () => triggerHaptic(hapticPatterns.error),
};

export default haptics;
