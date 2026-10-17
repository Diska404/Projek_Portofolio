import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calendarValues,
  calendarSummary,
  visualBuckets,
  compositionValues,
  jakartaDate,
  type DailyValue,
} from "../packages/contracts/src/visual-metrics";
const point = (
  date: string,
  value: number | null,
  coverage: DailyValue["coverage"] = "complete",
): DailyValue => ({ date, value, coverage });
test("calendar preserves missing/partial days separately from verified zero", () => {
  const result = calendarValues("2026-10-18", 4, [
    point("2026-10-15", 0),
    point("2026-10-16", 12),
    point("2026-10-17", 8, "partial"),
  ]);
  assert.deepEqual(
    result.map((item) => item.value),
    [0, 12, null, null],
  );
  assert.equal(result[2]?.coverage, "partial");
  assert.deepEqual(calendarSummary(result), { total: null, activeDays: null, longestStreak: null });
});
test("calendar rejects invalid ranges and does not add retries, conflicts or out-of-range records", () => {
  assert.throws(() => calendarValues("2026-02-30", 30, []));
  for (const days of [0, 367, 3.5]) assert.throws(() => calendarValues("2026-10-18", days, []));
  const records = [point("2026-10-18", 5), point("2026-10-18", 5), point("2026-10-19", 100)];
  assert.equal(calendarValues("2026-10-18", 1, records)[0]?.value, 5);
  assert.equal(
    calendarValues("2026-10-18", 1, [...records, point("2026-10-18", 6)])[0]?.value,
    null,
  );
  for (const value of [-1, Infinity, NaN])
    assert.equal(calendarValues("2026-10-18", 1, [point("2026-10-18", value)])[0]?.value, null);
});
test("weekly buckets use Monday boundaries and retain gaps without inventing coverage", () => {
  const records = [point("2026-10-11", 2), point("2026-10-12", 3), point("2026-10-13", 4)];
  const weeks = visualBuckets(records, "weekly");
  assert.deepEqual(
    weeks.map((item) => [item.date, item.endDate, item.value]),
    [
      ["2026-10-11", "2026-10-11", 2],
      ["2026-10-12", "2026-10-13", 7],
    ],
  );
  assert.equal(
    visualBuckets([records[1]!, point("2026-10-13", null, "none")], "weekly")[0]?.value,
    null,
  );
});
test("cumulative values stop being known after a gap; raw totals are not cumulative sums", () => {
  const records = [point("2026-10-16", 2), point("2026-10-17", 0), point("2026-10-18", 3)];
  assert.deepEqual(
    visualBuckets(records, "cumulative").map((item) => item.value),
    [2, 2, 5],
  );
  assert.equal(calendarSummary(records).total, 5);
  assert.deepEqual(
    visualBuckets([records[0]!, point("2026-10-17", null, "none"), records[2]!], "cumulative").map(
      (item) => item.value,
    ),
    [2, null, null],
  );
});
test("verified inactive range has zero activity and streak; streak is bounded by selected range", () => {
  assert.deepEqual(calendarSummary([point("2026-10-17", 0), point("2026-10-18", 0)]), {
    total: 0,
    activeDays: 0,
    longestStreak: 0,
  });
  assert.deepEqual(
    calendarSummary([
      point("2026-10-15", 1),
      point("2026-10-16", 2),
      point("2026-10-17", 0),
      point("2026-10-18", 3),
    ]),
    { total: 6, activeDays: 3, longestStreak: 2 },
  );
});
test("exclusive composition partitions do not count the work-source overlap twice", () => {
  const automatic = 45,
    journal = 30,
    overlap = 30;
  const result = compositionValues([
    { key: "auto", label: "Otomatis saja", value: automatic - overlap },
    { key: "manual", label: "Jurnal saja", value: journal - overlap },
    { key: "overlap", label: "Irisan", value: overlap },
  ]);
  assert.equal(result.total, 45);
  assert.ok(
    Math.abs(result.segments.reduce((sum, item) => sum + (item.percent ?? 0), 0) - 100) < 1e-9,
  );
  assert.equal(compositionValues([{ key: "a", label: "A", value: 0 }]).segments[0]?.percent, null);
  for (const value of [null, -1, NaN, Infinity])
    assert.equal(compositionValues([{ key: "a", label: "A", value }]).total, null);
  assert.equal(
    compositionValues([
      { key: "a", label: "A", value: 1 },
      { key: "a", label: "Duplicate", value: 1 },
    ]).total,
    null,
  );
});
test("chart date reference uses Jakarta rather than the host timezone", () => {
  assert.equal(jakartaDate(new Date("2026-10-17T17:00:00Z")), "2026-10-18");
  assert.equal(jakartaDate(new Date("2026-10-17T16:59:59Z")), "2026-10-17");
});
