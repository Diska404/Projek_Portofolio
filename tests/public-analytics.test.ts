import { test } from "node:test";
import assert from "node:assert/strict";
import { analyticsContent } from "../apps/web/src/lib/analytics-content";
import {
  publicObservationText,
  uniqueCommitCount,
  publicationCounts,
  type Publication,
  type PublicObservation,
} from "../packages/contracts/src/public-analytics";

test("public account projections enforce the owner's two audience policies", () => {
  assert.deepEqual(
    analyticsContent("personal").githubAccounts.map((a) => a.login),
    ["Diska404", "RaizeiID"],
  );
  const creator = analyticsContent("creator");
  assert.deepEqual(creator.githubAccounts, [
    { login: "RaizeiID", href: "https://github.com/RaizeiID" },
  ]);
  assert.doesNotMatch(
    JSON.stringify(creator),
    /Diska404|college-work|Profil pribadi|3100|WakaTime/,
  );
});
test("public unconnected projections publish neither fabricated zeros nor observation dates", () => {
  for (const audience of ["personal", "creator"] as const) {
    const model = analyticsContent(audience);
    for (const metric of [...model.primary, ...model.secondary]) {
      assert.equal(metric.value, null);
      assert.equal(metric.observedAt, null);
      assert.equal(publicObservationText(metric, metric.unit), "—");
    }
  }
});
test("verified zero differs from unknown, invalid, partial and failed observations", () => {
  const complete: PublicObservation = {
    value: 0,
    state: "ready",
    coverage: "complete",
    observedAt: "2026-10-17T00:00:00Z",
  };
  assert.equal(publicObservationText(complete, "count"), "0");
  for (const patch of [
    { value: null },
    { value: -1 },
    { value: NaN },
    { value: Infinity },
    { coverage: "partial" as const },
    { coverage: "none" as const },
    { state: "error" as const },
    { state: "not_connected" as const },
  ]) {
    assert.equal(publicObservationText({ ...complete, ...patch }, "count"), "—");
  }
  assert.equal(publicObservationText({ ...complete, value: 3661 }, "seconds"), "1j 1m");
});
test("combined accounts deduplicate repository and SHA, retaining different repositories", () => {
  assert.equal(
    uniqueCommitCount([
      { repositoryId: "repo-1", sha: "abc" },
      { repositoryId: "repo-1", sha: "abc" },
      { repositoryId: "repo-2", sha: "abc" },
      { repositoryId: "repo-1", sha: "def" },
    ]),
    3,
  );
});
const publication = (patch: Partial<Publication>): Publication => ({
  id: "item",
  kind: "video",
  occurredAt: "2026-10-16T18:00:00Z",
  verified: true,
  ...patch,
});
test("live replay is never counted twice or classified by arrival order", () => {
  const records = [publication({ kind: "video" }), publication({ kind: "completed_live" })];
  assert.deepEqual(publicationCounts(records), {
    video: 0,
    completed_live: 1,
    post: 0,
    activeDays: 1,
  });
  assert.deepEqual(publicationCounts(records.toReversed()), publicationCounts(records));
});
test("unknown, ongoing and scheduled broadcasts do not become normal uploads", () => {
  for (const kind of ["unknown", "ongoing_live", "scheduled_live"] as const) {
    assert.deepEqual(publicationCounts([publication({}), publication({ kind })]), {
      video: 0,
      completed_live: 0,
      post: 0,
      activeDays: 0,
    });
  }
});
test("publication days use Jakarta dates and only verified dated records", () => {
  const records = [
    publication({}),
    publication({ id: "second", occurredAt: "2026-10-17T12:00:00Z" }),
    publication({ kind: "post" }),
    publication({ id: "unverified", kind: "post", verified: false }),
    publication({ id: "invalid-date", occurredAt: "bad" }),
    publication({ id: "ambiguous", occurredAt: "2026-10-17T12:00:00" }),
  ];
  assert.deepEqual(publicationCounts(records), {
    video: 2,
    completed_live: 0,
    post: 1,
    activeDays: 1,
  });
});
