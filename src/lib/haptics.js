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

export const triggerHaptic = (pattern) => {
  if (!isHapticsSupported()) return false;
  try {
    return window.navigator.vibrate(pattern);
  } catch {
    return false;
  }
};

export const hapticPatterns = {
  tap: 8,
  light: 12,
  medium: 24,
  select: 10,
  statusChange: [18, 40, 22],
  success: [15, 60, 25],
  delete: [25, 50, 35],
  error: [30, 60, 40, 60, 50],
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
  delete: () => triggerHaptic(hapticPatterns.delete),
  error: () => triggerHaptic(hapticPatterns.error),
};

export default haptics;
