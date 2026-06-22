import { differenceInCalendarDays, parseISO, format } from "date-fns";

/**
 * Returns the number of calendar days remaining until the deadline.
 * Uses differenceInCalendarDays which counts midnight boundaries,
 * giving an exact calendar-day difference with no off-by-one errors.
 * Positive = future, 0 = today, negative = past.
 */
export function daysRemaining(deadlineStr) {
  if (!deadlineStr) return null;
  if (deadlineStr.startsWith("9999-12-30") || deadlineStr.startsWith("9999-12-31")) return null;
  const deadline = parseISO(deadlineStr);
  const today = new Date();
  return differenceInCalendarDays(deadline, today);
}

/**
 * Formats the deadline to a human-readable string, taking into account
 * special placeholder dates representing "Not Decided" or "Not Out Yet".
 */
export function formatDeadline(deadlineStr) {
  if (!deadlineStr) return "—";
  if (deadlineStr.startsWith("9999-12-30")) return "Not Decided";
  if (deadlineStr.startsWith("9999-12-31")) return "Not Out Yet";
  return format(parseISO(deadlineStr), "dd MMM yyyy");
}