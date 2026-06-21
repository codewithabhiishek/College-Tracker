import { differenceInCalendarDays, parseISO } from "date-fns";

/**
 * Returns the number of calendar days remaining until the deadline.
 * Uses differenceInCalendarDays which counts midnight boundaries,
 * giving an exact calendar-day difference with no off-by-one errors.
 * Positive = future, 0 = today, negative = past.
 */
export function daysRemaining(deadlineStr) {
  if (!deadlineStr) return null;
  const deadline = parseISO(deadlineStr);
  const today = new Date();
  return differenceInCalendarDays(deadline, today);
}