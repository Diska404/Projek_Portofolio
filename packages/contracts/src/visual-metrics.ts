export interface DailyValue {
  date: string;
  value: number | null;
  coverage: "complete" | "partial" | "none";
}
export interface VisualBucket extends DailyValue {
  endDate: string;
}
export interface CompositionValue {
  key: string;
  label: string;
  value: number | null;
}
const DAY = 86400000;
function dateStamp(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Invalid chart date");
  const value = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(value) || new Date(value).toISOString().slice(0, 10) !== date)
    throw new Error("Invalid chart date");
  return value;
}
const dateKey = (value: number) => new Date(value).toISOString().slice(0, 10);
export function jakartaDate(now: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
/** Unknown days remain unknown, including days absent from a provider response. */
export function calendarValues(
  endDate: string,
  days: number,
  observations: readonly DailyValue[],
): DailyValue[] {
  const end = dateStamp(endDate);
  if (!Number.isInteger(days) || days < 1 || days > 366) throw new Error("Invalid chart range");
  const grouped = new Map<string, DailyValue[]>();
  for (const item of observations)
    grouped.set(item.date, [...(grouped.get(item.date) ?? []), item]);
  return Array.from({ length: days }, (_, index) => {
    const date = dateKey(end - (days - index - 1) * DAY);
    const records = grouped.get(date) ?? [];
    const first = records[0];
    const usable =
      first &&
      records.every(
        (item) =>
          item.coverage === "complete" &&
          item.value !== null &&
          Number.isFinite(item.value) &&
          item.value >= 0 &&
          item.value === first.value,
      );
    return {
      date,
      value: usable ? first.value : null,
      coverage: usable
        ? "complete"
        : records.some((item) => item.coverage === "partial")
          ? "partial"
          : "none",
    };
  });
}
export function visualBuckets(
  points: readonly DailyValue[],
  mode: "daily" | "weekly" | "cumulative",
): VisualBucket[] {
  if (mode === "daily") return points.map((item) => ({ ...item, endDate: item.date }));
  if (mode === "cumulative") {
    let total = 0,
      known = true;
    return points.map((item) => {
      if (item.coverage !== "complete" || item.value === null) known = false;
      else total += item.value;
      return {
        date: item.date,
        endDate: item.date,
        value: known ? total : null,
        coverage: known ? "complete" : "none",
      };
    });
  }
  const groups = new Map<string, DailyValue[]>();
  for (const item of points) {
    const stamp = dateStamp(item.date);
    const monday = dateKey(stamp - ((new Date(stamp).getUTCDay() + 6) % 7) * DAY);
    groups.set(monday, [...(groups.get(monday) ?? []), item]);
  }
  return [...groups.values()].map((group) => {
    const first = group[0]!,
      last = group.at(-1)!;
    const known = group.every((item) => item.coverage === "complete" && item.value !== null);
    return {
      date: first.date,
      endDate: last.date,
      value: known ? group.reduce((sum, item) => sum + item.value!, 0) : null,
      coverage: known ? "complete" : "none",
    };
  });
}
export function calendarSummary(points: readonly DailyValue[]) {
  if (!points.length || points.some((item) => item.coverage !== "complete" || item.value === null))
    return { total: null, activeDays: null, longestStreak: null };
  let streak = 0,
    longestStreak = 0;
  for (const item of points) {
    streak = item.value! > 0 ? streak + 1 : 0;
    longestStreak = Math.max(longestStreak, streak);
  }
  return {
    total: points.reduce((sum, item) => sum + item.value!, 0),
    activeDays: points.filter((item) => item.value! > 0).length,
    longestStreak,
  };
}
/** Segments must be an exclusive partition; unknown segments cannot form percentages. */
export function compositionValues(items: readonly CompositionValue[]) {
  if (
    !items.length ||
    new Set(items.map((item) => item.key)).size !== items.length ||
    items.some((item) => item.value === null || !Number.isFinite(item.value) || item.value < 0)
  )
    return {
      total: null,
      segments: items.map((item) => ({ ...item, value: null, percent: null })),
    };
  const total = items.reduce((sum, item) => sum + item.value!, 0);
  return {
    total,
    segments: items.map((item) => ({
      ...item,
      percent: total > 0 ? (item.value! / total) * 100 : null,
    })),
  };
}
