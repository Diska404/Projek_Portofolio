import { test } from "node:test";
import assert from "node:assert/strict";
import {
  summarizeWork,
  summarizeAI,
  steamDeltaMinutes,
  timestamp,
  type WorkSession,
  type AIObservation,
  type ProjectPolicy,
  type SteamSnapshot,
} from "../packages/contracts/src/activity-ledger";
import { ledgerContent } from "../apps/web/src/lib/ledger-content";

const window = { start: "2026-10-17T00:00:00+07:00", end: "2026-10-18T00:00:00+07:00" };
const policies: ProjectPolicy[] = [
  {
    projectId: "community",
    audiences: ["personal", "creator"],
    publicProgrammingLanguages: ["TypeScript"],
  },
  { projectId: "campus", audiences: ["personal"], publicProgrammingLanguages: ["TypeScript"] },
];
const session = (patch: Partial<WorkSession> = {}): WorkSession => ({
  connector: "editor",
  accountAlias: "owner",
  externalId: "a",
  revision: 1,
  projectId: "community",
  kind: "translation",
  provenance: "automatic",
  startedAt: "2026-10-17T09:00:00+07:00",
  endedAt: "2026-10-17T09:45:00+07:00",
  active: true,
  approvedFor: ["personal", "creator"],
  language: { domain: "natural", name: "Bahasa Indonesia" },
  privateNote: "PRIVATE_NOTE_CANARY",
  ...patch,
});
const work = (records: WorkSession[]) => summarizeWork(records, policies, "personal", window);

test("work union records translation before any GitHub publication without adding overlaps twice", () => {
  const result = work([
    session(),
    session({
      externalId: "b",
      connector: "journal",
      provenance: "owner_journal",
      startedAt: "2026-10-17T09:15:00+07:00",
    }),
  ]);
  assert.equal(result.automaticSeconds, 45 * 60);
  assert.equal(result.declaredSeconds, 30 * 60);
  assert.equal(result.overlapSeconds, 30 * 60);
  assert.equal(result.observedSeconds, 45 * 60);
  assert.equal(result.sessionCount, 2);
  assert.equal(result.activeDays, 1);
  assert.equal(result.coverage, "observed_only");
});
test("global work duration unions overlapping projects rather than summing project totals", () => {
  const first = session(),
    second = session({
      externalId: "b",
      projectId: "campus",
      startedAt: "2026-10-17T09:15:00+07:00",
      endedAt: "2026-10-17T10:00:00+07:00",
    });
  assert.equal(work([first, second]).observedSeconds, 3600);
  assert.equal(work([first]).observedSeconds + work([second]).observedSeconds, 5400);
  assert.equal(work([first, second]).activeProjects, 2);
});
test("work clips to a requested period before counting observed days or seconds", () => {
  const result = summarizeWork([session()], policies, "personal", {
    start: "2026-10-17T09:15:00+07:00",
    end: "2026-10-17T09:30:00+07:00",
  });
  assert.equal(result.observedSeconds, 15 * 60);
  assert.equal(result.activeDays, 1);
  assert.equal(
    work([session({ startedAt: "2026-10-16T01:00:00Z", endedAt: "2026-10-16T02:00:00Z" })])
      .activeDays,
    0,
  );
});
test("daily summaries split Jakarta midnight and exclude the half-open end boundary", () => {
  const result = summarizeWork(
    [session({ startedAt: "2026-10-17T16:45:00Z", endedAt: "2026-10-17T17:15:00Z" })],
    policies,
    "creator",
    { start: "2026-10-17T00:00:00+07:00", end: "2026-10-19T00:00:00+07:00" },
  );
  assert.deepEqual(
    result.daily.map((day) => [day.date, day.observedSeconds]),
    [
      ["2026-10-17", 900],
      ["2026-10-18", 900],
    ],
  );
  assert.equal(
    work([
      session({ startedAt: "2026-10-17T23:45:00+07:00", endedAt: "2026-10-18T00:00:00+07:00" }),
    ]).activeDays,
    1,
  );
});
test("retries, journal corrections and tombstones never resurrect an old duration", () => {
  const original = session(),
    corrected = session({ revision: 2, endedAt: "2026-10-17T09:15:00+07:00" });
  assert.equal(work([original, original]).sessionCount, 1);
  assert.equal(work([original, corrected, corrected]).observedSeconds, 900);
  assert.equal(
    work([original, corrected, session({ revision: 3, deleted: true })]).observedSeconds,
    0,
  );
  assert.equal(work([original, session({ revision: 2, approvedFor: [] })]).sessionCount, 0);
});
test("same-revision conflicts fail closed independent of order; source namespaces remain distinct", () => {
  const conflict = session({ endedAt: "2026-10-17T10:00:00+07:00" });
  assert.equal(work([session(), conflict]).sessionCount, 0);
  assert.equal(work([conflict, session()]).sessionCount, 0);
  assert.equal(work([session(), session({ accountAlias: "second" })]).sessionCount, 2);
  assert.equal(work([session(), session({ accountAlias: "second" })]).observedSeconds, 2700);
});
test("public daily projection requires both record and project approval and drops private metadata", () => {
  const result = summarizeWork(
    [
      session(),
      session({ externalId: "private", projectId: "campus" }),
      session({ externalId: "unapproved", approvedFor: [] }),
    ],
    policies,
    "creator",
    window,
  );
  assert.equal(result.sessionCount, 1);
  assert.doesNotMatch(
    JSON.stringify(result),
    /PRIVATE_NOTE_CANARY|accountAlias|externalId|projectId|startedAt|endedAt|campus|owner/,
  );
  assert.ok(result.daily.every((day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date)));
});
test("programming languages require explicit domain and project field approval", () => {
  const result = work([
    session(),
    session({ externalId: "code", language: { domain: "programming", name: "TypeScript" } }),
    session({
      externalId: "secret",
      language: { domain: "programming", name: "PRIVATE_LANGUAGE" },
    }),
  ]);
  assert.deepEqual(result.programmingLanguages, ["TypeScript"]);
  assert.ok(!JSON.stringify(result).includes("Bahasa Indonesia"));
});
test("inactive, incomplete, publication and runtime records cannot become work duration", () => {
  const invalid = [
    session({ active: false }),
    session({ endedAt: "" }),
    session({ endedAt: "2026-10-17T08:00:00+07:00" }),
    session({ endedAt: "2026-10-19T09:00:00+07:00" }),
    session({ kind: "push" as WorkSession["kind"] }),
    session({ kind: "runtime_loaded" as WorkSession["kind"] }),
    session({ provenance: "file_mtime" as WorkSession["provenance"] }),
  ];
  for (const record of invalid) assert.equal(work([record]).observedSeconds, 0);
});
test("timestamp validation rejects ambiguous dates, normalized invalid days and unbounded windows", () => {
  for (const value of [
    "2026-02-30T12:00:00Z",
    "2026-10-17T24:00:00Z",
    "2026-10-17T12:00:00",
    "1999-01-01T00:00:00Z",
    "bad",
  ])
    assert.equal(timestamp(value), null);
  assert.notEqual(timestamp("2024-02-29T12:00:00+07:00"), null);
  assert.throws(() =>
    summarizeWork([], policies, "personal", { start: window.end, end: window.start }),
  );
  assert.throws(() =>
    summarizeWork([], policies, "personal", { start: window.start, end: "2028-10-18T00:00:00Z" }),
  );
});

