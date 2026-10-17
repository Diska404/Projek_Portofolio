import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DATA_STATES,
  STATE_COPY,
  metricDisplay,
  reviewEnabled,
  OWNER_DENIAL,
} from "../packages/contracts/src/index";
import { codingDays, contributionDays, sampleSummary } from "../packages/contracts/src/fixtures";
import { readFileSync } from "node:fs";

test("all nine required data states have readable explanations", () => {
  assert.equal(DATA_STATES.length, 9);
  for (const state of DATA_STATES) {
    assert.ok(STATE_COPY[state].label);
    assert.ok(STATE_COPY[state].description.length > 20);
  }
});
test("unconfigured, empty and unavailable metrics never display invented zero", () => {
  for (const state of DATA_STATES.filter((s) => s !== "ready" && s !== "stale")) {
    assert.equal(metricDisplay({ value: null, state, unit: "seconds" }), "—");
    assert.equal(metricDisplay({ value: 0, state, unit: "seconds" }), "—");
  }
});
test("a verified actual zero differs from missing observations", () => {
  assert.equal(metricDisplay({ value: 0, state: "ready", unit: "seconds" }), "0h 0m");
  assert.equal(metricDisplay({ value: null, state: "ready", unit: "seconds" }), "—");
});
test("stale observations can retain their last-known numeric value", () => {
  assert.equal(metricDisplay({ value: 3660, state: "stale", unit: "seconds" }), "1h 1m");
  assert.equal(metricDisplay({ value: NaN, state: "ready", unit: "seconds" }), "—");
});
test("date selection changes all eligible sample totals without filling missing coverage", () => {
  const week = sampleSummary(7),
    month = sampleSummary(30),
    quarter = sampleSummary(90);
  assert.equal(week.days.length, 7);
  assert.equal(month.days.length, 30);
  assert.equal(quarter.days.length, 30);
  assert.equal(quarter.seconds, month.seconds);
  assert.ok(month.seconds > week.seconds);
  assert.equal(week.days[0]?.date, "2026-10-11");
  assert.equal(week.days.at(-1)?.date, "2026-10-17");
  assert.equal(quarter.coverageDays, 30);
  assert.equal(quarter.range, 90);
});
test("sample periods are deterministic, UTC parseable, and distinct by day", () => {
  assert.equal(new Set(codingDays.map((d) => d.date)).size, 30);
  assert.equal(new Set(contributionDays.map((d) => d.date)).size, 182);
  assert.equal(contributionDays.at(-1)?.date, "2026-10-17");
  assert.ok(codingDays.every((d) => d.seconds >= 0 && Number.isFinite(Date.parse(d.date))));
});
test("production review mode is off unless explicitly enabled", () => {
  assert.equal(reviewEnabled({ NODE_ENV: "production" }), false);
  assert.equal(reviewEnabled({ NODE_ENV: "production", DEVPULSE_REVIEW_MODE: "true" }), false);
  assert.equal(reviewEnabled({ NODE_ENV: "production", DEVPULSE_REVIEW_MODE: "1" }), true);
  assert.equal(reviewEnabled({ NODE_ENV: "development" }), true);
});
test("owner deny boundary is unconditional and has no client supplied identity bypass", () => {
  assert.equal(OWNER_DENIAL.error, "unauthenticated");
  const source = readFileSync("apps/web/src/app/api/owner/[[...path]]/route.ts", "utf8");
  assert.match(source, /status:\s*401/);
  assert.match(source, /no-store/);
  for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
    assert.match(source, new RegExp(`deny as ${method}`));
});
test("reference screenshots are not used as website assets", () => {
  for (const path of [
    "apps/web/src/components/public-portfolio.tsx",
    "apps/web/src/components/dashboard.tsx",
  ]) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /video_\d+s|satriabahari|SatriaAxel/);
  }
});
function luminance(hex: string) {
  const rgb = hex
    .match(/[a-f\d]{2}/gi)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rgb[0]! + 0.7152 * rgb[1]! + 0.0722 * rgb[2]!;
}
test("text tokens meet WCAG AA contrast on supported dark surfaces", () => {
  const tokens = readFileSync("packages/ui/tokens.css", "utf8");
  const token = (key: string) => tokens.match(new RegExp(`--${key}:\\s*(#[a-f0-9]{6})`))![1]!;
  for (const foreground of ["text", "muted", "subtle", "accent", "warning", "danger", "info"]) {
    for (const background of ["background", "surface", "surface-raised"]) {
      const a = luminance(token(foreground)),
        b = luminance(token(background));
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      assert.ok(ratio >= 4.5, `${foreground} on ${background}: ${ratio.toFixed(2)}`);
    }
  }
  assert.ok((luminance(token("accent")) + 0.05) / (luminance(token("accent-ink")) + 0.05) >= 4.5);
});