const ai = (patch: Partial<AIObservation> = {}): AIObservation => ({
  connector: "runtime",
  accountAlias: "owner",
  externalId: "inference-1",
  revision: 1,
  kind: "inference",
  successful: true,
  occurredAt: "2026-10-17T09:00:00+07:00",
  provider: "example-provider",
  canonicalModelId: "example/model-version",
  variant: "Q4",
  inputTokens: 10,
  outputTokens: 20,
  approvedFor: ["personal"],
  ...patch,
});
test("AI usage requires successful observed inference; loaded or failed models are not used models", () => {
  const result = summarizeAI(
    [
      ai(),
      ai(),
      ai({ externalId: "loaded", kind: "runtime_loaded" }),
      ai({ externalId: "failed", successful: false }),
      ai({ externalId: "hidden", approvedFor: [] }),
    ],
    "personal",
    window,
  );
  assert.equal(result.observedRequests, 1);
  assert.equal(result.identifiedModels, 1);
  assert.equal(result.outputTokens, 20);
});
test("AI variants and hosting providers do not inflate canonical model breadth", () => {
  const result = summarizeAI(
    [
      ai(),
      ai({ externalId: "inference-2", variant: "Q8", provider: "another-host" }),
      ai({ externalId: "unknown", canonicalModelId: null, inputTokens: null }),
    ],
    "personal",
    window,
  );
  assert.equal(result.observedRequests, 3);
  assert.equal(result.identifiedModels, 1);
  assert.equal(result.unidentifiedRequests, 1);
  assert.equal(result.inputTokens, null);
  assert.equal(result.outputTokens, 60);
});
test("AI token gaps, negative values and revision revocation do not become complete observations", () => {
  assert.equal(summarizeAI([ai({ outputTokens: -1 })], "personal", window).outputTokens, null);
  assert.equal(summarizeAI([ai({ inputTokens: null })], "personal", window).inputTokens, null);
  assert.equal(
    summarizeAI([ai(), ai({ revision: 2, deleted: true })], "personal", window).observedRequests,
    0,
  );
  assert.equal(summarizeAI([ai()], "creator", window).observedRequests, 0);
});
const snapshot = (patch: Partial<SteamSnapshot> = {}): SteamSnapshot => ({
  appId: 100,
  collectedAt: "2026-10-17T00:00:00Z",
  lifetimeMinutes: 100,
  visible: true,
  ...patch,
});
test("Steam deltas describe an observed counter interval and preserve verified zero", () => {
  const after = snapshot({ collectedAt: "2026-10-18T00:00:00Z", lifetimeMinutes: 160 });
  assert.equal(steamDeltaMinutes(snapshot(), after), 60);
  assert.equal(steamDeltaMinutes(snapshot(), { ...after, lifetimeMinutes: 100 }), 0);
});
test("Steam private/missing/reset/mismatched/out-of-order snapshots stay unavailable", () => {
  const after = snapshot({ collectedAt: "2026-10-18T00:00:00Z", lifetimeMinutes: 160 });
  for (const patch of [
    { visible: false },
    { appId: 101 },
    { lifetimeMinutes: null },
    { lifetimeMinutes: 90 },
    { lifetimeMinutes: NaN },
    { collectedAt: "2026-10-16T00:00:00Z" },
  ])
    assert.equal(steamDeltaMinutes(snapshot(), { ...after, ...patch }), null);
});
test("creator ledger projection cannot serialize personal projects or identities", () => {
  const creator = ledgerContent("creator");
  assert.doesNotMatch(JSON.stringify(creator), /Diska404|college-work|Kampus|Profil pribadi|3100/);
  assert.ok(creator.projects.some((item) => item.id === "gfl2-localization"));
  assert.equal(ledgerContent("personal").projects.length, 3);
});
